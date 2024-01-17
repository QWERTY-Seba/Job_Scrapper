const modelo_oferta = {
	id_compania: null, 
	id_oferta: null,
	cargo: null,
	empresa: null,
	localizacion_empleo: null,
	fecha_publicacion: null,
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
    anos_experiencia_texto : [],
	cantidad_vacantes : null,
	keywords : []
	
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	switch(message.type){
		case "ATTACH_DEBUGGER":
			adjuntar_debugger(sender.tab.id, sender.url)
			break;
		case "DESCARTAR_OFERTA":
			dao_almacenamiento.descartar_oferta_almacenada(message.id_oferta)
			break;
		case "BUSCAR_OFERTA":
			let oferta = dao_almacenamiento.buscarOfertaPorId(message.id_oferta)
			console.log(oferta)
			break;
	}
});

const ventanas_attached = [];
//Al estar dentro de una funcion, los parametros con nombre dan error, ej: targer = {tabid : tabid}
function adjuntar_debugger(tabId, sitio_url) {
    if (ventanas_attached.includes(tabId)) {
        console.log('El debugger ya se encuentra en la ventana', tabId);
        return;
    }
    chrome.debugger.attach({ tabId: tabId }, "1.3", () => {
        chrome.debugger.sendCommand({ tabId: tabId }, "Network.enable", () => {
            ventanas_attached.push(tabId);
			chrome.scripting.executeScript({
				target : {tabId : tabId} ,
				func :  util_html.AgregarVentanaDebugger,
				args : [tabId]
			})
        });
    });    
}
let request_Almacenar = {};

function handleDebuggerEvent(Debuggee, message, params) {
	if (message === 'Network.responseReceived') {
		if (params.response.status === 200) {
			const domain = new URL(params.response.url).hostname; // www.linkedin.com
            //CAMBIAR AQUI LA RUTA A LA DEL OBJETO FINAL
            if (url_requests_ofertas[domain] === undefined) {
				return;
			}
			const url_encontrada = url_requests_ofertas[domain].find(e => params.response.url.startsWith(e.url));
			if (url_encontrada !== undefined) {
				request_Almacenar[params.requestId] = url_encontrada;
			}
		}
	}
	if (message === 'Network.loadingFinished' && Object.keys(request_Almacenar).length > 0) {
		if (request_Almacenar[params.requestId] === undefined) {
			return;
		}
        chrome.debugger.sendCommand({ tabId: Debuggee.tabId }, "Network.getResponseBody", { requestId: params.requestId }, (responseBody, base64Encoded) => {
            
            try {
                const temp_func = request_Almacenar[params.requestId].func;
                
                //LISTA DE N OBJECTOS DE MODELO_OFERTA
                let mappeados = temp_func(responseBody.body, Debuggee.tabId)
                let cambios = []

                for(var oferta of mappeados){
					let id_oferta = oferta.id_oferta
                    let oferta_almacenada = traer_oferta(id_oferta)
                    //IF Oferta ya existe
                    if(!util.objectoEstaVacio(oferta_almacenada)){
                        oferta_almacenada.cantidad_solicitudes.push(oferta.cantidad_solicitudes)

                        if(oferta_almacenada.descartada){
                            //TALVEZ MOVER EL CAMBIOS.PUSH A UNA FUNCION SI LLEGA A REPETIRSE MUCHO
                            cambios.push({
                                    tipo : "oferta_descartada",
                                    id : id_oferta,
                                    //MOVER A FUNCION PROPIA TODO EL FIND TALVEZ
                                    razones : Object.keys(oferta_almacenada.tipo_descarte).filter(i => oferta_almacenada.tipo_descarte[i] == true)
                                })

								oferta_almacenada.cantidad_solicitudes.push(oferta.cantidad_solicitudes[0])
								chrome.storage.local.set({id_oferta : oferta_almacenada})

								//FALTA ENVIAR CAMBIOS SOBRE OTROS PARAMETROS
                            break;
                        }
                        //FALTA ENVIAR LOS AÑOS DE EXPERIENCIA Y LAS KEYWORDS


						
                    }

                    if (regx.tiene_match_con_gruporegex(oferta.cargo, GruposRegex.CARGO)) {
                        oferta.tipo_descarte.cargo = true;
                        oferta.oferta_descartada = true;
                        cambios.push({
                            tipo : "oferta_descartada",
                            id : oferta_almacenada.id_oferta,
                            razon : "cargo"
                        })
                    }
                    
                    if (regx.tiene_match_con_gruporegex(oferta.empresa, GruposRegex.EMPRESA)) {
                        oferta.oferta_descartada = true;
                        oferta.tipo_descarte.empresa = true;
                        cambios.push({
                            tipo : "oferta_descartada",
                            id : oferta_almacenada.id_oferta,
                            razon : "empresa"
                        })
                    }



					//LOS AÑOS SE EXTRAEN AUNQUE ESTE DESCARTADA, PARA POSTERIOR ANALISIS
                    let a = extraer_anos_experiencia(oferta.descripcion_empleo)
                    oferta.anos_experiencia = a[0]
                    oferta.anos_experiencia_texto = a[1]

                    if (oferta.anos_experiencia) {
                        oferta.experiencia_minima = Math.min(...anos_requeridos);
                        cambios.push({
                            tipo : "experiencia_empleo",
                            id : oferta_almacenada.id_oferta,
                            lista_experiencias : oferta.anos_experiencia_texto
                        })
                    }



                }



            } catch (error) {
                console.error({ message, error, request_Almacenar, params, responseBody });
                
            } finally{
                delete request_Almacenar[params.requestId];
            }
        });
	}
}



function traer_oferta(id_oferta){
    let resp = null
    chrome.storage.local.get(id_oferta).then((oferta) => {
        resp = oferta
    })

    return resp
}

function Linkedin(respuesta, tabId) {
	let Lista_oferta = {}
	let tiempo_llamado = new Date().getTime()
	const resp = JSON.parse(respuesta.replaceAll("\n", "\\n"))

	for (var i = 0, len = resp.included.length; i < len; ++i) {
		let fila = resp.included[i]
		let id_oferta = 0

		switch (fila.$type) {
			case 'com.linkedin.voyager.dash.jobs.JobPosting':
				id_oferta = reg.exec(fila.trackingUrn)[0]

                var oferta_temp = Object.assign({}, modelo_oferta)
				oferta_temp.tipo_descarte = {
					expirada: false,
					tecnologias: false,
					annos_exp: false,
					cargo: false,
					distancia_oficina: false,
					manual: false,
					empresa: false
				}

				oferta_temp.cargo = fila.title		
				oferta_temp.id_oferta = id_oferta
				oferta_temp.descripcion_empleo = descripcion_empleo
				oferta_temp.pagina_recoleccion = "Linkedin"
				oferta_temp.fecha_recoleccion_registro = tiempo_llamado
				oferta_temp.experiencia_minima = []
				Lista_oferta[id_oferta] = oferta_temp
				break;

			case 'com.linkedin.voyager.dash.jobs.JobPostingCard':
				id_oferta = reg.exec(fila.entityUrn)[0]

				try {
					Lista_oferta[id_oferta].empresa = regx.buscar_match(fila.primaryDescription.text, /^([\s\.\wÀ-ÿ]*\b)/guim)
					Lista_oferta[id_oferta].localizacion_empleo = regx.buscar_match(fila.primaryDescription.text, /(\b[\s\w,À-ÿ]*chile)/guim)
					Lista_oferta[id_oferta].tipo_modalidad = regx.buscar_match(fila.navigationBarSubtitle, /(híbrido|remoto|presencial)/guim)
					
					Lista_oferta[id_oferta].cantidad_solicitudes = [{
						cantidad_solicitudes: regx.buscar_match(fila.primaryDescription.text, /(\d+)(?= solicitud)/guim),
						fecha_extraccion: tiempo_llamado
					}]

					for (var modulo of fila.primaryDescription.attributesV2) {
						var epoch = modulo.detailData.epoch
						if (epoch) {
							Lista_oferta[id_oferta].fecha_publicacion = epoch.epochAt
							break;
						}
					}
					Lista_oferta[id_oferta].link_empresa = util.getSafe(() => fila.logo.actionTarget, '')
					Lista_oferta[id_oferta].info_empresa = util.getSafe(() => fila.jobInsightsV2ResolutionResults[1].insightViewModel.text.text, '')
					Lista_oferta[id_oferta].tipo_jornada = util.getSafe(() => fila.jobInsightsV2ResolutionResults[0].insightViewModel.text.text, '')
					
                    Lista_oferta[id_oferta].id_compania = regx.buscar_match(reg, fila.logo.attributes[0].detailData["*companyLogo"]) 
				} catch (error) {
					console.error(error, fila)
				}
				break;
			case 'com.linkedin.voyager.dash.jobs.JobSeekerApplicationDetail':
				id_oferta = reg.exec(fila.entityUrn)[0]
				if (Lista_oferta[id_oferta] == null) {
					break;
				}
				Lista_oferta[id_oferta].link_incripcion = fila.companyApplyUrl
				break;
			case 'com.linkedin.voyager.dash.organization.Company':
				break;
			default:
				break;
		}
	}

	return Lista_oferta;
	
}


function extraer_anos_experiencia(descripcion_empleo) {
    match = undefined;
    matches = []
    let anos_requeridos = [];
    while ((match = regex_experiencia_empleo.exec(descripcion_empleo)) !== null) {
        //HTML_Lista_Experiencia += `<li class='job-card-list__insight' >${match[0]}</li>`;
        anos_requeridos.push(Number(match[1]));
        //MATCHES CONTIENE LOS AÑOS MAS EL TEXTO COMPLETO, "de 0 a 2 años de experiencia"        
        matches.push(match)
        //HAY 2 MATCHES EN CASOS DONDE "de 0 a 2 años de experiencia"
        if (match[2] != undefined) {
            anos_requeridos.push(Number(match[2]));
        }
    }

    return [anos_requeridos, matches]

}

function newFunction_1(id_oferta, fila, tiempo_llamado, Lista_oferta) {
     chrome.storage.local.get(id_oferta).then((oferta) => {
        try {
            oferta[id_oferta].cantidad_solicitudes.push({
                cantidad_solicitudes: regx.buscar_match(fila.primaryDescription.text, /(\d+)(?= solicitud)/guim),
                fecha_extraccion: tiempo_llamado
            });
        } catch (error) {
            console.error('Error en la asignacion del cant solicitudes', Lista_oferta, id_oferta, error);
        }
    });
}

function newFunction(Lista_oferta, id_oferta, tabId) {
    if (regx.tiene_match_con_gruporegex(Lista_oferta[id_oferta].empresa, GruposRegex.EMPRESA)) {
        console.debug("PASO");
        Lista_oferta[id_oferta].oferta_descartada = true;
        Lista_oferta[id_oferta].tipo_descarte.empresa = true;

        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: util_html.descartar_oferta,
            args: [id_oferta]
        });
    }
}


function newFunction(){
    let descripcion_empleo = util.quitarAcentos(fila.description.text)
					
    let match;
    let matches = new Set()
    let ite = 0
    while ((match = GruposRegex.BUSQUEDA.regex.exec(descripcion_empleo)) !== null && ite < 10) {
        console.log("probando busqueda")
        matches.add(match[0])
        ite += 1
    }
    matches.forEach(e => chrome.scripting.executeScript({
        target : {tabId : tabId} ,
        func :  util_html.agregar_etiqueta,
        args : [id_oferta,e,etiquetas.ESPECIAL]
    }))

}