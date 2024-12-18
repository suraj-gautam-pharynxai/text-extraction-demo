from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Depends

import io
import base64
import json
from pdf2image import convert_from_bytes

# Assuming these modules exist in your project
from utills.utills import get_extraction_prompt, extract_text_from_image_openai
from utills.blobservice import AzureBlobManager


# Initialize the FastAPI app
app = FastAPI()
router = APIRouter()

@router.post("/extract-form-data")
def extract_text_from_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDFs are accepted.")

    # Read PDF file into memory
    pdf_data = file.file.read()

    try:
        # Convert PDF to images
        images = convert_from_bytes(pdf_data)

        all_extracted_data = []

        # Process each page's image to extract text
        for idx, image in enumerate(images):
            buffer = io.BytesIO()
            image.save(buffer, format="JPEG")
            buffer.seek(0)
            image_name = f"{file.filename.split('.')[0]}_page_{idx + 1}.jpg"

            image_url = AzureBlobManager.upload_file(blob_name=image_name, file=buffer.getvalue())

            encoded_image = base64.b64encode(buffer.getvalue()).decode("utf-8")
            prompt_object = get_extraction_prompt(idx)
            page_prompt = prompt_object["prompt"]
            print(idx, "page_prompt", page_prompt)

            extracted_text_openai = extract_text_from_image_openai(encoded_image, page_prompt)

            # Clean and parse the JSON response
            extracted_text_openai = extracted_text_openai.replace("```", "").replace("```json", "").replace("json", "")
            json_data = json.loads(extracted_text_openai)

            # Add JSON data to the result list
            all_extracted_data.append({"page": idx + 1, "url": image_url, "data": json_data})

        return {"extracted_data": all_extracted_data}

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the PDF: {str(e)}")

# Add router to the application
app.include_router(router)

# If running directly, include a command to run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)