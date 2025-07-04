import { DotLoader } from "@/components/shared/DotLoader";

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center w-full mx-auto">
      <DotLoader />
    </div>
  );
}
