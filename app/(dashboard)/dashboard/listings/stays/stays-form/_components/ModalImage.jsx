/* eslint-disable */
import React from "react";

export const ModalImage = (props) => {
  const {
    isModalOpen,
    closeModal,
    selectedImage,
    saveDescription,
    description,
    setDescription,
  } = props;

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
  };

  const handleSaveDescription = () => {
    if (selectedImage) {
      saveDescription();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#00000005",
        zIndex: selectedImage ? 1000 : 999999,
        alignItems: selectedImage && "center",
        top: selectedImage ? "0px" : "65px",
      }}
      onClick={() => {}}
      className="modal-overlay-custom"
    >
      <div
        style={{
          width: selectedImage ? "400px" : "auto",
          maxWidth: selectedImage && "80%",
          maxHeight: selectedImage ? "65vh" : "80vh", // Limiting the height of the modal body to 80% of the viewport height
          overflowY: "auto", // Allow scrolling if the content exceeds the height
        }}
        className="modal-content-custom"
      >
        <div
          className="modal-close-btn-custom"
          style={{ top: "-9px", right: "6px", fontSize: "30px" }}
          onClick={closeModal}
        >
          &times;
        </div>
        <div>
          {selectedImage ? (
            <>
              <img
                src={selectedImage.data_url}
                alt=""
                style={{
                  width: "100%", // Image takes full width of its container
                  height: "auto", // Auto-adjust height to maintain aspect ratio
                  objectFit: "contain", // Ensures the image doesn't overflow or distort
                }}
              />
              <form
                id="add-comment"
                className="add-comment custom-form"
                name="rangeCalc"
              >
                <fieldset>
                  <div className="list-single-main-item_content fl-wrap">
                    <textarea
                      cols={40}
                      rows={3}
                      placeholder="Write Your Description here:"
                      defaultValue={
                        selectedImage?.description || description || ""
                      }
                      onChange={handleDescriptionChange}
                    />
                  </div>
                </fieldset>
              </form>
            </>
          ) : (
            <img src={saveImage} alt="" />
          )}
        </div>

        {selectedImage && (
          <div
            className="list-single-main-item_content fl-wrap"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div className="logout_btn12" onClick={closeModal}>
              Close
            </div>
            <div
              className="logout_btn color2-bg"
              onClick={handleSaveDescription}
            >
              Save
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
