"use client";

import { upsertAttendance } from "@/lib/data";
import { Status } from "@prisma/client";
import { useTransition } from "react";

export default function AttendanceSubmission({
  userId,
  scheduleId,
  status
}: {
  userId: string;
  scheduleId: number;
  status: Status | null;
}) {
  const [isPending, startTransition] = useTransition();

  const submitAttendance = (status: Status) => startTransition(async () => {
    await upsertAttendance(userId, scheduleId, status);
  });

  return (
    <div
      className="flex items-center justify-center gap-x-2 font-medium text-lg text-slate-700"
    >
      <input
        id={`0-${scheduleId}`}
        type="radio"
        name={`${scheduleId}`}
        defaultChecked={status === "PRESENT"}
        disabled={isPending}
        onClick={() => submitAttendance("PRESENT")}
        className="peer/PRESENT hidden"
      />
      <label
        htmlFor={`0-${scheduleId}`}
        className="peer-checked/PRESENT:bg-green-500 peer-checked/PRESENT:text-white px-4 py-2 rounded border transition"
      >出席</label>

      <input
        id={`1-${scheduleId}`}
        type="radio"
        name={`${scheduleId}`}
        defaultChecked={status === "ABSENT"}
        disabled={isPending}
        onClick={() => submitAttendance("ABSENT")}
        className="peer/ABSENT hidden"
      />
      <label
        htmlFor={`1-${scheduleId}`}
        className="peer-checked/ABSENT:bg-red-500 peer-checked/ABSENT:text-white px-4 py-2 rounded border transition"
      >欠席</label>

      <input
        id={`2-${scheduleId}`}
        type="radio"
        name={`${scheduleId}`}
        defaultChecked={status === "LATE"}
        disabled={isPending}
        onClick={() => submitAttendance("LATE")}
        className="peer/LATE hidden"
      />
      <label
        htmlFor={`2-${scheduleId}`}
        className="peer-checked/LATE:bg-yellow-500 peer-checked/LATE:text-white px-4 py-2 rounded border transition"
      >遅刻</label>

      <input
        id={`3-${scheduleId}`}
        type="radio"
        name={`${scheduleId}`}
        defaultChecked={status === "UNDECIDED"}
        disabled={isPending}
        onClick={() => submitAttendance("UNDECIDED")}
        className="peer/UNDECIDED hidden"
      />
      <label
        htmlFor={`3-${scheduleId}`}
        className="peer-checked/UNDECIDED:bg-gray-500 peer-checked/UNDECIDED:text-white px-4 py-2 rounded border transition"
      >未定</label>
    </div>
  );
}
