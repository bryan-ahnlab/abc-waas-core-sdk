// src/hooks/useAbcWaas.ts

import React, { useContext } from "react";
import { AbcWaasContext } from "@/context/AbcWaasContext";

export function useAbcWaas() {
  const context = useContext(AbcWaasContext);

  if (!context) {
    throw new Error("Not found AbcWaasContext");
  }

  return context;
}
