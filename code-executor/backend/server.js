const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const Docker = require("dockerode");
const fs = require("fs");
const path = require("path");


const docker = new Docker();
const app = express();
const PORT = 8000;
const WS_PORT = 8080;

app.use(express.json());
app.use(cors());

const editorCodePath = "/tmp/editor_code.txt";

// ⏳ Session state
const userId = "ADi";
let sessionId = null;

// Expose to frontend
app.get("/api/session-info", (req, res) => {
  res.json({ userId, sessionId });
});


// 🔁 Create session once on startup
async function ensureSession(userId) {
  if (sessionId) return sessionId;

  sessionId = `session_${Date.now()}`;
  try {
    const response = await fetch(`http://localhost:8083/apps/my_agent/users/${userId}/sessions/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      console.error("❌ Failed to create session");
      sessionId = null;
      return null;
    }

    console.log(`✅ Session created: ${sessionId}`);
    return sessionId;
  } catch (err) {
    console.error("❌ Error creating session:", err.message);
    sessionId = null;
    return null;
  }
}


// progress bar API
// In-memory progress state (can be improved later with per-user/session granularity)
let stepProgress = { success: false };

// POST: agent sets step as complete
app.post("/api/validate-step", (req, res) => {
  const { success } = req.body;
  console.log("📩 Step validation updated:", success);

  stepProgress.success = !!success;
  return res.status(200).json({ status: "ok", received: success });
});

// GET: frontend checks if step is complete
app.get("/api/validate-step", (req, res) => {
  res.json({ success: stepProgress.success });
});




// 🔹 Save code from editor
app.post("/api/editor/code", (req, res) => {
  const { code } = req.body;
  if (typeof code !== "string") return res.status(400).json({ error: "Invalid code format" });

  try {
    fs.writeFileSync(editorCodePath, code, "utf-8");
    return res.status(200).json({ message: "Code saved successfully" });
  } catch (err) {
    console.error("❌ Failed to save code:", err.message);
    return res.status(500).json({ error: "Failed to save code" });
  }
});

// 🔹 Get latest code for ADK
app.get("/api/editor/code", (req, res) => {
  try {
    const code = fs.existsSync(editorCodePath) ? fs.readFileSync(editorCodePath, "utf-8") : "";
    return res.status(200).json({ code });
  } catch (err) {
    console.error("❌ Failed to read code:", err.message);
    return res.status(500).json({ error: "Failed to read code" });
  }
});

// 🔸 WebSocket server
const wss = new WebSocketServer({ port: WS_PORT });
console.log("🧠 WebSocket server listening on port 8080");

wss.on("connection", (ws) => {
  console.log("✅ Client connected");

  let execStream = null;
  let currentContainer = null;
  const logDir = path.join(__dirname, "logs");

  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  const logFile = path.join(logDir, `terminal_output_${Date.now()}.txt`);

  ws.on("message", async (msg) => {
    try {
      const { type, payload, language } = JSON.parse(msg.toString());
      console.log(`📨 Message: ${type}, Lang: ${language}`);

      const containerName = {
        cpp: "code-executor_exec-cpp_1",
        c: "code-executor_exec-c_1",
        rust: "code-executor_exec-rust_1",
      }[language || "cpp"];

      currentContainer = docker.getContainer(containerName);

      if (type === "code") {
        if (execStream) {
          try {
            execStream.end();
          } catch (err) {
            console.warn("⚠️ Failed to end old stream:", err.message);
          }
          execStream = null;
        }

        const exec = await currentContainer.exec({
          Cmd: ["sh", "-c", "./run_code.sh"],
          AttachStdin: true,
          AttachStdout: true,
          AttachStderr: true,
          Tty: true,
          User: "root",
          WorkingDir: "/app",
        });

        execStream = await exec.start({ hijack: true, stdin: true });
        console.log("📦 Docker exec started. Sending code...");

        execStream.on("data", async (chunk) => {
          const output = chunk.toString();
          console.log("📤 OUTPUT:", output);
          ws.send(output);

          try {
            fs.appendFileSync(logFile, output);
          } catch (err) {
            console.error("❌ Failed to write log:", err.message);
          }

          const sid = await ensureSession(userId);
          if (!sid) return;

          try {
            const agentResponse = await fetch("http://localhost:8083/run_sse", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                appName: "my_agent",
                userId,
                sessionId: sid,
                newMessage: {
                  role: "user",
                  parts: [{ text: output }]
                },
                streaming: true
              })
            });

            if (!agentResponse.ok) {
              console.error("❌ Failed to send output to agent");
            }
          } catch (err) {
            console.error("❌ Error sending to agent:", err.message);
          }
        });

        execStream.on("end", () => console.log("🏁 Execution finished"));
        execStream.on("close", () => console.log("🔒 Stream closed"));
        execStream.on("error", (err) => {
          console.log("❌ Execution error:", err);
          ws.send(`Error: ${err.message}\n`);
          execStream = null;
          currentContainer = null;
        });

        setTimeout(() => {
          const unescapedPayload = payload
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\r/g, "\r")
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, "\\");

          execStream.write(unescapedPayload);
          console.log("✅ Code sent. Awaiting runtime input...");
        }, 100);
      }

      if (type === "input" && execStream) {
        execStream.write(payload);
      }

    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  });

  ws.on("close", () => {
    console.log("🔌 Client disconnected.");
    if (execStream) execStream.end();
  });
});

// HTTP server
app.listen(PORT,async () => {
  console.log(`🚀 HTTP backend listening on port ${PORT}`);
  await ensureSession(userId);
});
