from importlib import reload
from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import io
import base64
import json
from pdf2image import convert_from_bytes
from fastapi.responses import StreamingResponse
from typing import Generator


# Assuming these modules exist in your project
from utills.utills import get_extraction_prompt, extract_text_from_image_openai
from utills.blobservice import azure_blob_manager


# Initialize the FastAPI app
app = FastAPI()
router = APIRouter()

origins = ["*"]
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Replace with your Azure Blob Storage connection string and container name
AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=transcribedblobstorage;AccountKey=1Z7yKPP5DLbxnoHdh7NmHgwg3dFLaDiYHUELdid7dzfzR6/DvkZnnzpJ30lrXIMhtD5GYKo+71jP+AStC1TEvA==;EndpointSuffix=core.windows.net"
# CONTAINER_NAME = "akasa"
CONTAINER_NAME = "ai-rep-platform"

# @router.post("/extract-form-data")
# def extract_text_from_pdf( file: UploadFile = File(...)):
#     if file.content_type != "application/pdf":
#         raise HTTPException(status_code=400, detail="Invalid file type. Only PDFs are accepted.")
#     pdf_data = file.file.read()
#     try:
#         images = convert_from_bytes(pdf_data)
#         all_extracted_data = []
#         for idx, image in enumerate(images):
#             buffer = io.BytesIO()
#             image.save(buffer, format="JPEG")
#             buffer.seek(0)
#             image_name = f"{file.filename.split('.')[0]}_page_{idx + 1}.jpg"
#             print("images",image_name)
#             image_url = azure_blob_manager.upload_file(blob_name=image_name, file=buffer.getvalue())
            
#             # encoded_image = base64.b64encode(buffer.getvalue()).decode("utf-8")
#             prompt_object = get_extraction_prompt(idx)
#             page_prompt = prompt_object["prompt"]
#             print(idx,"page_prompt",page_prompt)

#             # extracted_text_openai = extract_text_from_image_openai(encoded_image, page_prompt)
#             extracted_text_openai = extract_text_from_image_openai(image_url, page_prompt)

#             extracted_text_openai = extracted_text_openai.replace("```", "").replace("```json", "").replace("json", "")
#             json_data = json.loads(extracted_text_openai)

#             all_extracted_data.append({"page": idx + 1, "url":image_url, "data": json_data})

#         return {"extracted_data": all_extracted_data}
    
#     except Exception as e:
#         print("errr----",e)
#         raise HTTPException(status_code=500, detail=f"An error occurred while processing the PDF: {str(e)}")

@router.post("/extract-form-data")
async def extract_text_from_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDFs are accepted.")
    
    pdf_data = file.file.read()
    
    try:
        images = convert_from_bytes(pdf_data)

        async def process_pages() -> Generator[bytes, None, None]:
            for idx, image in enumerate(images):
                buffer = io.BytesIO()
                image.save(buffer, format="JPEG")
                buffer.seek(0)

                image_name = f"{file.filename.split('.')[0]}_page_{idx + 1}.jpg"
                image_url = azure_blob_manager.upload_file(blob_name=image_name, file=buffer.getvalue())

                # Generate the prompt for this page
                prompt_object = get_extraction_prompt(idx)
                page_prompt = prompt_object["prompt"]

                # Extract text from the image
                extracted_text_openai = extract_text_from_image_openai(image_url, page_prompt)

                # Clean and parse the response
                extracted_text_openai = extracted_text_openai.replace("```", "").replace("```json", "").replace("json", "")
                json_data = json.loads(extracted_text_openai)

                # Yield the response for this page
                page_response = {
                    "page": idx + 1,
                    "url": image_url,
                    "data": json_data,
                }
                yield f"data: {json.dumps(page_response)}\n\n"

        # Use a StreamingResponse to send data as it's generated
        return StreamingResponse(process_pages(), media_type="text/event-stream")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the PDF: {str(e)}")

@app.get("/")
def base_function():
    return "hello world"

app.include_router(router)








if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7011)