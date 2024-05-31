let config = {
    locateFile: () => "../lib/sql-wasm.wasm",
};

function escapeQuotes(value) {
    if (typeof value === 'string') {
        // Escape single quotes by replacing them with two single quotes
        return value.replace(/'/g, "''");
    }
    return value;
}

var db;

initSqlJs(config).then(async function (SQL) {
    // SQL.js is now initialized, and you can use it
    try{
    db = new SQL.Database();

    // Create a table and insert some data
    const createTableQuery = `CREATE TABLE IF NOT EXISTS oferta (
    id_compania INT,
    id_oferta INT,
    cargo VARCHAR(255),
    empresa VARCHAR(255),
    localizacion_empleo VARCHAR(255),
    fecha_publicacion INT,
    cantidad_solicitudes INT,
    descripcion_empleo TEXT,
    link_externo_incripcion VARCHAR(255),
    link_oferta VARCHAR(255),
    tipo_jornada VARCHAR(50),
    tipo_modalidad VARCHAR(50),
    tipo_contrato VARCHAR(50),
    fecha_recoleccion_registro INT,
    pagina_recoleccion VARCHAR(255),
    oferta_repetida BOOLEAN,
    nombre_publicador VARCHAR(255),
    link_empresa VARCHAR(255),
    aplicado BOOLEAN,
    tipo_solicitud VARCHAR(50),
    info_empresa TEXT,
    oferta_descartada BOOLEAN,
    coordenadas_empresa VARCHAR(50),
    fecha_descarte INT,
    
    tipo_descarte_expirada BOOLEAN,
    tipo_descarte_tecnologias BOOLEAN,
    tipo_descarte_annos_exp BOOLEAN,
    tipo_descarte_cargo BOOLEAN,
    tipo_descarte_distancia_oficina BOOLEAN,
    tipo_descarte_manual BOOLEAN,
    tipo_descarte_empresa BOOLEAN,





    esta_en_ingles BOOLEAN,
    salario INT,
    experiencia_minima INT,
    fecha_expiracion INT,
    preguntas_empleo TEXT,
    rubro_empresa VARCHAR(255),
    aptitudes TEXT,
    anos_experiencia INT,
    cantidad_vacantes INT)`

    db.run(createTableQuery);

    await chrome.storage.local.get(null, e => {

    
        const datos = Object.values(e)
        
        
        
        var columns = Object.keys(modelo_oferta).join(' ,')
    

        //AGREGAR COMPATIBILIDAD CON OBJECTOS O LISTAS
    //SI ES LISTA, OCUPAR LA LLAVE
    //SI ES OBJETO, COMBINAR LLAVE MAS LLAVE INTERNA
        for(let algo of datos){
            var inserts = ""

            
                const values = Object.keys(modelo_oferta).map(key => {
                    const value = algo[key];

                    if(key.startsWith("tipo_descarte_")){
                        let temp = key.substring(14)
                        return `'${algo["tipo_descarte"][temp]}'`
                    }

                    if (value === null || value === undefined || Array.isArray(value)) {
                        return 'NULL';
                    }
                    else{
                        return `'${escapeQuotes(value)}'`
                    }
                }).join(', ');
    
                    inserts += `INSERT INTO oferta (${columns}) VALUES (${values});`
            
            try{
                db.exec(inserts)
            }catch(error){
                console.log('error en insert', error.message, inserts)
            }
            
        }
        
    })

    }catch(error){
    	console.log('asd', error.message)
    
    }
});



function populateTable(values) {
    var tabla = document.querySelector('#res_sql');
    tabla.innerHTML = '';

    var tr_columnas = document.createElement('tr')

    for(var columna of values[0].columns){
        var th = document.createElement('th');
        th.textContent = columna;
        tr_columnas.appendChild(th);

    }

    tabla.append(tr_columnas)
    
    for(var lista_valores of values[0].values){
        
        var tr = document.createElement('tr');

        for(var valor of lista_valores ){
            var td = document.createElement('td');
            td.textContent = valor;
            tr.appendChild(td);
        }
        
        
        tabla.appendChild(tr);
    };

      
    
  }


var editor = null;

document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelector('button[page="1"]').addEventListener('click', () => {
        let a = document.querySelector('div[page="1"]')
        a.hidden = !a.hidden
    })

    document.querySelector('button[page="2"]').addEventListener('click', () => {
        let a = document.querySelector('div[page="2"]')
        a.hidden = !a.hidden
    })
    ace.require("ace/ext/language_tools");
    ace.require("ace/mode/sql");
    editor = ace.edit("editor");
    editor.getSession().setMode("ace/mode/sql");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
    });
   

    document.querySelector('#exec_sql').addEventListener('click', async () => {
        let valor = await db.exec(editor.getValue())
        console.log(valor)
        populateTable(valor)
        

    })

    
    


}, false);







const modelo_oferta = {
        id_compania : 'INT',
        id_oferta : 'INT',
        cargo : 'VARCHAR(255)',
        empresa : 'VARCHAR(255)',
        localizacion_empleo : 'VARCHAR(255)',
        fecha_publicacion : 'INT',
        cantidad_solicitudes : 'TEXT',
        descripcion_empleo : 'TEXT',
        link_externo_incripcion : 'VARCHAR(255)',
        link_oferta : 'VARCHAR(255)',
        tipo_jornada : 'VARCHAR(50)',
        tipo_modalidad : 'VARCHAR(50)',
        tipo_contrato : 'VARCHAR(50)',
        fecha_recoleccion_registro : 'INT',
        pagina_recoleccion : 'VARCHAR(255)',
        oferta_repetida : 'BOOLEAN',
        nombre_publicador : 'VARCHAR(255)',
        link_empresa : 'VARCHAR(255)',
        aplicado : 'BOOLEAN',
        tipo_solicitud : 'VARCHAR(50)',
        info_empresa : 'TEXT',
        oferta_descartada : 'BOOLEAN',
        coordenadas_empresa : 'VARCHAR(50)',
        fecha_descarte : 'INT',
        
        tipo_descarte_expirada: 'BOOLEAN',
        tipo_descarte_tecnologias: 'BOOLEAN',
        tipo_descarte_annos_exp: 'BOOLEAN',
        tipo_descarte_cargo: 'BOOLEAN',
        tipo_descarte_distancia_oficina: 'BOOLEAN',
        tipo_descarte_manual: 'BOOLEAN',
        tipo_descarte_empresa: 'BOOLEAN',

        esta_en_ingles : 'BOOLEAN',
        salario : 'INT',
        experiencia_minima : 'INT',
        fecha_expiracion : 'INT',
        preguntas_empleo : 'TEXT',
        rubro_empresa : 'VARCHAR(255)',
        aptitudes : 'TEXT',
        anos_experiencia : 'TEXT',
        cantidad_vacantes : 'INT'
	
}





