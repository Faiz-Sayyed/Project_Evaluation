import React from "react";

const FilterArea = ({ setFilter }) => {
  return (
    <form className="flex justify-between items-center px-20 lg:px-20 py-5 text-2xl bg-gray-200">
      <div className="w-full px-5 py-5 bg-gray-300 drop-shadow-lg rounded-lg">
        <div className="sm:flex justify-between w-full md:w-3/4 lg:w-1/2">
          <div>Filter:</div>

          <div className="flex items-center mt-3 sm:mt-0">
            <input
              type="radio"
              id="none"
              name="filter"
              onChange={(e) => setFilter(-1)}
            />
            <label htmlFor="none" className="ml-2 text-xl">
              All
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="marked"
              name="filter"
              onChange={(e) => setFilter(1)}
            />
            <label htmlFor="marked" className="ml-2 text-xl">
              Marked
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="notMarked"
              name="filter"
              onChange={(e) => setFilter(0)}
            />
            <label htmlFor="notMarked" className="ml-2 text-xl">
              Not Marked
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FilterArea;
