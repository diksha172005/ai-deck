# 🤖 AI-Deck

A hackathon-ready platform to explore, search, filter, and save the best AI tools — built with **Next.js**, **Spring Boot**, and **PostgreSQL (Supabase)**.

---

## 📁 Project Structure

```
ai-deck/
├── frontend/                 ← Next.js app
│   ├── pages/
│   │   ├── index.js          ← Home (tool listing)
│   │   ├── favorites.js      ← Saved tools
│   │   ├── submit.js         ← Add a new tool
│   │   └── auth/
│   │       ├── login.js
│   │       └── signup.js
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── ToolCard.js
│   │   ├── SearchBar.js
│   │   ├── CategoryFilter.js
│   │   └── SkeletonCard.js
│   ├── lib/
│   │   ├── api.js            ← Axios API helpers
│   │   └── auth.js           ← Auth context + hooks
│   └── styles/
│       └── globals.css
│
├── backend/                  ← Spring Boot API
│   └── src/main/java/com/aideckapp/
│       ├── AiDeckApplication.java
│       ├── model/            ← JPA entities
│       ├── repository/       ← Spring Data repos
│       ├── service/          ← Business logic
│       ├── controller/       ← REST endpoints
│       ├── dto/              ← Data Transfer Objects
│       ├── security/         ← JWT filter + UserDetails
│       └── config/           ← Security config + DataSeeder
│
└── schema.sql                ← PostgreSQL schema
```

---

## 🚀 Quick Start (Local)

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- npm or yarn
- A Supabase account (free tier works great)

---

## 🗄️ Step 1 — Set Up Supabase PostgreSQL

1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. Once your project is created, navigate to **Settings → Database**.
3. Copy your **Connection String** — it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
4. Open `backend/src/main/resources/application.properties` and update:
   ```properties
   spring.datasource.url=jdbc:postgresql://db.<YOUR_PROJECT_REF>.supabase.co:5432/postgres
   spring.datasource.username=postgres
   spring.datasource.password=<YOUR_SUPABASE_DB_PASSWORD>
   ```
5. *(Optional)* Run `schema.sql` in the Supabase **SQL Editor** to create tables manually.
   - Hibernate's `ddl-auto=update` will also auto-create tables on first boot.

> **Supabase tip:** Enable "Direct Connection" mode (port 5432) for Spring Boot — not the connection pooler port (6543).

---

## ⚙️ Step 2 — Run the Backend

```bash
cd backend
mvn spring-boot:run
```

- The API will start at `http://localhost:8080`
- On first run, `DataSeeder` populates 7 categories and 24 tools automatically.

### Test the API
```bash
# Get all tools
curl http://localhost:8080/api/tools

# Filter by category
curl "http://localhost:8080/api/tools?category=Coding"

# Search
curl "http://localhost:8080/api/tools?search=image"

# Get categories
curl http://localhost:8080/api/categories

# Sign up
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@test.com","password":"secret123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@test.com","password":"secret123"}'
```

---

## 🖥️ Step 3 — Run the Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local → set NEXT_PUBLIC_API_URL=http://localhost:8080
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🌐 REST API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tools` | No | List all tools |
| GET | `/api/tools?category=Coding` | No | Filter by category |
| GET | `/api/tools?search=image` | No | Search by name/tag |
| GET | `/api/tools/featured` | No | Featured tools only |
| GET | `/api/tools/{id}` | No | Single tool |
| POST | `/api/tools` | Yes | Create new tool |
| GET | `/api/categories` | No | All categories |
| POST | `/api/auth/signup` | No | Register |
| POST | `/api/auth/login` | No | Login → JWT |
| GET | `/api/favorites/{userId}` | Yes | User's favorites |
| POST | `/api/favorites` | Yes | Add favorite |
| DELETE | `/api/favorites` | Yes | Remove favorite |

**Authenticated requests** need: `Authorization: Bearer <token>`

---

## ☁️ Deployment

### Frontend → Vercel

1. Push your `frontend/` folder to a GitHub repo.
2. Import it in [vercel.com/new](https://vercel.com/new).
3. Set environment variable in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.railway.app`
4. Click **Deploy**.

### Backend → Railway

1. Push your `backend/` folder to GitHub.
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub.
3. Set environment variables in Railway:
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://db.<ref>.supabase.co:5432/postgres
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=<your-password>
   APP_JWT_SECRET=<strong-random-string>
   APP_CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```
4. Railway auto-detects Maven and builds your app.

---

## 🔒 JWT Authentication Flow

```
1. User POSTs email+password to /api/auth/login
2. Spring Security authenticates → JwtUtils.generateToken()
3. Token returned in AuthResponse
4. Frontend stores token in cookies (js-cookie)
5. Axios interceptor attaches token: Authorization: Bearer <token>
6. JwtAuthFilter validates token on every protected request
```

---

## 🧩 Key Design Decisions

- **Spring Data JPA** with `ddl-auto=update` — no manual migrations needed in dev.
- **DataSeeder** populates demo data on first boot and skips if data exists.
- **ElementCollection** for tags — keeps the model simple without a join table entity.
- **ManyToMany** for favorites — clean bidirectional relationship.
- **Debounced search** in the frontend — avoids API spam on every keystroke.
- **Grouped category view** — shows tools organized by folder when no filter is active.
- **JWT in cookies** — accessible across page reloads with `js-cookie`.

---

## 🎨 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Database | PostgreSQL (Supabase) |
| ORM | Hibernate (via JPA) |
| Auth | JWT (jjwt 0.11) + BCrypt |
| Deployment | Vercel (FE) + Railway (BE) |

---

## 📝 Customization Tips

- **Add more tools**: Edit `DataSeeder.java` and rerun.
- **New category**: Add to `DataSeeder`, or POST directly to `/api/categories`.
- **Change JWT expiry**: Edit `app.jwt.expiration` in `application.properties` (ms).
- **Admin role**: Change user role to `ADMIN` in DB; the security config already allows admins to POST tools.
