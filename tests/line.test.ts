import { BotClient } from "@/lib/bot";
import { countPresentOrLate, group, late, present, scheduleOnDate, undecided } from "@/lib/data";
import { formatInTimeZone } from "date-fns-tz";
import { describe, it } from "vitest";

describe("Line Messaging Api", () => {
  it("should notify tommmorow schedule", async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const value = formatInTimeZone(tomorrow, "Asia/Tokyo", "yyyy-MM-dd");
    const tomorrowStart = new Date(value + "T00:00+09:00");

    const schedule = await scheduleOnDate(tomorrowStart);

    console.log("Schedule ids: ", schedule.map((s) => s.id));

    // schedule.lengthが1の場合
    if (schedule.length === 1) {
      const { id, start, end, description } = schedule[0];
  
      const _start = start ? formatInTimeZone(start, "Asia/Tokyo", "HH:mm") : undefined;
      const _end = end ? formatInTimeZone(end, "Asia/Tokyo", "HH:mm") : undefined;
  
      const [count, presents, lates, undecideds] = await Promise.all([
        countPresentOrLate(id),
        present(id),
        late(id),
        undecided(id)
      ]);

      console.log("Count of PRESENT and LATE: ", count);
  
      const ids = await group();
      const client = await BotClient();
      await Promise.all(
        ids.map(async ({ id: groupId }) => {
          const validPresents = (
            await Promise.all(
              presents.map(async ({ userId }) => {
                try {
                  await client.getGroupMemberProfile(groupId, userId);
                  return userId;
                } catch {
                  return null;
                }
              })
            )
          ).filter(userId => userId !== null);
          const validLates = (
            await Promise.all(
              lates.map(async ({ userId }) => {
                try {
                  await client.getGroupMemberProfile(groupId, userId);
                  return userId;
                } catch {
                  return null;
                }
              })
            )
          ).filter(userId => userId !== null);
          const validUndecideds = (
            await Promise.all(
              undecideds.map(async ({ userId }) => {
                try {
                  await client.getGroupMemberProfile(groupId, userId);
                  return userId;
                } catch {
                  return null;
                }
              })
            )
          ).filter(userId => userId !== null);
  
          let text = "明日の日程はこちらです📅\n\n";
          text += `${_start ? `${_start}` : ""}${(_start || _end) ? " - " : ""}${_end ? `${_end}` : ""}${description ? ` ${description}` : ""}\n\n`;
          text += `現時点での参加予定人数は ${count}人 です。`;
  
          const substitution: { [key: string]: any } = {};
  
          if (validPresents.length > 0) {
            text += "\n\n出席: ";
            validPresents.forEach((userId, idx) => {
              text += `{present${idx}} `;
              substitution[`present${idx}`] = {
                type: "mention",
                mentionee: {
                  type: "user",
                  userId
                }
              };
            });
          }
          if (validLates.length > 0) {
            text += "\n\n遅刻: ";
            validLates.forEach((userId, idx) => {
              text += `{late${idx}} `;
              substitution[`late${idx}`] = {
                type: "mention",
                mentionee: {
                  type: "user",
                  userId
                }
              };
            });
          }
          if (validUndecideds.length > 0) {
            text += "\n\n未定: ";
            validUndecideds.forEach((userId, idx) => {
              text += `{undecided${idx}} `;
              substitution[`undecided${idx}`] = {
                type: "mention",
                mentionee: {
                  type: "user",
                  userId
                }
              };
            });
          }

          console.log("Text: ", text);
          console.log("Substitution: ", Object.keys(substitution));

          // 以下は通知するためのロジック
          // await client.pushMessage({
          //   to: groupId,
          //   messages: [
          //     {
          //       type: "textV2",
          //       text,
          //       substitution
          //     },
          //     {
          //       type: "template",
          //       altText: "未定の方や変更がある場合はこちらから👇",
          //       template: {
          //         type: "buttons",
          //         text: "未定の方や変更がある場合はこちらから👇",
          //         actions: [
          //           {
          //             type: "uri",
          //             label: "出欠席の選択",
          //             uri: "https://newche-v2.vercel.app/attendance"
          //           },
          //           {
          //             type: "uri",
          //             label: "日程の一覧",
          //             uri: `https://newche-v2.vercel.app/view?date=${value}`
          //           }
          //         ]
          //       }
          //     }
          //   ]
          // });
        })
      );
    }
    
    // schedule.lengthが1より大きい場合(testのため1も含める)
    if (schedule.length >= 1) {
      let text = "明日の日程はこちらです📅\n\n";
      schedule.forEach(({ start, end, description }) => {
        const _start = start ? formatInTimeZone(start, "Asia/Tokyo", "HH:mm") : undefined;
        const _end = end ? formatInTimeZone(end, "Asia/Tokyo", "HH:mm") : undefined;
  
        text += `${_start ? ` ${_start}` : ""}${(_start || _end) ? " - " : ""}${_end ? `${_end}` : ""}${description ? ` ${description}` : ""}\n\n`;
      });
      text += "変更がある場合や参加者の確認はこちらから👇";

      console.log("Text: ", text);

      // 以下は通知するためのロジック
      // const ids = await group();
      // const client = await BotClient();
      // await Promise.all(
      //   ids.map(async ({ id }) => {
      //     await client.pushMessage({
      //       to: id,
      //       messages: [{
      //         type: "template",
      //         altText: "明日の日程はこちらです📅",
      //         template: {
      //           type: "buttons",
      //           text,
      //           actions: [
      //             {
      //               type: "uri",
      //               label: "出欠席の選択",
      //               uri: "https://newche-v2.vercel.app/attendance"
      //             },
      //             {
      //               type: "uri",
      //               label: "日程の一覧",
      //               uri: `https://newche-v2.vercel.app/view?date=${value}`
      //             }
      //           ]
      //         }
      //       }]
      //     });
      //   })
      // );
    }
  });
});
