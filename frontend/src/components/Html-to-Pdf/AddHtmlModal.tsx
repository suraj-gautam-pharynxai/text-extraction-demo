import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { BotService } from "@/services/botService";
import ButtonLoader from "../utils/ButtonLoader";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/model";
import { Label } from "@/components/ui/label";

let ModalHeader = () => {
  return (
    <div className="flex items-center justify-center border-b pb-1">
      <h3 className="text-2xl font-semibold">Add HTML to convert from</h3>
    </div>
  );
};

let ModalBody = () => {
  const [buttonLoader, setButtonLoader] = useState(false);

  return (
    <div className="rounded-xl w-full px-4">
      <div className="p-1 space-y-2">
        <h1 className="text-lg">url</h1>
      </div>

      <div className="">
        <Label htmlFor="url">Write the website URL</Label>
        <Input id="url" type="text" />
      </div>

      <div className="flex justify-end pt-4 space-x-2">
        <Button>
          {buttonLoader ? <ButtonLoader /> : "Add"}
        </Button>
      </div>
    </div>
  );
};

const AddHtmlMOdal = ({ trigger }) => {

  return (
    <Modal
      trigger={trigger}
      size={"mediumSmall"}
      header={<ModalHeader />}
      body={<ModalBody />
      }

    />
  );
};

export default AddHtmlMOdal;
