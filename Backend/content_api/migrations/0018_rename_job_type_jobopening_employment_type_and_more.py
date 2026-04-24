from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('content_api', '0017_adminuser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobopening',
            name='short_description',
            field=models.TextField(blank=True, help_text='Brief summary for card view (max 300 chars)', max_length=300, null=True),
        ),
        migrations.AlterField(
            model_name='jobopening',
            name='full_description',
            field=models.TextField(blank=True, help_text='Detailed description for the job page', null=True),
        ),
        migrations.AlterField(
            model_name='jobopening',
            name='location',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='jobopening',
            name='application_email',
            field=models.EmailField(blank=True, help_text='Email for receiving applications', max_length=254, null=True),
        ),
        migrations.AlterField(
            model_name='jobopening',
            name='slug',
            field=models.SlugField(blank=True, unique=True),
        ),
        migrations.AlterField(
            model_name='jobopening',
            name='qualifications',
            field=models.JSONField(blank=True, default=list, help_text='List of requirements/qualifications'),
        ),
        migrations.AlterField(
            model_name='jobopening',
            name='reporting_to',
            field=models.CharField(blank=True, help_text='Who this role reports to', max_length=100),
        ),
    ]
