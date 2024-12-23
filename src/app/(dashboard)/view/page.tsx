import { ViewGuide } from "@/components/guide";
import ViewSchedule from "@/components/schedule";
import { overallAttendanceFromNow } from "@/lib/data";

export default async function View() {
  const row = await overallAttendanceFromNow();

  return (
    <div
      className="grow w-full flex flex-col items-center gap-y-8 px-2 py-4"
    >
      <ViewSchedule row={row} />
      <ViewGuide />
    </div>
  );
}
