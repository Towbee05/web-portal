"use client";
import { useState } from "react";
import authApiAdapter from "@/lib/authApiAdapter.ts";

export default function Home() {
  const [error, setError] = useState(false);
  return (
    <>
      <h1> Who am I?? </h1>
    </>
  );
}
