import React from "react";
import { SearchBar } from "./SearchBar";
import { Gallery } from "./Gallery";

const ContentContainer = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <SearchBar />
      <Gallery />
    </div>
  );
};

export { ContentContainer };
