"use client";

import { use } from "react";

const RoomPage = ({ params }) => {
  const p = use(params);
  console.log(p);
  return <p>{p.roomID}</p>;
};

export default RoomPage;
