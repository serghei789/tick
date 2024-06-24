import datetime
from datetime import timedelta
from functools import lru_cache
from pprint import pprint

import pymysql
import sqlalchemy
import pandas as pd
import warnings

from numpy import sign

from passwords import dbLocal

warnings.simplefilter('ignore')


class SqlClass:
    # за ссылкой на базу данных обращайтесь в телеграм (@mgarbuzenko)
    db=dbLocal

    def __init__(self):
        self.engine = sqlalchemy.create_engine(self.db)
        self.connection = self.engine.connect()

    @lru_cache(maxsize=100)
    def get_table_column_names(self, table_name):
        query = f'''
        SHOW fields from {table_name}
        '''
        column_names = self.connection.execute(query).fetchall()
        column_names = [column_name[0] for column_name in column_names]
        return column_names

    def get_trace_raiting(self, caravan_id):
        query = f'''
               SELECT datetime_end, time
               FROM trace_raiting
               WHERE caravan_id='{caravan_id}' and raiting=1 
               LIMIT 1     
               '''
        # print(query)
        data = self.connection.execute(query).fetchall()
        # print(data)
        if data:
            return data[0]
        else:
            return [0, 0]

    def get_schedule(self, caravan_id):
        if (caravan_id == 0):
            condition = ""
        else:
            condition = f"WHERE caravan_id={caravan_id}"
        # Для тестирования
        query = f'''
        SELECT *
        FROM schedule 
        {condition}
        ORDER BY caravan_id  ASC       
        '''
        # WHERE caravan_id=3
        column_names = self.get_table_column_names('schedule')
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        return data

    @lru_cache(maxsize=100)
    def get_edge(self, edge):
        query = f'''
           SELECT *
           FROM edge where edge='{edge}' limit 1'''
        column_names = self.get_table_column_names('edge')
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        return data

    def insert_sailing_section_parts(self):
        query = f'''INSERT INTO sailing_section_parts(point_a, point_b, point_sailing, step) 
                    SELECT DISTINCT s.point_a, s.point_b, p.name, min(r.step) FROM wish_list as s inner 
                    JOIN routes_names as n ON n.point_a=s.point_a AND n.point_b=s.point_b inner 
                    JOIN routes_recursion_fast_d as r ON r.route_id=n.id and date_start='2022-03-01' inner JOIN points as p ON p.point_id=r.point_id_a 
                    WHERE p.name in (SELECT point_name from sailing_section ) 
                     and s.point_a<>p.name and s.point_b<>p.name
                    GROUP by s.point_a, s.point_b, p.name'''
        self.connection.execute(query)
        return

    def set_wish_part(self, wl, point_a, point_b, part_id):
        models = sql.get_table('models')
        for index, model in models.iterrows():
            query = f'''
                        INSERT INTO wish_list_parts(model_id, part_id, id, imo, point_a, point_b, datetime_start, datetime_end, max_cohesion, necessity, sailing, caravan_id) 
                        VALUES ('{model['model_id']}', {part_id},  {wl['id']}, {wl['imo']}, '{point_a}', '{point_b}', '{wl['datetime_start']}' , '{wl['datetime_end']}', 0,0,0,0  )
            '''
            # select '{model['model_id']}', '1', id, imo, point_a, point_b, datetime_start , datetime_end, 0,0,0,0 from wish_list;
            self.connection.execute(query)
        return None

    def get_sailing_section_parts(self, point_a, point_b):
        query = f'''SELECT * FROM sailing_section_parts where point_a='{point_a}' and point_b='{point_b}' order by step ASC
                '''
        # print(query)
        column_names = self.get_table_column_names('sailing_section_parts')
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        return data
    def set_wish_list_datetime_end(self):
        #В случае, если в wish_list не задана дата окончания маршрута - заполним наиболее возможной первой датой
        query = f'''update wish_list as w set w.datetime_end = DATE_ADD(w.datetime_start, INTERVAL (select time from routes_names as r where r.point_a=w.point_a and r.point_b=w.point_b)*3 second)
        '''
        self.connection.execute(query)

        query = f'''update wish_list as w set w.datetime_end = w.datetime_start where w.datetime_end is NULL
        '''
        self.connection.execute(query)


        return None
    def set_wish_part_with_sailing_section_parts(self):

        wish_lists = sql.get_table('wish_list')
        for index, wl in wish_lists.iterrows():
            sailing_section_parts = sql.get_sailing_section_parts(wl['point_a'], wl['point_b'])
            part_id = 1
            if len(sailing_section_parts) == 0:
                # Вставка одной записи
                sql.set_wish_part(wl=wl, point_a=wl['point_a'], point_b=wl['point_b'], part_id=part_id)
                pass
            else:
                # Вставка частей маршрута
                for index, sp in sailing_section_parts.iterrows():
                    if index == 0:
                        point_a = wl['point_a']
                        point_b = sp['point_sailing']
                    else:
                        point_a = last
                        point_b = sp['point_sailing']
                    last = point_b
                    # print(f'point_a={point_a} point_b={point_b}')
                    sql.set_wish_part(wl=wl, point_a=point_a, point_b=point_b, part_id=part_id)
                    part_id += 1
                sql.set_wish_part(wl=wl, point_a=last, point_b=wl['point_b'], part_id=part_id)

        return None

    def set_points(self, reverse_course):
        query = f'''truncate table points'''
        self.connection.execute(query)
        query = f'''INSERT INTO points (point_id, lat, lng, edge, orientation, name) (SELECT DISTINCT start_point_id, lat_a as lat, lng_a as lng, edge, SIGN(lng_a-lng_b) as orientation, name_a as name FROM edge);'''
        self.connection.execute(query)
        query = f'''INSERT INTO points (point_id, lat, lng, edge, orientation, name) (SELECT DISTINCT end_point_id, lat_b as lat, lng_b as lng, edge, -SIGN(lng_a-lng_b) as orientation , name_b as name FROM edge);'''
        self.connection.execute(query)
        if reverse_course == 1:
            # Обратный ход, нужен для маршрута Сабетта-Архангельск
            query = f'''INSERT INTO points (point_id, lat, lng, edge, orientation, name) (SELECT DISTINCT start_point_id, lat_a as lat, lng_a as lng, edge, -SIGN(lng_a-lng_b) as orientation, name_a as name FROM edge WHERE reverse_course=1);'''
            self.connection.execute(query)
            query = f'''INSERT INTO points (point_id, lat, lng, edge, orientation, name) (SELECT DISTINCT end_point_id, lat_b as lat, lng_b as lng, edge, SIGN(lng_a-lng_b) as orientation , name_b as name FROM edge WHERE reverse_course=1);'''
            self.connection.execute(query)
        return None

    def get_orientation(self, name_a, name_b):
        query = f'''SELECT DISTINCT(lng) FROM points WHERE name='{name_a}' '''
        lng_a = self.connection.execute(query).fetchall()

        query = f'''SELECT DISTINCT(lng) FROM points WHERE name='{name_b}' '''
        lng_b = self.connection.execute(query).fetchall()

        orientation = -int(sign(lng_a[0][0] - lng_b[0][0]))
        return orientation

    def set_wish_list_by_y_schedule(self):
        sql.truncate_table('wish_list')
        query = f'''INSERT INTO wish_list(id, imo, point_a, point_b, datetime_start, datetime_end, max_cohesion, necessity, sailing, eta) SELECT id, imo, point_a, point_b, datetime_start, datetime_end, 0, 0, '', datetime_end FROM y_schedule'''
        self.connection.execute(query)
        return  None

    def check_routes_names(self, point_a, point_b):
        query = f'''SELECT * from routes_names where point_a='{point_a}' and point_b='{point_b}'
                       '''
        column_names = self.get_table_column_names('routes_names')
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        return len(data)

    def get_distinct_routes(self, table):
        query = f'''SELECT DISTINCT point_a, point_b, id FROM {table}'''
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=['point_a', 'point_b', 'id'])
        return data

    @lru_cache(maxsize=100)
    def get_next_point(self, point_id, orientation):
        query = f'''SELECT * FROM `points`
                       WHERE edge in (SELECT DISTINCT edge FROM points where point_id={point_id} AND orientation='{-orientation}')
                       AND orientation='{orientation}'
                       AND NOT(point_id={point_id})
                      '''

        column_names = self.get_table_column_names('points')
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        # pprint(data)
        return data

    def get_routes_names(self, point_a, point_b):
        query = f'''
         SELECT *
         FROM routes_names
         WHERE 
         point_a='{point_a}'
         and
         point_b='{point_b}'    
         '''
        # print(query)
        column_names = self.get_table_column_names('routes_names')
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        return data

    @lru_cache(maxsize=100)
    def get_wish_list_part(self, model_id, id):
        query = f'''
         SELECT *
         FROM wish_list_parts
         WHERE id='{id}' and model_id='{model_id}'
         ORDER BY 
         model_id ASC,
         part_id ASC
         '''
        # model_id ASC,
        column_names = self.get_table_column_names('wish_list_parts')
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        # pprint(data)
        return data

    def update_edge_distance(self, id, distance):
        query = f'''UPDATE `edge` SET distance={distance} where edge={id}
                 '''
        # print(query)
        self.connection.execute(query)
        return None

    @lru_cache(maxsize=100)
    def get_table(self, table):
        query = f'''
         SELECT *
         FROM {table}
         '''
        column_names = self.get_table_column_names(table)
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        return data

    # @lru_cache(maxsize=100)
    def get_model(self, model_id):
        query = f'''
             SELECT  *
             FROM models where model_id='{model_id}' LIMIT 1
             '''
        column_names = self.get_table_column_names('models')
        data = self.connection.execute(query)
        data = pd.DataFrame(data, columns=column_names)
        d = None
        for index, d in data.iterrows():
            pass
        return d

    @lru_cache(maxsize=100)
    def get_constant(self, name):
        query = f'''
         SELECT value
         FROM constant
         WHERE name='{name}' LIMIT 1
         '''
        data = self.connection.execute(query).fetchall()
        return data[0][0]

    def set_constant(self, name, value):
        query = f'''
         UPDATE constant set value='{value}' WHERE name='{name}' 
         '''
        self.connection.execute(query)
        return None

    def set_trace_intervals(self):
        query = f'''
             UPDATE trace SET id_interval =(select distinct id from time_intervals  where time_intervals.datetime_start <= trace.datetime and time_intervals.datetime_end >= trace.datetime limit 1  )
            '''
        self.connection.execute(query)

        query = f'''
          INSERT INTO trace_intervals ( select  caravan_id, route_id, AVG(lat) , AVG(lng), version, id_interval, AVG(speed) from trace GROUP by caravan_id, route_id, version, id_interval)
          '''
        self.connection.execute(query)

        return None

    def set_wish_list(self, id):
        #Факитическая дата
        query = f''' UPDATE wish_list SET eta=
        (select  max(datetime_end) from wish_list_parts where id='{id}')
         WHERE id='{id}' 
                '''
        self.connection.execute(query)
        return None

    def set_ship_prompt(self, imo, text):
        query = f''' UPDATE ships SET prompt='{text}'
          WHERE imo='{imo}' 
          '''
        self.connection.execute(query)
        return None

    def set_caravan_wish_list_parts(self, model_id, caravan, caravan_id, datetime_end):
        query = f'''
                 UPDATE wish_list_parts
                 SET caravan_id='{caravan_id}',
                 datetime_start='{caravan['datetime_start']}',
                 datetime_end='{datetime_end}'
                 WHERE id='{caravan['id']}' 
                 and point_a='{caravan['point_a']}'
                 and point_b='{caravan['point_b']}'
                 and model_id='{model_id}'
                '''
        # print(f'id={caravan['id']}')
        self.connection.execute(query)
        return None

    def insert_caravan_list(self, model_id, imo, caravan_id):
        # print(f'вставим {model_id},{caravan_id},{imo}')
        query = f'''
                   INSERT INTO caravan_list(model_id, caravan_id, imo) VALUES ('{model_id}','{caravan_id}','{imo}')
                  '''
        # print(query)
        self.connection.execute(query)
        return None

    def get_ice_select(self, day, lat, lng):
        step = 0.2
        query = f'''SELECT avg(cohesion) FROM square_ice
                    WHERE start_date<='{day}' AND end_date>='{day}'
                    and lat_a>={lat - step} and lat_b<={lat + step}
                    and lng_a>={lng - step} and lng_b<={lng + step}
                    and cohesion > -1'''
        data = self.connection.execute(query).fetchall()
        if data[0][0] != None:
            # print(data)
            # print(step)
            return data[0][0]
            # print('rrr')
        else:
            step = 0.3
            query = f'''SELECT avg(cohesion) FROM square_ice
                           WHERE start_date<='{day}' AND end_date>='{day}'
                           and lat_a>={lat - step} and lat_b<={lat + step}
                           and lng_a>={lng - step} and lng_b<={lng + step}
                           and cohesion > -1'''
            data = self.connection.execute(query).fetchall()
            if data[0][0] != None:
                # print(data)
                # print(step)
                return data[0][0]
            else:
                step = 0.6
                query = f'''SELECT avg(cohesion) FROM square_ice
                                         WHERE start_date<='{day}' AND end_date>='{day}'
                                         and lat_a>={lat - step} and lat_b<={lat + step}
                                         and lng_a>={lng - step} and lng_b<={lng + step}
                                         and cohesion > -1'''
                data = self.connection.execute(query).fetchall()
                if data[0][0] != None:
                    # print(data)
                    # print(step)
                    return data[0][0]
                else:
                    return -1

    @lru_cache(maxsize=100)
    def get_iceclass_cohesion(self, cohesion, iceclass):
        query = f'''SELECT * FROM `iceclass` WHERE iceclass='{iceclass}' and iv_min<='{cohesion}' and iv_max>='{cohesion}  and cohesion >= 10 LIMIT 1'
                 '''
        # pprint(query)

        column_names = self.get_table_column_names('iceclass')
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        return data

    def get_square_ice(self, start_date):

        query = f'''
                SELECT i.* FROM square_ice as i
         WHERE i.start_date='{start_date}' and i.lat_a < 80 and i.cohesion > -10
        '''
        column_names = self.get_table_column_names('square_ice')
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        # print(len(data))
        return data

    def get_square_ice_status(self, start_date):
        query = f'''SELECT * FROM `square_ice` WHERE start_date='{start_date}' and status=1
                   '''
        # print(query)
        column_names = self.get_table_column_names('square_ice')
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        return data

    def get_track_points(self):
        query = f'''SELECT * FROM `track_points`
                   '''
        column_names = self.get_table_column_names('track_points')
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        return data

    @lru_cache(maxsize=100)
    def get_min_cohesion(self, route_id, datetime_start):
        date_start = sql.get_date_start_by_ice_period(datetime_start.date())
        # О пределим самую сложную ледовую сплоченность по каждой версии маршрута
        # А затем выберем самый простой маршрут
        query = f'''
                SELECT min(f.min_cohesion) as cohesion from 
                    (select distinct version, min(e.avg_cohesion) as min_cohesion
                    from routes_recursion_fast_d as r
                    JOIN edge_cohesion as e ON
                        e.edge=r.edge 
                        AND e.date_start='{date_start}'
                     
                    WHERE route_id={route_id}
                       and min_cohesion > -1
                        AND r.date_start='{date_start}'
                    GROUP BY version) as f
              '''
        #   # AND e.date_end>='{datetime_start.date()}'
        # print(query)
        data = self.connection.execute(query).fetchall()
        if data:
            d = data[0][0]
            if d == None:
                d = 0
            return d
        else:
            return 0

    # @lru_cache(maxsize=100)
    def get_cohesion(self, datum, edge):
        query = f'''
                SELECT avg_cohesion from edge_cohesion where edge='{edge}' and date_start<='{datum}' and date_end>='{datum}' LIMIT 1
                '''
        data = self.connection.execute(query).fetchall()
        # print(query)
        if data:
            return data[0][0]
        else:
            return 0

    @lru_cache(maxsize=100)
    def get_speed_m_s(self, imo):
        query = f'''SELECT speed_m_s FROM ships WHERE imo='{imo}' LIMIT 1'''
        # pprint(query)
        data = self.connection.execute(query).fetchall()
        return data[0][0]

    def update_goal_func(self, model):
        query = f'''update wish_list_model set goal_func = 
        -TIMESTAMPDIFF(hour,'2022-03-01 00:00:00',datetime_start)*({model['c_start']})
        +necessity*({model['c_necessity']})
        -time*({model['c_time']})/3600
        +late_arrival*({model['c_late_arrival']})
                    where model_id='{model['model_id']}'
                           '''
        # print(query)
        self.connection.execute(query)

        return None

    def set_recursion_depth(self, point_a, point_b):
        query = f'''SELECT r.route_id as route_id,  min(r.recursion_depth) as recursion_depth
                    FROM routes_recursion_fast as r 
                    join routes_names as n on  n.id =r.route_id 
                    join points as p on p.name=n.point_b 
                    WHERE n.point_a ='{point_a}' and n.point_b='{point_b}' and r.lat=p.lat and r.lng=p.lng
                    group by r.route_id'''
        # print(query)
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=('route_id', 'recursion_depth'))

        #Перебираем все ледовые периоды
        ice_periods = sql.get_ice_periods()
        for index, period in ice_periods.iterrows():
            for index, d in data.iterrows():
                query = f'''SELECT route_id, version, sum(e.distance/c.avg_cohesion) as time, avg(recursion_depth) as recursion_depth
                            from  routes_recursion_fast as f 
                            join edge_cohesion as c on c.edge =f.edge and date_start='{period['start_date']}'
                            join edge as e on e.edge =c.edge 
                            where route_id={d['route_id']}
                            group by route_id, version
                            order by time ASC
                            limit 1 
                            '''
                # print(query)
                fast = self.connection.execute(query).fetchall()
                fast = pd.DataFrame(fast, columns=('route_id','version', 'time', 'recursion_depth'))

                #Проходимся по каждой дате отдельно, и оставляем лучший маршрут для каждой даты
                for i, f in fast.iterrows():
                    query = f'''INSERT INTO `routes_recursion_fast_d`(`route_id`, `version`, `step`, `lat`, `lng`, `edge`, `prev_lat`, `prev_lng`, `point_id_a`, `recursion_depth`, `date_start`) 
                                select f.*, '{period['start_date']}' as date_start  from routes_recursion_fast as f where  route_id={f['route_id']} and version={f['version']}
                                '''
                    # print(query)
                    self.connection.execute(query)

                    query = f'''UPDATE `routes_names` SET recursion_depth={f['recursion_depth']}, time='{f['time']}' WHERE id={f['route_id']}'''
                    self.connection.execute(query)

        return None
    def get_ice_periods(self):
        query = f'''SELECT DISTINCT start_date, end_date FROM `square_ice`'''
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=('start_date', 'end_date'))
        return data

    def truncate_table(self, table):
        query = f'''truncate table {table}'''
        self.connection.execute(query)

    def get_imo(self, caravan_id):
        query = f'''
                        SELECT imo FROM caravan_list as s
                        WHERE caravan_id='{caravan_id}' LIMIT 1
                        '''
        data = self.connection.execute(query).fetchall()
        return data[0][0]

    # get_date_start_by_ice_period(datetime_start_part)
    @lru_cache(100)
    def get_date_start_by_ice_period(self,datetime_start):
        query = f'''SELECT DISTINCT start_date FROM `square_ice` where start_date<='{datetime_start}' and end_date>='{datetime_start}' LIMIT 1 '''
        data = self.connection.execute(query).fetchall()
        if data[0][0] != None:
            return data[0][0]
        else:
            print('Период не найден')
            return '2022-03-01'
    def get_iceclass(self, imo):
        query = f'''SELECT iceclass FROM ships
                        WHERE imo='{imo}' LIMIT 1
                        '''
        # print(query)

        data = self.connection.execute(query).fetchall()
        return data[0][0]

    def insert_schedule(self):
        query = f'''
        INSERT INTO `schedule`(module_id, `caravan_id`, `imo_icebreaker`, `datetime_start`, `datetime_end`, `point_a`, `point_b`, sailing)
         select distinct module_id, caravan_id, '0', datetime_start, datetime_start, point_a, point_b, sailing from wish_list_parts where caravan_id<>0
         '''
        self.connection.execute(query)
        return None
    def add_track_points_cohesion(self, array):
        values = []
        for a in array:
            v = f'''({a['lat']}, {a['lng']},  '{a['date_start']}',  '{a['datet_end']}', {a['cohesion']}, {a['edge']})'''
            values.append(v)

        query = f'''INSERT INTO `track_points_cohesion`(`lat`, `lng`, `date_start`, `datet_end`, `cohesion`, `edge`) 
                       VALUES {','.join(values)}'''
        self.connection.execute(query)
        return None

    def set_placement(self):
        query = f'''
        INSERT INTO placement select m.model_id, p.* from placement_init  as p JOIN models as m
         '''
        self.connection.execute(query)
        return None

    def delete_placement(self):
        limit_icebreakers = int(6 - sql.get_constant('limit_icebreakers'))

        query = f'''SELECT distinct * FROM `placement_init` WHERE icebreaker=1 ORDER by imo DESC LIMIT {limit_icebreakers}'''
        data = self.connection.execute(query).fetchall()
        column_names = self.get_table_column_names('placement_init')
        data = pd.DataFrame(data, columns=column_names)

        for index, imo in data.iterrows():
            query = f'''
             DELETE FROM placement WHERE imo={imo['imo']}
               '''
            self.connection.execute(query)
        return None

    def insert_schedule_caravan(self, model_id, caravan, imo_icebreaker, caravan_id):
        if imo_icebreaker==0:
            pass

        query = f'''
         INSERT INTO `schedule`(model_id, `caravan_id`, `imo_icebreaker`, `datetime_start`, `datetime_end`, `point_a`, `point_b`)
          select distinct model_id, caravan_id, '{imo_icebreaker}', datetime_start, datetime_start, point_a, point_b from wish_list_parts where caravan_id='{caravan_id}' and model_id={model_id} and part_id='{caravan['part_id']}'
          '''
        self.connection.execute(query)
        return None

    def get_placement_icebreaker(self, model_id, point_a, point_b, datetime_start, datetime_end):
        column_names = self.get_table_column_names('placement')

        #Ищем ледокол в точке
        query = f'''
             SELECT *
             FROM placement
             WHERE (point_name='{point_a}')
             AND datetime_start<='{datetime_start}'
             AND datetime_end>='{datetime_end}'
             AND free=1
             AND model_id={model_id}
             AND icebreaker='1'
             LIMIT 1
             '''

        data = self.connection.execute(query).fetchall()
        if len(data) != 0:
            data = pd.DataFrame(data, columns=column_names)
            return data

        # Если в точке не нашли, анализируем любую исходную позицию без телепорта
        query = f'''
                    SELECT *
                    FROM placement
                    WHERE (point_name='*' AND teleport = '')
                    AND datetime_start<='{datetime_start}'
                    AND datetime_end>='{datetime_end}'
                    AND free=1
                    AND model_id={model_id}
                    AND icebreaker='1'
                    LIMIT 1
                    '''
        data = self.connection.execute(query).fetchall()
        if len(data) != 0:
            data = pd.DataFrame(data, columns=column_names)
            return data

        # Если не нашли, анализируем ближайшую позицию с телепортом
        query = f'''SELECT * from points WHERE name='{point_a}' limit 1 '''
        points = self.connection.execute(query).fetchall()
        points = pd.DataFrame(points, columns=self.get_table_column_names('points'))

        for index, point in points.iterrows():
            #Выбирать ближайший ледокол
            query = f'''
                        SELECT pl.*
                        FROM placement as pl
                        LEFT join points as p on name=pl.teleport
                        WHERE point_name='*'
                        AND datetime_start<='{datetime_start}'
                        AND datetime_end>='{datetime_end}'
                        AND free=1
                        AND model_id={model_id}
                        AND icebreaker='1'
                        ORDER BY (abs({point['lat']}-p.lat)+abs({point['lng']}-p.lng)) asc
                        LIMIT 1
                        '''
            # print(query)
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        return data

    def get_imo_placement(self, model_id, imo, caravan):
        query = f'''SELECT * FROM `placement` WHERE model_id='{model_id}'
                                                    and imo='{imo}' 
                                                    and datetime_start <='{caravan['datetime_start']}'
                                                    and datetime_end   >='{caravan['datetime_start']}'
                                                    and free=1 
                       '''

        # print(query)

        column_names = self.get_table_column_names('placement')
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        return data

    def get_date(self):
        query = f'''SELECT DISTINCT start_date, end_date from square_ice'''
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=('start_date', 'end_date'))
        return data

    def get_metrics(self):
        query = f'''
                SELECT model_id, sailing, count(*) from wish_list_parts where caravan_id=0 GROUP BY model_id, sailing
                '''

        column_names = ('model_id', 'sailing', 'count')
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=column_names)
        return data

    def get_metrics_f(self):
        sql.truncate_table('models_metrics')
        query = f'''
        INSERT INTO models_metrics(model_id, necessity, time, late_arrival, datetime_end, count, goal_func) 
                  select m.model_id,  avg(wm.necessity) as necessity, avg(wm.time) as time, avg(wm.late_arrival) as late_arrival, floor(avg(wm.datetime_end-20209806095854)/3600) as datetime_end, count(*) as count, count(*)*10+avg(wm.goal_func) as goal_func from models  as m
join schedule as s on s.model_id = m.model_id 
join wish_list_parts as wp  on wp.model_id = m.model_id 
							and wp.caravan_id = s.caravan_id 
							and wp.point_a = s.point_a 
						    and wp.point_b = s.point_b 

join wish_list_model as wm  on wm.model_id = m.model_id 
						   and wm.id = wp.id
						   and wm.imo = wp.imo
						   and wm.datetime_start = s.datetime_start 
						   and wm.datetime_end = wm.datetime_end 
						   and wm.point_a = s.point_a 
						   and wm.point_b = s.point_b 
group by m.model_id 
order by goal_func desc
                  '''

        self.connection.execute(query)

    def teleport_update_placement(self, model_id):

        query = f'''UPDATE `placement` SET teleport =point_name , point_name='*', datetime_start=DATE_ADD(datetime_start, INTERVAL 1 DAY) 
                    WHERE free=1 
                    and icebreaker=1 
                    and model_id={model_id} 
                    and DATEDIFF(datetime_end,datetime_start)>3
        '''
        # print(query)
        # and DATEDIFF(datetime_end,datetime_start)>1 LIMIT 1
        #select *, DATEDIFF(datetime_end,datetime_start) from  `placement`  WHERE free=1 and icebreaker=1 and model_id=1 and DATEDIFF(datetime_end,datetime_start)>3 and  point_name!='*' order by DATEDIFF(datetime_end,datetime_start) desc

        # and (datetime_end - datetime_start)
        self.connection.execute(query)
        return None

    def set_new_placement(self, model_id, imo, caravan, iceclass, icebreaker):
        # Необходимо разбить строку на две части и между ними вставить целевую
        if imo==8821797:
            pass

        imo_placements = sql.get_imo_placement(model_id, imo, caravan)
        for index, imo_placement in imo_placements.iterrows():
            # Удалим старый промежуток
            query = f'''DELETE FROM placement WHERE model_id='{imo_placement['model_id']}'
                                                and imo='{imo}'
                                                and datetime_start='{imo_placement['datetime_start']}'
                                                and datetime_end='{imo_placement['datetime_end']}'
            '''
            self.connection.execute(query)

            # Новая строка с караваном
            query = f'''INSERT INTO `placement`(model_id, `imo`, `datetime_start`, `datetime_end`, `point_name`, `free`, teleport, icebreaker) VALUES 
                            ('{model_id}','{imo}','{caravan['datetime_start']}','{caravan['datetime_end']}','{caravan['point_b']}','0', '','{icebreaker}')
                            '''
            self.connection.execute(query)

            # Интервал слева POINT_NAME = POINT_A
            if imo_placement['datetime_start'] < caravan['datetime_start']:
                new_end = caravan['datetime_start'] - timedelta(seconds=1)
                # print(new_end)
                query = f'''INSERT INTO `placement`(model_id, `imo`, `datetime_start`, `datetime_end`, `point_name`, `free`, teleport, icebreaker) VALUES 
                               ('{imo_placement['model_id']}','{imo}','{imo_placement['datetime_start']}',
                                '{new_end}','{caravan['point_a']}','{imo_placement['free']}', '','{icebreaker}')
                               '''
                self.connection.execute(query)
            # Интервал справа POINT_NAME = POINT_A
            if imo_placement['datetime_end'] > caravan['datetime_end']:
                new_start = caravan['datetime_end'] + timedelta(seconds=1)
                query = f'''INSERT INTO `placement`(model_id, `imo`, `datetime_start`, `datetime_end`, `point_name`, `free`, teleport, icebreaker) VALUES 
                                           ('{imo_placement['model_id']}','{imo}','{new_start}',
                                            '{imo_placement['datetime_end']}','{caravan['point_b']}','{imo_placement['free']}', '','{icebreaker}')
                                           '''
                self.connection.execute(query)
        return None

    def insert_time_intervals(self, datetime_start, datetime_end):
        query = f'''
         INSERT INTO time_intervals
         (datetime_start, datetime_end)
         VALUES (
               '{datetime_start}'
             , '{datetime_end}'
         )
         '''
        self.connection.execute(query)
        return None

    def add_edge(self, edge, lat_a, lng_a, lat_b, lng_b):
        query = f'''
         INSERT INTO `edge`(`edge`, `lat_a`, `lng_a`, `name_a`, `lat_b`, `lng_b`, `name_b`, `distance`, `avg_cohesion`) 
         VALUES ('{edge}', '{lat_a}', '{lng_a}', '',  '{lat_b}', '{lng_b}', '', 0, 0)
         '''
        self.connection.execute(query)
        return None

    def set_edge_name(self, lat, lng, name):
        query = f'''UPDATE edge SET name_a='{name}' where lat_a={lat} and lng_a={lng}'''
        self.connection.execute(query)

        query = f'''UPDATE edge SET name_b='{name}' where lat_b={lat} and lng_b={lng}'''
        self.connection.execute(query)
        return None

    def update_edge_cohesion(self):
        query = f'''UPDATE edge_cohesion as e SET avg_cohesion=(SELECT avg(cohesion) FROM track_points_cohesion as t WHERE t.edge=e.edge)'''
        self.connection.execute(query)

        query = f'''UPDATE edge_cohesion as e SET avg_cohesion=10 where avg_cohesion IS NULL'''
        self.connection.execute(query)

        query = f'''UPDATE edge_cohesion as e SET min_cohesion=(SELECT min(cohesion) FROM track_points_cohesion as t WHERE t.edge=e.edge)'''
        self.connection.execute(query)

        query = f'''UPDATE edge_cohesion as e SET min_cohesion=10 where min_cohesion IS NULL'''
        self.connection.execute(query)

        return None

    def edge_set_avg(self):
        query = f'''UPDATE edge as e SET avg_cohesion=(SELECT AVG(cohesion) FROM ice WHERE edge =e.edge)'''
        self.connection.execute(query)
        return None

    def select_trace_intervals(self, route_id, version):
        # print(route_id, version)
        query = f'''
                   select lat, lng from trace_intervals where route_id={route_id} and version={version}
                   ;'''
        data = self.connection.execute(query).fetchall()
        # for d in data:
        #     print(f'[{d[0]}, {d[1]}],')
        return None

    def insert_raiting(self, caravan_id, route_id):

        query = f'''
             DELETE FROM trace_raiting 
             WHERE caravan_id={caravan_id} 
             ;'''
        # and route_id = {route_id}
        self.connection.execute(query)

        query = f'''
         INSERT
         INTO
         trace_raiting
         SELECT DISTINCT
          caravan_id, route_id, version, min(datetime) as datetime_start, max(datetime) as datetime_end, sum(step_distance) as distance, sum(time) as time, 0,'' FROM trace WHERE caravan_id={caravan_id} and route_id = {route_id}
         GROUP BY caravan_id, route_id, version ORDER by time
         '''
        self.connection.execute(query)

        query = f'''
               UPDATE trace_raiting as a SET 
               raiting=(
              SELECT count(*) FROM ( SELECT * FROM trace_raiting ) as b
              WHERE a.caravan_id = b.caravan_id 
                AND a.route_id = b.route_id
                AND b.datetime_end <= a.datetime_end)
                WHERE caravan_id={caravan_id} and route_id = {route_id}
               '''
        self.connection.execute(query)

        query = f'''UPDATE trace_raiting as a SET type_trace=
                    (CASE WHEN raiting = 1 THEN "основной" ELSE "альтернативный" END)
          WHERE caravan_id={caravan_id} and route_id = {route_id}'''
        self.connection.execute(query)

        return None

    def insert_route_recursion_fast(self, value, version, route_id, recursion_depth):
        global version_global
        if len(value) == 0:
            return
        else:
            #Уничтожим возможные повторения
            new_value = list(set(value))

            values = []
            for v in new_value:
                q = f'({route_id},{version},{v}, {recursion_depth})'
                values.append(q)
        # pprint(value)
        query = f'''INSERT INTO `routes_recursion_fast`(`route_id`, `version`, `step`, `lat`, `lng`, `edge`, `prev_lat`, `prev_lng`, `point_id_a`, `recursion_depth`)
                   VALUES {','.join(values)}
                '''
        #ON DUPLICATE KEY UPDATE route_id='{route_id}', version='{version}', step='{step}'
        self.connection.execute(query)

        return None

    def insert_trace_list(self, value, version):

        if value:
            pass
        else:
            return

        values = []
        for v in value:
            v = f'({v}, {version})'
            values.append(v)

        query = f'''INSERT INTO trace
                (caravan_id, route_id, step, datetime, lat, lng, edge, speed, time, step_distance, id_interval,sailing,version)
                VALUES {','.join(values)}'''

        self.connection.execute(query)

        return None

    def insert_edge_cohesion(self, value):
        values = []
        for v in value:
            v = f'({v})'
            values.append(v)

        query = f'''INSERT INTO `edge_cohesion`(`date_start`, `date_end`, `edge`, `avg_cohesion`, `min_cohesion`)
                VALUES {','.join(values)}'''

        self.connection.execute(query)

        return None

    def delete_tracking(self, caravan_id):
        # print('QUERY')
        query = f'''
           DELETE FROM tracking
           WHERE 
           caravan_id={caravan_id}'''

        self.connection.execute(query)

        return None

    def update_wish_list_parts(self, wish, max_cohesion, sailing, necessity):
        query = f'''
         UPDATE wish_list_parts
         SET max_cohesion ='{max_cohesion}', necessity='{necessity}', sailing='{sailing}'
         WHERE part_id={wish['part_id']}  AND id={wish['id']}
         '''
        # print(query)
        self.connection.execute(query)
        return None

    def update_distance(self, edge, distance):
        query = f'''
         UPDATE edge
         SET distance = {distance}
         WHERE
         edge={int(edge)}
         '''
        # print(query)
        self.connection.execute(query)
        return None

    def update_schedule(self, caravan_id):
        query = f'''
           UPDATE schedule
           SET datetime_end = (SELECT datetime_end FROM trace_raiting WHERE caravan_id ='{caravan_id}' AND raiting = 1 LIMIT 1)
           WHERE
           caravan_id='{caravan_id}'
           '''
        # print(query)
        self.connection.execute(query)
        return None

    @lru_cache(maxsize=100)
    def get_sailing(self, imo, cohesion):
        # print(cohesion)
        if cohesion == None:
            round_c = 10
        else:
            round_c = round(cohesion, 0)
        query = f'''
                SELECT i.sailing FROM ships as s
                JOIN iceclass as i ON i.iceclass=s.iceclass AND iv_min<='{round_c}' AND iv_max>='{round_c}'
                WHERE s.imo='{imo}'  LIMIT 1
               '''
        # print(query)
        data = self.connection.execute(query).fetchall()
        # print(data)
        if data:
            return data[0][0]

    def get_speed_percent(self, imo, cohesion):
        # print(cohesion)
        if cohesion == None:
            round_c = 10
        else:
            round_c = round(cohesion, 0)
        query = f'''
                SELECT i.speed_percent FROM ships as s
                JOIN iceclass as i ON i.iceclass=s.iceclass AND iv_min<='{round_c}' AND iv_max>='{round_c}'
                WHERE s.imo='{imo}'  LIMIT 1
               '''
        data = self.connection.execute(query).fetchall()
        # pprint(data)
        # print(query)
        if data:
            return data[0][0]
        else:
            return 50

    @lru_cache(maxsize=100)
    def get_point(self, name):
        query = f'''
               SELECT *
               FROM points
               WHERE name='{name}' LIMIT 1
               '''
        data = self.connection.execute(query).fetchall()
        return data[0]

    def insert_routes_names(self, name, point_a, point_b):

        query = f'''SELECT id FROM routes_names WHERE name='{name}' LIMIT 1
        '''
        data = self.connection.execute(query).fetchall()

        if (len(data) == 0):
            query = f'''
                 INSERT INTO routes_names
                 (name, point_a, point_b)
                 VALUES (
                        '{name}'
                     , '{point_a}'
                     , '{point_b}'
                 )'''
            self.connection.execute(query)

            query = f'''SELECT id FROM routes_names WHERE name='{name}' LIMIT 1
            '''
            data = self.connection.execute(query).fetchall()
        return data[0][0]

    @lru_cache(maxsize=100)
    def get_recursion_depth(self, route_id):
        query = f'''select recursion_depth from routes_names where id={route_id} limit 1
        '''
        data = self.connection.execute(query).fetchall()
        if len(data):
            return data[0][0]
        else:
            0

    @lru_cache(maxsize=100)
    def get_next_steps(self, route_id, lat_a, lng_a, date_start):
        query = f'''
         SELECT *
         FROM routes_rec where 
         route_id='{route_id}'
         AND lat_a='{lat_a}'
         AND lng_a='{lng_a}'
         AND date_start='{date_start}'
         '''
        # print(query)
        data = self.connection.execute(query).fetchall()
        column_names = self.get_table_column_names('routes_rec')
        data = pd.DataFrame(data, columns=column_names)
        return data

    def insert_route_rec(self):
        query = f'''DELETE FROM routes_rec'''
        self.connection.execute(query)
        query = f'''INSERT INTO routes_rec (SELECT DISTINCT route_id, prev_lat as lat_a, prev_lng as lng_a, lat as lat_b,lng as lng_b,edge, date_start FROM routes_recursion_fast_d);'''
        # print(query)
        self.connection.execute(query)
        return None

    def delete_trace_caravan(self, caravan_id):
        query = f'''DELETE FROM trace where caravan_id={caravan_id};'''
        self.connection.execute(query)
        return None

    def get_interval(self):
        query = f'''
         SELECT min(datetime) as start, max(datetime) as end FROM trace;
         '''
        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=('start', 'end'))
        return data

    def init_wish_list(self):
        # query = f'''update wish_list set caravan_id =0;'''
        # self.connection.execute(query)

        query = f'''update wish_list_parts  set caravan_id=0;'''
        self.connection.execute(query)

        return None

    def select_one_caravan_p(self, model_id, max_ships_caravan=100):

        query = f'''SELECT  wl.model_id, wl.point_a, wl.point_b, wl.datetime_start, sum(wl.goal_func) as sum_goal_func 
FROM wish_list_model as wl
join wish_list_parts as wp on wp.id=wl.id and wp.point_a=wl.point_a and wp.point_b=wl.point_b and wp.model_id=wl.model_id and wp.model_id = {model_id}
join placement as p_i on p_i.model_id  = {model_id}
                     and p_i.free = 1 
                     and p_i.icebreaker = 1 
                     and (p_i.point_name = wl.point_a or p_i.point_name = '*' ) 
                     and p_i.datetime_start <= wl.datetime_start 
                     and p_i.datetime_end >= wl.datetime_end 
join placement as p_s on p_s.model_id = {model_id}
                     and p_s.free = 1 
                     and p_s.imo = wl.imo 
                     and (p_s.point_name = wl.point_a or p_s.point_name = '*' or p_s.point_name = wl.point_b) 
                     and p_s.datetime_start <= wl.datetime_start 
                     and p_s.datetime_end >= wl.datetime_end 
    where wl.model_id={model_id} 
      and wp.caravan_id = 0 
group by point_a, point_b, datetime_start  ORDER by sum_goal_func desc, datetime_start asc  
limit 1'''

        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=('model_id', 'point_a', 'point_b', 'datetime_start', 'sum_goal_func'))

        for index, d in data.iterrows():
            query = f''' SELECT distinct wl.id, wl.datetime_start,  wl.datetime_end, wl.point_a, wl.point_b, wl.imo, wp.part_id , max(wl.necessity) as necessity, min( p_i.imo ) as imo_icebreaker 
            from

 wish_list_model as wl
                         
 join wish_list_parts as wp on wp.id=wl.id and wp.point_a=wl.point_a and wp.point_b=wl.point_b and wp.model_id=wl.model_id 

join placement as p_s on p_s.model_id = {model_id}
                     and p_s.free = 1 
                     and p_s.imo = wl.imo 
                     and (p_s.point_name = wl.point_a or p_s.point_name = '*' or p_s.point_name = wl.point_b)
                     and p_s.datetime_start <= wl.datetime_start 
                     and p_s.datetime_end >= wl.datetime_end 
 
 join placement as p_i on p_i.model_id  = {model_id}
                     and p_i.free = 1 
                     and p_i.icebreaker = 1 
                     and (p_i.point_name = wl.point_a or p_i.point_name = '*' ) 
                     and p_i.datetime_start <= wl.datetime_start 
                     and p_i.datetime_end >= wl.datetime_end 
 
     where          wl.model_id =  {model_id}
                and wp.caravan_id = 0 
                and wl.point_a = '{d['point_a']}'
                and wl.point_b = '{d['point_b']}'
                and wl.datetime_start = '{d['datetime_start']}'
       
                 group by wl.id, wl.datetime_start,  wl.datetime_end, wl.point_a, wl.point_b, wl.imo, wp.part_id
                order by  max(wl.datetime_end) DESC
LIMIT {max_ships_caravan}
            '''
            break
        # print(query)
        data = self.connection.execute(query).fetchall()

        data = pd.DataFrame(data, columns=('id', 'datetime_start', 'datetime_end', 'point_a', 'point_b', 'imo', 'part_id', 'necessity', 'imo_icebreaker'))
        return data

    def get_wish_list_part_1(self, model_id, caravan):
        query = f'''select wm.id, wm.datetime_start, wm.datetime_end, wm.point_a, wm.point_b, wm.imo, wp.part_id , wp.caravan_id
                    from wish_list_model as wm
                    join wish_list_parts as wp on wp.id=wm.id and wp.point_a=wm.point_a and wp.point_b=wm.point_b and wp.model_id=wm.model_id
                    where   wm.point_b='{caravan['point_a']}' 
                        and wm.id={caravan['id']} 
                        and wm.model_id={model_id} 
                        and wm.datetime_end<='{caravan['datetime_start']}'
                        and wp.caravan_id=0
                    order by datetime_end desc
                    limit 1
                '''

        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=(
        'id', 'datetime_start', 'datetime_end', 'point_a', 'point_b', 'imo', 'part_id', 'caravan_id'))
        return data

    def select_one_caravan_s(self, model_id):
        # Корабли свободного плавания нет смысла объединять
        # Поэтому берем корабль по принципу без опоздания, с минимальным временем в пути
        query = f'''select wl.id, wl.datetime_start,  wl.datetime_end, wl.point_a, wl.point_b, wl.imo, wp.part_id, wl.time, wl.late_arrival,  (wl.time+wl.late_arrival*3600) as goal_func from wish_list_model as wl
                    join wish_list_parts as wp on wp.id=wl.id 
                                              and wp.point_a=wl.point_a 
                                              and wp.point_b=wl.point_b 
                                              and wp.model_id=wl.model_id 
                                              and wp.caravan_id=0
                                              and wp.sailing ='S'
                    join placement as p_s on p_s.model_id = wl.model_id  
                                         and p_s.imo = wl.imo 
                                         and (p_s.point_name = wl.point_b or p_s.point_name = wl.point_a or p_s.point_name = '*' ) 
                                         and wl.datetime_start between p_s.datetime_start and p_s.datetime_end
                                         and wl.datetime_end   between p_s.datetime_start and p_s.datetime_end
                                         and p_s.free = 1
                    where wl.model_id={model_id}
                    order by  wl.datetime_end asc
                    limit 1'''

        data = self.connection.execute(query).fetchall()
        data = pd.DataFrame(data, columns=(
        'id', 'datetime_start', 'datetime_end', 'point_a', 'point_b', 'imo', 'part_id', 'time', 'late_arrival',
        'goal_func'))
        return data

    def insert_wish_list_model(self, value):
        if not (value):
            return

        query = f'''INSERT INTO wish_list_model
                    (model_id, id, part_id, imo, point_a, point_b, datetime_start, datetime_end, max_cohesion, necessity, sailing, caravan_id, time,late_arrival, goal_func)
                    VALUES {','.join(value)}'''

        self.connection.execute(query)
        print('Заполнена wish_list_model')

        return None

    def insert_track_points(self, value):
        values = []
        for v in value:
            v = f'({v})'
            values.append(v)

        query = f'''INSERT INTO `track_points`(`lat`, `lng`, `date_start`, `datet_end`, `cohesion`, edge, distance) VALUES {','.join(values)}'''
        self.connection.execute(query)
        return None

    def update_square_ice(self):
        query = f'''UPDATE square_ice as i SET status=(SELECT status from square_status as s WHERE s.row=i.row and s.col=i.col LIMIT 1)'''
        # print(query)
        self.connection.execute(query)
        return None

    def insert_square_ice_status(self, value):
        values = []
        for v in value:
            v = f'({v})'
            values.append(v)

        query = f'''INSERT INTO `square_status`(`row`, `col`, `status`) VALUES {','.join(values)}'''
        self.connection.execute(query)
        return None

sql = SqlClass()