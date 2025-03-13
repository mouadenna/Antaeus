from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from main import ask_agent_executor

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
    geometryCODE: str
    imageURL: str

@app.post("/response", response_model=ResponseModel)
async def get_response(request: RequestModel):
    # Process the message from the request body
    if not request.message:
        raise HTTPException(status_code=400, detail="Message is required")
    
    response = ask_agent_executor(request.message)
    #print(response)
    return {
        "output": response.output,
        "geometryCODE": response.geometryCode if response.geometryCode else "",
        "imageURL": response.image if response.image else ""
    }
@app.options("/response")
async def options_response():
    return {}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

