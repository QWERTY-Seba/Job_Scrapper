MAX_DATES_DISPLAYED = 40
var BASE_DATA = {};

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
          },
          {
            label: 'Ofertas Descartadas',
            data: Object.entries(datos_fecha_registro).map(a => a[1].is_discarted),
            backgroundColor: 'rgb(255, 99, 132)',
          }
        ]
      };
    
     new Chart("myChart", {
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
        }
      }
      });

}




function get_descartes_por_fecha(numero_dias){
    let datos_fecha_registro = getLastXDates(numero_dias)
    Object.entries(BASE_DATA).forEach(i => {
        let date = new Date(i[1].fecha_recoleccion_registro).toISOString().split('T')[0]
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

function buscar_en_base(){
        var searchInput = document.getElementById('search_input');
        var searchTerm = searchInput.value.toLowerCase();
        var resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
      
        Object.entries(BASE_DATA).forEach(e => {
          var cargo = e[1].cargo.toLowerCase();
          var idOferta = e[1].id_oferta;
          var empresa = e[1].empresa;
          var localizacionEmpleo = e[1].localizacion_empleo;
          var fechaPublicacion = e[1].fecha_publicacion;

          if (cargo.includes(searchTerm)) {
            var resultItem = document.createElement('div');
            resultItem.classList.add('job-card');

            var title = document.createElement('div');
            title.classList.add('job-title');
            title.textContent = cargo;
            resultItem.appendChild(title);

            var job_id = document.createElement('div');
            job_id.textContent = idOferta;
            resultItem.appendChild(job_id);

            var company = document.createElement('div');
            company.classList.add('company');
            company.textContent = 'Company: ' + empresa;
            resultItem.appendChild(company);

            var location = document.createElement('div');
            location.classList.add('location');
            location.textContent = 'Location: ' + localizacionEmpleo;
            resultItem.appendChild(location);

            var postingDate = document.createElement('div');
            postingDate.classList.add('posting-date');
            postingDate.textContent = 'Posted: ' + fechaPublicacion;
            resultItem.appendChild(postingDate);

            resultsDiv.appendChild(resultItem);
          }
        })
            
}
var searchTimer = null;
function delayedSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(buscar_en_base, 500); // Adjust the delay time (in milliseconds) as needed
}

async function inicializar(){
    await chrome.storage.local.get().then((ofertas) => {
        Object.assign(BASE_DATA, ofertas)
    })
    document.querySelector("#search_button").onclick = buscar_en_base
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

