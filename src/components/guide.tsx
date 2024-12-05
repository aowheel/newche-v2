"use client";

import { ListMinus, ListX, Plus, Undo2 } from "lucide-react";

export function ViewGuide() {
  return (
    <div
      className="prose p-4 bg-slate-100 rounded-xl"
    >
      <h3>使い方ガイド</h3>
      <ul>
        <li>デフォルトで表示されるのは今日以降の日程で「出席」または「遅刻」と答えた人の一覧です。</li>
        <li>
          カレンダーの中で
          <span className="inline-block w-4 h-4 mx-1 rounded-full bg-orange-500"></span>
          がついているのは日程が存在する日付です。
        </li>
        <li>その日付をタップすることで日程の詳細を見ることができます。</li>
        <li>デフォルトの表示に戻す場合は選択した日付をもう一度タップするか、<Undo2 className="w-4 mx-1 inline" />を押してください。</li>
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
          の右上に表示される数字は、今日以降のすべての日程のうち、あなたが未選択の日程の数です。
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
