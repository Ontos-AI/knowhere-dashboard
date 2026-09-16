export function BlogSkeleton() {
  return (
    <div className="kb kb-standard">
      <main className="kb-classic kb-hybrid" id="blog-main">
        <section className="kb-intro kb-shell" aria-hidden="true">
          <div className="kb-skeleton-line" />
          <div className="kb-skeleton-line kb-short" />
        </section>
        <div className="kb-shell">
          <div className="kb-skeleton-lead" />
        </div>
        <section className="kb-classic-featured kb-shell" aria-hidden="true">
          <div className="kb-skeleton-grid">
            {["a", "b", "c"].map((slot) => (
              <div className="kb-skeleton-card" key={slot}>
                <div className="kb-skeleton-cover" />
                <div className="kb-skeleton-line" />
                <div className="kb-skeleton-line kb-short" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
