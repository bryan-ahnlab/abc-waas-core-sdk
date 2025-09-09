// src/context/AbcWaasContext.ts

import React, { createContext } from "react";
import type { AbcWaasContextType } from "@/types/context";

export const AbcWaasContext = createContext<AbcWaasContextType | null>(null);
