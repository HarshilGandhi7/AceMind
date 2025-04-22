import React from "react";
import Agent from "@/app/component/agent";

const page = () => {
  return (
    <>
      <h3>Interview Generation</h3>
      <Agent userName="You" userId="user1" type="generate"></Agent>
    </>
  );
};

export default page;
