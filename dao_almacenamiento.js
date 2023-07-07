/*
DAO chrome storage 


*/

export function buscarOfertaPorId(id_oferta){
	let oferta;
	chrome.storage.local.get(id_oferta, oferta_almacenada => {
		Object.assign(oferta, oferta_almacenada )
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