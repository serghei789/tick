from database import sql
def set_placement():
    sql.truncate_table('placement')
    sql.set_placement()
    return None
def set_placement_init():
    #Выполнить запрос для заполнения исходного положения кораблей
    #INSERT INTO placement_init(imo, datetime_start, datetime_end, point_name, free, iceclass) select imo, '1900-01-01 00:00:00', '9999-12-31 00:00:00', '*', '1', iceclass  from ships
    return None