import { ManageGuide } from "@/components/guide";
import { EditSchedule, NewSchedule } from "@/components/schedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Manage() {
  return (
    <div className="grow w-full flex flex-col items-center gap-y-8 px-2 py-4">
      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new">新規</TabsTrigger>
          <TabsTrigger value="edit">編集</TabsTrigger>
        </TabsList>
        <TabsContent value="new">
          <NewSchedule />
        </TabsContent>
        <TabsContent value="edit">
          <EditSchedule />
        </TabsContent>
      </Tabs>
      <ManageGuide />
    </div>
  );
}
