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

with open('./data_filt2.csv') as infile:
    csv_reader = csv.reader(infile)
    header = next(csv_reader)
    pubs = [row for row in csv_reader]

# get a list of pubs in order and make a dicionary of pub data
pubs_order = []
pubs_dict = {}
for pub in pubs:
    name = pub[0]
    lon = float(pub[4].strip())
    lat = float(pub[5].strip())
    loc = pub[-1]
    # add pub to order list
    if name not in pubs_order:
        pubs_order.append(name)
    key_data = [lon, lat, loc]
    if name not in pubs_dict:
        pubs_dict[name] = [key_data]
    else:
        pubs_dict[name].append(key_data)

# the hard work, finding the closest of each pub
postc_dict = {}
with open('./post_code.csv') as f:
    csv_reader = csv.reader(f)
    header1 = next(csv_reader)
    for row in csv_reader:
        postc = row[0].strip()
        pclat = float(row[-2])
        pclon = float(row[-1])
        # grab each pub in turn and find the shortest distance to it
        closest_pubs = []
        for pub in pubs_order:
            shortest = 1000000
            best_loc = ""
            options = pubs_dict[pub]
            for option in options:
                optionlat = option[1]
                optionlon = option[0]
                optionloc = option[2]
                distance = get_dist(pclat, pclon, optionlat, optionlon)
                if distance < shortest:
                    shortest = distance
                    best_loc = "%s (%s km) %s %s" % (optionloc, str(distance).split('.')[0], optionlat, optionlon)
            # add pub info to list with distance
            #info = "%s %s" % (distance, best_loc)
            closest_pubs.append(best_loc)
        postc_dict[postc] = closest_pubs

with open('postcode_pubs.csv', 'w') as wf:
    csv_writer = csv.writer(wf)
    pubs_order.insert(0, 'postcode')
    csv_writer.writerow(pubs_order)
    for pc in postc_dict:
        out = postc_dict[pc]
        out.insert(0, pc)
        csv_writer.writerow(out)


#outfile = open('./data_filt2.csv', 'w')
#csv_writer = csv.writer(outfile)

