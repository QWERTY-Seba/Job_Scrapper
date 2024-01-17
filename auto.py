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


try:
    driver = webdriver.Chrome(options = chrome_options)
    driver.get(r"https://www.linkedin.com/jobs/search/?currentJobId=3411919466&f_TPR=r604800&geoId=100690236&keywords=SQL%20OR%20DATA&location=Regi%C3%B3n%20Metropolitana%20de%20Santiago%2C%20Chile&refresh=true&sortBy=DD")
except:
    if 'driver' in locals():
        driver.quit()

    
def Simular_Navegacion():
    
    """ COSAS QUE DEBERIA HACER,
        
        CLICKEAR OFERTAS
        CLICKEAR BARRA DE NAVEGACION
        CLICKEAR TODAS LAS OFERTAS QUE ESTEN EN VERDE
        SUBIR Y BAJAR EN LA PAGINA
        REPOSAR
        SABER CUANDO LLEGO AL FINAL
        ESPERAR A QUE LA PAGINA CARGE COMPLETAMENTE
    """

#driver.get('https://www.volanteomaleta.com/')#'https://nowsecure.nl')


 