import AuthButton from "@/components/AuthButton";
import UploadModalWrapper from "@/components/UploadModalWrapper";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const Navbar = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // need to check for user and redirect if not present
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="p-2 w-full flex justify-between items-center">
      <div className="flex items-center gap-x-2">
        <Link href={`/`}>
          <div className="flex items-center gap-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path d="M680-320q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-440q0-17-11.5-28.5T680-480q-17 0-28.5 11.5T640-440q0 17 11.5 28.5T680-400ZM440-40v-116q0-21 10-39.5t28-29.5q32-19 67.5-31.5T618-275l62 75 62-75q37 6 72 18.5t67 31.5q18 11 28.5 29.5T920-156v116H440Zm79-80h123l-54-66q-18 5-35 13t-34 17v36Zm199 0h122v-36q-16-10-33-17.5T772-186l-54 66Zm-76 0Zm76 0Zm-518 0q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v200q-16-20-35-38t-45-24v-138H200v560h166q-3 11-4.5 22t-1.5 22v36H200Zm80-480h280q26-20 57-30t63-10v-40H280v80Zm0 160h200q0-21 4.5-41t12.5-39H280v80Zm0 160h138q11-9 23.5-16t25.5-13v-51H280v80Zm-80 80v-560 137-17 440Zm480-240Z" />
            </svg>
            <div className="font-semibold">Docman AI</div>
          </div>
        </Link>
        {user ? <UploadModalWrapper /> : <></>}
      </div>
      <AuthButton />
    </nav>
  );
};
export default Navbar;
