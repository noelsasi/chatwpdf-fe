import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, Text, Spinner } from "@fluentui/react-components";
import {
  ChevronUp24Regular,
  ChevronDown24Regular,
  ZoomIn24Regular,
  ZoomOut24Regular,
} from "@fluentui/react-icons";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { usePDFViewerStyles } from "./pdfViewer.styled";
import { useChatStore } from "../../store/chatStore";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PDFViewer: React.FC = () => {
  const styles = usePDFViewerStyles();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [error, setError] = useState<string | null>(null);
  const { pdfInfo } = useChatStore();
  const { fileName, fileUrl } = pdfInfo;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    setError("Failed to load PDF. Please try again.");
  };

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => {
      const newPage = prevPageNumber + offset;
      return Math.min(Math.max(1, newPage), numPages);
    });
  };

  const changeScale = (delta: number) => {
    setScale((prevScale) => Math.min(Math.max(0.5, prevScale + delta), 2.0));
  };

  return (
    <div className={styles.pdfPanel}>
      <div className={styles.pdfHeader}>
        <Text className={styles.pdfTitle}>{fileName || "Document.pdf"}</Text>
        <div className={styles.pdfControls}>
          <Button
            appearance="subtle"
            icon={<ZoomOut24Regular />}
            onClick={() => changeScale(-0.1)}
            disabled={scale <= 0.5}
          />
          <Button
            appearance="subtle"
            icon={<ZoomIn24Regular />}
            onClick={() => changeScale(0.1)}
            disabled={scale >= 2.0}
          />
          <Button
            appearance="subtle"
            icon={<ChevronUp24Regular />}
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
          />
          <span className={styles.pageInfo}>
            {pageNumber} of {numPages}
          </span>
          <Button
            appearance="subtle"
            icon={<ChevronDown24Regular />}
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
          />
        </div>
      </div>
      <div className={styles.pdfContent}>
        {error ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <Text style={{ color: "red" }}>{error}</Text>
          </div>
        ) : (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            className={styles.pdfDocument}
            loading={<Spinner label="Loading PDF..." />}
            error={
              <div style={{ padding: "20px", textAlign: "center" }}>
                <Text>Failed to load PDF document.</Text>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              loading={<Spinner label="Loading page..." />}
            />
          </Document>
        )}
      </div>
    </div>
  );
};
