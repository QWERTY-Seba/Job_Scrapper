import modelo_oferta from "../../modelo_oferta.js"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    if (message.action === 'parseHTML') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(message.html, 'text/html');
      const selectores = message.selectores

      // Aquí puedes realizar operaciones en el DOM de `doc`
      // Suponiendo que `map_computrabajo` se defina aquí también
      const result = DOM_a_modeloOferta(selectores, doc);
      
      sendResponse(result);
    }
});
  //MODIFICAR LA MANERA EN LA QUE SE ESPECIFICAN LOS SELECTORES, HAY QUE AGREGAR MAS CONDICIONES CUANDO EL DATO NO ESTA EN EL TEXTCONTENT
  function DOM_a_modeloOferta(selectores, doc) {
    let res = [];
    try {
      let ofertas = doc.querySelectorAll('article.box_offer');
      const lista_selectores = Object.entries(selectores);
  
      for (let elemento_oferta of ofertas) {
        let oferta = structuredClone(modelo_oferta)
        for (let [atributo, selector] of lista_selectores) {
            try{
                //COMPROBAR SI EL ATRIBUTO ES LISTA, instance of Array
                if(selector["usar_padre"]){
                  oferta[atributo] =  elemento_oferta.getAttribute(selector["atributo_dato"])               
                  continue
                }
                if(selector["atributo_dato"]){
                  oferta[atributo] =  elemento_oferta.querySelector(selector["selector"]).getAttribute(selector["atributo_dato"])               
                  continue
                }
                oferta[atributo] = elemento_oferta.querySelector(selector).innerText.trim();
            }catch(Error){
                console.log("Error en DOM_a_modeloOFERTA", atributo, selector, Error)
            }
            
        }
        res.push(oferta);
      }
      
      if (res.length > 20) {
        console.warn("Hay mas de 20 ofertas en la lista de DOM_A_MODELOOFERTA");
      }
      
    } catch (Error) {
      console.log(Error.message);
    }
    return res;
  }
  