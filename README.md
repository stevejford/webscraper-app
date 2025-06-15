# 🕷️ Web Scraper Pro

A modern, full-stack web scraping application with a beautiful React TypeScript frontend and powerful Python Crawl4AI backend.

![Web Scraper Pro](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Python](https://img.shields.io/badge/Python-3.11-green) ![Crawl4AI](https://img.shields.io/badge/Crawl4AI-0.6.3-purple)

## ✨ Features

- 🎨 **Beautiful Modern UI** - Clean, responsive design with dark mode support
- ⚡ **Real-time Updates** - Live progress tracking via WebSockets
- 🕷️ **Powerful Scraping** - Built on Crawl4AI for reliable web crawling
- 📊 **Rich Analytics** - Interactive charts and detailed statistics
- 💾 **Session Management** - Save and restore scraping sessions
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🌙 **Dark Mode** - Beautiful light and dark themes
- 📤 **Export Options** - JSON and CSV export capabilities

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **npm or yarn**

### Option 1: Automatic Setup (Recommended)

**Windows:**
```bash
# Run the startup script
start.bat
```

**macOS/Linux:**
```bash
# Make script executable and run
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## 🎯 How to Use

1. **Enter a URL** in the input field
2. **Configure settings** (max pages, delay, etc.)
3. **Click "Start Scraping"** to begin
4. **Watch real-time progress** as URLs are discovered
5. **View results** in organized tabs
6. **Export data** in JSON or CSV format
7. **Review session history** for past scrapes

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Query** for API calls
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **FastAPI** for REST API
- **Crawl4AI** for web scraping
- **WebSockets** for real-time communication
- **Pydantic** for data validation
- **BeautifulSoup4** for HTML parsing
- **Uvicorn** for ASGI server

## 📁 Project Structure

```
web-scraper-app/
├── 📁 backend/                 # Python FastAPI backend
│   ├── main.py                 # FastAPI application
│   └── requirements.txt        # Python dependencies
├── 📁 frontend/                # React TypeScript frontend
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   ├── 📁 hooks/           # Custom hooks
│   │   ├── 📁 layouts/         # Layout components
│   │   ├── 📁 store/           # Zustand stores
│   │   ├── 📁 utils/           # Utility functions
│   │   └── types.ts            # TypeScript types
│   ├── package.json            # Frontend dependencies
│   └── vite.config.ts          # Vite configuration
├── start.bat                   # Windows startup script
├── start.sh                    # Unix startup script
└── README.md                   # This file
```

## 🔧 Configuration

### Backend Configuration
The backend API runs on port 8000 by default. You can modify settings in `backend/main.py`:

```python
# Change port, host, or other settings
uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
```

### Frontend Configuration
The frontend runs on port 3000 and proxies API calls to the backend. Configure in `frontend/vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8000',
      '/ws': 'ws://localhost:8000',
    },
  },
})
```

## 🔌 API Endpoints

- `POST /api/scrape/start` - Start a new scraping session
- `POST /api/scrape/stop/{session_id}` - Stop an active session
- `GET /api/scrape/status/{session_id}` - Get session status
- `GET /api/scrape/sessions` - List all sessions
- `WS /ws/scrape/{session_id}` - WebSocket for real-time updates

## 🎨 UI Features

### Main Interface
- **URL Input** with validation
- **Configuration Panel** with advanced options
- **Progress Indicator** with real-time stats
- **Results Tabs** (URLs, External Links, Statistics)

### Advanced Features
- **Search and Filter** results
- **Copy URLs** to clipboard
- **Export Data** in multiple formats
- **Session History** with quick restore
- **Dark Mode Toggle**
- **Responsive Design**

## 🔄 Real-time Updates

The application uses WebSockets to provide real-time updates:
- Live progress tracking
- Current page being scraped
- URLs found counter
- Completion notifications

## 💡 Tips & Best Practices

1. **Start Small** - Begin with 5-10 pages to test the target site
2. **Respect Rate Limits** - Use appropriate delays between requests
3. **Monitor Progress** - Watch the real-time updates for any issues
4. **Export Regularly** - Save your results to avoid data loss
5. **Check robots.txt** - Respect website scraping policies

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure Python 3.11+ is installed
- Install dependencies: `pip install -r backend/requirements.txt`
- Check if port 8000 is available

**Frontend won't start:**
- Ensure Node.js 18+ is installed
- Install dependencies: `npm install`
- Check if port 3000 is available

**WebSocket connection fails:**
- Ensure both backend and frontend are running
- Check firewall settings
- Verify proxy configuration in vite.config.ts

**Scraping fails:**
- Check if the target URL is accessible
- Verify internet connection
- Some sites may block automated requests

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙋‍♂️ Support

If you encounter any issues or have questions, please create an issue in the GitHub repository.

---

**Happy Scraping!** 🕷️✨
