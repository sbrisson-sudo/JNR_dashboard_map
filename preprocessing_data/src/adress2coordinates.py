# -*- coding: utf-8 -*-
# -- Importations --

# pandas : bibliothèque de manipulation et d'analyse de données
import pandas as pd
# request : pour appeler l'API OpenStreetMap
import requests

# -- Chargement des données --

# On charge les deux onglets actions du tableau
data_file = "dossiers_journee-nationale-de-la-resilience-appel-a-projets_2023-07-04_09-02.xlsx"
df = pd.read_excel(
    data_file,
    sheet_name="Dossiers"
    )


# On créé un nouveau dataframe pour stocker les adresses et les coordonnées
df2 = pd.DataFrame(
    index = df["ID"],
    columns = ["Adresse","lat_deg","lon_deg"]
)

df2["Adresse"] = df.set_index("ID")["Adresse"]

# -- Traitement des données --

def adress2latlon(adress):
    """
    Fonction prenant en entrée une adresse et retournant la latitude et 
    la longitude. En cas d'échec, retourne None et affiche un message d'erreur
    """
    url = f"https://nominatim.openstreetmap.org/?adressdetails=1&q={adress.replace(' ','+')}&format=json&limit=1"
    try :
        data = requests.get(url).json()[0]
        return (data["lat"],data["lon"])
    except :
        print(f"Warning : adress not found : {adress}")
        
# Récupération des coordonnées
df2[['lat_deg', 'lon_deg']] = pd.DataFrame([adress2latlon(adress) for adress in df2['Adresse']], index=df2.index)

# -- Export des données --

# On écrit les données dans un nouveau tableau excel
df2.to_excel("coordonnées_actions.xlsx")
