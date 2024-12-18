"use client"

import * as React from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DocumentCard } from "./Document-card"

interface Document {
  id: string
  fileName: string
  file: any
}

export function DocumentGrid({items}) {
  const [documents, setDocuments] = React.useState<Document[]>([

  ])
console.log("item", items);
console.log("doc", documents);


React.useEffect(()=>{
 setDocuments(items)
},[items])

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files
  //   if (files) {
  //     const newDocuments = Array.from(files).map((file, index) => ({
  //       id: `${documents.length + index + 1}`,
  //       fileName: file.fileName,
  //       thumbnail: "/placeholder.svg?height=400&width=300",
  //     }))
  //     setDocuments([...documents, ...newDocuments])
  //   }
  // }

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Uploaded Documents</h2>
        {/* <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button size="icon" className="rounded-full">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add document</span>
            </Button>
          </label>
        </div> */}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} {...doc} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}

