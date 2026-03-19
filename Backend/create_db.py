import sqlite3

conn = sqlite3.connect('database.db')

conn.execute('''
CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    amount REAL
)
''')

conn.close()

print("Database created!")