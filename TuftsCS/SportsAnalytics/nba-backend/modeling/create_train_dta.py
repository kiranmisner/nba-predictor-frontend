import csv
import numpy
from lxml import html
import requests, re, math
from urllib.request import urlopen
from bs4 import BeautifulSoup
import pandas as pd

# [Season,Rk,Player,urlID,Pos,Age,Tm,G,MP,PER,TS%,3PAr,FTr,ORB%,DRB%,TRB%,AST%,STL%,BLK%,TOV%,USG%,OWS,DWS,WS,WS/48,OBPM,DBPM,BPM,VORP,Draft]
# 
training_data = []
# columns = ['Name', 'urlID', 'guard1', 'forward1', 'center1', 'guard2', 'forward2', 'center2', 
#            'Rookie_age', 'G1', 'G2', 'MP1', 'MP2', 'PER1', 'PER2', 'TS1', 'TS2',
#            '3PAr1', '3PAr2', 'FTr1', 'FTr2', 'ORBpct1', 'ORBpct2', 'DRBpct1', 
#            'DRBpct2', 'TRBpct1', 'TRBpct2', 'ASTpct1', 'ASTpct2', 'STLpct1', 
#            'STLpct2', 'BLKpct1', 'BLKpct2', 'TOVpct1', 'TOVpct2', 'USGpct1', 
#            'USGpct2', 'OWS1', 'OWS2', 'DWS1', 'DWS2', 'WS1', 'WS2', 'WS/48_1', 
#            'WS/48_2', 'OBPM1', 'OBPM2', 'DBPM1', 'DBPM2', 'BPM1', 'BPM2', 
#            'VORP1', 'VORP2', 'Draftpick', 'Undrafted', 'Retired']
# 

players = []
remove_id = []
keep_id = []
active_id = []
with open('concat.csv', mode='r') as player_csv:
    player_reader = csv.DictReader(player_csv)
    line_count = 0
    for row in player_reader:
        players.append(dict(row))

new_players = []
for player in players:
    if player['Season'] == '2018-19':

        active_id.append(player['urlID'])
    
    if player['urlID'] in remove_id:
        # players.remove(player)
        continue
    elif player['urlID'] in keep_id:
        new_players.append(player)
    else:
        page = "https://www.basketball-reference.com/players/" + player['urlID'][0] + "/" + player['urlID'] + ".html"
        # Scrape start page into tree
        result = requests.get(page)
        tree = html.fromstring(result.content)

        # Isolate stats table
        table = tree.xpath('//table[@id="per_game"]')
        rows = table[0].xpath('./tbody/tr')

        # check if first season is before 1979
        i = 0
        while(len((rows[i].xpath('./td[@data-stat="age"]')))) == 0:
            i += 1
        rookie_age = int((rows[i].xpath('./td[@data-stat="age"]'))[0].text)
        if rookie_age < int(player['Age']):
            remove_id.append(player['urlID'])
        else:
            keep_id.append(player['urlID'])
            new_players.append(player)
    
    
for player in new_players:
    print(player['Player'])
    page = "https://www.basketball-reference.com/players/" + player['urlID'][0] + "/" + player['urlID'] + ".html"
    # Scrape start page into tree
    result = requests.get(page)
    tree = html.fromstring(result.content)

    # Isolate stats table
    table = tree.xpath('//table[@id="per_game"]')
    rows = table[0].xpath('./tbody/tr')

    # check if first season is before 1979
    i = 0
    while(len((rows[i].xpath('./td[@data-stat="age"]')))) == 0:
        i += 1
    rookie_age = int((rows[i].xpath('./td[@data-stat="age"]'))[0].text)
    player['Rookie_age'] = rookie_age
    if player['urlID'] in active_id:
        player['Retired'] = 0
    else:
        player['Retired'] = 1
    print(player['Retired'])
    
    if player['Draft'] == 'Undrafted':
        player['Draft'] == 0
    

keys = new_players[0].keys()

with open('training_data.csv', 'w', newline='') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(new_players)
# 
# season_1_id = []
# for player in players:
# 
# 
# 
# 
# 
#    
#     plr_dict = {'Name' : player['Player'],
#                 'urlID' : player['urlID'],
#                 'Draft_pick' : player['Draft'],
#                 'Undrafted' : int(player['Draft'] == 0),
#                 'Retired' : player['Retired'],
#                 'Rookie_age' : player['Rookie_age'],
#                 'Guard1' : int(player['Pos'] in ['PG', 'SG']),
#                 'Forward1' : int(player['Pos'] in ['SF', 'PF']),
#                 'Center1' : int(player['Pos'] == 'C'),
#                 'G1' : player['G'],
#                 'MP1' : player['MP'],
#                 'PER1' : player['PER'],
#                 'TS1' : player['TS%'],
#                 '3PAr1' : player['3PAr'],
#                 'FTr1' : player['FTr'],
#                 'ORB%1' : player['ORB%'],
#                 'DRB%1' : player['DRB%'],
#                 'TRB%1' : player['TRB%'],
#                 'AST%1' : player['AST%'],
#                 'STL%1' : player['STL%'],
#                 'BLK%1' : player['BLK%'],
#                 'TOV%1' : player['TOV%'],
#                 'USG%1' : player['USG%'],
#                 'OWS1' : player['OWS'],
#                 'DWS1' : player['DWS'],
#                 'WS1' : player['WS'],
#                 'WS/48_1' : player['WS/48'],
#                 'OBPM1' : player['OBPM'],
#                 'DBPM1' : player['DBPM'],
#                 'BPM1' : player['BPM'],
#                 'VORP1' : player['VORP']
#                 }
# 
#     players.remove(player)
#     i = 0
#     while(players[i]['urlID'] != player['urlID']):
#         i += 1
# 
#     plr_dict['Guard2'] = int(players[i]['Pos'] in ['PG', 'SG'])
#     plr_dict['Forward2'] = int(players[i]['Pos'] in ['SF', 'PF'])
#     plr_dict['Center2'] = int(players[i]['Pos'] == 'C')
#     plr_dict['G2'] = players[i]['G']
#     plr_dict['MP2'] = players[i]['MP']
#     plr_dict['PER2'] = players[i]['PER']
#     plr_dict['TS2'] = players[i]['TS']
#     plr_dict['3PAr2'] = players[i]['3PAr']
#     plr_dict['FTr2'] = players[i]['FTr']
#     plr_dict['ORB%2'] = players[i]['ORB%']
#     plr_dict['DRB%2'] = players[i]['DRB%']
#     plr_dict['TRB%2'] = players[i]['TRB%']
#     plr_dict['AST%2'] = players[i]['AST%']
#     plr_dict['STL%2'] = players[i]['STL%']
#     plr_dict['BLK%2'] = players[i]['BLK%']
#     plr_dict['TOV%2'] = players[i]['TOV%']
#     plr_dict['USG%2'] = players[i]['USG%']
#     plr_dict['OWS2'] = players[i]['OWS']
#     plr_dict['DWS2'] = players[i]['DWS']
#     plr_dict['WS2'] = players[i]['WS']
#     plr_dict['WS/48_2'] = players[i]['WS/48']
#     plr_dict['OBPM2'] = players[i]['OBPM']
#     plr_dict['DBPM2'] = players[i]['DBPM']
#     plr_dict['BPM2'] = players[i]['BPM']
#     plr_dict['VORP2'] = players[i]['VORP']
# 
#     players.remove(players[i])
# 
#     career_vorp = 0
#     career_BPM = 
#     training_data.append(plr_dict)
# 
# 
    
# 
# rookie_yr = {}
# 
# for player in players:
#     # if 'Rookie_yr' not in player:
#     #     if player['urlID'] in rookie_yr:
#     #         player['Rookie_yr'] = rookie_yr[player['urlID']]
#     #     else:
#     player_url = "https://www.basketball-reference.com/players/" + player['urlID'][0] + "/" + player['urlID'] + ".html"
#     player_rest = requests.get(player_url)
#     player_soup = BeautifulSoup(player_rest.content, 'lxml')
#     player_info = player_soup.find(name = 'div', attrs = {'itemtype' : 'https://schema.org/Person'})
# 
#     # Adding name for clarity
# 
# 
#     # Using RegEx to extract height, weight, and position from each player's web profile.
#     # The '(.*)' regex notation allows the extraction of text from in between two known substrings,
#     # which is the text written on either side of '(.*)' in the below code. 
# 
#     s = str(player_info.find_all('p'))
#     rookie_yr = str(re.search('(Debut).*\d{4}', s)).split(',')[-1][43:4]
#     print(rookie_yr)
# 
# 
# 
#             # rookie_yr[player['urlID']] = player['Rookie_yr']
#     # print(player['Rookie_yr'])
# 
# 
# 
# 