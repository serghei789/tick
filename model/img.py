import json
import time
import requests
import base64
from database import sql
from passwords import api_key, secret_key

global_style = "ANIME"
class Text2ImageAPI:

    def __init__(self, url, api_key, secret_key):
        self.URL = url
        self.AUTH_HEADERS = {
            'X-Key': f'Key {api_key}',
            'X-Secret': f'Secret {secret_key}',
        }

    def get_model(self):
        response = requests.get(self.URL + 'key/api/v1/models', headers=self.AUTH_HEADERS)
        data = response.json()
        return data[0]['id']

    def generate(self, prompt, model, images=1, width=1024, height=1024):
        global global_style
        params = {
            "type": "GENERATE",
            "style": global_style,
            "numImages": images,
            "width": width,
            "height": height,

            "generateParams": {
                "query": f"{prompt}"
            }
        }

        data = {
            'model_id': (None, model),
            'params': (None, json.dumps(params), 'application/json')
        }
        response = requests.post(self.URL + 'key/api/v1/text2image/run', headers=self.AUTH_HEADERS, files=data)
        data = response.json()
        return data['uuid']

    def check_generation(self, request_id, attempts=10, delay=10):
        while attempts > 0:
            response = requests.get(self.URL + 'key/api/v1/text2image/status/' + request_id, headers=self.AUTH_HEADERS)
            data = response.json()
            if data['status'] == 'DONE':
                return data['images']

            attempts -= 1
            time.sleep(delay)

def set_prompt():
    ships = sql.get_table('ships')

    for index, ship in ships.iterrows():
        text = f'Корабль {ship['name']}, ледовый класc {ship['iceclass']}'
        sql.set_ship_prompt(ship['imo'], text)
    return None

def set_img():
    ships_img("ANIME")  # Генерация картинок
    ships_img("AIVAZOVSKY") #Генерация картинок
    ships_img("DEFAULT") #Генерация картинок
    ships_img("KANDINSKY") #Генерация картинок
    ships_img("UHD") #Генерация картинок
    return None

def ships_img(style="ANIME"):
    # "name": "KANDINSKY", "title": "Кандинский", "titleEn": "Kandinsky"
    # "name": "UHD", "title": "Детальное фото", "titleEn":
    # "name": "ANIME", "title": "Аниме"
    # "name": "DEFAULT", "title": "Свой стиль"
    ships = sql.get_table('ships')

    for index, ship in ships.iterrows():
        # if index >= 30:
        generate_img(ship['prompt'], ship['imo'], style)

    return None
def generate_img(prompt, imo, style):
    global global_style
    global_style = style
    print("Генерация")
    api = Text2ImageAPI('https://api-key.fusionbrain.ai/', api_key=api_key, secret_key=secret_key)
    model_id = api.get_model()
    uuid = api.generate(prompt, model_id)
    images = api.check_generation(uuid)

    for image in images:
        filename = f'img/{style}/{imo}.png'
        imgdata = base64.b64decode(image)
        with open(filename, 'wb') as f:
            f.write(imgdata)