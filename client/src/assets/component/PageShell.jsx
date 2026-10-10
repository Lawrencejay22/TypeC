import MatrixBg from "./MatrixBg.jsx";
import "./PageShell.css";

export default function PageShell({
  label,
  title,
  tabs = [],
  activeTab,
  onTabChange,
  onBack,
  seed = 5,
  className = "",
  children,
}) {
  return (
    <section className={`tc-page ${className}`}>
      <MatrixBg seed={seed} />

      <header className="tc-page-head">
        <p className="tc-page-label">{label}</p>
        <div className="tc-page-titlerow">
          <h1 className="tc-page-title">{title}</h1>
          {onBack && (
            <button type="button" className="tc-page-back" onClick={onBack}>
              ← BACK
            </button>
          )}
        </div>

        {tabs.length > 0 && (
          <div className="tc-tabs" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                className={`tc-tab ${activeTab === tab.key ? "is-active" : ""}`}
                onClick={() => onTabChange && onTabChange(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="tc-page-body">{children}</div>
    </section>
  );
}
