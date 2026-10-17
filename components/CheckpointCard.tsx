import type { Checkpoint } from "@/content/projects";

export default function CheckpointCard({
  checkpoint,
  compact = false,
  headingLevel = 3,
}: {
  checkpoint: Checkpoint;
  compact?: boolean;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      className={`border-4 border-dashed border-orange bg-background p-4 sm:p-6 ${
        compact ? "pipe:w-full pipe:max-w-4xl pipe:p-5" : ""
      }`}
    >
      <p className="font-pixel text-xs text-green">CHECKPOINT</p>
      <Heading
        className={`mt-2 font-pixel text-sm leading-relaxed text-orange sm:text-base ${
          compact ? "pipe:text-sm" : ""
        }`}
      >
        {checkpoint.title}
      </Heading>
      <p className="text-foreground/80">{checkpoint.dates}</p>
      <ul className={`mt-3 list-none space-y-2 ${compact ? "pipe:text-[1.3rem] pipe:leading-[1.15]" : ""}`}>
        {checkpoint.bullets.map((b) => (
          <li key={b} className="text-foreground/80 before:mr-2 before:text-green before:content-['>']">
            {b}
          </li>
        ))}
      </ul>
    </article>
  );
}
