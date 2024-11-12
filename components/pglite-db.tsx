import * as React from "react";
import { PGlite } from "@electric-sql/pglite";
export function PgliteDb() {
  React.useEffect(() => {
    let pglite = null;
    const pgliteFunc = () => {
      pglite = new PGlite("idb://my-pgdata");
    };
    pgliteFunc();
  }, []);
  return <></>;
}
