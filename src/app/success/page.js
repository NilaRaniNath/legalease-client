import { Suspense } from "react";
import SuccessContent from "./SuccessContent";


export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#0B1524] text-white">
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}