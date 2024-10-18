from flask import Flask, request, jsonify
from sqlalchemy import and_,text
from conn import Lotes,Session
import math

app = Flask(__name__, template_folder='templates')

def search_lotes(CodLote, Centro, Activo, page):
    session = Session()
    registros_por_pagina = 50
    primeiro_registro = (page - 1) * registros_por_pagina

    query = session.query(Lotes).filter(
        and_(
            (Lotes.CodLote == CodLote) if CodLote else True,
            Lotes.Centro.contains(Centro) if Centro else True,
            Lotes.Activo == Activo
        )
    )
    print(query)
    total_registros = query.count()
    num_paginas = math.ceil(total_registros / registros_por_pagina)

    results = query.order_by(Lotes.CodLote).offset(primeiro_registro).limit(registros_por_pagina).all()

    session.close()

    return results, num_paginas

@app.route('/search_lotes')
def search_lotes_route():
    data = request.get_json()
    CodLote = data.get('CodLote')
    Centro = data.get('Centro')
    Activo = True
    
    page = int(request.args.get('page', '1'))

    results, num_paginas = search_lotes(CodLote, Centro, Activo, page)
    try:
        dict_results = []
        for row in results:
            dict_results.append({
            'IdLote': row.IdLote,
            'Centro': row.Centro,
            'CodLote' : row.CodLote,
            'Fecha_inicio': row.Fecha_inicio,
            'Fecha_fin': row.Fecha_fin,
            'Descripcion': row.Descripcion,
            'Servicio_Canario': row.Servicio_Canario,
            'Servicio_Compania': row.Servicio_Compania
        })
        
        return jsonify({'results': dict_results, 'page': page, 'num_pages': num_paginas})
    
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': ''}), 500

@app.route('/insert_lote', methods=['POST'])
def insert_lotes_route():
    data = request.get_json()
    Centro = data['Centro']
    CodLote = data['CodLote']
    Fecha_inicio = data['Fecha_inicio']
    Fecha_fin = data['Fecha_fin']
    Descripcion = data['Descripcion']
    Servicio_Canario = data['Servicio_Canario']
    Servicio_Compania = data['Servicio_Compania']
    Activo = 1

    try:
        session = Session()
        new_lote = Lotes(Centro, CodLote, Fecha_inicio, Fecha_fin, Descripcion, Servicio_Canario, Servicio_Compania,Activo)
        session.add(new_lote)
        session.commit()

        try:
            return jsonify({'success': True}), 200
        
        except Exception as e:
            print(e)
            return jsonify({'success': False, 'error': str(e)}), 500

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/update_lote', methods=['POST'])
def update_lotes_route():
    data = request.get_json()
    newCentro = data['newCentro']
    newCodLote = data['newCodLote']
    newFecha_inicio = data['newFecha_inicio']
    newFecha_fin = data['newFecha_fin']
    newDescripcion = data['newDescripcion']
    newServicioCanario = data['newServicioCanario']
    newServicioCompañia = data['newServicioCompañia']

    oldCentro = data['oldCentro']
    oldCodLote = data['oldCodLote']
    oldFecha_inicio = data['oldFecha_inicio']
    oldFecha_fin = data['oldFecha_fin']
    oldDescripcion = data['oldDescripcion']
    oldServicioCanario = data['oldServicioCanario']
    oldServicioCompañia = data['oldServicioCompañia']
    
    Activo = 2
    
    try:
        session = Session()
        lote = session.query(Lotes).filter(
            and_(
                Lotes.Centro == oldCentro,
                Lotes.CodLote == oldCodLote,
                Lotes.Fecha_inicio == oldFecha_inicio,
                Lotes.Fecha_fin == oldFecha_fin,
                text("convert(varchar, Descripcion) = :desc").params(desc=oldDescripcion),
                Lotes.Servicio_Canario == oldServicioCanario,
                Lotes.Servicio_Compania == oldServicioCompañia,
                Lotes.Activo == Activo
            )
        ).first()

        print (lote)

        if lote:
            lote.Centro = newCentro
            lote.CodLote = newCodLote
            lote.Fecha_inicio = newFecha_inicio
            lote.Fecha_fin = newFecha_fin
            lote.Descripcion = newDescripcion
            lote.Servicio_Canario = newServicioCanario
            lote.Servicio_Compania = newServicioCompañia
            lote.Activo = Activo

            session.commit()
            session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            return jsonify({'success': False, 'error': 'Lote not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        session.close()

@app.route('/delete_lote', methods=['POST'])
def delete_lotes_route():
    data = request.get_json()
    delIdLote = data['delIdLote']
    delCentro = data['delCentro']
    delCodLote = data['delCodLote']
    delFecha_inicio = data['delFecha_inicio']
    delFecha_fin = data['delFecha_fin']
    delDescripcion = data['delDescripcion']
    delServicioCanario = data['delServicioCanario']
    delServicioCompañia = data['delServicioCompañia']
    Activo = 3

    try:
        session = Session()

        # Utiliza la clase Lote en lugar de la variable local
        lote = session.query(Lotes).filter(
            and_(
                Lotes.IdLote == delIdLote,
                Lotes.Centro == delCentro,
                Lotes.CodLote == delCodLote,
                Lotes.Fecha_inicio == delFecha_inicio,
                Lotes.Fecha_fin == delFecha_fin,
                text("convert(varchar, Descripcion) = :desc").params(desc=delDescripcion),
                Lotes.Servicio_Canario == delServicioCanario,
                Lotes.Servicio_Compania == delServicioCompañia,
                Lotes.Activo == Activo
            )
        ).first()

        if lote:
            lote.Activo = Activo
            session.commit()
            session.close()

            return jsonify({'success': True}), 200
        else:
            session.close()
            return jsonify({'success': False, 'error': 'Lote not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500