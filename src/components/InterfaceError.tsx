import { Link } from "react-router-dom";
import pageNotFound from "../assets/images/404error.svg";

const InterfaceError = () => {
  // const error = useRouteError();

  return (
    <div className="w-full h-screen flex flex-col gap-5 items-center justify-center text-center">
      <div className="flex items-center justify-center">
        <img
          className="w-full sm:w-[550px] h-[400px] text-xs"
          src={pageNotFound}
          alt={"page not found img"}
        />
      </div>

      <h2 className="text-2xl">Oops! The page could not be found.</h2>
      <p className="text-sm">
        We couldn't find the page you're looking for. It might be removed or
        moved. Error code: 404.
      </p>

      <div className="text-sm">
        <span className="mr-1">Go back to</span>
        <Link className="text-[#41b497]" to={`${window?.location?.origin}`}>
          the start &rarr;
        </Link>
      </div>
    </div>
  );
};

export default InterfaceError;
