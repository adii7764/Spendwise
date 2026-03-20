from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

import os

def get_db_connection():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(BASE_DIR, "database.db")

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/add', methods=['POST'])
def add_expense():
    data = request.json
    conn = get_db_connection()
    conn.execute('INSERT INTO expenses (title, amount) VALUES (?, ?)',
                 (data['title'], data['amount']))
    conn.commit()
    conn.close()
    return jsonify({"message": "added"})

@app.route('/expenses')
def get_expenses():
    conn = get_db_connection()
    data = conn.execute('SELECT * FROM expenses').fetchall()
    conn.close()
    return jsonify([dict(row) for row in data])

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_expense(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM expenses WHERE id=?', (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "deleted"})

@app.route('/update/<int:id>', methods=['PUT'])
def update_expense(id):
    data = request.json
    conn = get_db_connection()
    conn.execute('UPDATE expenses SET title=?, amount=? WHERE id=?',
                 (data['title'], data['amount'], id))
    conn.commit()
    conn.close()
    return jsonify({"message": "updated"})

if __name__ == "__main__":
    app.run(debug=True)