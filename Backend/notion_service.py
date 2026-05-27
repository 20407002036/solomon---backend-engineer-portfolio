import os

from dotenv import load_dotenv
from notion_client import Client
from notion2markdown import NotionExporter

load_dotenv()

# Prefer a single token for the whole workspace. One integration token can be
# shared/connected to multiple databases.
NOTION_TOKEN = (
    os.environ.get("NOTION_API_KEY")
    or os.environ.get("NOTION_TOKEN")
    or os.environ.get("NOTION_ACCESS_KEY")
)

PROJECTS_DATABASE_ID = os.environ.get("NOTION_PROJECTS_DATABASE_ID")
BLOGS_DATABASE_ID = os.environ.get("NOTION_BLOGS_DATABASE_ID")

_notion: Client | None = Client(auth=NOTION_TOKEN) if NOTION_TOKEN else None
_markdown_converter: NotionExporter | None = NotionExporter(_notion) if _notion else None


def _require_notion() -> Client:
    if not _notion:
        raise RuntimeError(
            "Missing Notion token. Set NOTION_API_KEY (recommended) or NOTION_TOKEN."
        )
    return _notion


def _require_markdown_converter() -> NotionExporter:
    if not _markdown_converter:
        raise RuntimeError(
            "Missing Notion token. Set NOTION_API_KEY (recommended) or NOTION_TOKEN."
        )
    return _markdown_converter


def _get_database_data_source_id(notion: Client, database_id: str) -> str:
    """Notion SDK v3+ queries database content through data sources.

    Given a database id, retrieve the database object and extract a data source id.
    """

    database = notion.databases.retrieve(database_id=database_id)

    # Notion's API shape has evolved; handle multiple possible fields.
    data_sources = database.get("data_sources")
    if isinstance(data_sources, list) and data_sources:
        first = data_sources[0]
        if isinstance(first, dict) and first.get("id"):
            return first["id"]
        if isinstance(first, str):
            return first

    data_source = database.get("data_source")
    if isinstance(data_source, dict) and data_source.get("id"):
        return data_source["id"]

    data_source_id = database.get("data_source_id")
    if isinstance(data_source_id, str) and data_source_id:
        return data_source_id

    raise RuntimeError(
        "Unable to determine data source id for the database. "
        "Ensure you provided a database id (not a view/page id) and that your integration has access."
    )

def get_projects():
    if not PROJECTS_DATABASE_ID:
        return []

    notion = _require_notion()
    projects_data_source_id = _get_database_data_source_id(notion, PROJECTS_DATABASE_ID)

    # print("*"*80)
    # print(projects_data_source_id)
    # print("*"*80)
    
    response = notion.data_sources.query(
        data_source_id=projects_data_source_id,
        sorts=[{"property": "Title", "direction": "ascending"}]
    )
    
    projects = []
    for page in response.get("results", []):
        # data_sources.query can return non-page objects depending on result_type;
        # defensively only process pages.
        if page.get("object") != "page":
            continue

        props = page.get("properties") or {}

        category_select = (props.get("Category") or {}).get("select") or {}
        tech_multi = (props.get("Tech") or {}).get("multi_select") or []
        image_url = (props.get("ImageUrl") or {}).get("url")
        github_url = (props.get("GithubUrl") or {}).get("url")
        
        projects.append({
            "id": page.get("id"),
            "title": get_property_value(props.get("Title")),
            "category": category_select.get("name") or "Backend",
            "description": get_property_value(props.get("Description")),
            "problem": get_property_value(props.get("Problem")),
            "approach": get_property_value(props.get("Approach")),
            "impact": get_property_value(props.get("Impact")),
            "tech": [t.get("name") for t in tech_multi if isinstance(t, dict)],
            "imageUrl": image_url or "/images/project-placeholder.jpg",
            "githubUrl": github_url,
        })
    
    return projects

def get_blogs():
    if not BLOGS_DATABASE_ID:
        return []

    notion = _require_notion()
    blogs_data_source_id = _get_database_data_source_id(notion, BLOGS_DATABASE_ID)
    response = notion.data_sources.query(
        data_source_id=blogs_data_source_id,
        filter={
            "property": "Published",
            "checkbox": {"equals": True},
        },
        sorts=[{"property": "PublishedAt", "direction": "descending"}],
    )

    blogs = []
    for page in response.get("results", []):
        if page.get("object") != "page":
            continue

        props = page.get("properties") or {}

        published_at = ((props.get("PublishedAt") or {}).get("date") or {}).get("start")
        cover_image = (props.get("CoverImage") or {}).get("url")
        tags_multi = (props.get("Tags") or {}).get("multi_select") or []

        blogs.append(
            {
                "id": page.get("id"),
                "slug": get_property_value(props.get("Slug")) or page.get("id"),
                "title": get_property_value(props.get("Title")),
                "excerpt": get_property_value(props.get("Excerpt")),
                "publishedAt": published_at,
                "tags": [t.get("name") for t in tags_multi if isinstance(t, dict)],
                "coverImage": cover_image or "/images/blog-placeholder.jpg",
                "readingTime": props.get("ReadingTime", {}).get("number") or 5,
                "featured": props.get("Featured", {}).get("checkbox") or False,
            }
        )

    return blogs

def get_blog_post(slug):
    if not BLOGS_DATABASE_ID:
        return None

    notion = _require_notion()
    # Find page by slug
    blogs_data_source_id = _get_database_data_source_id(notion, BLOGS_DATABASE_ID)
    response = notion.data_sources.query(
        data_source_id=blogs_data_source_id,
        filter={
            "property": "Slug",
            "rich_text": {"equals": slug}
        }
    )
    
    results = response.get("results", [])
    if not results:
        return None
    
    page = results[0]
    if page.get("object") != "page":
        return None

    props = page.get("properties", {})
    
    # Get content as markdown
    content = _require_markdown_converter().convert(page.get("id"))
    
    blog_post = {
        "id": page.get("id"),
        "slug": get_property_value(props.get("Slug")) or page.get("id"),
        "title": get_property_value(props.get("Title")),
        "excerpt": get_property_value(props.get("Excerpt")),
        "publishedAt": ((props.get("PublishedAt") or {}).get("date") or {}).get("start"),
        "tags": [
            t.get("name")
            for t in ((props.get("Tags") or {}).get("multi_select") or [])
            if isinstance(t, dict)
        ],
        "coverImage": (props.get("CoverImage") or {}).get("url")
        or "/images/blog-placeholder.jpg",
        "readingTime": props.get("ReadingTime", {}).get("number") or 5,
        "featured": props.get("Featured", {}).get("checkbox") or False,
        "content": content
    }
    
    return blog_post

def get_property_value(prop):
    if not prop:
        return ""
    
    prop_type = prop.get("type")
    
    if prop_type == "title":
        titles = prop.get("title", [])
        return "".join([t.get("plain_text", "") for t in titles])
    elif prop_type == "rich_text":
        texts = prop.get("rich_text", [])
        return "".join([t.get("plain_text", "") for t in texts])
    elif prop_type == "url":
        return prop.get("url", "")
    elif prop_type == "number":
        return prop.get("number")
    elif prop_type == "date":
        return prop.get("date", {}).get("start")
    elif prop_type == "checkbox":
        return prop.get("checkbox")
    
    return ""
