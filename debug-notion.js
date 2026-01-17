// Debug script to test Notion API connection
// Run with: node debug-notion.js

import { Client } from '@notionhq/client';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const PROJECTS_DATABASE_ID = process.env.NOTION_PROJECTS_DATABASE_ID;
const BLOGS_DATABASE_ID = process.env.NOTION_BLOGS_DATABASE_ID;

console.log('=== Notion API Debug Script ===\n');
console.log('Environment Variables:');
console.log('  NOTION_API_KEY:', process.env.NOTION_API_KEY ? `${process.env.NOTION_API_KEY.substring(0, 10)}...` : 'NOT SET');
console.log('  NOTION_PROJECTS_DATABASE_ID:', PROJECTS_DATABASE_ID || 'NOT SET');
console.log('  NOTION_BLOGS_DATABASE_ID:', BLOGS_DATABASE_ID || 'NOT SET');
console.log('');

async function testProjects() {
  console.log('--- Testing Projects Database ---');
  
  if (!PROJECTS_DATABASE_ID) {
    console.log('  ❌ NOTION_PROJECTS_DATABASE_ID is not set');
    return;
  }

  try {
    const response = await notion.databases.query({
      database_id: PROJECTS_DATABASE_ID,
      page_size: 3, // Limit to 3 for testing
    });

    console.log(`  ✅ Successfully fetched ${response.results.length} projects`);
    console.log('  Total results available:', response.has_more ? 'More available' : response.results.length);
    
    if (response.results.length > 0) {
      console.log('\n  Sample Project Data:');
      const firstProject = response.results[0];
      console.log('  - Page ID:', firstProject.id);
      console.log('  - Properties:', Object.keys(firstProject.properties).join(', '));
      
      // Print each property name and type
      console.log('\n  Property Types:');
      for (const [name, prop] of Object.entries(firstProject.properties)) {
        console.log(`    - ${name}: ${prop.type}`);
      }
      
      console.log('\n  Full first project data:');
      console.log(JSON.stringify(firstProject.properties, null, 2));
    }
  } catch (error) {
    console.log('  ❌ Error fetching projects:', error.message);
    if (error.code) console.log('  Error code:', error.code);
  }
}

async function testBlogs() {
  console.log('\n--- Testing Blogs Database ---');
  
  if (!BLOGS_DATABASE_ID || BLOGS_DATABASE_ID === 'your_blogs_database_id_here') {
    console.log('  ❌ NOTION_BLOGS_DATABASE_ID is not set or still has placeholder value');
    return;
  }

  try {
    const response = await notion.databases.query({
      database_id: BLOGS_DATABASE_ID,
      page_size: 3, // Limit to 3 for testing
    });

    console.log(`  ✅ Successfully fetched ${response.results.length} blogs`);
    console.log('  Total results available:', response.has_more ? 'More available' : response.results.length);
    
    if (response.results.length > 0) {
      console.log('\n  Sample Blog Data:');
      const firstBlog = response.results[0];
      console.log('  - Page ID:', firstBlog.id);
      console.log('  - Properties:', Object.keys(firstBlog.properties).join(', '));
      
      // Print each property name and type
      console.log('\n  Property Types:');
      for (const [name, prop] of Object.entries(firstBlog.properties)) {
        console.log(`    - ${name}: ${prop.type}`);
      }
      
      console.log('\n  Full first blog data:');
      console.log(JSON.stringify(firstBlog.properties, null, 2));
    }
  } catch (error) {
    console.log('  ❌ Error fetching blogs:', error.message);
    if (error.code) console.log('  Error code:', error.code);
  }
}

async function main() {
  await testProjects();
  await testBlogs();
  console.log('\n=== Debug Complete ===');
}

main().catch(console.error);
