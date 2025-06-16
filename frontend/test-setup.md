# Frontend Testing Guide

## Quick Start Testing

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test Features

#### ✅ Navigation Testing
- [ ] Click between Dashboard and Settings in sidebar
- [ ] Use settings button in header
- [ ] Verify mobile responsive navigation

#### ✅ API Key Configuration
- [ ] Navigate to Settings > API Configuration
- [ ] Enter a test API key (format: sk-test123...)
- [ ] Toggle show/hide password
- [ ] Verify validation messages
- [ ] Save and reload page to test persistence

#### ✅ Chat Preferences
- [ ] Navigate to Settings > Chat Preferences
- [ ] Change AI model selection
- [ ] Adjust temperature slider
- [ ] Modify response style
- [ ] Check cost estimation updates
- [ ] Save preferences

#### ✅ Theme Settings
- [ ] Navigate to Settings > Appearance
- [ ] Switch between light/dark/system themes
- [ ] Change primary colors
- [ ] Adjust font sizes
- [ ] Toggle accessibility options
- [ ] Preview changes in real-time

#### ✅ Storage Settings
- [ ] Navigate to Settings > Storage & Files
- [ ] View mock storage statistics
- [ ] Adjust cleanup settings
- [ ] Test file size limits
- [ ] Try cleanup actions

#### ✅ Export/Import
- [ ] Navigate to Settings > Export & Import
- [ ] Configure export options
- [ ] Test export functionality (downloads file)
- [ ] Try import with exported file

## Expected Behavior

### Dashboard
- Shows API key status banner
- "Configure" button navigates to settings
- Responsive layout works on mobile

### Settings Page
- Tabbed interface with 5 sections
- All settings persist in localStorage
- Unsaved changes warning works
- Mobile-friendly design

### API Key Status
- Shows "No API key" initially
- Updates when key is entered
- Validates key format (sk-...)
- Persists across page reloads

## Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript Errors**
   ```bash
   # Check for missing dependencies
   npm install @types/react @types/react-dom
   ```

3. **Routing Issues**
   - Verify all imports are correct
   - Check component file paths
   - Ensure all components are exported

### Mock Data
The app uses mock data for:
- Storage statistics
- Usage information
- File listings
- Session history

This allows testing UI without backend setup.

## Next Steps

Once frontend testing is complete:

1. **Backend Setup** (if desired)
   - Provide Supabase credentials
   - Set up database schema
   - Test API endpoints

2. **Integration Testing**
   - File upload functionality
   - Content processing
   - Vector search
   - Chat assistant

3. **Production Deployment**
   - Build optimization
   - Environment configuration
   - Performance testing
