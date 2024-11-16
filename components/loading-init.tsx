"use client";
import * as React from "react";
import { useContext, useState, useEffect } from "react";
import { PgliteContext, PgliteContextType } from "@/components/pglite-provider";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Progress } from "@/components/ui/progress";
export function LoadingInit({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const { pglite } = useContext(PgliteContext) as PgliteContextType;

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const dff = async () => {
      if (pglite) {
        const interval = setTimeout(() => {
          if (interval) {
            setIsReady(true);
            clearTimeout(interval);
          }
        }, 500);
        console.log("i pg suc");
      } else {
        console.log("no pg");
      }
    };
    dff();
  }, [pglite, isReady]);

  const [progress, setProgress] = useState(13);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isReady) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100 && interval) {
            clearInterval(interval); // 达到100%后停止计时器
            return 100;
          }
          return prevProgress + 5; // 每隔一定时间增加5%
        });
      }, 500);
    }

    return () => {
      if (interval) {
        clearInterval(interval); // 清除计时器以防止内存泄漏
      }
    };
  }, [isReady, progress]);

  return (
    <>
      <AlertDialog defaultOpen={true} open={!isReady}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <Progress value={progress} max={100} />
            </AlertDialogTitle>
            <AlertDialogDescription>loading</AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
