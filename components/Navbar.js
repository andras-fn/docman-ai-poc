import AuthButton from "@/components/AuthButton";
import UploadModal from "@/components/UploadModal";
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
    <nav className="p-2 w-full flex justify-between items-center bg-[#242424] text-white">
      <div className="flex items-center gap-x-2">
        <Link href={`/`}>
          <div className="flex items-center gap-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 7.805 7.805"
              width="60"
              height="60"
            >
              <defs>
                <linearGradient
                  id="b"
                  x1="16.238"
                  x2="16.238"
                  y1="6.416"
                  y2="31.996"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#FFD600"></stop>
                  <stop offset="1" stopColor="#E74E0F"></stop>
                </linearGradient>
                <clipPath id="c">
                  <use width="100%" height="100%" xlinkHref="#a"></use>
                </clipPath>
                <linearGradient
                  id="d"
                  x1="16.34"
                  x2="16.34"
                  y1="6.362"
                  y2="32.042"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#FFD600"></stop>
                  <stop offset="1" stopColor="#E74E0F"></stop>
                </linearGradient>
                <path
                  id="a"
                  d="M16.2 20l7 12H31L16.2 6.4 1.5 32h7.8l6.9-12"
                ></path>
                <path id="e" d="M1.5 6.4h29.8v25.7H1.5z"></path>
              </defs>
              <g transform="translate(-.397 -1.38) scale(.26458)">
                <use
                  width="100%"
                  height="100%"
                  fill="url(#b)"
                  xlinkHref="#a"
                ></use>
                <g className="st3" clipPath="url(#c)">
                  <use
                    width="100%"
                    height="100%"
                    fill="url(#d)"
                    xlinkHref="#e"
                  ></use>
                </g>
              </g>
            </svg>
            <div className="text-[#81888c]">Docman AI</div>
          </div>
        </Link>
        {user ? <UploadModal /> : <></>}
      </div>
      <AuthButton />
    </nav>
  );
};
export default Navbar;
