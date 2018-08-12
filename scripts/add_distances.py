#!/usr/bin/env python
import csv
from math import sin, cos, sqrt, atan2, radians

# approximate radius of earth in km
R = 6373.0

def get_dist(lat1, lon1, lat2, lon2):
    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c
    return distance

sub_dict = {}

with open('./post_code.csv') as f:
    csv_reader = csv.reader(f)
    header1 = next(csv_reader)
    for row in csv_reader:
        sub = row[1].strip()
        sub_dict[sub] = row

outfile = open('./data_filt2.csv', 'w')
csv_writer = csv.writer(outfile)

with open('./data_filt.csv') as f:
    csv_reader = csv.reader(f)
    header2 = next(csv_reader)
    header2.append("sub_info")
    csv_writer.writerow(header2)
    for row in csv_reader:
        pub = row[0]
        lon1, lat1 = float(row[4]), float(row[5])
        smallest_distance = ['none', 10000000]
        for key in sub_dict:
            lat2 = float(sub_dict[key][3].strip())
            lon2 = float(sub_dict[key][4].strip())
            distance = get_dist(lat1, lon1, lat2, lon2)
            if distance < smallest_distance[1]:
                smallest_distance = [key, distance]
        info = sub_dict[smallest_distance[0]]
        key_info = info[1].strip() + " " + info[2].strip()
        row.append(key_info)
        csv_writer.writerow(row)

outfile.close()
