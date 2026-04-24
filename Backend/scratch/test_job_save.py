import sys
import os
import django

# Add current directory to path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'linq_backend.settings')
django.setup()

from content_api.models import JobOpening

try:
    job = JobOpening(
        title="Test Job 1",
        short_description="Short desc",
        full_description="Full desc",
        location="Remote",
        application_email="hr@example.com"
    )
    job.save()
    print(f"Successfully saved: {job.title} with slug {job.slug}")
    
    # Try another with same title to test uniqueness
    job2 = JobOpening(
        title="Test Job 1",
        short_description="Short desc 2",
        full_description="Full desc 2",
        location="Remote",
        application_email="hr@example.com"
    )
    job2.save()
    print(f"Successfully saved duplicate title: {job2.title} with slug {job2.slug}")
    
except Exception as e:
    print(f"Error saving job: {e}")
    import traceback
    traceback.print_exc()
