require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const Project = require('./models/Project');

// Replace these with your real projects, then run: npm run seed
const projects = [
  {
    title: 'Blog Platform',
    slug: 'blog-platform',
    summary: 'A blog with posts, comments and a small admin area.',
    description:
      'Readers can browse posts and leave comments. Authors write and edit posts from a simple dashboard. Built with an Express API and a vanilla JavaScript frontend.',
    techStack: ['Node.js', 'Express', 'SQLite', 'JavaScript'],
    liveUrl: '',
    repoUrl: 'https://github.com/your-username/blog-platform',
    year: 2026,
    featured: true,
    order: 1,
  },
  {
    title: 'Weather Dashboard',
    slug: 'weather-dashboard',
    summary: 'Search any city and see the current weather and a 5-day forecast.',
    description:
      'Calls a public weather API, caches recent searches in the browser, and adapts to phone and desktop screens.',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/your-username/weather-dashboard',
    year: 2025,
    featured: false,
    order: 2,
  },
  {
    title: 'Task Tracker',
    slug: 'task-tracker',
    summary: 'A to-do app with categories, due dates and filters.',
    description:
      'Tasks are stored in MongoDB through a REST API. Supports creating, completing, editing and deleting tasks.',
    techStack: ['React', 'Express', 'MongoDB'],
    liveUrl: '',
    repoUrl: 'https://github.com/your-username/task-tracker',
    year: 2025,
    featured: false,
    order: 3,
  },
];

(async () => {
  try {
    await connectDB();
    await Project.deleteMany({});
    await Project.insertMany(projects);
    console.log(`Seeded ${projects.length} projects.`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
