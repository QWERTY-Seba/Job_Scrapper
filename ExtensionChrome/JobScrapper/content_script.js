chrome.runtime.sendMessage({type : "ATTACH_DEBUGGER"})


var claseTestSeba = new class {
   
    divDescartados;
    divListaOfertas;
    styleSheet; 
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async init(){
        this.divDescartados = document.createElement('div') 
        this.divListaOfertas = document.querySelector('.scaffold-layout__list-container')
        this.divDescartados.style.border = '1px solid red'
        this.divDescartados.id = 'divDescartados_id'

        //Buscar la hoja de css en la pagina
        this.styleSheet = Array.from(document.styleSheets).find(e => e.href === null);
        this.styleSheet.insertRule(`.job-card-container__apply-method > div, .job-card-list__insight > div {display : none}`)
        this.styleSheet.insertRule(`.boton_descarte_oferta{position : absolute;top : 47px;right : 12px;}`)


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


function AgregarBotonesDescarte(){
    document.querySelectorAll('.jobs-search-results__list-item').forEach(e => {
        let boton = document.createElement('button')
        boton.classList += 'boton_descarte_oferta artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary'
        boton.innerHTML = 
        `<li-icon aria-hidden="true" type="close" class="artdeco-button__icon" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
        <path d="M14 3.41L9.41 8 14 12.59 12.59 14 8 9.41 3.41 14 2 12.59 6.59 8 2 3.41 3.41 2 8 6.59 12.59 2z"></path>
      </svg></li-icon>`


        boton.onclick = function(){
                            window.postMessage({type : "DESCARTAR_OFERTA",id_oferta : e.dataset.occludableJobId}) ;
                            claseTestSeba.descartarOferta(e.dataset.occludableJobId)
                        }
        e.appendChild(boton)
    })

}

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
