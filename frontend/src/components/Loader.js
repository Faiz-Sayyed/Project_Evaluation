import React from "react";
import { Spinner } from "@material-tailwind/react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center w-full h-80">
      <Spinner color="blue" className="h-12 w-12" />
    </div>
  );
};

export default Loader;
