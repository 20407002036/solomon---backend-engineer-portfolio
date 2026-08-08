#!/usr/bin/env python3
"""Sync GitHub repos into the Notion projects database.

Runs as a nightly GitHub Actions job. Only repos tagged with the
``portfolio`` topic are synced; remove the tag and the repo stops
being updated.

Fields pulled from GitHub (auto-synced): Name/Title, Description,
GithubUrl, Category, Tech, Stars, UpdatedAt.
Curated fields are NEVER overwritten: Problem, Approach, Impact.
"""

import argparse
import os
import sys
from datetime import datetime, timezone

import requests
from dotenv import load_dotenv

load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env.local"), override=False)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"), override=False)

GITHUB_USERNAME = os.environ.get("GITHUB_USERNAME", "20407002036")
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_PAT")
NOTION_TOKEN = (
    os.environ.get("NOTION_ACCESS_KEY")
    or os.environ.get("NOTION_API_KEY")
    or os.environ.get("NOTION_TOKEN")
)
PROJECTS_DATABASE_ID = os.environ.get("NOTION_PROJECTS_DATABASE_ID")

INCLUDE_TOPIC = os.environ.get("GITHUB_INCLUDE_TOPIC", "portfolio")

CATEGORY_BY_TOPIC = {
    "backend": "Backend",
    "fullstack": "Fullstack",
    "iot": "IoT",
    "ai-ml": "AI/ML",
    "ml": "AI/ML",
    "iot-backend": "IoT Backend",
    "iot_backend": "IoT Backend",
}

CATEGORY_BY_LANGUAGE = {
    "Python": "Backend",
    "Go": "Backend",
    "Rust": "Backend",
    "Java": "Backend",
    "Kotlin": "Backend",
    "C": "Backend",
    "C++": "Backend",
    "C#": "Backend",
    "Shell": "Backend",
    "JavaScript": "Fullstack",
    "TypeScript": "Fullstack",
    "HTML": "Fullstack",
    "CSS": "Fullstack",
    "Jupyter Notebook": "AI/ML",
}


def log(msg: str) -> None:
    print(f"[sync] {msg}", flush=True)


def fetch_repos() -> list[dict]:
    headers = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    else:
        log("No GITHUB_TOKEN set; using unauthenticated API (60 req/hr, fine for public repos)")

    repos: list[dict] = []
    url = f"https://api.github.com/users/{GITHUB_USERNAME}/repos?per_page=100&sort=updated"
    while url:
        resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, list):
            repos.extend(data)
        url = None
        link = resp.headers.get("Link", "")
        for part in link.split(","):
            if 'rel="next"' in part:
                url = part.split(";")[0].strip("<> ")
                break
    return repos


def included(repo: dict, forced: set[str]) -> bool:
    if repo.get("fork"):
        return False
    if repo.get("archived"):
        return False
    name = repo.get("name")
    if name in forced:
        return True
    topics = {t.lower() for t in (repo.get("topics") or [])}
    return INCLUDE_TOPIC.lower() in topics


def resolve_category(repo: dict) -> str:
    topics = {t.lower() for t in (repo.get("topics") or [])}
    for topic, category in CATEGORY_BY_TOPIC.items():
        if topic in topics:
            return category
    language = repo.get("language")
    if language:
        return CATEGORY_BY_LANGUAGE.get(language, "Backend")
    return "Backend"


def repo_to_properties(repo: dict) -> dict:
    name = repo.get("name") or ""
    now = datetime.now(timezone.utc).isoformat()
    pushed_at = repo.get("pushed_at")
    description = repo.get("description") or ""

    category = resolve_category(repo)
    topics = sorted({t for t in (repo.get("topics") or []) if t.lower() != INCLUDE_TOPIC.lower()})
    tech = list(dict.fromkeys([t for t in [repo.get("language")] + topics if t]))

    properties = {
        "Name": {"title": [{"text": {"content": name}}]},
        "Title": {"rich_text": [{"text": {"content": name}}]},
        "Description": {"rich_text": [{"text": {"content": description}}]},
        "Category": {"select": {"name": category}},
        "Tech": {"multi_select": [{"name": t} for t in tech]},
        "GithubUrl": {"url": repo.get("html_url")},
        "Stars": {"number": repo.get("stargazers_count", 0)},
        "UpdatedAt": {"date": {"start": pushed_at}} if pushed_at else {"date": None},
        "GitHubFullName": {"rich_text": [{"text": {"content": repo.get("full_name") or ""}}]},
        "LastSynchedAt": {"date": {"start": now}},
    }

    homepage = repo.get("homepage")
    if homepage:
        properties["ImageUrl"] = {"url": homepage}
    else:
        properties["ImageUrl"] = {"url": None}

    return properties


def get_notion():
    if not NOTION_TOKEN:
        raise RuntimeError("Missing Notion token (NOTION_ACCESS_KEY / NOTION_API_KEY / NOTION_TOKEN)")
    from notion_client import Client

    return Client(auth=NOTION_TOKEN)


def database_data_source_id(notion) -> str:
    if not PROJECTS_DATABASE_ID:
        raise RuntimeError("Missing NOTION_PROJECTS_DATABASE_ID")
    database = notion.databases.retrieve(database_id=PROJECTS_DATABASE_ID)
    data_sources = database.get("data_sources") or []
    if isinstance(data_sources, list) and data_sources:
        first = data_sources[0]
        if isinstance(first, dict) and first.get("id"):
            return first["id"]
        if isinstance(first, str):
            return first
    data_source = database.get("data_source")
    if isinstance(data_source, dict) and data_source.get("id"):
        return data_source["id"]
    raise RuntimeError("Unable to determine Notion data source id for the projects database")


def query_all_pages(notion, data_source_id: str) -> list[dict]:
    pages: list[dict] = []
    start_cursor = None
    while True:
        query = {"data_source_id": data_source_id, "page_size": 100}
        if start_cursor:
            query["start_cursor"] = start_cursor
        resp = notion.data_sources.query(**query)
        for p in resp.get("results", []):
            if isinstance(p, dict) and p.get("object") == "page":
                pages.append(p)
        if not resp.get("has_more"):
            break
        start_cursor = resp.get("next_cursor")
        if not start_cursor:
            break
    return pages


def rich_text_value(prop) -> str:
    if not prop:
        return ""
    values = prop.get("rich_text") or prop.get("title") or []
    return "".join(t.get("plain_text", "") for t in values if isinstance(t, dict))


def build_existing_map(pages: list[dict]) -> dict[str, str]:
    existing: dict[str, str] = {}
    for page in pages:
        props = page.get("properties") or {}
        full_name = rich_text_value(props.get("GitHubFullName"))
        if full_name:
            existing[full_name] = page.get("id")
    return existing


def sync(dry_run: bool, forced: set[str]) -> None:
    log(f"Fetching repos for {GITHUB_USERNAME}...")
    repos = fetch_repos()
    log(f"Found {len(repos)} repos")

    selected = [r for r in repos if included(r, forced)]
    log(f"{len(selected)} repos selected (topic '{INCLUDE_TOPIC}', skipping forks/archived)")
    for r in selected:
        log(f"  + {r['full_name']}")

    if not selected:
        log(f"Nothing to sync. Tag repos with the '{INCLUDE_TOPIC}' topic to publish them.")
        return

    notion = get_notion()
    data_source_id = database_data_source_id(notion)
    log("Building existing-page map (dedup by GitHubFullName)...")
    existing = build_existing_map(query_all_pages(notion, data_source_id))
    log(f"Existing pages keyed by GitHubFullName: {len(existing)}")

    created = updated = skipped = 0
    for repo in selected:
        full_name = repo.get("full_name") or repo.get("name")
        properties = repo_to_properties(repo)
        page_id = existing.get(full_name)
        action = "UPDATE" if page_id else "CREATE"
        if dry_run:
            log(f"  [{action}] {full_name}")
            continue
        if page_id:
            notion.pages.update(page_id=page_id, properties=properties)
            updated += 1
        else:
            notion.pages.create(parent={"database_id": PROJECTS_DATABASE_ID}, properties=properties)
            created += 1

    if dry_run:
        log("DRY RUN - no changes written. Re-run without --dry-run to apply.")
    else:
        log(f"Done: created={created} updated={updated} skipped={skipped}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync GitHub repos to the Notion projects database.")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without writing to Notion")
    parser.add_argument("--force-repo", action="append", default=[], metavar="NAME",
                        help="Include a specific repo regardless of topic (for testing)")
    args = parser.parse_args()

    try:
        sync(dry_run=args.dry_run, forced=set(args.force_repo))
    except Exception as exc:  # noqa: BLE001 - report and fail the workflow visibly
        log(f"ERROR: {exc}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
