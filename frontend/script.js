const API_BASE = window.location.protocol === "file:" ? "http://localhost:8080" : "";

const page = document.body.dataset.page;
const tokenKey = "token";
const userKey = "user";

const $ = (selector) => document.querySelector(selector);

function getToken() {
    return localStorage.getItem(tokenKey);
}

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem(userKey) || "null");
    } catch (err) {
        return null;
    }
}

function saveSession(token, user) {
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(userKey, JSON.stringify(user));
}

function clearSession() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
}

function redirectTo(path) {
    window.location.href = path;
}

function showMessage(message, type = "error") {
    const target = $("#msg");
    if (!target) return;

    target.textContent = message || "";
    target.dataset.type = type;
}

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || data.error || "Something went wrong");
    }

    return data;
}

function protectGuestPage() {
    if (getToken()) {
        redirectTo("dashboard.html");
    }
}

function protectDashboard() {
    if (!getToken()) {
        redirectTo("login.html");
    }
}

function setButtonLoading(button, isLoading, label) {
    if (!button) return;
    button.disabled = isLoading;
    button.textContent = isLoading ? "Please wait" : label;
}

function renderDashboardUser(user) {
    if (!user) return;

    const firstName = user.name.split(" ")[0] || user.name;
    const joined = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
        : "Today";

    $("#userName").textContent = user.name;
    $("#welcomeName").textContent = firstName;
    $("#userEmail").textContent = user.email;
    $("#joinedDate").textContent = joined;
    $(".avatar").textContent = firstName.charAt(0).toUpperCase();
}

async function loadDashboard() {
    protectDashboard();

    const storedUser = getStoredUser();
    if (storedUser) {
        renderDashboardUser(storedUser);
    }

    try {
        const data = await apiRequest("/api/auth/me", {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

        localStorage.setItem(userKey, JSON.stringify(data.user));
        renderDashboardUser(data.user);
    } catch (err) {
        clearSession();
        redirectTo("login.html");
    }
}

function setupLogin() {
    protectGuestPage();

    const params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "1") {
        showMessage("Account created. You can log in now.", "success");
    }

    const form = $("#loginForm");
    const button = $("#loginButton");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        showMessage("");
        setButtonLoading(button, true, "Login");

        try {
            const data = await apiRequest("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email: $("#email").value,
                    password: $("#password").value
                })
            });

            saveSession(data.token, data.user);
            redirectTo("dashboard.html");
        } catch (err) {
            showMessage(err.message);
        } finally {
            setButtonLoading(button, false, "Login");
        }
    });
}

function setupSignup() {
    protectGuestPage();

    const form = $("#signupForm");
    const button = $("#signupButton");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        showMessage("");
        setButtonLoading(button, true, "Create account");

        try {
            await apiRequest("/api/auth/signup", {
                method: "POST",
                body: JSON.stringify({
                    name: $("#name").value,
                    email: $("#email").value,
                    password: $("#password").value
                })
            });

            redirectTo("login.html?registered=1");
        } catch (err) {
            showMessage(err.message);
        } finally {
            setButtonLoading(button, false, "Create account");
        }
    });
}

function setupHome() {
    protectGuestPage();
}

function setupDashboard() {
    loadDashboard();

    $("#logoutButton").addEventListener("click", () => {
        clearSession();
        redirectTo("login.html");
    });
}

if (page === "home") setupHome();
if (page === "login") setupLogin();
if (page === "signup") setupSignup();
if (page === "dashboard") setupDashboard();
