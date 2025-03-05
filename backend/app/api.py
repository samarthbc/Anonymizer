from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
async def root():
    return {
        "message":"anonymizer iz cookin..."
    }

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/input")
async def get_input(
    file: UploadFile = File(...),
    columns: str = Form(...),  # Comma-separated column names
    k: int = Form(...)
):
    # Save the uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    
    return {
        "message": "File received successfully",
        "columns_preserved": columns,
        "k_value": k
    }

"""

Make sure to activate the venv
./venv_name/Scripts/activate

run
uvicorn api:app --host 127.0.0.1 --port 8000

"""