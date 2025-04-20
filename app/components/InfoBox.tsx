import React from "react";

interface InfoBoxProps {
  message: string;
  type?: "error" | "info" | "success";
}

export default function InfoBox({ message, type = "info" }: InfoBoxProps) {
  let bg = "bg-blue-100 text-blue-800 border-blue-300";
  if (type === "error") bg = "bg-red-100 text-red-800 border-red-400";
  if (type === "success") bg = "bg-green-100 text-green-800 border-green-400";

  return (
    <div
      className={`w-full max-w-2xl mx-auto mb-4 px-4 py-3 border-l-4 rounded shadow ${bg}`}
      role={type === "error" ? "alert" : "status"}
      style={{ fontWeight: 500, fontSize: "1.05rem" }}
    >
      {message}
    </div>
  );
}
