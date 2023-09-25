import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <Button>
        <Link href={"/profile"}>Till din profil</Link>
      </Button>
    </main>
  );
}
