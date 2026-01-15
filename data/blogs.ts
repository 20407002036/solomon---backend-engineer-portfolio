import { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "building-scalable-apis-with-flask",
    title: "Building Scalable APIs with Flask: Lessons from Production",
    excerpt: "Key architectural patterns and best practices I've learned while building production-ready Flask APIs that handle thousands of requests.",
    publishedAt: "2026-01-10",
    tags: ["Python", "Flask", "API Design", "Backend"],
    coverImage: "https://picsum.photos/seed/flask-api/800/400",
    readingTime: 8,
    featured: true,
    content: `# Building Scalable APIs with Flask: Lessons from Production

When I first started building APIs with Flask, I made every mistake in the book. Over time, I've developed a set of patterns that consistently lead to maintainable, scalable applications.

## 1. Project Structure Matters

A flat file structure works for small projects, but as your API grows, you'll want something more organized:

\`\`\`
app/
├── api/
│   ├── v1/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── schemas.py
├── models/
├── services/
├── utils/
└── config.py
\`\`\`

## 2. Use Blueprints for Modularity

Blueprints let you organize your routes into logical groups:

\`\`\`python
from flask import Blueprint

api_v1 = Blueprint('api_v1', __name__, url_prefix='/api/v1')

@api_v1.route('/users')
def get_users():
    return {"users": []}
\`\`\`

## 3. Implement Proper Error Handling

Don't let exceptions bubble up to users. Create custom error handlers:

\`\`\`python
@app.errorhandler(ValidationError)
def handle_validation_error(e):
    return {"error": str(e)}, 400
\`\`\`

## 4. Database Connection Pooling

SQLAlchemy's connection pooling is crucial for production:

\`\`\`python
app.config['SQLALCHEMY_POOL_SIZE'] = 10
app.config['SQLALCHEMY_POOL_RECYCLE'] = 3600
\`\`\`

## Key Takeaways

- Start with a scalable structure from day one
- Use blueprints to keep code organized
- Always handle errors gracefully
- Configure your database for production loads

These patterns have served me well across multiple production applications.`
  },
  {
    id: "2",
    slug: "iot-backend-architecture",
    title: "Designing IoT Backend Systems: Real-time Data at Scale",
    excerpt: "How to architect backend systems that handle continuous streams of sensor data while maintaining reliability and low latency.",
    publishedAt: "2025-12-15",
    tags: ["IoT", "Architecture", "Real-time", "Python"],
    coverImage: "https://picsum.photos/seed/iot-backend/800/400",
    readingTime: 12,
    featured: true,
    content: `# Designing IoT Backend Systems: Real-time Data at Scale

IoT backends face unique challenges: continuous data streams, unreliable networks, and the need for real-time alerting. Here's how I approach these problems.

## The Challenge

When building URDS-Backend, I needed to:
- Ingest data from hundreds of sensors
- Process readings in real-time
- Trigger alerts within seconds of threshold violations
- Store historical data for analysis

## Architecture Overview

\`\`\`
[Sensors] → [MQTT Broker] → [Ingestion Service] → [Database]
                                    ↓
                            [Alert Service] → [SMS/Email]
\`\`\`

## Key Design Decisions

### 1. Message Queue for Decoupling

Never connect sensors directly to your database. Use a message queue:

\`\`\`python
import paho.mqtt.client as mqtt

def on_message(client, userdata, msg):
    data = json.loads(msg.payload)
    process_sensor_reading(data)

client = mqtt.Client()
client.on_message = on_message
client.connect("broker.local", 1883)
\`\`\`

### 2. Batch Writes for Performance

Individual inserts kill database performance. Batch your writes:

\`\`\`python
readings_buffer = []
BATCH_SIZE = 100

def process_reading(reading):
    readings_buffer.append(reading)
    if len(readings_buffer) >= BATCH_SIZE:
        bulk_insert(readings_buffer)
        readings_buffer.clear()
\`\`\`

### 3. Separate Alert Logic

Keep alerting independent from data ingestion:

\`\`\`python
def check_thresholds(reading):
    if reading.value > THRESHOLD:
        alert_queue.put({
            'sensor_id': reading.sensor_id,
            'value': reading.value,
            'timestamp': reading.timestamp
        })
\`\`\`

## Lessons Learned

1. **Always buffer data** - Network issues happen
2. **Design for failure** - Sensors go offline
3. **Monitor everything** - You can't fix what you can't see

Building reliable IoT systems is challenging but incredibly rewarding.`
  },
  {
    id: "3",
    slug: "security-first-development",
    title: "Security-First Development: A Backend Engineer's Perspective",
    excerpt: "Integrating security into your development workflow from day one, not as an afterthought.",
    publishedAt: "2025-11-20",
    tags: ["Security", "Best Practices", "Backend"],
    coverImage: "https://picsum.photos/seed/security/800/400",
    readingTime: 10,
    featured: false,
    externalUrl: "https://medium.com/@solomonkaniaru154/the-journey-of-a-url-what-happens-when-you-enter-google-com-230f74aae7ef"
  },
  {
    id: "4",
    slug: "python-async-patterns",
    title: "Async Python Patterns for High-Performance APIs",
    excerpt: "Leveraging asyncio and modern Python features to build APIs that handle concurrent requests efficiently.",
    publishedAt: "2025-10-05",
    tags: ["Python", "Async", "Performance"],
    coverImage: "https://picsum.photos/seed/async/800/400",
    readingTime: 15,
    featured: false,
    content: `# Async Python Patterns for High-Performance APIs

Python's asyncio has matured significantly. Here's how to use it effectively for API development.

## Why Async?

Traditional synchronous code blocks while waiting for I/O:

\`\`\`python
# Synchronous - blocks the thread
response = requests.get(url)  # Waiting...
data = response.json()
\`\`\`

Async code can handle other requests while waiting:

\`\`\`python
# Asynchronous - frees the event loop
async with aiohttp.ClientSession() as session:
    response = await session.get(url)  # Other tasks can run
    data = await response.json()
\`\`\`

## Pattern 1: Concurrent API Calls

When you need data from multiple sources:

\`\`\`python
async def fetch_all_data():
    async with aiohttp.ClientSession() as session:
        tasks = [
            fetch_users(session),
            fetch_orders(session),
            fetch_inventory(session)
        ]
        users, orders, inventory = await asyncio.gather(*tasks)
    return combine_data(users, orders, inventory)
\`\`\`

## Pattern 2: Database Connection Pooling

Use async database libraries with connection pools:

\`\`\`python
from databases import Database

database = Database(
    'postgresql://user:pass@localhost/db',
    min_size=5,
    max_size=20
)

async def get_user(user_id: int):
    query = "SELECT * FROM users WHERE id = :id"
    return await database.fetch_one(query, {"id": user_id})
\`\`\`

## Pattern 3: Background Tasks

For operations that don't need immediate completion:

\`\`\`python
from fastapi import BackgroundTasks

@app.post("/orders")
async def create_order(order: Order, background_tasks: BackgroundTasks):
    order_id = await save_order(order)
    background_tasks.add_task(send_confirmation_email, order.email)
    return {"order_id": order_id}
\`\`\`

## When NOT to Use Async

Async isn't always the answer:
- CPU-bound operations (use multiprocessing instead)
- Simple scripts with minimal I/O
- When your team isn't familiar with async patterns

Choose the right tool for the job.`
  }
];

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured);
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
};
