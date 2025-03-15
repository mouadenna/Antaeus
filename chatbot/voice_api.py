from fastapi import APIRouter, UploadFile, File, HTTPException
from langchain_core.prompts import PromptTemplate
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain_google_genai import ChatGoogleGenerativeAI

import shutil
import os
from transformers import pipeline


router = APIRouter()

model = pipeline("automatic-speech-recognition", model="openai/whisper-small")

def transcribe_audio(audio_path):
    result = model(audio_path)
    return result["text"]

def extract_information(text):
    response_schemas = [
        ResponseSchema(name="Location", description="The mentioned location in the emergency"),
        ResponseSchema(name="Emergency Type", description="The type of emergency (e.g., Earthquake, Fire, Flood)"),
        ResponseSchema(name="Severity", description="The severity level (Mild, Moderate, Critical)"),
    ]

    output_parser = StructuredOutputParser.from_response_schemas(response_schemas)

    prompt = PromptTemplate(
        template="Extract the following information from the text:\n\n"
                 "{text}\n\n"
                 "Return the result in JSON format:\n{format_instructions}",
        input_variables=["text"],
        partial_variables={"format_instructions": output_parser.get_format_instructions()},
    )

    model = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        temperature=0,
        api_key=os.getenv("GEMINI_API_KEY")
    )
    structured_output = model.invoke(prompt.format(text=text))
    return output_parser.parse(structured_output.content)


@router.post("/process-audio/")
async def process_audio(file: UploadFile = File(...)):
    try:
        temp_audio_path = f"temp_{file.filename}"
        with open(temp_audio_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        transcript = transcribe_audio(temp_audio_path)
        extracted_info = extract_information(transcript)

        os.remove(temp_audio_path)

        return {
            "transcription": transcript,
            "location": extracted_info.get("Location", "Unknown"),
            "emergency Type": extracted_info.get("Emergency Type", "Unknown"),
            "severity": extracted_info.get("Severity", "Unknown"),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio file: {str(e)}")