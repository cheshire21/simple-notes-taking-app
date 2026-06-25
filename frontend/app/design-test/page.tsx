import type { JSX } from "react";

const swatches = [
  { token: "cream", bg: "bg-cream", label: "cream" },
  { token: "brown", bg: "bg-brown", label: "brown" },
  { token: "salmon", bg: "bg-salmon", label: "salmon" },
  { token: "yellow-soft", bg: "bg-yellow-soft", label: "yellow-soft" },
  { token: "teal-soft", bg: "bg-teal-soft", label: "teal-soft" },
  { token: "olive-soft", bg: "bg-olive-soft", label: "olive-soft" },
];

const DesignTestPage = (): JSX.Element => (
  <main className="bg-cream min-h-screen p-10">
    <section className="mb-10">
      <p className="mb-4 text-sm font-bold uppercase tracking-widest text-brown">Color Swatches</p>
      <div className="flex flex-wrap gap-4">
        {swatches.map(({ token, bg, label }) => (
          <div key={token} className="flex flex-col items-center gap-1">
            <div className={`${bg} h-16 w-16 rounded border border-brown/20`} />
            <span className="font-linter text-xs text-brown">{label}</span>
          </div>
        ))}
      </div>
    </section>

    <section className="mb-10">
      <p className="mb-4 text-sm font-bold uppercase tracking-widest text-brown">
        Typography — Inria Serif
      </p>
      <h1>Heading 1 — Inria Serif 40px 700</h1>
      <h2>Heading 2 — Inria Serif 28px 700</h2>
      <h3>Heading 3 — Inria Serif 20px 600</h3>
    </section>

    <section className="mb-10">
      <p className="mb-4 text-sm font-bold uppercase tracking-widest text-brown">
        Typography — Inter (--font-linter)
      </p>
      <p>Paragraph text — Inter 14px, color brown</p>
      <a href="/design-test">Link text — Inter 14px underline, color brown</a>
    </section>

    <section>
      <p className="mb-4 text-sm font-bold uppercase tracking-widest text-brown">
        Utility Class — .note-title
      </p>
      <p className="note-title text-xl text-brown">
        Note title rendered with .note-title (Inria Serif)
      </p>
    </section>
  </main>
);

export default DesignTestPage;
