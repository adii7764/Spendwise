const API_URL = "http://127.0.0.1:5000";

let currentId = null;
let deleteId = null;

// ➕ ADD
async function addExpense() {
    const title = document.getElementById("title").value;
    const amount = document.getElementById("amount").value;

    if (!title || !amount) return alert("Fill all fields");

    await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title, amount})
    });

    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";

    // ✅ SHOW ADD POPUP
    const modal = document.getElementById("addModal");
    modal.classList.add("show");

    setTimeout(() => {
        modal.classList.remove("show");
    }, 1200);

    loadExpenses();
}

// 📋 LOAD
async function loadExpenses() {
    const res = await fetch(`${API_URL}/expenses`);
    const data = await res.json();

    const list = document.getElementById("expenseList");
    list.innerHTML = "";

    data.forEach(exp => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span>${exp.title} - ₹${exp.amount}</span>
            <div>
                <button onclick="openModal(${exp.id}, '${exp.title}', ${exp.amount})">✏️</button>
                <button onclick="openDeleteModal(${exp.id})">🗑️</button>
            </div>
        `;

        list.appendChild(li);
    });
}

// ❌ DELETE MODAL
function openDeleteModal(id) {
    deleteId = id;
    document.getElementById("deleteModal").classList.add("show");
}

function closeDeleteModal() {
    document.getElementById("deleteModal").classList.remove("show");
}

async function confirmDelete() {
    await fetch(`${API_URL}/delete/${deleteId}`, {method: "DELETE"});
    closeDeleteModal();
    loadExpenses();
}

// ✏️ EDIT MODAL
function openModal(id, title, amount) {
    currentId = id;
    document.getElementById("editTitle").value = title;
    document.getElementById("editAmount").value = amount;

    document.getElementById("editModal").classList.add("show");
}

function closeModal() {
    document.getElementById("editModal").classList.remove("show");
}

async function updateExpense() {
    const title = document.getElementById("editTitle").value;
    const amount = document.getElementById("editAmount").value;

    await fetch(`${API_URL}/update/${currentId}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title, amount})
    });

    closeModal();
    loadExpenses();
}

async function showTotal() {
    const res = await fetch(`${API_URL}/expenses`);
    const data = await res.json();

    let total = 0;
    data.forEach(e => total += Number(e.amount));

    document.getElementById("totalDisplay").innerText = "Total: ₹" + total;
    document.getElementById("removeBtn").style.display = "inline";

    // 🔊 PLAY COIN SOUND
    const sound = document.getElementById("coinSound");
    sound.currentTime = 0; // restart sound
    sound.volume = 0.7; // set volume
    sound.play();
}

function clearTotal() {
    document.getElementById("totalDisplay").innerText = "";
    document.getElementById("removeBtn").style.display = "none";
}

// INIT
loadExpenses();