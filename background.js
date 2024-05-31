import * as util from "./util.js"
import * as util_html from "./util_html.js"
import * as dao_almacenamiento from "./dao_almacenamiento.js"



//TEST
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL || details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        chrome.tabs.create({ url: 'http://localhost:5000/home' }, (tab) => {
            // Una vez que se crea la pestaña test.html, actualiza la pestaña actual para redirigirla
            chrome.tabs.update(tab.id, { url: 'http://localhost:5000/home' });
			
        });
    }
});


function sendFakeRequest(tabId, url, method, headers) {
    const requestHeaders = Object.entries(headers).map(([name, value]) => ({ name, value }));

    chrome.debugger.sendCommand({ tabId: tabId }, 'Network.setRequestInterception', { patterns: [{ urlPattern: '*' }] }, () => {
        chrome.debugger.onEvent.addListener(function listener(source, method, params) {
            if (tabId === source.tabId && method === 'Network.requestIntercepted') {
                if (params.request.url === url) {
                    chrome.debugger.sendCommand({ tabId: tabId }, 'Network.continueInterceptedRequest', {
                        interceptionId: params.interceptionId,
                        rawResponse: btoa(JSON.stringify({ status: 200, headers: [], contentType: 'application/json', body: '{}' }))
                    });
                    chrome.debugger.onEvent.removeListener(listener);
                }
            }
        });
    });
}

  
  



const etiquetas = {
    DESCARTE : {
        css: 'background-color: #f8d7da; color: #721c24; border-color: #f5c6cb;',
        icono : ''
    },
    ESPECIAL : {
        css: 'background-color: #f8ca4d; color: #fff;',
        icono : '<i class="fas fa-star" style="margin-right: 5px;"></i>'
    }
}
//import * as cheerio from "./lib/cheerio"

//AGREGAR SISTEMA DE PUNTAJES Y ORDENAR EN BASE A ESO

var mb = 0
var dias_expiracion = 30

var reg = new RegExp(/\d+/)
//var regex = /(?:al menos (?:de )?|entre )?(?:(\d)|(\d) [aoy] \d|(\d)-\d) a[ññ]{1,2}o[s]?(?:(?:(?: de)? experiencia)?)/guim;
//(?:al menos|minimo|desde|experiencia (?:de|de al menos|minima de)) (?:\d{1,2}|\d{1,2}[aoy\- ]*\d{1,2}) ano[s]? (?:de experiencia(?: en el cargo)?|en cargos similares)/guim///.{20}\d año[s]?.{20}/guim;

// var regex = /(?:entre |al menos |minimo |desde |experiencia |)(?:de |de al menos |minima de |)?[+]?(\d{1,2})[aoy\- ]*(\d{1,2})? ano[s]?(?: de experiencia(?: en el cargo| minima|)?|en cargos similares)/gmiu
// let match;
// var execution_time_per_match = []
// 	chrome.storage.local.get(null, lista => {
// 		Object.entries(lista).forEach(oferta => {
			
//             let startTime = performance.now(); // Get the current timestamp
//             let match_counter = 0

//             while((match = regex.exec(oferta[1].descripcion_empleo) ) !== null){
//                 console.log(match)
//                 match_counter += 1
// 			}
            
//             if(match_counter){
//                 let endTime = performance.now(); // Get the current timestamp again
//                 let executionTime = endTime - startTime; // Calculate the difference
//                 console.log("Execution time: " + executionTime + " milliseconds");
//                 execution_time_per_match.push(executionTime)
//             }
            
// 		})
//         const sum = execution_time_per_match.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
//         const average = sum / execution_time_per_match.length;
//         const formattedAverage = average.toFixed(4);
        
//         console.log("Average time: " + formattedAverage);
// 	})



// VERSION ANTERIOR /(?:entre |al menos |minimo |desde |experiencia )(?:de |de al menos |minima de )(?:\d{1,2}|\d{1,2}[aoy\- ]*\d{1,2}) ano[s]?(?: de experiencia(?: en el cargo| minima)?|en cargos similares)?|(?:entre |al menos |minimo |desde |experiencia )(?:de |de al menos |minima de )?(?:\d{1,2}|\d{1,2}[aoy\- ]*\d{1,2}) ano[s]? (?:de experiencia(?: en el cargo| minima)?|en cargos similares)/gmiu
//(?:entre |al menos |minimo |desde |experiencia |)(?:de |de al menos |minima de |)?[+]?(\d{1,2})[aoy\- ]*(\d{1,2})? ano[s]?(?: de experiencia(?: en el cargo| minima|)?|en cargos similares)/gmiu
// PENULTIMO 23/01/2024 /(?:maximo |entre |al menos |minimo |desde |experiencia |)(?:de |de al menos |minima de |hasta )?[+]?(\d{1,2})[aoy\- ]*(\d{1,2})? ano[s]?(?: de experiencia(?: en el cargo| minima|)?| en cargos similares| en \w+)/gmiu







//DEFINE NO EXISTE EN JAVASCRIPT, HAY QUE CREARLO USANDO DICT
// {
//  limitador_asc = "...",
//  cantidad_tiempo = "...",
//  ...
// }

// patrones = {
// 	`${limitador_asc} ${cantidad_tiempo}...`,
//   ...


//SI TIENE SUBGRUPO 
// let grupos = {
//     LIMITADOR_ASC : ["entre","al menos","minimo","desde","[+]\s?","contar con","a partir de"],
//     LIMITADOR_DESC : ["no mas de","maximo"],
//     COMPLEMENTO_LIMITADOR : ["de","de al menos","minima de","hasta"],
//     CANTIDAD_TIEMPO : ["[+]?(\d{1,2})(?:[aoy\- ]{1,3}(\d{1,2}))?"],
//     TIPO_TIEMPO : ["ano[s]?","mes(?:es)?"],
//     TIPO_REQUISITO : ["de experiencia","experiencia","conocimiento"],
//     FOCO_REQUISITO : ["en el cargo|en cargos similares|en \w+|como \w+"]
// }

// function regex_s(texto){
    
    
// }


// texto = "{a} "
// for(var nombre_grupo in grupos){
//     //CREAR EL GRUPO
//     valores = grupos[nombre_grupo].join("|")
//     regex_grupo = `(?<${nombre_grupo}>${valores})` 
//     texto = texto.replaceAll(`{${nombre_grupo}}`, regex_grupo)
//     console.log(texto)    
// }
// }

///(?(DEFINE)(?<LIMITADOR_ASC>(?:entre|al menos|minimo|desde|[+]\s?|contar con|a partir de)))(?(DEFINE)(?<LIMITADOR_DESC>(?:no mas de|maximo)))(?(DEFINE)(?<COMPLEMENTO_LIMITADOR>(?:de|de al menos|minima de|hasta)))(?(DEFINE)(?<CANTIDAD_TIEMPO>)(?(DEFINE)(?<TIPO_TIEMPO>ano[s]?|mes(?:es)?))(?(DEFINE)(?<TIPO_REQUISITO>(?:de experiencia|experiencia|conocimiento)))(?(DEFINE)(?<FOCO_REQUISITO>(?:en el cargo|en cargos similares|en \w+|como \w+)))(?:(?P>LIMITADOR_ASC)|(?P>LIMITADOR_DESC))\s*(?P>COMPLEMENTO_LIMITADOR)?\s*(?P>CANTIDAD_TIEMPO) (?P>TIPO_TIEMPO) (?P>TIPO_REQUISITO) (?P>FOCO_REQUISITO)|(?:(?P>LIMITADOR_ASC)|(?P>LIMITADOR_DESC))?\s*(?P>CANTIDAD_TIEMPO) (?P>TIPO_TIEMPO) (?P>TIPO_REQUISITO) (?P>LIMITADOR_ASC)/gmiu





var regex_experiencia_empleo = /(?:maximo |entre |al menos |minimo |desde |experiencia |[+]\s?|contar con )(?:de |de al menos |minima de |hasta )?[+]?(\d{1,2})(?:[aoy\- ]{1,3}(\d{1,2}))? ano[s]?(?:(?: de experiencia(?: laboral previa| en el cargo| minima| en cargos similares| en \w+| como \w+| comprobable))|(?: en el cargo| en cargos similares| en roles similares))/gmiu



//SCRAPEAR, ANALISAR y LUEGO CREAR VENTANA PARA SUGERIR, O USAR EL ACTION
//AGREGAR BOTON PARA GUARDAR UN EMPLEO DE CUALQUIER PAGINA




var GruposRegex = {
	CARGO: { 
		palabras : ['cloud architect','back-end','front-end','android','node.js','.net','django','react.js','vue.js','front end','back end','devops','backend','frontend','intern','sr','senior','jefe','usd','oracle','lider','product owner','lead','analista qa','product manager','practica','site reliability engineer','sre','software engineer','data scientist','fullstack','full stack','us$','scrum master'] ,
		regex : null
	},
	TECNOLOGIA: {
		palabras : ['html', 'css', 'javascript', 'python', 'java', 'c++', 'sql', 'ruby', 'php', 'swift', 'kotlin', 'typescript', 'go', 'rust', 'perl', 'matlab', 'c#', 'scala', 'bash', 'shell scripting', 'node.js', 'react', 'angular', 'vue.js', 'django', 'flask', 'ruby on rails', 'spring framework', 'hibernate', 'express.js', 'flask restful', 'asp.net', '.net core', 'laravel', 'cakephp', 'symfony', 'yii', 'rubymotion', 'ionic', 'xamarin', 'android sdk', 'ios sdk', 'react native', 'unity', 'unreal engine', 'tensorflow', 'keras', 'pytorch', 'opencv', 'docker', 'kubernetes', 'amazon web services (aws)', 'microsoft azure', 'google cloud platform', 'heroku', 'digitalocean', 'git', 'svn', 'mercurial', 'jenkins', 'travis ci', 'circleci', 'jira', 'trello', 'asana', 'slack', 'zoom', 'skype', 'microsoft teams', 'google meet', 'zoom', 'postgresql', 'mysql', 'mongodb', 'sqlite', 'oracle', 'microsoft sql server', 'mariadb', 'redis', 'cassandra', 'neo4j', 'couchbase', 'apache kafka', 'rabbitmq', 'elasticsearch', 'logstash', 'kibana', 'grafana', 'prometheus', 'nagios', 'splunk', 'graylog', 'wireshark', 'nmap', 'metasploit', 'burp suite', 'owasp zap', 'hashcat', 'john the ripper', 'aircrack-ng'] ,
		regex : null
	},
	EMPRESA: {
		palabras : ['braintrust','listopro','turing','oowlish','fullStack labs'],
		regex : null
	},
	BUSQUEDA: {
		palabras : ['python','sql','excel','power bi'],
		regex : null
	}
  };

let regx =  {

	createWordBoundaryRegex(list) {
	  const escapedList = list.map(this.escapeRegexString);
	  const regexString = `(?:${escapedList.join('|')})`;
	  return new RegExp(regexString, 'gium');
	}, 

	escapeRegexString(str) {
	  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	},
	//se debe crear un nuevo objeto de regex para evitar errores https://stackoverflow.com/questions/4724701/regexp-exec-returns-null-sporadically
	tiene_match_con_gruporegex(palabra, GrupoRegex) {
		let temp_regex = new RegExp(GrupoRegex.regex)
        return temp_regex.exec(palabra) != undefined
	},

	buscar_match_con_gruporegex(palabra, GrupoRegex){
		let temp_regex = new RegExp(GrupoRegex.regex)
    	return temp_regex.exec(palabra)
	},
	buscar_match(palabra, regex){
		let respuesta = new RegExp(regex).exec(palabra)
		if (respuesta) {
			return respuesta[0]
		}
		return null
	},

	init(){
		for (const o of Object.entries(GruposRegex)){
			o[1].regex = this.createWordBoundaryRegex(o[1].palabras)
		}
	}
}
regx.init()

async function trabajando(respuesta){
	let tiempo_llamado = new Date().getTime()
	let oferta = {
		id_compania: respuesta.idEmpresa,
		id_oferta: respuesta.idOferta,
		cargo: respuesta.nombreCargo,
		empresa: respuesta.nombreEmpresaFantasia,
		localizacion_empleo: respuesta.ubicacion.direccion,
		fecha_publicacion: respuesta.fechaPublicacion,
		cantidad_solicitudes: [],
		descripcion_empleo: respuesta.descripcionOferta.concat(requisitosMinimos),
		link_externo_incripcion: "", //Usar cuando se requiere u
		link_oferta: respuesta.linkPostulacionExterno,
		tipo_jornada: "", //fulltime parttime etc
		tipo_modalidad: respuesta.nombreJornada, //presencial hibrido online
		fecha_recoleccion_registro: tiempo_llamado,
		pagina_recoleccion: "trabajando",
		oferta_repetida: false,
		nombre_publicador: "",
		link_empresa: "",
		aplicado: false,
		tipo_solicitud: "",
		info_empresa: "",
		oferta_descartada: false,
		coordenadas_empresa : "",
		fecha_descarte: 0,
		tipo_descarte: {},
		esta_en_ingles: false,
		salario : respuesta.sueldo,
		experiencia_minima : -1, // -1 en vez de 0, porque 0 es un valor valido
		anos_experiencia : [],
		fecha_expiracion : respuesta.fechaExpiracion,
		preguntas_empleo : respuesta.preguntas,
		rubro_empresa : "",
		aptitudes : []
	}
	console.log(oferta)
}

async function test(a,b){
	console.log("CompuTrabajo Debug")
	return "";
}

async function Linkedin(respuesta, tabId) {
	let Lista_oferta = {}
	let tiempo_llamado = new Date().getTime()
	const resp = JSON.parse(respuesta.replaceAll("\n", "\\n"))

	for (var i = 0, len = resp.included.length; i < len; ++i) {
		let fila = resp.included[i]
		let id_oferta = 0
		let id_compania = 0

		switch (fila.$type) {
			case 'com.linkedin.voyager.dash.jobs.JobPosting':
				id_oferta = reg.exec(fila.trackingUrn)[0]
				console.debug("Oferta entrante",id_oferta)
				let oferta_ya_existente = false;
				let descartada = false;
				await chrome.storage.local.get(id_oferta).then((oferta) => {
					oferta_ya_existente = !util.objectoEstaVacio(oferta)
					
					if (oferta_ya_existente){
						console.log('oferta ya existente, saltando ', id_oferta)
						
						if (oferta[id_oferta].oferta_descartada) {
							descartada = true;
							//Crear una funcion llamada __descartar_oferta que ejecute estas dos a la vez
							chrome.scripting.executeScript({
								target : {tabId : tabId} ,
								func :  util_html.descartar_oferta,
								args : [id_oferta]
							})
							console.debug("Agregando etiqueta a ", id_oferta)
							chrome.scripting.executeScript({
								target : {tabId : tabId} ,
								func :  util_html.agregar_etiqueta,
								args : [id_oferta,"tipo de descarte aca",etiquetas.DESCARTE]
							})
						}
					}
				})
				if(descartada){
					break;
				}


				
				
				//Cambiar para que ciertos matches se tomen como validos, ejemplo: maximo 1 año..., hasta 1 año..., sin experiencia...
				//Agregar busqueda de tecnologias deseadas, si la contiene agregarla como etiqueta sin texto con imagen, logo del lenguaje
				//Ejecutar en cualquier oferta que no este descartada
				
				let descripcion_empleo = util.quitarAcentos(fila.description.text)
					
				let match;
				let matches = new Set()
				let ite = 0
				while ((match = GruposRegex.BUSQUEDA.regex.exec(descripcion_empleo.toLowerCase())) !== null && ite < 10) {
					console.log("probando busqueda")
					matches.add(match[0].trim())
					ite += 1
				}
				matches.forEach(e => chrome.scripting.executeScript({
					target : {tabId : tabId} ,
					func :  util_html.agregar_etiqueta,
					args : [id_oferta,e,etiquetas.ESPECIAL]
				}))




				match = undefined;
				matches = []
				let anos_requeridos = []
				let HTML_Lista_Experiencia = "";
				while ((match = regex_experiencia_empleo.exec(descripcion_empleo)) !== null) {
					HTML_Lista_Experiencia += `<li class='job-card-list__insight' >${match[0]}</li>`
					matches.push(match)
					anos_requeridos.push(Number(match[1]))
					if(match[2] != undefined){
						anos_requeridos.push(Number(match[2]))
					}
				}
				
				
				if(matches.length > 0 ){
					let experiencia_minima_cargo = Math.min(...anos_requeridos)
					console.log("debug lista_experiencias",id_oferta,fila.title, HTML_Lista_Experiencia, " experiencia minima ", experiencia_minima_cargo)
					try{
						chrome.scripting.executeScript({
							target : {tabId : tabId} ,
							func :  util_html.insertarAñosExpDiv,
							args : [id_oferta , HTML_Lista_Experiencia,experiencia_minima_cargo]
						})
					}catch(error){
						console.error(`Error al ejecutar insertarAñosExpDiv`, id_oferta , HTML_Lista_Experiencia,experiencia_minima_cargo, anos_requeridos  )						
					}
				}
				console.debug("oferta_ya_existente",oferta_ya_existente,id_oferta)
				if(oferta_ya_existente) {
					break;
				}

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

				let resp_esta_en_ingles = null;
				try{
					resp_esta_en_ingles = await chrome.i18n.detectLanguage(fila.description.text)
					oferta_temp.esta_en_ingles = resp_esta_en_ingles.languages[0].language == 'en'


					if(oferta_temp.esta_en_ingles){
						chrome.scripting.executeScript({
							target : {tabId : tabId} ,
							func :  util_html.agregar_etiqueta,
							args : [id_oferta,"Ingles",etiquetas.DESCARTE]
						})
					}
				}catch(Error){
					console.error('Error al detectar el idioma en la oferta ',id_oferta, Error,resp_esta_en_ingles, fila.description.text.length )
				}

				oferta_temp.cargo = util.quitarAcentos(fila.title)

				if (regx.tiene_match_con_gruporegex(oferta_temp.cargo,GruposRegex.CARGO)) {
					oferta_temp.tipo_descarte.cargo = true
					oferta_temp.oferta_descartada = true
					chrome.scripting.executeScript({
						target : {tabId : tabId} ,
						func :  util_html.descartar_oferta,
						args : [id_oferta]
					})

				}
				
				oferta_temp.id_oferta = id_oferta
				oferta_temp.descripcion_empleo = descripcion_empleo
				oferta_temp.pagina_recoleccion = "Linkedin"
				oferta_temp.fecha_recoleccion_registro = tiempo_llamado
				oferta_temp.experiencia_minima = [...matches]

				Lista_oferta[id_oferta] = oferta_temp
				console.debug("se guardo el objecto", oferta_temp, id_oferta)
				
				break;

			case 'com.linkedin.voyager.dash.jobs.JobPostingCard':
				id_oferta = reg.exec(fila.entityUrn)[0]

				if (Lista_oferta[id_oferta] == null) {
					await chrome.storage.local.get(id_oferta).then((oferta) => {
						try {
							oferta[id_oferta].cantidad_solicitudes.push({
								cantidad_solicitudes : regx.buscar_match(fila.primaryDescription.text, /(\d+)(?= solicitud)/guim),
								fecha_extraccion: tiempo_llamado
							})
						} catch (error) {
							console.error('Error en la asignacion del cant solicitudes', Lista_oferta, id_oferta, error)
						}
						chrome.storage.local.set(oferta)
					})
					break;
				}

				try {
					Lista_oferta[id_oferta].empresa = regx.buscar_match(fila.primaryDescription.text, /^([\s\.\wÀ-ÿ]*\b)/guim)
					
					//Problema aca, si llega la misma empresa dos veces no pesca una de las dos
					console.debug("Probando regex empresa con", GruposRegex.EMPRESA.regex, id_oferta, Lista_oferta[id_oferta].empresa)
					if(regx.tiene_match_con_gruporegex(Lista_oferta[id_oferta].empresa, GruposRegex.EMPRESA)){
						console.debug("PASO")
						Lista_oferta[id_oferta].oferta_descartada = true
						Lista_oferta[id_oferta].tipo_descarte.empresa = true
						
						chrome.scripting.executeScript({
							target : {tabId : tabId} ,
							func :  util_html.descartar_oferta,
							args : [id_oferta]
						})
					}
					//AGREGAR CODIGO QUE REVICE Y MODIFIQUE LOS INDICES DE LOS PARAMETROS CUANDO SEAN ACTUALIZADOS EJ: fila.navigationBarSubtitle
					Lista_oferta[id_oferta].localizacion_empleo = regx.buscar_match(fila.primaryDescription.text, /(\b[\s\w,À-ÿ]*chile)/guim)
					console.log('QUe mierda pasa aca, ', regx.buscar_match(fila.navigationBarSubtitle, /(híbrido|remoto|presencial)/guim))
					Lista_oferta[id_oferta].tipo_modalidad = regx.buscar_match(fila.navigationBarSubtitle, /(híbrido|remoto|presencial)/guim)

					
					Lista_oferta[id_oferta].cantidad_solicitudes = [{
						cantidad_solicitudes: regx.buscar_match(fila.primaryDescription.text, /(\d+)(?= solicitud)/guim),
						fecha_extraccion: tiempo_llamado
					}]


					//Buscar el epoch 
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
					
					//aparece null cuando la compañia que publica la oferta no esta registrada
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
				// let imagen = util.getSafe(fila.logoResolutionResult.vectorImage.digitalmediaAsset,null)
				// if(imagen )
				// let resultado_regex_imagen = fila.logoResolutionResult.vectorImage.digitalmediaAsset.match(/urn:li:digitalmediaAsset:(.*)/ui)
				// if(!resultado_regex_imagen){
				// 	return;
				// }
				// var id_imagen = resultado_regex_imagen[1]

				

				// let obj_imagen = imagenes_almacenar[id_imagen]


				/*
				if(obj_imagen.uri_imagen != ""){
					if(obj_imagen.uri_imagen != ""){
					request.getContent(
						function(content, enconding){
										obj_imagen.uri_imagen = content
										chrome.storage.local.set(obj_imagen.id_compania, obj_imagen)
										})
					}
					break; 
				}
				imagenes_almacenar[regex_result[1]] = {
										id_imagen : regex_result[1],
										uri_imagen : "",
										id_compania : 0
														}

			*/
				break;
			default:
				break;
		}
	}

	chrome.storage.local.set(Lista_oferta)
	chrome.scripting.executeScript({
		target : {tabId : tabId} ,
		func :  util_html.AgregarBotonesDescarte
	})
	chrome.scripting.executeScript({
		target : {tabId : tabId} ,
		func :  util_html.AgregarBotonesBusqueda
	})
	chrome.scripting.executeScript({
		target : {tabId : tabId} ,
		func :  util_html.Agregar_baneo_en_lugar
	})
	
}

var request_pendientes = new Map();
const maxima_cantidad_intentos = 10

async function Linkedin_preguntas_empleo(respuesta, tabId){
	const resp = JSON.parse(respuesta.replaceAll("\n", "\\n"))
	
	let id_oferta = resp.data["*elements"][0].match(/\d+/)[0]
	let preguntas = []

	for(let comp of resp.included){
		if(comp.$type != "com.linkedin.voyager.dash.common.forms.FormElement"){
			continue;
		}
		if(["Código del país", "Email","Teléfono móvil"].includes(comp.title.text)){
			continue;
		}
		preguntas.push(comp.title.text)
	}

	let oferta_no_llego = false
	let temp_oferta = {}
	let startTime = Date.now();
    let timeoutDuration = 60000; // 1 minute in milliseconds
    let interval = 10000; // 10 seconds in milliseconds

	while(util.objectoEstaVacio(temp_oferta)){
		if (Date.now() - startTime >= timeoutDuration) {
            console.log(`Timeout: la oferta ${id_oferta} no se encontro, cancelando el guardado de preguntas`);
			oferta_no_llego = true
            break;
        }
		await new Promise(resolve => setTimeout(resolve, interval));
	
		await chrome.storage.local.get(id_oferta).then(
			(oferta) => { Object.assign(temp_oferta, oferta)}
		)
	}

	if(oferta_no_llego){
		return;
	}

	chrome.storage.local.get(id_oferta).then((oferta) => {
		try {
			oferta[id_oferta].preguntas_empleo = structuredClone(preguntas)
			chrome.storage.local.set(oferta)
			console.log("Preguntas guardadas en", id_oferta)
		} catch (error) {
			console.error('Error en la asignacion de preguntas de empleo', preguntas, id_oferta, error)
		}	
	})
}

//URLS DE DONDE SE EXTRAEN LOS DATOS, POR SITIO Y POR TIPO DE PAGINA VISITADA
var url_requests_ofertas = {
    "www.linkedin.com" : 
		 [
			{
				url : "https://www.linkedin.com/voyager/api/graphql?variables=(jobCardPrefetchQuery",
				func : Linkedin,
				desc : "lista general de linkedin, www.linkedin.com/jobs/search "
			},
			{
				url : "https://www.linkedin.com/voyager/api/voyagerJobsDashOnsiteApplyApplication",
				func : Linkedin_preguntas_empleo,
				desc : "preguntas de empleo"
			},
			{
				url : "https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(jobCardPrefetchQuery",
				func : test,
				desc : "lista general con datos en cache",
				no_body : true
				
			},
			{
				url : "https://www.linkedin.com/voyager/api/voyagerAssessmentsDashJobSkillMatchInsight/urn:li:fsd_jobSkillMatchInsight:3550873543?decorationId=com.linkedin.voyager.dash.deco.assessments.FullJobSkillMatchInsight-13",
				func : test,
				desc : "lista de aptitudes"
			}

		],
	"cl.computrabajo.com" : [
		{
			url : "https://cl.computrabajo.com/trabajo-de-sql-en-rmetropolitana?pubdate=30&by=publicationtime",
			func : test,
			desc : "Lista general"
		}
		,{
			url : "https://cl.computrabajo.com/offersgrid/getofferdetail",
			func : test,
			desc : "oferta individual"
		}
	],
	"cl.talent.com" : [
		{
			url : "https://cl.talent.com/ajax/page_jobs/page-whitepage-preview.php?id=",
			func : test,
			desc : "oferta individual"
		},
		{
			url : "https://cl.talent.com/jobs?k=data&l=Santiago,+Santiago+Metropolitan&date=7d&radius=100",
			func : test,
			desc : "Lista general"
		}
	],
	"www.trabajando.cl" : [
		{
			url : "https://www.trabajando.cl/api/ofertas/",
			func : test,
			desc : "oferta individual"
		},
		{
			url : "https://www.trabajando.cl/api/searchjob?TextoLibre=",
			func : test,
			desc : "Lista general"
		}
	]
	
	
	
	
	//"santander_oferta_individual" : "https://empleos.santander.cl/jobs/",
}

// chrome.storage.local.getBytesInUse(function(Bytes){  
// 	mb = (Bytes / (1024*1024)).toFixed(2)
// 	document.getElementById("cantUso").innerText = `${mb} mb`
// 	console.log(Bytes)
// })		


/*
	Enviar texto literal
*/
function DuocLaboral(Respuesta) {


}

function Computrabajo() {

}

function Talent() {

}

const modelo_imagen_compania = {
	id_imagen: "",
	uri_imagen: "",
	id_compania: 0
}

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
	cantidad_vacantes : null,
	horas : null
	
}

const ventanas_attached = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	let oferta;
	const id = message.id_oferta
	switch(message.type){
		case "ATTACH_DEBUGGER":
			adjuntar_debugger(sender.tab.id, sender.url)
			break;
		case "DESCARTAR_OFERTA":
			dao_almacenamiento.descartar_oferta_almacenada(id)
			break;
		case "BUSCAR_OFERTA":
			 oferta = dao_almacenamiento.buscarOfertaPorId(id)
			console.log(oferta)
			break;
	
		case  "DESCARTAR_EMPRESA":
			
			try{
				chrome.storage.local.get(id, e => {
					GruposRegex.EMPRESA.palabras.push(e[id].empresa.toLowerCase())
					regx.init()	
					console.log("EMPRESA BANEADA", e[id].empresa)

				})
			}catch(Error){
				console.Error("Error al banear empresa")
			}
		
		
		
		
			break;
	
		}
});
var urlList = [];
//Al estar dentro de una funcion, los parametros con nombre dan error, ej: targer = {tabid : tabid}
function adjuntar_debugger(tabId, url) {
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
			
			
			if(url == "chrome-extension://jmmpaennglbdadeokcolancnmgjhnhee/test.html"){
				sendFakeRequest(tabId, 'https://example.com/api/data', 'GET', {});
			}

        });
    });    
}
let request_Almacenar = {};
function handleDebuggerEvent(Debuggee, message, params) {
	if (message === 'Network.responseReceived') {
		if (params.response.status === 200) {

			
			const domain = new URL(params.response.url).hostname; // www.linkedin.com
			
			if(domain == 'localhost'){
				//ITERAR LAS FUNCIONES
				let regex_funcion = new RegExp(/\/get-file\/(.*)\.\w+/)

				let a_buscar = regex_funcion.exec(params.response.url)[1]

				let url_encontrada = (() => {
					for (var site in url_requests_ofertas) {
					var requests = url_requests_ofertas[site];
						for (var request of requests) {
							if (request.func.name == a_buscar) {
								return request
							}
						}
					}
					return null
				})();
				
				console.log(url_encontrada)
				if(url_encontrada == null){
					throw "Error al recibir response de localhost, la funcion no existe en el codigo: " + a_buscar
				}
				
				request_Almacenar[params.requestId] = url_encontrada;
				return;
				
			}
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

		// if (request_Almacenar[params.requestId].no_body === true) {
		// 	console.log("Request desde cache");
		// 	delete request_Almacenar[params.requestId];
		// 	return; // Execute special function here
		// }
		console.log(request_Almacenar, params.requestId);

		chrome.debugger.sendCommand({ tabId: Debuggee.tabId }, "Network.getResponseBody", { requestId: params.requestId }, (responseBody, base64Encoded) => {
			console.log(responseBody, params.requestId);
			try {
				const temp_func = request_Almacenar[params.requestId].func;
				const tiempo_llamado = (new Date()).getTime();

				console.debug('Llamando la funcion', temp_func.name, ' a las ', tiempo_llamado);
				let tiempo_ejecucion_funcion = performance.now();
				
				temp_func(responseBody.body, Debuggee.tabId).then((resp) => {
					delete request_Almacenar[params.requestId];
					let tiempo_termino_funcion = performance.now();
					let diferencia_tiempo = (tiempo_termino_funcion - tiempo_ejecucion_funcion).toFixed(2)


					chrome.scripting.executeScript({
						target : {tabId : Debuggee.tabId} ,
						func :  util_html.AgregarRequestProcesada,
						args : [params.requestId, diferencia_tiempo, temp_func.name ]
					})
				});
			} catch (error) {
				console.error({ message, error, request_Almacenar, params, responseBody });
				delete request_Almacenar[params.requestId];
			}
		});
	}
}

//El addListener solo debe ser ejecutado una vez o se empezaran a acumular
chrome.debugger.onEvent.addListener(handleDebuggerEvent);

//el detach no funciona correctamente

// function detachDebugger() {
// 	Check if the tab still exists before detaching the debugger
// 	chrome.tabs.get(tabId, (tab) => {
// 		if (chrome.runtime.lastError || !tab) {
// 			The tab doesn't exist, remove it from the attached list.
// 			const index = ventanas_attached.indexOf(tabId);
// 			if (index !== -1) {
// 				ventanas_attached.splice(index, 1);
// 			}
// 		} else {
// 			The tab still exists, detach the debugger.
// 			chrome.debugger.detach({ tabId: tabId }, () => {
// 				const index = ventanas_attached.indexOf(tabId);
// 				if (index !== -1) {
// 					ventanas_attached.splice(index, 1);
// 				}
// 				chrome.debugger.onEvent.removeListener(handleDebuggerEvent);
// 			});
// 		}
// 	});
// }
// chrome.tabs.onRemoved.addListener((closedTabId) => {
// 	if (closedTabId === tabId) {
// 		detachDebugger();
// 	}
// });



/*
por hacer

ejecutar un script cuando se entra a la pagina que extraiga las ids de las descartadas y sacar las publicaciones que tengan la id--

consultar el webservice de google, direcciones de la empresa y guardar las coordenadas

en la lista de ofertas, agregar un boton para descartar ofertas manualmente--

en la lista de ofertas, agregar un mapa para mostrar las coordenadas guardadas

guardar las fotos de empresa

agregar un script que recorra la base y descarte las ofertas,

agregar script para extraer los años requeridos por oferta--

arreglar las peticiones duplicadas --

agregar compatibilidad con duoc y computrabajo

listar las solicitudes en la lista de ofertas

al volver Atras, se pierden los descartados y el divDescartados no vuelve a aparecer

no se extraen los datos cuando se realizan busquedas personalizadas fuera del jobs

al descartar en pagina, agregar un color por tipo de descarte para evitar confusion

agregar, buscar ofertas en la bd cuando se busca fuera de linkedin

mover las funciones de utilidad a un archivo nuevo--

agregar opcion para agregar o quitar botones en el action <> Probablemente no sea util ya que al scrapear debe existir el codigo antes

compatibildad en extraccion de experiencia para los empleos que estan en ingles

agregar hace cuanto tiempo se visito cada pagina de empleos

agregar boton para hacer un embeed en la pagina actual, por si se cierra el debug por error

agregar compatibilidad, el debugger sigue funcionando cuando se va a otra pagina que tambien se scrapea
*/






//chrome.runtime.onConnect.addListener(function(devToolsConnection) {})
/*

//Main
var imagenes_almacenar = {}
const interceptedIds = new Set();


const imagen_compania = {
	id_imagen : "",
	uri_imagen : "",
	id_compania : 0
}

if(request._resourceType == 'image'){
			let regex_result = request.request.url.match(/https:\/\/media.licdn.com\/dms\/image\/([\w\d]{10,})\/company-logo_/iu)
			if(regex_result){
				let obj_imagen = imagenes_almacenar[regex_result[1]]
				
				if(obj_imagen){
					if(obj_imagen.id_compania != 0){
						request.getContent(
							function(content, enconding){
											obj_imagen.uri_imagen = content
											chrome.storage.local.set(obj_imagen.id_compania, obj_imagen)
											})
						return;
					} 
				}
				imagenes_almacenar[regex_result[1]] = {
										id_imagen : regex_result[1],
										uri_imagen : content,
										id_compania : 0
														}

				
				//si la id de regex[1] esta en la lista, agarrar el objecto e insertarlo en el storage
				// si no, crear el objeto



			}
		}
chrome.devtools.inspectedWindow.getResources(e => 
	e.forEach(i => {
		if(i.type == 'image' && i.url.match(/https:\/\/media.licdn.com\/dms\/image\/[\w\d]{10,}\/company-logo_/iu)){
			i.getContent( (content, encoding) => {
				console.log(content, encoding, i.url)
			})
		    
		}
	}))

for(const a of i){
			console.log(a)
		}

chrome.storage.local.get(null, e => {
	Object.entries(e).forEach(i => {
		for(const a of i){
			if(a[1].descartada == false){
				let divEmpleo = document.createElement('div')
				divEmpleo.className += 'oferta-elemento'
				divEmpleo.innerText = JSON.stringify(a[1])
				document.body.append(divEmpleo)
			}    
		}
	    
	})
    
})
  const ctx = document.getElementById('myChart').getContext('2d');
  const data = {
	labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
	datasets: [{
	  label: 'My Data',
	  data: [65, 59, 80, 81, 56, 55, 40],
	  backgroundColor: 'rgba(255, 99, 132, 0.2)',
	  borderColor: 'rgba(255, 99, 132, 1)',
	  borderWidth: 1
	}]
  };
  const options = {};
  const chart = new Chart(ctx, {
	type: 'line',
	data: data,
	options: options
  });

chrome.storage.local.get(e => {
	let empleos = {}
	for (const [key, lista_empleos] of Object.entries(e)) {
		lista_empleos.forEach(empleo => {
		let temp_id = empleo.id_oferta
		if(empleos[temp_id] == null){
			empleos[temp_id] = {
					descripcion_empleo : empleo.descripcion_empleo
				    
				}
		    
		}
	    
	})
    
	}
})
chrome.storage.local.get(e => {
	var empleos = {}
	for (const [key, lista_empleo] of Object.entries(e)) {

		lista_empleo.forEach(empleo => {
	    
		let temp_id = empleo.id_oferta
	    
		let registro_cant_solicitudes = {
				cantidad_solicitudes : empleo.cantidad_solicitudes,
				fecha_extraccion : empleo.fecha_recoleccion_registro
			} 
	    
		if(empleos[temp_id]){
	    
			empleos[temp_id].cantidad_solicitudes.push(registro_cant_solicitudes)
	    
		}else{
			empleos[temp_id] = empleo
		    
			empleos[temp_id].cantidad_solicitudes = [registro_cant_solicitudes]
	    
		}
	    
							 })}
	console.log(empleos)
    
})

chrome.storage.local.get(null, e => {
	var ids_duplicadas = []
	const lista = Object.entries(e)
	for(let i = 1; i < lista.length ; i++){
	    
		let resultado = lista[i-1][0] - lista[i][0]
	    
		if(resultado > -100){
			ids_duplicadas.push(lista[i][0])
		}
		console.log(i, resultado)
	}
	console.log(ids_duplicadas)
   
})
chrome.storage.local.get(null, e => {
	var ids_duplicadas = []
	const lista = Object.entries(e)
	for(let i = 1; i < lista.length ; i++){
	    
		let resultado = lista[i-1][0] - lista[i][0]
	    
		if(resultado > -100){
			ids_duplicadas.push(lista[i][0])
		}
	    
	}
	chrome.storage.local.remove(ids_duplicadas, () => console.log(`cantidad de ofertas duplicadas ${ids_duplicadas.length}`))
	   
})

			





var test = new Set()
var valores = []
chrome.storage.local.get(null,function(e){

for (const [key, value] of Object.entries(e)) {
  for(const subValue of value){
	  if(test.has(subValue.id_oferta)){
		  break;
	  }else{
		  test.add(subValue.id_oferta)
		  valores.push(new Date(subValue.fecha_publicacion).getDay())
	  }

	  
  }
}
console.log(valores)
})

*/
				/*
var regex = /.{0,50}\d{1,3} año[s]?.{0,50}/guim
chrome.storage.local.get(null, lista => {
	Object.entries(lista).forEach(oferta => {
		let match;
		while((match = regex.exec(oferta[1].descripcion_empleo) ) !== null){
			console.log(match[0])    
		}
	})
})
print('\n'.join(exrex.generate('(?:Al menos|mínimo|Desde|Experiencia (?:de|de al menos|minima de)) (?:\d{1,2}|\d{1,2}[aoy\- ]*\d{1,2}) año[s]? (?:de experiencia|de experiencia en el cargo|en cargos similares)')))

(?:Al menos|mínimo|Desde|Experiencia (?:de|de al menos|minima de)) (?:\d{1,2}|\d{1,2}[aoy\- ]*\d{1,2}) año[s]? (?:de experiencia|de experiencia en el cargo|en cargos similares)
(?:Al menos|mínimo|Desde|Experiencia de|Experiencia de al menos|Experiencia mínima de) (?:\d{1,2}|\d{1,2}[aoy\- ]*\d{1,2}) año[s]? (?:de experiencia|de experiencia en el cargo|en cargos similares)
(?:mínimo |al menos |Experiencia(?: laboral)? mínima (?:de )?|entre )[+]?\d
(?:\d{1,2}|\d{1,2}[aoy\- ]*\d{1,2}) año[s]?
(?:Al menos|mínimo|Desde|Experiencia de|Experiencia de al menos|Experiencia mínima de) \d año[s]? (?:de experiencia|de experiencia en el cargo|en cargos similares)
(?:(\d)|(\d) [aoy] \d|(\d)-\d) a[ññ]{1,2}o[s]?(?:(?:(?: de)? experiencia)?)
*/
