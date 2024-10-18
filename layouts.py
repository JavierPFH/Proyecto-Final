from flask import send_file, Blueprint

layout_bp = Blueprint('layout', __name__)

@layout_bp.route('/download_prestacionservicio')
def download_prestacionservicio():
    try:
        # Obtiene el último diseño válido y lo guarda en un archivo temporal
        # df.to_excel('caminho_do_arquivo.xlsx', index=False)

        # Envia un archivo al cliente
        return send_file('layout\prestacionservicio.xlsx', download_name='prestacionservicio.xlsx', as_attachment=True)
    except Exception as e:
        print(str(e))
        return 'Error al bajar el layout', 500
    

@layout_bp.route('/download_prestacion')
def download_prestacion():
    try:
        return send_file('layout\prestacion.xlsx', download_name='prestacion.xlsx', as_attachment=True)
    except Exception as e:
        print(str(e))
        return 'Error al bajar el layout', 500
    
@layout_bp.route('/download_lotes')
def download_lotes():
    try:
        return send_file('layout\lotes.xlsx', download_name='lotes.xlsx', as_attachment=True)
    except Exception as e:
        print(str(e))
        return 'Error al bajar el layout', 500