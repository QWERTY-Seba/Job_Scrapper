const components = {
    buttonDescarte: {
        html: `
            <button>
                <li-icon aria-hidden="true" type="close" class="artdeco-button__icon" size="small">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
                        <path d="M14 3.41L9.41 8 14 12.59 12.59 14 8 9.41 3.41 14 2 12.59 6.59 8 2 3.41 3.41 2z"></path>
                    </svg>
                </li-icon>
            </button>`,
        classes: ['boton_descarte_oferta', 'artdeco-button', 'artdeco-button--circle', 'artdeco-button--muted', 'artdeco-button--1', 'artdeco-button--tertiary'],
        onclick: function (id_oferta) {
            window.postMessage({ type: "DESCARTAR_OFERTA", id_oferta });
            claseTestSeba.descartarOferta(id_oferta);
        }
    },
    buttonBuscar: {
        html: `
            <button>
                <svg style="color:rgba(0,0,0,0.6)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="search-small" data-supported-dps="16x16" fill="currentColor">
                    <path d="M14.56 12.44L11.3 9.18a5.51 5.51 0 10-2.12 2.12l3.26 3.26a1.5 1.5 0 102.12-2.12zM3 6.5A3.5 3.5 0 116.5 10 3.5 3.5 0 013 6.5z"></path>
                </svg>
            </button>`,
        classes: ['boton_buscar_oferta', 'artdeco-button', 'artdeco-button--circle', 'artdeco-button--muted', 'artdeco-button--1', 'artdeco-button--tertiary'],
        onclick: function (id_oferta) {
            window.postMessage({ type: "BUSCAR_OFERTA", id_oferta });
        }
    },

    buttonDescarteEmpresa: {
        html: `
            <button>
                <svg style="color:rgba(0,0,0,0.6)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="search-small" data-supported-dps="16x16" fill="currentColor">
                    <path d="M14.56 12.44L11.3 9.18a5.51 5.51 0 10-2.12 2.12l3.26 3.26a1.5 1.5 0 102.12-2.12zM3 6.5A3.5 3.5 0 116.5 10 3.5 3.5 0 013 6.5z"></path>
                </svg>
            </button>`,
        classes: [],
        onclick: function (id_oferta) {
            window.postMessage({type : "DESCARTAR_EMPRESA",id_oferta : e.dataset.occludableJobId})
        }
    }
};