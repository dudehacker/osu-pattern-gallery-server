import * as React from "react";
import { Routes as RoutesContainer, Route } from "react-router-dom";
import App from "./App";
import { Authorize } from "./views/Authorize";

const Routes = () => {
  return (
    <RoutesContainer>
      <Route path="/" element={<App />} />
      <Route path="/callback" element={<Authorize />} />
    </RoutesContainer>
  );
};

export { Routes };
