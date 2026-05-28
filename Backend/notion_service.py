import os
from typing import Any

from dotenv import load_dotenv
from notion_client import Client

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


def _require_notion() -> Client:
    if not _notion:
        raise RuntimeError(
            "Missing Notion token. Set NOTION_API_KEY (recommended) or NOTION_TOKEN."
        )
    return _notion


def _rich_text_to_markdown(rich_text: list[dict[str, Any]] | None) -> str:
    if not rich_text:
        return ""

    parts: list[str] = []
    for piece in rich_text:
        text = piece.get("plain_text") or ""

        annotations = piece.get("annotations") or {}
        if annotations.get("code"):
            text = f"`{text}`"
        if annotations.get("bold"):
            text = f"**{text}**"
        if annotations.get("italic"):
            text = f"_{text}_"
        if annotations.get("strikethrough"):
            text = f"~~{text}~~"
        if annotations.get("underline"):
            # Markdown has no universal underline syntax; HTML is the most compatible.
            text = f"<u>{text}</u>"

        href = piece.get("href")
        if not href:
            href = ((piece.get("text") or {}).get("link") or {}).get("url")
        if href:
            text = f"[{text}]({href})"

        parts.append(text)

    return "".join(parts)


def _list_item_prefix(block_type: str, index: int) -> str:
    if block_type == "numbered_list_item":
        return f"{index}. "
    return "- "


def _block_to_markdown(block: dict[str, Any], indent: int = 0, list_index: int = 1) -> str:
    block_type = block.get("type")
    data = (block.get(block_type) or {}) if isinstance(block_type, str) else {}
    prefix = " " * indent

    if block_type == "paragraph":
        text = _rich_text_to_markdown(data.get("rich_text"))
        return f"{prefix}{text}\n" if text else "\n"

    if block_type == "heading_1":
        return f"{prefix}# {_rich_text_to_markdown(data.get('rich_text'))}\n\n"
    if block_type == "heading_2":
        return f"{prefix}## {_rich_text_to_markdown(data.get('rich_text'))}\n\n"
    if block_type == "heading_3":
        return f"{prefix}### {_rich_text_to_markdown(data.get('rich_text'))}\n\n"

    if block_type in ("bulleted_list_item", "numbered_list_item"):
        line = f"{prefix}{_list_item_prefix(block_type, list_index)}{_rich_text_to_markdown(data.get('rich_text'))}\n"
        return line

    if block_type == "to_do":
        checked = "x" if data.get("checked") else " "
        return f"{prefix}- [{checked}] {_rich_text_to_markdown(data.get('rich_text'))}\n"

    if block_type == "quote":
        text = _rich_text_to_markdown(data.get("rich_text"))
        return f"{prefix}> {text}\n\n"

    if block_type == "code":
        language = data.get("language") or ""
        code_text = _rich_text_to_markdown(data.get("rich_text"))
        # rich_text_to_markdown will wrap inline code; undo that for code blocks by using plain_text join.
        code_text = "".join([(p.get("plain_text") or "") for p in (data.get("rich_text") or [])])
        return f"{prefix}```{language}\n{code_text}\n```\n\n"

    if block_type == "divider":
        return f"{prefix}---\n\n"

    if block_type == "image":
        image = data
        url = None
        if image.get("type") == "external":
            url = (image.get("external") or {}).get("url")
        elif image.get("type") == "file":
            url = (image.get("file") or {}).get("url")
        if url:
            caption = _rich_text_to_markdown(image.get("caption"))
            alt = caption or "image"
            return f"{prefix}![{alt}]({url})\n\n"
        return ""

    if block_type == "bookmark":
        url = data.get("url")
        if url:
            return f"{prefix}{url}\n\n"
        return ""

    if block_type == "equation":
        expr = data.get("expression") or ""
        return f"{prefix}$${expr}$$\n\n" if expr else ""

    # Fallback: best-effort text extraction.
    if isinstance(data, dict) and data.get("rich_text"):
        text = _rich_text_to_markdown(data.get("rich_text"))
        return f"{prefix}{text}\n\n" if text else ""

    return ""


def _fetch_all_block_children(notion: Client, block_id: str) -> list[dict[str, Any]]:
    blocks: list[dict[str, Any]] = []
    start_cursor: str | None = None

    while True:
        resp = notion.blocks.children.list(block_id=block_id, start_cursor=start_cursor)
        results = resp.get("results") or []
        for b in results:
            if isinstance(b, dict):
                blocks.append(b)
        if not resp.get("has_more"):
            break
        start_cursor = resp.get("next_cursor")
        if not start_cursor:
            break

    return blocks


def _blocks_to_markdown(notion: Client, blocks: list[dict[str, Any]], indent: int = 0) -> str:
    md_parts: list[str] = []
    numbered_index = 1
    in_numbered = False

    for block in blocks:
        block_type = block.get("type")

        # Reset numbering when leaving a numbered list sequence.
        if block_type != "numbered_list_item":
            numbered_index = 1
            in_numbered = False

        list_index = 1
        if block_type == "numbered_list_item":
            if in_numbered:
                numbered_index += 1
            else:
                in_numbered = True
                numbered_index = 1
            list_index = numbered_index

        md_parts.append(_block_to_markdown(block, indent=indent, list_index=list_index))

        if block.get("has_children"):
            children = _fetch_all_block_children(notion, block.get("id"))
            if children:
                # List items nest more naturally when indented.
                child_indent = indent + (2 if block_type in ("bulleted_list_item", "numbered_list_item", "to_do") else 0)
                md_parts.append(_blocks_to_markdown(notion, children, indent=child_indent))

    return "".join(md_parts)


def _page_to_markdown(notion: Client, page_id: str) -> str:
    top_blocks = _fetch_all_block_children(notion, page_id)
    return _blocks_to_markdown(notion, top_blocks).strip() + "\n"


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


def _extract_file_url(file_obj: dict[str, Any] | None) -> str | None:
    if not file_obj or not isinstance(file_obj, dict):
        return None
    file_type = file_obj.get("type")
    if file_type == "external":
        return (file_obj.get("external") or {}).get("url")
    if file_type == "file":
        return (file_obj.get("file") or {}).get("url")
    return None


def _extract_cover_image(page: dict[str, Any], props: dict[str, Any]) -> str | None:
    """Extract a cover image URL from common Notion shapes.

    Supports:
    - A database property named "CoverImage" (type: url)
    - A database property named "CoverImage" (type: files)
    - The page's built-in cover field (page.cover)

    Note: Notion "file" URLs can be time-limited.
    """

    cover_prop = props.get("CoverImage") or {}
    if isinstance(cover_prop, dict):
        prop_type = cover_prop.get("type")
        if prop_type == "url":
            url = cover_prop.get("url")
            if isinstance(url, str) and url:
                return url

        if prop_type == "files":
            files = cover_prop.get("files") or []
            if isinstance(files, list) and files:
                first = files[0] if isinstance(files[0], dict) else None
                url = _extract_file_url(first)
                if url:
                    return url

    cover_field = page.get("cover")
    if isinstance(cover_field, dict):
        url = _extract_file_url(cover_field)
        if url:
            return url

    return None

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
        cover_image = _extract_cover_image(page, props)
        tags_multi = (props.get("Tags") or {}).get("multi_select") or []

        blogs.append(
            {
                "id": page.get("id"),
                "slug": get_property_value(props.get("Slug")) or page.get("id"),
                "title": get_property_value(props.get("Title")),
                "excerpt": get_property_value(props.get("Excerpt")),
                "publishedAt": published_at,
                "tags": [t.get("name") for t in tags_multi if isinstance(t, dict)],
                "coverImage": cover_image or "/images/blog-placeholder.svg",
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
    page_id = page.get("id")
    if not page_id:
        return None
    content = _page_to_markdown(notion, page_id)
    
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
        "coverImage": _extract_cover_image(page, props) or "/images/blog-placeholder.svg",
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
