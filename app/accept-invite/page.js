import Link from "next/link";

const page = ({ searchParams }) => {
  console.log(searchParams);

  if (searchParams.url) {
    return (
      <div className="container">
        <div className="flex flex-col items-center m-5">
          <Link
            href={searchParams.url}
            className="bg-sky-500 rounded p-2 text-white"
            prefetch={false}
          >
            Click here to set up account
          </Link>
        </div>
      </div>
    );
  } else {
    return <div className="container">URL parameter not provided...</div>;
  }
};
export default page;
