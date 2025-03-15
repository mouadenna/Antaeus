import requests
from typing import Dict, Any, Optional,List
from pydantic import BaseModel
import os 
import json

class WeatherResponse(BaseModel):
    location: str
    temperature: float
    description: str
    unit: str

class SafestRouteResponse(BaseModel):
    distance: float
    duration: float
    geometry: str

class LocationResponse(BaseModel):
    place_name: str
    latitude: float
    longitude: float

def get_current_weather(location: str, format: str = "celsius") -> Dict[str, Any]:
    api_key = "openweathermap_api_key"
    base_url = "http://api.openweathermap.org/data/2.5/weather"
    params = {"appid": api_key, "units": "metric" if format.lower() == "celsius" else "imperial"}

    if "," in location:
        latitude, longitude = map(float, location.split(","))
        params["lat"], params["lon"] = latitude, longitude
    else:
        params["q"] = location

    try:
        response = requests.get(base_url, params=params)
        data = response.json()
        return WeatherResponse(
            location=data.get("name", "Unknown"),
            temperature=data["main"]["temp"],
            description=data["weather"][0]["description"],
            unit=format
        ).model_dump()
    except Exception as error:
        return {"error": str(error)}

def get_safest_routes(start_place_name: str, end_place_name: str) -> Dict[str, Any]:
    try:
        start_location = get_location_mapbox(start_place_name)
        if "error" in start_location:
            return {"error": start_location["error"]}

        end_location = get_location_mapbox(end_place_name)
        if "error" in end_location:
            return {"error": end_location["error"]}

        api_key = "pk.eyJ1IjoibW91YWRlbm5hIiwiYSI6ImNseDB1dTlzMTA0ZHAyanF4bHpkcXN1ZWYifQ.LZPFuOLYykPmI3es9aKyig"
        url = f"https://api.mapbox.com/directions/v5/mapbox/driving/{start_location['longitude']},{start_location['latitude']};{end_location['longitude']},{end_location['latitude']}?access_token={api_key}"
        #url = f"https://api.mapbox.com/directions/v5/mapbox/driving/{start_location['longitude']},{start_location['latitude']};{end_location['longitude']},{end_location['latitude']}?geometries=geojson&access_token={api_key}"

        response = requests.get(url)
        data = response.json()
        if data["routes"]:
            route = data["routes"][0]
            return SafestRouteResponse(
                distance=route["distance"],
                duration=route["duration"],
                geometry=route["geometry"]
            ).dict()
        return {"error": "No routes found"}
    except Exception as error:
        return {"error": str(error)}

def get_location_mapbox(place_name: str) -> Dict[str, Any]:
    api_key = "pk.eyJ1IjoibW91YWRlbm5hIiwiYSI6ImNseDB1d2VuczA0Y3gyaXM0Y2E5Z3A2OWoifQ.nnDPc-c8ndn7lpfEqukeXA"
    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{place_name}.json?access_token={api_key}"

    try:
        response = requests.get(url)
        data = response.json()
        if data["features"]:
            place = data["features"][0]
            return LocationResponse(
                place_name=place["place_name"],
                latitude=place["center"][1],
                longitude=place["center"][0]
            ).dict()
        return {"error": "Location not found"}
    except Exception as error:
        return {"error": str(error)}
    

class DisasterInfo(BaseModel):
    type: str
    location: Dict[str, str]
    timestamp: str
    damage_types: Optional[List[str]]
    damage_level: str
    image_url: Optional[str]

def query_disaster_data(query: str) -> Dict[str, Any]:
    """
    Query disaster data from the disaster.json file.
    Supports queries like:
    - "disaster in [location]" - filter by location (city/region/country)
    - "disaster of type [type]" - filter by disaster type (earthquake, flood, etc.)
    - "disaster with [damage_level]" - filter by damage level
    - "recent disasters" - sorts by recency
    """
    try:
        # Get the absolute path to the disaster.json file
        # current_dir = os.path.dirname(os.path.abspath(__file__))
        json_path = os.path.join('disasters.json')
        
        # Load the disaster data
        with open(json_path, 'r') as file:
            data = json.load(file)
            all_disasters = data.get("disaster_reports", [])
        
        # Process the query to filter the disasters
        query = query.lower()
        filtered_disasters = all_disasters
        
        # Filter by location
        if "in " in query:
            location = query.split("in ")[1].strip()
            filtered_disasters = [
                d for d in filtered_disasters if 
                location in d["location"]["city"].lower() or
                location in d["location"]["region"].lower() or
                location in d["location"]["country"].lower()
            ]
        
        # Filter by type
        if "type " in query:
            disaster_type = query.split("type ")[1].strip()
            filtered_disasters = [
                d for d in filtered_disasters if 
                disaster_type in d["type"].lower()
            ]
        
        # Filter by damage level
        if "with " in query:
            damage_level = query.split("with ")[1].strip()
            filtered_disasters = [
                d for d in filtered_disasters if 
                damage_level in d["damage_level"].lower()
            ]
        
        # Sort by recency
        if "recent" in query:
            filtered_disasters = sorted(
                filtered_disasters, 
                key=lambda x: x["timestamp"], 
                reverse=True
            )
        
        # Convert to DisasterInfo models for consistent output
        result = []
        for disaster in filtered_disasters:
            result.append(DisasterInfo(
                type=disaster["type"],
                location={
                    "latitude": str(disaster["location"]["latitude"]),
                    "longitude": str(disaster["location"]["longitude"]),
                    "city": disaster["location"]["city"],
                    "region": disaster["location"]["region"],
                    "country": disaster["location"]["country"]
                },
                timestamp=disaster["timestamp"],
                damage_types=disaster["damage_types"],
                damage_level=disaster["damage_level"],
                image_url=disaster.get("image_url")
            ).dict())
        
        return {
            "count": len(result),
            "disasters": result
        }
    
    except Exception as error:
        return {"error": str(error), "details": "Failed to query disaster data"}
    
#print(query_disaster_data("disaster in Marrakech"))