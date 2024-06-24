from datetime import timedelta
from functools import lru_cache

import utils
from speed import get_speed_m_s
from database import sql
def set_step_time(step_time=sql.get_constant('step_time')):
    global step_time_s
    step_time_s = step_time
    return

@lru_cache(maxsize=100)
def check_sailing(sailing, sailing_valid):
    # print(sailing, sailing_valid)
    if sailing_valid=='S':
        return True

    if sailing_valid=='P':
        if sailing=='P':
            return True
        if sailing=='S':
            return False # print('Проводка запрещена - маршрут запрещён')
    if sailing_valid=='D':
            return False
    return True

def check_sailing_trace(route_step, sailing, imo, edge, forest_run):
    if forest_run==1:
        # print(f'run_for_ice()')
        return True
    else:
        # Проверим, что корабль может идти по этому ребру
        cohesion = sql.get_cohesion(route_step['datetime'].date(), edge)
        sailing_valid = sql.get_sailing(imo=imo, cohesion=cohesion)
        return check_sailing(sailing, sailing_valid)
def get_trace(route_step, next_step, sailing, imo, iceclass):
    global step_time_s

    # Выполним переход из точки A в Точку B и сформируем trace из шагов
    if (next_step['lat_a']==0):
        #Это точка входа в маршрут, не записываем trace
        return []

    # Дистанция ребра из точки A в точку B
    edge_distance = utils.get_distance(next_step['lat_a'],next_step['lng_a'], next_step['lat_b'], next_step['lng_b'])

    #Пройденное расстояние внутри ребра
    distance = 0

    #Начальное время
    datetime = route_step['datetime']
    trace = []

    if route_step['step'] == 0:
        # Начальная точка маршрута
        # print("Начальная точка маршрута")
        trace.append(utils.add_trace(route_step['caravan_id'], route_step['route_id'], route_step['step'], datetime, next_step['lat_a'], next_step['lng_a'],
                                     route_step['edge'], 0, 0,  0,0, sailing=sailing))

    finish=0
    while distance < edge_distance:
        route_step['step'] += 1
        speed = get_speed_m_s(imo,  datum=datetime.date(), lat=next_step['lat_a'], lng=next_step['lng_a'], sailing=sailing, iceclass=iceclass, edge=next_step['edge'])
        # print(speed)
        step_lat = next_step['lat_a']
        step_lng = next_step['lng_a']
        # print(f'speed={speed}')
        # Пройденное расстояние за шаг
        step_distance = speed * step_time_s

        # Пройденное расстояние внутри ребра
        distance += step_distance
        # print(distance, edge_distance)

        if (distance > edge_distance):
            # Δ Расстояние
            step_distance = (edge_distance - (distance - step_distance))
            # ΔВремя = Δ Расстояние / Скорость
            delta_time = step_distance / speed
            edge_distance = distance
            finish=1

        else:
            delta_time = step_time_s

        # Время
        datetime = datetime + timedelta(seconds=delta_time)


        # Новые координаты
        step_lat = step_lat + distance/edge_distance * (next_step['lat_b'] - next_step['lat_a'])
        step_lng = step_lng + distance/edge_distance * (next_step['lng_b'] - next_step['lng_a'])
        if finish==1:
            #Для повышения точности
            step_lat = next_step['lat_b']
            step_lng = next_step['lng_b']

            # print(datetime, delta_time, edge_distance, distance)
        trace.append(utils.add_trace(route_step['caravan_id'], route_step['route_id'], route_step['step'], datetime, step_lat, step_lng, route_step['edge'], speed, delta_time,  step_distance, 0, sailing=sailing))
    route_step['datetime'] = datetime

    return trace