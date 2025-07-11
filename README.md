# Interactive Coding Agent

Welcome to the Interactive Coding Agent project! This project provides a comprehensive learning support system through tutorials, validation, and progress tracking, using an interactive coding tutor.

## Project Structure

- **code-agent**: Contains the core agent functionality, interfacing with the user's code editor.
- **code-executor**: Responsible for executing code within specific language environments using Docker.
- **frontend**: A React app providing an interactive learning interface.
- **backend**: Node.js server handling session management and communication between components.

## To Run the Project

The following steps can be automated with the provided `run_project.sh` script:

### Prerequisites

Ensure you have the following installed:

- Python 3
- Node.js 14+
- Docker

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

## License

This project is licensed under the Apache License 2.0.
