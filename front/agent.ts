// Define the response type from the API
interface ApiResponse {
  output: string
  geometryCODE?: string
  imageURL?: string
  locationCoordinates?: {
    latitude: string | number
    longitude: string | number
  }
}

export const initializeAgent = async () => {
  // The server URL
  const baseUrl = "https://alive-cheetah-precisely.ngrok-free.app"

  // Define the agent executor function
  const agentExecutor = async (input: string) => {
    try {
      console.log("Sending request to API with input:", input)

      const response = await fetch(`${baseUrl}/response`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      console.log("Received response from API:", data)

      // Check if geometryCODE is empty and set it to null if it is
      if (!data.geometryCODE || data.geometryCODE.trim() === "") {
        data.geometryCODE = null
      }

      // Check if imageURL is empty and set it to null if it is
      if (!data.imageURL || data.imageURL.trim() === "") {
        data.imageURL = null
      }

      // Validate locationCoordinates if present
      if (data.locationCoordinates) {
        console.log("Raw location coordinates from API:", data.locationCoordinates)
        const { latitude, longitude } = data.locationCoordinates

        try {
          // Handle more flexible coordinate formats
          // Convert string values to numbers if needed, handling potential formatting issues
          let lat, lng

          if (typeof latitude === "string") {
            // Try to clean up the string (remove non-numeric characters except dot and minus)
            const cleanLat = latitude.trim().replace(/[^\d.-]/g, "")
            lat = Number.parseFloat(cleanLat)
          } else {
            lat = latitude
          }

          if (typeof longitude === "string") {
            // Try to clean up the string (remove non-numeric characters except dot and minus)
            const cleanLng = longitude.trim().replace(/[^\d.-]/g, "")
            lng = Number.parseFloat(cleanLng)
          } else {
            lng = longitude
          }

          console.log("Parsed coordinates:", { lat, lng })

          // Check for valid numbers
          if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
            console.warn("Invalid location coordinates (not valid numbers):", { latitude, longitude })
            data.locationCoordinates = null
          } else {
            // Apply less strict validation - just clamp values to valid ranges
            const validLat = Math.max(-90, Math.min(90, lat))
            const validLng = Math.max(-180, Math.min(180, lng))

            // Update with valid values
            data.locationCoordinates = {
              latitude: validLat,
              longitude: validLng,
            }

            console.log("Processed location coordinates:", data.locationCoordinates)
          }
        } catch (error) {
          console.error("Error processing location coordinates:", error)
          data.locationCoordinates = null
        }
      }

      return JSON.stringify(data)
    } catch (error) {
      console.error("Error executing agent:", error)

      // For demo purposes, if the API is down, return a mock response
      return JSON.stringify({
        output: `I processed your message: "${input}". Sorry, the API service might be temporarily unavailable.`,
        geometryCODE: null,
        imageURL: null,
        locationCoordinates: null,
      })
    }
  }

  // Return the function directly
  return agentExecutor
}

