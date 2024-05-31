//import { components } from "./ui-componentes"


chrome.runtime.sendMessage({type : "ATTACH_DEBUGGER"})
chrome.runtime.sendMessage({ type: 'sendDOMParser', DOMParser: DOMParser() });

//CREAR ALGO QUE RECIBA MENSAJES DESDE EL BACKGROUND Y LOS ALMACENE HASTA QUE LA PAGINA ESTE COMPLETA
//PERMITIR QUE SE MANEJEN OTROS MENSAJES COMO LAS ACCIONES DENTRO DEL HTML, TAMBIEN ENCARGARSE DE AGREGAR BOTONES

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
   
    elemento_ofertas;
    datos_ofertas;

    adjuntar_listener(){
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.message === "Transform data") {
              //REALIZAR EL PROCESAMIENTO Y ESPERAR PARA 



            }
          });


    }
    

    procesar_ofertas(){
        let nodos = []
        for(let oferta of datos_ofertas){
            nodos.push(this.crear_nodo_oferta(oferta))

        }

        //ACA ESPERAR, ORDENAR Y APLICAR CAMBIOS
    }

    crear_nodo_oferta(oferta){
        let nodo = document.createDocumentFragment();

        //LEER OFERTA Y CREAR ETIQUETAS BOTONES, DATOS EXPERENCIA 
        nodo.appendChild(this.crear_elemento_boton(components.buttonDescarte))
        nodo.appendChild(this.crear_elemento_boton(components.buttonBuscar))
        nodo.appendChild(this.crear_elemento_boton(components.buttonDescarteEmpresa))
        

        if(oferta.anos_experiencia){


        }


        return nodo
    }


    en_actualizacion_de_pagina(){
        //ACTUALIZAR SELECTORES O ELEMENTOS O BORRAR DATOS
        //ADJUNTAR A EVENTO
        //ANALIZAR SI LOS BOTONES DESAPARECEN Y VOLVER A ADJUNTARLOS

    }
//LAS FUNCIONES DEL CONTENT SCRIPT NO PUEDEN SER LLAMADAS DESDE EL BACKGROUND.JS UTILIZANDO EL EXECUTESCRIPT YA QUE EL CONTENT SCRIPT NO ES UN MODULO
//ALTERNATIVA https://stackoverflow.com/questions/18039277/chrome-call-function-in-content-scripts-from-background-js
    crear_elemento_boton(Enumcomponente){

        let boton = document.createElement('button')
        //CREAR CLASSES ADAPTADAS A CADA PAGINA
        boton.classList.add(...Enumcomponente.clases);
        boton.innerHTML = Enumcomponente.html
        boton.addEventListener("click",  Enumcomponente.onclick )
        return boton
        
    }

    crear_lista_experiencias(oferta){
        let ulLista = document.createElement('ul')
        for(let experiencia of oferta.anos_experiencia){
            ulLista.innerHTML += '<li>' + experiencia + '</li>'

        }
        return ulLista
    }



    
//Las funciones no pueden llamarse entre si, hay que repetir codigo
//Cambiar para agregar multiples a la vez, recibir una array en vez de texto + tipo_etiqueta
    agregar_etiqueta(id_oferta, texto, tipo_etiqueta){
        //BUSCAR SI YA EXISTE UN CONTAINER PARA ESA OFERTA, SINO CREALA
        try {
            let temp_div = document.querySelector(`li[data-occludable-job-id="${id_oferta}"]`)
            let div_lista_keywords = temp_div.querySelector('div.ListaKeywords')
            
            if(div_lista_keywords == undefined){
                div_lista_keywords = document.createElement('div')
                div_lista_keywords.classList = 'ListaKeywords'
                temp_div.appendChild(div_lista_keywords)

            }


            let elemento = document.createElement('div')
            elemento.innerHTML = `
            <div class="tag alert-danger" style="display: inline-block;padding: 5px 10px; border-radius: 10px;font-weight: bold; ${tipo_etiqueta.css}">
            ${tipo_etiqueta.icono}${texto}
            </div>`
            div_lista_keywords.appendChild(elemento)        
        } catch (error) {
            console.log('Error al agregar etiqueta',id_oferta, error)
        }   
    }



 AgregarVentanaDebugger(tabId){
    let temp_div = document.createElement('div')
    temp_div.id = "ventana_debugger_jobscrapper"
    temp_div.innerHTML = `info de ventana y debugger, estado actual
    ${tabId}
    
    <button>
    	Reiniciar debugger
    </button>
    <button>
    	Agregar debugger
    </button>
    
    
    lista de requests
    <ul id="lista_de_requests">

    </ul>`
    document.body.append(temp_div)

}

  AgregarRequestProcesada(id_request, tiempo_ejecucion, nombre_funcion){
    let div_destino = document.querySelector('#ventana_debugger_jobscrapper')
   
    let temp_div = document.createElement('li')
    temp_div.classList.add("ventana_debugger_jobscrapper")
    temp_div.innerHTML = `<li class="request_procesada">
        <div class="top_request_procesada">
            ID ${id_request} <br>
            ${tiempo_ejecucion}ms <br>
            ${nombre_funcion}	
        </div>
        
        
        TIPO
        HORA DE LLEGADA 
        
        N DE ELEMENTOS 
        ERRORES
        </li>`
    div_destino.appendChild(temp_div)
   
   
}


  descartar_oferta(id_oferta){
	try {
		let temp_div = document.querySelector(`li[data-occludable-job-id="${id_oferta}"]`)
        
        div_descarte = document.querySelector('#divDescartados_id')

        if(div_descarte == null || div_descarte == undefined){
            div_descarte = document.createElement('div') 
            div_descarte.style.border = '1px solid red'
            div_descarte.id = 'divDescartados_id'
        
            paginador = document.querySelector(".jobs-search-results-list__pagination")
            paginador.after(div_descarte)
        }
        
        div_descarte.appendChild(temp_div)    
	} catch (error) {
		console.log('Error al descartar oferta id',id_oferta, error)
	}   
	
}

  insertarAñosExpDiv(id_oferta, lista_resultados, anos_minimo_experiencia){
	let divOferta = document.querySelector(`li[data-occludable-job-id="${id_oferta}"]`)
    let lista_oferta = document.querySelector('ul.scaffold-layout__list-container')
	let ulLista = document.createElement('ul')
	ulLista.innerHTML = lista_resultados
	console.log('Div años exp',divOferta,ulLista)
	divOferta.appendChild(ulLista)

    //ESTO ES COMO COLUMNA CONDICIONAL DE POWERBI, CUANDO ATRIBUTO == .. THEN
    /*
        SE PODRIA PONER LOS ELEMENTOS DE LA PAGINA COMO INTERFACES Y CREAR UNA API TIPO LAS TRANSFORMACIONES DE POWER BI PARA REALIZAR MODIFICACIONES
        ENTRE ESOS ELEMENTOS Y HTML
    
    
    */
    if(anos_minimo_experiencia == 0 || anos_minimo_experiencia == 1 ){
        divOferta.style.backgroundColor = 'rgba(0, 255, 0, 0.2)'
        divOferta.style.order = '-1'
    }else if(anos_minimo_experiencia >= 2){
        divOferta.style.backgroundColor = 'rgba(255,0,0, 0.2)'
        divOferta.style.order = '1'
    }
}









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




function computrabajo(){
    //DESACTIVAR TODOS LOS CLICKS DE LAS OFERTAS, 

    //EXTRAER LAS IDS DE TODAS LAS OFERTAS

    //BUSCAR TODAS LAS OFERTAS EN BASE INTERNA

    //FILTRAR POR OFERTAS QUE NO ESTAN EN BASE

    //MANDAR FETCH POR CADA OFERTA

    //ALMACENAR EN BASE LOCAL

    //CAMBIAR AGREGAR EL CLICK PARA MOSTRAR LA OFERTA

    //AGREGAR FUNCION PARA TRANSFORMAR LA REQUEST A EL HTML


}