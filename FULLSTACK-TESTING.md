# 🚀 Full Stack Testing Guide

## 🎯 Quick Setup

### Step 1: Database Setup
1. **Go to your Supabase dashboard**: https://supabase.com/dashboard/project/jeymatvbyfaxhxztbjsw
2. **Navigate to SQL Editor**
3. **Copy and paste** the contents of `supabase-schema.sql`
4. **Run the SQL** to create all tables and functions

### Step 2: Environment Setup
Your environment files are already configured with your Supabase credentials:
- ✅ `backend-bun/.env` - Backend configuration
- ✅ `frontend/.env` - Frontend configuration

### Step 3: Install Dependencies

#### Option A: Automated Setup
```bash
# Linux/Mac
chmod +x setup-fullstack.sh
./setup-fullstack.sh

# Windows
setup-fullstack.bat
```

#### Option B: Manual Setup
```bash
# Frontend
cd frontend
npm install

# Backend (requires Bun)
cd ../backend-bun
bun install
```

### Step 4: Add Your OpenAI API Key
Edit `backend-bun/.env` and add:
```env
OPENAI_API_KEY=sk-your-actual-openai-api-key
```

### Step 5: Start the Applications
```bash
# Terminal 1: Backend
cd backend-bun
bun run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 🧪 What You Can Test

### ✅ **Frontend Features**
- Settings page with all 5 tabs
- API key configuration and validation
- Theme switching and persistence
- Responsive design
- Export/import functionality

### ✅ **Backend API Features**
- Health check: http://localhost:3001/health
- Database connection test
- File upload endpoints
- Content processing endpoints
- Vector search endpoints

### ✅ **Database Features**
- User management
- Session tracking
- File storage metadata
- Vector embeddings
- Chat conversations

### ✅ **Integration Features**
- Frontend ↔ Backend communication
- Supabase authentication
- File upload with progress
- Real-time updates

## 🔧 Testing Scenarios

### **Scenario 1: API Health Check**
1. Start backend: `cd backend-bun && bun run dev`
2. Visit: http://localhost:3001/health
3. Should see: `{"status": "healthy", "database": "connected"}`

### **Scenario 2: Frontend-Backend Integration**
1. Start both frontend and backend
2. Open frontend: http://localhost:5173
3. Go to Settings > API Configuration
4. Enter your OpenAI API key
5. Verify it saves and validates

### **Scenario 3: Database Operations**
1. Check Supabase dashboard
2. Verify tables are created
3. Test inserting sample data
4. Check vector search functions

### **Scenario 4: File Upload Test**
1. Use API endpoint: `POST /api/files/upload`
2. Upload a test file
3. Check Supabase Storage
4. Verify database record

## 📊 Expected Results

### **Backend Health Check**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "database": "connected",
  "storage": "connected",
  "version": "1.0.0"
}
```

### **Database Tables Created**
- ✅ users
- ✅ scraping_sessions
- ✅ scraped_pages
- ✅ stored_files
- ✅ content_chunks
- ✅ chat_conversations
- ✅ chat_messages

### **Storage Buckets**
- ✅ webscraper-images
- ✅ webscraper-documents
- ✅ webscraper-pdfs
- ✅ webscraper-videos
- ✅ webscraper-audio
- ✅ webscraper-archives

## 🚨 Troubleshooting

### **Backend Won't Start**
```bash
# Check Bun installation
bun --version

# Install Bun if missing
curl -fsSL https://bun.sh/install | bash

# Check environment variables
cat backend-bun/.env
```

### **Database Connection Issues**
1. Verify Supabase project is active
2. Check database password in `.env`
3. Test connection in Supabase dashboard
4. Ensure pgvector extension is enabled

### **Frontend Build Issues**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### **CORS Issues**
- Backend CORS is configured for `http://localhost:5173`
- If using different port, update `CORS_ORIGIN` in `.env`

## 🔗 Important URLs

### **Development**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Backend Health: http://localhost:3001/health
- API Docs: http://localhost:3001/docs (if implemented)

### **Supabase Dashboard**
- Project: https://supabase.com/dashboard/project/jeymatvbyfaxhxztbjsw
- Database: https://supabase.com/dashboard/project/jeymatvbyfaxhxztbjsw/editor
- Storage: https://supabase.com/dashboard/project/jeymatvbyfaxhxztbjsw/storage/buckets
- Auth: https://supabase.com/dashboard/project/jeymatvbyfaxhxztbjsw/auth/users

## 📋 Testing Checklist

### **Setup Complete When:**
- [ ] Database schema applied successfully
- [ ] Backend starts without errors
- [ ] Frontend builds and runs
- [ ] Health check returns "healthy"
- [ ] Environment variables configured
- [ ] OpenAI API key added

### **Integration Working When:**
- [ ] Frontend can reach backend API
- [ ] Database operations work
- [ ] File uploads succeed
- [ ] Settings persist correctly
- [ ] No CORS errors in browser console

### **Ready for Advanced Testing When:**
- [ ] All basic tests pass
- [ ] Vector search functions work
- [ ] Content processing endpoints respond
- [ ] Chat functionality can be tested
- [ ] File storage operations complete

## 🎉 Success Indicators

### **You'll Know It's Working When:**
1. **Backend logs show**: "Server running on http://localhost:3001"
2. **Frontend loads**: Clean interface with no console errors
3. **Health check passes**: Returns healthy status
4. **Database connected**: Can see tables in Supabase
5. **Settings save**: API key persists across reloads

### **Next Steps After Setup:**
1. Test file upload functionality
2. Try content processing endpoints
3. Test vector search capabilities
4. Implement chat assistant features
5. Deploy to production

---

**Need Help?**
- Check browser console for errors
- Review backend logs for issues
- Verify Supabase dashboard shows activity
- Test individual API endpoints with curl/Postman
