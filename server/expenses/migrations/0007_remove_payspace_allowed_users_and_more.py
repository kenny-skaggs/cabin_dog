# Generated by Django 4.1.5 on 2023-02-13 22:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('expenses', '0006_rename_pay_spaces_person_pay_space_expenseuser'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='payspace',
            name='allowed_users',
        ),
        migrations.AlterField(
            model_name='expenseuser',
            name='pay_space',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='expense_users', to='expenses.payspace'),
        ),
        migrations.AlterField(
            model_name='expenseuser',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='expense_user', to=settings.AUTH_USER_MODEL),
        ),
    ]