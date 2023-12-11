"use client";
import DocumentTable from "./DocumentTable";
import { DocumentListContextProvider } from "@/context/documentList";

const DocumentTableWrapper = () => {
  return (
    <DocumentListContextProvider>
      <DocumentTable />
    </DocumentListContextProvider>
  );
};
export default DocumentTableWrapper;
