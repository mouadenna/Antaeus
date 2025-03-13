from agent import initialize_agent_executor, AgentResponse
from pydantic import ValidationError

# Initialize the agent executor
agent_executor = initialize_agent_executor()

# Define a function to interact with the agent executor
def ask_agent_executor(question: str) -> AgentResponse:
    try:
        # Run the agent executor with the user's question
        response = agent_executor.invoke({"input": question})
        
        # Parse the response into the AgentResponse model
        return AgentResponse(
            output=response.get("output", "No output provided."),
            image=response.get("image"),
            geometryCode=response.get("geometryCode")
        )
    except ValidationError as e:
        print(f"Validation error: {e}")
        return AgentResponse(output="Error: Invalid response format.")
    except Exception as e:
        print(f"Error: {e}")
        return AgentResponse(output="Error: Something went wrong.")

# Example usage
if __name__ == "__main__":
    # Ask the agent executor a question
    question = "what is the safest route between fes and rabat?"
    response = ask_agent_executor(question)
    
    # Print the response
    print("Output:", response.output)
    print("Image URL:", response.image)
    print("Geometry Code:", response.geometryCode)