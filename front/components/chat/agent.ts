// agent.ts
import { initializeAgentExecutorWithOptions } from "langchain/agents";
//import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { DynamicTool } from "langchain/tools";
import { getCurrentWeather, getSafestRoutes,getLocationMapbox } from "./agent-tools";


export const initializeAgent = async () => {
  try {
    // Define tools
    const getTimeTool = new DynamicTool({
      name: "get_time",
      description: "Returns the current time in HH:MM:SS format",
      func: async () => {
        return new Date().toLocaleTimeString();
      },
    });
    
    const addNumbersTool = new DynamicTool({
      name: "add_numbers",
      description: "Adds two numbers. Input format: 'num1,num2'",
      func: async (input) => {
        const [num1, num2] = input.split(",").map(Number);
        if (isNaN(num1) || isNaN(num2)) {
          throw new Error("Invalid input. Provide two numbers separated by a comma.");
        }
        return (num1 + num2).toString();
      },
    });
    const weatherTool = new DynamicTool({
      name: "get_weather",
      description: "Gets current weather for a location. Input can be a city name or coordinates as 'latitude,longitude'. Optional second parameter for unit format ('celsius' or 'fahrenheit').",
      func: async (input) => {
        const params = input.split(",");
        // If we have 3 or more parameters, it means we have coordinates and possibly a format
        if (params.length >= 3) {
          const lat = parseFloat(params[0].trim());
          const lon = parseFloat(params[1].trim());
          const format = params.length > 3 ? params[3].trim() : "celsius";
          return JSON.stringify(await getCurrentWeather(`${lat},${lon}`, format));
        } else if (params.length === 2) {
          // Check if second param is a format or part of location
          const secondParam = params[1].trim().toLowerCase();
          if (secondParam === "celsius" || secondParam === "fahrenheit") {
            return JSON.stringify(await getCurrentWeather(params[0].trim(), secondParam));
          }
        }
        // Default case: treat entire input as location
        return JSON.stringify(await getCurrentWeather(input));
      },
    });
    const safestRoutesTool = new DynamicTool({
      name: "get_safest_routes",
      description: "Gets the safest routes between two locations. Input format: 'startLocation,endLocation' , example Input:`Casablanca, Morocco`, `Rabat, Morocco`",
      func: async (input) => {
        const [startLocation, endLocation] = input.split(",");
        return JSON.stringify(await getSafestRoutes(startLocation, endLocation));
      },
    });
    const locationTool = new DynamicTool({
      name: "get_location",
      description: "Gets the latitude and longitude for a given place name. Input format: 'placeName'",
      func: async (input) => {
        return JSON.stringify(await getLocationMapbox(input));
      },
    });
    
    // Initialize LLM with OpenAI API
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
      openAIApiKey: "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", // Replace with your OpenAI API key
    });
    
    const agent = await initializeAgentExecutorWithOptions(
      [getTimeTool, addNumbersTool, weatherTool, safestRoutesTool,locationTool],
      llm,
      {
        agentType: "zero-shot-react-description",
        verbose: true,
      }
    );
    

    return agent;
  } catch (error) {
    console.error("Error initializing agent:", error);
    throw error;
  }
};