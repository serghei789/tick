import inspect
from pprint import pprint

from database import sql
from database_server import sqlServer
from trace import get_trace, set_step_time, check_sailing_trace

# Константа нарезки шагов

def create_schedule():
    sql.truncate_table('schedule')
    sql.insert_schedule()
    return None

def run_next_step(route_step, route_trace, sailing, imo, iceclass):
    global version
    # print(f'Глубина рекурсии {len(inspect.getouterframes(inspect.currentframe()))}')
    #Важно запомнить значения до выполнения цикла рекурсии, чтобы исключить влияние предыдущих шагов рекурсии
    route_trace_index = []
    route_trace_index.extend(route_trace)
    route_step_index = dict(route_step)

    #Метод рекурсивно перебирает все возможные шаги маршрута route_step
    next_steps = sql.get_next_steps(route_id=route_step['route_id'],  lat_a=route_step['lat'], lng_a=route_step['lng'])
    recursion_depth = sql.get_recursion_depth(route_step['route_id'])
    if len(next_steps) == 0:
        #Конец маршрута
        version += 1
        sql.insert_trace_list(route_trace, version)
    # elif len(inspect.getouterframes(inspect.currentframe()))>recursion_depth+5:
    #     pass
    elif len(inspect.getouterframes(inspect.currentframe()))>recursion_depth+5:
        pass
    else:
        for index, next_step in next_steps.iterrows():
            # pprint(next_step)

            if check_sailing_trace(route_step=route_step, sailing=sailing, imo=imo, edge=next_step['edge']) == True:
                # Построим траекторию движения из точки A в точку B
                route_step['version'] = version
                route_step['lat'] = next_step['lat_b']
                route_step['lng'] = next_step['lng_b']
                trace = get_trace(route_step, next_step, sailing, imo, iceclass)

                #Накапливаем маршрут
                route_trace.extend(trace)
                run_next_step(route_step, route_trace, sailing, imo, iceclass)

                # Вернемся к исходному значению
                route_step = dict(route_step_index)
                route_trace = []
                route_trace.extend(route_trace_index)
            else:
                print(f'Плыть запрещено, imo={imo}, sailing={sailing}, edge={next_step['edge']}')
        return None


def create_routes_for_ship(point_a, point_b, datetime_start, caravan_id, sailing, imo, iceclass):
    global version
    # print(point_a, point_b)
    # Возможные маршруты для расписания
    routes_names = sql.get_routes_names(point_a, point_b)
    # pprint(routes_names)
    # Цикл по каждому маршруту
    for index, routes_names_row in routes_names.iterrows():
        # route_step - шаг маршрута
        route_step = {"caravan_id": caravan_id, "route_id": routes_names_row['id'], "step": 0,
                      "datetime": datetime_start, "lat": 0, "lng": 0, "edge": 0,
                      "imo_icebreaker": 0, "version": 1}
        # print(route_step)
        route_trace = []
        # Новая нумерация версий для каждого маршрута
        version = 0

        run_next_step(route_step=route_step, route_trace=route_trace, sailing=sailing, imo=imo, iceclass=iceclass)
        sql.insert_raiting(caravan_id, routes_names_row['id'])

def run_schedule(caravan_id=0, event_id=0):
    print('run_shedule_recursion')
    sql.truncate_table('trace')
    sql.truncate_table('trace_raiting')

    # Задаим длину шага из БД
    set_step_time()

    # Расписание кораблей
    schedule = sql.get_schedule(caravan_id)
    progress = 75
    for index, schedule_row in schedule.iterrows():
        progress += 1/len(schedule)*10
        text = f"Трассировка {schedule_row['point_a']}-{schedule_row['point_b']}"
        sqlServer.set_events_progress(event_id, progress=progress, text=text)
        if sqlServer.check_stop()==True:
            return
        # print(index)
        # Удалим старые результаты по каравану
        sql.delete_trace_caravan(caravan_id=schedule_row['caravan_id'])

        # Возможные маршруты для расписания
        # pprint(schedule_row)
        imo = sql.get_imo(schedule_row['caravan_id'])
        if schedule_row['imo_icebreaker']==0:
            sailing = 'S'
        else:
            sailing = 'P'

        iceclass = sql.get_iceclass(imo)
        create_routes_for_ship(point_a=schedule_row['point_a'], point_b=schedule_row['point_b'], datetime_start=schedule_row['datetime_start'], caravan_id=schedule_row['caravan_id'], sailing=sailing, imo=imo, iceclass=iceclass)

        # create_routes_for_ship(schedule_row['point_a'], schedule_row['point_b'], schedule_row['datetime_start'], schedule_row['caravan_id'], schedule_row['sailing'], imo )

        # Обновим дату окончания маршрута
        sql.update_schedule(schedule_row['caravan_id'])
    return None