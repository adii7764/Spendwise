const API_URL = "https://spendwise-backend-mtvk.onrender.com";

// Redirect if already logged in
if (localStorage.getItem("token")) {
    window.location.href = "index.html";
}

function switchTab(tab) {
    const isLogin = tab === "login";
    document.getElementById("loginForm").style.display = isLogin ? "block" : "none";
    document.getElementById("signupForm").style.display = isLogin ? "none" : "block";
    document.getElementById("loginTab").classList.toggle("active", isLogin);
    document.getElementById("signupTab").classList.toggle("active", !isLogin);
    document.getElementById("loginError").textContent = "";
    document.getElementById("signupError").textContent = "";
}

function togglePass(id, eye) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
    eye.textContent = input.type === "password" ? "👁️" : "🙈";
}

function setLoading(type, loading) {
    document.getElementById(`${type}BtnText`).style.display = loading ? "none" : "inline";
    document.getElementById(`${type}Loader`).style.display = loading ? "inline-block" : "none";
}

async function login() {
    const email    = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const errEl    = document.getElementById("loginError");
    errEl.textContent = "";

    if (!email || !password) { errEl.textContent = "Please fill in all fields."; return; }

    setLoading("login", true);
    try {
        const res  = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) { errEl.textContent = data.error; return; }
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);
        window.location.href = "index.html";
    } catch {
        errEl.textContent = "Cannot connect to server. Is the backend running?";
    } finally {
        setLoading("login", false);
    }
}

async function register() {
    const name     = document.getElementById("signupName").value.trim();
    const email    = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const errEl    = document.getElementById("signupError");
    errEl.textContent = "";

    if (!name || !email || !password) { errEl.textContent = "Please fill in all fields."; return; }

    setLoading("signup", true);
    try {
        const res  = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!res.ok) { errEl.textContent = data.error; return; }
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);
        window.location.href = "index.html";
    } catch {
        errEl.textContent = "Cannot connect to server. Is the backend running?";
    } finally {
        setLoading("signup", false);
    }
}

// Allow Enter key
document.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const loginVisible = document.getElementById("loginForm").style.display !== "none";
    loginVisible ? login() : register();
});
