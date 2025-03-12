import axios from "axios";

export async function getCurrentWeather(location: string, format: string = "celsius"): Promise<object> {
    const apiKey = "c13887cebc8d2dd57383cf3e897bcdf6";
    const baseUrl = "http://api.openweathermap.org/data/2.5/weather";
    let params: any = { appid: apiKey, units: format.toLowerCase() === "celsius" ? "metric" : "imperial" };

    if (location.includes(",")) {
        const [latitude, longitude] = location.split(",").map(Number);
        if (isNaN(latitude) || isNaN(longitude)) {
            return { error: "Invalid coordinate format. Use 'latitude,longitude'." };
        }
        params.lat = latitude;
        params.lon = longitude;
    } else {
        params.q = location;
    }

    try {
        const response = await axios.get(baseUrl, { params });
        const data = response.data;
        return {
            location: data.name || "Unknown",
            temperature: data.main.temp,
            description: data.weather[0].description,
            unit: format
        };
    } catch (error) {
        return { error: error instanceof Error ? error.message : String(error) };
    }
}


async function getClosestHospital(latitude: number, longitude: number): Promise<object> {
    const apiKey = "pk.eyJ1IjoibW91YWRlbm5hIiwiYSI6ImNseDB1dTlzMTA0ZHAyanF4bHpkcXN1ZWYifQ.LZPFuOLYykPmI3es9aKyig";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/hospital.json?proximity=${longitude},${latitude}&access_token=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.features.length > 0) {
            return {
                hospital_name: data.features[0].text,
                address: data.features[0].place_name
            };
        }
        return { hospital_name: "Unknown", address: "Unknown" };
    } catch (error) {
        return { error: error instanceof Error ? error.message : String(error) };
    }
}

export async function getSafestRoutes(startPlaceName: string, endPlaceName: string): Promise<object> {
    try {
        const startLocation = await getLocationMapbox(startPlaceName);
        if (startLocation.error) {
            return { error: startLocation.error };
        }

        const endLocation = await getLocationMapbox(endPlaceName);
        if (endLocation.error) {
            return { error: endLocation.error };
        }

        const apiKey = "pk.eyJ1IjoibW91YWRlbm5hIiwiYSI6ImNseDB1dTlzMTA0ZHAyanF4bHpkcXN1ZWYifQ.LZPFuOLYykPmI3es9aKyig";
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLocation.longitude},${startLocation.latitude};${endLocation.longitude},${endLocation.latitude}?access_token=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;
        if (data.routes.length > 0) {
            const route = data.routes[0];
            return {
                distance: route.distance,
                duration: route.duration,
                geometry: route.geometry
            };
        }
        return { error: "No routes found" };
    } catch (error) {
        return { error: error instanceof Error ? error.message : String(error) };
    }
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): object {
    const R = 6371;
    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return { distance: R * c };
}


export async function getLocationMapbox(placeName:string) {
    const apiKey = "pk.eyJ1IjoibW91YWRlbm5hIiwiYSI6ImNseDB1d2VuczA0Y3gyaXM0Y2E5Z3A2OWoifQ.nnDPc-c8ndn7lpfEqukeXA";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeName)}.json?access_token=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
        const place = data.features[0];
        return {
            place_name: place.place_name,
            latitude: place.center[1],
            longitude: place.center[0]
        };
    } else {
        return { error: "Location not found" };
    }
}

// Example Usage
//getLocationMapbox("Casablanca, Morocco").then(console.log);
