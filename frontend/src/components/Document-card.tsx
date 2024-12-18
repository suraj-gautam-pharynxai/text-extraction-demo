import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Trash2, Eye } from 'lucide-react'
import { ImageViewDialog } from './ImageViewDialog'
import ThumbnailViewer from "../components/ThumnailPdfViewer/Thumbnail.jsx";

interface DocumentCardProps {
  id: string
  fileName: string
  file: any
  onDelete: (id: string) => void
}

export function DocumentCard({ id, fileName, file, onDelete }: DocumentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isImageViewOpen, setIsImageViewOpen] = useState(false)
          console.log("fileee:" , file) ;

  return (
    <>
      <Card 
        className="overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          <div className="relative aspect-[3/4]">
          {/* {console.log("fileee:" , file) */}
          
  <ThumbnailViewer file={file} />
          {/* <img src={thumbnail} alt={fileName} className="h-full w-full object-cover" /> */}
            <div 
              className={`absolute inset-0 bg-black transition-opacity duration-200 ${
                isHovered ? 'opacity-60' : 'opacity-0'
              }`}
            />
            <div className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <p className="text-sm font-medium text-white line-clamp-1">{fileName}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`absolute left-2 top-2 text-white transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => setIsImageViewOpen(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`absolute right-2 top-2 text-white transition-opacity duration-200 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDelete(id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
       <ImageViewDialog
        isOpen={isImageViewOpen}
        onClose={() => setIsImageViewOpen(false)}
        file={file}
        imageName={fileName}
      /> 
    </>
  )
}

