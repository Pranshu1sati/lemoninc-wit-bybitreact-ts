import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center space-y-4 justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg mt-2">Page Not Found</p>
      <Link
        className="inline-flex items-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
        to="/"
      >
        <svg
          className="size-5 rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
        <span className="text-sm font-medium"> Go Back </span>
      </Link>
    </div>
  );
};

export default NotFound;
