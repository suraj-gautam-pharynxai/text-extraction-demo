import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import ThumbnailViewer from "../components/ThumnailPdfViewer/Thumbnail.jsx";

interface ImageViewDialogProps {
  isOpen: boolean
  onClose: () => void
  file: any
  imageName: string
}

export function ImageViewDialog({ isOpen, onClose, file, imageName }: ImageViewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogTitle className="sr-only">{imageName}</DialogTitle>
        <div className="aspect-square w-full overflow-hidden rounded-lg">
        <ThumbnailViewer file={file} style = {true}/>

          {/* <img src={imageSrc} alt={imageName}  /> */}
        </div>
        <p className="mt-2 text-center text-sm font-medium">{imageName}</p>
      </DialogContent>
    </Dialog>
  )
}

