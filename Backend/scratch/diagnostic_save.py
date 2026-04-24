import sys
import os
import django

# Add current directory to path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'linq_backend.settings')
django.setup()

from content_api.models import JobOpening

def test_save(label, **fields):
    print(f"\n--- Testing: {label} ---")
    try:
        job = JobOpening(**fields)
        job.save()
        print(f"SUCCESS: Saved ID {job.id} with slug {job.slug}")
    except Exception as e:
        print(f"FAILED: {e}")

# Get a base set of valid fields
base = {
    'title': 'Diagnostic Job',
    'short_description': 'Short',
    'full_description': 'Full',
    'location': 'Remote',
    'application_email': 'test@example.com'
}

# Test Case 1: Empty title (should fail validation usually, but let's see DB)
# test_save("Empty Title", short_description='S', full_description='F', location='L', application_email='a@b.com')

# Test Case 2: Missing short_description (It's required in model, but what if user leaves it blank?)
test_save("Missing Short Description", title='Job Without Short', full_description='Full', location='Remote', application_email='a@b.com')

# Test Case 3: Missing reporting_to (It has blank=True, should be fine)
test_save("Blank Reporting To", **{**base, 'title': 'Job with blank report', 'reporting_to': ''})

# Test Case 4: Missing qualifications (JSONField with default=list, blank=True)
test_save("Blank Qualifications", **{**base, 'title': 'Job with blank qual', 'qualifications': ''})

# Test Case 5: Passing non-list to qualifications
test_save("String Qualifications", **{**base, 'title': 'Job with string qual', 'qualifications': 'this is a string, not a list'})
