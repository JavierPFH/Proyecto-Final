import logging
import pandas as pd
from flask import Blueprint, request, flash,redirect,url_for
from conn import PrestacionServicio,Prestacion,Lotes, Session

cargadatos_bp = Blueprint('cargadatos', __name__)
logging.basicConfig(level=logging.DEBUG, filename='import.log', filemode='a', format='%(asctime)s - %(levelname)s - %(message)s')

@cargadatos_bp.route('/carga_prestacionservicio', methods=['POST'])
def carga_prestacionservicio():
    try:
        file = request.files['importFile']
        if file.filename is not None and file.filename.endswith('.xlsx'):
            df = pd.read_excel(file,dtype={'idCatalogo': str, 'idPrestacion':str, 'idServicio':str, 'agendable':str, 'duracion':str, 'codcentro':str, 'departamental':str, 'incremento':str, 'decremento':str})
            logging.info(f'df: {df}')
            
            if all(col in df.columns for col in ['idCatalogo', 'idPrestacion', 'idServicio', 'agendable', 'duracion', 'codCentro', 'departamental', 'incremento', 'decremento']):
                for _, row in df.iterrows():
                    IdCatalogo = row['idCatalogo']
                    IdPrestacion = row['idPrestacion']
                    IdServicio = row['idServicio']
                    Agendable = row['agendable']
                    Duracion = row['duracion']
                    CodCentro = row['codCentro']
                    Departamental = row['departamental']
                    Incremento = row['incremento']
                    Decremento = row['decremento']
                    Activo = 1
                    logging.info(f'row: {IdCatalogo, IdPrestacion, IdServicio, Activo, Agendable, Duracion, CodCentro, Departamental, Incremento, Decremento}')
                    
                    if pd.isna(IdCatalogo):
                        IdCatalogo = ''
                        
                    try:
                        session = Session()
                        print(IdCatalogo, IdPrestacion, IdServicio, Agendable, Duracion, CodCentro, Departamental, Incremento, Decremento)  
                        new_prestacionservicio = PrestacionServicio(IdCatalogo, IdPrestacion, IdServicio, Activo, Agendable, Duracion, CodCentro, Departamental, Incremento, Decremento)
                        logging.info(f'new_prestacionservicio: {new_prestacionservicio.__dict__}')
                        session.add(new_prestacionservicio)
                        session.commit()
                        session.close()

                    except Exception as e:
                        flash('Ocorreu um erro ao inserir os dados no banco de dados. Por favor, tente novamente.', 'error')
                        logging.error(str(e))

                flash('Dados importados com sucesso!', 'success')
                logging.info(f'registro importado con exito: {new_prestacionservicio.__dict__}')
            else:
                flash('Colunas necessárias não encontradas no arquivo Excel.', 'error')
        else:
            flash('Formato de arquivo inválido. Por favor, selecione um arquivo Excel (.xlsx).', 'error')
    except Exception as e:
        flash('Ocorreu um erro ao importar os dados. Por favor, tente novamente.', 'error')
        logging.error(str(e))

    return redirect(url_for('prestacionservicio_page'))



@cargadatos_bp.route('/carga_prestacion', methods=['POST'])
def carga_prestacion():
    try:
        file = request.files['importFile']
        if file.filename is not None and file.filename.endswith('.xlsx'):
            df = pd.read_excel(file,dtype={'IdCatalogo': str,'IdPrestacion': str,'IdFamilia':str,'IdSubfamilia':str,'Descripcion':str,'UnidadMedida':str, 'Duracion': str})
            logging.info(f'df: {df}')
            
            if all(col in df.columns for col in ['IdCatalogo', 'IdPrestacion', 'IdFamilia', 'IdSubfamilia', 'Descripcion', 'UnidadMedida', 'Duracion']):
                for _, row in df.iterrows():
                    IdCatalogo = row['IdCatalogo']
                    IdPrestacion = row['IdPrestacion']
                    IdFamilia = row['IdFamilia']
                    IdSubfamilia = row['IdSubfamilia']
                    Descripcion = row['Descripcion']
                    UnidadMedida = row['UnidadMedida']
                    Duracion = row['Duracion']
                    Activo = 1
                    logging.info(f'row: {IdCatalogo, IdPrestacion, IdFamilia, IdSubfamilia,Activo, Descripcion, UnidadMedida, Duracion}')
                    
                    if pd.isna(IdCatalogo):
                        IdCatalogo = ''
                    if pd.isna(UnidadMedida):
                        UnidadMedida = ''

                    try:
                        session = Session()
                        new_prestacion = Prestacion(IdCatalogo, IdPrestacion, IdFamilia, IdSubfamilia,Activo,Descripcion,UnidadMedida,Duracion)

                        logging.info(f'new_prestacion: {new_prestacion.__dict__}')
                        session.add(new_prestacion)
                        session.commit()
                        session.close()

                    except Exception as e:
                        flash('Ocorreu um erro ao inserir os dados no banco de dados. Por favor, tente novamente.', 'error')
                        logging.error(str(e))

                flash('Dados importados com sucesso!', 'success')
                logging.info(f'registro importado con exito: {new_prestacion.__dict__}')
            else:
                flash('Colunas necessárias não encontradas no arquivo Excel.', 'error')
                logging.info(f'las columnas no son correspondientes IdCatalogo, IdPrestacion, IdFamilia, IdSubfamilia, Descripcion, UnidadMedida,Duracion')
        else:
            flash('Formato de arquivo inválido. Por favor, selecione um arquivo Excel (.xlsx).', 'error')
    except Exception as e:
        flash('Ocorreu um erro ao importar os dados. Por favor, tente novamente.', 'error')
        logging.error(str(e))

    return redirect(url_for('prestacion_page'))

@cargadatos_bp.route('/carga_lotes', methods = ['POST'])
def carga_Lotes():
    try:
        file = request.files['importFile']
        if file.filename is not None and file.filename.endswith('.xlsx'):
            df = pd.read_excel(file,dtype = {'Centro': str, 'Cod_Lote': str, 'Fecha_inicio': str, 'Fecha_fin': str, 'Descripcion': str, 'Servicio_Canario': str, 'Servicio_Compania': str})
            logging.info(f'df: {df}')

            # Comprobar que las columnas estan en el archivo de excel
            if all(columns in df.columns for columns in ['Centro', 'Cod_Lote', 'Fecha_inicio', 'Fecha_fin', 'Descripcion', 'Servicio_Canario', 'Servicio_Compania']):
                # Procesar los datos del excel y guardarlos en las columnas de la BBDD
                for _, row in df.iterrows():
                    Centro = row['Centro']
                    Cod_Lote = row['Cod_Lote']
                    Fecha_inicio_str =row['Fecha_inicio']
                    Fecha_fin_str = row['Fecha_fin']
                    Descripcion = row['Descripcion']
                    Servicio_Canario = row['Servicio_Canario']
                    Servicio_Compania = row['Servicio_Compania']
                    Activo = 1

                    logging.info(f'row: {Centro, Cod_Lote, Fecha_inicio_str, Fecha_fin_str, Descripcion, Servicio_Canario, Servicio_Compania}')
                    print(df)

                    # Fecha_inicio = datetime.strptime(Fecha_inicio_str, '%Y-%M-%d %H:%M:%S.%f')
                    # Fecha_fin = datetime.strptime(Fecha_fin_str, '%Y-%M-%d %H:%M:%S.%f')
                    
                    # Comprobar la info enviada
                    if pd.isna(Cod_Lote):
                        Cod_Lote = ''
                    try:
                        session = Session()
                        new_lote = Lotes(Centro, Cod_Lote, Fecha_inicio_str, Fecha_fin_str, Descripcion, Servicio_Canario, Servicio_Compania, Activo)
                        logging.info(f'new_lote: {new_lote.__dict__}')

                        session.add(new_lote)

                        print('Depuracion 3')
                        session.commit()
                        
                        print('Depuracion 4')
                        session.close()

                    except Exception as e:
                        flash ('Error al insertar los datos en la base de datos'+ str(e))
                        print(e)
                        #registra el error
                        logging.error(str(e))

                flash('Datos insertados')
                logging.info(f'Registro importado: {new_lote.__dict__}')

            else:
                flash('Columnas de la tabla no encontradas en al archivo')
                logging.info('Las columnas de la tabla son: Centro, Cod_lote, Fecha_inicio, Fecha_fin, Descripcion, Servicio_Canario, Servicio_Compania')
        else:
            flash('Archivo no valido', 'Es necesario un archivo con formato .xlsx')

    except Exception as e:
        flash('Error al importar los datos, intentelo de nuevo')
        logging.error(str(e))
    
    return redirect(url_for('lotes_page'))