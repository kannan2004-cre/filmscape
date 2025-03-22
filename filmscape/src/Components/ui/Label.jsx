import React from "react";

export function Label({ children, className = "" }) {
  return <label className={`block font-semibold ${className}`}>{children}</label>;
}
