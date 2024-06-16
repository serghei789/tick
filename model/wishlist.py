import math
from pprint import pprint
from datetime import time
from ast import literal_eval as make_tuple

import pandas as pd

from database import  sql
from database_server import sqlServer
from necessity import get_sailing
from datetime import timedelta
from datetime import datetime

# from optimal_function import get_goal_func
from schedule import create_routes_for_ship
from trace import set_step_time

# def  run_wish_model(id):
#     #Выполним перебор возможного даты-времени отплытия(каждые step_time секунд)
#     wish_list_model(id)
#
#     return None
def wish_list_model(list_id=[], event_id=0):
    ice_periods = sql.get_ice_periods()
    # SELECT DISTINCT start_date, end_date FROM `square_ice`
    sql.truncate_table('wish_list_model')
    models = sql.get_table('models')

    wish_list_model = []

    #Сдвиг времени в секундах, для перебора
    delta_time = sql.get_constant('step_shift')

    #Тестовые караваны
    caravan_id = 1000

    sql.truncate_table('trace')

    constant_late_arrival = sql.get_constant('late_arrival')*24*3600

    #Для ускорения, расчетов зададим
    set_step_time(sql.get_constant('step_time_model'))

    wish_lists = sql.get_table('wish_list')
    progress_index = 0
    for index, wish_list in wish_lists.iterrows():
        progress_index += 1
        if sqlServer.check_stop() == True:
            return

        if (str(wish_list['id']) in list_id) or (list_id==[]):
            progress = 10 + round(progress_index/(len(wish_lists))*5)*10
            sqlServer.set_events_progress(event_id, progress=progress, text='Моделируем время старта')
            # sqlServer.set_events_progress(event_id, progress=progress)
            datetime_start = wish_list['datetime_start']
            # Округлим время старта до целых часов
            datetime_start = hour_rounder(datetime_start)
            # Разрешим опоздание на несколько суток
            end = wish_list['datetime_end'] + timedelta(seconds=constant_late_arrival)
            print(f'id={wish_list['id']} start={datetime_start}, end={end}')

            wish_list_parts = sql.get_wish_list_part(model_id=1, id=wish_list['id'])
            wish_list_model_one = []
            # Итерируемся по частям маршрута, пока не опоздаем более чем на 2-е суток
            while datetime_start <= end:

                #Определим период
                for index, period in ice_periods.iterrows():
                    #start_date', 'end_date
                    if pd.Timestamp(period['start_date']) <= datetime_start  and pd.Timestamp(period['end_date']) > datetime_start:
                        current_period = period
                        break

                #<<<<<<<<<<<<<<Ускорим алгоритм<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                if len(wish_list_model_one)>0 and (old_period['start_date'] == current_period['start_date']):
                    # print(f'Перебор для {len(wish_list_model_one)}')
                    wish_list_model_two=[]
                    i = 0
                    while (c_datetime_end + timedelta(seconds=delta_time)*i < end):
                        #  and datetime_start < pd.Timestamp(current_period['start_date'])

                        i += 1
                        caravan_id += 1

                        for index, one in enumerate(wish_list_model_one):
                            one_list = list(make_tuple(one))
                            # pprint(one_list)
                            one_list[6] = datetime.strptime(one_list[6], '%Y-%m-%d %H:%M:%S') + timedelta(seconds=delta_time)*i
                            one_list[7] = datetime.strptime(one_list[7], '%Y-%m-%d %H:%M:%S') + timedelta(seconds=delta_time)*i
                            one_list[11] = caravan_id
                            s=f'({','.join(f'"{x}"' for x in one_list)})'
                            wish_list_model_two.append(s)
                    wish_list_model.extend(wish_list_model_two)
                    wish_list_model_two=[]
                    break
                else:
                    old_period = current_period
                    #>>>>>>>>>>>>>>>>>>>>>Ускорим алгоритм>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                    [wish_list_model_one, caravan_id, c_datetime_end] = start_parts_route(datetime_start, wish_list_parts, caravan_id, end, wish_list, models, wish_list_model_one)
                    datetime_start = datetime_start + timedelta(seconds=delta_time)
                    if c_datetime_end==0 or (c_datetime_end > end):
                        break
                    else:
                        wish_list_model.extend(wish_list_model_one)
    #Вставка данных
    # sql.set_pack_insert(False)
    sql.insert_wish_list_model(wish_list_model)
    return None
#Итерируемся по частям маршрута с заданным временем отплытия
def start_parts_route(datetime_start, wish_list_parts, caravan_id, end, wish_list, models, wish_list_model):
    wish_list_model_part = []
    # pprint(wish_list_parts)
    for index_parts, wish in wish_list_parts.iterrows():

        if wish['part_id'] == 1:
            # Время старта в начале маршрута
            datetime_start_part = datetime_start
        else:
            # Время старта последующих участков равно времени окончания предыдущего участка
            datetime_start_part = hour_rounder(c_datetime_end)

        caravan_id += 1
        # Сформируем маршрут
        iceclass = sql.get_iceclass(wish['imo'])
        pprint(wish)
        create_routes_for_ship(point_a=wish['point_a'], point_b=wish['point_b'], datetime_start=datetime_start_part, caravan_id=caravan_id, sailing=wish['sailing'], imo=wish['imo'], iceclass=iceclass)
        [c_datetime_end, time] = sql.get_trace_raiting(caravan_id)
        if time > 0:
            if end >= c_datetime_end:
                # c_datetime_end_next = c_datetime_end
                if index_parts + 1 == wish['part_id']:
                    # Ожидание - Реальное прибытие
                    late_arrival = wish_list['datetime_end'] - c_datetime_end
                    late_arrival = late_arrival.total_seconds() / 3600 / 24
                else:
                    late_arrival = 0
                # Сохраняем маршрут, только если успел доплыть вовремя
                for index, model in models.iterrows():
                    wish_list_model_part.append(
                        add_wish_model(model=model, wish=wish, datetime_start=datetime_start_part, datetime_end=c_datetime_end, caravan_id=caravan_id, time=time, late_arrival=late_arrival))
                if index_parts + 1 == wish['part_id']:
                    wish_list_model.extend(wish_list_model_part)
                    wish_list_model_part = []
            else:
                # Прерываем цикл
                datetime_start = end
                wish_list_model_part = []
        else:
            pass
            break
    return [wish_list_model, caravan_id, c_datetime_end]

def hour_rounder(t):
    rounder_minute = sql.get_constant('rounder_minute')
    #Округлим с точностью до 15 минут
    if 1==1:
        h = (timedelta(minutes=math.ceil(t.minute/rounder_minute)*rounder_minute) + t.replace(second=0, microsecond=0, minute=0, hour=t.hour))
    else:
        t = t + timedelta(days=1)
        mytime = time(0, 0, 0)
        h = datetime.combine(t.date(),mytime)
        # print(h)
    return h
# def teleport_icebreaker(model_id,imo):
#     caravan = {'datetime_start': datetime.strptime('2022-03-02 00:00:00', "%Y-%m-%d %H:%M:%S"),
#                                    'datetime_end': datetime.strptime('2022-03-02 00:00:01', "%Y-%m-%d %H:%M:%S"),
#                                    'point_a': '*',
#                                    'point_b': '*'}
#     sql.set_new_placement(model_id=model_id, imo=imo, caravan=caravan, iceclass='Arc9(Taimyr)', icebreaker=1)
def teleport_icebreaker_all(model_id):
    sql.teleport_update_placement(model_id)
    return None

def group_caravan(event_id=0):

    sql.init_wish_list()
    sql.truncate_table('schedule')
    sql.truncate_table('caravan_list')
    #Заполним уникальные комбинации с максимальным значением целевой функции
    sql.set_wish_list_model_distinct()
    #Цикл по всем моделям
    models = sql.get_table('models')
    #Для каждой модели свой караван
    caravan_id = 0

    for index, model in models.iterrows():
        stop_count = 0
        stop_max = 7
        progress = 20*(index+1)/len(models) + 70
        sqlServer.set_events_progress(event_id, progress=progress, text=f"Формируем караваны, модель {model['model_id']}")
        for id in range(1, 100):
            #Объединим в караваны
            caravan_id += 1
            [caravan_id, stop] = create_caravan(model_id=model['model_id'], caravan_id=caravan_id, sailing='P')
            progress = 70 + 10 * caravan_id / 100
            sqlServer.set_events_progress(event_id, progress=progress, text=f"Формируем караван #{caravan_id}, модель {model['model_id']}")
            if stop:
                stop_count+=1
                if stop_count < stop_max:
                    # Передвинем ледокол на новое место
                    print(f'Телепортация ледокола #{stop_count}')
                    teleport_icebreaker_all(model_id=model['model_id'])
                else:
                    #Остановим скрипт
                    break


        for id in range(1, 100):
            #Объединим в караваны
            caravan_id += 1
            [caravan_id, stop] = create_caravan(model_id=model['model_id'], caravan_id=caravan_id, sailing='S')
            if stop:
                break
def set_wish_list_part():
    # Определим потребность в проводке
    wish_list_parts = sql.get_table('wish_list_parts')

    for index, wish in wish_list_parts.iterrows():
        # Возможные маршруты для расписания
        routes_names = sql.get_routes_names(wish['point_a'], wish['point_b'])

        # Цикл по каждому маршруту
        for index, routes_names_row in routes_names.iterrows():
            # print(routes_names_row['id'])
            #Определим сплоченность льда на каждом маршруте
            min_cohesion = sql.get_min_cohesion(route_id=routes_names_row['id'], datetime_start=wish['datetime_start'])

            [sailing, necessity] = get_sailing(wish,  min_cohesion)
            sql.update_wish_list_parts(wish,  min_cohesion, sailing, necessity)
    return None

def add_wish_model(model, wish,datetime_start, datetime_end, caravan_id, time, late_arrival):
    q = f'''('{model['model_id']}', '{wish['id']}', '{wish['part_id']}','{wish['imo']}','{wish['point_a']}', '{wish['point_b']}', '{datetime_start}', '{datetime_end}', {wish['max_cohesion']}, {wish['necessity']}, '{wish['sailing']}', {caravan_id}, '{time}','{late_arrival}', {0})'''
    return q
def set_sailing_section_parts():
    sql.truncate_table('sailing_section_parts')
    sql.insert_sailing_section_parts()
    return None

def create_wish_part():
    sql.truncate_table('wish_list_parts')
    sql.set_wish_part_with_sailing_section_parts()
    return None

def set_wish_list_datetime_end():
    sql.set_wish_list_datetime_end()
    return None

def create_caravan(model_id, caravan_id, sailing):
    caravan_id_next = caravan_id
    if sailing=='P':
        max_ships_caravan = int(sql.get_constant('max_ships_caravan'))
        caravan_ids = sql.select_one_caravan_p(model_id=model_id, max_ships_caravan=max_ships_caravan)
    else:
        caravan_ids = sql.select_one_caravan_s(model_id=model_id)

    if len(caravan_ids)>0:
        for index, caravan in caravan_ids.iterrows():
            print(caravan['id'], caravan['point_a'],'->', caravan['point_b'])
            # Передвинем каждый корабль каравана на новое место
            sql.set_new_placement(model_id=model_id, imo=caravan['imo'], caravan=caravan, iceclass='*', icebreaker=0)
            imo_icebreaker = 0
            if sailing == 'P':
                # Выбор ледокола для каравана выполняем 1 раз и запоминием
                if imo_icebreaker==0:
                    # Проверим наличие ледокола
                    data = sql.get_placement_icebreaker(model_id, caravan['point_a'], caravan['point_b'], caravan['datetime_start'])
                    if len(data) > 0:
                        for index, d in data.iterrows():
                            # Берем первый попавшийся свободный ледокол
                            imo_icebreaker = d['imo']
                            break
                    else:
                        print('Нет ледокола')
                if caravan['part_id'] == 2:
                    # В случае, если проставлена вторая половина маршрута, и первая половина с типом S не была ещё проведена -то необходимо добавить первую половину маршрута
                    # print(caravan)
                    #Найдем первую половину маршрута и если караван не присвоен, присвоим его
                    caravans_1 = sql.get_wish_list_part_1(model_id,caravan)
                    if len(caravans_1)==1:
                        for index, caravan_1 in caravans_1.iterrows():
                            # pprint(caravan_1)
                            caravan_id_next += 1
                            sql.set_caravan_wish_list_parts(model_id=model_id, caravan=caravan_1, caravan_id=caravan_id_next)
                            sql.insert_schedule_caravan(model_id=model_id, caravan=caravan_1, imo_icebreaker=0, caravan_id=caravan_id_next)
                            sql.insert_caravan_list(model_id=model_id, imo=caravan_1['imo'], caravan_id=caravan_id_next)
                    else:
                        # print()
                        pass


            sql.set_caravan_wish_list_parts(model_id=model_id, caravan=caravan, caravan_id=caravan_id)
            sql.insert_caravan_list(model_id=model_id, imo=caravan['imo'], caravan_id=caravan_id)
        sql.insert_schedule_caravan(model_id=model_id, caravan=caravan, imo_icebreaker=imo_icebreaker, caravan_id=caravan_id)
        sql.set_wish_list(caravan['id'])
        if imo_icebreaker!=0:
            # Включим ледокол в караван
            sql.insert_caravan_list(model_id=model_id,imo=imo_icebreaker, caravan_id=caravan_id)

        #Добавим строчку в placement, обновим местоположение ледокола
        # print(f'Создан караван из {len(caravan_ids)} кораблей')
        if imo_icebreaker!=0:
            #Передвинем ледокол на новое место
            sql.set_new_placement(model_id=model_id, imo=imo_icebreaker, caravan=caravan, iceclass='icebreaker',icebreaker=1)
        stop = False
    else:
        stop = True
    return [caravan_id_next, stop]