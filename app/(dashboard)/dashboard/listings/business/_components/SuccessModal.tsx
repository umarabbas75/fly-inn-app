"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

interface SuccessModalProps {
  open: boolean;
  message: string;
  onCTA: () => void;
  ctaTitle?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  message,
  onCTA,
  ctaTitle = "View My Businesses",
}) => {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCTA()}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <div className="text-center py-3">
            <CheckCircleOutlined className="text-4xl text-[#52c41a] mx-auto mb-3" />
            <DialogTitle className="text-sm font-medium text-gray-900 mb-2">
              Success
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-700">
              {message}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="primary"
            onClick={onCTA}
            className="bg-[#AF2322] hover:bg-[#9e1f1a] text-sm w-full"
          >
            {ctaTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
