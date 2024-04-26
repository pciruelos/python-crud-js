from flask import Flask, request, jsonify, send_file
from psycopg2 import connect, extras
from cryptography.fernet import Fernet

app = Flask(__name__)
key = Fernet.generate_key()

host = 'localhost'
port = 5432
dbname = 'pythoncruddb'
username = 'postgres'
password = 'mysecretpassword'


def get_connection():
    conn = connect(host=host, port=port, dbname=dbname,
                   user=username, password=password)
    return conn


# //testing connection
#
# @app.get('/')
# def home():
#     conn = get_connection()
#     cur = conn.cursor()
#     cur.execute("SELECT 1 + 1")
#     result = cur.fetchone()
#     print(result)
#     return 'hola'
@app.get('/')
def home():
    return send_file('static/index.html')


@app.get('/api/users')
def get_users():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM users')
    users = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(users)


@app.post('/api/users')
def create_users():
    new_user = request.get_json()
    username = new_user['username']
    email = new_user['email']
    password = Fernet(key).encrypt(bytes(new_user['password'], 'utf-8'))

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO users (username, email, password) VALUES (%s, %s, %s) RETURNING *',
                (username, email, password))
    new_created_user = cur.fetchone()
    print(new_created_user)

    conn.commit()
    cur.close()
    conn.close()

    return jsonify(new_created_user)


@app.get('/api/users/<id>')
def get_user(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM users WHERE id = %s', (id,))
    user = cur.fetchone()
    if user is None:
        return jsonify({'message': 'user not found'}), 404
    cur.close()
    conn.close()
    return jsonify(user)


@app.delete('/api/users/<id>')
def delete_user(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('DELETE FROM users WHERE id = %s RETURNING *', (id))
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if user is None:
        return jsonify({'message': 'user not found'}), 404
    return jsonify(user)


@app.put('/api/users/<id>')
def update_user(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    selected_user = request.get_json()
    username = selected_user['username']
    email = selected_user['email']
    password = Fernet(key).encrypt(bytes(selected_user['password'], 'utf-8'))
    cur.execute('UPDATE users SET username = %s, email = %s, password = %s WHERE id = %s RETURNING *',
                (username, email, password, id))
    user_updated = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if user_updated is None:
        return jsonify({'message': 'user not found'}), 404
    return jsonify(user_updated)

if __name__ == '__main__':
    app.run(debug=True)
