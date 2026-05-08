# 💰 SpendWise v3 — Personal Expense Tracker with Auth

A full-stack expense tracking web app with **user authentication**, category analytics, month filtering, and a polished dark UI.

## 🚀 Features

- 🔐 Register / Login with JWT authentication
- 👤 Each user sees only their own expenses
- 🗂️ 8 categories (Food, Travel, Shopping, Health, etc.)
- 📅 Date picker + month-wise filtering
- 📊 Doughnut chart — spending by category
- 🪙 Coin sound effect on adding expense
- 🧮 Live total & transaction count
- ✔️ Backend input validation + bcrypt password hashing
- 🎨 Modern dark UI — separate HTML / CSS / JS files

## 🛠️ Tech Stack

| Layer    | Tech                              |
|----------|-----------------------------------|
| Frontend | HTML, CSS, Vanilla JS             |
| Backend  | Python, Flask, Flask-CORS         |
| Auth     | JWT (PyJWT), bcrypt               |
| Database | SQLite                            |
| Charts   | Chart.js                          |

## 📁 Project Structure

```
SpendWise/
├── Frontend/
│   ├── auth.html      ← Login / Signup page
│   ├── auth.css
│   ├── auth.js
│   ├── index.html     ← Dashboard
│   ├── style.css
│   └── script.js
└── Backend/
    ├── app.py
    ├── create_db.py
    ├── requirements.txt
    └── database.db    ← auto-created on first run
```

## ⚙️ Setup & Run

### 1. Backend
```bash
cd Backend
pip install -r requirements.txt
python app.py
```
Server runs at `http://127.0.0.1:5000`

### 2. Frontend
Open `Frontend/auth.html` in your browser. Register an account and start tracking!

> Both backend terminal and frontend must be open simultaneously.

## 🌐 Deployment

- **Frontend** → [Vercel](https://vercel.com) — drag & drop the Frontend folder
- **Backend** → [Render](https://render.com) — connect GitHub, start command: `gunicorn app:app`

After deploying, update `API_URL` in both `auth.js` and `script.js` to your Render URL.

## 👨‍💻 Author

**Aditya Pandey** — [GitHub](https://github.com/adii7764) · [LinkedIn](https://linkedin.com/in/aditya-pandey-a6a958334)
