from database import sql
def get_sailing(wish,  max_cohesion):
    #Определим необходимость в проводке ледокола
    sailing = sql.get_sailing(wish['imo'], max_cohesion)

    if sailing == 'S':
        # Может плыть самостоятельно
        necessity = 0
    elif sailing == 'P':
        # Нужна проводка
        necessity = 100
    elif sailing == 'D':
        # Плыть запрещено
        necessity = -100
    else:
        necessity = 0

    return [sailing, necessity]