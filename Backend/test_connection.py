import requests


def test_notion():
    """Optional: validates Notion token + database access.

    Requires env vars:
      - NOTION_API_KEY
      - NOTION_PROJECTS_DATABASE_ID
      - NOTION_BLOGS_DATABASE_ID
    """
    import os

    from notion_client import Client

    token = os.environ.get("NOTION_API_KEY") or os.environ.get("NOTION_TOKEN")
    projects_db = os.environ.get("NOTION_PROJECTS_DATABASE_ID")
    blogs_db = os.environ.get("NOTION_BLOGS_DATABASE_ID")

    if not token:
        print("Skipping Notion test: missing NOTION_API_KEY/NOTION_TOKEN")
        return
    if not projects_db or not blogs_db:
        print("Skipping Notion test: missing database IDs")
        return

    notion = Client(auth=token)

    print("\nTesting Notion auth (users.me)...")
    me = notion.users.me()
    print(f"Authenticated as: {me.get('name') or me.get('id')}")

    print("\nTesting Projects DB retrieve...")
    notion.databases.retrieve(database_id=projects_db)
    print("Projects DB: OK")

    print("\nTesting Blogs DB retrieve...")
    notion.databases.retrieve(database_id=blogs_db)
    print("Blogs DB: OK")

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
    test_notion()
