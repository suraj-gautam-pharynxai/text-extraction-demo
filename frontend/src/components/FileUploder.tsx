'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FolderIcon } from 'lucide-react'
import imageupload from "@/assets/OBJECTS.jpg"

export default function PDFUpload( {heading , subheading ,files,setFiles} ) {
console.log("files:" , files);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  })

  return (
    <div className="w-full  ">
      <Card className=" border rounded-lg w-full py-16">
        <div className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-semibold">{heading}</h2>
              <p className="text-sm text-muted-foreground">
                {subheading}
              </p>
            </div>

            <div
              {...getRootProps()}
              className={`
                min-h-[200px] 
                rounded-lg 
                border-4 
                border-dashed 
                border-gray-300 
                transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : ''}
                flex 
                flex-col 
                items-center 
                justify-center 
                p-8 
                space-y-4
                cursor-pointer
                mx-auto
                w-full
                max-w-xl
              `}
            >
              <input {...getInputProps()} />
              <img src= {imageupload} alt="" />
              {/* <FolderIcon className="h-12 w-12 text-gray-400" /> */}
              <p className="text-sm text-muted-foreground text-center">
                {isDragActive
                  ? "Drop the PDF files here"
                  : "Drag or Drop A File here"}
              </p>
              <p className="text-sm text-muted-foreground">Or</p>
              <Button 
                variant="outline" 
              >
                Upload PDF files
              </Button>
            </div>

            {files.length > 0 && (
              <div className="mt-6 text-center">
                <h3 className="text-sm font-medium mb-3">Selected Files:</h3>
                <ul className="space-y-2 inline-block text-left">
                  {files.map((file) => (
                    <li 
                      key={file.name}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <FolderIcon className="h-4 w-4" />
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  )
}

