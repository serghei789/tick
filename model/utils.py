import inspect
from functools import lru_cache
from pprint import pprint

from numpy.compat import unicode

# from pytz import unicode

from database import sql
from geopy.distance import geodesic as GD
from datetime import timedelta

from database_server import sqlServer


def get_next(id_a,lat_a,lng_a,id_b,lat_b,lng_b,orientation, version, step, route_id, father, route_recursion_fast):
    global version_global
    global recursion_global
    #Прихроним исходные данные до захода в рекурсию
    route_recursion_fast_index = []
    # step_index = step
    if step == 0:
        # Нулевой шаг
        route_recursion_fast.append(route_recursion_fast_add(0, lat_a, lng_a, 0, 0, 0, id_a))
    route_recursion_fast_index.extend(route_recursion_fast)

    recursion_depth_max = sql.get_constant('recursion_depth_max')
    recursion_depth = len(inspect.getouterframes(inspect.currentframe()))
    result_all = False
    #Если точка a и точка b совпали, значит маршрут успешный
    if (id_a==id_b):
        # Успех - достигнута конечная точка маршрута
        result_all = True
        version_global += 1
        sql.insert_route_recursion_fast(value=route_recursion_fast, version=version_global,route_id=route_id, recursion_depth=recursion_depth)
        recursion_global = recursion_depth+1
    elif recursion_depth > recursion_depth_max: #Ограничим глубину рекурсии
        pass
    elif recursion_depth > recursion_global+2:  # Ограничим глубину рекурсии
        pass
    else:
        points = sql.get_next_point(id_a, orientation)
        if len(points) == 0:
            pass #Не успех - маршрут привёл в тупик
        else:
            step += 1
            # if step == 1:
            #     route_trace.append(trace_add_row(step, point, lat_a, lng_a))
            for index, point in points.iterrows():
                rd = len(inspect.getouterframes(inspect.currentframe()))
                # print(f'Шаг ={step}, точка #{point['point_id']} {point['name']}, глубина рекурсии={rd},  version_global={version_global}')
                #Перед тем как запустить следующий шаг, сложил текущий
                route_recursion_fast.append(route_recursion_fast_add(step, point['lat'], point['lng'], point['edge'], lat_a, lng_a, point['point_id']))
                # print(f'route_trace_index={len(route_recursion_fast_index)}, route_trace={len(route_recursion_fast)}')
                result = get_next(point['point_id'], point['lat'], point['lng'],id_b, lat_b, lng_b, point['orientation'], version, step, route_id, father, route_recursion_fast)
                if result==True:
                    # Следующая версия должна появлятся, только если был успех
                    sql.insert_routes_recursion(route_id, version_global, step, point['lat'], point['lng'], point['edge'], lat_a, lng_a, point['point_id'], recursion_depth)
                    result_all = True
                    if step == 1:
                        #Сохраним шаг №0
                        sql.insert_routes_recursion(route_id, version, 0, lat_a, lng_a, 0, 0, 0, point['point_id'], recursion_depth)
                    version += 1

                #Вернёмся к исходному значению
                route_recursion_fast = []
                route_recursion_fast.extend(route_recursion_fast_index)
                # step = step_index
    return result_all
def create_routes(list_id=[],table='wish_list', event_id=0):
    progress = 15
    #Удалим прежние маршруты
    if table=='wish_list':
        pass
        progress = 5
        # sql.truncate_table('routes_recursion_fast')
        # sql.truncate_table('routes_recursion')
        # sql.truncate_table('routes_names')
    else:
        pass
    list_routes = sql.get_distinct_routes(table)
    for index, p in list_routes.iterrows():
        if str(p['id']) in list_id:
            #Возможно такой маршрут уже существует
            if sql.check_routes_names(p['point_a'], p['point_b'])==0:
                if sqlServer.check_stop() == True:
                    return
                text=f'Маршрут {p['point_a']}-{p['point_b']}'
                sqlServer.set_events_progress(event_id, progress=15, text=text)
                #Создадим маршруты
                set_routes(p['point_a'], p['point_b'])
                sql.set_recursion_depth(p['point_a'], p['point_b'])
                progress += 1
                sqlServer.set_events_progress(event_id, progress=10)
    sql.insert_route_rec()

def set_routes(name_a,name_b):
    set_routes_one(name_a, name_b)
def set_routes_one(name_a,name_b):
    global version_global
    global recursion_global
    print(f'Создадим маршрут {name_a}, {name_b}')
    point_a = sql.get_point(name_a)
    point_b = sql.get_point(name_b)

    #Маршрут a-b
    route_name = f'{name_a}-{name_b}'

    # Сохраним возможный маршрут
    route_id = sql.insert_routes_names(route_name, name_a, name_b)

    #Определим направо идти или на лево, для скорости работы
    orientation = get_orientation(name_a, name_b)

    #Ищем в двух направениях
    for orientation in (-1, 1):
        version_global = 0
        # print(orientation)
        # if orientation == 1:
        recursion_global=30
        route_recursion_fast=[]
        get_next(point_a['point_id'], point_a['lat'], point_a['lng'],point_b['point_id'], point_b['lat'], point_b['lng'], orientation, 1, 0, route_id,0, route_recursion_fast=route_recursion_fast)


def get_orientation(name_a, name_b):

    orientation = sql.get_orientation(name_a, name_b)
    return orientation
def set_points(reverse_course):
    sql.set_points(reverse_course)

    return None

@lru_cache(maxsize=100)
def get_distance(lat_a,lng_a,lat_b,lng_b):
    distance = GD((lat_a, lng_a), (lat_b, lng_b)).m
    return distance

from math import sin, cos, sqrt, atan2

def get_distance_fast(lat1,lon1,lat2,lon2):
    R = 6373.0

    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = (sin(dlat / 2)) ** 2 + cos(lat1) * cos(lat2) * (sin(dlon / 2)) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c
    return distance

#Обновить дистанцию
def set_distance(edge):
    distance = get_distance(edge['lat_a'], edge['lng_a'],edge['lat_b'], edge['lng_b'])
    sql.update_distance(edge['edge'], distance)
    return distance
def add_tracking(caravan_id, route_id, step, datetime, lat, lng, edge, speed, time, ship_icebreaker, step_distance,orientation):
    q = f'''{caravan_id}, '{route_id}', '{step}', '{datetime}', '{lat}', '{lng}', '{edge}', '{speed}', '{time}', '{ship_icebreaker}', '{step_distance}', {orientation}'''
    return q

def add_trace(caravan_id, route_id, step, datetime, lat, lng, edge, speed, time,  step_distance, id_interval, sailing):
    q = f'''{caravan_id}, '{route_id}', '{step}', '{datetime}', '{lat}', '{lng}', '{edge}', '{speed}', '{time}', '{step_distance}', '{id_interval}', '{sailing}' '''
    return q

# def get_next_steps(route_id, step):
#     return None
def create_intervals():
    #Сгенерируем временные интервалы
    create_time_intervals()

    #Создадим таблицу trace_intervals
    create_trace_intervals()
    return None
def create_time_intervals():
    print('create_time_intervals')
    sql.truncate_table('time_intervals')
    #Сгенерируем временные интервалы с длиной шага step_time
    step_time_s = sql.get_constant('step_time') * 2
    intervals = sql.get_interval()
    # print(intervals)
    for index, interval in intervals.iterrows():
        if interval['start']!=None:
            step_time = interval['start']
            while step_time <= interval['end']:
                time_start = step_time
                step_time += timedelta(seconds=step_time_s)
                time_end = step_time
                sql.insert_time_intervals(time_start, time_end)
def create_trace_intervals():
    print('create_trace_intervals')
    sql.truncate_table('trace_intervals')

    #Сгруппируем trace по одинаковым временным интервалам
    sql.set_trace_intervals()
    return None

def route_recursion_fast_add(step,  lat, lng,edge, lat_a, lng_a, point_id):
   return f"{step}, {lat}, {lng}, {edge}, {lat_a}, {lng_a}, {point_id}"

def update_distance():
    edges = sql.get_table('edge')

    for i, e in edges.iterrows():
        # Дистанция ребра из точки A в точку B
        edge_distance = get_distance(e['lat_a'],e['lng_a'], e['lat_b'], e['lng_b'])
        sql.update_edge_distance(id=e['edge'], distance=edge_distance)

    return None