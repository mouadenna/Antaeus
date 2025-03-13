// Define the response type from the API
interface ApiResponse {
  output: string
  geometryCODE: string
  imageURL: string
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

      return JSON.stringify(data)
    } catch (error) {
      console.error("Error executing agent:", error)

      // For demo purposes, if the API is down, return a mock response with geometryCODE
      return JSON.stringify({
        output: `I processed your message: "${input}". Sorry, the API service might be temporarily unavailable.`,
        geometryCODE: null,
        imageURL: null,
      })
    }
  }

  // Return the function directly
  return agentExecutor
}

