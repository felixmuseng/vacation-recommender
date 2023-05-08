
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin

import requests
import random
import pandas as pd
import heapq

app = Flask(__name__)
API_KEY = "AIzaSyCjgI5BoOAXO_LSzYprlQDMgzSeH4GicjI"
weatherKey = "6f7e7852d88f433bb4482854230605"
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
    place = data['params'].lower()
    if(place == ""):
        place = "point of interest"
    if city not in options:
        return "Failed to find city", 400
    
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"

    params = {
        "key": API_KEY,
        "query": f"interesting places in {city}",
        # "type": "point_of_interest",
        # "type": "library",
        "type": place,
        "minrating": "4",
    }
    response = requests.get(url, params=params)
    result = response.json()["results"][:4]
    
    url2 = "http://api.weatherapi.com/v1/forecast.json"
    params2 = {
        "key": weatherKey,
        "q": city,
        "days": 1,
        "aqi":"no",
        "alerts":"no"
    }
    response2 = requests.get(url2, params=params2)
    currentWeather = response2.json()['current']['condition']
    tomorrowWeather = response2.json()['forecast']['forecastday'][0]['day']['condition']
    
    data = {
        "result":result,
        "weather":currentWeather,
        "tomorrow":tomorrowWeather}
    return data

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
    c1 = sorted([x for x in mylist if x!= 0])[:4]
    c2 = [i for i, x in enumerate(mylist) if x in c1]
    c3 = [df.iloc[i, 0] for i in c2]
    data = []
    
    url = "http://api.weatherapi.com/v1/forecast.json"
    
    for city in c3:
        params = {
            "key": weatherKey,
            "q": city,
            "days": 1,
            "aqi":"no",
            "alerts":"no"
        }
        response = requests.get(url, params=params)
        data2 = response.json()
        currentWeather = data2['current']['condition']
        tomorrowWeather = data2['forecast']['forecastday'][0]['day']['condition']
        city_data = {
            "city": city,
            "current_weather": currentWeather,
            "tomorrow_weather": tomorrowWeather
        }
        data.append(city_data)
    
    return data

@app.route('/api/random', methods=['POST'])
@cross_origin()
def random_cities():
    req = request.get_json()
    city = req['data']
    bruh = list(options)
    bruh.remove(city)
    
    random_cities = random.sample(bruh, 4)
    
    data = []
    url = "http://api.weatherapi.com/v1/forecast.json"
    
    for cities in random_cities:
        params = {
            "key": weatherKey,
            "q": cities,
            "days": 1,
            "aqi": "no",
            "alerts": "no"
        }
        response = requests.get(url, params=params)
        data2 = response.json()
        currentWeather = data2['current']['condition']
        tomorrowWeather = data2['forecast']['forecastday'][0]['day']['condition']
        
        city_data = {
            "city": cities,
            "current_weather": currentWeather,
            "tomorrow_weather": tomorrowWeather
        }
        
        data.append(city_data)
    
    return data

@app.route('/api/rec', methods=['POST'])
@cross_origin()
def rec():
    data = request.get_json()
    distance_matrix_df = pd.read_csv('distance_matrix.csv', index_col=0)
    distance_matrix = distance_matrix_df.to_numpy()

    def dijkstra(graph, start, end):
        queue = [(0, start, [])]
        visited = set()
        while queue:
            (cost, node, path) = heapq.heappop(queue)
            if node not in visited:
                visited.add(node)
                path = path + [node]
                if node == end:
                    return (cost, path)
                for neighbor in range(len(graph[node])):
                    if graph[node][neighbor] != 0:
                        heapq.heappush(queue, (cost + graph[node][neighbor], neighbor, path))
        return float("inf")

    cities = distance_matrix_df.columns.tolist()
    start_city = data['from']
    end_city = data['to']

    def recommend_cities(distance_matrix, cities, shortest_path, max_recommendations):
        recommended_cities = []
        for i in range(len(shortest_path) - 1):
            curr_city = cities[shortest_path[i]]
            next_city = cities[shortest_path[i+1]]
            if i == len(shortest_path) - 2:
                next_city_index = shortest_path[i+1]
                for j in range(len(distance_matrix[next_city_index])):
                    if distance_matrix[next_city_index][j] != 0 and cities[j] != next_city and cities[j] not in shortest_path:
                        recommended_cities.append((cities[j], distance_matrix[next_city_index][j]))
                recommended_cities.sort(key=lambda x: x[1])
            else:
                curr_city_index = shortest_path[i]
                next_city_index = shortest_path[i+1]
                for j in range(len(distance_matrix[curr_city_index])):
                    if distance_matrix[curr_city_index][j] != 0 and cities[j] not in shortest_path:
                        if j in range(curr_city_index + 1, next_city_index):
                            recommended_cities.append((cities[j], distance_matrix[curr_city_index][j]))
                recommended_cities.sort(key=lambda x: x[1])
        recommended_cities = recommended_cities[:max_recommendations]
        return [x[0] for x in recommended_cities]

    start_index = cities.index(start_city)
    end_index = cities.index(end_city)
    (shortest_distance, shortest_path) = dijkstra(distance_matrix, start_index, end_index)

    recommended_cities = recommend_cities(distance_matrix, cities, shortest_path, max_recommendations=12)
    return random.sample(recommended_cities,3)

if __name__ == '__main__':
    app.run(debug=True)

