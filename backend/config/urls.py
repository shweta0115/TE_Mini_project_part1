from django.contrib import admin
from django.urls import path
from api import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health", views.health),
    path("api/auth/register", views.register),
    path("api/auth/login", views.login),
    path("api/auth/logout", views.logout),
    path("api/bootstrap", views.bootstrap),
    path("api/xp", views.xp),
    path("api/topics/<str:topic_id>/progress", views.topic_progress),
    path("api/notifications/<str:notification_id>", views.notification),
    path("api/notifications/read-all", views.read_all_notifications),
    path("api/profile", views.profile),
    path("api/quiz/submit", views.quiz_submit),
    path("api/challenge/submit", views.challenge_submit),
]
