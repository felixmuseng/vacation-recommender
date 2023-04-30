
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
import uuid
import requests
import pandas as pd

app = Flask(__name__)
API_KEY = open('API_KEY.txt').read()
options = [
    # Brunei
    "Bandar Seri Begawan","Kuala Belait","Seria","Tutong",

    # Cambodia
    "Phnom Penh","Siem Reap","Battambang","Sihanoukville","Kampot","Kratie","Kep","Koh Kong",

    # Indonesia
    "Jakarta",
    "Surabaya",
    "Bandung",
    "Medan",
    "Semarang",
    "Yogyakarta",
    "Makassar",
    "Palembang",
    "Denpasar",
    "Bekasi",
    "Tangerang",
    "Bogor",

    # Laos
    "Vientiane",
    "Luang Prabang",
    "Pakse",
    "Savannakhet",
    "Vang Vieng",

    # Malaysia
    "Kuala Lumpur",
    "George Town",
    "Ipoh",
    "Johor Bahru",
    "Kota Kinabalu",
    "Kuching",
    "Melaka",
    "Petaling Jaya",
    "Shah Alam",
    "Subang Jaya",
    "Iskandar Puteri",

    # Myanmar (Burma)
    "Yangon",
    "Mandalay",
    "Naypyidaw",
    "Bago",
    "Mawlamyine",
    "Taunggyi",
    "Monywa",
    "Myitkyina",

    # Philippines
    "Manila",
    "Quezon City",
    "Makati",
    "Cebu City",
    "Davao City",
    "Iloilo City",
    "Baguio",
    "Angeles City",
    "Bacolod",
    "Cagayan de Oro",
    "Tagaytay",
    "Tagbilaran",

    # Singapore
    "Singapore",

    # Thailand
    "Bangkok",
    "Chiang Mai",
    "Pattaya",
    "Phuket",
    "Krabi",
    "Chiang Rai",
    "Hua Hin",
    "Ayutthaya",
    "Kanchanaburi",
    "Nakhon Ratchasima",

    # Timor-Leste
    "Dili",
    "Baucau",
    "Maliana",
    "Suai",
    "Lospalos",

    # Vietnam
    "Hanoi",
    "Ho Chi Minh City",
    "Da Nang",
    "Haiphong",
    "Can Tho",
    "Nha Trang",
    "Hue",
    "Da Lat",
    "Vung Tau",
    "Qui Nhon"
    ];

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/api/sus', methods=['POST'])
@cross_origin()
def sus():
    data = request.get_json()
    city = data['input']
    if city not in options:
        return "Failed to find city", 400
    
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"

    params = {
        "key": API_KEY,
        "query": f"interesting places in {city}",
        "type": "point_of_interest",
        "minrating": "4",
    }
    response = requests.get(url, params=params)
    result = response.json()["results"][:3]

    return result

@app.route('/api/cities', methods=['GET'])
@cross_origin()
def cities():
    
    query = request.args.get('q')
    results = [city for city in options if city.lower().startswith(query.lower())]
    
    return jsonify(results)

@app.route('/api/cityphoto', methods=['POST'])
@cross_origin()
def cityphoto():
    city_name = request.get_json()['data']
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={city_name}&key={API_KEY}"
    response = requests.get(url)
    data = response.json()
    
    photo_ref = data["results"][0]["photos"][0]["photo_reference"]
    photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_ref}&key={API_KEY}"
    photo_response = requests.get(photo_url)
    
    filename = 'cityphotos/'+city_name+'.jpg'
    with open(filename, 'wb') as f:
        f.write(photo_response.content)
    if response.ok:
        return send_file(filename, mimetype='image/jpeg', as_attachment=True)
    else:
        return "Failed to fetch photo", 400


@app.route('/api/link', methods=['POST'])
@cross_origin()
def link():
    
    data = request.get_json()
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    place_id = data['data']
    params = {
        "key": API_KEY,
        "place_id": place_id
    }
    response = requests.get(url, params=params)
    place_url = response.json()['result']['url']
    
    return jsonify(place_url)

@app.route('/api/photo', methods=['POST'])
@cross_origin()
def photo():
    req = request.get_json()
    url = "https://maps.googleapis.com/maps/api/place/photo"
    stuff = req['data']['photos'][0]['photo_reference']
    params = {
        "key": API_KEY,
        "maxwidth": 400,
        "maxheight": 400,
        "photoreference": stuff,
    }
    response = requests.get(url, params=params)
    
    filename = 'photos/'+req['data']['name']+'.jpg'
    with open(filename, 'wb') as f:
        f.write(response.content)
    if response.ok:
        return send_file(filename, mimetype='image/jpeg', as_attachment=True)
    else:
        return "Failed to fetch photo", 400
    
@app.route('/api/closest', methods=['POST'])
@cross_origin()
def closest():
    df = pd.read_csv('distance_matrix.csv')
    req = request.get_json()
    city = (req['data'])
    mylist = df[city].tolist()
    c1 = sorted([x for x in mylist if x!= 0])[:3]
    c2 = [i for i, x in enumerate(mylist) if x in c1]
    c3 = [df.iloc[i, 0] for i in c2]
    
    return jsonify(c3)

if __name__ == '__main__':
    app.run(debug=True)

