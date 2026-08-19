const messageElement = document.querySelector("#message");
const environmentElement = document.querySelector("#environment");

async function loadMessage() {
  messageElement.textContent = "Connecting to the backend...";
  environmentElement.textContent = "";

  try {
    const response = await fetch("/api/message");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    messageElement.textContent = data.message;
    environmentElement.textContent = `Environment: ${data.environment}`;
  } catch (error) {
    messageElement.textContent = "The backend is currently unavailable.";
    environmentElement.textContent = error.message;
  }
}

document.querySelector("#reload").addEventListener("click", loadMessage);
loadMessage();
