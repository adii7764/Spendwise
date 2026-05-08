from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3, os, jwt, bcrypt
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
CORS(app)

SECRET_KEY = "spendwise_secret_2025"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database.db")

# ─── DB ───────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            name     TEXT    NOT NULL,
            email    TEXT    NOT NULL UNIQUE,
            password TEXT    NOT NULL
        );
        CREATE TABLE IF NOT EXISTS expenses (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id  INTEGER NOT NULL,
            title    TEXT    NOT NULL,
            amount   REAL    NOT NULL,
            category TEXT    DEFAULT "Other",
            date     TEXT    DEFAULT (date("now")),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    ''')
    conn.commit()
    conn.close()

# ─── AUTH MIDDLEWARE ──────────────────────────────
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            return jsonify({"error": "Token missing"}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = data["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except Exception:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated

# ─── AUTH ROUTES ──────────────────────────────────
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    name  = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    try:
        conn = get_db()
        conn.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, hashed))
        conn.commit()
        user = conn.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
        conn.close()
        token = jwt.encode({"user_id": user["id"], "exp": datetime.utcnow() + timedelta(days=7)}, SECRET_KEY, algorithm="HS256")
        return jsonify({"token": token, "name": user["name"]}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already registered"}), 409

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
    conn.close()

    if not user or not bcrypt.checkpw(password.encode(), user["password"].encode()):
        return jsonify({"error": "Invalid email or password"}), 401

    token = jwt.encode({"user_id": user["id"], "exp": datetime.utcnow() + timedelta(days=7)}, SECRET_KEY, algorithm="HS256")
    return jsonify({"token": token, "name": user["name"]})

# ─── EXPENSE ROUTES ───────────────────────────────
@app.route("/add", methods=["POST"])
@token_required
def add_expense():
    data = request.json
    title    = data.get("title", "").strip()
    amount   = data.get("amount")
    category = data.get("category", "Other").strip()
    date     = data.get("date", "")

    if not title:
        return jsonify({"error": "Title is required"}), 400
    try:
        amount = float(amount)
        if amount <= 0: raise ValueError()
    except (TypeError, ValueError):
        return jsonify({"error": "Amount must be a positive number"}), 400

    conn = get_db()
    conn.execute("INSERT INTO expenses (user_id, title, amount, category, date) VALUES (?,?,?,?,?)",
                 (request.user_id, title, amount, category, date))
    conn.commit()
    conn.close()
    return jsonify({"message": "added"}), 201

@app.route("/expenses")
@token_required
def get_expenses():
    month = request.args.get("month")
    conn = get_db()
    if month:
        data = conn.execute(
            "SELECT * FROM expenses WHERE user_id=? AND strftime('%Y-%m', date)=? ORDER BY date DESC",
            (request.user_id, month)
        ).fetchall()
    else:
        data = conn.execute(
            "SELECT * FROM expenses WHERE user_id=? ORDER BY date DESC", (request.user_id,)
        ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in data])

@app.route("/summary")
@token_required
def get_summary():
    month = request.args.get("month")
    conn = get_db()
    if month:
        data = conn.execute(
            "SELECT category, SUM(amount) as total FROM expenses WHERE user_id=? AND strftime('%Y-%m', date)=? GROUP BY category",
            (request.user_id, month)
        ).fetchall()
    else:
        data = conn.execute(
            "SELECT category, SUM(amount) as total FROM expenses WHERE user_id=? GROUP BY category",
            (request.user_id,)
        ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in data])

@app.route("/update/<int:id>", methods=["PUT"])
@token_required
def update_expense(id):
    data = request.json
    title    = data.get("title", "").strip()
    amount   = data.get("amount")
    category = data.get("category", "Other").strip()
    date     = data.get("date", "")

    if not title:
        return jsonify({"error": "Title is required"}), 400
    try:
        amount = float(amount)
        if amount <= 0: raise ValueError()
    except (TypeError, ValueError):
        return jsonify({"error": "Amount must be a positive number"}), 400

    conn = get_db()
    conn.execute(
        "UPDATE expenses SET title=?, amount=?, category=?, date=? WHERE id=? AND user_id=?",
        (title, amount, category, date, id, request.user_id)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "updated"})

@app.route("/delete/<int:id>", methods=["DELETE"])
@token_required
def delete_expense(id):
    conn = get_db()
    conn.execute("DELETE FROM expenses WHERE id=? AND user_id=?", (id, request.user_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "deleted"})

@app.route("/me")
@token_required
def get_me():
    conn = get_db()
    user = conn.execute("SELECT name, email FROM users WHERE id=?", (request.user_id,)).fetchone()
    conn.close()
    return jsonify(dict(user))

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
