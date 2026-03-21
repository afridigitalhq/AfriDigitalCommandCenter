async function loadData() {
  try {
    const metrics = await fetch('/api/metrics').then(r => r.json());
    const security = await fetch('/api/security').then(r => r.json());

    document.getElementById("cpu").innerText = metrics.cpu;
    document.getElementById("memory").innerText = metrics.memory;
    document.getElementById("uptime").innerText = metrics.uptime.toFixed(0) + "s";

    document.getElementById("securityStatus").innerText = security.status;
  } catch (e) {
    console.log("Error loading data", e);
  }
}

// auto refresh every 3s
setInterval(loadData, 3000);
window.onload = loadData;
