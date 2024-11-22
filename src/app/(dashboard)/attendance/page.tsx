import { PersonalAttendance } from "@/components/attendance";
import { AttendanceGuide } from "@/components/guide";

export default function Attendance() {
  return (
    <div
      className="grow w-full flex flex-col gap-y-8 px-2 py-4"
    >
      <PersonalAttendance />
      <AttendanceGuide />
    </div>
  );
}
