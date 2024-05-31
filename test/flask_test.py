from flask import Flask, render_template_string, send_from_directory, abort, request, make_response
import os

app = Flask(__name__)

@app.route('/home')
def home():
    # Directorio donde se buscarán los archivos
    directory = 'resp'
    
    # Listar todos los archivos en el directorio
    files = os.listdir(directory)

    # Crear botones para cada archivo
    buttons_html = ''.join([f'<button onclick="fetchFile(\'{file}\')">{file}</button><br>' for file in files])

    # HTML con botones y espacio para mostrar mensajes
    html_content = f'''
<html>
<head>
    <title>Home Page</title>
    <script>
        const headers = new Headers();
        headers.append('Cache-Control', 'no-cache');
        function fetchFile(filename) {{
            fetch('/get-file/' + filename, {{ method: 'GET', headers: headers }})
            .then(response => response.text())
            .then(data => {{
                document.getElementById('message').innerText = 'Contenido del archivo ' + filename + ': ' + data;
            }})
            .catch(error => {{
                document.getElementById('message').innerText = 'Error al obtener el archivo ' + filename;
            }});
        }}

        function shutdownServer() {{
            fetch('/shutdown', {{ method: 'POST' }})
            .then(response => {{
                if (response.ok) {{
                    document.getElementById('message').innerText = 'Servidor apagado';
                }} else {{
                    document.getElementById('message').innerText = 'Error al apagar el servidor';
                }}
            }});
        }}
    </script>
</head>
<body>
    <div style="margin-left: 50px">
    <h1>Archivos en /resp</h1>
    {buttons_html}
    <button onclick="shutdownServer()">Apagar Servidor</button>
    <p id="message"></p>
    <div>
</body>
</html>
'''

    return render_template_string(html_content)

@app.route('/get-file/<sitio>', methods=['GET'])
def get_file(sitio):
    # Directorio donde se buscarán los archivos
    directory = 'resp'
    
    # Construir la ruta completa del archivo
    file_path = os.path.join(directory, sitio)
    
    # Verificar si el archivo existe
    if os.path.isfile(file_path):
        # Si el archivo existe, devolver su contenido con encabezados de control de caché
        response = make_response(send_from_directory(directory, sitio,cache_timeout =0))
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        return response
    else:
        # Si el archivo no existe, devolver un error 404
        abort(404, description="File not found")

@app.route('/shutdown', methods=['POST'])
def shutdown():
    # Función para apagar el servidor
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        abort(500, description="No se puede apagar el servidor")
    func()
    return 'Servidor apagado'

if __name__ == '__main__':
    # Asegúrate de que el directorio de archivos exista
    if not os.path.exists('resp'):
        os.makedirs('resp')
    
    app.run(debug=True)
