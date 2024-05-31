import modelo_oferta from '../modelo_oferta.js';
import {GruposRegex, regex} from '../regex.js'
import * as util from '../util.js'



async function map_computrabajo_individual(){
	
}

async function test(){

}
async function map_computrabajo(respuesta){
	//MOVER ESTO A INFO_PAGINAS
	const computrabajo_selectores = {
		
		id_oferta: {usar_padre : true, atributo_dato : "data-id"},
		cargo: 'h2[class="fs18 fwB"] > a[class="js-o-link fc_base"]',
		empresa: 'p[class="dIB fs16 fc_base mt5"] > a[class="fc_base t_ellipsis"],p[class="dIB fs16 fc_base mt5"]:not(:has(*))',
		localizacion_empleo: 'p[class="fs16 fc_base mt5"] > span[class="mr10"]',
		fecha_publicacion_texto : 'p[class="fs13 fc_aux mt15"]',
		link_externo_incripcion: {selector : 'a[data-href-offer-apply]', atributo_dato : 'data-href-offer-apply'},
		tipo_modalidad: 'div[class="fs13 mt15"] > span[class="dIB mr10"]:not(:has(span.i_salary))', 
		salario : 'div[class="fs13 mt15"] > span[class="dIB mr10"]:has(span.i_salary)',
		link_oferta : {selector : 'h2[class="fs18 fwB"] > a[class="js-o-link fc_base"]' , atributo_dato : "href"},
		link_empresa : {selector : 'p[class="dIB fs16 fc_base mt5"] > a[class="fc_base t_ellipsis"],p[class="dIB fs16 fc_base mt5"]:not(:has(*))', atributo_dato : "href"}
	
	};

	//MANDAR MENSAJE A OFFSCREEN

	if(!await chrome.offscreen.hasDocument()){
		await chrome.offscreen.createDocument({
			url: 'background/offscreen/offscreen.html',
			reasons: ['DOM_PARSER'],
			justification: 'Parse HTML response'
		});
	}
	let res = await chrome.runtime.sendMessage({
		offscreen: true,
		target: 'offscreen',
		action: 'parseHTML',
		html: respuesta,
		selectores : computrabajo_selectores })
	
	res.map(e => e.pagina_recoleccion = "computrabajo")

	console.log("res post offscreen", res)
	return res
	


}


function map_linkedin(respuesta,DOMParser) {
	let Lista_oferta = {}
	let tiempo_llamado = new Date().getTime()
	const resp = JSON.parse(respuesta.replaceAll("\n", "\\n"))
	var regx = new regex()
	var reg = new RegExp(/\d+/)

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
				let descripcion_empleo = util.quitarAcentos(fila.description.text)
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
	//TRANSFORMAR A LISTA

	return Object.values(Lista_oferta);
	
}

export {test, map_computrabajo, map_linkedin}