"use server";

import { PrismaClient, Status } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";

const prisma = new PrismaClient();

export async function userExists(sub: string) {
  return await prisma.user.count({
    where: { sub }
  }) > 0;
}

export async function upsertUser(
  sub: string,
  name: string,
  picture?: string
) {
  await prisma.user.upsert({
    where: { sub },
    update: { name, picture },
    create: { sub, name, picture }
  });
}

export async function scheduleOnDate(date: Date) {
  return await prisma.schedule.findMany({
    where: { date },
    orderBy:  [
      { end: { sort: "asc", nulls: "first" } },
      { start: { sort: "asc", nulls: "first" } }
    ]
  });
}

export async function scheduleWithinTimeFrame(gte: Date, lt: Date) {
  return await prisma.schedule.findMany({
    where: {
      date: { gte, lt }
    },
    orderBy: [
      { date: "asc" },
      { end: { sort: "asc", nulls: "first" } },
      { start: { sort: "asc", nulls: "first" } }
    ]
  });
}

export async function scheduleFromNow() {
  let _gte = formatInTimeZone(new Date(), "Asia/Tokyo", "yyyy-MM-dd");
  _gte += "T00:00+09:00";
  const gte = new Date(_gte);

  return await prisma.schedule.findMany({
    where: {
      date: { gte }
    },
    orderBy: { date: "asc" }
  });
}

export interface Schedule {
  date: Date;
  start?: Date;
  end?: Date;
  description?: string;
}

export interface ScheduleWithId extends Schedule {
  id: number;
}

export async function createSchedule(schedule: Schedule[]) {
  await prisma.schedule.createMany({
    data: schedule
  });
}

export async function updateSchedule(schedule: ScheduleWithId[]) {
  for (const data of schedule) {
    await prisma.schedule.update({
      where: { id: data.id },
      data
    });
  }
}

export async function deleteSchedule(ids: number[]) {
  await prisma.attendance.deleteMany({
    where: {
      scheduleId: { in: ids }
    }
  });

  await prisma.schedule.deleteMany({
    where: {
      id: { in: ids }
    }
  });
}

export interface Attendance {
  name: string;
  picture?: string;
}

export async function overallAttendanceFromNow() {
  let _gte = formatInTimeZone(new Date(), "Asia/Tokyo", "yyyy-MM-dd");
  _gte += "T00:00+09:00";
  const gte = new Date(_gte);

  const attendance = await prisma.schedule.findMany({
    where: {
      date: { gte }
    },
    orderBy: { date: "asc" },
    select: {
      id: true,
      date: true,
      start: true,
      end: true,
      description: true,
      users: {
        where: {
          status: { in: ["PRESENT", "LATE"] }
        },
        select: {
          user: {
            select: {
              name: true,
              picture: true
            }
          }
        }
      }
    }
  });

  return attendance.map(({ users, ...other }) => ({
    ...other,
    attendance: users.map(({ user }) => ({
      name: user.name,
      picture: user.picture || undefined
    }))
  }));
}

export interface AttendanceDetail {
  present: Attendance[];
  late: Attendance[];
  absent: Attendance[];
  undecided: Attendance[];
}

export async function overallAttendanceDetail(scheduleId: number): Promise<AttendanceDetail> {
  const [present, late, absent, undecided] = await Promise.all([
    prisma.attendance.findMany({
      where: {
        scheduleId,
        status: "PRESENT"
      },
      select: {
        user: {
          select: {
            name: true,
            picture: true
          }
        }
      }
    }),
    prisma.attendance.findMany({
      where: {
        scheduleId,
        status: "LATE"
      },
      select: {
        user: {
          select: {
            name: true,
            picture: true
          }
        }
      }
    }),
    prisma.attendance.findMany({
      where: {
        scheduleId,
        status: "ABSENT"
      },
      select: {
        user: {
          select: {
            name: true,
            picture: true
          }
        }
      }
    }),
    prisma.attendance.findMany({
      where: {
        scheduleId,
        status: "UNDECIDED"
      },
      select: {
        user: {
          select: {
            name: true,
            picture: true
          }
        }
      }
    })
  ]);

  return {
    present: present.map(({ user }) => ({
      name: user.name,
      picture: user.picture || undefined
    })),
    late: late.map(({ user }) => ({
      name: user.name,
      picture: user.picture || undefined
    })),
    absent: absent.map(({ user }) => ({
      name: user.name,
      picture: user.picture || undefined
    })),
    undecided: undecided.map(({ user }) => ({
      name: user.name,
      picture: user.picture || undefined
    }))
  };
}

export async function countPresentOrLate(scheduleId: number) {
  return await prisma.attendance.count({
    where: {
      scheduleId,
      status: { in: ["PRESENT", "LATE"] }
    }
  });
}

export async function present(scheduleId: number) {
  return await prisma.attendance.findMany({
    where: {
      scheduleId,
      status: "PRESENT"
    },
    select: {
      userId: true
    }
  })
}

export async function late(scheduleId: number) {
  return await prisma.attendance.findMany({
    where: {
      scheduleId,
      status: "LATE"
    },
    select: {
      userId: true
    }
  });
}

export async function undecided(scheduleId: number) {
  return await prisma.attendance.findMany({
    where: {
      scheduleId,
      status: "UNDECIDED"
    },
    select: {
      userId: true
    }
  });
}

export async function personalAttendance(
  userId: string,
  scheduleId: number
) {
  const { status } =  await prisma.attendance.findUnique({
    where: { userId_scheduleId: { userId, scheduleId } },
    select: { status: true }
  }) || { status: null };

  return status;
}

export async function upsertAttendance(
  userId: string,
  scheduleId: number,
  status: Status
) {
  await prisma.attendance.upsert({
    where: { userId_scheduleId: { userId, scheduleId } },
    update: { status },
    create: { userId, scheduleId, status }
  });
}

export async function unsubmitted(sub: string) {
  let _gte = formatInTimeZone(new Date(), "Asia/Tokyo", "yyyy-MM-dd");
  _gte += "T00:00+09:00";
  const gte = new Date(_gte);

  const all = await prisma.schedule.count({
    where: {
      date: { gte }
    }
  });

  const submitted = await prisma.attendance.count({
    where: {
      userId: sub,
      schedule: {
        date: { gte }
      }
    }
  });

  return all - submitted;
}

export async function group() {
  return await prisma.group.findMany();
}

export async function createGroup(id: string) {
  await prisma.group.create({
    data: { id }
  });
}

export async function deleteGroup(id: string) {
  await prisma.group.delete({
    where: { id }
  });
}
