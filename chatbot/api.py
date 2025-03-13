from fastapi import FastAPI, Query, Body, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

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
    
    return {
        "output": f"Hello, you sent: {request.message}",
        "geometryCODE":"kivnE|{r]Dz@jo@jXtO_a@dY`KzKvCxg@dKze@tKbxDrr@zwApGpb@xT~iD|uX``D`iD`uDryNtFdeGhpCvoJaIfjKdhCbgJ{m@tpPqwAvtEeoGpcIf[x~IdyAnrH~rBj}A~{ClgJviCdnA~dClqEno@ftJgrC`qLhPpfJqtBdxC{]n_TueCxeEaw@hkI}xE|gGsuDrbSk_IbcIcfBnzE{_EtwBixArsU~^zqIa]~zDyK~dCeH`lAv_Ad_AnOt^hNl_BjKn]Y~\`Rta@eAtB}H~CCE",
        "imageURL": "https://memorai-media.s3.us-east-1.amazonaws.com/ME02d2b158a2dd53375e564f6f2b20d858.jpg"
    }

@app.options("/response")
async def options_response():
    return {}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
