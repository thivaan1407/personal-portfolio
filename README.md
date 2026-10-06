# Personal Portfolio (full-stack)

- Frontend: HTML, CSS, vanilla JavaScript (`public/`)
- Backend: Node.js + Express (`server.js`, `routes/`)
- Database: MongoDB via Mongoose (`models/`)
- Hosting: Vercel (config included) or Render/Heroku (`Procfile` included)

## Run locally

1. Install Node.js 18 or newer.
2. `npm install`
3. Create a free MongoDB Atlas cluster and copy its connection string.
4. Copy `.env.example` to `.env` and fill in `MONGODB_URI` and `ADMIN_KEY`.
5. `npm run seed` (loads the sample projects from `seed.js`)
6. `npm run dev` and open http://localhost:3000

## Make it yours

- Replace "Your Name", the links and the About text in `public/index.html`.
- Replace the sample projects in `seed.js`, then run `npm run seed` again.
- Colours and fonts are CSS variables at the top of `public/css/style.css`.

## API

| Method | Route | Access |
| --- | --- | --- |
| GET | `/api/projects` | public |
| GET | `/api/projects/:slug` | public |
| POST | `/api/projects` | admin |
| PUT | `/api/projects/:id` | admin |
| DELETE | `/api/projects/:id` | admin |
| POST | `/api/contact` | public, rate limited |

Admin routes need the header `x-admin-key: <ADMIN_KEY>`. Example:

```
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" -H "x-admin-key: YOUR_KEY" \
  -d '{"title":"New App","slug":"new-app","summary":"What it does","techStack":["Node.js"],"year":2026}'
```

## Deploy

**Vercel**: push to GitHub, import the repo on vercel.com, add `MONGODB_URI` and `ADMIN_KEY` as environment variables, deploy. In Atlas, allow network access from `0.0.0.0/0`.

**Render / Heroku**: create a web service from the repo, build command `npm install`, start command `npm start`, add the same two environment variables.

**Netlify** only hosts static files, so it can serve `public/` but not the Express API. Use Vercel or Render for the full project.
