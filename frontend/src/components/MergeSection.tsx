import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import OrganizePdfService from '../services/orgnizepdf';



export function MergeSection( {item} ) {
  console.log("item1s:" , item);
  
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  useEffect(()=>{
    setItems(item)
   },[item])

console.log("items::" ,items);

const createPdf = async () => {
  setIsLoading(true); // Set loading state to true before starting the process
  const pdfPayload = new FormData();

  // Collect files from items and append them to the FormData
  items.forEach((item) => {
    if (item.file) {
      pdfPayload.append("files", item.file);
    } else {
      console.error(`Item ${item.fileName} is missing the file property.`);
    }
  });

  try {
    // Call the service to get the PDF Blob
    const response = await OrganizePdfService(pdfPayload);
    console.log("PDF Created Successfully:", response.data);

    // Create a downloadable link for the PDF Blob
    const link = document.createElement("a");
    const url = window.URL.createObjectURL(response.data); // Create URL for Blob data
    link.href = url;
    link.download = "converted.pdf"; 

    toast.success("PDF Downloaded Successfully!"); 

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the DOM after download
  } catch (error) {
    console.error("Error Creating PDF:", error);
    toast.error("There was an error creating the PDF.");
  } finally {
    setIsLoading(false); // Reset loading state
    setItems([]); // Optionally clear the items array
  }
};

    

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-center text-primary">Merge PDF</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[calc(100%-8rem)] flex-col justify-between gap-4">
        {/* <div className="flex-1">{children}</div> */}
        <Button
          className="w-full bg-primary font-semibold hover:bg-primary/90"
          onClick={() => {
            if (items.length < 2) {
              toast.warn("Please add at least 2 files");
            } else {
              createPdf(); 
            }
          }}
                >
          Done
        </Button>
      </CardContent>
    </Card>
  )
}


