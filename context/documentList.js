"use client";

import { createContext, useContext, useState } from "react";

const DocumentListContext = createContext({});

export const DocumentListContextProvider = ({ children }) => {
  const [docList, setDocList] = useState([]);

  return (
    <DocumentListContext.Provider value={{ docList, setDocList }}>
      {children}
    </DocumentListContext.Provider>
  );
};

export const useDocumentListContext = () => useContext(DocumentListContext);
