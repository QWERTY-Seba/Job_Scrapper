# -*- coding: utf-8 -*-
"""
Created on Wed Aug 10 20:39:01 2022

@author: Seba
"""



proxies = ['143.255.178.33','181.212.58.68','45.225.207.183','45.225.207.182','201.238.248.134','190.211.161.211','143.255.179.188','143.255.178.129','146.83.216.227','38.7.197.192','38.7.197.176','190.102.234.98','181.74.83.250']

ruta_driver = r"C:\Users\Seba\Documents\chromedriver.exe"
url = ""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
#import win32clipboard
import time
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from datetime import date
import win32gui
import win32con
import win32api
import ctypes
from contextlib import suppress

ruta_driver = r"C:\Users\Seba\Documents\chromedriver.exe"

chrome_options =  Options() 
chrome_options.binary_location = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument(r"--user-data-dir=I:\SELENIUM_TEST_PROFILES")#"C:\Users\Seba\AppData\Local\Google\Chrome\User Data")
chrome_options.add_argument("--profile-directory=Profile 4")


driver = webdriver.Chrome(options = chrome_options)

paginas = {
    "computrabajo" : {
        "url_pagina" : "https://cl.computrabajo.com/trabajo-de-sql-en-rmetropolitana",
        "selector_oferta" : "article.box_offer",
        "selector_paginador" : 'span[title="Siguiente"]',
        "paginador_simple" : True,
        "selector_boton" : None,
        "de_a_uno" : True
        },
    "linkedin" : {
        "pagina" : "https://www.linkedin.com/jobs/search/?currentJobId=3809561427&f_TPR=r604800&geoId=100690236&keywords=SQL%20OR%20DATA%20OR%20INFORMATICO%20OR%20ETL%20OR%20PYTHON&location=Regi%C3%B3n%20Metropolitana%20de%20Santiago%2C%20Chile&origin=JOB_SEARCH_PAGE_JOB_FILTER&refresh=true&sortBy=DD",
        "selector_oferta" : "li[data-occludable-job-id]",
        "selector_paginador" : "ul.artdeco-pagination__pages.artdeco-pagination__pages--number",
        "paginador_simple" : False, # SI ES FALSE; ENTONCES BUSCA EL SELECTOR DEL BOTON
        "selector_boton" : "li[data-test-pagination-page-btn={pagina_siguiente}]>button",        
        "de_a_uno" : False
        
        }
    
    
    
    
    
    }

def seguir_buscando():
    #DEVOLVER TRUE SI QUEDAN MAS NUMERO DE PAGINAS POR ITERAR, LOS SELECTORES VARIAN DEPENDIENDO DE LA PAGINA
    return True
    

def computrabajo():
    pagina = "computrabajo"  
    driver.get(pagina["url_pagina"])     
    ofertas = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, pagina["selector_oferta"] )))

    #Clickear
    for oferta in ofertas:
        id_oferta = oferta.get_attribute("data-id")

        oferta.click()
        info_oferta = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, f"div.box_detail[data-id='{id_oferta}']")))
    



def algo():
    try:
        for pagina in paginas:   
            
            driver.get(pagina["url_pagina"])
            
            #TALVEZ UN SCRIPT PARA CADA PAGINA
            #EL PAGINADOR NO CAMBIA, LAS OFERTAS SI
            #HACER ADAPTABLE PARA ITERAR TODAS LAS PAGINAS
            #FALTA AGREGAR LIMITADOR; CUANDO PARAR DE SCRAPEAR
            
            
            #SI EL PAGINADOR NO ES SIMPLE, BUSCA HASTA QUE NO QUEDEN NUMEROS
            #SINO, HASTA QUE BOTON DE SIGUIENTE NO ESTE O ESTE DESACTIVADO
            
            #CLICKEAR HASTA LLEGAR AL LIMITE
            iteraciones = 1
            while seguir_buscando:            
                ofertas = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, pagina["selector_oferta"] )))
                if pagina["de_a_uno"]:
                    for oferta in ofertas:
                        #OBTENER LA ID DE LA OFERTA Y ESPERAR A QUE X COSA ESTE CARGADO
                        oferta.click()
                        #ESPERAR A QUE SE CARGUE LA RESPUESTA Y USAR DELAY
                        #TRATAR DE SIEMPRE CARGAR EN PAGINA NUEVA
                
                
                paginador = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.CSS_SELECTOR, pagina["paginador"] )))            
                ActionChains(driver).scroll_to_element(paginador).perform()
                
                
                if pagina["paginador_simple"]:
                    #SI EL PAGINADOR ES SIMPLE, EL MISMO PAGINADOR ES EL BOTON
                    
                    
                    paginador.click()
                
                else:
                    paginador.find_element(By.CSS_SELECTOR,pagina["selector_boton"].format(numero_pagina = iteraciones)).click()
                    iteraciones += 1
                    
                    print(paginador)

            #CERRAR VENTANA


    except Exception as e:
        print(e)
        # if 'driver' in locals():
        #     driver.quit()

        

    #driver.get('https://www.volanteomaleta.com/')#'https://nowsecure.nl')


    