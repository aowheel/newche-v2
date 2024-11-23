import { session } from "@/lib/auth";
import { personalAttendance, scheduleFromNow } from "@/lib/data";
import AttendanceSubmission from "./attendance-selection";
import { formatDate } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar, Clock, Info } from "lucide-react";

export async function PersonalAttendance() {
  const { sub } = await session();
  const schedule = await scheduleFromNow();

  return (
    <div className="w-full flex flex-col gap-y-4 text-slate-500">
      {schedule.map(async ({ id, date, start, end, description }, idx) => {
        const status = await personalAttendance(sub, id);

        return (
          <div
            key={idx}
            className="flex flex-col gap-y-2 p-2 border rounded-md"
          >
            <div
              className="flex items-center gap-x-1"
            >
              <Calendar className="w-4 h-4 mx-1" />
              <span>
                {formatDate(date, "MM/dd (eee)", { locale: ja })}
              </span>
            </div>
            {(start || end) &&
            <div
              className="flex items-center gap-x-1"
            >
              <Clock className="w-4 h-4 mx-1" />
              {start &&
              <span>
                {formatDate(start, "HH:mm", { locale: ja })}
              </span>}
              {(start || end) && <span>-</span>}
              {end &&
              <span>
                {formatDate(end, "HH:mm", { locale: ja })}
              </span>}
            </div>}
            {description &&
            <div
              className="flex items-center gap-x-1"
            >
              <Info className="shrink-0 w-4 h-4 mx-1" />
              <span>{description}</span>
            </div>}
            <AttendanceSubmission
              userId={sub}
              scheduleId={id}
              status={status}
            />
          </div>
        );
      })}
    </div>
  );
}
