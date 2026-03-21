const express = require("express");
const path = require("path");
const os = require("os");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static("public"));

/* ================= FRONTEND ================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/dashboard.html"));
});

/* ================= AUTH ================= */
let loggedIn = false;

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    loggedIn = true;
    return res.json({ success: true });
  }

  res.status(401).json({ success: false });
});

/* ================= METRICS ================= */
function getMetrics() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  return {
    cpuLoad: os.loadavg()[0].toFixed(2),
    memoryUsed: ((totalMem - freeMem) / 1024 / 1024).toFixed(2) + "MB",
    uptime: process.uptime().toFixed(0)
  };
}

app.get("/api/metrics", (req, res) => {
  res.json(getMetrics());
});

/* ================= SECURITY ================= */
app.get("/api/security", (req, res) => {
  res.json({
    status: "secure",
    alerts: []
  });
});

/* ================= WEBSOCKET ================= */
wss.on("connection", (ws) => {
  const interval = setInterval(() => {
    ws.send(JSON.stringify(getMetrics()));
  }, 2000);

  ws.on("close", () => clearInterval(interval));
});

/* ================= EXTRA ROUTES ================= */
app.get("/afrilove", (req, res) => {
  res.send("<h1>AfriLove Coming Soon ❤️</h1>");
});

/* ================= START ================= */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 AfriDigital running on port", PORT);
});
