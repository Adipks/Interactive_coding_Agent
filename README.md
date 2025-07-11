# Interactive Coding Agent 

## What is the Interactive Coding Agent?

The Interactive Coding Agent is a comprehensive learning support system that provides an AI-powered coding tutor. It combines the power of Google's Agent Development Kit (ADK) with a modern web interface to create an interactive learning environment for programming education.

## Screenshots

### 1. Home Screen
![Home Screen](images/img1.png)
The home screen provides an overview of the Interactive Coding Agent application, showcasing the main interface and navigation options for users to get started with their coding journey.

### 2. Programming Languages Selection
![Programming Languages Selection](images/img2.png)
This screen displays a comprehensive list of all programming languages available for learning, including C, C++, Rust, and other languages with plans for expansion to Python, Java, and JavaScript.

### 3. Topic Selection by Difficulty
![Topic Selection by Difficulty](images/img3.png)
Once a programming language is selected, users can choose from various topics ranging from beginner to advanced levels, providing a structured learning path tailored to their skill level.

### 4. AI-Powered Tutorial Generation
![AI-Powered Tutorial Generation](images/img4.png)
This demonstrates the agent's ability to explain a particular topic in detail and generate sample tutorial code to help users get started. The AI provides comprehensive explanations and practical examples.

### 5. Real-Time Code Execution
![Real-Time Code Execution](images/img5.png)
The code execution environment shows how user code is processed and executed in real-time. The terminal output is displayed immediately, allowing users to see results and debug their programs effectively.

### 6. Progress Tracking System
![Progress Tracking System](images/img6.png)
The progress bar system ensures structured learning by only allowing users to move to the next step after properly completing the current one. This gamified approach encourages thorough understanding before progression.

## Key Features

### 🤖 AI-Powered Tutoring
- **Intelligent Agent**: Uses Google's Gemini 2.0 Flash model for natural language understanding
- **Interactive Conversations**: Real-time chat interface for asking questions and getting help
- **Code Analysis**: Automatic code review and suggestions
- **Progress Tracking**: Gamified learning with progress bars and achievements

### 💻 Multi-Language Support
- **C Programming**: Complete compilation and execution environment
- **C++ Programming**: Modern C++ support with GCC compiler
- **Rust Programming**: Safe systems programming with Rust compiler
- **Extensible Architecture**: Easy to add more languages

### 🔧 Integrated Development Environment
- **Monaco Editor**: Professional code editor with syntax highlighting
- **Real-time Execution**: Instant code compilation and execution
- **Terminal Integration**: Live terminal output with xterm.js
- **Code Persistence**: Automatic saving of code between sessions

### 🎯 Learning-Focused Features
- **Tutorial Generation**: AI-generated programming tutorials
- **Step-by-step Guidance**: Breaking down complex problems into manageable steps
- **Mistake Explanations**: Clear explanations when code doesn't work
- **Hint System**: Optional hints to guide learning without giving away answers

## Architecture

### Frontend (React + TypeScript)
- **Port**: 5173 (development)
- **Technology Stack**: React 18, TypeScript, Tailwind CSS, Monaco Editor
- **Key Features**: 
  - Interactive learning interface
  - Code editor with syntax highlighting
  - Real-time terminal emulation
  - Progress tracking components
  - Responsive design

### Backend (Node.js)
- **Port**: 8000 (HTTP) and 8080 (WebSocket)
- **Technology Stack**: Express.js, WebSocket, Docker API
- **Key Features**:
  - Session management
  - Code execution orchestration
  - Real-time communication
  - Docker container management
  - API endpoints for frontend integration

### Agent System (Python + ADK)
- **Port**: 8083
- **Technology Stack**: Google ADK, Python, LiteLLM
- **Key Features**:
  - AI conversation handling
  - Code analysis and feedback
  - Tutorial generation
  - Progress tracking
  - Integration with Google's AI models

### Code Execution Environment (Docker)
- **Isolated Containers**: Separate containers for each programming language
- **Security**: Sandboxed execution environment
- **Scalability**: Easy to add new languages and tools
- **Consistency**: Same environment across different machines

## Data Flow

1. **User Interaction**: User types code in the Monaco editor
2. **Code Submission**: Frontend sends code to backend via WebSocket
3. **Docker Execution**: Backend executes code in appropriate Docker container
4. **AI Analysis**: Execution results are sent to the AI agent for analysis
5. **Feedback Generation**: Agent provides feedback, hints, or explanations
6. **Real-time Updates**: Results and feedback are sent back to frontend
7. **Progress Tracking**: System updates user progress and achievements

## File Structure

```
Interactive_coding_Agent/
├── code-agent/                 # AI Agent system
│   ├── my_agent/
│   │   ├── agent.py           # Main agent logic
│   │   ├── .env.example       # Environment configuration template
│   │   └── mistral_modelfile  # LLM model configuration
│   └── README.md              # Agent documentation
├── code-executor/             # Code execution system
│   ├── backend/               # Node.js backend
│   │   ├── server.js          # Main server file
│   │   ├── package.json       # Dependencies
│   │   └── logs/              # Execution logs
│   ├── frontend/              # React frontend
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── pages/         # Page components
│   │   │   └── App.tsx        # Main app component
│   │   └── package.json       # Dependencies
│   ├── exec-c/                # C execution environment
│   ├── exec-cpp/              # C++ execution environment
│   ├── exec-rust/             # Rust execution environment
│   ├── docker-compose.yml     # Docker orchestration
│   └── README.md              # Executor documentation
├── agent_env/                 # Python virtual environment
├── requirements.txt           # Python dependencies
├── setup.sh                   # Initial setup script
├── run_project.sh             # Project runner script
├── .gitignore                 # Git ignore rules
└── README.md                  # Main documentation
```

## API Endpoints

### Backend APIs
- `GET /api/editor/code` - Retrieve current code from editor
- `POST /api/editor/code` - Save code to editor
- `GET /api/validate-step` - Check if current step is complete
- `POST /api/validate-step` - Mark current step as complete
- `GET /api/session-info` - Get session information

### WebSocket Events
- `code` - Execute code in specified language
- `output` - Receive execution output
- `error` - Receive execution errors

### Agent APIs
- Session management endpoints
- Conversation endpoints
- Code analysis endpoints

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Monaco Editor**: VS Code editor in the browser
- **xterm.js**: Terminal emulator
- **Lucide React**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **WebSocket**: Real-time communication
- **Docker API**: Container management
- **CORS**: Cross-origin resource sharing

### Agent
- **Google ADK**: Agent Development Kit
- **Python**: Programming language
- **LiteLLM**: LLM integration library
- **Gemini 2.0 Flash**: Google's AI model

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Git**: Version control
- **GitHub**: Code repository

## Security Considerations

- **Sandboxed Execution**: Code runs in isolated Docker containers
- **API Key Management**: Secure handling of Google API keys
- **CORS Configuration**: Proper cross-origin request handling
- **Input Validation**: Sanitization of user inputs
- **Container Isolation**: Each language runs in its own container

## Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Separate bundles for different parts
- **WebSocket Communication**: Real-time updates without polling
- **Container Reuse**: Docker containers stay alive between executions
- **Caching**: Static assets cached for faster loading

## Development Workflow

1. **Setup**: Run `./setup.sh` to install dependencies
2. **Development**: Run `./run_project.sh` to start all services
3. **Code Changes**: All components support hot reloading
4. **Testing**: Test individual components or full integration
5. **Deployment**: Build and deploy to production environment

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Adipks/Interactive_coding_Agent.git
   cd Interactive_coding_Agent
   ```

2. **Run the setup script**:
   ```bash
   ./setup.sh
   ```

3. **Configure your Google API key**:
   Create or update `code-agent/my_agent/.env` with your Google API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

4. **Start the project**:
   ```bash
   ./run_project.sh
   ```

## Manual Setup

### Prerequisites

Ensure you have the following installed:

- Python 3
- Node.js 14+
- Docker
- Docker Compose

### Start the Servers

1. **Activate the Python Environment**:

   ```bash
   cd agent-test/agent_env
   source bin/activate
   ```

2. **Run the API Server** (in `/home/adithya/agent-test/code-agent`):

   ```bash
   adk api_server --port 8083 --allow_origins "http://localhost:5173"
   ```

3. **Run Docker Compose** (in `/home/adithya/agent-test/code-executor`):

   ```bash
   docker-compose up
   ```

4. **Start the Backend** (in `/home/adithya/agent-test/code-executor/backend`):

   ```bash
   npm start
   ```

5. **Start the Frontend** (in `/home/adithya/agent-test/code-executor/frontend`):

   ```bash
   npm run dev
   ```

## Future Enhancements

- **More Languages**: Add support for Python, Java, JavaScript, etc.
- **Advanced Analytics**: Detailed learning analytics and reports
- **Collaborative Features**: Peer programming and code sharing
- **Mobile Support**: Responsive design for mobile devices
- **Offline Mode**: Basic functionality without internet
- **AI Improvements**: Better code analysis and more personalized tutoring
- **Integration**: Connect with popular learning platforms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

