from django.contrib import admin

from .models import LearnerProfile, LearningEvent, LearningState, Level, UserNotification, XpTransaction


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ("level", "title", "min_xp", "max_xp", "order")
    ordering = ("level",)


@admin.register(LearnerProfile)
class LearnerProfileAdmin(admin.ModelAdmin):
    list_display = ("username", "name", "email", "xp", "streak", "experience", "created_at")
    search_fields = ("username", "name", "email")
    list_filter = ("experience",)


@admin.register(LearningState)
class LearningStateAdmin(admin.ModelAdmin):
    list_display = ("profile", "updated_at")
    readonly_fields = ("updated_at",)


admin.site.register(XpTransaction)
admin.site.register(UserNotification)
admin.site.register(LearningEvent)