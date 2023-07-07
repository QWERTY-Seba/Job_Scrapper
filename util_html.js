export function AgregarBotonesDescarte(){
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

export function descartar_oferta(id_oferta){
	try {
		let temp_div = document.querySelector(`li[data-occludable-job-id="${id_oferta}"]`)
		document.querySelector('#divDescartados_id').appendChild(temp_div)    
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

    if(anos_minimo_experiencia == 0 || anos_minimo_experiencia == 1 ){
        divOferta.style.backgroundColor = 'rgba(0, 255, 0, 0.1)'
        divOferta.style.order = '-1'
    }else if(anos_minimo_experiencia >= 2){
        divOferta.style.backgroundColor = 'rgba(255,0,0, 0.1)'
        divOferta.style.order = '1'
    }
}