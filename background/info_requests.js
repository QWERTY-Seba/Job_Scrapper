import { test, map_computrabajo, map_linkedin } from "./funciones_mapeo";

//AGREGAR INFO DE COMO PROCESAR CADA REQUEST Y URL A USAR, PAGINAS DISPONIBLES
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

export {url_requests_ofertas}