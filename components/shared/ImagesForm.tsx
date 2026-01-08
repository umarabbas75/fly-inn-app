import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Input, message, Image as AntImage, Spin, Button } from "antd";
import { UploadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ImageUploading, { ImageListType } from "react-images-uploading";
import imageCompression from "browser-image-compression";
import ImageCard from "@/app/(dashboard)/dashboard/listings/stays/stays-form/_components/ImageCard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FieldLabel } from "@/components/shared/FieldLabel";
const { TextArea } = Input;

// Type definitions for better type safety
interface ImageItem {
  id?: string | number;
  data_url?: string;
  image?: string;
  url?: string; // Full URL from backend
  file_name?: string;
  description?: string;
  sort_order?: number;
  order?: number; // Backend uses 'order' field
  uid?: string;
  name?: string;
  status?: "done" | "uploading" | "error";
  percent?: number;
  file?: File;
}

interface SelectedImage extends ImageItem {
  index: number;
}

interface ImagesFormProps {
  maxNumber?: number;
  fieldName?: string; // Field name in react-hook-form (default: "images")
  descriptionFieldName?: string; // Field name for descriptions (default: "imgdescription")
  deletedImagesFieldName?: string; // Field name for deleted images (default: "deleted_images")
  label?: string; // Custom label (default: "Property Images")
  required?: boolean; // Whether field is required
  showDescription?: boolean; // Whether to show description editing (default: true)
  minResolution?: { width: number; height: number }; // Minimum resolution requirement
  guidelines?: string[]; // Custom guidelines text
}

// Assume this is your base URL for images from S3
const IMAGE_BASE_URL = "https://s3.amazonaws.com/flyinn-app-bucket/";

export const ImagesForm: React.FC<ImagesFormProps> = ({
  maxNumber = 70,
  fieldName = "images",
  descriptionFieldName = "imgdescription",
  deletedImagesFieldName = "deleted_images",
  label = "Property Images",
  required = true,
  showDescription = true,
  minResolution = { width: 1024, height: 683 },
  guidelines,
}) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const images = watch(fieldName) || [];
  const imgdescription = watch(descriptionFieldName) || [];
  const deletedImages = watch(deletedImagesFieldName) || [];

  const [internalImages, setInternalImages] = useState<ImageItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [compressing, setCompressing] = useState(false);

  // Ref to track if we're updating the form internally
  const isInternalUpdate = useRef(false);

  // Effect to process incoming 'images' prop for existing images
  useEffect(() => {
    // Skip if this is an internal update
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    if (images && images.length > 0) {
      // Sort images by order field (backend uses 'order', we map to 'sort_order')
      // Handle both 'order' and 'sort_order' fields for compatibility
      const sortedImages = [...images].sort((a: any, b: any) => {
        const orderA = a.order ?? a.sort_order ?? 0;
        const orderB = b.order ?? b.sort_order ?? 0;
        return orderA - orderB;
      });

      const processedInitialImages = sortedImages.map((img: ImageItem) => {
        // Check if it's already in the react-images-uploading format (e.g., new upload)
        if (img.data_url) {
          return img;
        } else {
          // It's an existing image from the backend payload
          const fullImageUrl =
            img.url ||
            (img.image?.startsWith("http")
              ? img.image
              : img.image
              ? `${IMAGE_BASE_URL}${img.image}`
              : "");

          return {
            id: img.id,
            data_url: fullImageUrl,
            file: undefined,
            description: img.description || "",
            sort_order: img.order ?? img.sort_order ?? 0, // Map 'order' to 'sort_order'
            image: img.image,
            url: img.url,
            file_name: img.file_name,
          } as ImageItem;
        }
      });
      setInternalImages(processedInitialImages);
    }
  }, [images]);

  // Check image resolution
  const checkImageResolution = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const isValid =
          img.width >= minResolution.width &&
          img.height >= minResolution.height;
        resolve(isValid);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(false);
      };

      img.src = objectUrl;
    });
  };

  // Compression function with 0.5MB target
  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.5,
      useWebWorker: true,
      maxWidthOrHeight: 1920,
      fileType: file.type,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const finalFile = new File(
        [compressedFile],
        file.name || "compressed_image.jpeg",
        {
          type: compressedFile.type,
          lastModified: compressedFile.lastModified,
        }
      );
      return finalFile;
    } catch (error) {
      console.error("Compression error:", error);
      return file;
    }
  };

  const handleImageUploadChange = async (newImageList: ImageListType) => {
    try {
      setCompressing(true);
      const processedImages: ImageItem[] = [];

      for (const imageItem of newImageList) {
        if (imageItem.file) {
          let fileToProcess = imageItem.file;

          // Check file size limit (15MB)
          if (fileToProcess.size > 15 * 1024 * 1024) {
            message.error(
              `Image "${fileToProcess.name}" exceeds maximum file size of 15MB`
            );
            continue;
          }

          // Check image resolution
          const isValidResolution = await checkImageResolution(fileToProcess);
          if (!isValidResolution) {
            message.error(
              `Image "${fileToProcess.name}" does not meet minimum resolution requirement (${minResolution.width}×${minResolution.height} pixels)`
            );
            continue;
          }

          // Only compress if the file size is greater than 0.5MB
          if (fileToProcess.size > 0.5 * 1024 * 1024) {
            fileToProcess = await compressImage(imageItem.file);
          }

          // Convert the final File/Blob back to data_url for display
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(fileToProcess);
          });

          processedImages.push({
            data_url: dataUrl,
            file: fileToProcess,
            description: "",
            sort_order: processedImages.length,
          });
        } else {
          processedImages.push(imageItem as ImageItem);
        }
      }

      setInternalImages(processedImages);
      isInternalUpdate.current = true;
      setValue(fieldName, processedImages);
      if (showDescription) {
        setValue(
          descriptionFieldName,
          processedImages.map((img) => img.description || "")
        );
      }
      setCompressing(false);
    } catch (error) {
      console.error("Error in handleImageUploadChange:", error);
      setCompressing(false);
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...internalImages];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);

    updatedImages.forEach((img, index) => {
      img.sort_order = index;
    });

    setInternalImages(updatedImages);
    isInternalUpdate.current = true;
    setValue(fieldName, updatedImages);

    if (showDescription && imgdescription && Array.isArray(imgdescription)) {
      const updatedDescriptions = [...imgdescription];
      const [movedDescription] = updatedDescriptions.splice(fromIndex, 1);
      updatedDescriptions.splice(toIndex, 0, movedDescription || "");
      setValue(descriptionFieldName, updatedDescriptions);
    }
  };

  const handleDelete = (index: number, id?: string, imageItem?: any) => {
    const updatedImages = internalImages.filter((_, i) => i !== index);

    // Update sort_order for all remaining images after deletion
    updatedImages.forEach((img, idx) => {
      img.sort_order = idx;
    });

    setInternalImages(updatedImages);
    isInternalUpdate.current = true;
    setValue(fieldName, updatedImages);

    if (showDescription && imgdescription && Array.isArray(imgdescription)) {
      const updatedDescriptions = imgdescription.filter((_, i) => i !== index);
      setValue(descriptionFieldName, updatedDescriptions);
    }

    // Mark for deletion if it's an existing image
    if (!imageItem?.file && id) {
      setValue(deletedImagesFieldName, [...deletedImages, id]);
    }
  };

  const handleDescriptionClick = (image: ImageItem, index: number) => {
    setSelectedImage({ ...image, index });
    setDescription(image.description || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setDescription("");
  };

  const saveDescription = () => {
    if (selectedImage) {
      const updatedImages = [...internalImages];
      updatedImages[selectedImage.index] = {
        ...updatedImages[selectedImage.index],
        description: description,
      };
      setInternalImages(updatedImages);
      isInternalUpdate.current = true;
      setValue(fieldName, updatedImages);

      if (showDescription) {
        if (!Array.isArray(imgdescription)) {
          setValue(descriptionFieldName, []);
        } else {
          const updatedDescriptions = [...imgdescription];
          while (updatedDescriptions.length <= selectedImage.index) {
            updatedDescriptions.push("");
          }
          updatedDescriptions[selectedImage.index] = description;
          setValue(descriptionFieldName, updatedDescriptions);
        }
      }
    }
    closeModal();
  };

  const defaultGuidelines = guidelines || [
    "Recommended: 5-20 photos (JPEG, PNG, WEBP, JPG)",
    "Images over 0.5MB will be automatically optimized",
    "Maximum initial file size: 15MB",
    `Use photos with a minimum resolution of ${minResolution.width}×${minResolution.height} pixels`,
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
        <h2 className="flex items-center text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 text-black mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
          <FieldLabel label={label} required={required} />
        </h2>

        {/* Compression Loading Overlay */}
        {compressing && (
          <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-[500] p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center max-w-xs sm:max-w-sm mx-auto">
              <Spin size="large" className="mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-medium text-gray-800">
                Optimizing images...
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Please wait, this might take a moment.
              </p>
            </div>
          </div>
        )}

        <div className="mb-4 sm:mb-5 md:mb-6">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <div className="flex items-start">
              <InfoCircleOutlined className="text-primary/50 text-base sm:text-lg mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm text-primary/80 font-medium mb-1">
                  Image Guidelines
                </p>
                <ul className="text-[10px] sm:text-xs text-primary/70 space-y-0.5 sm:space-y-1">
                  {defaultGuidelines.map((guideline, idx) => (
                    <li key={idx}>• {guideline}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <ImageUploading
          multiple
          value={internalImages}
          onChange={handleImageUploadChange}
          maxNumber={maxNumber}
          dataURLKey="data_url"
          acceptType={["jpg", "jpeg", "png", "webp"]}
        >
          {({ imageList, onImageUpload, isDragging, dragProps }) => (
            <div className="upload__image-wrapper">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
                onClick={onImageUpload}
                {...dragProps}
              >
                <UploadOutlined className="text-2xl sm:text-3xl md:text-4xl text-gray-400 mb-2 sm:mb-3 md:mb-4" />
                <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                  {isDragging
                    ? "Drop images here"
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Drag and drop images to customize the gallery order
                </p>
                <div className="mt-3 sm:mt-4">
                  <Button
                    type="primary"
                    size="middle"
                    className="w-full sm:w-auto sm:!h-auto"
                  >
                    <span className="text-xs sm:text-sm">Select Images</span>
                  </Button>
                </div>
              </div>

              {/* Image Grid */}
              {imageList.length > 0 && (
                <div className="mt-4 sm:mt-5 md:mt-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">
                    Uploaded Images ({imageList.length})
                  </h3>
                  {/* Mobile: Horizontal Scroll Carousel */}
                  <div className="md:hidden">
                    <div className="scrollbar-hide mx-[-12px] flex items-stretch gap-2 overflow-x-auto px-3">
                      {imageList.map((image, index) => (
                        <div
                          key={image.id || index}
                          className="shrink-0 basis-[45%] min-w-[45%]"
                        >
                          <ImageCard
                            image={image}
                            index={index}
                            moveImage={moveImage}
                            onDelete={() =>
                              handleDelete(index, image.id, image)
                            }
                            onDescriptionClick={handleDescriptionClick}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Desktop: Grid Layout */}
                  <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                    {imageList.map((image, index) => (
                      <ImageCard
                        key={image.id || index}
                        image={image}
                        index={index}
                        moveImage={moveImage}
                        onDelete={() => handleDelete(index, image.id, image)}
                        onDescriptionClick={handleDescriptionClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ImageUploading>

        {/* Description Modal */}
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            if (!open) closeModal();
          }}
        >
          <DialogContent className="max-w-[500px] w-[90%] p-3 sm:p-6 [&>button]:hidden">
            <DialogHeader>
              <DialogTitle>Edit Image Description</DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <div className="space-y-3 sm:space-y-4">
                <div className="text-center">
                  <AntImage
                    src={selectedImage.data_url || selectedImage.image}
                    alt="Property"
                    width={200}
                    className="rounded-lg max-w-full h-auto"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Description
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="Write a description for this image..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                    showCount
                    className="text-xs sm:text-sm"
                  />
                </div>
              </div>
            )}
            <DialogFooter className="flex flex-row justify-end gap-2 mt-4">
              <Button onClick={closeModal}>Cancel</Button>
              <Button
                type="primary"
                onClick={saveDescription}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {errors?.[fieldName] && (
          <p className="text-red-500 text-xs sm:text-sm mt-2">
            <i className="fa fa-exclamation-circle mr-1"></i>
            {errors[fieldName]?.message?.toString()}
          </p>
        )}
      </div>
    </DndProvider>
  );
};

export default ImagesForm;
