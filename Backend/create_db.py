import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database.db")

conn = sqlite3.connect(DB_PATH)

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
        category TEXT    DEFAULT 'Other',
        date     TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
''')

conn.commit()
conn.close()
print("Database created successfully!")