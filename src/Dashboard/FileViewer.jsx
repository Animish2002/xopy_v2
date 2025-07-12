import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Printer,
  FileText,
  Image,
  File,
  Eye,
  X,
  Maximize2,
  Minimize2,
  Settings,
  Palette,
  FileImage,
  Monitor,
} from "lucide-react";

const FileViewer = ({
  fileUrl,
  src,
  fileName,
  className = "",
  onContextMenu,
  style,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [fileType, setFileType] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [printSettings, setPrintSettings] = useState({
    colorMode: "color",
    paperSize: "A4",
    orientation: "portrait",
    printer: "default",
    quality: "high",
    copies: 1,
    margins: "normal",
  });
  const [availablePrinters, setAvailablePrinters] = useState([]);
  const [pdfPages, setPdfPages] = useState([]);
  const [docContent, setDocContent] = useState(null);

  const viewerRef = useRef(null);
  const printRef = useRef(null);
  const canvasRef = useRef(null);

  const source = fileUrl || src;

  // Detect file type from URL or filename
  const detectFileType = (url, filename) => {
    const extension = (filename || url || "").split(".").pop()?.toLowerCase();

    if (["pdf"].includes(extension)) return "pdf";
    if (["jpg", "jpeg", "png", "svg", "gif", "bmp", "webp"].includes(extension))
      return "image";
    if (["txt", "csv", "json", "xml", "log"].includes(extension)) return "text";
    if (["doc", "docx"].includes(extension)) return "document";
    if (["xls", "xlsx"].includes(extension)) return "spreadsheet";

    return "unknown";
  };

  // Add these functions inside your FileViewer component, before the loadFile function

  const processPDF = async (url) => {
    try {
      // Create a script element to load PDF.js
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      document.head.appendChild(script);

      // Wait for PDF.js to load
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
      });

      // Set worker source
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      // Load the PDF document
      const loadingTask = window.pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;

      const pages = [];
      const numPages = pdf.numPages;

      // Process each page - ALWAYS render as image to preserve formatting
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        // Extract text for search/copy functionality (but don't display)
        let pageText = "";
        try {
          const textContent = await page.getTextContent();
          const textItems = textContent.items;
          pageText = textItems
            .map((item) => item.str)
            .join(" ")
            .trim();
        } catch (textError) {
          console.warn(
            `Text extraction failed for page ${pageNum}:`,
            textError
          );
        }

        // Render page as image to preserve formatting
        try {
          const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;

          // Convert canvas to image data URL
          const imageDataUrl = canvas.toDataURL("image/png", 0.95); // High quality

          pages.push({
            pageNumber: pageNum,
            content: pageText, // Store text for search but don't display
            imageData: imageDataUrl,
            isImage: true, // Always treat as image to preserve formatting
            textContent: pageText, // Keep text separate for potential search functionality
          });
        } catch (renderError) {
          console.error(`Failed to render page ${pageNum}:`, renderError);
          pages.push({
            pageNumber: pageNum,
            content: `Page ${pageNum} - Failed to load content`,
            imageData: null,
            isImage: false,
          });
        }
      }

      setPdfPages(pages);
      setTotalPages(numPages);
      setCurrentPage(1);
      setFileContent("pdf-processed");
    } catch (error) {
      console.error("PDF processing error:", error);
      // Fallback: treat as a regular file that can be displayed in iframe
      setFileContent(url);
      setTotalPages(1);
      setCurrentPage(1);
    }
  };

  const processDocument = async (url) => {
    try {
      // Fetch the document
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const fileName = url.split("/").pop() || "document";
      const fileExtension = fileName.split(".").pop()?.toLowerCase();

      let extractedContent = {
        title: fileName,
        content: "Document content could not be extracted.",
      };

      if (fileExtension === "docx") {
        try {
          // Load mammoth.js for .docx files
          const mammoth = await import(
            "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js"
          );

          const result = await mammoth.extractRawText({ arrayBuffer });
          extractedContent = {
            title: fileName.replace(".docx", ""),
            content: result.value || "No text content found in the document.",
          };

          if (result.messages && result.messages.length > 0) {
            console.warn("Document processing warnings:", result.messages);
          }
        } catch (mammothError) {
          console.error("Mammoth.js error:", mammothError);
          extractedContent.content =
            "Failed to extract content from .docx file. The document may be corrupted or use unsupported features.";
        }
      } else if (fileExtension === "doc") {
        // .doc files are more complex and require server-side processing
        extractedContent.content =
          "Legacy .doc files require server-side processing for content extraction. Please convert to .docx format for better compatibility.";
      } else {
        // Try to handle as plain text
        try {
          const text = new TextDecoder("utf-8").decode(arrayBuffer);
          if (text && text.trim().length > 0) {
            extractedContent = {
              title: fileName,
              content: text,
            };
          }
        } catch (textError) {
          console.error("Text decoding error:", textError);
        }
      }

      setDocContent(extractedContent);
      setTotalPages(1);
      setFileContent("document-processed");
    } catch (error) {
      console.error("Document processing error:", error);
      throw new Error(`Failed to process document: ${error.message}`);
    }
  };

  // Get available printers (mock implementation - in real app would use navigator.bluetooth or print API)
  const getAvailablePrinters = async () => {
    // Mock printers - in real implementation you'd query system printers
    const mockPrinters = [
      { id: "default", name: "Default Printer", type: "inkjet" },
      { id: "hp_laserjet", name: "HP LaserJet Pro", type: "laser" },
      { id: "canon_pixma", name: "Canon PIXMA", type: "inkjet" },
      { id: "epson_workforce", name: "Epson WorkForce", type: "inkjet" },
      { id: "brother_laser", name: "Brother Laser", type: "laser" },
    ];
    setAvailablePrinters(mockPrinters);
  };

  useEffect(() => {
    getAvailablePrinters();
  }, []);

  useEffect(() => {
    if (!source) {
      setError("No file source provided");
      setLoading(false);
      return;
    }

    const type = detectFileType(source, fileName);
    setFileType(type);
    loadFile(source, type);
  }, [source, fileName]);

  const loadFile = async (url, type) => {
    try {
      setLoading(true);
      setError(null);

      switch (type) {
        case "text":
          const textResponse = await fetch(url);
          if (!textResponse.ok) throw new Error(`HTTP ${textResponse.status}`);
          const textContent = await textResponse.text();
          setFileContent(textContent);
          break;

        case "image":
          // Load image and create canvas representation
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            setFileContent(url);
            setTotalPages(1);
          };
          img.onerror = () => {
            throw new Error("Failed to load image");
          };
          img.src = url;
          break;

        case "pdf":
          // Mock PDF processing - in real app would use pdf-lib or similar
          await processPDF(url);
          break;

        case "document":
          // Mock document processing - in real app would use mammoth.js or similar
          await processDocument(url);
          break;

        default:
          setFileContent(url);
      }

      setLoading(false);
    } catch (err) {
      console.error("File loading error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handlePrint = () => {
    setShowPrintDialog(true);
  };

  const executePrint = () => {
    const printContent = generatePrintContent();
    const printWindow = window.open("", "_blank");

    const styles = generatePrintStyles();

    printWindow.document.write(`
      <html>
        <head>
          <title>Print - ${fileName || "Document"}</title>
          <style>${styles}</style>
        </head>
        <body>
          <div class="print-container">
            ${printContent}
          </div>
          <script>
            window.addEventListener('load', function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 1000);
            });
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    setShowPrintDialog(false);
  };

  const generatePrintStyles = () => {
    const { colorMode, paperSize, orientation, margins, quality } =
      printSettings;

    const paperSizes = {
      A4: { width: "210mm", height: "297mm" },
      Letter: { width: "8.5in", height: "11in" },
      Legal: { width: "8.5in", height: "14in" },
      A3: { width: "297mm", height: "420mm" },
    };

    const marginSizes = {
      none: "0",
      narrow: "0.5in",
      normal: "1in",
      wide: "1.5in",
    };

    const size = paperSizes[paperSize];
    const margin = marginSizes[margins];

    return `
      @page {
        size: ${size.width} ${size.height} ${orientation};
        margin: ${margin};
      }
      
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        ${colorMode === "grayscale" ? "filter: grayscale(100%);" : ""}
        ${
          colorMode === "blackwhite"
            ? "filter: contrast(200%) brightness(150%);"
            : ""
        }
      }
      
      .print-container {
        width: 100%;
        height: 100%;
        ${quality === "draft" ? "image-rendering: pixelated;" : ""}
        ${
          quality === "high"
            ? "image-rendering: -webkit-optimize-contrast;"
            : ""
        }
      }
      
      .page {
        page-break-after: always;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
      }
      
      .page:last-child {
        page-break-after: avoid;
      }
      
      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        ${rotation !== 0 ? `transform: rotate(${rotation}deg);` : ""}
      }
      
      .text-content {
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: monospace;
        font-size: 12px;
        line-height: 1.4;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
      }
      
      .pdf-page {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
      }
      
      .doc-content {
        width: 100%;
        padding: 20px;
        line-height: 1.6;
        font-size: 14px;
      }
      
      @media print {
        .print-container {
          ${colorMode === "blackwhite" ? "color: black !important;" : ""}
        }
      }
    `;
  };

  const generatePrintContent = () => {
    switch (fileType) {
      case "image":
        return `<div class="page"><img src="${fileContent}" alt="Document" /></div>`;

      case "text":
        const pages = Math.ceil(fileContent.length / 3000); // Rough page estimation
        let textPages = "";
        for (let i = 0; i < pages; i++) {
          const start = i * 3000;
          const end = Math.min((i + 1) * 3000, fileContent.length);
          const pageContent = fileContent.slice(start, end);
          textPages += `<div class="page"><div class="text-content">${pageContent}</div></div>`;
        }
        return textPages;

      case "pdf":
        return pdfPages
          .map(
            (page) =>
              `<div class="page"><div class="pdf-page">
            <h3>Page ${page.pageNumber}</h3>
            <div>${page.content}</div>
          </div></div>`
          )
          .join("");

      case "document":
        return `<div class="page"><div class="doc-content">
          <h1>${docContent?.title || "Document"}</h1>
          <div>${docContent?.content || "Document content"}</div>
        </div></div>`;

      default:
        return `<div class="page"><p>File: ${
          fileName || source
        }</p><p>Type: ${fileType}</p></div>`;
    }
  };

  const zoomIn = () => setScale(Math.min(3.0, scale + 0.2));
  const zoomOut = () => setScale(Math.max(0.3, scale - 0.2));
  const rotate = () => setRotation((rotation + 90) % 360);
  const resetView = () => {
    setScale(1.0);
    setRotation(0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderFileContent = () => {
    if (!fileContent) return null;

    const transformStyle = {
      transform: `scale(${scale}) rotate(${rotation}deg)`,
      transformOrigin: "center center",
      transition: "transform 0.2s ease-in-out",
    };

    switch (fileType) {
      case "image":
        return (
          <div className="flex justify-center items-center h-full">
            <img
              src={fileContent}
              alt="Document"
              style={transformStyle}
              className="max-w-full max-h-full object-contain"
              onError={() => setError("Failed to load image")}
            />
          </div>
        );

      case "text":
        return (
          <div className="p-4 h-full overflow-auto">
            <pre
              style={transformStyle}
              className="whitespace-pre-wrap text-sm font-mono bg-white p-4 rounded border"
            >
              {fileContent}
            </pre>
          </div>
        );

      case "pdf":
        const currentPdfPage = pdfPages[currentPage - 1];
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 flex justify-center items-center p-4">
              <div
                style={transformStyle}
                className="bg-white p-8 rounded shadow-lg max-w-full max-h-full overflow-auto"
              >
                <div className="text-gray-700 leading-relaxed">
                  {currentPdfPage?.content}
                </div>
              </div>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center p-4 bg-gray-100 border-t">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case "document":
        return (
          <div className="p-6 h-full overflow-auto">
            <div
              style={transformStyle}
              className="bg-white p-6 rounded shadow-lg max-w-4xl mx-auto"
            >
              <h1 className="text-2xl font-bold mb-6">{docContent?.title}</h1>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {docContent?.content}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Preview not available</p>
              <p className="text-sm text-gray-500">
                File: {fileName || source}
              </p>
              <p className="text-sm text-gray-500">Type: {fileType}</p>
            </div>
          </div>
        );
    }
  };

  const getFileIcon = () => {
    switch (fileType) {
      case "image":
        return <Image className="w-5 h-5" />;
      case "text":
        return <FileText className="w-5 h-5" />;
      case "pdf":
        return <FileImage className="w-5 h-5" />;
      case "document":
        return <FileText className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const PrintDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Print Settings</h3>
          <button
            onClick={() => setShowPrintDialog(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Printer</label>
            <select
              value={printSettings.printer}
              onChange={(e) =>
                setPrintSettings({ ...printSettings, printer: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              {availablePrinters.map((printer) => (
                <option key={printer.id} value={printer.id}>
                  {printer.name} ({printer.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Color Mode</label>
            <select
              value={printSettings.colorMode}
              onChange={(e) =>
                setPrintSettings({
                  ...printSettings,
                  colorMode: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="color">Color</option>
              <option value="grayscale">Grayscale</option>
              <option value="blackwhite">Black & White</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Paper Size</label>
            <select
              value={printSettings.paperSize}
              onChange={(e) =>
                setPrintSettings({
                  ...printSettings,
                  paperSize: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
              <option value="A3">A3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Orientation
            </label>
            <select
              value={printSettings.orientation}
              onChange={(e) =>
                setPrintSettings({
                  ...printSettings,
                  orientation: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quality</label>
            <select
              value={printSettings.quality}
              onChange={(e) =>
                setPrintSettings({ ...printSettings, quality: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="draft">Draft</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Margins</label>
            <select
              value={printSettings.margins}
              onChange={(e) =>
                setPrintSettings({ ...printSettings, margins: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="none">None</option>
              <option value="narrow">Narrow</option>
              <option value="normal">Normal</option>
              <option value="wide">Wide</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Copies</label>
            <input
              type="number"
              min="1"
              max="99"
              value={printSettings.copies}
              onChange={(e) =>
                setPrintSettings({
                  ...printSettings,
                  copies: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setShowPrintDialog(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={executePrint}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading file...</div>
          <div className="text-sm text-gray-500 mt-1">
            {fileName || "Document"}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg">
        <div className="text-center text-red-600">
          <X className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold">Error loading file</p>
          <p className="text-sm mt-2">{error}</p>
          <p className="text-xs mt-2 text-gray-500">
            File: {fileName || source}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={viewerRef}
        className={`file-viewer bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
        onContextMenu={onContextMenu}
        style={style}
      >
        {/* Header Controls */}
        <div className="flex items-center justify-between bg-gray-100 p-3 border-b">
          <div className="flex items-center space-x-3">
            {getFileIcon()}
            <div>
              <div className="font-medium text-sm">
                {fileName || "Document"}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {fileType} file {totalPages > 1 && `(${totalPages} pages)`}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm min-w-max px-2 py-1 bg-white rounded border">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <button
              onClick={rotate}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={resetView}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-xs"
              title="Reset View"
            >
              Reset
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Print with Options"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* File Content */}
        <div
          className="file-content bg-gray-50 overflow-auto"
          style={{ height: isFullscreen ? "100vh" : "600px" }}
        >
          {renderFileContent()}
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between bg-gray-100 p-2 border-t text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Scale: {Math.round(scale * 100)}%</span>
            <span>Rotation: {rotation}°</span>
            {totalPages > 1 && (
              <span>
                Page: {currentPage}/{totalPages}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-3 h-3" />
            <span>Enhanced File Viewer</span>
          </div>
        </div>
      </div>

      {showPrintDialog && <PrintDialog />}
    </>
  );
};

export default FileViewer;
