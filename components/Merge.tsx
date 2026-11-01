// Where the three rails join back into one belt, just before LOAD COMPLETE (public/sprites/merge.png).
// Phones, reduced motion and no JS only get the plain belt strip.
export default function Merge() {
  return (
    <section id="merge" data-station="COMPLETE" data-station-short="COMPLETE" aria-label="Merge" className="scroll-mt-28">
      <div aria-hidden className="mx-auto hidden max-w-5xl justify-center px-4 py-6 lg:flex">
        <div className="merge-art relative">
          <div className="belt-stub belt-stub-out" />
        </div>
      </div>
      <div aria-hidden className="belt-strip lg:hidden" />
    </section>
  );
}
