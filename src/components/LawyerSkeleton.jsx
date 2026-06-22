
import { Card } from "@heroui/react";

export default function LawyerSkeleton() {
  return (
    <Card className="bg-slate-900/40 border border-white/5 p-4 h-56 animate-pulse rounded-2xl flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 bg-white/10 rounded-xl" />
        <div className="w-12 h-6 bg-white/10 rounded-full" />
      </div>
      <div className="space-y-2 w-full">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
      <div className="h-8 bg-white/10 rounded w-full mt-4" />
    </Card>
  );
}