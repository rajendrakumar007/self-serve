import { Link } from "react-router-dom";
import notFoundImg from "../../assets/notfound.svg";

const NotFound = () => {

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-bgBase">
      <div className="max-w-xl text-center">
        {/* IMAGE */}
        <img
          src={notFoundImg}
          alt="Page not found"
          className="mx-auto mb-6 w-64 md:w-72"
        />

        {/* TITLE */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-secondary">
          This page took an insurance break
        </h2>

        {/* DESCRIPTION */}
        <p className="text-secondary mb-8">
          Looks like the page you’re searching for isn’t covered under this
          policy. Let’s safely take you home.
        </p>

        {/* CTA */}
        <span className="inline-flex gap-2">
        <Link onClick={() => window.history.back()} className="inline-flex items-center py-2 px-6 rounded-lg
             bg-primary text-textInverted font-medium  border border-primary
             hover:bg-transparent hover:text-primary transition"
             > Back</Link>
        <Link
          to="/"
          className="inline-flex items-center px-6 rounded-lg
          bg-primary text-textInverted font-medium  border border-primary
          hover:bg-transparent hover:text-primary transition"
          
          >

          Back to Home
        </Link>
          </span>
      </div>
    </div>
  );
};

export default NotFound;
