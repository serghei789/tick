from datetime import timedelta
from functools import lru_cache
from pprint import pprint

import utils
from speed import get_speed_m_s
from database import sql
def set_track_points():
    edge = sql.get_table('edge')
    sql.truncate_table('track_points')
    array=[]
    dates = sql.get_date()
    for index, d in dates.iterrows():
        if index==1:
            for index, e in edge.iterrows():
                array.extend(set_track_edge(e,d['start_date'], d['end_date']))
                sql.insert_track_points(array)
                array=[]
    return None

def set_track_edge(e, date_start,	date_end):
    print(e['edge'])
    array=[]
    edge_distance = utils.get_distance(e['lat_a'], e['lng_a'], e['lat_b'], e['lng_b'])
    # Пройденное расстояние внутри ребра
    distance = 0.0

    while distance < edge_distance:
        step_lat = e['lat_a']
        step_lng = e['lng_a']
        step_distance = 20000
        # Пройденное расстояние внутри ребра
        distance += step_distance
        if (distance > edge_distance):
            # Δ Расстояние
            edge_distance = distance

        # Новые координаты
        step_lat = step_lat + distance / edge_distance * (e['lat_b'] - e['lat_a'])
        step_lng = step_lng + distance / edge_distance * (e['lng_b'] - e['lng_a'])
        cohesion = 0
        array.append(add_row(step_lat, step_lng,date_start,	date_end, cohesion, e['edge'], distance))
    return array

def add_row(lat,lng,date_start,	date_end,cohesion,edge, distance):
    return f'''{lat},{lng},'{date_start}','{date_end}','{cohesion}','{edge}', {distance} '''

def add_row_square_status(s):
    return f'''{s['row']},{s['col']},{s['status']}'''

def distance_status(s,t):
    status = 0
    # r = 0.5
    # if     (t['lat'] >= s['lat_a']-r
    #     and t['lat'] <= s['lat_b']+r
    #     and t['lng'] >= s['lng_a']-r
    #     and t['lng'] <= s['lng_b']+r):
        # distance = utils.get_distance_fast((s['lat_a']+s['lat_b'])/2, (s['lng_a']+s['lng_b'])/2, t['lat'], t['lng'])
    distance = utils.get_distance((s['lat_a']+s['lat_b'])/2, (s['lng_a']+s['lng_b'])/2, t['lat'], t['lng'])
    if distance <= 30000:
        status = 1
    return status

def set_status_square_ice():
    sql.truncate_table('square_status')
    array = []
    track_points = sql.get_table('track_points')
    square_ice = sql.get_square_ice('2022-03-10')
    for i, s in square_ice.iterrows():
        if (i % 100==0):
            print(f'set_status_square_ice {i}')
        for index, t in track_points.iterrows():
            status = distance_status(s,t)
            if status==1:
                s['status']=1
                array.append(add_row_square_status(s))
                # Если хоть одна точка подходит выходим из цикла
                break
    sql.insert_square_ice_status(array)
    sql.update_square_ice()
    return None

def  set_track_cohesion():
    sql.truncate_table('track_points_cohesion')
    dates = sql.get_date()
    for index, d in dates.iterrows():
        print(d['start_date'])
        track_points = sql.get_track_points()
        square_ice = sql.get_square_ice_status(d['start_date'])
        array=[]
        for index, t in track_points.iterrows():
            t['cohesion'] = 0
            count = 0
            for i, s in square_ice.iterrows():
                if distance_status(s, t)==1:
                    t['cohesion'] += s['cohesion']
                    count+=1
            if count>0:
                t['cohesion']=t['cohesion']/count
                array.append(t)
        sql.add_track_points_cohesion(array)

    return None

def set_edge_cohesion():
    sql.truncate_table('edge_cohesion')
    edge = sql.get_table('edge')
    dates = sql.get_date()
    array=[]
    for index, d in dates.iterrows():
            for index, e in edge.iterrows():
                array.append(row_edge_cohesion(d['start_date'], d['end_date'], e['edge']))
    sql.insert_edge_cohesion(array)
    sql.update_edge_cohesion()
    return None

def row_edge_cohesion(start_date,end_date,edge):
    return f''' '{start_date}','{end_date}', '{edge}',0,0 '''

