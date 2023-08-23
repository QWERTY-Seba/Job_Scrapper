document.querySelectorAll('a.url_sitio_scrap').forEach(e => {
    e.addEventListener("click", function(e_a){       
        chrome.tabs.create({url: e.attributes["url_sitio"].value, active: false});
        
    });
})
