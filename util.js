export function regTest(fila, Rex) {
	var respuesta = fila.primaryDescription.text.match(new RegExp(Rex, 'giu'))
	if (respuesta != null) {
		return respuesta[0]
	}
	return ""
}

export function getSafe(fn, defaultVal) {
	try {
		return fn();
	} catch (e) {
		return defaultVal;
	}
}



export function objectoEstaVacio(objeto) {
	return Object.getOwnPropertyNames(objeto).length == 0

}


export function obtenerIdOferta() {
	return reg.exec(fila.trackingUrn)[0]
}
/*
	Enviar la fecha en formato epoch
*/
export function estaExpirada(fecha_publicacion) {
	var someDate = new Date();
	var result = someDate.setDate(someDate.getDate() + dias_expiracion);
	return result > fecha_publicacion
}

export function quitarAcentos(texto) {
	return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}