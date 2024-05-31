
MAX_DATES_DISPLAYED = 40
var BASE_DATA = {};
var columnas_unicas = []
var id_ventana_activa = 0 //Ventana se refiere a dashboard, donde se encontraran alojados los graficos
var graficos_actuales = {}
var secuencia_id_grafico = 0
var id_grafico_focus = 0 
var id_ultimo_panel_activo = 1
var secuencia_panel = 1


const tipos_graficos = {
    Line : "Line",
    Bar : "Bar",
    Horizontal_Bar : "Horizontal Bar",
    Pie : "Pie",
    Doughnut : "Doughnut",
    Polar_Area : "Polar",
    Radar : "Radar",
    Bubble : "Bubble",
    Scatter : "Scatter"
}

//Cambiar a un panel mannager???
function cambiar_panel(id){
  let temp_div = document.querySelector(`.panel_sql[data-id="${id}"]`)
  let last_active_panel = document.querySelector(`.panel_sql[data-id="${id_ultimo_panel_activo}"]`)
  
  last_active_panel.classList.remove("active")
  temp_div.classList.add("active")
  id_ultimo_panel_activo = id
   
}


document.querySelectorAll('.boton_cambiar_panel').forEach(e => {
  e.addEventListener('click', (ee) => {
    cambiar_panel(e.getAttribute("data-link"))
	})
})

function abrir_configuracion_grafico(id_grafico){
    //Cargar datos en un div
    console.log("grafico clickeado")
    let grafico = graficos_actuales[id_grafico]
    let sub_header_configuracion_grafico = document.querySelector('#sub_header_configuracion_grafico')
    console.log(grafico.data.labels, grafico.data.datasets)

    
    // sub_header_configuracion_grafico.children["option"].innerHTML = grafico["options"]
    // sub_header_configuracion_grafico.children["config"].innerHTML = grafico["config"]
    // sub_header_configuracion_grafico.children["listeners"].innerHTML = grafico["_listeners"]



}

const panel_graficos = document.getElementById('panel_graficos')

document.querySelectorAll('button.boton_crear_grafico').forEach(el => {
    el.addEventListener('click', (ev) => {
        let temp_canvas = document.createElement('canvas') 
        temp_canvas.id_grafico = secuencia_id_grafico        
        temp_canvas.classList.add('grafico_vacio','grafico')
        temp_canvas.tabIndex = 1

        let contexto = temp_canvas.getContext("2d");

        let tipo_grafico = el.attributes['tipo_grafico'].value

        graficos_actuales[secuencia_id_grafico] = crear_grafico_vacio(contexto, tipo_grafico)

        temp_canvas.onfocus = () => {abrir_configuracion_grafico(0)}
        
        panel_graficos.append(temp_canvas)
        //Leer si hay una seleccion y traer datos
        secuencia_id_grafico += 1
        
    })

})

function crear_grafico_vacio(contexto, tipo_grafico){
    var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            // invisible dataset
            {
                label: "",
                fillColor: "rgba(220,220,220,0.0)",
                strokeColor: "rgba(220,220,220,0)",
                pointColor: "rgba(220,220,220,0)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                // change this data values according to the vertical scale
                // you are looking for 
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            // your real chart here
            {
                label: "My dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            }
        ]
    };
    
    var options = {
        animation: false,
        type : tipo_grafico,
        data : data,
        scaleShowGridLines : true,
    
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        
        showTooltips: false
    };
    
    return new Chart(contexto, options);
    
    
}

function getLastXDates(x) {
  let dates = {};
  let today = new Date(); // Get the current date

  for (let i = 0; i < x; i++) {
    let date = new Date(today); // Create a new Date object for each iteration
    date.setDate(today.getDate() - i); // Subtract i days from the current date
    
    date_formated = date.toISOString().split('T')[0]
    dates[date_formated] = {
                            is_discarted : 0,
                            is_not_discarted : 0
                            }
  }

  return dates;
}



/*
PASOS A SEGUIR

CARGAR LOS DATOS 
INICIALIZAR LOS GRAFICOS 
ACTUALIZAR LOS DATOS DE LOS GRAFICOS

AL INTERACTUAR CON FORMULARIO 
ACTUALIZAR LOS DATOS DE LOS GRAFICOS

*/



function crear_grafico(datos_fecha_registro){
    var data = {
        labels: Object.keys(datos_fecha_registro),
        datasets: [
          {
            label: 'Ofertas No Descartadas',
            data: Object.entries(datos_fecha_registro).map(a => a[1].is_not_discarted),
            backgroundColor: 'rgb(75, 192, 192)',
            stack : "background"
          },
          {
            label: 'Ofertas Descartadas',
            data: Object.entries(datos_fecha_registro).map(a => a[1].is_discarted),
            backgroundColor: 'rgb(255, 99, 132)',
            stack : "background"
          }
        ]
      };
    
    const cchart = new Chart("myChart", {
        type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        },
        onClick: (e) => {
            var activePoints = cchart.getElementsAtEventForMode(e, 'point', cchart.options);
            
            if(activePoints.length == 0){
                console.log("No se clickeo una barra del grafico")
                return;
            }
            
            var firstPoint = activePoints[0];
            var label = firstPoint._xScale.ticks[firstPoint._index];
            buscar_en_base("fecha_publicacion_conv", label)
            

        }
      }
      });

}

//Filtrar la tabla a partir de los resultados que ya se estan mostrando
function sobre_filtrar_tabla(){

}

function get_descartes_por_fecha(numero_dias){
    let datos_fecha_registro = getLastXDates(numero_dias)
    Object.entries(BASE_DATA).forEach(i => {
        let date = new Date(i[1].fecha_publicacion).toISOString().split('T')[0]
        let fecha_registro = datos_fecha_registro[date] 
        
        if(fecha_registro){
            if(i[1].oferta_descartada || i[1].descartada){
                fecha_registro.is_discarted += 1
            }else{
                fecha_registro.is_not_discarted += 1
            }
        }
        
        
    })
    return datos_fecha_registro;
}


//Debe recibir una lista de atributos junto al objecto,
// devuelve un div que contiene N cantidad de columnas iguales a la cantidad de atributos recibidos

//Los elementos de la lista deberian poder recibir eventos como onclick, mostrar detalles de la oferta
//Agregar imagenes a las ofertas, y que el nombre de la empresa aparesca en el hover de la imagen
function objeto_a_filaTabla(objeto, lista_atributos){
    let temp_elem = document.createElement('tr')
    
    for(let atributo of lista_atributos){
        var sub_temp_elem = document.createElement('td');
        sub_temp_elem.classList.add(`dato_tabla_${atributo}`);
        sub_temp_elem.textContent = objeto[atributo];
        
        temp_elem.appendChild(sub_temp_elem);
    }
    return temp_elem
}



//Agregar criterios == != <= >= 
function buscar_en_base(atributo, valor){

        var resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
      
        //Transformar los objetos recibidos en un tipo de estructura que permita aplicar transformacion de datos mas facil
        Object.values(BASE_DATA).forEach(e => {
          var cargo = e.cargo.toLowerCase();
          var idOferta = e.id_oferta;
          var empresa = e.empresa;
          var localizacionEmpleo = e.localizacion_empleo;
          var fechaPublicacion = e.fecha_publicacion;
          
          let temp_date = new Date(fechaPublicacion).toISOString().split('T')[0]

          e["fecha_publicacion_conv"] = temp_date


          console.log("Buscando en base", atributo, valor, e[atributo])
          //Hacer que se guarden multiples cambios mientras se mantenga el foco en el menu.
          // luego apilar y aplicar cada cambio en los datos
          if (e[atributo].includes(valor)) {
            //Cambiar a una listbox estilo tabla dinamica excel
            let lista_atributos = ["cargo", "id_oferta","empresa", "localizacion_empleo", "fecha_publicacion" ]
            resultsDiv.appendChild(objeto_a_filaTabla(e, lista_atributos));

          }
        })
            
}


function buscar_con_input(){
    var searchInput = document.getElementById('search_input');
    var searchTerm = searchInput.value.toLowerCase();
    buscar_en_base("cargo", searchTerm)
}


var searchTimer = null;
//Esto para hacer consultas cada N tiempo despues de dejar de escribir, asi evitar muchas queries
function delayedSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(buscar_en_base, 500); // Adjust the delay time (in milliseconds) as needed
}
//Iterar base y extraer la estructura de datos base
async function inicializar(){
    await chrome.storage.local.get().then((ofertas) => {
        BASE_DATA = Object.values(ofertas)

    })

    const uniqueAttributes = new Set();
    for (const obj of BASE_DATA) {
        for (const attribute in obj) {
            uniqueAttributes.add(attribute);
        }
    }

    columnas_unicas = Array.from(uniqueAttributes);


    document.querySelector("#search_button").onclick = buscar_con_input
    document.querySelector("#search_input").oninput = delayedSearch
    crear_grafico(get_descartes_por_fecha(MAX_DATES_DISPLAYED))
}

inicializar()










/*
chrome.storage.local.get(null, e => {
    
    Object.entries(e).forEach(i => {
        for(const a of i){
            if(a[1].descartada == false){
                let divEmpleo = document.createElement('div')
                divEmpleo.className += 'oferta-elemento'
                divEmpleo.innerText = JSON.stringify(a[1])
                document.body.append(divEmpleo)
            }    
        }
        
    })
    
})
*/


/*
var empleos = {}
const carga_datos = chrome.storage.local.get().then(e => {
    for (const [key, lista_empleos] of Object.entries(e)){
        lista_empleos.forEach(empleo => {
            
            if(empleo.empresa == 'Revelo' || empleo.empresa == 'EPAM Anywhere'){
                return;
            }
            
            
            let temp_id = empleo.id_empleo
            if(empleos[temp_id] == null){
                empleos[temp_id] = {
                    descripcion_empleo : empleo.descripcion_empleo                   
                }   
            }  
        })
    }
    console.log('Carga de Datos desde Local Lista')
})


var elemt_title,  elemt_description, entries , elemt_selected_list, regex_flags, regex_pattern, lista_ofertas; 
var current  = 0;

window.onload = async function(){
    try{
        //await carga_datos;
        entries = Object.entries(empleos);
        
    }catch(error){
        console.log(error)
    }
    init_modelado()
    init_regex()
    document.getElementById('btn_crear_seleccion').onclick = Crear_Seleccion
    document.getElementById('btn_confirmar').onclick = Confirmar_Oferta
    document.getElementById('btn_probar').onclick = probarRegex


}


function init_modelado(){
    elemt_title = document.getElementById('job_id_title')
    elemt_description = document.getElementById('job_description')           
    
    
    current  = 0
    elemt_selected_list = document.getElementById('selected_list')  
    rellenar_Info()    
}

function init_regex(){
    regex_flags = document.getElementById("input_flags")
    regex_pattern = document.getElementById("input_regex")
    
    rellenar_Info_regex()

}

function rellenar_Info(){
    elemt_title.innerText = ''
    elemt_description.innerText = ''
    elemt_selected_list.innerHTML = '' 
    elemt_title.innerText = entries[current][0]
    elemt_description.innerText = entries[current][1].descripcion_empleo
}
     
 function Confirmar_Oferta() {  

    var result = Array.prototype.map.call(elemt_selected_list.querySelectorAll('li'), e => e.innerText)		
    entries[current][1].matches = result

    current += 1
    
    if(entries.length  == current){
        document.getElementById('cdf').style.pointerEvents = "none"
        elemt_title.innerText = ''
        elemt_description.innerText = ''
        elemt_selected_list.innerHTML = ''  
        return;
    }	

    rellenar_Info()  		
 }

function Crear_Seleccion() {
    let temp_elemt = document.createElement('li')
    temp_elemt.innerText = window.getSelection().toString()
    temp_elemt.style.cursor =  'pointer';
    temp_elemt.onclick = (event) => event.target.remove()
    elemt_selected_list.appendChild(temp_elemt)
}
          

async function rellenar_Info_regex(){
    var lista_regex = document.querySelector('body > #regex_div > ul')

    entries.forEach(e => {
        let temp_li = document.createElement('li')
        temp_li.classList += 'oferta_li'
        temp_li.innerHTML = `
        <a class="table-cell" href="https://www.linkedin.com/jobs/view/${e[0]}"><h4 class="id_oferta">${e[0]}</h4></a>
        <p class="table-cell li_text" style="max-height: 15px; overflow: hidden;"> ${e[1].descripcion_empleo} </p>
        <p class="table-cell resultado"></p>`


        temp_li.onclick = (event) => {event.target.style.maxHeight =   event.target.style.maxHeight == 'none' ? '15px' : 'none'}
        lista_regex.appendChild(temp_li)

    })
    lista_ofertas = document.querySelectorAll('body > #regex_div > ul > li')

}

function probarRegex(){
  	console.log('ejecutando regex con',regex_pattern.value,regex_flags.value)
    lista_ofertas = document.querySelectorAll('li:not(.quitada)')
    let regex = new RegExp( regex_pattern.value,regex_flags.value)
    let elemt_lista_ofertas = document.querySelector('#lista_ofertas')
    let aciertos_regex = 0
    let quitar_al_encontrar = document.getElementById('input_limpiar').checked

    lista_ofertas.forEach((e , i) => {
		let resp = regex.exec(e.querySelector('.li_text').innerText)
        if(resp){
            if(quitar_al_encontrar){
                e.classList.add('quitada')
            }
            e.querySelector('.resultado').innerText = resp[0]
            elemt_lista_ofertas.prepend(e)
            aciertos_regex += 1
        }
	})
    
    document.getElementById('contador_regex').innerText = aciertos_regex + '/' + entries.length
    console.log(regex,aciertos_regex)
}

*/

