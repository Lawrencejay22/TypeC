import PageShell from "./component/PageShell.jsx";
import "./multiplayer.css";

export default function Multiplayer({ onPractice }) {
  return (
    <PageShell label="// MULTIPLAYER" title="COMING SOON." seed={29} className="mp-page">
      <div className="mp-card">
        <span className="mp-chip">IN DEVELOPMENT</span>
        <h2>Ranked 1v1 matches are on the way.</h2>
        <p>
          Race another typist on the same snippet in real time. Matchmaking, live progress bars and
          ranked results will land here in a future update.
        </p>
        <button type="button" className="mp-cta" onClick={onPractice}>
          PRACTICE SOLO →
        </button>
      </div>
    </PageShell>
  );
}
