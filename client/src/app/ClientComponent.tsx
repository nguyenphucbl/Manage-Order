"use client";

import React, { useEffect } from "react";
import envConfig from "../config";
export default function ClientComponent() {
  useEffect(() => {
    console.log(envConfig, "envConfig in ClientComponent");
  }, []);
  return <div>ClientComponent</div>;
}
