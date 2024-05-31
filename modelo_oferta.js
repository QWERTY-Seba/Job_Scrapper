const modelo_oferta = {
	id_compania: null, 
	id_oferta: null,
	cargo: null,
	empresa: null,
	localizacion_empleo: null,
	fecha_publicacion: null,
	fecha_publicacion_texto : null, //UTILIZAR ACA SI ES QUE LA FECHA DE PUBLICACION NO ESTA	
	cantidad_solicitudes: [],
	descripcion_empleo: null,
	link_externo_incripcion: null,
	link_oferta: null,
	tipo_jornada: null, //fulltime parttime etc
	tipo_modalidad: null, //presencial hibrido online
	tipo_contrato : null, //Proyecto temporal indefinido etc
	fecha_recoleccion_registro: null,
	pagina_recoleccion: null,
	oferta_repetida: null,
	nombre_publicador: null,
	link_empresa: null,
	aplicado: null,
	tipo_solicitud: null,
	info_empresa: null,
	oferta_descartada: null,
	coordenadas_empresa: null,
	fecha_descarte: null,
	tipo_descarte: null,
	esta_en_ingles: null,
	salario : null,
	experiencia_minima : null, // -1 en vez de 0, porque 0 es un valor valido
	fecha_expiracion : null,
	preguntas_empleo : [],
	rubro_empresa : null,
	aptitudes : [],
	anos_experiencia : [], // Ordenar de menor a mayor
    requisitos_experiencia_texto : [],
	cantidad_vacantes : null,
	keywords : []
	
}

export default modelo_oferta