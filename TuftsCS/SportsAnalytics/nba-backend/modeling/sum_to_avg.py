import csv

players = []
with open('formatted_training_data.csv', mode='r') as player_csv:
    player_reader = csv.DictReader(player_csv)
    line_count = 0
    for row in player_reader:
        players.append(dict(row))

for player in players:
    player['Career_WS/48'] = float(player['Career_WS/48'])/int(player['Career_length'])
    player['Career_OBPM'] = float(player['Career_OBPM'])/int(player['Career_length'])
    player['Career_DBPM'] = float(player['Career_DBPM'])/int(player['Career_length'])
    player['Career_BPM'] = float(player['Career_BPM'])/int(player['Career_length'])
    player['Career_VORP'] = float(player['Career_VORP'])/int(player['Career_length'])


keys = players[0].keys()

with open('CS152_reg_data.csv', 'w', newline='') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(players)