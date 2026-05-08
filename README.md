# 💰 SpendWise

> A full-stack personal expense tracker with user authentication, category analytics, and real-time spending insights.

![SpendWise Dashboard](https://img.shields.io/badge/Status-Live-brightgreen) ![Python](https://img.shields.io/badge/Python-3.x-blue) ![Flask](https://img.shields.io/badge/Flask-3.x-black) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

---

## 🚀 Features

- 🔐 **User Authentication** — Register & login with JWT tokens, bcrypt password hashing
- 👤 **Private Data** — Each user sees only their own expenses
- 🗂️ **8 Categories** — Food, Travel, Shopping, Health, Entertainment, Education, Bills, Other
- 📅 **Date Tracking** — Add dates and filter expenses by month
- 📊 **Spending Chart** — Doughnut chart showing category-wise breakdown
- 🪙 **Coin Sound** — Satisfying sound effect on adding expense
- 🧮 **Live Stats** — Real-time total spent and transaction count
- ✏️ **Full CRUD** — Add, edit, delete expenses with modals
- ✔️ **Input Validation** — Both frontend and backend validation
- 🎨 **Dark UI** — Clean, modern dark theme with animations

---

## 🛠️ Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript   |
| Backend  | Python, Flask, Flask-CORS         |
| Auth     | JWT (PyJWT), bcrypt               |
| Database | SQLite                            |
| Charts   | Chart.js                          |

---

## 📁 Project Structure

```
SpendWise/
├── Frontend/
│   ├── auth.html        ← Login / Signup page
│   ├── auth.css         ← Auth page styles
│   ├── auth.js          ← Auth logic (login, register)
│   ├── index.html       ← Main dashboard
│   ├── style.css        ← Dashboard styles
│   └── script.js        ← Dashboard logic
│
├── Backend/
│   ├── app.py           ← Flask API with all routes
│   ├── create_db.py     ← Database initializer
│   ├── requirements.txt ← Python dependencies
│   └── database.db      ← SQLite DB (auto-created)
│
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.x
- pip

### 1. Clone the repository
```bash
git clone https://github.com/adii7764/Spendwise.git
cd Spendwise
```

### 2. Install dependencies
```bash
cd Backend
pip install -r requirements.txt
```

### 3. Initialize the database
```bash
python create_db.py
python app.py
```
Server runs at `http://127.0.0.1:5000`

### 4. Open the frontend
Open `Frontend/auth.html` in your browser → Register an account → Start tracking!

> ⚠️ Keep the backend terminal open while using the app.

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Create new account | ❌ |
| POST | `/login` | Login and get JWT token | ❌ |
| GET | `/me` | Get logged-in user info | ✅ |
| GET | `/expenses` | Get all expenses (supports `?month=YYYY-MM`) | ✅ |
| POST | `/add` | Add new expense | ✅ |
| PUT | `/update/<id>` | Update an expense | ✅ |
| DELETE | `/delete/<id>` | Delete an expense | ✅ |
| GET | `/summary` | Category-wise totals for chart | ✅ |

---

## 🌐 Deployment

| Part | Platform | Command |
|------|----------|---------|
| Backend | [Render](https://render.com) | `gunicorn app:app` |
| Frontend | [Vercel](https://vercel.com) | Drag & drop Frontend folder |

> After deploying, update `API_URL` in `auth.js` and `script.js` to your Render backend URL.

---

## 🔮 Future Improvements

- [ ] Export expenses to CSV/PDF
- [ ] Budget limits per category with alerts
- [ ] Recurring expense support
- [ ] Mobile app (React Native)
- [ ] Email notifications for budget overspend

---

## 👨‍💻 Author

**Aditya Pandey**

[![GitHub](https://img.shields.io/badge/GitHub-adii7764-black?logo=github)](https://github.com/adii7764)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Aditya%20Pandey-blue?logo=linkedin)](https://linkedin.com/in/aditya-pandey-a6a958334)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
