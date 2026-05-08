from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

def get_db_connection():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(BASE_DIR, "database.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT DEFAULT 'Other',
            date TEXT DEFAULT (date('now'))
        )
    ''')
    conn.commit()
    conn.close()

# ➕ ADD
@app.route('/add', methods=['POST'])
def add_expense():
    data = request.json
    title = data.get('title', '').strip()
    amount = data.get('amount')
    category = data.get('category', 'Other').strip()
    date = data.get('date', '')

    if not title:
        return jsonify({"error": "Title is required"}), 400
    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError()
    except (TypeError, ValueError):
        return jsonify({"error": "Amount must be a positive number"}), 400

    conn = get_db_connection()
    conn.execute(
        'INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)',
        (title, amount, category, date)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "added"}), 201

# 📋 GET ALL (with optional month filter)
@app.route('/expenses')
def get_expenses():
    month = request.args.get('month')
    conn = get_db_connection()
    if month:
        data = conn.execute(
            "SELECT * FROM expenses WHERE strftime('%Y-%m', date) = ? ORDER BY date DESC",
            (month,)
        ).fetchall()
    else:
        data = conn.execute('SELECT * FROM expenses ORDER BY date DESC').fetchall()
    conn.close()
    return jsonify([dict(row) for row in data])

# 📊 SUMMARY by category (for chart)
@app.route('/summary')
def get_summary():
    month = request.args.get('month')
    conn = get_db_connection()
    if month:
        data = conn.execute(
            "SELECT category, SUM(amount) as total FROM expenses WHERE strftime('%Y-%m', date) = ? GROUP BY category",
            (month,)
        ).fetchall()
    else:
        data = conn.execute(
            'SELECT category, SUM(amount) as total FROM expenses GROUP BY category'
        ).fetchall()
    conn.close()
    return jsonify([dict(row) for row in data])

# ❌ DELETE
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_expense(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM expenses WHERE id=?', (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "deleted"})

# ✏️ UPDATE
@app.route('/update/<int:id>', methods=['PUT'])
def update_expense(id):
    data = request.json
    title = data.get('title', '').strip()
    amount = data.get('amount')
    category = data.get('category', 'Other').strip()
    date = data.get('date', '')

    if not title:
        return jsonify({"error": "Title is required"}), 400
    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError()
    except (TypeError, ValueError):
        return jsonify({"error": "Amount must be a positive number"}), 400

    conn = get_db_connection()
    conn.execute(
        'UPDATE expenses SET title=?, amount=?, category=?, date=? WHERE id=?',
        (title, amount, category, date, id)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "updated"})

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
