import { Project } from '../types';

export const projects: Project[] = [
  {
    id: "1",
    title: "URDS-Backend",
    category: "IoT Backend",
    description: "Real-time sensor data processing system for environmental monitoring with alerting capabilities.",
    problem: "Organizations needed a reliable way to collect, process, and analyze data from hundreds of distributed sensors in real-time.",
    approach: "Built a scalable Python backend using Flask with async processing, Redis for caching, and PostgreSQL for persistent storage. Implemented WebSocket connections for real-time updates.",
    impact: "Reduced data processing latency by 70% and enabled real-time alerting that helped prevent 3 critical environmental incidents.",
    tech: ["Python", "Flask", "PostgreSQL", "Redis", "Docker", "WebSockets"],
    imageUrl: "https://picsum.photos/seed/urds/800/400",
    githubUrl: "https://github.com/example/urds-backend"
  },
  {
    id: "2",
    title: "API Gateway Service",
    category: "Backend",
    description: "Centralized API gateway handling authentication, rate limiting, and request routing for microservices.",
    problem: "Multiple microservices needed unified authentication, rate limiting, and monitoring without duplicating logic.",
    approach: "Designed a lightweight gateway using FastAPI with JWT authentication, Redis-based rate limiting, and comprehensive request logging.",
    impact: "Simplified client integrations and reduced authentication-related bugs by 90%.",
    tech: ["Python", "FastAPI", "Redis", "JWT", "Docker", "Nginx"],
    imageUrl: "https://picsum.photos/seed/gateway/800/400",
    githubUrl: "https://github.com/example/api-gateway"
  },
  {
    id: "3",
    title: "Data Pipeline Framework",
    category: "Backend",
    description: "ETL framework for processing and transforming large datasets from multiple sources.",
    problem: "Manual data processing was error-prone and couldn't scale with growing data volumes.",
    approach: "Created a modular pipeline framework with configurable transformers, validators, and output adapters. Used Apache Airflow for orchestration.",
    impact: "Automated 50+ hours of weekly manual work and improved data quality scores by 40%.",
    tech: ["Python", "Apache Airflow", "Pandas", "PostgreSQL", "AWS S3"],
    imageUrl: "https://picsum.photos/seed/pipeline/800/400",
    githubUrl: "https://github.com/example/data-pipeline"
  },
  {
    id: "4",
    title: "Smart Home Controller",
    category: "IoT",
    description: "Central hub for managing and automating smart home devices with voice control integration.",
    problem: "Users had multiple smart home apps with no unified control or automation capabilities.",
    approach: "Built a Python-based controller using MQTT for device communication and integrated with voice assistants via custom skills.",
    impact: "Unified control of 20+ device types and enabled complex automation scenarios.",
    tech: ["Python", "MQTT", "Raspberry Pi", "Docker", "SQLite"],
    imageUrl: "https://picsum.photos/seed/smarthome/800/400",
    githubUrl: "https://github.com/example/smart-home"
  },
  {
    id: "5",
    title: "ML Model Serving Platform",
    category: "AI/ML",
    description: "Platform for deploying, versioning, and serving machine learning models at scale.",
    problem: "Data scientists struggled to deploy models to production with proper versioning and monitoring.",
    approach: "Created a serving platform with automatic scaling, A/B testing capabilities, and real-time performance monitoring.",
    impact: "Reduced model deployment time from days to hours and enabled rapid experimentation.",
    tech: ["Python", "FastAPI", "Docker", "Kubernetes", "TensorFlow", "Redis"],
    imageUrl: "https://picsum.photos/seed/mlplatform/800/400",
    githubUrl: "https://github.com/example/ml-platform"
  }
];
