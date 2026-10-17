export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
      <h1 className="font-pixel text-2xl leading-relaxed text-orange sm:text-4xl">
        UDAYVERSE
      </h1>
      <div className="border-4 border-cyan px-6 py-4 shadow-[6px_6px_0_0_var(--cyan)]">
        <p className="font-pixel text-xs text-green sm:text-sm">
          PHASE 1 COMPLETE
        </p>
      </div>
      <p className="max-w-md text-2xl text-foreground/80">
        Messy data in, something useful out. Pipeline loading...
      </p>
    </main>
  );
}
