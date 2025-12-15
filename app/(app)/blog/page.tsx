import Blog from "./_components";
import { Separator } from "@/components/separator";

const page = () => {
  return (
    <main className="container-wrapper max-w-screen! overflow-x-hidden px-2">
      <div className="mx-auto px-0! container md:fixed:max-w-3xl">
        <Separator />
        <Blog />
      </div>
    </main>
  );
};

export default page;
