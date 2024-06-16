from database import sql

def get_speed_m_s(imo, datum, lat, lng, sailing, iceclass, edge):

    if sailing in ('P', 'S', 'D'):
        cohesion = sql.get_cohesion(datum, edge)
        speed_percent = sql.get_speed_percent(imo, cohesion)
        max_speed = sql.get_speed_m_s(imo)
        speed = speed_percent*max_speed/100
        print(speed)
        return speed

    # if sailing in ('P', 'S', 'D'):
    #     #Под проводкой ледокола суда двигаются с одинаковой скоростью
    #     speed = sql.get_constant('provod_speed_m_s')
    #     return speed

    else:
        return None