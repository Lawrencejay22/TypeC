import MatrixBg from "./component/MatrixBg.jsx";
import "./about.css";

function TypeBadge() {
  return (
    <span className="about-badge" aria-label="C">
      <span>C</span>
    </span>
  );
}

const sections = [
  {
    id: "what",
    title: (
      <>
        WHAT IS TYPE <TypeBadge /> ?
      </>
    ),
    body: "TypeC is a web-based typing test designed for people who want to practice typing while learning code snippets from languages like Java, Python, and C++.",
  },
  {
    id: "why",
    title: (
      <>
        WHY WE CREATED TYPE <TypeBadge />
      </>
    ),
    body: "We created TypeC to combine typing practice with programming. Our goal is to make coding practice more interactive and enjoyable while helping users improve their speed, accuracy, and familiarity with code syntax.",
  },
  {
    id: "how",
    title: (
      <>
        HOW TYPE <TypeBadge /> WORKS
      </>
    ),
    body: "Choose a language, type a given snippet as accurately and quickly as possible, then view your results. TypeC tracks your WPM, accuracy, errors, and progress so you can see how your skills improve over time.",
  },
];

export default function About() {
  return (
    <section className="about-page">
      <MatrixBg seed={23} />

      <h1 className="about-title">ABOUT</h1>

      <div className="about-grid">
        {sections.map((section) => (
          <article key={section.id} className="about-card">
            <h2 className="about-heading">{section.title}</h2>
            <p className="about-text">{section.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
