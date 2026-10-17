import type { Checkpoint } from "@/content/projects";

export default function CheckpointCard({
  checkpoint,
  compact = false,
}: {
  checkpoint: Checkpoint;
  compact?: boolean;
}) {
  return (
    <article
      className={`border-4 border-dashed border-orange bg-background p-4 sm:p-6 ${
        compact ? "pipe:w-full pipe:max-w-4xl pipe:p-5" : ""
      }`}
    >
      <p className="font-pixel text-[10px] text-green">CHECKPOINT</p>
      <h3
        className={`mt-2 font-pixel text-sm leading-relaxed text-orange sm:text-base ${
          compact ? "pipe:text-sm" : ""
        }`}
      >
        {checkpoint.title}
      </h3>
      <p className="text-foreground/60">{checkpoint.dates}</p>
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
