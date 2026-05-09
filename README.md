# 💰 SpendWise

> A full-stack personal expense tracker with user authentication, category analytics, and real-time spending insights.

![Status](https://img.shields.io/badge/Status-Live-brightgreen) ![Python](https://img.shields.io/badge/Python-3.x-blue) ![Flask](https://img.shields.io/badge/Flask-3.x-black) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

## 🌐 [Live Demo → Click to Open App](https://spendwise-sigma-beige.vercel.app)

---

## 🚀 Features

- 🔐 **User Authentication** — Register and login with JWT tokens and bcrypt password hashing
- 👤 **Private Data** — Each user sees only their own expenses, fully isolated
- 🗂️ **8 Categories** — Food, Travel, Shopping, Health, Entertainment, Education, Bills, Other
- 📅 **Date Tracking** — Add dates and filter expenses by month
- 📊 **Spending Chart** — Doughnut chart showing category-wise spending breakdown
- 📄 **Export to CSV** — Download expenses as a spreadsheet
- 📑 **Export to PDF** — Download a styled PDF expense report
- 🪙 **Coin Sound** — Satisfying sound effect when adding an expense
- 🧮 **Live Stats** — Real-time total spent and transaction count
- 🎨 **Dark UI** — Clean, modern dark theme with smooth animations

---

## 🛠️ Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript     |
| Backend  | Python, Flask, Flask-CORS           |
| Auth     | JWT (PyJWT), bcrypt                 |
| Database | SQLite                              |
| Charts   | Chart.js                            |
| Export   | jsPDF, jsPDF-AutoTable              |
| Hosting  | Vercel (Frontend), Render (Backend) |

---

## 📁 Project Structure

```
SpendWise/
├── Frontend/
│   ├── auth.html        ← Login / Signup page
│   ├── auth.css         ← Auth styles
│   ├── auth.js          ← Auth logic
│   ├── index.html       ← Dashboard
│   ├── style.css        ← Dashboard styles
│   └── script.js        ← CRUD, chart, export logic
│
├── Backend/
│   ├── app.py           ← Flask API
│   ├── create_db.py     ← DB initializer
│   ├── requirements.txt
│   └── database.db      ← Auto-created
│
└── README.md
```

---

## ⚙️ Local Setup

```bash
git clone https://github.com/adii7764/Spendwise.git
cd Spendwise/Backend
pip install -r requirements.txt
python create_db.py
python app.py
```

Then open `Frontend/auth.html` in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Create account | No |
| POST | `/login` | Login, get token | No |
| GET | `/me` | Current user info | Yes |
| GET | `/expenses` | List expenses | Yes |
| POST | `/add` | Add expense | Yes |
| PUT | `/update/<id>` | Edit expense | Yes |
| DELETE | `/delete/<id>` | Delete expense | Yes |
| GET | `/summary` | Category totals | Yes |

---

## 🌐 Deployment

| Part | Platform | URL |
|------|----------|-----|
| Frontend | Vercel | [spendwise-sigma-beige.vercel.app](https://spendwise-sigma-beige.vercel.app) |
| Backend | Render | [spendwise-backend-mtvk.onrender.com](https://spendwise-backend-mtvk.onrender.com) |

> Backend on Render free tier may take 30-50s to wake up on first visit.

---

## 🔮 Future Improvements

- [ ] Budget limits per category with alerts
- [ ] Recurring expense support
- [ ] Mobile responsive design
- [ ] Dark / Light theme toggle

---

## 👨‍💻 Author

**Aditya Pandey**

[![GitHub](https://img.shields.io/badge/GitHub-adii7764-black?logo=github)](https://github.com/adii7764)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Aditya%20Pandey-blue?logo=linkedin)](https://linkedin.com/in/aditya-pandey-a6a958334)

---

## 📄 License

MIT License
