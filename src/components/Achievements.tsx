import type { Achievement } from '../data/resume';

export function Achievements({ items }: { items: Achievement[] }) {
  return (
    <section className="section" id="achievements">
      <div className="section__head">
        <span className="section__index">02</span>
        <h2 className="section__title">Key Achievements</h2>
      </div>

      <div className="achievements">
        {items.map((a) => (
          <article className="achievement" key={a.title}>
            <p className="achievement__metric">{a.metric}</p>
            <h3 className="achievement__title">{a.title}</h3>
            <p className="achievement__detail">{a.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
