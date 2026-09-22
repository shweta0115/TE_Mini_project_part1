from django.db import migrations, models


DEFAULT_LEVELS = [
    (1, "Python Beginner", 0, 99),
    (2, "Code Learner", 100, 249),
    (3, "Python Explorer", 250, 499),
    (4, "Code Adventurer", 500, 849),
    (5, "Python Builder", 850, 1299),
    (6, "Python Developer", 1300, 1999),
    (7, "Code Master", 2000, 2999),
    (8, "Python Expert", 3000, 4499),
    (9, "Python Pro", 4500, 6499),
    (10, "Python Master", 6500, 9999),
]


def seed_levels(apps, schema_editor):
    Level = apps.get_model("api", "Level")
    for level, title, min_xp, max_xp in DEFAULT_LEVELS:
        Level.objects.update_or_create(
            level=level,
            defaults={"title": title, "min_xp": min_xp, "max_xp": max_xp, "order": level},
        )


def unseed_levels(apps, schema_editor):
    Level = apps.get_model("api", "Level")
    Level.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_learningstate"),
    ]

    operations = [
        migrations.CreateModel(
            name="Level",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("level", models.PositiveIntegerField(unique=True)),
                ("title", models.CharField(max_length=80)),
                ("min_xp", models.PositiveIntegerField()),
                ("max_xp", models.PositiveIntegerField()),
                ("order", models.PositiveIntegerField(default=0)),
            ],
            options={"ordering": ["level"]},
        ),
        migrations.RunPython(seed_levels, unseed_levels),
    ]