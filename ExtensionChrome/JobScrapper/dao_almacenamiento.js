/*
DAO chrome storage 


*/

export function regex_pruba(){
	let resultado_regex = 'id_oferta;resultado\n';
let match;
let regex = /\d{1,3}\s+((?:\w+\s*){1,8})/guim
chrome.storage.local.get(null, lista => {
    
    Object.entries(lista).forEach(oferta => {
        
        while((match = regex.exec(oferta[1].descripcion_empleo) ) !== null){
            let resultado = match[1]
            resultado = resultado.replace(';',':')
            resultado = resultado.replace('\n',' ')
            resultado_regex = resultado_regex.concat(`${oferta[0]};${resultado}\n`)    
        }
        
    })
    console.log(resultado_regex)
    
    
})
}


export function buscarOfertaPorId(id_oferta){
	let oferta = {};
	id_oferta = String(id_oferta)
	chrome.storage.local.get(id_oferta).then((oferta_almacenada) => {
		//Si no esta vacio, devuelvelo. Debido a los export hay que hacerlo asi	
		if(Object.getOwnPropertyNames(oferta_almacenada).length > 0){
			Object.assign(oferta, oferta_almacenada[id_oferta] )
		}
	})
	return oferta;
}

export function traerTodasLasOfertas(){
	let resultado;
	chrome.storage.local.get(null, oferta_almacenada => {
		Object.assign(resultado, oferta_almacenada )
	})
	return resultado;
}

export function ejecutarRegexEnDescripcionEmpleo(regex){
	let resultado_regex = [];
	let match;
	chrome.storage.local.get(null, lista => {
		Object.entries(lista).forEach(oferta => {
			while((match = regex.exec(oferta[1].descripcion_empleo) ) !== null){
				resultado_regex.append(match[0])    
			}
		})
	})
	return resultado_regex;
}

export function descartar_oferta_almacenada(id_oferta){
	chrome.storage.local.get(id_oferta, (oferta) => {
		if (objectoEstaVacio(oferta)) {
			console.log('La oferta a descartar no esta almacenada', id_oferta)
			return;
		}
		
		oferta[id_oferta].descartada = true
		oferta[id_oferta].tipo_descarte.manual = true
		
		chrome.storage.local.set(oferta)
		console.log('oferta descartada', message.id_oferta)
	})
}


/*
const groupedDates = {};
chrome.storage.local.get(null, e => {
	Object.entries(e).forEach(i => {
        
      const date = new Date(i[1].fecha_recoleccion_registro); // Convert epoch timestamp to Date object
      const formattedDate = date.toLocaleDateString(); // Format the date to dd/mm/yyyy
      if (groupedDates[formattedDate]) {
        groupedDates[formattedDate]++; // Increment the counter for an existing group
      } else {
        groupedDates[formattedDate] = 1; // Initialize the counter for a new group
      }
    }
)})
*/