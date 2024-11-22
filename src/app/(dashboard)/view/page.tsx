import { ViewGuide } from "@/components/guide";
import ViewSchedule from "@/components/schedule";
import { overallAttendance, scheduleFromNow } from "@/lib/data";

export default async function View() {
  const schedule = await scheduleFromNow();

  const row = await Promise.all(schedule.map(async ({
    id,
    date,
    start,
    end,
    description
  }) => {
    const attendance = await overallAttendance(id);

    return {
      id,
      date,
      start: start || undefined,
      end: end || undefined,
      description: description || undefined,
      attendance
    }
  }));

  return (
    <div
      className="grow w-full flex flex-col items-center gap-y-8 px-2 py-4"
    >
      <ViewSchedule row={row} />
      <ViewGuide />
    </div>
  );
}
