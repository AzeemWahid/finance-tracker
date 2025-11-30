# Quick Start Guide

Get Finance Tracker running in 5 minutes!

## ✅ Prerequisites Check

Make sure you have:
- [x] Node.js 18+ installed (`node --version`)
- [x] PostgreSQL 14+ installed (`psql --version`)
- [x] Dependencies installed (already done!)

## Step 1: Create the Database

Choose **ONE** of these methods:

### Option A: Using psql (Command Line)
```bash
psql -U postgres
```
Then run:
```sql
CREATE DATABASE financetrackerdb;
\q
```

### Option B: Using pgAdmin (GUI)
1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name: `financetrackerdb`
4. Click "Save"

### Update Password (if needed)
If your PostgreSQL password is NOT "postgres", update `backend/.env`:
```env
DB_PASSWORD=your_actual_password
```

## Step 2: Run Database Migrations

```bash
cd backend
npm run build
npm run db:migrate
```

You should see:
```
✓ Schema migration completed
✓ Stored procedures created
✓ All migrations completed successfully
```

## Step 3: Start the Backend

```bash
npm run dev
```

You should see:
```
✓ Database connection established
✓ Server running on port 3000
✓ API available at http://localhost:3000/api/v1
```

## Step 4: Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

## Step 5: Open Your App!

Open your browser and go to:
```
http://localhost:5173
```

You should see the Finance Tracker home page! 🎉

## Test It Out

1. **Click "Register"**
2. **Fill in the form:**
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `Test1234` (must have uppercase, lowercase, and number)
3. **Click "Register"**
4. **You should be redirected to the Dashboard!**

## Troubleshooting

### Backend won't start

**Error: "Database connection failed"**
```bash
# Check if PostgreSQL is running
# Windows:
services.msc  # Look for "postgresql"

# Check database exists
psql -U postgres -l
```

**Error: "Port 3000 already in use"**
```bash
# Change port in backend/.env
PORT=3001
```

### Frontend won't start

**Error: "Port 5173 already in use"**
```bash
# Kill the process or change port in vite.config.ts
```

### Can't register/login

**Check backend is running:**
```bash
# In browser or terminal:
curl http://localhost:3000/api/v1/health
# Should return: {"success":true,"message":"Server is running"}
```

**Check browser console** (F12) for error messages

## Next Steps

Now that everything is running:

### 📚 Learn the Codebase
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- E2E Tests: `e2e/README.md`

### 🚀 Deploy to Production
- Follow: `deployment/DEPLOYMENT_GUIDE.md`

### 🧪 Run Tests

**Backend tests:**
```bash
cd backend
npm test
```

**Frontend tests:**
```bash
cd frontend
npm test
```

**E2E tests:**
```bash
cd e2e
npm install
npx playwright install
npm test
```

### 🔧 Development Workflow

1. **Make changes** to code
2. **Hot reload** automatically updates
3. **Lint code:** `npm run lint`
4. **Format code:** `npm run format`
5. **Test:** `npm test`

## Common Development Tasks

### Add a new API endpoint

1. Create controller in `backend/src/controllers/`
2. Add route in `backend/src/routes/`
3. Create stored procedure in `backend/sql/procedures/`
4. Test with Postman or frontend

### Add a new page

1. Create view in `frontend/src/views/`
2. Add route in `frontend/src/router/index.ts`
3. Update navigation

### Access Database Directly

```bash
psql -U postgres -d financetrackerdb
```

Common queries:
```sql
-- View all users
SELECT * FROM users;

-- Count users
SELECT COUNT(*) FROM users;

-- Delete test users
DELETE FROM users WHERE email LIKE 'test%';
```

## API Testing with curl

**Health check:**
```bash
curl http://localhost:3000/api/v1/health
```

**Register:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"api@test.com","username":"apiuser","password":"Test1234"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"api@test.com","password":"Test1234"}'
```

**Get current user (replace TOKEN):**
```bash
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Folder Structure Quick Reference

```
claudetest/
├── backend/        # API server (port 3000)
├── frontend/       # Web app (port 5173)
├── e2e/            # End-to-end tests
├── deployment/     # Deployment scripts and config
└── README.md       # Main documentation
```

## Git Workflow (When Ready)

```bash
# Initialize git for backend
cd backend
git init
git add .
git commit -m "Initial backend setup"

# Initialize git for frontend
cd ../frontend
git init
git add .
git commit -m "Initial frontend setup"
```

## Get Help

- **Main README:** `README.md`
- **Backend docs:** `backend/README.md`
- **Frontend docs:** `frontend/README.md`
- **Deployment:** `deployment/DEPLOYMENT_GUIDE.md`
- **E2E tests:** `e2e/README.md`

---

**Enjoy building with Finance Tracker! 🚀**
