import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { UploadOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Upload, Modal, Image, Spin, Button } from "antd";
import type { UploadProps, UploadFile } from "antd";

type ImageUploadProps = {
  value: string | File | null;
  setValue: (
    fieldName: string,
    value: File | string | null,
    options?: { shouldValidate: boolean }
  ) => void;
  fieldName: string;
  label: string;
  showRemoveButton?: boolean;
};

const compressLogoImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.5,
    useWebWorker: true,
    maxWidthOrHeight: 800,
    fileType: file.type,
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Logo compression error:", error);
    return file;
  }
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  setValue,
  fieldName,
  label,
  showRemoveButton = true,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [compressingLogo, setCompressingLogo] = useState(false);
  // Convert value to fileList format
  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        // URL string
        setFileList([
          {
            uid: "-1",
            name: fieldName,
            status: "done",
            url: value,
            thumbUrl: value,
          },
        ]);
      } else if (value instanceof File) {
        // File object
        const reader = new FileReader();
        reader.onloadend = () => {
          setFileList([
            {
              uid: "-1",
              name: value.name,
              status: "done",
              url: reader.result as string,
              thumbUrl: reader.result as string,
            },
          ]);
        };
        reader.readAsDataURL(value);
      }
    } else {
      setFileList([]);
    }
  }, [value]);

  const handleRemoveLogo = () => {
    setValue(fieldName, null, { shouldValidate: true });
    setFileList([]);
  };

  const processLogoFile = async (file: File) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type");
    }

    setCompressingLogo(true);

    try {
      let processedFile = file;

      if (file.size > 0.5 * 1024 * 1024) {
        processedFile = await compressLogoImage(file);
      }

      // Immediately update fileList with the processed file
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileList([
          {
            uid: "-1",
            name: processedFile.name,
            status: "done",
            url: reader.result as string,
            thumbUrl: reader.result as string,
          },
        ]);
      };
      reader.readAsDataURL(processedFile);

      // Set the processed file in form state
      setValue(fieldName, processedFile, { shouldValidate: true });
    } catch (error) {
      console.error("Error processing logo image:", error);
      throw error;
    } finally {
      setCompressingLogo(false);
    }
  };

  const uploadProps: UploadProps = {
    className: "w-full",
    name: fieldName,
    multiple: false,
    fileList: fileList,
    accept: "image/jpeg,image/png,image/webp,image/jpg",
    beforeUpload: async (file) => {
      try {
        await processLogoFile(file);
      } catch (error) {
        Modal.error({
          title: "Invalid File",
          content:
            "Only JPG, JPEG, PNG, and WEBP images are allowed for the image.",
        });
      }
      return false; // Prevent default upload
    },
    onRemove: () => {
      handleRemoveLogo();
      return true;
    },
    listType: "picture",
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
    itemRender: (originNode, file, fileList, actions) => {
      return (
        <div className="flex items-center mt-2 justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 hover:border-blue-300 transition-all duration-200">
          {/* Left side - Image and info */}
          <div className="flex items-center gap-3">
            <Image
              src={file.url || file.thumbUrl}
              alt={file.name}
              width={48}
              height={48}
              className="object-cover rounded-md"
              preview={{
                maskClassName: "rounded-md",
                mask: <span className="text-white text-xs">Preview</span>,
              }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                {file.name}
              </span>
              <div className="flex items-center gap-1 text-green-600">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs">Uploaded successfully</span>
              </div>
            </div>
          </div>

          {/* Right side - Action buttons */}
          {showRemoveButton && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => actions.remove()}
                className="bg-red-700 border-0 text-white rounded-full p-1.5 w-7 h-7 flex items-center justify-center shadow-sm hover:bg-red-600 hover:scale-110 transition-all duration-200"
                title="Remove Logo"
              >
                <DeleteOutlined className="text-xs" />
              </button>
            </div>
          )}
        </div>
      );
    },
  };

  return (
    <div className="flex flex-col gap-4">
      <Upload {...uploadProps} className="[&>div]:w-full">
        <Button
          type="primary"
          icon={<UploadOutlined />}
          className="w-full h-12 text-base font-medium"
        >
          <span className="text-sm">
            {fileList.length > 0 ? `Replace ${label}` : `Upload ${label}`}
          </span>
        </Button>
      </Upload>

      {/* Compression Modal */}
      <Modal
        open={compressingLogo}
        footer={null}
        closable={false}
        centered
        maskClosable={false}
        width={300}
      >
        <div className="flex flex-col items-center p-4">
          <Spin size="large" className="mb-4" />
          <h3 className="text-lg font-medium mb-1">Optimizing Image</h3>
          <p className="text-gray-600 text-center">
            Please wait while we process your image
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ImageUpload;
