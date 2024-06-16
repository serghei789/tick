from database import sql
def set_goal_func():
    models = sql.get_table('models')
    for index, model in models.iterrows():
        sql.update_goal_func(model)
    return None