const STORAGE_KEY = "APP_API_KEY";

const apiKeyInput = document.getElementById("apiKeyInput");
const apiKeyStatus = document.getElementById("apiKeyStatus");
const saveBtn = document.getElementById("saveApiKeyBtn");
const toggleBtn = document.getElementById("toggleApiKeyBtn");

function setStatus(msg, ok = true) {
  apiKeyStatus.textContent = msg;
  apiKeyStatus.style.opacity = "1";
  apiKeyStatus.style.color = ok ? "#007500" : "#a10000";
}

function saveApiKey() {
  const key = apiKeyInput.value.trim();
  if (!key) {
    setStatus("Por favor, insira um valor.", false);
    return;
  }
  localStorage.setItem(STORAGE_KEY, key);

  apiKeyInput.value = "";
  apiKeyInput.type = "password";

  setStatus("Credencial salva.", true);
}

  toggleBtn.addEventListener("click", () => {
    const isHidden = apiKeyInput.type === "password";
    apiKeyInput.type = isHidden ? "text" : "password";

    toggleIcon.classList.toggle("fa-eye", !isHidden);
    toggleIcon.classList.toggle("fa-eye-slash", isHidden);
  });

saveBtn.addEventListener("click", saveApiKey);
