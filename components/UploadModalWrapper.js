"use client";

import UploadModal from "@/components/UploadModal";
import { DocumentListContextProvider } from "@/context/documentList";

const UploadModalWrapper = () => {
  return (
    <DocumentListContextProvider>
      <UploadModal />
    </DocumentListContextProvider>
  );
};
export default UploadModalWrapper;
