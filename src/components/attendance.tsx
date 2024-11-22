import { session } from "@/lib/auth";
import { personalAttendance, scheduleFromNow } from "@/lib/data";
import { formatInTimeZone } from "date-fns-tz";
import AttendanceSubmission from "./attendance-selection";

export async function PersonalAttendance() {
  const { sub } = await session();
  const schedule = await scheduleFromNow();

  return (
    <div className="w-full flex flex-col gap-y-4">
      {schedule.map(async ({ id, date, start, end, description }, idx) => {
        const status = await personalAttendance(sub, id);

        return (
          <div
            key={idx}
            className="flex flex-col gap-y-2 p-2 border rounded-md"
          >
            <div
              className="flex items-baseline gap-x-4"
            >
              <span
                className="text-lg font-bold"
              >
                {formatInTimeZone(date, "Asia/Tokyo", "yyyy/MM/dd EEE")}
              </span>
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
              </div>
            </div>
            {description && <span>{description}</span>}
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
