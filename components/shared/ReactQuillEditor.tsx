"use client";

import React, { useRef, useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamic import of Jodit to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  ),
});

interface ReactQuillEditorProps {
  name: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

const ReactQuillEditor: React.FC<ReactQuillEditorProps> = ({
  placeholder = "Start typing...",
  value,
  onChange,
  onBlur,
}) => {
  const editor = useRef(null);

  // Jodit configuration - memoized to prevent re-renders
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder,
      beautifyHTML: true,
      enter: "p" as const,
      toolbarAdaptive: false,
      useSearch: true,
      allowResizeX: true,
      allowResizeY: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: true,
      defaultActionOnPaste: "insert_as_html" as const,
      height: 300,
      minHeight: 200,
      // Clean toolbar - removing unnecessary buttons
      removeButtons: [
        "print",
        "font",
        "fontsize",
        "brush",
        "image",
        "file",
        "video",
        "about",
        "className",
        "paint",
        "lineHeight",
        "classSpan",
        "spellcheck",
        "copyformat",
        "ai-assistant",
        "ai-commands",
        "source",
        "dots",
        "link", // User doesn't want link
      ],
      // Row 1: Text formatting, lists, format block, superscript/subscript
      // Row 2: Speech, clipboard, hr, table, symbols, align, undo/redo, find, fullsize, preview
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "eraser",
        "|",
        "ul",
        "ol",
        "|",
        "paragraph",
        "|",
        "superscript",
        "subscript",
        "\n", // New row
        "speechRecognize",
        "|",
        "cut",
        "copy",
        "paste",
        "selectall",
        "|",
        "hr",
        "table",
        "symbols",
        "|",
        "left",
        "center",
        "right",
        "justify",
        "|",
        "outdent",
        "indent",
        "|",
        "undo",
        "redo",
        "|",
        "find",
        "|",
        "fullsize",
        "preview",
      ],
      buttonsMD: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "eraser",
        "|",
        "ul",
        "ol",
        "|",
        "paragraph",
        "|",
        "superscript",
        "subscript",
        "\n",
        "paste",
        "|",
        "hr",
        "table",
        "symbols",
        "|",
        "align",
        "|",
        "undo",
        "redo",
        "|",
        "fullsize",
      ],
      buttonsSM: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "symbols",
        "|",
        "align",
        "|",
        "undo",
        "redo",
      ],
      buttonsXS: ["bold", "italic", "|", "ul", "ol", "|", "undo", "redo"],
      defaultActionOnEnter: "enter",
      // Style configuration
      style: {
        font: "14px Arial, sans-serif",
      },
    }),
    [placeholder]
  );

  // Handle blur event - only update parent state on blur to prevent cursor jumping
  const handleBlur = (newContent: string) => {
    onChange?.(newContent);
    onBlur?.();
  };

  // Convert empty string to empty for Jodit
  const displayValue = value === undefined || value === null ? "" : value;

  return (
    <div className="jodit-editor-wrapper">
      <JoditEditor
        ref={editor}
      value={displayValue}
        config={config}
        tabIndex={1}
        onBlur={handleBlur}
      />
      <style jsx global>{`
        .jodit-editor-wrapper .jodit-container {
          border-radius: 8px;
          border-color: #d9d9d9;
        }
        .jodit-editor-wrapper .jodit-container:hover {
          border-color: #af2322;
        }
        .jodit-editor-wrapper .jodit-toolbar__box {
          background: #fafafa;
          border-bottom: 1px solid #d9d9d9;
        }
        .jodit-editor-wrapper .jodit-wysiwyg {
          padding: 12px;
          min-height: 150px;
        }
        .jodit-editor-wrapper .jodit-placeholder {
          padding: 12px;
        }
        .jodit-editor-wrapper .jodit-status-bar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ReactQuillEditor;
