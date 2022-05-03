import csv

players = []
with open('training_data.csv', mode='r') as player_csv:
    player_reader = csv.DictReader(player_csv)
    line_count = 0
    for row in player_reader:
        players.append(dict(row))

formatted_players = []

for player in players:
    print(player['Player'])
    if int(player['Age']) == int(player['Rookie_age']):
        print('0')
        plr_dict = {}
        
        plr_dict['urlID'] = player['urlID']
        plr_dict['Name'] = player['Player']
        plr_dict['Career_length'] = 1
        if player['WS/48'] == '':
            plr_dict['Career_WS/48'] = 0
        else:
            plr_dict['Career_WS/48'] = float(player['WS/48'])
        
        if player['OBPM'] == '':
            plr_dict['Career_OBPM'] = 0
        else:
            plr_dict['Career_OBPM'] = float(player['OBPM'])
        
        if player['DBPM'] == '':
            plr_dict['Career_DBPM'] = 0
        else:
            plr_dict['Career_DBPM'] = float(player['DBPM'])
            
        if player['BPM'] == '':
            plr_dict['Career_BPM'] = 0
        else:
            plr_dict['Career_BPM'] = float(player['BPM'])

        if player['VORP'] == '':
            plr_dict['Career_VORP'] = 0
        else:
            plr_dict['Career_VORP'] = float(player['VORP'])
        
        plr_dict['Draft_pick'] = player['Draft']
        plr_dict['Undrafted'] = int(player['Draft'] == 'Undrafted')
        plr_dict['Retired'] = int(player['Retired'])
        plr_dict['Rookie_age'] = int(player['Rookie_age'])
        plr_dict['Guard1'] = int(player['Pos'] in ['PG', 'SG'])
        plr_dict['Forward1'] = int(player['Pos'] in ['SF', 'PF'])
        plr_dict['Center1'] = int(player['Pos'] == 'C')
        plr_dict['G1'] = player['G']
        plr_dict['MP1'] = player['MP']
        plr_dict['PER1'] = player['PER']
        plr_dict['TS1'] = player['TS%']
        plr_dict['3PAr1'] = player['3PAr']
        plr_dict['FTr1'] = player['FTr']
        plr_dict['ORB%1'] = player['ORB%']
        plr_dict['DRB%1'] = player['DRB%']
        plr_dict['TRB%1'] = player['TRB%']
        plr_dict['AST%1'] = player['AST%']
        plr_dict['STL%1'] = player['STL%']
        plr_dict['BLK%1'] = player['BLK%']
        plr_dict['TOV%1'] = player['TOV%']
        plr_dict['USG%1'] = player['USG%']
        plr_dict['OWS1'] = player['OWS']
        plr_dict['DWS1'] = player['DWS']
        plr_dict['WS1'] = player['WS']
        plr_dict['WS/48_1'] = (player['WS/48'])
        plr_dict['OBPM1'] = (player['OBPM'])
        plr_dict['DBPM1'] = (player['DBPM'])
        plr_dict['BPM1'] = (player['BPM'])
        plr_dict['VORP1'] = (player['VORP'])
        
        formatted_players.append(plr_dict)
        
    elif (int(player['Age']) - int(player['Rookie_age'])) == 1:
        print('1')
        for plr_dict in formatted_players:
            if 'urlID' in plr_dict:
                if plr_dict['urlID'] == player['urlID']:
                    print('2')
                    plr_dict['Guard2'] = int(player['Pos'] in ['PG', 'SG'])
                    plr_dict['Forward2'] = int(player['Pos'] in ['SF', 'PF'])
                    plr_dict['Center2'] = int(player['Pos'] == 'C')
                    plr_dict['G2'] = player['G']
                    plr_dict['MP2'] = player['MP']
                    plr_dict['PER2'] = player['PER']
                    plr_dict['TS2'] = player['TS%']
                    plr_dict['3PAr2'] = player['3PAr']
                    plr_dict['FTr2'] = player['FTr']
                    plr_dict['ORB%2'] = player['ORB%']
                    plr_dict['DRB%2'] = player['DRB%']
                    plr_dict['TRB%2'] = player['TRB%']
                    plr_dict['AST%2'] = player['AST%']
                    plr_dict['STL%2'] = player['STL%']
                    plr_dict['BLK%2'] = player['BLK%']
                    plr_dict['TOV%2'] = player['TOV%']
                    plr_dict['USG%2'] = player['USG%']
                    plr_dict['OWS2'] = player['OWS']
                    plr_dict['DWS2'] = player['DWS']
                    plr_dict['WS2'] = (player['WS'])
                    plr_dict['WS/48_2'] = (player['WS/48'])
                    plr_dict['OBPM2'] = (player['OBPM'])
                    plr_dict['DBPM2'] = (player['DBPM'])
                    plr_dict['BPM2'] = (player['BPM'])
                    plr_dict['VORP2'] = (player['VORP'])
                    
                    if player['WS/48'] == '':
                        plr_dict['Career_WS/48'] += 0
                    else:
                        plr_dict['Career_WS/48'] += float(player['WS/48'])
                    
                    if player['OBPM'] == '':
                        plr_dict['Career_OBPM'] += 0
                    else:
                        plr_dict['Career_OBPM'] += float(player['OBPM'])
                    
                    if player['DBPM'] == '':
                        plr_dict['Career_DBPM'] += 0
                    else:
                        plr_dict['Career_DBPM'] += float(player['DBPM'])
                        
                    if player['BPM'] == '':
                        plr_dict['Career_BPM'] += 0
                    else:
                        plr_dict['Career_BPM'] += float(player['BPM'])

                    if player['VORP'] == '':
                        plr_dict['Career_VORP'] += 0
                    else:
                        plr_dict['Career_VORP'] += float(player['VORP'])
                        
                    plr_dict['Career_length'] += 1
    else:
        print('3')
        for plr_dict in formatted_players:
            if 'urlID' in plr_dict:
                if plr_dict['urlID'] == player['urlID']:
                    print('4')
                    if player['WS/48'] == '':
                        plr_dict['Career_WS/48'] += 0
                    else:
                        plr_dict['Career_WS/48'] += float(player['WS/48'])
                    
                    if player['OBPM'] == '':
                        plr_dict['Career_OBPM'] += 0
                    else:
                        plr_dict['Career_OBPM'] += float(player['OBPM'])
                    
                    if player['DBPM'] == '':
                        plr_dict['Career_DBPM'] += 0
                    else:
                        plr_dict['Career_DBPM'] += float(player['DBPM'])
                        
                    if player['BPM'] == '':
                        plr_dict['Career_BPM'] += 0
                    else:
                        plr_dict['Career_BPM'] += float(player['BPM'])

                    if player['VORP'] == '':
                        plr_dict['Career_VORP'] += 0
                    else:
                        plr_dict['Career_VORP'] += float(player['VORP'])
                        
                    plr_dict['Career_length'] += 1
    
keys = formatted_players[0].keys()

with open('formatted_training_data.csv', 'w', newline='') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(formatted_players)
