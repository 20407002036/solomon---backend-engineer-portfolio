import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_PROJECTS_DATABASE_ID!;

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
      sorts: [{ property: 'Title', direction: 'ascending' }],
    });

    const projects = response.results.map((page: any) => {
      const properties = page.properties;
      
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || '',
        category: properties.Category?.select?.name || 'Backend',
        description: properties.Description?.rich_text?.[0]?.plain_text || '',
        problem: properties.Problem?.rich_text?.[0]?.plain_text || '',
        approach: properties.Approach?.rich_text?.[0]?.plain_text || '',
        impact: properties.Impact?.rich_text?.[0]?.plain_text || '',
        tech: properties.Tech?.multi_select?.map((t: any) => t.name) || [],
        imageUrl: properties.ImageUrl?.url || '/images/project-placeholder.jpg',
        githubUrl: properties.GithubUrl?.url || null,
      };
    });

    return new Response(JSON.stringify(projects), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching projects from Notion:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch projects' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
