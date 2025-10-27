import './Story.css'

export function Story() {
  return (
    <section id="story" className="story-section">
      <div className="story-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">My Story</h2>
          <div className="title-line" />
        </div>

        <div className="story-content">
          {/* The Journey */}
          <div className="story-card">
            <div className="story-icon">🚀</div>
            <h3 className="story-subtitle">The Journey</h3>
            <p className="story-text">
              I didn't start out wanting to govern $5M+ CRM platforms. I started out fascinated by how systems could solve real human problems. Early in my career at EVO Payments, I watched underwriting teams drown in manual processes — and I saw an opportunity. By integrating SQL-based scoring models with our core systems, we cut turnaround time by 60%. Watching that team go home earlier, less stressed? That's when I knew.
            </p>
          </div>

          {/* The Philosophy */}
          <div className="story-card">
            <div className="story-icon">💡</div>
            <h3 className="story-subtitle">The Philosophy</h3>
            <p className="story-text">
              Today I operate at Fortune 500 scale, but that same drive remains: <strong>automate the tedious, elevate the human</strong>. Whether it's unifying 3,000+ users across 22 countries or building particle systems at 60 FPS, I approach every challenge the same way — with curiosity, precision, and a relentless focus on making complex things feel simple.
            </p>
          </div>

          {/* The Multi-Passionate Mind */}
          <div className="story-card">
            <div className="story-icon">🎨</div>
            <h3 className="story-subtitle">The Multi-Passionate Mind</h3>
            <p className="story-text">
              Outside work, I'm flying drones to capture 360° aerial photography, producing music, creating digital art, or experimenting with AI/ML projects. Why? Because <strong>curiosity makes better strategists</strong>. The best enterprise architects don't just understand technology — they understand creativity, user experience, and the art of making data tell stories.
            </p>
          </div>

          {/* What's Next */}
          <div className="story-card story-card-highlight">
            <div className="story-icon">🎯</div>
            <h3 className="story-subtitle">What's Next</h3>
            <p className="story-text">
              I'm seeking <strong>Director/VP roles</strong> in Enterprise Platforms, Global CRM Strategy, or Digital Transformation Leadership — where I can architect transformation strategies at scale, lead cross-functional teams through complex change, and prove that the best technology leaders never stop creating.
            </p>
            <div className="story-cta">
              <a href="#contact" className="story-cta-button">Let's Connect</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
