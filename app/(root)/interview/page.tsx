import React from "react";
import Agent from "@/app/component/agent";
import { GetCurrentUser } from "@/lib/actions/auth.actions";

const page = async () => {
  const user = await GetCurrentUser();
  return (
    <>
      <h3>Interview Generation</h3>
      <Agent userName={user?.name || 'user'} userId={user?.id} type="generate"></Agent>
    </>
  );
};

export default page;
