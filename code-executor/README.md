# Code Executor

This directory contains the code execution environment for the Interactive Coding Agent project, including Docker containers for different programming languages and the web interface.

## Structure

- **backend/**: Node.js server handling WebSocket connections and Docker container management
- **frontend/**: React application providing the user interface
- **exec-c/**: Docker environment for C code execution
- **exec-cpp/**: Docker environment for C++ code execution  
- **exec-rust/**: Docker environment for Rust code execution
- **docker-compose.yml**: Docker Compose configuration for all execution environments

## Components

### Backend (Node.js)
- **Port**: 8000 (HTTP) and 8080 (WebSocket)
- **Features**:
  - Session management with the agent
  - Code editor API endpoints
  - WebSocket server for real-time code execution
  - Docker container orchestration
  - Progress tracking API

### Frontend (React)
- **Port**: 5173 (development server)
- **Features**:
  - Monaco code editor
  - Interactive learning interface
  - Progress tracking
  - Multi-language support
  - Real-time terminal output

### Docker Containers
Each language has its own isolated Docker container:
- **C**: GCC compiler with execution scripts
- **C++**: GCC compiler with execution scripts  
- **Rust**: Rust compiler with execution scripts

## Usage

1. **Start Docker containers**:
   ```bash
   docker-compose up
   ```

2. **Start the backend**:
   ```bash
   cd backend
   npm start
   ```

3. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## API Endpoints

- `GET /api/editor/code` - Get current code from editor
- `POST /api/editor/code` - Save code to editor
- `GET /api/validate-step` - Check step completion status
- `POST /api/validate-step` - Mark step as complete
- `GET /api/session-info` - Get session information

## Dependencies

### Backend
- express
- cors
- ws (WebSocket)
- dockerode (Docker API)

### Frontend
- React 18
- Monaco Editor
- xterm.js (terminal emulator)
- Tailwind CSS
- Lucide React (icons)
