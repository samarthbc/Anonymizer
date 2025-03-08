from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import anonymizer
import os

app = FastAPI()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message":"anonymizer iz cookin..."
    }


@app.post("/input")
async def get_input(
    file: UploadFile = File(...)
):
    # Save the uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    
    df = pd.read_csv("uploads/"+file.filename)

    return {
        "message": "File received successfully",
        "file": df.to_csv(index=False)
    }


@app.post("/redactcol")
async def redact_col(
    file_name: str = Form(...),
    column: str = Form(...)
):
    df = pd.read_csv("uploads/"+file_name)
    df = anonymizer.supress_column(df, column)

    df.to_csv("uploads/"+file_name, index = False, mode="w")

    # TODO :  Add support for very large files
    return {"message": "Column redacted successfully", "file": df.to_csv(index=False)}


@app.post("/groupcol")
async def group_col(
    file_name: str = Form(...),
    column: str = Form(...)
):
    df = pd.read_csv("uploads/"+file_name)
    df = anonymizer.group_column(df, column)

    df.to_csv("uploads/"+file_name, index = False, mode="w")

    # TODO :  Add support for very large files
    return {"message": "Column redacted successfully", "file": df.to_csv(index=False)}


@app.post("/redactdate")
async def redact_date(
    file_name: str = Form(...),
    column: str = Form(...),
    redactDay: bool = Form(...),
    redactMonth: bool = Form(...),
    redactYear: bool = Form(...)
):
    df = pd.read_csv("uploads/"+file_name)
    df = anonymizer.anonymize_date(df, column, redactDay, redactMonth, redactYear)
    df.to_csv("uploads/"+file_name, index = False, mode="w")

    # TODO :  Add support for very large files
    return {"message": "Column redacted successfully", "file": df.to_csv(index=False)}


@app.post("/calculateK")
async def calculate_k(
    file_name: str = Form(...)
):
    try:
        df = pd.read_csv("uploads/"+file_name)
        k,_ = anonymizer.compute_k_anonymity(df)

        return {"k":k}
    except Exception as e:
        print(e)
        return {"k":e}
    
@app.post("/calculateIDiv")
async def calculate_iDiv(
    file_name: str = Form(...)
):
    df = pd.read_csv("uploads/"+file_name)
    idiv,entropies = anonymizer.calculate_i_diversity(df)

    return {"idiv":idiv, "entropies":entropies}

@app.post("/calculateMInvar")
async def calculate_mInvar(
    file_name: str = Form(...)
):
    df = pd.read_csv("uploads/"+file_name)
    m_value, is_m_invariant, min_required_m = anonymizer.calculate_m_invariance(df)

    return {"m_value":m_value,"is_m_invarient":is_m_invariant,"min_required_m":min_required_m}

@app.post("/redactzip")
async def redact_zip(
    file_name: str = Form(...),
    column: str = Form(...)
):
    df = pd.read_csv("uploads/"+file_name)
    df = anonymizer.redact_zipcode(df, column)
    df.to_csv("uploads/"+file_name, index = False, mode="w")

    # TODO :  Add support for very large files
    return {"message": "Column redacted successfully", "file": df.to_csv(index=False)}

@app.post("/synnumcol")
async def synthetic_numerical_column(
    file_name: str = Form(...),
    column: str = Form(...),
    lower: int = Form(...),
    upper: int = Form(...),
    datatype: str = Form(...)
):
    df = pd.read_csv("uploads/"+file_name)
    df = anonymizer.add_synthetic_numerical_column(df, column, lower, upper, datatype)
    df.to_csv("uploads/"+file_name, index = False, mode="w")

    # TODO :  Add support for very large files
    return {"message": "Column redacted successfully", "file": df.to_csv(index=False)}


@app.post("/syncatcol")
async def synthetic_categorical_column(
    file_name: str = Form(...),
    column: str = Form(...),
    string_list: list[str] = Form(...)
):
    df = pd.read_csv("uploads/"+file_name)
    df = anonymizer.add_synthetic_categorical_column(df, column, string_list)
    df.to_csv("uploads/"+file_name, index = False, mode="w")

    # TODO :  Add support for very large files
    return {"message": "Column redacted successfully", "file": df.to_csv(index=False)}










"""

Make sure to activate the venv
./venv_name/Scripts/activate

run
uvicorn api:app --host 127.0.0.1 --port 8000

"""