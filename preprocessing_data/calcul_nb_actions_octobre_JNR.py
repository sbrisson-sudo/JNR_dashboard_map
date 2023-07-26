# -- Importations --

# pandas : bibliothèque de manipulation et d'analyse de données
import pandas as pd
# datetime : bibliothèque de gestion de date
from datetime import datetime

# -- Chargement des données --

# On charge les deux onglets actions du tableau
data_file = "dossiers_journee-nationale-de-la-resilience-appel-a-projets_2023-07-04_09-02.xlsx"
df_actions = [
    pd.read_excel(data_file, sheet_name=sheet_name) for sheet_name in ["(3344502) Action", "(3308253) Action"]
]

# On convertit les colonnes de dates au format date (sinon : lut comme des chaînes de caractères)
for dt_col in ["Date prévisionnelle du début de l'action", "Date prévisionnelle de la fin de l'action"]:
    for df in df_actions:
        df[dt_col] =  pd.to_datetime(df[dt_col], format='%Y-%m-%d')

# -- Traitement des données --

# On regarde pour chaque action si elle tombe (au moins en partie) en octobre
dt1 = datetime(2023, 10, 1)
dt2 = datetime(2023, 10, 31)

init_date = "Date prévisionnelle du début de l'action"
end_date = "Date prévisionnelle de la fin de l'action"

# Logique : (debut est en octobre) OU (fin est en octobre) OU (debut avant octobre ET fin après octobre)
for df in df_actions:
    df["Action en octobre"] = ((df[init_date] >= dt1) & (df[init_date] <= dt2)) | \
            ((df[end_date] >= dt1) & (df[end_date] <= dt2)) | \
            ((df[end_date] >= dt2) & (df[init_date] <= dt1))

# On compte pour chaque dossier le nombre d'actions en octobre
df = pd.concat([df[["Dossier ID","Action en octobre"]] for df in df_actions]).groupby("Dossier ID").sum()\
    .rename(columns={"Action en octobre":"Nombre d'actions en octobre"})

# -- Export des données --

# On écrit les données dans un nouveau tableau excel
df.to_excel("nombre_actions_octobre.xlsx")

