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

# On rassemble les données relatives aux risques
col_rsq = ["Risques ciblés", "Risques naturels", "Risques technologiques"]
df = pd.concat([df_action[["Dossier ID"] + col_rsq] for df_action in df_actions])

# -- Traitement des données --

# On élimine les lignes en double puis on concatène les champs
df = df.drop_duplicates().groupby("Dossier ID").sum().replace(0, "")

# -- Export des données --

# On écrit les données dans un nouveau tableau excel
df.to_excel("risques_traités.xlsx")

