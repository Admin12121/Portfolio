import { RECOGNITION } from "@/features/profile/data/recognition";

const content = `# Recognition\n\n${RECOGNITION.map(
  (entry) => `- ${entry.award.title} — ${entry.award.organizer} (${entry.date})`
).join("\n")}`;

export const dynamic = "force-static";

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
