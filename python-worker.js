/* Veyro Release 02 — browser-side Python worker.
   * User code runs in a Web Worker using Pyodide; it is never sent to Veyro's server.
   */
let pyodidePromise = null;
let activeRun = 0;

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js");
      return await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/"
      });
    })();
  }
  return pyodidePromise;
}

self.onmessage = async (event) => {
  const data = event.data || {};
  if (data.type !== "run" || typeof data.code !== "string") return;
  const runId = Number(data.runId) || ++activeRun;
  activeRun = runId;
  try {
    self.postMessage({ type: "status", runId, text: "Loading Python…" });
    const pyodide = await getPyodide();
    if (runId !== activeRun) return;
    pyodide.setStdout({ batched: (text) => self.postMessage({ type: "stdout", runId, text }) });
    pyodide.setStderr({ batched: (text) => self.postMessage({ type: "stderr", runId, text }) });
    self.postMessage({ type: "status", runId, text: "Running…" });
    await pyodide.runPythonAsync(data.code);
    if (runId === activeRun) self.postMessage({ type: "done", runId });
  } catch (error) {
    if (runId === activeRun) {
      self.postMessage({ type: "error", runId, text: String(error?.message || error).slice(0, 12000) });
    }
  }
};
