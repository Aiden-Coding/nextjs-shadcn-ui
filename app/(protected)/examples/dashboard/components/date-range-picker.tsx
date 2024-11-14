"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useContext, useState, useEffect } from "react";
import { PgliteContext, PgliteContextType } from "@/components/pglite-provider";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Progress } from "@/components/ui/progress";
export function CalendarDateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const { pglite } = useContext(PgliteContext) as PgliteContextType;

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const dff = async () => {
      if (pglite) {
        setIsReady(true);
        console.log("i pg suc");
        const d = await pglite.query("select 'Hello world' as message;");
        console.log("low");
        console.log(d.rows);
        const hel = "wewwwww";
        const d1 = await pglite.exec(`
            CREATE TABLE IF NOT EXISTS user_den (
              id SERIAL PRIMARY KEY,
              name TEXT,
              email TEXT
            );
            INSERT INTO user_den (name, email) VALUES ('Install PGlite from NPM', true);
            INSERT INTO user_den (name, email) VALUES ('${hel}', true);
          `);
        console.log(d1);

        // const d2 = await pglite.query("select * from  todo;");
        // console.log("low");
        // console.log(d2.rows);

        const de = await pglite.query("select * from  user_den;");
        console.log("low");
        console.log(de.rows);
      } else {
        console.log("no pg");
      }
    };
    dff();
  }, [pglite]);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: addDays(new Date(2023, 0, 20), 20),
  });

  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval); // 达到100%后停止计时器
          return 100;
        }
        return prevProgress + 5; // 每隔一定时间增加5%
      });
    }, 500);

    return () => clearInterval(interval); // 清除计时器以防止内存泄漏
  }, []);

  const [isOpen, setIsOpen] = useState(true);

  // 打开对话框的函数
  const openDialog = () => setIsOpen(true);

  // 关闭对话框的函数
  const closeDialog = () => setIsOpen(false);

  useEffect(() => {
    console.log(isOpen, progress, "Dial2og should be closed now");
    if (isOpen && progress >= 100) {
      console.log("Dialog should be closed now");
      closeDialog();
    }
    console.log("Dial2og should be closed now");
  }, [isOpen, progress]);
  return (
    <>
      {/* {!isReady ? (
        <AlertDialog defaultOpen={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <Progress value={progress} max={100} />
              </AlertDialogTitle>
              <AlertDialogDescription>loading</AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      ) : ( */}
      <div className={cn("grid gap-2", className)}>
        <AlertDialog defaultOpen={true} open={isOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <Progress value={progress} max={100} />
              </AlertDialogTitle>
              <AlertDialogDescription>loading</AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[260px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* )} */}
    </>
  );
}
