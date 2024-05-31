

//LAS FUNCIONES DEL CONTENT SCRIPT NO PUEDEN SER LLAMADAS DESDE EL BACKGROUND.JS UTILIZANDO EL EXECUTESCRIPT YA QUE EL CONTENT SCRIPT NO ES UN MODULO
//ALTERNATIVA https://stackoverflow.com/questions/18039277/chrome-call-function-in-content-scripts-from-background-js



export function AgregarBotonesDescarte(){
    document.querySelectorAll('.jobs-search-results__list-item').forEach(e => {
        let boton = document.createElement('button')
        boton.classList += 'boton_descarte_oferta artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary'
        boton.innerHTML = 
        `<li-icon aria-hidden="true" type="close" class="artdeco-button__icon" size="small">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" 
        data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
        <path d="M14 3.41L9.41 8 14 12.59 12.59 14 8 9.41 3.41 14 2 12.59 6.59 8 2 3.41 3.41 2 8 6.59 12.59 2z"></path>
      </svg></li-icon>`


        boton.onclick = function(){
                            window.postMessage({type : "DESCARTAR_OFERTA",id_oferta : e.dataset.occludableJobId}) ;
                            claseTestSeba.descartarOferta(e.dataset.occludableJobId)
                        }
        e.appendChild(boton)
    })

}

export function AgregarBotonesBusqueda(){
    document.querySelectorAll('.jobs-search-results__list-item').forEach(e => {
        let boton = document.createElement('button')
        boton.classList += 'boton_buscar_oferta artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary'
        boton.innerHTML = 
        `<svg style="color:rgba(0,0,0,0.6)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="search-small" data-supported-dps="16x16" fill="currentColor">
        <path d="M14.56 12.44L11.3 9.18a5.51 5.51 0 10-2.12 2.12l3.26 3.26a1.5 1.5 0 102.12-2.12zM3 6.5A3.5 3.5 0 116.5 10 3.5 3.5 0 013 6.5z"></path>
      </svg>`


        boton.onclick = function(){
                            window.postMessage({type : "BUSCAR_OFERTA",id_oferta : e.dataset.occludableJobId}) ;
                        }
        e.appendChild(boton)
    })
}
//Las funciones no pueden llamarse entre si, hay que repetir codigo
//Cambiar para agregar multiples a la vez, recibir una array en vez de texto + tipo_etiqueta
export function agregar_etiqueta(id_oferta, texto, tipo_etiqueta){
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

export function Agregar_baneo_en_lugar(){

    
    document.querySelectorAll(".jobs-search-results__list-item").forEach(e => {
        let boton = document.createElement("button")
        boton.onclick = () => {window.postMessage({type : "DESCARTAR_EMPRESA",id_oferta : e.dataset.occludableJobId})}
        boton.innerText = "Descartar Empresa"
        e.appendChild(boton)

    })

}

export function AgregarVentanaDebugger(tabId){
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

export function AgregarRequestProcesada(id_request, tiempo_ejecucion, nombre_funcion){
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


export function descartar_oferta(id_oferta){
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

export function insertarAñosExpDiv(id_oferta, lista_resultados, anos_minimo_experiencia){
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