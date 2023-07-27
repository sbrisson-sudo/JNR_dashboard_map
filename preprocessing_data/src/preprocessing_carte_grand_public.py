#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Jul 26 2023
@author: Sylvain Brisson sylvain.brisson@ens.fr
"""

import pandas as pd
import requests
import os 
import re 
from datetime import datetime

# Etude des données disponibles

file_pattern =  r"^dossiers_journee-nationale-de-la-resilience-appel-a-projets_(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}).xlsx$"

jnr_data_files = pd.DataFrame(columns=["Filename","Date"])

data_files = os.listdir("../in_data")

for file_name in data_files : 
    
    # Recherche du patter dans le nom du ficheir
    match = re.search(file_pattern, file_name)
    
    if match:
        date_str, heure_str = match.groups()
        # Convertir la date et l'heure en datetime
        dt = datetime.strptime(f"{date_str} {heure_str}", "%Y-%m-%d %H-%M")
        
        jnr_data_files = pd.concat(
            objs=[
                jnr_data_files,
                pd.DataFrame({"Filename":file_name,"Date":dt}, index=[0])
                ],
            ignore_index=True
        )
                
latest_file = jnr_data_files.sort_values("Date").iloc[-1]
                
print(f"Utilisation de la dernière extraction de démarche simplifiée ({latest_file['Date'].strftime('%d/%m/%Y %Hh%M')})")

# Chargement des données : lecture des fichiers dans in_data et chargement du plus récent

df_dossier_in = pd.read_excel(
    latest_file["Filename"],
    sheet_name="Dossiers"
    )

dfs_actions_in = [
    pd.read_excel(latest_file["Filename"], sheet_name=sheet_name) for sheet_name in ["(3344502) Action", "(3308253) Action"]
]

# Création d'un nouveau dataframe contenant les données nécessaires pour la carte interactive

# Colonnes à récuper :
{
    "Dossier": [
        
    ],
    "(3344502) Action" : [

    ],
    "(3308253) Action" : [

    ]
}