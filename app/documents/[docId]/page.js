import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Image from "next/image";
import exampleDoc from "./example-document.png";

const page = async ({ params: { docId } }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // need to check for user and redirect if not present
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // use doc id to fetch document detail
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", docId)
    .single();

  if (data) {
    return (
      <div className="w-full max-h-full min-h-full flex divide-x h-full divide-slate-200">
        <div className="w-2/3 h-full flex flex-col items-center divide-y divide-gray-200">
          <div className="h-10 bg-gray-300 w-full flex items-center p-2">
            <p className="font-semibold pr-2">Filename:</p> {data.doc_name}
          </div>
          <div className="relative w-full h-full overflow-y-scroll">
            <Image
              src={exampleDoc}
              alt="An example document"
              style={{ objectFit: "contain" }}
              fill={true}
            />
          </div>
        </div>

        {/* right hand side */}
        <div className="w-1/3 flex flex-col items-center h-full overflow-y-scroll divide-y divide-gray-200">
          <div className="w-full p-3">
            <h2 className="text-2xl pb-3 flex">Summary</h2>
            <p>{data && data.doc_data.Summary}</p>
          </div>
          <div className="w-full p-3">
            <h2 className="text-2xl pb-3 flex">Urgency</h2>
            <p>{data && data.doc_data.Urgency}</p>
          </div>
          <div className="w-full p-3">
            <h2 className="text-2xl pb-3 flex">Key Diagnosis</h2>
            <p>{data && data.doc_data["Key Diagnosis"]}</p>
          </div>
          <div className="w-full p-3">
            <h2 className="text-2xl pb-3 flex">New Medication</h2>
            <p>
              {data && data.doc_data["Any New Medication"].length > 0
                ? data.doc_data["Any New Medication"]
                : "None"}
            </p>
          </div>

          <div className="w-full p-3">
            <h2 className="text-2xl pb-3">Next Actions</h2>
            <ul className="w-full list-disc list-inside">
              {data.doc_data["Next Actions"].map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </div>
          {/* <div className="w-full p-3">
            <h2 className="text-2xl pb-3">Snomed Codes</h2>
            <table className="w-2/4  border-collapse divide-y divide-gray-200 text-left">
              <thead className="">
                <tr className="">
                  <th className="p-2">Code</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Attribute</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.doc_data["Snomed Codes and Attributes"].map((code, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-2">{code["Code"]}</td>
                    <td className="p-2">{code["Code Description"]}</td>
                    <td className="p-2">{code["Attribute"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full p-3 flex flex-col items-center">
        Document data not found
      </div>
    );
  }
};
export default page;
