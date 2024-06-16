from database import sql

def get_speed_m_s(imo, datum, lat, lng, sailing, iceclass, edge):

    if sailing == 'S':
        cohesion = sql.get_cohesion(datum, edge)
        speed_percent = sql.get_speed_percent(imo, cohesion)
        max_speed = sql.get_speed_m_s(imo)
        speed = speed_percent*max_speed/100
        return speed

    if sailing in ('P', 'D'):
        #Под проводкой ледокола суда двигаются с одинаковой скоростью
        speed = sql.get_constant('provod_speed_m_s')
        return speed

    else:
        return None