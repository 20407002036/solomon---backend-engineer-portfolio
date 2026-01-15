import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_BLOGS_DATABASE_ID!;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await (notion.databases as any).query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Published',
        checkbox: { equals: true },
      },
      sorts: [{ property: 'PublishedAt', direction: 'descending' }],
    });

    const blogs = response.results.map((page: any) => {
      const properties = page.properties;
      
      return {
        id: page.id,
        slug: properties.Slug?.rich_text?.[0]?.plain_text || page.id,
        title: properties.Title?.title?.[0]?.plain_text || '',
        excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || '',
        publishedAt: properties.PublishedAt?.date?.start || new Date().toISOString(),
        tags: properties.Tags?.multi_select?.map((t: any) => t.name) || [],
        coverImage: properties.CoverImage?.url || '/images/blog-placeholder.jpg',
        readingTime: properties.ReadingTime?.number || 5,
        featured: properties.Featured?.checkbox || false,
      };
    });

    return new Response(JSON.stringify(blogs), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching blogs from Notion:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch blogs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
