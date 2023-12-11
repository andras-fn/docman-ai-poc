import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

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
    .from("document_data")
    .select("*")
    .eq("id", docId)
    .single();

  console.log({ data, error });

  if (data) {
    return (
      <div className="w-full max-h-full min-h-full flex divide-x h-full divide-slate-200">
        <div className="w-1/2 h-full flex flex-col items-center overflow-y-scroll divide-y divide-gray-200">
          <div className="w-full p-3">
            <h2 className="text-2xl pb-3 flex">
              Summary for:{" "}
              <p className="pl-2 text-slate-600">{data.doc_name}</p>
            </h2>
            <p>{data && data.doc_data.Summary}</p>
          </div>
          <div className="w-full p-3">
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
          </div>
        </div>

        {/* right hand side */}
        <div className="w-1/2 flex flex-col items-center h-full overflow-y-scroll">
          <div className="w-full p-3">
            <h2 className="text-2xl pb-3">Next Actions</h2>
            <ul className="w-full list-disc list-inside">
              {data.doc_data["Next Actions"].map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </div>
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
