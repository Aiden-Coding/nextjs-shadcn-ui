"use client";
import * as React from "react";
import { PGlite } from "@electric-sql/pglite";
export function PgliteDb() {
  React.useEffect(() => {
    let pglite = null;
    const pgliteFunc = async () => {
      pglite = new PGlite("idb://my-pgdata");
      const hel = await pglite.query("select 'Hello world' as message;");
      console.log(hel.rows);
    };
    pgliteFunc();
  }, []);
  return <></>;
}
