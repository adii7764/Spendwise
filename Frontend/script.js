const API_URL = "http://127.0.0.1:5000";

// ── AUTH GUARD ────────────────────────────────────
const token = localStorage.getItem("token");
if (!token) window.location.href = "auth.html";

function authHeaders() {
    return { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };
}

// ── COIN SOUND ────────────────────────────────────
function playCoin() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
}

// ── CATEGORY STYLES ───────────────────────────────
const CAT = {
    "🍔 Food":          { bg: "rgba(251,146,60,0.15)",  color: "#fb923c" },
    "🚌 Travel":        { bg: "rgba(96,165,250,0.15)",  color: "#60a5fa" },
    "🛍️ Shopping":      { bg: "rgba(244,114,182,0.15)", color: "#f472b6" },
    "💊 Health":        { bg: "rgba(52,211,153,0.15)",  color: "#34d399" },
    "🎮 Entertainment": { bg: "rgba(167,139,250,0.15)", color: "#a78bfa" },
    "📚 Education":     { bg: "rgba(251,191,36,0.15)",  color: "#fbbf24" },
    "🏠 Bills":         { bg: "rgba(248,113,113,0.15)", color: "#f87171" },
    "📦 Other":         { bg: "rgba(107,117,148,0.15)", color: "#6b7594" },
};

const CHART_COLORS = ["#7c6af7","#f7a26a","#4ade80","#f87171","#60a5fa","#fbbf24","#f472b6","#34d399"];

let currentEditId = null;
let deleteId      = null;
let pieChart      = null;

// ── INIT ──────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
    // Set today's date
    document.getElementById("date").value = new Date().toISOString().split("T")[0];

    // Set current month in filter
    const now = new Date();
    document.getElementById("monthFilter").value =
        `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;

    // Set user info from localStorage
    const name = localStorage.getItem("userName") || "User";
    document.getElementById("avatarLetter").textContent = name.charAt(0).toUpperCase();
    document.getElementById("dropdownName").textContent = name;

    // Fetch email from /me
    fetch(`${API_URL}/me`, { headers: authHeaders() })
        .then(r => r.json())
        .then(d => { document.getElementById("dropdownEmail").textContent = d.email || "—"; })
        .catch(() => {});

    loadAll();

    // Close user dropdown on outside click
    document.addEventListener("click", e => {
        if (!e.target.closest(".user-menu")) {
            document.getElementById("userDropdown").classList.remove("open");
        }
    });
});

function toggleUserMenu() {
    document.getElementById("userDropdown").classList.toggle("open");
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.href = "auth.html";
}

function getMonth() {
    return document.getElementById("monthFilter").value || "";
}

function showToast(msg, isError = false) {
    const t = document.getElementById("toast");
    t.textContent = (isError ? "❌ " : "✅ ") + msg;
    t.className = "toast show" + (isError ? " error" : "");
    setTimeout(() => t.className = "toast", 2800);
}

// ── LOAD ALL ──────────────────────────────────────
async function loadAll() {
    await Promise.all([loadExpenses(), loadChart()]);
}

// ── LOAD EXPENSES ─────────────────────────────────
async function loadExpenses() {
    const month = getMonth();
    const url   = month ? `${API_URL}/expenses?month=${month}` : `${API_URL}/expenses`;

    try {
        const res  = await fetch(url, { headers: authHeaders() });
        if (res.status === 401) { logout(); return; }
        const data = await res.json();
        const list = document.getElementById("expenseList");
        list.innerHTML = "";

        if (data.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <p>No expenses yet. Add your first one!</p>
                </div>`;
            document.getElementById("totalAmount").textContent = "₹0";
            document.getElementById("totalCount").textContent  = "0";
            document.getElementById("expenseCount").textContent = "0 items";
            return;
        }

        let total = 0;
        data.forEach(exp => {
            total += Number(exp.amount);
            const style   = CAT[exp.category] || CAT["📦 Other"];
            const emoji   = exp.category ? exp.category.split(" ")[0] : "📦";
            const catName = exp.category ? exp.category.split(" ").slice(1).join(" ") : "Other";
            const safeTitle = exp.title.replace(/'/g, "\\'").replace(/"/g, "&quot;");

            const li = document.createElement("div");
            li.className = "expense-item";
            li.innerHTML = `
                <div class="expense-left">
                    <div class="cat-icon" style="background:${style.bg};color:${style.color}">${emoji}</div>
                    <div class="expense-info">
                        <div class="expense-title">${exp.title}</div>
                        <div class="expense-meta">
                            <span class="cat-badge">${catName}</span>
                            <span>${exp.date || "—"}</span>
                        </div>
                    </div>
                </div>
                <div class="expense-right">
                    <div class="expense-amount">₹${Number(exp.amount).toLocaleString("en-IN",{minimumFractionDigits:0,maximumFractionDigits:2})}</div>
                    <div class="action-btns">
                        <button class="btn-icon btn-edit"   onclick='openEdit(${exp.id},"${safeTitle}",${exp.amount},"${exp.category}","${exp.date}")'>✏️</button>
                        <button class="btn-icon btn-delete" onclick="openDelete(${exp.id})">🗑️</button>
                    </div>
                </div>`;
            list.appendChild(li);
        });

        document.getElementById("totalAmount").textContent  = "₹" + total.toLocaleString("en-IN",{minimumFractionDigits:0,maximumFractionDigits:2});
        document.getElementById("totalCount").textContent   = data.length;
        document.getElementById("expenseCount").textContent = `${data.length} item${data.length!==1?"s":""}`;
    } catch {
        showToast("Could not load expenses", true);
    }
}

// ── CHART ─────────────────────────────────────────
async function loadChart() {
    const month = getMonth();
    const url   = month ? `${API_URL}/summary?month=${month}` : `${API_URL}/summary`;
    try {
        const res  = await fetch(url, { headers: authHeaders() });
        const data = await res.json();
        if (pieChart) pieChart.destroy();
        if (!data.length) return;
        const ctx = document.getElementById("pieChart").getContext("2d");
        pieChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: data.map(d => d.category),
                datasets: [{
                    data: data.map(d => d.total),
                    backgroundColor: CHART_COLORS.slice(0, data.length),
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { color: "#6b7594", font: { family:"DM Sans", size:11 }, boxWidth:10, padding:8 }
                    },
                    tooltip: {
                        callbacks: { label: ctx => ` ₹${ctx.raw.toLocaleString("en-IN")}` }
                    }
                },
                cutout: "65%"
            }
        });
    } catch {}
}

// ── ADD ───────────────────────────────────────────
async function addExpense() {
    const title    = document.getElementById("title").value.trim();
    const amount   = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date     = document.getElementById("date").value;

    if (!title)                        return showToast("Please enter a title", true);
    if (!amount || Number(amount) <= 0) return showToast("Enter a valid amount", true);
    if (!date)                         return showToast("Please select a date", true);

    try {
        const res = await fetch(`${API_URL}/add`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ title, amount: Number(amount), category, date })
        });
        if (res.ok) {
            document.getElementById("title").value  = "";
            document.getElementById("amount").value = "";
            document.getElementById("date").value   = new Date().toISOString().split("T")[0];
            playCoin();
            showToast("Expense added!");
            loadAll();
        } else {
            const err = await res.json();
            showToast(err.error || "Something went wrong", true);
        }
    } catch {
        showToast("Cannot reach server", true);
    }
}

// ── EDIT ──────────────────────────────────────────
function openEdit(id, title, amount, category, date) {
    currentEditId = id;
    document.getElementById("editTitle").value    = title;
    document.getElementById("editAmount").value   = amount;
    document.getElementById("editCategory").value = category;
    document.getElementById("editDate").value     = date;
    document.getElementById("editModal").classList.add("show");
}

function closeEdit() {
    document.getElementById("editModal").classList.remove("show");
}

async function updateExpense() {
    const title    = document.getElementById("editTitle").value.trim();
    const amount   = document.getElementById("editAmount").value;
    const category = document.getElementById("editCategory").value;
    const date     = document.getElementById("editDate").value;

    if (!title)                        return showToast("Title required", true);
    if (!amount || Number(amount) <= 0) return showToast("Valid amount required", true);

    try {
        const res = await fetch(`${API_URL}/update/${currentEditId}`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify({ title, amount: Number(amount), category, date })
        });
        if (res.ok) { closeEdit(); showToast("Expense updated!"); loadAll(); }
        else { const e = await res.json(); showToast(e.error || "Update failed", true); }
    } catch {
        showToast("Cannot reach server", true);
    }
}

// ── DELETE ────────────────────────────────────────
function openDelete(id) {
    deleteId = id;
    document.getElementById("deleteModal").classList.add("show");
}

function closeDelete() {
    document.getElementById("deleteModal").classList.remove("show");
}

async function confirmDelete() {
    try {
        await fetch(`${API_URL}/delete/${deleteId}`, { method: "DELETE", headers: authHeaders() });
        closeDelete();
        showToast("Expense deleted!");
        loadAll();
    } catch {
        showToast("Cannot reach server", true);
    }
}

// ── CLOSE MODALS ON OVERLAY CLICK ─────────────────
document.getElementById("editModal").addEventListener("click",   e => { if(e.target===e.currentTarget) closeEdit(); });
document.getElementById("deleteModal").addEventListener("click", e => { if(e.target===e.currentTarget) closeDelete(); });
