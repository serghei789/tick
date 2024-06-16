**Описание каталогов и файлов**

Особенности:
1) Для запуска проекта необходимо внести пароль для доступа к БД в файле database.py (Пароль можно запросить в телеграмм @mgarbuzenko)

* **_venv_** — папка виртуального окружения с установленными зависимостями;
* **_[main.py](main.py)_** — Запуск;
* **_[pooling.py](pooling.py)_** — Управление событиями с Фронта;
* **_[clear_cache.py](clear_cache.py)_** - Чистка КЭШ
* **_[database.py](database.py)_** — Локальная БД. Класс подключение к БД MySQL, и все методы взаимодействия с БД;
* **_[database_server.py](database_server.py)_** — Серверная БД. Класс подключение к БД MySQL, и все методы взаимодействия с БД;
* **_[img.py](img.py)_**  - Генерация Картинок
* **_[metrics.py](metrics.py)_** — Метрики модели;
* **_[necessity.py](necessity.py)_** — Определение потребности в проводке
* **_[optimal_function.py](optimal_function.py)_** — Целевая функция;
* **_[passwords.py](passwords.py)_** — Пароли - запросить у @mgarbuzenko
* **_[placement.py](placement.py)_** — модуль, который изначально проставляет местоположение ледоколов;
* **_[speed.py](speed.py)_** — Контроль скорости
* **_[schedule.py](schedule.py)_** — Формирование трассировки маршрута, прохождение;
* **_[trace.py](trace.py)_** — Трасировка движения;
* **_[transfer_local_db_to_server_db.py](transfer_local_db_to_server_db.py)_** — Перенос посчитанных таблиц в другую БД
* **_[utils.py](utils.py)_** — Утилиты
* **_[wishlist.py](wishlist.py)_** — Перебор времени старта каравана

**Порядок установки & запуска**
0) Установить локальную БД MySql, загрузить в неё схему
1) Получить пароли и заполнить в модуле [passwords.py](passwords.py)
1) python3 -m venv ice_venv
2) source ice_venv/bin/activate
3) pip3 install -r requirements.txt
4) run main.py

Документация
https://docs.google.com/document/d/1-stHrZz53gFbXzZQmJyDL6WGKAtnYZ1qIF8UIi-6xB0/edit?usp=sharing


**Таблицы базы данных**



