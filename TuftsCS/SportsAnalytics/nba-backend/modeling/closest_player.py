import numpy as np 
import pandas as pd 
import pickle


raw_data = pd.read_csv('formatted_training_data.csv') 
# keep only not retired players
closest_comp_data = raw_data.loc[raw_data['Retired'] == 0]
# remove players who only played one season
closest_comp_data = closest_comp_data.loc[closest_comp_data['Guard2'] < 2]
closest_comp_data = closest_comp_data[closest_comp_data.Draft_pick != 'Undrafted']
closest_comp_data = closest_comp_data.dropna(axis=0)


active_players = closest_comp_data.drop(['Career_length', 'Career_WS/48', 'Career_OBPM', 'Career_DBPM',
                                 'Career_BPM', 'Career_VORP', 'Retired'], axis=1)
active_players = active_players.drop(['Name', 'urlID'], axis=1)


pickles = ['Career_length.pkl', 'Career_OBPM.pkl', 'Career_DBPM.pkl']
stats_to_cluster = pd.DataFrame([])

for p in pickles:
    model = pickle.load(open(p, 'rb'))
    prediction = model.predict(active_players.to_numpy())
    stats_to_cluster[p] = prediction 

from scipy.spatial import KDTree
kdtree = KDTree(stats_to_cluster.to_numpy())

distance, index = kdtree.query([13, 1, 1], 1) 
# i put random stats in the array, should be the ones our model predicts
print(closest_comp_data.iloc[[index]])

