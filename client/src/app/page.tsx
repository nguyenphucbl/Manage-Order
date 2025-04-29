import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
      <p className="mt-4 text-lg">
        This is a simple example of a Next.js application.
      </p>
      <Button className="mt-6" variant={"destructive"} size={"lg"}>
        Click Me
      </Button>
    </main>
  );
}
