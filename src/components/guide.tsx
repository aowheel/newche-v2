"use client";

import { ListMinus, ListX, Plus, Undo2 } from "lucide-react";
import Image from "next/image";

export function ViewGuide() {
  return (
    <div
      className="prose p-4 bg-slate-100 rounded-xl"
    >
      <h3>使い方ガイド</h3>
      <ul>
        <li>表示されているのは今日以降の日程で「出席」または「遅刻」と答えた人の一覧です。</li>
        <li>
          カレンダーの中の
          <span className="inline-block align-text-bottom w-5 h-5 mx-1 rounded bg-orange-500"></span>
          は日程が存在する日付です。
        </li>
        <li>日付をタップすることで日程の詳細を見ることができます。</li>
        <li>もとの表示に戻す場合は<Undo2 className="w-4 mx-1 inline" />を押してください。</li>
      </ul>
    </div>
  );
}

export function AttendanceGuide() {
  return (
    <div
      className="prose p-4 bg-slate-100 rounded-xl"
    >
      <h3>使い方ガイド</h3>
      <ul>
        <li>出席、欠席、遅刻、未定のいずれかを選択します。</li>
        <li>その日程が近づくと選択内容がBotを通じてLINEに通知されます。</li>
        <li>
          <span className="rounded-full mx-1 px-2 py-1 text-sm bg-slate-900 text-white">出欠席</span>
          の右上に表示される数字は、今日以降のすべての日程のうち、あなたが未選択のものの数です。
        </li>
      </ul>
    </div>
  );
}

export function ManageGuide() {
  return (
    <div
      className="prose p-4 bg-slate-100 rounded-xl"
    >
      <h3>使い方ガイド</h3>
      <h4>新規</h4>
      <p>新規の日程を追加します。</p>
      <ul>
        <li><Plus className="w-4 mx-1 inline"/>ボタンで行を追加します。</li>
        <li>日付が必須、開始時間、終了時間、詳細がオプションです。</li>
        <li><ListMinus className="w-4 mx-1 inline" />ボタンで行を削除できます。</li>
        <li>入力後、送信ボタンを押してデータを送信します。</li>
        <li>入力内容はBotを通じてLINEに送信されます。</li>
      </ul>
      <h4>編集</h4>
      <p>既存の日程を編集します。</p>
      <ul>
        <li><ListMinus className="w-4 mx-1 inline" />ボタンで削除する行にチェックします。<ListX className="w-4 mx-1 inline text-red-500" />が送信時に削除される行です。</li>
        <li>変更時も、必須、オプションの項目は新規の場合と同様です。</li>
        <li>送信ボタンを押してデータを送信します。変更のない行は送信されません。</li>
        <li>変更内容はBotを通じてLINEに送信されます。</li>
      </ul>
    </div>
  );
}

export function FriendGuide({
  details, status
}: {
  details: { groupName: string, pictureUrl?: string }[];
  status: string;
}
) {
  return (
    <div
      className="prose m-4 p-4 bg-slate-100 rounded-xl"
    >
      <h2>別のグループでのNewcheの利用</h2>
      <p>Newcheを友だち追加して別のグループトークに招待することで、データを共有しつつNewcheの機能を利用することができます。</p>
      <strong>無関係なグループトークには招待しないでください。不要になった場合はグループからBotを削除してください。</strong>
      <h3>追加済みグループ一覧</h3>
      <div className="flex flex-col gap-y-2">
        {details.map(({ groupName, pictureUrl }, idx) => (
          <div
            key={idx}
            className="flex items-center gap-x-2"
          >
            <Image
              src={pictureUrl || ""}
              alt={groupName}
              width="40"
              height="40"
              className="m-0 rounded-full"
            />
            <span
              className="font-medium text-lg"
            >{groupName}</span>
          </div>
        ))}
      </div>
      <h3>今月の配信数</h3>
      <p>新規・編集、毎日20時の通知 / 上限 : <strong className="inline-block">{status}</strong></p>
    </div>
  );
}
