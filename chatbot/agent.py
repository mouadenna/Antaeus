from langchain.agents import Tool, AgentExecutor, create_tool_calling_agent
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List, Union
from agent_tools import get_current_weather, get_safest_routes, get_location_mapbox,query_disaster_data
import datetime
import json
import re
import os
from dotenv import load_dotenv

class AgentResponse(BaseModel):
    output: str = Field(description="Natural language response from the agent.")
    image: Optional[str] = Field(default=None, description="URL of any image required.")
    geometryCode: Optional[str] = Field(default=None, description="Encoded geometry data.")
    locationCoordinates: Optional[Dict[str, str]] = Field(default=None, description="Coordinates in the format {'latitude': '', 'longitude': ''}.")

def initialize_agent_executor():
    try:
        # Define tools
        def get_time():
            return datetime.datetime.now().strftime("%H:%M:%S")

        def add_numbers(input: str):
            num1, num2 = map(float, input.split(","))
            return str(num1 + num2)

        tools = [
            Tool(
                name="get_time",
                func=lambda _: get_time(),
                description="Returns the current time in HH:MM:SS format."
            ),
            Tool(
                name="add_numbers",
                func=add_numbers,
                description="Adds two numbers. Input format: 'num1,num2'."
            ),
            Tool(
                name="get_weather",
                func=lambda input: get_current_weather(input),
                description="Gets current weather for a location. Input can be a city name or coordinates as 'latitude,longitude'. Optional second parameter for unit format ('celsius' or 'fahrenheit')."
            ),
            Tool(
                name="get_safest_routes",
                func=lambda input: get_safest_routes(*input.split(",")),
                description="Gets the safest routes between two locations. Input format: 'startLocation,endLocation'."
            ),
            Tool(
                name="get_location",
                func=lambda input: get_location_mapbox(input),
                description="Gets the latitude and longitude for a given place name. Input format: 'placeName'."
            ),
            Tool(
                name="query_disasters",
                func=lambda input: query_disaster_data(input),
                description="Queries disaster data from the disaster.json file. Supports queries like: 'all disasters', 'disaster in [location]', 'disaster of type [type]', 'disaster with [damage_level]', 'recent disasters'."
            )
        ]

        # Initialize LLM with OpenAI API
        # Load environment variables from .env file
        load_dotenv()
        
        llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0,
            api_key=os.getenv("OPENAI_API_KEY")
        )

        # Custom system prompt instructing the model to format responses correctly
        system_message = """
        You are a helpful assistant. Use the available tools to answer the user's questions.

        IMPORTANT: Your final response MUST be structured as a JSON object with the following fields:
        1. "output": Your natural language response to the user.
        2. "image": The URL of any relevant image (or null if no image is provided).
        3. "geometryCode": Any geometry or route data (or null if none is available).
        4. "locationCoordinates": Any coordinates, if applicable, in the following format:  {{"latitude": "","longitude": ""}}

        When handling route data, extract any encoded geometry strings and include them in the "geometryCode" field.
        """


        # Define the prompt with enhanced instructions
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_message),
                MessagesPlaceholder(variable_name="chat_history", optional=True),
                ("human", "{input}"),
                MessagesPlaceholder(variable_name="agent_scratchpad"),
            ]
        )

        # Create the agent
        agent = create_tool_calling_agent(llm, tools, prompt)

        
        # Simple wrapper to ensure we get the raw JSON
        class DirectJsonExecutor(AgentExecutor):
            def invoke(self, input: Union[Dict[str, Any], str]) -> Dict[str, Any]:
                # Call the original executor
                result = super().invoke(input)
                
                # Get raw output
                raw_output = result.get("output", "")
                
                # Try to parse it as JSON directly
                try:
                    # Find JSON in output (in case there's text around it)

                    json_match = re.search(r'({.*})', raw_output.replace('\n', ''))
                    if json_match:
                        json_str = json_match.group(1)
                        json_obj = json.loads(json_str)
                        return json_obj
                    else:
                        # Fall back to parsing the entire output
                        return json.loads(raw_output)
                except json.JSONDecodeError:
                    # If parsing fails, return raw output in our format
                    return {
                        "output": raw_output,
                        "image": None,
                        "geometryCode": None,
                        "locationCoordinates":None
                    }

        # Initialize DirectJsonExecutor
        agent_executor = DirectJsonExecutor(agent=agent, tools=tools, verbose=True)

        return agent_executor

    except Exception as error:
        print(f"Error initializing agent executor: {error}")
        raise error

if __name__ == "__main__":
    agent_executor = initialize_agent_executor()
    response = agent_executor.invoke({"input": "What is the location of disaster in Marrakech"})
    print("\nStructured Response:")
    print(f"Output: {response['output']}")
    print(f"Image URL: {response['image']}")
    print(f"Geometry Code: {response['geometryCode']}")
    print(f"location Coordinates: {response['locationCoordinates']}")
