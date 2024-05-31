//import { components } from "./ui-componentes";

chrome.runtime.sendMessage({ type: "ATTACH_DEBUGGER" });
chrome.runtime.sendMessage({ type: 'sendDOMParser', DOMParser: new DOMParser() });
const selectores_de_dominios = {
  linkedin: {
    lista_ofertas: ".scaffold-layout__list-container",
    paginador: ".jobs-search-results-list__pagination",
    elemento_oferta: "li[data-occludable-job-id='%']",
    atributo_id_oferta: "data-occludable-job-id",
  },
  computrabajo: {
    lista_ofertas: "#offersGridOfferContainer",
    paginador: "div.dFlex.vm_fx.tj_fx.mtB",
    elemento_oferta: "article[data-id='%']",
    atributo_id_oferta: "data-id",
  },
};

const dominio = window.location.host.match(/(?<=\.)\w+(?=\.com)/)[0];
const selector_usar = selectores_de_dominios[dominio];

class JobScraper {
  constructor() {
    this.datos_ofertas = [];
    this.divDescartados = null;
    this.divListaOfertas = null;
    this.paginador = null;
  }

  adjuntar_listener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === "JOB_OFFERS") {
        this.datos_ofertas = request.data;
        this.procesar_ofertas();
      }
    });
  }

  async procesar_ofertas() {
    for (let oferta of this.datos_ofertas) {
      await this.agregar_nodo_oferta(oferta);
    }
  }

  async agregar_nodo_oferta(oferta) {
    const elementoSelector = selector_usar.elemento_oferta.replace('%', oferta.id_oferta);
    let ofertaElemento = await this.esperar_elemento(elementoSelector);

    if (ofertaElemento) {
      let nodo = this.crear_nodo_oferta(oferta);
      ofertaElemento.appendChild(nodo);
    }
  }

  crear_nodo_oferta(oferta) {
    let nodo = document.createDocumentFragment();

    nodo.appendChild(this.crear_elemento_boton(components.buttonDescarte));
    nodo.appendChild(this.crear_elemento_boton(components.buttonBuscar));
    nodo.appendChild(this.crear_elemento_boton(components.buttonDescarteEmpresa));

    if (oferta.anos_experiencia) {
      nodo.appendChild(this.crear_lista_experiencias(oferta));
    }

    return nodo;
  }

  crear_elemento_boton(Enumcomponente) {
    let boton = document.createElement("button");
    boton.classList.add(...Enumcomponente.clases);
    boton.innerHTML = Enumcomponente.html;
    boton.addEventListener("click", Enumcomponente.onclick);
    return boton;
  }

  crear_lista_experiencias(oferta) {
    let ulLista = document.createElement("ul");
    for (let experiencia of oferta.anos_experiencia) {
      ulLista.innerHTML += "<li>" + experiencia + "</li>";
    }
    return ulLista;
  }

  async esperar_elemento(selector, timeout = 5000) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const endTime = Date.now() + timeout;

    while (Date.now() < endTime) {
      let elemento = document.querySelector(selector);
      if (elemento) return elemento;
      await sleep(100);
    }

    return null;
  }

  async init() {
    this.divListaOfertas = await this.esperar_elemento(selector_usar.lista_ofertas);
    this.divDescartados = document.createElement("div");
    this.divDescartados.style.border = "1px solid red";
    this.divDescartados.id = "divDescartados_id";

    let conteo = 0;
    while (this.paginador == null) {
      conteo += 1;
      this.paginador = document.querySelector(selector_usar.paginador);
      await this.sleep(300);
    }

    console.log(`Se busco el paginador ${conteo} veces antes de que aparecio`);
    this.paginador.after(this.divDescartados);

    this.paginador.onclick = () => {
      this.divDescartados.innerHTML = '';
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const jobScraper = new JobScraper();

window.addEventListener("load", (event) => {
  jobScraper.init();
  jobScraper.adjuntar_listener();
});

window.addEventListener("message", function (event) {
  if (event.source !== window) {
    return;
  }
  var message = event.data;
  if (typeof message !== "object" || message === null) {
    return;
  }
  chrome.runtime.sendMessage(event.data);
});
