import React, { useRef } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { Card, Button, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { Image as AntImage } from "antd";

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
}

interface ImageCardProps {
  image: ImageItem | any; // Accept ImageItem or react-images-uploading ImageType
  index: number;
  moveImage: (fromIndex: number, toIndex: number) => void;
  onDelete: (index: number, id?: string | number) => void;
  onDescriptionClick: (image: ImageItem | any, index: number) => void;
}

interface DragItem {
  index: number;
  type: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  index,
  moveImage,
  onDelete,
  onDescriptionClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  // Drop functionality
  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem,
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: "image",
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop: (item: DragItem) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      // Perform the move
      moveImage(dragIndex, hoverIndex);
    },
  });

  // Drag functionality
  const [{ isDragging }, drag, preview] = useDrag({
    type: "image",
    item: (): DragItem => ({ index, type: "image" }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Apply drop ref to the card container
  drop(ref);

  // Apply drag ref to the drag handle
  drag(dragHandleRef);

  // Apply preview to the whole card
  preview(ref);

  const getImageSrc = (image: ImageItem | any): string => {
    return image.data_url || image.url || image.image || image.file_name || "";
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Determine visual state
  const isActive = isOver && canDrop;

  return (
    <div
      ref={ref}
      className={`relative group transition-all duration-200 ${
        isDragging ? "opacity-40 scale-95" : "opacity-100 scale-100"
      } ${isActive ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
      onContextMenu={handleContextMenu}
    >
      <Card
        hoverable
        className={`h-48 overflow-hidden border-2 transition-colors ${
          isActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
        bodyStyle={{ padding: "8px" }}
      >
        {/* Drag Handle - Always visible at top left */}
        <div
          ref={dragHandleRef}
          className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing bg-white/90 hover:bg-white rounded p-1 shadow-sm transition-all"
        >
          <Tooltip title="Drag to reorder">
            <HolderOutlined className="text-gray-500 hover:text-gray-700 text-base" />
          </Tooltip>
        </div>

        {/* Image */}
        <div className="relative h-32 w-full overflow-hidden rounded-md bg-gray-100">
          <AntImage
            src={getImageSrc(image)}
            alt={image.name || `Property image ${index + 1}`}
            className="h-full w-full object-cover"
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            preview={{
              maskClassName: "rounded-md",
              mask: <span className="text-white text-xs">Preview</span>,
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Description Button */}
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onDescriptionClick(image, index)}
            className={`bg-white/90 hover:bg-white shadow-sm ${
              image.description ? "text-green-600" : "text-gray-600"
            }`}
          />

          {/* Delete Button */}
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => onDelete(index, image.id)}
            className="bg-white/90 hover:bg-white shadow-sm text-red-500 hover:text-red-600"
          />
        </div>

        {/* Image Order Badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
          #{index + 1}
        </div>

        {/* Image Info */}
        <div className="mt-2 px-1">
          {image.description && (
            <p className="text-xs text-green-600 truncate">
              {image.description}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ImageCard;
