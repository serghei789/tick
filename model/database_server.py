import time
import urllib
from datetime import datetime
from functools import lru_cache
from urllib.parse import urlencode

import requests
import sqlalchemy
import pandas as pd
import warnings
from passwords import dbServer

warnings.simplefilter('ignore')

class SqlClassServer:
    # за ссылкой на базу данных обращайтесь в телеграм (@mgarbuzenko)
    #Основная
    db=dbServer

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

    def get_events(self):
        query = f"SELECT * FROM events WHERE status=0 and (event_table='run' or event_table='stop')"

        data = self.connection.execute(query).fetchall()
        column_names = self.get_table_column_names('events')
        data = pd.DataFrame(data, columns=column_names)
        return data

    def set_events_status(self, event, progress):
        print(time.time())
        # print(event['timestamp_start'])
        run_time = datetime.now() - datetime.strptime(str(event['timestamp_start']), '%Y-%m-%d %H:%M:%S')
        print(run_time)
        query = f'''UPDATE `events` SET status=1, progress={progress}, 	run_time='{run_time}' WHERE id='{event['id']}' '''
        # print(query)
        data = self.connection.execute(query)
        return None


    def clear_stop(self):
        query = f'''UPDATE `events` SET status=1 WHERE event_table='stop' and status!=1'''
        data = self.connection.execute(query)
        query = f'''UPDATE `events` SET status=1 WHERE status!=1'''
        data = self.connection.execute(query)
        return None
    def check_stop(self):
        query = f'''SELECT * FROM `events` WHERE event_table='stop' and status!=1'''
        data = self.connection.execute(query).fetchall()
        column_names = self.get_table_column_names('events')
        data = pd.DataFrame(data, columns=column_names)
        if len(data)>0:
            print('STOP - Прерывание расчетов')
            return True
        else:
            return False

    def set_events_progress(self, event_id, progress, text=''):
        if event_id!=0:
            progress = round(progress, 2)
            query = f'''UPDATE `events` SET progress={progress}, text='{text}' WHERE id='{event_id}'
            '''
            data = self.connection.execute(query)
            print(text)

            query = f'''INSERT INTO logs(event_id, text, progress, time) VALUES ({event_id}, '{text}', {progress}, '{datetime.now()}') '''
            data = self.connection.execute(query)
        return None

sqlServer = SqlClassServer()