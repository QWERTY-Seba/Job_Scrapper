const input = `Somos una fintech que busca facilitar el bienestar financiero de millones de personas a través de distintas herramientas tecnológicas. Con nosotros, millones de personas tienen acceso a invertir sus ahorros de forma simple, óptima y con costos justos.

Queremos dejar el mundo mejor del cómo lo encontramos ¿Te animas?

Tareas

📈 ¿Qué harás?

El objetivo principal consiste en ser la persona responsable de la cartera de inversión de los productos actuales y futuros de la compañía, reportando al Gerente General y con línea directa al equipo de fundadores. Por lo tanto, tu día a día se vera algo así:

 Determinar la estrategia de inversión, en base a los objetivos y necesidades de los clientes.
 Desarrollar el área, y estar a cargo de la contratación, desarrollo y establecimiento de objetivos de las personas que la integrarán, partiendo por una persona que ocupará el cargo de analista de inversiones.
 Construir carteras de inversión en base a una estrategia pasiva de inversión, con la ayuda de un algoritmo de inversión, basado en datos
 Comprar y vender, junto con el equipo de inversiones, valores en las cuentas de los fondos para mantener una estrategia de inversión específica o para alcanzar un objetivo de inversión.
 Determinar los niveles de riesgo aceptables para los fondos en función de lo plazos, las preferencias de riesgo, las expectativas de rentabilidad y las condiciones del mercado.
 Apoyar la estrategia de educación financiera de la compañía, colaborando en generar contenido que ayude a entender términos complejos de una manera simple y cercana. Esto incluye temas de conocimiento general de temas financieros y económicos, así como coyuntura. Se espera apoyo en blogs, columnas de opinión, rrss, etc.


Requisitos

🕵️‍♂️ ¿Qué perfil buscamos?

Profesional con al menos 3 o 4 años de experiencia del área ingeniería Comercial, ingeniería Civil, Economía o área relacionada.
Profesional con al menos 1 a 4 años de experiencia del área ingeniería Comercial, ingeniería Civil, Economía o área relacionada.
Manejo de Python y SQL excluyente.
Conocimiento de los mercados de capitales y ETF.
Experiencia liderando equipos.
Suma puntos si tienes certificado profesional como analista financiero (CFA).
También suma puntos conocimientos en renta fija nacional.


Si cumples con los requisitos o conoces a alguien que le interese postular, ¡Entonces queremos conocerlos!

Beneficios

🤩 ¿Qué te ofrecerte?

+5 días de vacaciones extras al año. Nos preocupas que tengas un buen equilibrio entre tu vida personal y profesional.
Plan Stock-Options, no buscamos solo un trabajador, sino que a un integrante de nuestro equipo.
Invertir en uno mismo es la mejor inversión, asi que te brindamos un bono de capacitación para que te puedas educar en lo que tu quieras.
Bono Home-Office para que puedas contar con todas las herramientas necesarias para los días que te encuentres en tu hogar.
Contamos con gimnasio en nuestras oficinas.


✨ ¿Como es el proceso?

De partida, nosotros no hacemos entrevistas tradicionales, sino que realizamos conversatorios. Nos interesa mucho saber cuales son tus intereses asi que tambien sientete libre de preguntarnos todo!

Nuestro proceso consiste en:

Conversatorio Cultura. Instancia para que conozcas la cultura de SoyFocus y los aspectos generales del cargo.
Conversatorio Líder. Instancia para que conozcas en mayor profundidad sobre el cargo y conversaras con tu futuro líder, asi que pueden habler en su mismo idioma.
Conversatorio Founder. Instancia para que conozcas la visión que tiene uno de nuestros founders sobre SoyFocus, el cargo y tu rol con nosotros.
Conversatorio Equipo. Instancia para que conozas al equipo de SoyFocus, conoceras a dos personas aleatorias de todo SoyFocus.


La idea es que, al terminar el proceso, puedas tener una mirada 360° de toda la organización.`;

function extraer_info_descripcion_empleo(descripcion){
	const pattern = /(?:(?<KEYWORDS>python|excel|etl|power bi|sql))|(?:(?<EXPERIENCIA_CON_ANNOS>(?:maximo |entre |al menos |minimo |desde |experiencia |)(?:de |de al menos |minima de |hasta )?[+]?(\d{1,2})[aoy\- ]*(\d{1,2})? a[nñ]o[s]?(?: de experiencia(?: en el cargo| minima|)?| en cargos similares| en \w+)))/guim;
	
	let match;
	const resp_rex = {
		KEYWORDS: [],
		EXPERIENCIA_CON_ANNOS: [],
	};

	while ((match = pattern.exec(input)) !== null) {
		for (const key of Object.keys(resp_rex)) {
			const value = match.groups[key];
			
			const extrac = [match[3],match[4]]
			
			if (value !== undefined) {
				if(match[2] !== undefined){
					resp_rex[key].push([value,extrac]);
					continue	
				}
				resp_rex[key].push(value);
			}
		}
	}
	return resp_rex
}


console.log(extraer_info_descripcion_empleo(input));





const fs = require('fs')
var resp;

try {
    resp = await fs.readFileSync('./test_resp.json', 'utf8');
} catch (error) {
console.error('Error reading or parsing JSON file:', error.message);
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
	cantidad_vacantes : null
	
}

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

function getSafe(fn, defaultVal) {
	try {
		return fn();
	} catch (e) {
		return defaultVal;
	}
}

var reg = new RegExp(/\d+/)

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
				oferta_temp.descripcion_empleo = fila.description.text
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
					Lista_oferta[id_oferta].link_empresa = getSafe(() => fila.logo.actionTarget, '')
					Lista_oferta[id_oferta].info_empresa = getSafe(() => fila.jobInsightsV2ResolutionResults[1].insightViewModel.text.text, '')
					Lista_oferta[id_oferta].tipo_jornada = getSafe(() => fila.jobInsightsV2ResolutionResults[0].jobInsightViewModel.description[1].label.text.text, '')
					
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
                Lista_oferta[id_oferta].tipo_solicitud = fila.applyCtaText.accessibilityText
				break;
			case 'com.linkedin.voyager.dash.organization.Company':
				break;
			default:
				break;
		}
	}

	return Lista_oferta;
	
}

function summarizeModel(modelo_oferta) {
    const summary = {};
  
    // Iterate over the integer keys
    for (const key in modelo_oferta) {
      if (modelo_oferta.hasOwnProperty(key)) {
        const currentObject = modelo_oferta[key];
  
        // Iterate over the attributes in the current object
        for (const attribute in currentObject) {
          if (currentObject.hasOwnProperty(attribute)) {
            if (!summary[attribute]) {
              summary[attribute] = {
                empty: 0,
                withContent: 0,
                nullValue: 0,
              };
            }
  
            const attributeValue = currentObject[attribute];
  
            // Check if the attribute value is an array
            if (Array.isArray(attributeValue)) {
              // Summarize the list based on its length
              if (attributeValue.length === 0) {
                summary[attribute].empty++;
              } else {
                summary[attribute].withContent++;
              }
            } else {
              // Handle scalar values (not lists)
              if (attributeValue === '') {
                summary[attribute].empty++;
              } else if (attributeValue === null) {
                summary[attribute].nullValue++;
              } else {
                summary[attribute].withContent++;
              }
            }
          }
        }
      }
    }
  
    return summary;
  }

const transformado = Linkedin(resp)
const summary = summarizeModel(transformado);
console.log(summary);
  

