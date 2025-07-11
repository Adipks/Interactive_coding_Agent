# Code Agent

This directory contains the core agent functionality for the Interactive Coding Agent project.

## Files

- `my_agent/agent.py`: Main agent script that defines the Interactive Learning Agent with tools for code editor interaction
- `my_agent/.env`: Environment variables (contains API keys - ensure this is properly secured)
- `my_agent/mistral_modelfile`: Model configuration for the Mistral LLM

## Agent Features

The Interactive Learning Agent provides:

- **Code Editor Integration**: Fetch and write code to/from the React editor
- **Progress Tracking**: Mark learning steps as complete
- **Tutorial Support**: Provide structured programming lessons
- **Validation**: Check user code and provide feedback
- **Gamification**: Track progress with streaks and scoring

## Usage

To run the agent API server:

```bash
# Activate the Python environment first
source ../agent_env/bin/activate

# Run the API server
adk api_server --port 8083 --allow_origins "http://localhost:5173"
```

## Environment Variables

Make sure to set your Google API key in the `.env` file:

```
GOOGLE_API_KEY=your_api_key_here
```

## Dependencies

The agent uses Google's Agent Development Kit (ADK) and requires the following Python packages:
- google-adk
- requests
- Various other dependencies installed in the virtual environment
