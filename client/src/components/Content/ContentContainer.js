import React from "react";
import { CustomSearch } from "./SearchBar";
import { Gallery } from "./Gallery";

const ContentContainer = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <CustomSearch />
      <Gallery />
    </div>
  );
};

export { ContentContainer };
