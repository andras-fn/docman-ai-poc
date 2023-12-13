"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useRef } from "react";
import { createWorker } from "tesseract.js";

import { useDocumentListContext } from "@/context/documentList";

const UploadModal = () => {
  let aRef = useRef(null);
  const [file, setFile] = useState();
  const [filename, setFilename] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { docList, setDocList } = useDocumentListContext();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  // handle file select
  const handleFileSelected = (e) => {
    e.preventDefault();
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  // handle upload
  const handleUpload = async (e) => {
    console.log(e);
    e.preventDefault();
    console.log("file upload button has been clicked");
    setUploading(true);

    const timeNow = new Date();

    try {
      // call the ocr function and get the result
      // create ocr worker
      if (!file) {
        throw new Error("File is missing");
      }

      // ocr file
      const worker = await createWorker("eng");
      const ret = await worker.recognize(file);
      await worker.terminate();
      console.log(ret);
      const ocrResult = ret.data.text;
      console.log(ocrResult);

      const requestOptions = {
        method: "POST",
        body: JSON.stringify({
          letterContents: ocrResult,
          filename,
          timeStarted: timeNow,
        }),
        redirect: "follow",
      };

      const uploadReq = await fetch(`/api/upload`, requestOptions);
      const uploadRes = await uploadReq.json();

      setDocList([
        ...docList,
        {
          id: uploadRes.id,
          doc_name: filename,
        },
      ]);

      // reset the file upload
      console.log("resetting file state");
      aRef = null;

      // show an alert
      console.log("show success alert");

      alert("File successfully uploaded");
      closeModal();
      setFile(null);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Something went wrong uploading the file");
    }
  };

  return (
    <>
      <button
        className="flex flex-col items-center gap-x-1 p-2 text-sm text-white  hover:bg-neutral-700 bg-[#242424] rounded ml-2"
        type="button"
        onClick={openModal}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
        File Upload
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Upload a file
                  </Dialog.Title>

                  <form
                    className="mt-2 flex w-full flex-col gap-y-4"
                    onSubmit={handleUpload}
                  >
                    {uploading ? (
                      <div className="my-auto">Uploading...</div>
                    ) : (
                      <>
                        <div className="flex flex-col">
                          <label className="flex w-full cursor-pointer appearance-none flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-white p-4 transition hover:border-gray-400 focus:outline-none">
                            <svg
                              className="mx-auto mb-4 w-24 text-indigo-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <span className="text-lg font-medium text-gray-600">
                              Drop files to upload
                            </span>
                            <span className="font-medium text-gray-600">
                              or
                            </span>
                            <span className="mt-2 rounded bg-sky-500 p-2 text-white hover:bg-sky-700">
                              Select File
                            </span>

                            <input
                              type="file"
                              className="hidden"
                              name="file"
                              ref={aRef}
                              onChange={handleFileSelected}
                              accept="image/*"
                            />
                          </label>
                        </div>

                        <div className="mt-3 flex w-full justify-between rounded bg-sky-200 p-2">
                          {file ? (
                            <>
                              <span>{file.name}</span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log("delete button clicked");
                                  setFile(null);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="h-6 w-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <span>No file selected</span>
                          )}
                        </div>

                        <button
                          className="mt-2 w-full rounded bg-sky-500 p-3 text-white hover:bg-sky-700"
                          type="submit"
                        >
                          Upload Document
                        </button>
                      </>
                    )}
                  </form>
                  {/* <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
                    {messages.map((m) => (
                      <div key={m.id} className="whitespace-pre-wrap">
                        {m.role === "user" ? "User: " : "AI: "}
                        {m.content}
                      </div>
                    ))}

                    <form onSubmit={handleSubmit}>
                      <input
                        className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
                        value={input}
                        placeholder="Say something..."
                        onChange={handleInputChange}
                      />
                    </form>
                  </div> */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default UploadModal;
