import { BlockDisplay } from "@/components/block-display";

export default function Lab() {
  return (
    <main className="container-wrapper section-soft flex-1 md:py-12">
      <div className="container">
        <div className="flex flex-col gap-12 md:gap-24">
          <BlockDisplay name={"rust-c2"} />
        </div>
      </div>
    </main>
  );
}
