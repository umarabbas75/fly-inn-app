"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const GoogleTranslate = () => {
  useEffect(() => {
    // Define the initialization function
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages:
              "en,es,fr,de,it,pt,zh-CN,zh-TW,ja,ko,ar,hi,ru,nl,pl,sv,tr,vi,th,id",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // Check if script already exists
    const existingScript = document.getElementById("google-translate-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If script exists, try to reinitialize
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
    }

    return () => {
      // Cleanup not needed as we want to keep the script loaded
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      className="google-translate-container"
    />
  );
};

export default GoogleTranslate;

