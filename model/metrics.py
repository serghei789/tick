from pprint import pprint
from database import sql
def metrics():
    pprint(sql.get_metrics())
    sql.get_metrics_f()