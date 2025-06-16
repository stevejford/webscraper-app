# 🧪 Web Scraper App Testing Guide

## Quick Start

### Option 1: Use Startup Scripts
```bash
# Linux/Mac
chmod +x start-frontend.sh
./start-frontend.sh

# Windows
start-frontend.bat
```

### Option 2: Manual Setup
```bash
cd frontend
npm install
npm run dev
```

## 🎯 What You Can Test Right Now

### ✅ **Frontend Features (No Backend Required)**

#### 1. **Navigation System**
- Dashboard ↔ Settings navigation
- Sidebar responsive behavior
- Mobile menu functionality

#### 2. **Settings Configuration**
- **API Key Setup**: Enter test key (format: `sk-test123...`)
- **Chat Preferences**: Model selection, temperature, response style
- **Theme System**: Light/dark modes, color schemes, font sizes
- **Storage Settings**: Mock usage stats, cleanup options
- **Export/Import**: Download configuration files

#### 3. **UI Components**
- Form validation and feedback
- Real-time previews (theme changes)
- Progress indicators and loading states
- Responsive design on different screen sizes

#### 4. **Data Persistence**
- Settings saved to localStorage
- API key validation and storage
- Theme preferences persistence
- Unsaved changes warnings

## 🔧 Testing Scenarios

### **Scenario 1: First-Time User**
1. Open app → See dashboard with API key prompt
2. Click "Configure" → Navigate to settings
3. Enter API key → See validation feedback
4. Explore other settings tabs
5. Return to dashboard → API key status updated

### **Scenario 2: Settings Configuration**
1. Go to Settings > Chat Preferences
2. Change model to GPT-4
3. Adjust temperature to 0.3
4. Set response style to "Technical"
5. Save settings → Verify persistence on reload

### **Scenario 3: Theme Customization**
1. Go to Settings > Appearance
2. Switch to dark mode
3. Change primary color to purple
4. Increase font size to large
5. See live preview updates

### **Scenario 4: Mobile Testing**
1. Resize browser to mobile width
2. Test hamburger menu
3. Navigate between pages
4. Verify touch interactions
5. Check responsive layouts

## 🚨 Common Issues & Solutions

### **Build Errors**
```bash
# Clear cache and reinstall
rm -rf frontend/node_modules frontend/package-lock.json
cd frontend && npm install
```

### **TypeScript Errors**
```bash
# Check for missing types
cd frontend
npm install @types/react @types/react-dom --save-dev
```

### **Import Errors**
- Verify all component files exist
- Check file paths in imports
- Ensure proper exports

### **Styling Issues**
```bash
# Rebuild Tailwind CSS
cd frontend
npm run build
```

## 📊 Expected Behavior

### **Dashboard**
- Shows API key status banner
- Responsive scraping form
- Mock statistics when no session active

### **Settings Page**
- 5 tabbed sections
- Form validation
- Real-time previews
- Persistent storage

### **API Key Status**
- Red: No key or invalid
- Green: Valid key format
- Loading: During validation

## 🔄 Backend Testing (Optional)

If you want to test the full stack:

### **Required Supabase Setup**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
DATABASE_URL=postgresql://...
```

### **Backend Features to Test**
- File upload and storage
- Content processing (OCR, PDF)
- Vector search functionality
- Database operations

## 📱 Browser Compatibility

### **Recommended Browsers**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### **Features Requiring Modern Browser**
- CSS Grid and Flexbox
- ES6+ JavaScript features
- Local Storage API
- File API (for uploads)

## 🎯 Success Criteria

### **Frontend Testing Complete When:**
- [ ] All navigation works smoothly
- [ ] Settings save and persist
- [ ] API key validation functions
- [ ] Theme switching works
- [ ] Mobile responsive design verified
- [ ] Export/import functionality tested
- [ ] No console errors

### **Ready for Backend Integration When:**
- [ ] Frontend tests pass
- [ ] Supabase credentials provided
- [ ] Database schema deployed
- [ ] API endpoints accessible

## 🚀 Next Steps

1. **Complete Frontend Testing**
2. **Provide Supabase Credentials** (if desired)
3. **Set Up Backend Services**
4. **Test Full Integration**
5. **Deploy to Production**

---

**Need Help?** 
- Check browser console for errors
- Verify all files are present
- Test in incognito mode
- Try different browsers
