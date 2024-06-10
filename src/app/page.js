import Home from "@/components/Home/Home";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
