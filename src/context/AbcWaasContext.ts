// src/context/AbcWaasContext.ts

import React, { createContext } from "react";
import type { AbcWaasContextType } from "@/types/config";

export const AbcWaasContext = createContext<AbcWaasContextType | null>(null);
