import React, { useState, useCallback, createContext, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { ScrollArea } from "./scroll-area";

const modalVariants = cva("w-[90vw] h-full overflow-y-auto", {
  variants: {
    size: {
      small: "max-w-[500px] max-h-[400px]",
      mediumSmall: "max-w-[700px] max-h-[400px]",
      medium: "max-w-[800px] max-h-[600px]",
      large: "max-w-[1200px] max-h-[800px]",
      maxLarge:"max-w-[90vw] max-h-[90vh]"
    },
    color: {
      default: "bg-background",
      dark: "bg-gray-800 text-white",
      light: "bg-background",
      primary:"border border-[#CDCDCD] bg-[#F6F6F6]"
    },
  },
  defaultVariants: {
    size: "medium",
    color: "default",
  },
});

const ModalContext = createContext<(() => void) | undefined>(undefined);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a Modal');
  }
  return context;
};

interface ModalProps extends VariantProps<typeof modalVariants> {
  header: React.ReactNode;
  body: React.ReactNode;
  trigger: React.ReactNode;
  onClose?: () => void;
  searchParamToRemove?: string;
  handleExtraFunction? : () => void
}

const Modal: React.FC<ModalProps> = ({
  size,
  color,
  header,
  body,
  trigger,
  onClose,
  handleExtraFunction

}) => {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleOpenChange = (newOpen: boolean) => {
  
    if(newOpen && handleExtraFunction){
      handleExtraFunction()
    }
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  
  };



  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <ModalContext.Provider value={handleClose}>
        <DialogContent className={modalVariants({ size, color })}>
          <DialogHeader >
            <DialogTitle >{header}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <ScrollArea className="flex-grow border border-muted  bg-background rounded-md">
            <div className="mb-2">{body}</div>
          </ScrollArea>
        </DialogContent>
      </ModalContext.Provider>
    </Dialog>
  );
};

export default Modal;