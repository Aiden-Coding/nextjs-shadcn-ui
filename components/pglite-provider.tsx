// app/context/ThemeContext.tsx (continued)
"use client";
import type { PGlite } from "@electric-sql/pglite";
import { PGlite as PgliteInstance } from "@electric-sql/pglite";
import React, {
  createContext,
  useMemo,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

// PgliteContextType
export interface PgliteContextType {
  pglite: PGlite | undefined;
  setPglite: Dispatch<SetStateAction<PGlite | undefined>>;
}

// 创建Context
export const PgliteContext = createContext<PgliteContextType | undefined>(undefined);

const getInitialPglite = () => {
  return new PgliteInstance("idb://my-pgdata1");
};
// PgliteProvider 组件
export function PgliteProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [pglite, setPglite] = useState<PGlite>();

  // 使用useMemo来避免在每次渲染时重新创建对象
  const value = useMemo(
    () => ({
      pglite,
      setPglite,
    }),
    [pglite]
  );

  useEffect(() => {
    const param = getInitialPglite();
    setPglite(param);
  }, []);

  return <PgliteContext.Provider value={value}>{children}</PgliteContext.Provider>;
}
