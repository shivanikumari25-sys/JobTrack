

export default function StatCard({ title, value, icon: Icon, tone, note }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <span className={`stat-icon ${tone || "blue"}`}>
          {Icon && <Icon size={20} />}
        </span>
      </div>

      <div className="stat-number">{value}</div>
      <p className="stat-note">{note}</p>
    </article>
  );
}
