import React from "react";
import { FiAlertTriangle, FiHome } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="mx-auto w-full max-w-2xl text-center">
        <div
          className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full border border-gray-200 bg-gray-50"
          aria-hidden="true"
        >
          <FiAlertTriangle className="size-6 text-gray-800" />
        </div>

        <p className="text-sm uppercase tracking-widest text-gray-500">
          Error 404
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 text-gray-600">
          Sorry, we couldn't find the page you're looking for. It may have been
          moved or deleted.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {/* <BackButton /> */}

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <FiHome className="mr-2 h-4 w-4" aria-hidden="true" />
            Go to homepage
          </a>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Tip: If you typed the URL directly, please make sure the spelling is
          correct.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
