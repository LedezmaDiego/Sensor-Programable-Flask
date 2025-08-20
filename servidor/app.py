import sqlite3
from flask import Flask, g, jsonify, request, url_for
from math import ceil

def dict_factory(cursor, row):
 """Arma un diccionario con los valores de la fila."""
 fields = [column[0] for column in cursor.description]
 return {key: value for key, value in zip(fields, row)}


def abrirConexion():
  if 'db' not in g:
     g.db = sqlite3.connect("sensor_valores.sqlite")
     g.db.row_factory = dict_factory
  return g.db


def cerrarConexion(e=None):
   db = g.pop('db', None)
   if db is not None:
       db.close()


app = Flask(__name__)
app.teardown_appcontext(cerrarConexion)
resultados_por_pag = 10


@app.route("/")
def hello_world():
     return "<p>Hello, World!</p>"

@app.route("/api/sensor", methods=['POST'])
def sensor():
   db = abrirConexion()
   datos = request.json
   nombre = datos['nombre']
   valor = datos['valor']
   print(f"Nombre: {nombre}, Valor: {valor}")
   db.execute("INSERT INTO valores (nombre, valor) VALUES (?, ?);", (nombre, valor))
   db.commit()
   cerrarConexion()
   return jsonify({'resultado': 'ok'}), 200

# Ruta para ver los valores de los sensores en JSON con paginado
@app.route("/api/valores_paginado")
def valores_paginado():
   args = request.args
   pagina = int(args.get('page', '1'))
   descartar = (pagina-1) * resultados_por_pag
   db = abrirConexion()
   cursor = db.cursor()
   cursor.execute("SELECT COUNT(*) AS cant FROM valores;")
   cant = cursor.fetchone()['cant']
   paginas = ceil(cant / resultados_por_pag)

   if pagina < 1 or pagina > paginas:
      cerrarConexion()
      return f"Página inexistente: {pagina}", 400

   cursor.execute("SELECT id, nombre, valor, fecha_hora FROM valores LIMIT ? OFFSET ?;", (resultados_por_pag, descartar))
   lista = cursor.fetchall()
   cerrarConexion()
   siguiente = None 
   anterior = None
   if pagina > 1:
      anterior = url_for('valores_paginado', page=pagina-1, _external=True)
   if pagina < paginas:
      siguiente = url_for('valores_paginado', page=pagina+1, _external=True)
   info = { 'count': cant, 'pages': paginas, 'next': siguiente, 'prev': anterior }
   res = { 'info': info, 'results': lista }
   return res, 200

@app.route("/api/valores/<int:id>")
def valor(id):
   db = abrirConexion()
   cursor = db.execute("SELECT id, nombre, valor, fecha_hora FROM valores WHERE id = ?; ", (id,))
   fila = cursor.fetchone()
   cerrarConexion()
   if fila is None:
      return f"Valor inexistente (id: {id})", 404
   
   res = {
      'id': fila['id'],
      'nombre': fila['nombre'],
      'valor': fila['valor'],
      'fecha_hora': fila['fecha_hora'],
      'url': url_for('valor', id=id, _external=True)
   }
   return res, 200