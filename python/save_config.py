import os
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# Ruta al archivo
config_dir = os.path.join(app.root_path, 'config')

# Mapping para los datos de configuracion
@app.route('/save_config', methods=['POST'])
def save_config():
    data = request.get_json()

    # Guarda la info en el JSON
    config_path = os.path.join(app.root_path, 'config', 'config.json')
    with open(config_path, 'w') as f:
        json.dump(data, f)

    return jsonify({'success': True})
