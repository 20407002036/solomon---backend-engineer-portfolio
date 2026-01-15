import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_BLOGS_DATABASE_ID!;

// Helper to convert Notion blocks to HTML
function blocksToHtml(blocks: any[]): string {
  return blocks
    .map((block) => {
      const type = block.type;
      
      switch (type) {
        case 'paragraph':
          const text = block.paragraph?.rich_text?.map((t: any) => formatRichText(t)).join('') || '';
          return text ? `<p>${text}</p>` : '';
          
        case 'heading_1':
          return `<h1>${block.heading_1?.rich_text?.map((t: any) => t.plain_text).join('') || ''}</h1>`;
          
        case 'heading_2':
          return `<h2>${block.heading_2?.rich_text?.map((t: any) => t.plain_text).join('') || ''}</h2>`;
          
        case 'heading_3':
          return `<h3>${block.heading_3?.rich_text?.map((t: any) => t.plain_text).join('') || ''}</h3>`;
          
        case 'bulleted_list_item':
          return `<li>${block.bulleted_list_item?.rich_text?.map((t: any) => formatRichText(t)).join('') || ''}</li>`;
          
        case 'numbered_list_item':
          return `<li>${block.numbered_list_item?.rich_text?.map((t: any) => formatRichText(t)).join('') || ''}</li>`;
          
        case 'code':
          const code = block.code?.rich_text?.map((t: any) => t.plain_text).join('') || '';
          const language = block.code?.language || 'plaintext';
          return `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
          
        case 'quote':
          return `<blockquote>${block.quote?.rich_text?.map((t: any) => formatRichText(t)).join('') || ''}</blockquote>`;
          
        case 'divider':
          return '<hr />';
          
        case 'image':
          const imageUrl = block.image?.file?.url || block.image?.external?.url || '';
          const caption = block.image?.caption?.[0]?.plain_text || '';
          return `<figure><img src="${imageUrl}" alt="${caption}" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
          
        default:
          return '';
      }
    })
    .join('\n');
}

function formatRichText(richText: any): string {
  let text = richText.plain_text || '';
  
  if (richText.annotations?.bold) text = `<strong>${text}</strong>`;
  if (richText.annotations?.italic) text = `<em>${text}</em>`;
  if (richText.annotations?.strikethrough) text = `<del>${text}</del>`;
  if (richText.annotations?.code) text = `<code>${text}</code>`;
  if (richText.href) text = `<a href="${richText.href}" target="_blank" rel="noopener">${text}</a>`;
  
  return text;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(req.url);
  const slug = url.pathname.split('/').pop();

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Find the page by slug
    const response = await (notion.databases as any).query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Slug',
        rich_text: { equals: slug },
      },
    });

    if (response.results.length === 0) {
      return new Response(JSON.stringify({ error: 'Blog post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const page: any = response.results[0];
    const properties = page.properties;

    // Get page content (blocks)
    const blocksResponse = await (notion.blocks as any).children.list({
      block_id: page.id,
      page_size: 100,
    });

    const content = blocksToHtml(blocksResponse.results);

    const blog = {
      id: page.id,
      slug: properties.Slug?.rich_text?.[0]?.plain_text || page.id,
      title: properties.Title?.title?.[0]?.plain_text || '',
      excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || '',
      publishedAt: properties.PublishedAt?.date?.start || new Date().toISOString(),
      tags: properties.Tags?.multi_select?.map((t: any) => t.name) || [],
      coverImage: properties.CoverImage?.url || '/images/blog-placeholder.jpg',
      readingTime: properties.ReadingTime?.number || 5,
      featured: properties.Featured?.checkbox || false,
      content,
    };

    return new Response(JSON.stringify(blog), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching blog from Notion:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch blog post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
