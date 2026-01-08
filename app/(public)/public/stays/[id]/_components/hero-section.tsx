import React, { useState, useEffect, useRef } from "react";
import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";

// BASE_IMAGE_URL is no longer needed

interface ImageItem {
  id?: number;
  url?: string;
  image?: string;
  description?: string;
  file_name?: string;
  sort_order?: number;
}

interface HeroImagesSectionProps {
  images?: ImageItem[];
}

export const HeroImagesSection = ({ images }: HeroImagesSectionProps) => {
  console.log({ images }); // You can keep this for debugging if needed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialSlideIndex, setInitialSlideIndex] = useState(0); // State to control initial slide in modal
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sort images by sort_order before mapping
  const sortedImages = images
    ? [...images].sort((a, b) => {
        const orderA = a.sort_order ?? 999;
        const orderB = b.sort_order ?? 999;
        return orderA - orderB;
      })
    : [];

  // Use the url property which contains the full URL
  const galleryImages = sortedImages.map((image: ImageItem) => ({
    original: image.url || image.image || "", // Prefer url, fallback to image
    thumbnail: image.url || image.image || "", // Prefer url, fallback to image
    description: image.description || "",
  }));

  const handleImageClick = (clickedIndex: number) => {
    setInitialSlideIndex(clickedIndex); // Set the index of the clicked image
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable body scroll when modal is open
  };

  const toggleModal = () => {
    setIsModalOpen((open) => !open);
    document.body.style.overflow = "auto"; // Re-enable body scroll when modal is closed
  };

  const renderSingleImageLayout = () => {
    if (!sortedImages || sortedImages.length === 0) return null;

    // Only 1 image - full width
    if (sortedImages.length === 1) {
      const image = sortedImages[0];
      return (
        <div className="grid grid-cols-1 gap-4 relative">
          <div className="h-[30vh] md:h-[50vh] lg:h-[60vh] relative">
            <img
              src={image?.url || image?.image || "/placeholder.jpg"}
              alt={image.description || `Property image 1`}
              className="object-cover w-full h-full rounded-lg cursor-pointer"
              onClick={() => handleImageClick(0)}
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
          </div>
        </div>
      );
    }

    // 2 images - side by side
    if (sortedImages.length === 2) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {sortedImages.map((image: ImageItem, index: number) => (
            <div
              key={image.id || index}
              className="h-[25vh] md:h-[40vh] relative"
            >
              <img
                src={image?.url || image?.image || "/placeholder.jpg"}
                alt={image.description || `Property image ${index + 1}`}
                className="object-cover w-full h-full rounded-lg cursor-pointer"
                onClick={() => handleImageClick(index)}
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
            </div>
          ))}
        </div>
      );
    }

    // 3 images - 1 large on left, 2 stacked on right
    if (sortedImages.length === 3) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="h-[30vh] md:h-[50vh] relative">
            <img
              src={
                sortedImages[0]?.url ||
                sortedImages[0]?.image ||
                "/placeholder.jpg"
              }
              alt={sortedImages[0]?.description || "Property image 1"}
              className="object-cover w-full h-full rounded-lg cursor-pointer"
              onClick={() => handleImageClick(0)}
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
          </div>
          <div className="grid grid-rows-2 gap-3 md:gap-4">
            {sortedImages.slice(1, 3).map((image: ImageItem, index: number) => (
              <div
                key={image.id || index}
                className="h-[14vh] md:h-[24vh] relative"
              >
                <img
                  src={image?.url || image?.image || "/placeholder.jpg"}
                  alt={image.description || `Property image ${index + 2}`}
                  className="object-cover w-full h-full rounded-lg cursor-pointer"
                  onClick={() => handleImageClick(index + 1)}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 4 images - 2x2 grid
    if (sortedImages.length === 4) {
      return (
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {sortedImages.map((image: ImageItem, index: number) => (
            <div
              key={image.id || index}
              className="h-[20vh] md:h-[30vh] relative"
            >
              <img
                src={image?.url || image?.image || "/placeholder.jpg"}
                alt={image.description || `Property image ${index + 1}`}
                className="object-cover w-full h-full rounded-lg cursor-pointer"
                onClick={() => handleImageClick(index)}
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderMultiImageGrid = () => {
    // This is the original logic for 5+ images, adapted
    if (!sortedImages || sortedImages.length < 5) return null; // Only for 5+ images

    if (windowSize.width < 640) {
      // Smallest screens: Show only the first image, with a "+X more" badge
      return (
        <div className="grid grid-cols-1 gap-4 px-4 relative">
          <div className="h-[30vh] relative">
            <img
              src={
                sortedImages[0]?.url ||
                sortedImages[0]?.image ||
                "/placeholder.jpg"
              }
              alt={sortedImages[0]?.description || `Gallery image 1`}
              className="object-cover w-full h-full rounded-lg cursor-pointer"
              onClick={() => handleImageClick(0)}
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
            {sortedImages.length > 1 && (
              <span
                onClick={() => handleImageClick(0)}
                className="text-gray-600 cursor-pointer !px-2 !text-[9px] md:!text-[11px] bg-white padding-[5px] rounded-[5px] font-semibold text-lg absolute right-2 bottom-2 z-10"
              >
                +{sortedImages.length - 1} more photos
              </span>
            )}
          </div>
        </div>
      );
    } else if (windowSize.width < 768) {
      // Small tablets - 2 columns for all available images (up to the full array)
      return (
        <div className="grid grid-cols-2 gap-3 px-4">
          {sortedImages.map((image: ImageItem, index: number) => (
            <div key={image.id || index} className="h-[25vh] relative">
              <img
                src={image?.url || image?.image || "/placeholder.jpg"}
                alt={image.description || `Gallery image ${index + 1}`}
                className="object-cover w-full h-full rounded-lg cursor-pointer"
                onClick={() => handleImageClick(index)}
                loading={index < 2 ? "eager" : "lazy"}
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
            </div>
          ))}
        </div>
      );
    } else {
      console.log("images logs", { sortedImages });
      // Desktop - featured image + 4 thumbnails (for 5+ images)
      return (
        <div className="grid grid-cols-1 gap-4 px-4 md:px-6 lg:px-0 md:grid-cols-2">
          <div className="h-full">
            {sortedImages[0] && (
              <img
                src={
                  sortedImages[0]?.url ||
                  sortedImages[0]?.image ||
                  "/placeholder.jpg"
                }
                alt={sortedImages[0]?.description || "Featured gallery image"}
                className="object-cover w-full h-full rounded-lg cursor-pointer"
                onClick={() => handleImageClick(0)}
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-rows-2 md:grid-cols-2 relative">
            {sortedImages.slice(1, 5).map((image: ImageItem, index: number) => (
              <div key={image.id || index + 1} className="h-full relative">
                <img
                  src={image?.url || image?.image || "/placeholder.jpg"}
                  alt={image.description || `Gallery thumbnail ${index + 2}`}
                  className="object-cover w-full h-full rounded-lg cursor-pointer"
                  onClick={() => handleImageClick(index + 1)}
                  loading={index < 2 ? "eager" : "lazy"}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                />
              </div>
            ))}
            {sortedImages.length > 5 && (
              <span
                onClick={() => handleImageClick(5)}
                className="text-gray-600 cursor-pointer px-2 !text-[11px] bg-white padding-[5px] rounded-[5px] font-semibold text-lg absolute right-2 bottom-4 z-10"
              >
                +{sortedImages.length - 5} more photos
              </span>
            )}
          </div>
        </div>
      );
    }
  };

  // Only render if there are images
  if (!sortedImages || sortedImages.length === 0) {
    return null;
  }

  // Decide which layout to render based on image count
  const renderLayout = () => {
    if (sortedImages.length >= 5) {
      return renderMultiImageGrid();
    } else {
      return renderSingleImageLayout();
    }
  };

  return (
    <div className="relative mt-6 hero-images-section">
      {/* Screen version - Dynamic Image Grid */}
      <div className="screen-only">{renderLayout()}</div>

      {/* Print version - Show only first image */}
      <div className="print-only">
        {sortedImages[0] && (
          <div>
            <img
              src={
                sortedImages[0]?.url ||
                sortedImages[0]?.image ||
                "/placeholder.jpg"
              }
              alt={sortedImages[0]?.description || "Property image"}
              className="print-hero-image rounded-lg"
              style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* Modal Gallery */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[9999999]">
          <button
            onClick={toggleModal}
            className="absolute z-50 flex items-center justify-center w-10 h-10 p-2 text-2xl font-bold text-white transition-all duration-200 bg-black bg-opacity-50 rounded-full top-4 right-4 hover:bg-opacity-70"
            aria-label="Close gallery"
          >
            &times;
          </button>
          <div className="p-20">
            {galleryImages && galleryImages.length > 0 && (
              <ImageGallery
                items={galleryImages}
                startIndex={initialSlideIndex} // Use the state variable here
                showPlayButton={false}
                showFullscreenButton={windowSize.width > 768}
                showNav={windowSize.width > 480}
                showBullets={windowSize.width <= 480}
                autoPlay={false}
                slideDuration={450}
                slideInterval={3000}
                additionalClass="image-gallery-custom h-full"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
