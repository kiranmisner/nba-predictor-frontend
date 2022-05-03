# Import libraries
import numpy as np
import pandas as pd 
from flask import Flask, request, jsonify
import pickle
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

bpm_model = pickle.load(open('./modeling/Career_BPM.pkl','rb'))
dbpm_model = pickle.load(open('./modeling/Career_DBPM.pkl','rb'))
career_len_model = pickle.load(open('./modeling/Career_length.pkl','rb'))
career_obpm_model = pickle.load(open('./modeling/Career_OBPM.pkl','rb'))
career_vorp_model = pickle.load(open('./modeling/Career_VORP.pkl','rb'))
career_ws48_model = pickle.load(open('./modeling/Career_WS_48.pkl','rb'))
classification = pickle.load(open('./modeling/classifier.pkl','rb'))


# Load the model
# model = pickle.load(open('./modeling/Career_BPM.pkl','rb'))

@app.route('/api',methods=['POST'])
def predict():
    # Get the data from the POST request.
    data = request.get_json(force=True)
    values = data['playerInfo']
    # Get the data from the POST request.
    # Make prediction using model loaded from disk as per the data.
    bpm = bpm_model.predict(np.array(values).reshape(1,-1)).tolist()
    dbpm = dbpm_model.predict(np.array(values).reshape(1,-1)).tolist()
    career_length = career_len_model.predict(np.array(values).reshape(1,-1)).tolist()
    career_obpm = career_obpm_model.predict(np.array(values).reshape(1,-1)).tolist()
    career_vorp = career_vorp_model.predict(np.array(values).reshape(1,-1)).tolist()
    career_ws48 = career_ws48_model.predict(np.array(values).reshape(1,-1)).tolist()

    career_class = classification.predict(np.array([career_length, career_obpm, dbpm]).reshape(1,-1)).tolist()
    closest_player = getClosestPlayer(career_length, career_obpm, dbpm)

    # return the output of all predictions
    return jsonify(bpm=bpm, dbpm=dbpm, career_length=career_length, career_obpm=career_obpm, career_vorp=career_vorp, career_ws48=career_ws48, career_class=career_class, closest_player=closest_player)

def getClosestPlayer(career_len, projected_obpm, projected_dbpm):
    print(career_len, projected_obpm, projected_dbpm)
    raw_data = pd.read_csv('./modeling/formatted_training_data.csv') 
    # keep only not retired players
    closest_comp_data = raw_data.loc[raw_data['Retired'] == 0]
    # remove players who only played one season
    closest_comp_data = closest_comp_data.loc[closest_comp_data['Guard2'] < 2]
    closest_comp_data = closest_comp_data[closest_comp_data.Draft_pick != 'Undrafted']
    closest_comp_data = closest_comp_data.dropna(axis=0)


    active_players = closest_comp_data.drop(['Career_length', 'Career_WS/48', 'Career_OBPM', 'Career_DBPM',
                                    'Career_BPM', 'Career_VORP', 'Retired'], axis=1)
    active_players = active_players.drop(['Name', 'urlID'], axis=1)


    pickles = ['./modeling/Career_length.pkl', './modeling/Career_OBPM.pkl', './modeling/Career_DBPM.pkl']
    stats_to_cluster = pd.DataFrame([])

    for p in pickles:
        model = pickle.load(open(p, 'rb'))
        prediction = model.predict(active_players.to_numpy())
        stats_to_cluster[p] = prediction 

    from scipy.spatial import KDTree
    kdtree = KDTree(stats_to_cluster.to_numpy())

    distance, index_arr = kdtree.query([career_len[0], projected_obpm[0], projected_dbpm[0]], k=3)
    # i put random stats in the array, should be the ones our model predicts
    final_arr = []
    for index in index_arr: 
        print(closest_comp_data.iloc[[index]])
        final_arr.append(closest_comp_data.iloc[[index]].to_numpy().tolist())
    return final_arr
if __name__ == '__main__':
    app.run(port=5000, debug=True)