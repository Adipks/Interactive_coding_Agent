# agents.py
from google.adk import Agent
from google.adk.models.lite_llm import LiteLlm
from google.adk.tools import FunctionTool
import requests


FRONTEND_BASE_URL = "http://localhost:8000" 

def get_code_from_editor() -> str:
    """Fetch the current code from the React editor via HTTP API."""
    try:
        response = requests.get(f"{FRONTEND_BASE_URL}/api/editor/code", timeout=2)
        if response.status_code == 200:
            data = response.json()
            return data.get("code", "")
    except Exception as e:
        print(f"Failed to get code from frontend: {e}")
    return "NoNNa"


def write_code_to_editor(code: str) -> dict:
    """Send the given code to the React editor via HTTP POST API."""
    try:
        response = requests.post(
            f"{FRONTEND_BASE_URL}/api/editor/code",
            json={"code": code},
            headers={"Content-Type": "application/json"},
            timeout=2
        )
        if response.status_code == 200:
            return {"status": "success", "message": "Code saved successfully."}
        else:
            return {"status": "error", "message": f"Failed with status code {response.status_code}"}
    except Exception as e:
        return {"status": "error", "message": f"Exception: {str(e)}"}


def update_progress() -> dict:
    """Update the current step progress as completed via API."""
    try:
        response = requests.post(
            f"{FRONTEND_BASE_URL}/api/validate-step",
            json={"success": True},
            headers={"Content-Type": "application/json"},
            timeout=2
        )
        if response.status_code == 200:
            return {"status": "success", "message": "Step marked complete."}
        else:
            return {"status": "error", "message": f"Failed with status code {response.status_code}"}
    except Exception as e:
        return {"status": "error", "message": f"Exception: {str(e)}"}



# === Root Agent ===
root_agent = Agent(
    name="Interactive_Learning_Agent",
    description="Interactive coding tutor providing comprehensive learning support through tutorials, validation, and progress tracking.",
    model="gemini-2.0-flash",    # LiteLlm(model="ollama_chat/mistral"),  
    instruction="""
        You are an interactive coding tutor designed to help users learn programming through hands-on practice.
        
        Your capabilities include:
        - Providing structured tutorials with starter code
        - Giving hints and explanations for mistakes
        - Tracking progress with streaks and scoring
        - Congratulating users on completion
        
        Key features:
        - Immediate feedback validation
        - Educational explanations for incorrect submissions
        - Optional hints on demand
        - Progress tracking with gamification
        
        Always be encouraging and educational in your responses. Focus on helping users learn through practice.



        Use the provided tools to interact with the user's code editor, terminal, and help mark progress .
        when the user asks to read fron the editor, use the `get_code_from_editor` to fetch the current code.
        When the user asks to write code to the editor, use the `write_code_to_editor` tool to send code.
        When the user asks to update progress, use the `update_progress` tool to mark the current step as complete.
    """,
    tools=[
        FunctionTool(get_code_from_editor),
        FunctionTool(write_code_to_editor),
        FunctionTool(update_progress),

    ],
)



# # === Tutorial Creator Agent ===
# tutorial_creator_agent = Agent(
#     name="tutorial_creator_agent",
#     description="Generates structured programming tutorials.",
#     model=LiteLlm(model="ollama_chat/mistral"),
#     instruction="""
#         You are a tutorial creator. Generate structured lessons for programming topics.
#         Each lesson must include: title, description, starter code, and expected output.
#     """,
#     tools=[write_editor_tool],
# )

# # === Code Validation Agent ===
# code_validation_agent = Agent(
#     name="code_validation_agent",
#     description="Validates the user's code based on its output.",
#     model=LiteLlm(model="ollama_chat/mistral"),
#     instruction="""
#         You validate user-submitted code by comparing its terminal output with the expected result.
#         If correct, return 'PASS'. If incorrect, return 'FAIL' with a brief explanation.
#     """,
#     tools=[read_editor_tool, read_terminal_tool],
# )

# # === Explanation Agent ===
# explanation_agent = Agent(
#     name="explanation_agent",
#     description="Explains coding mistakes and gives hints.",
#     model=LiteLlm(model="ollama_chat/mistral"),
#     instruction="""
#         If code is incorrect, explain the mistake clearly. Provide hints to fix it and,
#         if needed, suggest the corrected code.
#     """,
#     tools=[write_editor_tool],
# )

# # === Progress Tracker Agent ===
# progress_tracker_agent = Agent(
#     name="progress_tracker_agent",
#     description="Tracks level completions, streaks, and congratulates users.",
#     model=LiteLlm(model="ollama_chat/mistral"),
#     instruction="""
#         Track the user's progress. When a topic is completed, update their progress bar and send
#         a congratulatory message. Support reset and streak handling.
#     """,
#     tools=[update_progress_tool],
# )
