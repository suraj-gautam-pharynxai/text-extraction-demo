from fastapi import APIRouter, Path, HTTPException, UploadFile, File, Form
import os
import base64, json
from openai import OpenAI
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fpdf import FPDF
import pandas as pd


api_key = ""
client = OpenAI(api_key=api_key)


def save_text_to_pdf(text: str, pdf_file_path: str):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    for line in text.split("\n"):
        pdf.cell(200, 10, txt=line, ln=True)
    pdf.output(pdf_file_path)

def encode_image(image_path):
    print("image path", image_path)
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')



def flatten_json(nested_json):
    """Flatten a nested JSON to a flat dictionary."""
    flat_json = {}

    def flatten(obj, parent_key=""):
        if isinstance(obj, dict):
            for key, value in obj.items():
                flatten(value, parent_key + key + "_")  # Add parent key as prefix
        elif isinstance(obj, list):
            for idx, value in enumerate(obj):
                flatten(value, parent_key + str(idx) + "_")  # Add index for list items
        else:
            flat_json[parent_key[:-1]] = obj  # Remove the trailing "_"

    flatten(nested_json)
    return flat_json


def extract_text_from_image_openai(encoded_image: str, text:str):
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[  {
            "role": "system",
            "content": "You are a highly skilled data extraction expert. Carefully analyze the provided image of a pre-filled form and extract **every visible field and its corresponding value** with precision. Follow these instructions to ensure no information is missed:"
        },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": text},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{encoded_image}",
                            },
                        },
                    ],
                }
            ],
            max_tokens=1000,
        )
        
        if response.choices:
            return response.choices[0].message.content
        else:
            raise HTTPException(status_code=500, detail="Failed to extract text from image.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during API call: {str(e)}")

def get_extraction_prompt(index):
    prompts = [
        {
            "prompt": """
Carefully analyze the provided image of a pre-filled form and extract **every visible field and its corresponding value**. Follow these instructions to ensure no information is missed:

see in the Name of Borrower value do not include the words which is strikethrough or crossed out words

1. **Output Format**:
   - Return the data as a single, flat JSON object.
   - Each field (key) and its corresponding value should be presented as a key-value pair. Do not use nested JSON objects.

2. **Critical Fields (Mandatory)**:
   - Extract the following fields with absolute accuracy, regardless of their location on the form:
     - **SR. No.**
     - **D.O.**
     - **R.O.I.** (near "Financed Amount (a-b)")
     - **Period** (near "E.M.I. Amount")
     - **%**
   - These fields are essential and must be included in the output, even if they are less prominent or written in an unusual format.

3. **Other Fields**:
   - Extract all additional fields and their values, such as:
     - **Sales Executive Name**, **File No**, **Dealer Name**, **Engine No**, **PAN No**, **Address**, etc.
   - Do not skip any visible key-value pairs, whether printed, handwritten, or partially visible.

4. **Positional Awareness**:
   - Key-value pairs may appear at the top, sides, or bottom of the form.
   - Multiple key-value pairs may exist on a single line or across rows; ensure all are captured.

5. **Attention to Detail**:
   - Carefully check all areas of the form, even those that appear less prominent.
   - Verify the extraction of **critical fields** alongside all other visible fields.

6. **Extracting Non-Crossed-Out Values**:
   - selecting only the values that are **not crossed out** (i.e., text without any marks or lines striking through it). - - important: **Ignore any values that are visibly struck through with a pen or other markings.** Return the results in a structured format, such as:
Field Name: Extracted Value.

If a field contains multiple values and one is crossed out, only return the non-crossed-out value. If all values are crossed out, leave the field blank or indicate 'No valid entry.

7. **Output Requirement**:
   - Return only the JSON object with no additional text or comments.
   - Example JSON:
     {
         "SR. No.": "value",
         "D.O.": "value",
         "Sales Executive Name": "value",
         "Sales Executive Code": "value",
         "A.S.M / D.S.A": "value",
         "File No":"value",
         "Due Date": "value",
         "Cust Sign": "value",
         "Cost of Vehicle": "value",
         "Margin Money": "value",
         "Financed Amount (a-b)": "value",
         "R.O.I.": "value",
         "E.M.I Amount": "value",
         "Period": "value",
         "Advance EMI": "value",
         "F.C": "value",
         "Loan to vehicle Rs": "value",
         "%": "value",
         "Payment to Dealer": "value",
         "GST": "value",
         "Adv Int":"value",
         "Date": "03-12-2024",
         "Ch. No/NEFT": "NEFT17893",
         "Bank": "HDFC",
         "Dealer's Name": "value",
         "Dealer Code": "value",
         "Payment Receiver Name": "value",
         "Payment Receiver Code": "value",
         "Vehicle Colour": "value",
         "Engine No": "value",
         "Chasis No": "value",
         "Registration No":"value",
         "Name of the Borrower": "second value" 
         "Father's Name": "value",
         "Adhaar No": "value",
         "Address": "value",
         "Phone No": {
             "Res": "value",
             "Off": "value",
             "Mobile": "value",
             "Alt M": "value"
         },
         "PAN No":"value",
         "Cheque Received": "value",
         "Cheque Balance": "value"
     }

Ensure all fields, especially **SR. No.**, **D.O.**, **R.O.I.**, **Period**, and **%**, are extracted along with all other visible fields. Pay attention to fields that might be handwritten or located near key sections of the form.
""",
            "data": ["key1", "key2", "key3"]
        },
        {
            "prompt": """
Carefully analyze the provided image of a pre-filled form and extract **every visible field and its corresponding value**. Follow these instructions to ensure no information is missed:

note: Given a scanned or photographed form, identify and extract the values from the input fields. Ignore any values that are crossed out or marked as incorrect. Only select the values that are correctly filled and visible in the form. The crossed-out values should not be selected as they represent errors or deletions. Ensure that only the most recent, unaltered value in each field is chosen.

1. **Output Format**:
   - Return the data as a single, flat JSON object.
   - Each field (key) and its corresponding value should be presented as a key-value pair. Do not use nested JSON objects.

2. **Critical Fields (Mandatory)**:
   - Extract the following fields with absolute accuracy, regardless of their location on the form:
     - **SR. No.**
     - **D.O.**
     - **R.O.I.** (near "Financed Amount (a-b)")
     - **Period** (near "E.M.I. Amount")
     - **%**
   - These fields are essential and must be included in the output, even if they are less prominent or written in an unusual format.

3. **Other Fields**:
   - Extract all additional fields and their values, such as:
     - **Sales Executive Name**, **File No**, **Dealer Name**, **Engine No**, **PAN No**, **Address**, etc.
   - Do not skip any visible key-value pairs, whether printed, handwritten, or partially visible.

4. **Positional Awareness**:
   - Key-value pairs may appear at the top, sides, or bottom of the form.
   - Multiple key-value pairs may exist on a single line or across rows; ensure all are captured.

5. **Attention to Detail**:
   - Carefully check all areas of the form, even those that appear less prominent.
   - Verify the extraction of **critical fields** alongside all other visible fields.

6. **Extracting Non-Crossed-Out Values**:
   - selecting only the values that are **not crossed out** (i.e., text without any marks or lines striking through it). - - important: **Ignore any values that are visibly struck through with a pen or other markings.** Return the results in a structured format, such as:
Field Name: Extracted Value.

If a field contains multiple values and one is crossed out, only return the non-crossed-out value. If all values are crossed out, leave the field blank or indicate 'No valid entry.

Ensure all fields, especially **SR. No.**, **D.O.**, **R.O.I.**, **Period**, and **%**, are extracted along with all other visible fields. Pay attention to fields that might be handwritten or located near key sections of the form.
""",
            "data": ["key1", "key2", "key3"]
        },

        {
            "prompt": """
Carefully analyze the provided image of a pre-filled form and extract **every visible field and its corresponding value**. Follow these instructions to ensure no information is missed:

note: Given a scanned or photographed form, identify and extract the values from the input fields. Ignore any values that are crossed out or marked as incorrect. Only select the values that are correctly filled and visible in the form. The crossed-out values should not be selected as they represent errors or deletions. Ensure that only the most recent, unaltered value in each field is chosen.

1. **Output Format**:
   - Return the data as a single, flat JSON object.
   - Each field (key) and its corresponding value should be presented as a key-value pair. Do not use nested JSON objects.

2. **Critical Fields (Mandatory)**:
   - Extract the following fields with absolute accuracy, regardless of their location on the form:
     - **SR. No.**
     - **D.O.**
     - **R.O.I.** (near "Financed Amount (a-b)")
     - **Period** (near "E.M.I. Amount")
     - **%**
   - These fields are essential and must be included in the output, even if they are less prominent or written in an unusual format.

3. **Other Fields**:
   - Extract all additional fields and their values, such as:
     - **Sales Executive Name**, **File No**, **Dealer Name**, **Engine No**, **PAN No**, **Address**, etc.
   - Do not skip any visible key-value pairs, whether printed, handwritten, or partially visible.

4. **Positional Awareness**:
   - Key-value pairs may appear at the top, sides, or bottom of the form.
   - Multiple key-value pairs may exist on a single line or across rows; ensure all are captured.

5. **Attention to Detail**:
   - Carefully check all areas of the form, even those that appear less prominent.
   - Verify the extraction of **critical fields** alongside all other visible fields.

6. **Extracting Non-Crossed-Out Values**:
   - selecting only the values that are **not crossed out** (i.e., text without any marks or lines striking through it). - - important: **Ignore any values that are visibly struck through with a pen or other markings.** Return the results in a structured format, such as:
Field Name: Extracted Value.

If a field contains multiple values and one is crossed out, only return the non-crossed-out value. If all values are crossed out, leave the field blank or indicate 'No valid entry.

Ensure all fields, especially **SR. No.**, **D.O.**, **R.O.I.**, **Period**, and **%**, are extracted along with all other visible fields. Pay attention to fields that might be handwritten or located near key sections of the form.
""",
            "data": ["key1", "key2", "key3"]
        },
    ]
    # Default to a generic prompt if index exceeds the list length
    return prompts[index] if index < len(prompts) else {"prompt": "Generic prompt", "data": []}
