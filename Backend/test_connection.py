import requests

def test_health():
    print("Testing /health...")
    try:
        response = requests.get("http://localhost:5000/health")
        print(f"Status: {response.status_code}, Data: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

def test_api():
    endpoints = ["/api/projects", "/api/blogs"]
    for ep in endpoints:
        print(f"\nTesting {ep}...")
        try:
            response = requests.get(f"http://localhost:5000{ep}")
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"Found {len(data)} items")
                if len(data) > 0:
                    print(f"First item: {data[0].get('title')}")
            else:
                print(f"Error: {response.text}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    print("Ensure the Flask app is running (python app.py) before running this test.\n")
    test_health()
    test_api()
