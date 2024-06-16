from pprint import pprint
import time
from sqlalchemy import create_engine, MetaData, event
from sqlalchemy.sql import sqltypes

from passwords import dbBackup, dbServer, dbLocal


def transfer_db(_from='local',_to='server', include_tables=()):
   start_time = time.time()
   print('Скрипт запущен')

   if _from=='backup':
       from_db = dbBackup
   if _from == 'local':
       from_db = dbLocal
   if _from == 'server':
       from_db = dbServer

   if _to == 'backup':
       to_db = dbBackup
   if _to == 'local':
       to_db = dbLocal
   if _to == 'server':
       to_db = dbServer

   src_engine = create_engine(from_db)
   src_metadata = MetaData(bind=src_engine)

   tgt_engine = create_engine(to_db)
   tgt_metadata = MetaData(bind=tgt_engine)

   @event.listens_for(src_metadata, "column_reflect")
   def genericize_datatypes(inspector, tablename, column_dict):
      column_dict["type"] = column_dict["type"].as_generic(allow_nulltype=True)

   tgt_metadata.reflect()

   # drop all tables in target database
   for table in reversed(tgt_metadata.sorted_tables):
      if table.name in include_tables:
         # print('delete table =', table.name)
         stmt = table.delete()
         stmt.execute()

   tgt_metadata.clear()
   tgt_metadata.reflect()
   src_metadata.reflect()

   # refresh metadata before you can copy data
   tgt_metadata.clear()
   tgt_metadata.reflect()

   # Copy all data from src to target
   for table in tgt_metadata.sorted_tables:
       if table.name in include_tables:
          src_table = src_metadata.tables[table.name]
          stmt = table.insert()

          insert_list = []
          index=0
          for index, row in enumerate(src_table.select().execute()):
             insert_list.append(row._asdict())
          stmt.execute(insert_list)
          # print(f"table ={table.name} Inserting row {index}")

   print("--- Время выполнения скрипта %s seconds ---" % (time.time() - start_time))

# transfer_db()