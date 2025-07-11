#!/bin/bash

# Interactive Coding Agent - Project Runner Script
# This script starts all components of the Interactive Coding Agent project

set -e  # Exit on any error

PROJECT_ROOT="/home/adithya/agent-test"
PYTHON_ENV="$PROJECT_ROOT/agent_env"
CODE_AGENT_DIR="$PROJECT_ROOT/code-agent"
CODE_EXECUTOR_DIR="$PROJECT_ROOT/code-executor"
BACKEND_DIR="$CODE_EXECUTOR_DIR/backend"
FRONTEND_DIR="$CODE_EXECUTOR_DIR/frontend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is available
port_available() {
    ! lsof -i :$1 >/dev/null 2>&1
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local name=$2
    local timeout=${3:-30}
    
    print_status "Waiting for $name to be ready..."
    for i in $(seq 1 $timeout); do
        if curl -s "$url" >/dev/null 2>&1; then
            print_status "$name is ready!"
            return 0
        fi
        sleep 1
    done
    print_error "$name failed to start within $timeout seconds"
    return 1
}

# Function to cleanup processes on exit
cleanup() {
    print_warning "Cleaning up processes..."
    pkill -f "adk api_server" 2>/dev/null || true
    pkill -f "node server.js" 2>/dev/null || true
    pkill -f "npm run dev" 2>/dev/null || true
    docker-compose -f "$CODE_EXECUTOR_DIR/docker-compose.yml" down 2>/dev/null || true
    print_status "Cleanup complete"
}

# Set up signal handlers for cleanup
trap cleanup EXIT INT TERM

# Check prerequisites
print_step "Checking prerequisites..."

if ! command_exists python3; then
    print_error "Python 3 is required but not installed"
    exit 1
fi

if ! command_exists node; then
    print_error "Node.js is required but not installed"
    exit 1
fi

if ! command_exists docker; then
    print_error "Docker is required but not installed"
    exit 1
fi

if ! command_exists docker-compose; then
    print_error "Docker Compose is required but not installed"
    exit 1
fi

# Check if Python virtual environment exists
if [ ! -d "$PYTHON_ENV" ]; then
    print_error "Python virtual environment not found at $PYTHON_ENV"
    print_error "Please set up the virtual environment first"
    exit 1
fi

print_status "All prerequisites are met"

# Check if required ports are available
print_step "Checking port availability..."
PORTS_TO_CHECK=(5173 8000 8080 8083)
for port in "${PORTS_TO_CHECK[@]}"; do
    if ! port_available $port; then
        print_error "Port $port is already in use"
        print_error "Please stop the service using this port or use a different port"
        exit 1
    fi
done
print_status "All required ports are available"

# Start Docker containers
print_step "Starting Docker containers..."
cd "$CODE_EXECUTOR_DIR"
docker-compose up -d
if [ $? -eq 0 ]; then
    print_status "Docker containers started successfully"
else
    print_error "Failed to start Docker containers"
    exit 1
fi

# Wait a bit for containers to initialize
sleep 3

# Start the ADK API server
print_step "Starting ADK API server..."
cd "$CODE_AGENT_DIR"
source "$PYTHON_ENV/bin/activate"
adk api_server --port 8083 --allow_origins "http://localhost:5173" &
ADK_PID=$!
print_status "ADK API server started with PID $ADK_PID"

# Wait for ADK API server to be ready
sleep 5

# Start the backend server
print_step "Starting backend server..."
cd "$BACKEND_DIR"
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
fi
npm start &
BACKEND_PID=$!
print_status "Backend server started with PID $BACKEND_PID"

# Wait for backend to be ready
wait_for_service "http://localhost:8000/api/session-info" "Backend server"

# Start the frontend development server
print_step "Starting frontend development server..."
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
print_status "Frontend development server started with PID $FRONTEND_PID"

# Wait for frontend to be ready
wait_for_service "http://localhost:5173" "Frontend development server"

# Print final status
print_status "=========================================="
print_status "🎉 Interactive Coding Agent is now running!"
print_status "=========================================="
print_status "Frontend:  http://localhost:5173"
print_status "Backend:   http://localhost:8000"
print_status "ADK API:   http://localhost:8083"
print_status "=========================================="
print_status "Press Ctrl+C to stop all services"

# Keep the script running
wait
