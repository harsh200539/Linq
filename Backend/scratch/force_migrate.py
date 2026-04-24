import sys
import os
import django

# Add current directory to path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'linq_backend.settings')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    # Delete the record for migration 0018
    cursor.execute("DELETE FROM django_migrations WHERE app='content_api' AND name LIKE '0018_%'")
    print(f"Successfully deleted {cursor.rowcount} records from django_migrations.")

print("Syncing database...")
os.system("python manage.py migrate content_api")
