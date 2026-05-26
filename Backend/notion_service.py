import os
from notion_client import Client
from notion2markdown.converter import NotionToMarkdown
from dotenv import load_dotenv

load_dotenv()

notion = Client(auth=os.environ.get("NOTION_API_KEY"))
markdown_converter = NotionToMarkdown(notion)

PROJECTS_DATABASE_ID = os.environ.get("NOTION_PROJECTS_DATABASE_ID")
BLOGS_DATABASE_ID = os.environ.get("NOTION_BLOGS_DATABASE_ID")

def get_projects():
    if not PROJECTS_DATABASE_ID:
        return []
    
    response = notion.databases.query(
        database_id=PROJECTS_DATABASE_ID,
        sorts=[{"property": "Title", "direction": "ascending"}]
    )
    
    projects = []
    for page in response.get("results", []):
        props = page.get("properties", {})
        
        projects.append({
            "id": page.get("id"),
            "title": get_property_value(props.get("Title")),
            "category": props.get("Category", {}).get("select", {}).get("name", "Backend"),
            "description": get_property_value(props.get("Description")),
            "problem": get_property_value(props.get("Problem")),
            "approach": get_property_value(props.get("Approach")),
            "impact": get_property_value(props.get("Impact")),
            "tech": [t.get("name") for t in props.get("Tech", {}).get("multi_select", [])],
            "imageUrl": props.get("ImageUrl", {}).get("url") or "/images/project-placeholder.jpg",
            "githubUrl": props.get("GithubUrl", {}).get("url")
        })
    
    return projects

def get_blogs():
    if not BLOGS_DATABASE_ID:
        return []
    
    response = notion.databases.query(
        database_id=BLOGS_DATABASE_ID,
        filter={
            "property": "Published",
            "checkbox": {"equals": True}
        },
        sorts=[{"property": "PublishedAt", "direction": "descending"}]
    )
    
    blogs = []
    for page in response.get("results", []):
        props = page.get("properties", {})
        
        blogs.append({
            "id": page.get("id"),
            "slug": get_property_value(props.get("Slug")) or page.get("id"),
            "title": get_property_value(props.get("Title")),
            "excerpt": get_property_value(props.get("Excerpt")),
            "publishedAt": props.get("PublishedAt", {}).get("date", {}).get("start"),
            "tags": [t.get("name") for t in props.get("Tags", {}).get("multi_select", [])],
            "coverImage": props.get("CoverImage", {}).get("url") or "/images/blog-placeholder.jpg",
            "readingTime": props.get("ReadingTime", {}).get("number") or 5,
            "featured": props.get("Featured", {}).get("checkbox") or False
        })
    
    return blogs

def get_blog_post(slug):
    if not BLOGS_DATABASE_ID:
        return None
    
    # Find page by slug
    response = notion.databases.query(
        database_id=BLOGS_DATABASE_ID,
        filter={
            "property": "Slug",
            "rich_text": {"equals": slug}
        }
    )
    
    results = response.get("results", [])
    if not results:
        return None
    
    page = results[0]
    props = page.get("properties", {})
    
    # Get content as markdown
    content = markdown_converter.convert(page.get("id"))
    
    blog_post = {
        "id": page.get("id"),
        "slug": get_property_value(props.get("Slug")) or page.get("id"),
        "title": get_property_value(props.get("Title")),
        "excerpt": get_property_value(props.get("Excerpt")),
        "publishedAt": props.get("PublishedAt", {}).get("date", {}).get("start"),
        "tags": [t.get("name") for t in props.get("Tags", {}).get("multi_select", [])],
        "coverImage": props.get("CoverImage", {}).get("url") or "/images/blog-placeholder.jpg",
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
