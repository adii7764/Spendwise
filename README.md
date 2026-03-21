# 💰 Spendwise – Expense Tracker

Spendwise is a simple and modern full-stack expense tracker that helps users manage and track their daily expenses efficiently.

---

## 🚀 Features

* ➕ Add expenses
* ✏️ Edit expenses
* 🗑️ Delete expenses
* 📊 View total expenses
* 🎨 Clean UI with animations
* 🔔 Popup confirmations (Add / Edit / Delete)
* 🔊 Coin sound on total calculation

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Python (Flask)
* SQLite

---

## 📁 Project Structure

```
Spendwise/
│
├── Backend/
│   ├── app.py
│   ├── create_db.py
│   ├── database.db
│   └── requirements.txt
│
├── Frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── coin.mp3
```

---

## ⚙️ How to Run Locally

### 🔹 1. Clone the repository

```
git clone https://github.com/adii7764/Spendwise.git
cd Spendwise
```

---

### 🔹 2. Run Backend

```
cd Backend
pip install -r requirements.txt
python create_db.py
python app.py
```

Backend runs at:

```
http://127.0.0.1:5000
```

---

### 🔹 3. Run Frontend

* Open `Frontend/index.html`
* OR use Live Server in VS Code

---

## 🌐 API Endpoints

| Method | Endpoint     | Description      |
| ------ | ------------ | ---------------- |
| POST   | /add         | Add expense      |
| GET    | /expenses    | Get all expenses |
| PUT    | /update/<id> | Update expense   |
| DELETE | /delete/<id> | Delete expense   |

---
## 📸 Preview

### 🏠 Main UI
<p align="center">
  <img src="https://github.com/user-attachments/assets/5d1cc4e0-2c37-4e4a-a310-5f7978adcd18" width="700">
</p>

### ✏️ Edit Popup
<p align="center">
  <img src="https://github.com/user-attachments/assets/f18fcdba-55c9-4f92-bbd3-0f928ae71f02"  width="400">
</p>

### ❌ Delete Confirmation
<p align="center">
  <img src="https://github.com/user-attachments/assets/898e5063-593b-4c8e-8627-38823b71348a" width="400">
  <p/>
  

## 🧠 Learnings

* Full-stack development
* REST API using Flask
* SQLite database integration
* UI/UX design with animations
* Debugging real-world errors

---

## 🤝 Contributing

Feel free to fork and improve this project!

---

## 📄 License

Free to use for learning and projects.

---

## 👨‍💻 Author

Aditya Pandey
