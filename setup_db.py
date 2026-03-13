import pymysql
try:
    conn = pymysql.connect(host='localhost', user='root', password='Test@123')
    cursor = conn.cursor()
    cursor.execute('CREATE DATABASE IF NOT EXISTS gym_db')
    conn.close()
    print("Database gym_db created successfully.")
except Exception as e:
    print(f"Error: {e}")
