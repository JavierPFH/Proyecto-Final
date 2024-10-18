from flask import Flask, request, jsonify
import pyodbc

app = Flask(__name__)

@app.route('/test_connection', methods=['POST'])
def test_connection():
    data = request.get_json()
    server = data['server']
    database = data['database']
    username = data['username']
    password = data['password']

    # Intenta conectar a SQL Server
    try:
        conn = pyodbc.connect(
            driver='{SQL Server}', # ODBC Driver 18 for SQL Server
            host=server,
            database=database,
            trusted_connection=True,
            user=username,
            password=password
        )
        # Codigo 200
        conn.close()
        return jsonify({'success': True}), 200
    
    except pyodbc.Error as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run()