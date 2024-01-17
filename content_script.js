
chrome.runtime.sendMessage({type : "ATTACH_DEBUGGER"})



//ESTO TALVES DEBA MOVERSE 
const selectores_de_dominios = {
    "linkedin" : {
       lista_ofertas : ".scaffold-layout__list-container",
       paginador : ".jobs-search-results-list__pagination",
       elemento_oferta : "li[data-occludable-job-id='%']"     
    },
    "computrabajo" : {
        lista_ofertas : "#offersGridOfferContainer",
        paginador : "div.dFlex.vm_fx.tj_fx.mtB",
        elemento_oferta : "article[data-id='%']"     

    }

}

const dominio = window.location.host.match(/(?<=\.)\w+(?=\.com)/)
const selector_usar = selectores_de_dominios[dominio]

var claseTestSeba = new class {
   
    divDescartados;
    divListaOfertas;
    
    
    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /*
    crear Div
    modificar css div
    asignar id
    hacer append
    
    */

    async init(){

        console.log("LLAMANDO INIT,SE EJECUTA X PAGINA?")
        this.divListaOfertas = document.querySelector(selector_usar.lista_ofertas)
        this.divDescartados = document.createElement('div') 
        this.divDescartados.style.border = '1px solid red'
        this.divDescartados.id = 'divDescartados_id'

        let paginador; //DIV DE LISTA DE PAGINAS SIGUIENTES 1 2 3 4 5...
        //NO SE CREA HASTA QUE SE LLEGA AL FONDO
        let conteo = 0
        while(paginador == null || paginador == undefined){
            //AVERIGUAR SI EL CODIGO SE EJECUTA AUN CUANDO LA PAGINA NO ESTE ACTIVA
            //EJECUTAR ALGUN SCRIPT ANTES DE ESTO QUE LLEGUE AL FINAL DE LA PAGINA
            //CREAR UN MODO APARTE QUE SEA SOLO PARA SCRAPPING, NO MODIFICAR NADA

            //REREVISAR ESTO POR OPTIMIZACION DE RENDIMIENTO
            conteo += 1
            paginador = document.querySelector(selector_usar.paginador)
            await this.sleep(300)
        }

        console.log(`Se busco el paginador ${conteo} veces antes de que aparecio`)
        paginador.after(this.divDescartados)
        
        paginador.onclick = () => {this.divDescartados.innerHTML = ''}
        
    }  

    /*
        formato lista_resultado 
        [['experiencia 15', 15],['años 4'],4    ]
    */
    insertarAñosExpDiv(id_oferta, lista_resultados){
        let divOferta = document.querySelector(selector_usar.elemento_oferta.replace('%', id_oferta))
        let ulLista = document.createElement('ul')
        ulLista.innerHTML = lista_resultados
        console.log('Div años exp',divOferta,ulLista)

        divOferta.appendChild(ulLista)
    }

    descartarOferta(id_oferta){
        try {
            let temp_div = document.querySelector(selector_usar.elemento_oferta.replace('%', id_oferta))
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

