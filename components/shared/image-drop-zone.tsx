import React, { useState, useCallback } from "react";
import { useDropzone, Accept } from "react-dropzone";
import Resizer from "react-image-file-resizer";
import { Modal, Input, Button, Typography } from "antd";
import { FiTrash2 as DeleteIcon, FiEdit as EditIcon } from "react-icons/fi";
import { FiUploadCloud } from "react-icons/fi";
const { Text } = Typography;

/* ---------- Types ---------- */

interface ImageObject {
  file: File | string; // File when first added, URL/string after upload if you store it
  description: string;
  originalSize?: string; // KB, already formatted
  resizedSize?: string; // KB, already formatted
}

interface SortableItemProps {
  imageObj: ImageObject;
  index: number;
  onDelete: (img: ImageObject) => void;
  onAddCaption: (idx: number) => void;
  onDragStart: (idx: number) => void;
  onDragEnter: (idx: number) => void;
  onDragEnd: () => void;
}

interface ImageDropzoneProps {
  imagesMultiple: ImageObject[];
  onChange: (images: ImageObject[], removedImage?: ImageObject) => void;
}

/* ---------- Sortable item ---------- */

const SortableItem: React.FC<SortableItemProps> = ({
  imageObj,
  index,
  onDelete,
  onAddCaption,
  onDragStart,
  onDragEnter,
  onDragEnd,
}) => (
  <div className="w-1/6 p-2">
    <div
      className="relative inline-block h-[230px] transition-transform duration-300 ease-in-out cursor-grab"
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
    >
      {imageObj.file && (
        <img
          src={
            typeof imageObj.file === "object"
              ? URL.createObjectURL(imageObj.file as File)
              : imageObj.file
          }
          alt="uploaded"
          className="w-[160px] h-[140px] object-cover"
        />
      )}

      {/* action bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-200 p-1.5 flex justify-between items-center">
        <button
          onClick={() => onAddCaption(index)}
          className={`w-7 h-7 flex items-center justify-center rounded text-white ${
            imageObj.description ? "bg-green-600" : "bg-blue-500"
          }`}
        >
          <EditIcon size={14} />
        </button>

        <button
          onClick={() => onDelete(imageObj)}
          className="w-7 h-7 flex items-center justify-center rounded bg-red-600 text-white"
        >
          <DeleteIcon size={14} />
        </button>
      </div>

      <p className="text-center text-sm mt-1">
        Description: {imageObj.description}
      </p>
    </div>
  </div>
);

/* ---------- Main component ---------- */

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  imagesMultiple,
  onChange,
}) => {
  /* ----- local state ----- */
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalError, setIsModalError] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  /* ----- helpers ----- */
  const blobToFile = (blob: Blob, fileName: string): File =>
    new File([blob], fileName, { type: blob.type });

  const resizeImage = (file: File): Promise<File> =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        800,
        800,
        "JPEG",
        50,
        0,
        (uri) => resolve(blobToFile(uri as Blob, file.name)),
        "blob"
      );
    });

  /* ----- drop handler ----- */
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const invalidFiles: { name: string; error: string }[] = [];
      const validImages: File[] = [];

      await Promise.all(
        acceptedFiles.map(async (file) => {
          const fileSizeInMB = file.size / (1024 * 1024);

          if (fileSizeInMB > 4) {
            invalidFiles.push({
              name: file.name,
              error: "File size exceeds 4 MB",
            });
            return;
          }

          const img = new Image();
          const fileURL = URL.createObjectURL(file);
          img.src = fileURL;

          await new Promise<void>((res) => {
            img.onload = () => {
              if (img.width < 1440 || img.height < 900) {
                invalidFiles.push({
                  name: file.name,
                  error: "Image dimensions are too small",
                });
              } else {
                validImages.push(file);
              }
              res();
            };
          });
        })
      );

      if (invalidFiles.length > 0) {
        setMessage("Your image size is smaller than 1440 × 900 px.");
        setIsModalError(true);
      }

      const newImages: (ImageObject | null)[] = await Promise.all(
        validImages.map(async (file) => {
          const resized = await resizeImage(file);
          if (!(resized instanceof File)) return null;

          return {
            file,
            description: "-----",
            originalSize: (file.size / 1024).toFixed(2),
            resizedSize: (resized.size / 1024).toFixed(2),
          };
        })
      );

      onChange([
        ...(imagesMultiple || []),
        ...(newImages.filter(Boolean) as ImageObject[]),
      ]);
    },
    [imagesMultiple, onChange]
  );

  /* ----- dropzone ---- */
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] } as Accept,
    noClick: true,
    multiple: true,
  });

  /* ----- drag-and-drop reorder ----- */
  const handleDragStart = (idx: number) => setDraggedIndex(idx);

  const handleDragEnter = (idx: number) => {
    if (draggedIndex !== null && draggedIndex !== idx) {
      const updated = [...imagesMultiple];
      const [draggedItem] = updated.splice(draggedIndex, 1);
      updated.splice(idx, 0, draggedItem);
      setDraggedIndex(idx);
      onChange(updated);
    }
  };

  const handleDragEnd = () => setDraggedIndex(null);

  /* ----- CRUD on images ----- */
  const handleDelete = (img: ImageObject) => {
    const updated = imagesMultiple.filter((i) => i !== img);
    onChange(updated, img);
  };

  const handleAddCaption = (idx: number) => {
    setCurrentIndex(idx);
    setIsModalOpen(true);
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = imagesMultiple.map((img, idx) =>
      idx === currentIndex ? { ...img, description: e.target.value } : img
    );
    onChange(updated);
  };

  const handleSaveCaption = () => {
    setIsModalOpen(false);
    setCurrentIndex(null);
  };

  /* ---------- JSX ---------- */
  return (
    <>
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className="h-[200px] flex items-center flex-col justify-center border-2 border-dashed border-gray-400 bg-gray-100 p-6 rounded-md text-center cursor-pointer"
        onClick={open}
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="text-4xl text-gray-500 mb-2" />
        <p className="text-sm text-gray-600">
          PLEASE BE PATIENT WHILE YOUR PHOTOS UPLOAD :) <br />
          Drag and drop the images to customise the gallery order.
          <br />
          (Minimum size 1440×900 px, Maximum size 4 MB)
        </p>
      </div>

      {/* Thumbnails */}
      {imagesMultiple?.length > 0 && (
        <div className="max-h-[400px] overflow-auto border border-gray-300 mt-4 p-4">
          <div className="flex flex-wrap -m-2">
            {imagesMultiple.map((imgObj, idx) => (
              <SortableItem
                key={idx}
                index={idx}
                imageObj={imgObj}
                onDelete={handleDelete}
                onAddCaption={handleAddCaption}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        </div>
      )}

      {/* Caption modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="save" type="primary" onClick={handleSaveCaption}>
            Save
          </Button>,
        ]}
      >
        <Input
          placeholder="Add Caption"
          value={
            currentIndex !== null
              ? imagesMultiple[currentIndex]?.description
              : ""
          }
          onChange={handleCaptionChange}
        />
      </Modal>

      {/* Error modal */}
      <Modal
        open={isModalError}
        onCancel={() => setIsModalError(false)}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => setIsModalError(false)}
          >
            Okay
          </Button>,
        ]}
      >
        <Text>{message}</Text>
      </Modal>
    </>
  );
};

export default ImageDropzone;
