import AuthButton from "@/components/AuthButton";
import UploadModal from "@/components/UploadModal";

const Navbar = () => {
  return (
    <nav className="p-2 w-full flex justify-between items-center">
      <div className="flex items-center gap-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
        <div className="font-semibold">Docman AI</div>
        <UploadModal />
      </div>
      <AuthButton />
    </nav>
  );
};
export default Navbar;
