import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_learnerprofile_last_activity_date"),
    ]

    operations = [
        migrations.CreateModel(
            name="LearningState",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("topic_progress", models.JSONField(default=dict)),
                ("quiz_attempts", models.JSONField(default=dict)),
                ("challenge_progress", models.JSONField(default=dict)),
                ("achievement_progress", models.JSONField(default=dict)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("profile", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="learning_state", to="api.learnerprofile")),
            ],
        ),
    ]
