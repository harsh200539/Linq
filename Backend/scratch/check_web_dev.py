import requests

try:
    response = requests.get('http://127.0.0.1:8000/api/job-openings/web-developer/')
    if response.status_code == 200:
        print("API Response for 'web-developer/':")
        print(response.json())
    else:
        print(f"FAILED: Status {response.status_code}")
except Exception as e:
    print(f"CONNECTION ERROR: {e}")
