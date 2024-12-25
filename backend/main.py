from importlib import reload
import uvicorn
from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pdf2image import convert_from_bytes
from typing import Generator
from concurrent.futures import ThreadPoolExecutor
import io
import json
from utills.utills import get_extraction_prompt, extract_text_from_image_openai
from utills.blobservice import azure_blob_manager


# Initialize the FastAPI app
app = FastAPI()
router = APIRouter()

origins = ["*"]
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=transcribedblobstorage;AccountKey=1Z7yKPP5DLbxnoHdh7NmHgwg3dFLaDiYHUELdid7dzfzR6/DvkZnnzpJ30lrXIMhtD5GYKo+71jP+AStC1TEvA==;EndpointSuffix=core.windows.net"
CONTAINER_NAME = "ai-rep-platform"


def process_page(image, idx, file_name):
    """Process a single page of the PDF."""
    try:
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")
        buffer.seek(0)
        image_name = f"{file_name}_page_{idx + 1}.jpg"
        print("Processing image:", image_name)

        # Upload image to Azure Blob
        image_url = azure_blob_manager.upload_file(blob_name=image_name, file=buffer.getvalue())

        # Generate prompt for the page
        prompt_object = get_extraction_prompt(idx)
        page_prompt = prompt_object["prompt"]
        print(idx, "__________ Page prompt:", page_prompt)

        # Extract text using OpenAI
        extracted_text_openai = extract_text_from_image_openai(image_url, page_prompt)
        print(f"Extracted text for page {idx + 1}: {extracted_text_openai}")

    
        if(extracted_text_openai):
            extracted_text_openai = extracted_text_openai.replace("```", "").replace("```json", "").replace("json", "")
            json_data = json.loads(extracted_text_openai)
            return {"page": idx + 1, "url": image_url, "data": json_data}
        else:
            return {"page": idx + 1, "url": image_url, "data": "empty"}
    except Exception as e:
        print(f"Error processing page {idx + 1}: {e}")
        raise e

@router.post("/extract-form-data")
def extract_text_from_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDFs are accepted.")
    pdf_data = file.file.read()
    try:
        images = convert_from_bytes(pdf_data)
        file_name = file.filename.split('.')[0]
        all_extracted_data = []
        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = [
                executor.submit(process_page, image, idx, file_name)
                for idx, image in enumerate(images)
            ]
            for future in futures:
                all_extracted_data.append(future.result())
        return {"extracted_data": all_extracted_data}
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the PDF: {str(e)}")

@app.get("/")
def base_function():
    return "hello world"

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7011)
    
    
    
    
    

# if __name__ == '__main__':
#     uvicorn.run("main:app", host="0.0.0.0", port=6512, reload=True)