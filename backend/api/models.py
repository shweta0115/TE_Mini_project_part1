from django.db import models

class LearnerProfile(models.Model):
    supabase_user_id = models.CharField(max_length=128, unique=True)
    name = models.CharField(max_length=120)
    username = models.CharField(max_length=80, unique=True)
    email = models.EmailField()
    experience = models.CharField(max_length=40, default="beginner")
    learning_goal = models.CharField(max_length=120, default="Improve coding skills")
    xp = models.PositiveIntegerField(default=0)
    streak = models.PositiveIntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)
    settings = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class XpTransaction(models.Model):
    profile = models.ForeignKey(LearnerProfile, on_delete=models.CASCADE, related_name="xp_transactions")
    amount = models.IntegerField()
    description = models.CharField(max_length=255)
    kind = models.CharField(max_length=20, default="earned")
    created_at = models.DateTimeField(auto_now_add=True)

class UserNotification(models.Model):
    profile = models.ForeignKey(LearnerProfile, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=160)
    message = models.TextField()
    kind = models.CharField(max_length=30, default="system")
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class LearningEvent(models.Model):
    profile = models.ForeignKey(LearnerProfile, on_delete=models.CASCADE, related_name="events")
    event_type = models.CharField(max_length=30)
    reference_id = models.CharField(max_length=128, blank=True)
    payload = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

class LearningState(models.Model):
    profile = models.OneToOneField(LearnerProfile, on_delete=models.CASCADE, related_name="learning_state")
    topic_progress = models.JSONField(default=dict)
    quiz_attempts = models.JSONField(default=dict)
    challenge_progress = models.JSONField(default=dict)
    achievement_progress = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)


class Level(models.Model):
    """Editable levelling table so developers can tune XP thresholds from the admin."""
    level = models.PositiveIntegerField(unique=True)
    title = models.CharField(max_length=80)
    min_xp = models.PositiveIntegerField()
    max_xp = models.PositiveIntegerField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["level"]

    def __str__(self):
        return f"Level {self.level}: {self.title}"

    def as_dict(self):
        return {"level": self.level, "title": self.title, "minXp": self.min_xp, "maxXp": self.max_xp}
