"use client";

import {
  Attendance,
  AttendanceDetail,
  createSchedule,
  deleteSchedule,
  overallAttendanceDetail,
  scheduleFromNow,
  scheduleOnDate,
  updateSchedule,
  type Schedule,
  type ScheduleWithId,
} from "@/lib/data";
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
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Clock, Info, ListMinus, ListX, Plus, Undo2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";
import Loading from "@/app/loading";
import { formatInTimeZone } from "date-fns-tz";

export default function ViewSchedule({ row }: {
  row: (ScheduleWithId & { attendance: Attendance[] })[]
}) {
  const today = new Date();

  const booked = row.map(({ date }) => date);

  const [date, setDate] = useState<Date | undefined>(undefined);

  const [isPending, startTransition] = useTransition();

  const [attendace, setAttendance] = useState<(Schedule & AttendanceDetail)[]>([]);

  useEffect(() => {
    const fetchAttendance = () => {
      if (!date) setAttendance([])
      else startTransition(async () => {
        const schedule = await scheduleOnDate(date);

        setAttendance(
          await Promise.all(schedule.map(async ({ id, date, start, end, description }) => {
            const { present, absent, late, undecided } = await overallAttendanceDetail(id);

            return {
              date,
              start: start || undefined,
              end: end || undefined,
              description: description || undefined,
              present,
              absent,
              late,
              undecided,
            };
          }))
        );
      })
    }

    fetchAttendance();
  }, [date]);

  return (
    <>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={{ before: today }}
        today={today}
        modifiers={{ booked }}
        modifiersClassNames={{ booked: "my-booked-class" }}
        className="rounded-md border"
      />
      {date ?
      (isPending ?
      <div className="h-[400px] flex items-center">
        <Loading />
      </div> :
      <div className="w-full flex flex-col gap-y-4 text-slate-500">
        <div
          className="flex justify-end px-2"
        >
          <button
            onClick={() => setDate(undefined)}
          >
            <Undo2 />
          </button>
        </div>
        {attendace.map(({ start, end, description, present, absent, late, undecided }, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-y-2 p-2 border rounded-md"
          >
            {(start || end) &&
            <div
              className="flex items-center gap-x-1"
            >
              <Clock className="w-4 h-4 mx-1" />
              {start &&
              <span>
                {formatInTimeZone(start, "Asia/Tokyo", "HH:mm")}
              </span>}
              <span>-</span>
              {end &&
              <span>
                {formatInTimeZone(end, "Asia/Tokyo", "HH:mm")}
              </span>}
            </div>}
            {description &&
            <div
              className="flex items-center gap-x-1"
            >
              <Info className="shrink-0 w-4 h-4 mx-1" />
              <span>{description}</span>
            </div>}
            {present.length > 0 &&
            <div className="flex items-center gap-x-1">
              <div
                className="px-1 rounded text-sm text-nowrap bg-green-500 text-white"
              >出席</div>
              <div
                className="flex flex-wrap gap-2"
              >
                {present.map(({ name, picture }, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-x-2 text-slate-800"
                  >
                    <Avatar>
                      <AvatarImage src={picture} alt="avatar" />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>}
            {absent.length > 0 &&
            <div className="flex items-center gap-x-1">
              <div
                className="px-1 rounded text-sm text-nowrap bg-red-500 text-white"
              >欠席</div>
              <div
                className="flex flex-wrap gap-2"
              >
                {absent.map(({ name, picture }, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-x-2 text-slate-800"
                  >
                    <Avatar>
                      <AvatarImage src={picture} alt="avatar" />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>}
            {late.length > 0 &&
            <div className="flex items-center gap-x-1">
              <div
                className="px-1 rounded text-sm text-nowrap bg-yellow-500 text-white"
              >遅刻</div>
              <div
                className="flex flex-wrap gap-2"
              >
                {late.map(({ name, picture }, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-x-2 text-slate-800"
                  >
                    <Avatar>
                      <AvatarImage src={picture} alt="avatar" />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>}
            {undecided.length > 0 &&
            <div className="flex items-center gap-x-1">
              <div
                className="px-1 rounded text-sm text-nowrap bg-gray-500 text-white"
              >未定</div>
              <div
                className="flex flex-wrap gap-2"
              >
                {undecided.map(({ name, picture }, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-x-2 text-slate-800"
                  >
                    <Avatar>
                      <AvatarImage src={picture} alt="avatar" />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>}
          </div>
        ))}
      </div>) :
      <div className="w-full flex flex-col gap-y-4">
        {row.map(({ date, start, end, description, attendance }, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-y-2 p-2 border rounded-md"
          >
            <div
              className="flex flex-wrap items-baseline gap-x-2"
            >
              <span
                className="text-lg font-semibold"
              >
                {formatInTimeZone(date, "Asia/Tokyo", "MM/dd")}
              </span>
              {(start || end) &&
              <div
                className="flex items-center gap-x-1 font-medium"
              >
                {start &&
                <span>
                  {formatInTimeZone(start, "Asia/Tokyo", "HH:mm")}
                </span>}
                {(start || end) && <span>-</span>}
                {end &&
                <span>
                  {formatInTimeZone(end, "Asia/Tokyo", "HH:mm")}
                </span>}
              </div>}
              {description &&
              <span className="text-slate-500">{description}</span>}
            </div>
            {attendance.length > 0 &&
            <div
              className="flex flex-wrap gap-2"
            >
              {attendance.map(({ name, picture }, idx) => (
                <Avatar key={idx}>
                  <AvatarImage src={picture} alt="avatar" />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>}
          </div>
        ))}
      </div>}
    </>
  );
}

interface Row {
  date: string;
  start: string;
  end: string;
  description: string;
}

export function NewSchedule() {
  const [rows, setRows] = useState<Row[]>([{
    date: "",
    start: "",
    end: "",
    description: "",
  }]);

  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const addRow = () => {
    const newRow: Row = {
      date: "",
      start: "",
      end: "",
      description: "",
    }
    setRows([...rows, newRow]);
  };

  const deleteRow = (_idx: number) => {
    setRows(rows.filter((_, idx) => idx !== _idx));
  };

  const handleDate = (_idx: number, date: string) => {
    setRows(rows.map((row, idx) => idx === _idx ? { ...row, date } : row));
  };

  const handleStart = (_idx: number, start: string) => {
    setRows(rows.map((row, idx) => idx === _idx ? { ...row, start } : row));
  };

  const handleEnd = (_idx: number, end: string) => {
    setRows(rows.map((row, idx) => idx === _idx ? { ...row, end } : row));
  };

  const handleDescription = (_idx: number, description: string) => {
    setRows(rows.map((row, idx) => idx === _idx ? { ...row, description } : row));
  };

  const parseSchedule = (): [number, number, Schedule[]] => {
    let valid = 0;
    let invalid = 0;
    const schedule = rows
      .map(({ date, start, end, description }) => {
        if (date) {
          valid++;
          return {
            date: new Date(date+"T00:00+09:00"),
            start: start ? new Date(date+"T"+start+"+09:00") : undefined,
            end: end ? new Date(date+"T"+end+"+09:00") : undefined,
            description: description || undefined,
          };
        }
        invalid++;
        return null;
      })
      .filter(row => row !== null);

    return [valid, invalid, schedule];
  };

  const submitSchedule = async () => {
    const [valid, invalid, schedule] = parseSchedule();
    await createSchedule(schedule);
    toast({
      title: "データを送信しました。",
      description: `有効な行: ${valid}、無効な行: ${invalid}`,
    });
    setRows([{
      date: "",
      start: "",
      end: "",
      description: "",
    }]);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>行の削除</TableHead>
            <TableHead>日付</TableHead>
            <TableHead>開始</TableHead>
            <TableHead>終了</TableHead>
            <TableHead>詳細</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <ListMinus
                  onClick={() => deleteRow(idx)}
                  className="w-16"
                />
              </TableCell>
              <TableCell>
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => handleDate(idx, e.target.value)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="time"
                  list="datalist"
                  value={row.start}
                  onChange={(e) => handleStart(idx, e.target.value)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="time"
                  list="datalist"
                  value={row.end}
                  onChange={(e) => handleEnd(idx, e.target.value)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) => handleDescription(idx, e.target.value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={5}
            >
              <div
                className="flex gap-x-2"
              >
                <Button
                  onClick={addRow}
                  variant="outline"
                >
                  <Plus />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      送信
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        入力内容を送信します。よろしいですか?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        日付が入力されていない行は送信されません。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => startTransition(submitSchedule)}
                        disabled={isPending}
                      >
                        続ける
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <datalist id="datalist">
        <option value="09:00" />
        <option value="12:30" />
        <option value="17:00" />
        <option value="18:00" />
        <option value="21:00" />
      </datalist>
    </>
  );
}

interface EditableRow extends Row {
  isEdited: boolean;
  toDelete: boolean;
  id: number;
}

export function EditSchedule() {
  const [rows, setRows] = useState<EditableRow[]>([]);

  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchSchedule = async () => {
      const schedule = await scheduleFromNow();

      setRows(schedule.map(({ id, date, start, end, description }) => {
        const jstDate = formatInTimeZone(date, "Asia/Tokyo", "yyyy-MM-dd");

        const jstStart = start ? formatInTimeZone(start, "Asia/Tokyo", "HH:mm") : "";

        const jstEnd = end ? formatInTimeZone(end, "Asia/Tokyo", "HH:mm") : "";

        return {
          isEdited: false,
          toDelete: false,
          id,
          date: jstDate,
          start: jstStart,
          end: jstEnd,
          description: description || "",
        }
      }));
    };

    fetchSchedule();
  }, [count]);

  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const deleteRow = (_idx: number) => {
    setRows(rows.map((row, idx) => idx === _idx ? { ...row, toDelete: !row.toDelete } : row));
  };

  const handleDate = (_idx: number, date: string) => {
    setRows(rows.map((row, idx) => idx === _idx ? { ...row, date, isEdited: true } : row));
  };

  const handleStart = (_idx: number, start: string) => {
    setRows(rows.map((row, idx) => idx === _idx ? { ...row, start, isEdited: true } : row));
  };

  const handleEnd = (_idx: number, end: string) => {
    setRows(rows.map((row, idx) => idx === _idx ? { ...row, end, isEdited: true } : row));
  }

  const handleDescription = (_idx: number, description: string) => {
    setRows(rows.map((row, idx) => idx === _idx ? { ...row, description, isEdited: true } : row));
  }

  const parseSchedule = (): [number, number, number[], ScheduleWithId[]] => {
    let valid = 0;
    let invalid = 0;
  
    const ids: number[] = [];
  
    const schedule = rows
      .map(({ id, isEdited, toDelete, date, start, end, description }) => {
        if (isEdited) {
          if (date) {
            valid++;
            return {
              id,
              date: new Date(date+"T00:00+09:00"),
              start: start ? new Date(date+"T"+start+"+09:00") : undefined,
              end: end ? new Date(date+"T"+end+"+09:00") : undefined,
              description: description || undefined,
            };
          }
          invalid++;
          return null;
        }
        if (toDelete) {
          valid++;
          ids.push(id);
        }
        return null;
      })
      .filter(row => row !== null);

    return [valid, invalid, ids, schedule];
  };

  const submitScheduleChanges = async () => {
    const [valid, invalid, ids, schedule] = parseSchedule();
    await updateSchedule(schedule);
    await deleteSchedule(ids);
    toast({
      title: "データを送信しました。",
      description: `有効な行: ${valid}, 無効な行: ${invalid}`,
    });

    setCount(count+1);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>行の削除</TableHead>
            <TableHead>日付</TableHead>
            <TableHead>開始</TableHead>
            <TableHead>終了</TableHead>
            <TableHead>詳細</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              className={clsx({ "bg-green-100": row.isEdited === true })}
            >
              <TableCell>
                <div
                  onClick={() => deleteRow(idx)}
                >
                  {row.toDelete ?
                  <ListX
                    className="w-16 text-red-500"
                  /> :
                  <ListMinus
                    className="w-16"
                  />}
                </div>
              </TableCell>
              <TableCell>
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => handleDate(idx, e.target.value)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="time"
                  list="datalist"
                  value={row.start}
                  onChange={(e) => handleStart(idx, e.target.value)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="time"
                  list="datalist"
                  value={row.end}
                  onChange={(e) => handleEnd(idx, e.target.value)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) => handleDescription(idx, e.target.value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={5}
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>
                    送信
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      変更内容を送信します。よろしいですか?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      日付が入力されていない行は送信されません。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => startTransition(submitScheduleChanges)}
                      disabled={isPending}
                    >
                      続ける
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <datalist id="datalist">
        <option value="09:00" />
        <option value="12:30" />
        <option value="17:00" />
        <option value="18:00" />
        <option value="21:00" />
      </datalist>
    </>
  );
}
