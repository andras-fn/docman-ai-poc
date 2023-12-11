"use client";

import { DocumentList } from "@/context/documentList";
import { useDocumentListContext } from "@/context/documentList";
import { useEffect } from "react";
import Link from "next/link";

import { createClient } from "@/utils/supabase/client";

const DocumentTable = () => {
  const supabase = createClient();

  const { docList, setDocList } = useDocumentListContext();

  useEffect(() => {
    const getDocumentData = async () => {
      const { data, error } = await supabase.from("documents").select("*");

      console.log({ data, error });

      setDocList(data);
      return { data, error };
    };
    getDocumentData();
  }, [docList]);

  return (
    <table className="w-2/4  border-collapse divide-y divide-gray-200 text-left">
      <thead className="">
        <tr className="">
          <th className="w-12 p-2">View</th>
          <th className="p-2">ID</th>
          <th className="p-2">Filename</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {docList &&
          docList.map((document) => (
            <tr key={document.id} id={document.id} className="hover:bg-gray-50">
              <td className="w-full p-2 flex justify-center items-center">
                <Link href={`/documents/${document.id}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </Link>
              </td>
              <td className="p-2">{document.id}</td>
              <td className="p-2">{document.doc_name}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
export default DocumentTable;
