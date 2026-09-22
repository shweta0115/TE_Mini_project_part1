import json
import os
import uuid
from functools import wraps
from datetime import date, datetime, timedelta
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import LearnerProfile, LearningEvent, LearningState, Level, UserNotification, XpTransaction


DEFAULT_LEVELS = [
    {"level": 1, "title": "Python Beginner", "minXp": 0, "maxXp": 99},
    {"level": 2, "title": "Code Learner", "minXp": 100, "maxXp": 249},
    {"level": 3, "title": "Python Explorer", "minXp": 250, "maxXp": 499},
    {"level": 4, "title": "Code Adventurer", "minXp": 500, "maxXp": 849},
    {"level": 5, "title": "Python Builder", "minXp": 850, "maxXp": 1299},
    {"level": 6, "title": "Python Developer", "minXp": 1300, "maxXp": 1999},
    {"level": 7, "title": "Code Master", "minXp": 2000, "maxXp": 2999},
    {"level": 8, "title": "Python Expert", "minXp": 3000, "maxXp": 4499},
    {"level": 9, "title": "Python Pro", "minXp": 4500, "maxXp": 6499},
    {"level": 10, "title": "Python Master", "minXp": 6500, "maxXp": 9999},
]


def get_levels():
    """Return the levelling table. Levels live in the database so developers can
    tune XP thresholds from the admin; fall back to defaults if the table is empty."""
    try:
        rows = list(Level.objects.all())
    except Exception:
        return DEFAULT_LEVELS
    if not rows:
        return DEFAULT_LEVELS
    return [row.as_dict() for row in rows]


def cors(response):
    response["Access-Control-Allow-Origin"] = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173").split(",")[0]
    response["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
    response["Access-Control-Allow-Methods"] = "GET, POST, PATCH, OPTIONS"
    return response


def json_response(payload, status=200):
    return cors(JsonResponse(payload, status=status, safe=False))


def body(request):
    try:
        return json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return {}


def supabase_request(path, method="GET", payload=None, token=None):
    if not settings.SUPABASE_URL:
        raise RuntimeError("SUPABASE_URL is not configured")
    key = settings.SUPABASE_SECRET_KEY or settings.SUPABASE_PUBLISHABLE_KEY
    headers = {"apikey": key, "Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = Request(
        f"{settings.SUPABASE_URL}/auth/v1/{path}",
        data=json.dumps(payload).encode() if payload is not None else None,
        method=method,
        headers=headers,
    )
    with urlopen(request, timeout=15) as response:
        return json.loads(response.read().decode())


def supabase_error(error):
    if isinstance(error, HTTPError):
        try:
            detail = json.loads(error.read().decode())
        except (json.JSONDecodeError, UnicodeDecodeError):
            detail = {"message": error.reason}
        return detail.get("msg") or detail.get("message") or "Supabase request failed"
    return str(error)


def current_profile(request):
    authorization = request.headers.get("Authorization", "")
    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        return None, None, "Authentication required"
    if settings.DEV_AUTH_BYPASS and token.startswith("dev:"):
        profile = LearnerProfile.objects.filter(supabase_user_id=token.removeprefix("dev:")).first()
        if profile:
            return profile, token, None
        return None, None, "Development user not found"
    try:
        identity = supabase_request("user", token=token)
    except Exception as error:
        return None, None, supabase_error(error)
    user_id = identity.get("id")
    if not user_id:
        return None, None, "Invalid Supabase session"
    profile, _ = LearnerProfile.objects.get_or_create(
        supabase_user_id=user_id,
        defaults={
            "name": identity.get("user_metadata", {}).get("name") or identity.get("email", "Learner").split("@")[0],
            "username": identity.get("user_metadata", {}).get("username") or f"learner_{user_id[:8]}",
            "email": identity.get("email", ""),
        },
    )
    return profile, token, None


def requires_auth(view):
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        if request.method == "OPTIONS":
            return json_response({})
        profile, token, error = current_profile(request)
        if error:
            return json_response({"error": error}, 401)
        return view(request, profile, token, *args, **kwargs)
    return wrapped


def learning_state(profile):
    state, _ = LearningState.objects.get_or_create(profile=profile)
    return state


def apply_xp(profile, amount, description):
    if amount == 0:
        return None
    if amount < 0 and profile.xp < abs(amount):
        raise ValueError("Not enough XP")
    profile.xp += amount
    if amount > 0:
        today = date.today()
        if profile.last_activity_date == today:
            pass
        elif profile.last_activity_date == today - timedelta(days=1):
            profile.streak += 1
        else:
            profile.streak = 1
        profile.last_activity_date = today
    profile.save(update_fields=["xp", "streak", "last_activity_date", "updated_at"])
    tx = XpTransaction.objects.create(
        profile=profile,
        amount=amount,
        description=description,
        kind="earned" if amount > 0 else "spent",
    )
    if amount > 0:
        UserNotification.objects.create(profile=profile, title=f"+{amount} XP Earned", message=description, kind="xp")
    return tx


def serialize_learning_state(profile):
    state = learning_state(profile)
    return {
        "topicProgress": state.topic_progress,
        "quizAttempts": state.quiz_attempts,
        "challengeProgress": state.challenge_progress,
        "achievementProgress": state.achievement_progress,
        "activity": serialize_activity(profile),
        "analytics": serialize_analytics(profile),
        "leaderboard": serialize_leaderboard(profile),
    }


def serialize_activity(profile):
    items = []
    for event in profile.events.order_by("-created_at")[:30]:
        payload = event.payload or {}
        title = payload.get("title") or payload.get("description") or event.event_type.title()
        if event.event_type == "topic":
            title = f"Completed: {title}"
        elif event.event_type == "quiz":
            title = f"Completed Quiz: {title}"
        elif event.event_type == "challenge":
            title = f"Completed Challenge: {title}"
        elif event.event_type == "hint":
            title = f"Used Hint: {title}"
        items.append({
            "id": f"event-{event.id}",
            "type": event.event_type if event.event_type in {"lesson", "quiz", "challenge", "achievement", "unlock", "streak"} else "lesson",
            "title": title,
            "xp": payload.get("xp"),
            "createdAt": event.created_at.isoformat(),
        })
    if items:
        return items
    return [
        {
            "id": f"tx-{tx.id}",
            "type": "lesson" if tx.amount > 0 else "unlock",
            "title": tx.description,
            "xp": tx.amount if tx.amount > 0 else None,
            "createdAt": tx.created_at.isoformat(),
        }
        for tx in profile.xp_transactions.order_by("-created_at")[:30]
    ]


def serialize_daily_activity(profile, days=105):
    """Return per-day XP totals for the last ``days`` days (heatmap + streak)."""
    today = date.today()
    start = today - timedelta(days=days - 1)
    tallies = {}
    for tx in profile.xp_transactions.filter(created_at__date__gte=start, amount__gt=0):
        key = tx.created_at.date().isoformat()
        tallies[key] = tallies.get(key, 0) + tx.amount
    return [
        {"date": (start + timedelta(days=offset)).isoformat(),
         "xp": tallies.get((start + timedelta(days=offset)).isoformat(), 0)}
        for offset in range(days)
    ]


def serialize_analytics(profile):
    transactions = list(profile.xp_transactions.order_by("created_at"))
    weekday = {day: {"day": day, "xp": 0, "lessons": 0, "challenges": 0} for day in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
    xp_by_week = []
    weekly_totals = {}
    # Only tally the current week so "Weekly Activity" reflects this week, not history.
    current_isocalendar = date.today().isocalendar()
    for tx in transactions:
        if tx.amount <= 0:
            continue
        created = tx.created_at
        year, week, _ = created.isocalendar()
        if (year, week) == (current_isocalendar[0], current_isocalendar[1]):
            day = created.strftime("%a")
            if day in weekday:
                weekday[day]["xp"] += tx.amount
                if "Challenge" in tx.description:
                    weekday[day]["challenges"] += 1
                else:
                    weekday[day]["lessons"] += 1
        key = f"{year}-W{week:02d}"
        weekly_totals[key] = weekly_totals.get(key, 0) + tx.amount
    for key in sorted(weekly_totals)[-6:]:
        xp_by_week.append({"week": key.replace("-", " "), "xp": weekly_totals[key]})
    state = learning_state(profile)
    topic_mastery = [
        {"topic": topic_id.upper(), "mastery": values.get("progress", 0)}
        for topic_id, values in state.topic_progress.items()
    ][:8]
    quiz_accuracy = [
        {"topic": values.get("topicTitle", quiz_id), "accuracy": values.get("bestAccuracy", 0)}
        for quiz_id, values in state.quiz_attempts.items()
    ]
    return {
        "xpByWeek": xp_by_week or [{"week": "This Week", "xp": profile.xp}],
        "accuracyByTopic": quiz_accuracy or [{"topic": "Python", "accuracy": 0}],
        "challengesByDifficulty": [],
        "weeklyActivity": list(weekday.values()),
        "topicMastery": topic_mastery or [{"topic": "Python", "mastery": 0}],
        "dailyActivity": serialize_daily_activity(profile),
    }


def serialize_leaderboard(current_profile):
    levels = get_levels()
    profiles = LearnerProfile.objects.order_by("-xp", "-streak", "created_at")[:25]
    return [
        {
            "rank": index + 1,
            "userId": profile.supabase_user_id,
            "name": profile.name,
            "username": profile.username,
            "level": level_for_xp(profile.xp, levels)["level"],
            "levelTitle": level_for_xp(profile.xp, levels)["title"],
            "xp": profile.xp,
            "challengesCompleted": len(learning_state(profile).challenge_progress),
            "achievementsCount": len([a for a in learning_state(profile).achievement_progress.values() if a.get("earned")]),
            "streak": profile.streak,
            "isCurrentUser": profile.pk == current_profile.pk,
        }
        for index, profile in enumerate(profiles)
    ]


def level_for_xp(xp, levels=None):
    levels = levels or get_levels()
    selected = levels[0]
    for level in levels:
        if xp >= level["minXp"]:
            selected = level
    return selected


def serialize_profile(profile):
    levels = get_levels()
    level_data = level_for_xp(profile.xp, levels)
    level = level_data["level"]
    title = level_data["title"]
    # Next level is the first level whose minXp is above the current one.
    next_level = next((item for item in levels if item["minXp"] > level_data["minXp"]), None)
    next_xp = next_level["minXp"] if next_level else profile.xp
    state = learning_state(profile)
    completed_topics = len([item for item in state.topic_progress.values() if item.get("status") == "completed"])
    completed_quizzes = len([item for item in state.quiz_attempts.values() if item.get("completed")])
    completed_challenges = len([item for item in state.challenge_progress.values() if item.get("status") == "completed"])
    accuracies = [item.get("bestAccuracy", 0) for item in state.quiz_attempts.values() if item.get("completed")]
    quiz_accuracy = round(sum(accuracies) / len(accuracies)) if accuracies else 0
    return {
        "id": profile.supabase_user_id, "name": profile.name, "username": profile.username,
        "email": profile.email, "level": level, "levelTitle": title, "xp": profile.xp,
        "nextLevelXp": next_xp, "streak": profile.streak, "joinedAt": profile.created_at.date().isoformat(),
        "experience": profile.experience, "learningGoal": profile.learning_goal,
        "stats": {
            "lessonsCompleted": completed_topics,
            "quizzesCompleted": completed_quizzes,
            "challengesCompleted": completed_challenges,
            "quizAccuracy": quiz_accuracy,
            "learningHours": max(completed_topics + completed_quizzes + completed_challenges, 0),
            "totalXpEarned": profile.xp,
        },
    }


def serialize_tx(tx):
    return {"id": str(tx.id), "amount": tx.amount, "description": tx.description, "type": tx.kind, "createdAt": tx.created_at.isoformat()}


def serialize_notification(item):
    return {"id": str(item.id), "title": item.title, "message": item.message, "type": item.kind, "read": item.read, "createdAt": item.created_at.isoformat()}


@csrf_exempt
def health(request):
    return json_response({
        "ok": True,
        "database": settings.DATABASES["default"]["ENGINE"].rsplit(".", 1)[-1],
        "supabaseConfigured": bool(settings.SUPABASE_URL),
        "devAuthBypass": settings.DEV_AUTH_BYPASS,
    })


@csrf_exempt
def register(request):
    if request.method == "OPTIONS":
        return json_response({})
    values = body(request)
    required = [values.get("name"), values.get("username"), values.get("email"), values.get("password")]
    if not all(required):
        return json_response({"error": "name, username, email and password are required"}, 400)
    if settings.DEV_AUTH_BYPASS:
        if LearnerProfile.objects.filter(email=values["email"]).exists():
            return json_response({"error": "A user with this email already exists"}, 409)
        if LearnerProfile.objects.filter(username=values["username"]).exists():
            return json_response({"error": "That username is already taken"}, 409)
        profile = LearnerProfile.objects.create(
            supabase_user_id=str(uuid.uuid4()),
            name=values["name"],
            username=values["username"],
            email=values["email"],
        )
        return json_response({
            "accessToken": f"dev:{profile.supabase_user_id}",
            "user": serialize_profile(profile),
            "devAuth": True,
        }, 201)
    try:
        result = supabase_request("signup", "POST", {
            "email": values["email"],
            "password": values["password"],
            "data": {"name": values["name"], "username": values["username"]},
            "options": {"email_redirect_to": settings.FRONTEND_URL},
        })
    except Exception as error:
        return json_response({"error": supabase_error(error)}, 400)
    return json_response({"session": result.get("session"), "user": result.get("user"), "needsEmailConfirmation": not bool(result.get("session"))}, 201)


@csrf_exempt
def login(request):
    if request.method == "OPTIONS":
        return json_response({})
    values = body(request)
    if not values.get("email") or not values.get("password"):
        return json_response({"error": "email and password are required"}, 400)
    if settings.DEV_AUTH_BYPASS:
        profile = LearnerProfile.objects.filter(email=values["email"]).first()
        if not profile:
            return json_response({"error": "User not found"}, 401)
        return json_response({"accessToken": f"dev:{profile.supabase_user_id}", "user": serialize_profile(profile), "devAuth": True})
    try:
        result = supabase_request("token?grant_type=password", "POST", {"email": values["email"], "password": values["password"]})
    except Exception as error:
        return json_response({"error": supabase_error(error)}, 401)
    return json_response({"accessToken": result.get("access_token"), "refreshToken": result.get("refresh_token"), "user": result.get("user")})


@csrf_exempt
def logout(request):
    return json_response({"ok": True})


@requires_auth
def bootstrap(request, profile, token):
    return json_response({
        "user": serialize_profile(profile),
        "xpTransactions": [serialize_tx(item) for item in profile.xp_transactions.order_by("-created_at")[:50]],
        "notifications": [serialize_notification(item) for item in profile.notifications.order_by("-created_at")[:50]],
        "learningState": serialize_learning_state(profile),
        "levels": get_levels(),
    })


@csrf_exempt
@requires_auth
def xp(request, profile, token):
    values = body(request)
    amount = int(values.get("amount", 0))
    description = values.get("description", "Learning activity")
    if amount == 0:
        return json_response({"error": "amount must not be zero"}, 400)
    with transaction.atomic():
        profile = LearnerProfile.objects.select_for_update().get(pk=profile.pk)
        try:
            tx = apply_xp(profile, amount, description)
        except ValueError as error:
            return json_response({"error": str(error)}, 400)
        LearningEvent.objects.create(profile=profile, event_type="xp", payload={"amount": amount, "description": description})
    return json_response({"user": serialize_profile(profile), "transaction": serialize_tx(tx)})


@csrf_exempt
@requires_auth
def topic_progress(request, profile, token, topic_id):
    values = body(request)
    with transaction.atomic():
        profile = LearnerProfile.objects.select_for_update().get(pk=profile.pk)
        state = learning_state(profile)
        progress = dict(state.topic_progress)
        previous = progress.get(topic_id, {})
        next_progress = {
            **previous,
            "topicId": topic_id,
            "title": values.get("title", previous.get("title", topic_id)),
            "progress": int(values.get("progress", previous.get("progress", 0))),
            "completedSubtopics": values.get("completedSubtopics", previous.get("completedSubtopics", [])),
            "status": values.get("status", previous.get("status", "in-progress")),
            "updatedAt": datetime.utcnow().isoformat() + "Z",
        }
        tx = None
        if next_progress["status"] == "completed" and previous.get("status") != "completed":
            xp = int(values.get("xp", 0))
            tx = apply_xp(profile, xp, f"Completed: {next_progress['title']}") if xp else None
            LearningEvent.objects.create(profile=profile, event_type="lesson", reference_id=topic_id, payload={"title": next_progress["title"], "xp": xp})
        progress[topic_id] = next_progress
        state.topic_progress = progress
        state.save(update_fields=["topic_progress", "updated_at"])
    return json_response({
        "user": serialize_profile(profile),
        "topicProgress": next_progress,
        "transaction": serialize_tx(tx) if tx else None,
        "learningState": serialize_learning_state(profile),
    })


@csrf_exempt
@requires_auth
def notification(request, profile, token, notification_id):
    item = UserNotification.objects.filter(profile=profile, pk=notification_id).first()
    if not item:
        return json_response({"error": "Notification not found"}, 404)
    item.read = True
    item.save(update_fields=["read"])
    return json_response({"notification": serialize_notification(item)})


@csrf_exempt
@requires_auth
def read_all_notifications(request, profile, token):
    profile.notifications.filter(read=False).update(read=True)
    return json_response({"ok": True})


@csrf_exempt
@requires_auth
def profile(request, profile, token):
    values = body(request)
    for key, field in (("name", "name"), ("username", "username"), ("experience", "experience"), ("learningGoal", "learning_goal")):
        if values.get(key) is not None:
            setattr(profile, field, values[key])
    if values.get("settings") is not None:
        profile.settings = values["settings"]
    profile.save()
    return json_response({"user": serialize_profile(profile)})


@csrf_exempt
@requires_auth
def quiz_submit(request, profile, token):
    values = body(request)
    score = int(values.get("score", 0))
    total = max(int(values.get("total", 1)), 1)
    xp = int(values.get("xp", 0))
    quiz_id = str(values.get("quizId", ""))
    accuracy = round(score / total * 100)
    with transaction.atomic():
        profile = LearnerProfile.objects.select_for_update().get(pk=profile.pk)
        state = learning_state(profile)
        attempts = dict(state.quiz_attempts)
        previous = attempts.get(quiz_id, {})
        best_score = max(int(previous.get("bestScore", 0)), score)
        best_accuracy = max(int(previous.get("bestAccuracy", 0)), accuracy)
        attempts[quiz_id] = {
            **previous,
            "quizId": quiz_id,
            "topicId": values.get("topicId", previous.get("topicId")),
            "topicTitle": values.get("topicTitle", previous.get("topicTitle", quiz_id)),
            "completed": True,
            "bestScore": best_score,
            "bestAccuracy": best_accuracy,
            "attempts": int(previous.get("attempts", 0)) + 1,
            "lastScore": score,
            "lastTotal": total,
            "updatedAt": datetime.utcnow().isoformat() + "Z",
        }
        state.quiz_attempts = attempts
        state.save(update_fields=["quiz_attempts", "updated_at"])
        tx = apply_xp(profile, xp, f"Completed Quiz: {attempts[quiz_id]['topicTitle']}") if xp else None
        LearningEvent.objects.create(profile=profile, event_type="quiz", reference_id=quiz_id, payload={"title": attempts[quiz_id]["topicTitle"], "score": score, "total": total, "xp": xp})
    return json_response({"ok": True, "accuracy": accuracy, "user": serialize_profile(profile), "transaction": serialize_tx(tx) if tx else None, "learningState": serialize_learning_state(profile)})


@csrf_exempt
@requires_auth
def challenge_submit(request, profile, token):
    values = body(request)
    passed = bool(values.get("passed"))
    challenge_id = str(values.get("challengeId", ""))
    with transaction.atomic():
        profile = LearnerProfile.objects.select_for_update().get(pk=profile.pk)
        state = learning_state(profile)
        challenges = dict(state.challenge_progress)
        previous = challenges.get(challenge_id, {})
        already_completed = previous.get("status") == "completed"
        status = "completed" if passed else "attempted"
        challenges[challenge_id] = {
            **previous,
            "challengeId": challenge_id,
            "title": values.get("title", previous.get("title", challenge_id)),
            "status": status,
            "submissionType": values.get("submissionType", "editor"),
            "attempts": int(previous.get("attempts", 0)) + 1,
            "lastCode": values.get("code", previous.get("lastCode", "")),
            "updatedAt": datetime.utcnow().isoformat() + "Z",
        }
        state.challenge_progress = challenges
        state.save(update_fields=["challenge_progress", "updated_at"])
        xp = int(values.get("xp", 0)) if passed and not already_completed else 0
        tx = apply_xp(profile, xp, f"Completed Challenge: {challenges[challenge_id]['title']}") if xp else None
        LearningEvent.objects.create(profile=profile, event_type="challenge", reference_id=challenge_id, payload={**values, "xp": xp})
    return json_response({"ok": True, "passed": passed, "user": serialize_profile(profile), "transaction": serialize_tx(tx) if tx else None, "learningState": serialize_learning_state(profile)})
