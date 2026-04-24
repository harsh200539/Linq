import requests

try:
    response = requests.get('http://harsh17042005.pythonanywhere.com//api/job-openings/')
    if response.status_code == 200:
        data = response.json()
        print("API Response:")
        if data:
            for item in data:
                print(f"ID: {item.get('id')}, Title: {item.get('title')}, Description: {item.get('description')}")
        else:
            print("No data returned from API.")
    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")
