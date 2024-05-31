import * as util from "../util.js"
import * as util_html from "../util_html.js"
import * as dao_almacenamiento from "../dao_almacenamiento.js"
import {test, map_computrabajo, map_linkedin} from "./funciones_mapeo.js"
import {regex, GruposRegex, regex_experiencia_empleo} from "../regex.js"
//import {url_requests_ofertas} from './info_requests.js'

//TEST
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL || details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        chrome.tabs.create({ url: 'http://localhost:5000/home' }, (tab) => {
            // Una vez que se crea la pestaña test.html, actualiza la pestaña actual para redirigirla
            chrome.tabs.update(tab.id, { url: 'http://localhost:5000/home' });
			
        });
    }
});

const url_requests_ofertas = {
    "www.linkedin.com" : 
		 [
			{
				url : "https://www.linkedin.com/voyager/api/graphql?variables=(jobCardPrefetchQuery",
				func : map_linkedin,
				desc : "lista general de linkedin, www.linkedin.com/jobs/search "
			},
			{
				url : "https://www.linkedin.com/voyager/api/voyagerJobsDashOnsiteApplyApplication",
				func : test,
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
			url : "https://cl.computrabajo.com/trabajo-de-sql-en-rmetropolitana",
			func : map_computrabajo,
			desc : "Lista general"
		}
		,{
			url : "https://cl.computrabajo.com/offersgrid/getofferdetail",
			func : test,
			desc : "oferta individual"
		},{
			url : "https://oferta.computrabajo.com/offer/",
			func : test,
			desc : "oferta individual mayo 2024"
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
function adjuntar_debugger(tabId) {
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

async function handleDebuggerEvent(Debuggee, message, params) {
	if (message === 'Network.responseReceived') {
		if (params.response.status === 200) {
			const domain = new URL(params.response.url).hostname; // www.linkedin.com
			
			if(domain == 'localhost'){
				//ITERAR LAS FUNCIONES
				//AGREGAR CONFIGURACIONES PARA CUANDO LAS OFERTAS YA EXISTEN
				let regex_funcion = new RegExp(/\/get-file\/(.*)\.\w+/)

				let a_buscar = regex_funcion.exec(params.response.url)[1]
				console.log("a_buscar", a_buscar)
				let url_encontrada = (() => {
					for (var site in url_requests_ofertas) {
					var requests = url_requests_ofertas[site];
						for (var request of requests) {
							console.log("request.func.name", request.func.name)
							if (request.func.name == a_buscar) {
								console.log("request", request)
								return request
							}
						}
					}
					return null
				})();
				
				
				if(url_encontrada == null){
					throw "Error al recibir response de localhost, la funcion no existe en el codigo: " + a_buscar
				}
				console.log("id_request", params.requestId)
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
        chrome.debugger.sendCommand({ tabId: Debuggee.tabId }, "Network.getResponseBody", { requestId: params.requestId }, async (responseBody, base64Encoded) => {
            


			//ACA AISLAR, TRABAJAR CON LAS REQUEST EN ESTE NIVEL Y MOVER LA TRANSFORMACION A OTRO LADO

            try {
				let funcion = request_Almacenar[params.requestId].func
				

				
				//AGREGAR ITERACION DE OFERTAS INCOMPLETAS
				let datos_mapeados = await funcion(responseBody.body)
				
				console.log(typeof datos_mapeados, datos_mapeados)

                let ofertas_completas = await modificar_ofertas(datos_mapeados);

				console.log(ofertas_completas)

            } catch (error) {
                console.error({ message, error, request_Almacenar, params, responseBody });
                
            } finally{
                delete request_Almacenar[params.requestId];
            }
        });
	}
}
chrome.debugger.onEvent.addListener(handleDebuggerEvent);


async function modificar_ofertas(mappeados) {
	//LISTA DE N OBJECTOS DE MODELO_OFERTA
	let ofertas_modificadas = [];
	var regx = new regex()

	for (let oferta of mappeados) {

		let id_oferta = oferta.id_oferta;
		let oferta_almacenada = await traer_oferta(id_oferta);
		//IF Oferta ya existe
		if (oferta_almacenada & !util.objectoEstaVacio(oferta_almacenada)) {
			oferta_almacenada.cantidad_solicitudes.push(oferta.cantidad_solicitudes[0]);
			chrome.storage.local.set({ id_oferta: oferta_almacenada });
			ofertas_modificadas.push(oferta_almacenada);
			continue;
		}

		const regex_a_test = ["CARGO", "EMPRESA", "TECNOLOGIA"];

		for (let grupo of regex_a_test) {
			if (regx.tiene_match_con_gruporegex(oferta[grupo], GruposRegex[grupo])) {
				oferta.oferta_descartada = true;
				oferta.tipo_descarte[grupo] = true;
			}
		}


		oferta.tecnologias = extraer_tecnologias(oferta.descripcion_empleo);



		//LOS AÑOS SE EXTRAEN AUNQUE ESTE DESCARTADA, PARA POSTERIOR ANALISIS
		let a = extraer_anos_experiencia(oferta.descripcion_empleo);
		oferta.anos_experiencia = a[0];
		oferta.requisitos_experiencia_texto = a[1];

		if (oferta.anos_experiencia) {
			oferta.experiencia_minima = Math.min(...oferta.anos_experiencia);

			oferta.annos_exp = oferta.requisitos_experiencia_texto;

		}

		ofertas_modificadas.push(oferta);
	}
	return ofertas_modificadas
}

async function traer_oferta(id_oferta){
    let resp = null
    await chrome.storage.local.get(id_oferta).then((oferta) => {
        resp = oferta
    })

    return resp
}




function extraer_anos_experiencia(descripcion_empleo) {
    let match = undefined;
    let matches = []
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

function actualizar_cantidad_solicitudes(id_oferta, cantidad_solicitudes) {
     chrome.storage.local.get(id_oferta).then((oferta) => {
        let tiempo_llamado = new Date().getTime()
		//regx.buscar_match(fila.primaryDescription.text, /(\d+)(?= solicitud)/guim),
		try {
            oferta[id_oferta].cantidad_solicitudes.push({
                cantidad_solicitudes: cantidad_solicitudes,
                fecha_extraccion: tiempo_llamado
            });
        } catch (error) {
            console.error('Error en la asignacion del cant solicitudes', Lista_oferta, id_oferta, error);
        }
    });
}





function extraer_tecnologias(descripcion_empleo){
    let formateado_descripcion_empleo = util.quitarAcentos(descripcion_empleo)
					
    let match;
    let matches = new Set()
    let iteraciones = 0
	const MAX_ITERACIONES = 10
    
	while ((match = GruposRegex.BUSQUEDA.regex.exec(formateado_descripcion_empleo)) !== null && iteraciones < MAX_ITERACIONES) {
        matches.add(match[0])
        iteraciones += 1
    }	
	return matches
}

// matches.forEach(e => chrome.scripting.executeScript({
// 	target : {tabId : tabId} ,
// 	func :  util_html.agregar_etiqueta,
// 	args : [id_oferta,e,etiquetas.ESPECIAL]
// }))