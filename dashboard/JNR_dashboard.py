#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Jul 27 2023
@author: Sylvain Brisson sylvain.brisson@ens.fr
"""

# imports 

# pandas
import pandas as pd 

# dash
import dash
from dash import dcc
from dash import html
from dash.dependencies import Input, Output, State

import base64, io

DOSSIER_TABLE_COLS = [
    "ID",
    "État du dossier",
    "Déposé le",
    "Dernière mise à jour le",
    "Zone géographique",
    "Raison sociale",
    "A participé à la JNR 2022"
]


style_table = dict(
    style_data={
        'color': 'black',
        'backgroundColor': 'white',
        'whiteSpace': 'normal',
        'height': 'auto',
        'lineHeight': '15px'
    },
    style_data_conditional=[
        {
            'if': {'row_index': 'odd'},
            'backgroundColor': 'rgb(220, 220, 220)',
        }
    ],
    style_header={
        'backgroundColor': 'rgb(210, 210, 210)',
        'color': 'black',
        'fontWeight': 'bold'
    },
    fill_width=False
)




external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']
app = dash.Dash(__name__, external_stylesheets=external_stylesheets)

app.layout = html.Div([
    
    dcc.Markdown(children=f"""
# Journée nationale de la résilience : tableau de bord

### Chargement des données 

Charger ci-dessous le fichier excel issu de démarches simplifiées

"""),
     
    dcc.Markdown(id='div_xls'),
    dcc.Upload(
        id='upload_xls',
        children=html.Div([
            'Drag and Drop or ',
            html.A('Select a File')
        ]),
        style={
            'width': '100%',
            'height': '60px',
            'lineHeight': '60px',
            'borderWidth': '1px',
            'borderStyle': 'dashed',
            'borderRadius': '5px',
            'textAlign': 'center'
        }
    ),
    dcc.Markdown(id='md_xlsx_sucess'), 
    
    html.H2("Dossiers :"),

    html.Div([
        # dcc.Markdown(""),
        dash.dash_table.DataTable(
            id='dossier_table',
            columns=[{"name": i, "id": i} for i in DOSSIER_TABLE_COLS],
            **style_table
        )   
    ]),
    
])

# display filenames
@app.callback(
    Output('div_xls','children'),
    Input('upload_xls', 'filename')
)
def display_xls_filename(filename):
    return  f"Loaded file : **{filename}**"

# loading content
@app.callback(
    [
        Output("dossier_table", "data"),
        Output('md_xlsx_sucess','children')
    ],
    [Input('upload_xls', 'contents')])
def loading_xls_data(content):
    
    if not content:
        return dash.no_update
    
    content_type, content_string = content.split(',')
    decoded = base64.b64decode(content_string)
    
    xls_file = io.BytesIO(decoded)
    
    # extract data
    df_dossier = pd.read_excel(xls_file, sheet_name="Dossiers")
    
    # convert dates
    for col in [
        'Dernière mise à jour le',
        'Déposé le',
        'Passé en instruction le',
        'Traité le'
    ] :
        df_dossier[col] = pd.to_datetime(df_dossier[col], format='%Y-%m-%d')
    
    # rename columns
    RENAME_COLS_DOSSIER = {
        "Sélectionnez la zone géographique du projet" : "Zone géographique",
        "Avez-vous participé à la JNR 2022?" : "A participé à la JNR 2022"
    }
    df_dossier = df_dossier.rename(columns=RENAME_COLS_DOSSIER)
    
    # extract data for tables
    dossier_table_data = df_dossier[DOSSIER_TABLE_COLS]
    # format dates
    for c in ['Dernière mise à jour le','Déposé le'] : dossier_table_data[c] = dossier_table_data[c].dt.strftime("%d/%m/%Y")
    # jsonify
    dossier_table_data = dossier_table_data.to_dict(orient='records')
    
    # return data
    return dossier_table_data, "Données chargées ✅"
    
    
    
    
    




if __name__ == '__main__':
    app.run_server(debug=True)