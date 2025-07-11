#!/bin/bash

# Interactive Coding Agent - Setup Script
# This script sets up the project environment

set -e  # Exit on any error

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_ENV="$PROJECT_ROOT/agent_env"
BACKEND_DIR="$PROJECT_ROOT/code-executor/backend"
FRONTEND_DIR="$PROJECT_ROOT/code-executor/frontend"

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

print_step "Setting up Interactive Coding Agent..."

# Check prerequisites
print_step "Checking prerequisites..."

if ! command_exists python3; then
    print_error "Python 3 is required but not installed"
    print_error "Please install Python 3 first"
    exit 1
fi

if ! command_exists node; then
    print_error "Node.js is required but not installed"
    print_error "Please install Node.js first"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is required but not installed"
    print_error "Please install npm first"
    exit 1
fi

if ! command_exists docker; then
    print_error "Docker is required but not installed"
    print_error "Please install Docker first"
    exit 1
fi

if ! command_exists docker-compose; then
    print_error "Docker Compose is required but not installed"
    print_error "Please install Docker Compose first"
    exit 1
fi

print_status "All prerequisites are met"

# Create Python virtual environment if it doesn't exist
if [ ! -d "$PYTHON_ENV" ]; then
    print_step "Creating Python virtual environment..."
    python3 -m venv "$PYTHON_ENV"
    print_status "Virtual environment created"
else
    print_status "Virtual environment already exists"
fi

# Install Python dependencies
print_step "Installing Python dependencies..."
cd "$PROJECT_ROOT"
source "$PYTHON_ENV/bin/activate"
pip install --upgrade pip
pip install -r requirements.txt
print_status "Python dependencies installed"

# Install backend dependencies
print_step "Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install
print_status "Backend dependencies installed"

# Install frontend dependencies
print_step "Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm install
print_status "Frontend dependencies installed"

# Create logs directory if it doesn't exist
LOGS_DIR="$BACKEND_DIR/logs"
if [ ! -d "$LOGS_DIR" ]; then
    mkdir -p "$LOGS_DIR"
    print_status "Created logs directory"
fi

# Build Docker images
print_step "Building Docker images..."
cd "$PROJECT_ROOT/code-executor"
docker-compose build
print_status "Docker images built"

# Check environment variables
print_step "Checking environment variables..."
ENV_FILE="$PROJECT_ROOT/code-agent/my_agent/.env"
if [ ! -f "$ENV_FILE" ]; then
    print_warning "Environment file not found: $ENV_FILE"
    print_warning "Please create this file with your Google API key:"
    print_warning "GOOGLE_API_KEY=your_api_key_here"
else
    print_status "Environment file exists"
fi

print_status "=========================================="
print_status "🎉 Setup complete!"
print_status "=========================================="
print_status "To run the project:"
print_status "  ./run_project.sh"
print_status ""
print_status "Make sure to:"
print_status "1. Set your Google API key in code-agent/my_agent/.env"
print_status "2. Ensure Docker is running"
print_status "3. Run the project with ./run_project.sh"
print_status "=========================================="
