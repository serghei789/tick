import urllib
from pprint import pprint

import requests

from clear_cache import clear_cache
from database import sql
from img import ships_img, set_prompt, set_img
from metrics import metrics
from optimal_function import set_goal_func
from placement import set_placement
# from pooling import pooling
from schedule import run_schedule
from wishlist import set_wish_list_datetime_end
from transfer_local_db_to_server_db import transfer_db
from utils import set_points, create_routes, create_intervals, set_routes
from wishlist import wish_list_model, group_caravan, create_wish_part, set_wish_list_part, set_sailing_section_parts
import time
from database_server import sqlServer
from ast import literal_eval as make_tuple

include_tables = (
    'caravan_list',
    'track_points',
    'constant',
    'models',
    'models_metrics',
    'placement',
    'placement_init',
    'schedule',
    'y_schedule',
    'time_intervals',
    'trace',
    'trace_intervals',
    'trace_raiting',
    'routes_names',
    'routes_rec',
    # 'routes_recursion',
    'routes_recursion_fast',
    'routes_recursion_fast_d',
    'wish_list',
    'wish_list_parts',
    'constant',
    'edge',
    'points',
    'wish_list',
    'sailing_section',
    'wish_list_model'
)

def run(event):
    initial()
    if sql.get_constant('scoring')==0:
        #Час
        sql.set_constant('rounder_minute',60)
        sql.set_constant('step_shift', 3600)
    else:
        #День
        sql.set_constant('rounder_minute', 61)
        sql.set_constant('step_shift', 86400)

    #Почистим кэш
    clear_cache()
    if event['data']=='':
        list_id = [str(x) for x in range(1, 43)]
    else:
        list_id = list(make_tuple(event['data']))
    print(list_id)
    telegram(f'Запущен пересчет по заявкам {str(list_id)}')
    #Закачаем настройки
    sqlServer.set_events_progress(event['id'], progress=2, text='Закачаем настройки')
    sqlServer.set_events_progress(event['id'], progress=1)
    if sqlServer.check_stop() == True:
        return
    start_time = time.time()
    sqlServer.set_events_progress(event['id'], progress=1, text='Скрипт запущен run')

    # 0.Генерация картинок искусственным интеллектом
    if (1==0):
        set_prompt() #Создадим описание
        set_img()  # Генерация картинок

    #1. Заполним таблицу Граф-переходов между точками ребер
    if 1==1:
        set_points(reverse_course=1)

    #2. Создадим таблицу возможных маршрутов c помощью рекурсивного поиска путей по графу
    if 1==1:
        sqlServer.set_events_progress(event['id'], progress=15, text='Строим маршрут')
        if sqlServer.check_stop() == True:
            return
        create_routes(list_id=list_id, table='y_schedule', event_id=event['id'])

    #Заполним агрегированную мощность ребер графа edge_cohesion
    if 1==0:
        #!!!!!Долго пересчитывается!!!!!
        #Трассировка пути
        set_track_points()
        #Проставим статус точкам, которые рядом с маршрутом
        set_status_square_ice()
        #Заполним параметры track_points_cohesion на каждую дату
        set_track_cohesion()
        #Заполним средние показатели ребра на каждую дату
        set_edge_cohesion()
        pass

    if 1==1:
        sqlServer.set_events_progress(event['id'], progress=20, text='Делим маршрут по частям')
        if sqlServer.check_stop()==True:
            return

        #Заполняем дату окончания проводки, самым оптимистичным вариантом
        set_wish_list_datetime_end()

        #Поделим маршрут на части, так как потребность в проводке разная
        set_sailing_section_parts()
        create_wish_part()
        set_points(reverse_course=0)

        #Пересбор неполных маршрутов
        create_routes(list_id=list_id, table='wish_list_parts', event_id=event['id'])
        set_wish_list_datetime_end()

        #Заполним потребность в проводке
        set_wish_list_part()

        #5. Перебор возможных вариантов маршрутов и времени старта
    if 1==1:
        sqlServer.set_events_progress(event['id'], progress=60, text='Перебор времени старта')
        if sqlServer.check_stop() == True:
            return
        wish_list_model(list_id=list_id, event_id=event['id'])

    if 1==1:
        sqlServer.set_events_progress(event['id'], progress=70, text='Формируем караваны')
        if sqlServer.check_stop() == True:
            return
        #6. Зададим исходные позиции ледоколов и кораблей
        set_placement()

        #7. Заполним значение целевой функции для каждого маршрута
        set_goal_func()
        #8. Объединим в группы и сформируем караваны
        group_caravan(event_id=event['id'])
        sqlServer.set_events_progress(event['id'], progress=75, text='Заполняем метрики')
        #9. Заполним метрики для сравнения качества моделей
        metrics()

    if 1==1:
        sqlServer.set_events_progress(event['id'], progress=80, text='Генерируем интервалы для анимации')
        if sqlServer.check_stop()==True:
            return
        #10. Сгенерируем данные trace по расписанию
        run_schedule(event_id=event['id'])
        #11. Сгенерируем интервалы для анимации
        create_intervals()

    #Посчитаем, edge avg_cohesion и max_cohesion
    if 1==1:
        sqlServer.set_events_progress(event['id'], progress=98, text='Отправляем данные на сервер')
        if sqlServer.check_stop()==True:
            return
        #12. Отправим данные из локальной базы на сервер
        global include_tables
        transfer_db(_from='local',_to='server',include_tables=include_tables)
        sqlServer.set_events_progress(event['id'], progress=100)
    telegram('Пересчет завершен')
    text = "--- Время выполнения скрипта %s seconds ---" % (time.time() - start_time)
    sqlServer.set_events_progress(event['id'], progress=100, text=text)

    return None

def pooling():
    number = 0
    while number == 0:
        events = sqlServer.get_events()
        pprint(f'pooling {time.time()}, {len(events)}')
        for index, event in events.iterrows():
            pprint(event['event_table'])
            if event['event_table']=='run':
                run(event)
            if event['event_table'] == 'backup':
                backup(event)
            if event['event_table'] == 'stop':
                pass
            if sqlServer.check_stop() == True:
                #Завершаем все процессы
                sqlServer.clear_stop()
                break
            sqlServer.set_events_status(event, progress=100)
        time.sleep(5)
    return None
def backup(event):
    global include_tables
    sqlServer.set_events_progress(event['id'], 10, text='Поднимаем Бэкап')
    transfer_db(_from='backup',_to='server', include_tables=include_tables)
    return None
def initial():
    include_tables = (
        'constant',
        'models',
        'y_schedule',
        'placement_init',
        'sailing_section'
    )
    #1. Перенесем таблицы настроек с сервера на локальную
    transfer_db(_from='server', _to='local', include_tables=include_tables)
    return
def telegram(text):
    f = {'text': text}
    url = f"https://arcflot.ru/backend/telegram/index.php?{urllib.parse.urlencode(f)}"
    response = requests.get(url)
    # url = f"https://arcflot.ru/backend/telegram/index.php?event_id={event_id}&status={status}"
    # print(url)
    # response = requests.get(url)
    # # data = response.json()
    # # print(data)
    return None