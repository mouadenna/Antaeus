from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict
import uvicorn
from agent import initialize_agent_executor
from voice_api import router as voice_router

app = FastAPI()

# Add CORSMiddleware with more permissive settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
    expose_headers=["*"]  # Expose all headers
)

class RequestModel(BaseModel):
    message: str
    
class ResponseModel(BaseModel):
    output: str
    geometryCODE: Optional[str] = None
    imageURL: Optional[str] = None
    locationCoordinates: Optional[Dict[str, str]] = None

@app.post("/response", response_model=ResponseModel)
async def get_response(request: RequestModel):
    # Process the message from the request body
    if not request.message:
        raise HTTPException(status_code=400, detail="Message is required")
    
    print(f"Received message: {request.message}")
    
    try:
        agent_executor = initialize_agent_executor()
        response = agent_executor.invoke({"input": request.message})
        
        print(f"Agent response: {response}")
        
        # Extract the necessary fields from the response
        return {
            "output": response.get("output", ""),
            "geometryCODE": response.get("geometryCode", ""),
            "imageURL": response.get("image", ""),
            "locationCoordinates": response.get("locationCoordinates", {})
        }
    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.options("/response")
async def options_response():
    return {}


app.include_router(voice_router, prefix="/voice")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)