
chrome.runtime.sendMessage({type : "ATTACH_DEBUGGER"})



  

var claseTestSeba = new class {
   
    divDescartados;
    divListaOfertas;
     
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async init(){
        this.divDescartados = document.createElement('div') 
        this.divListaOfertas = document.querySelector('.scaffold-layout__list-container')
        this.divDescartados.style.border = '1px solid red'
        this.divDescartados.id = 'divDescartados_id'

        const max_tries = 50;
        var max_tries_iterador = 0
        let paginador;
        while( (paginador == null || paginador == undefined) && max_tries_iterador <= max_tries){
            paginador = document.querySelector('.jobs-search-results-list__pagination')
            await this.sleep(200)
            max_tries_iterador += 1
        }
        paginador.after(this.divDescartados)
        
        paginador.onclick = () => {this.divDescartados.innerHTML = ''}
        
    }  

    /*
        formato lista_resultado 
        [['experiencia 15', 15],['años 4'],4    ]
    */
    insertarAñosExpDiv(id_oferta, lista_resultados){
        let divOferta = document.querySelector(`li[data-occludable-job-id="${id_oferta}"]`)
        let ulLista = document.createElement('ul')
        ulLista.innerHTML = lista_resultados
        console.log('Div años exp',divOferta,ulLista)

        divOferta.appendChild(ulLista)
    }

    descartarOferta(id_oferta){
        try {
            let temp_div = document.querySelector(`li[data-occludable-job-id="${id_oferta}"]`)
            console.log('Div a descartar', temp_div, id_oferta)
            this.divDescartados.appendChild(temp_div)    
        } catch (error) {
            console.log('Error al descartar oferta id',id_oferta, error)
        }   
        
    }
}

window.addEventListener("load", (event) => {
    claseTestSeba.init()
});



window.addEventListener('message', function(event) {
    // Only accept messages from the same frame
    if (event.source !== window) {
      return;
    }
    var message = event.data;
    // Only accept messages that we know are ours
    if (typeof message !== 'object' || message === null) {
      return;
    }
    chrome.runtime.sendMessage(event.data);
  });




var pagina_actual_pool_elementos = []

function buscar_div_por_idEmpleo(id_empleo){

}


/*
etiqueta
tipo descarte
tecnologia dentro de oferta
alguna de las variables destacadas, esta en ingles, salario, ubicacion etc.


*/
//Agregar detalles como cantidad de años requeridos, lenguaje requerido
function agregar_etiqueta(){}
//Agregar botones... o cualquier elemento de HTML interactivo, no css
function agregar_interaccion(){}

//Cambiar css de un elemento general, Li de la oferta
function modificar_css(){}

