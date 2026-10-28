import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const LEVEL_INFO = {
  Beginner: "Gentle foundations, breathing, and easy-to-follow poses.",
  Intermediate: "Build strength, flexibility, balance, and steady flow.",
  Advanced: "Challenging flows for experienced and confident practitioners."
};
const HERO_IMAGE = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1800&q=85";
const LEVEL_IMAGES = {
  Beginner: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
  Intermediate: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=80",
  Advanced: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=900&q=80"
};
const emptyForm = { sessionName: "", instructor: "", duration: "", sessionDate: "", availableSlots: "", level: "Beginner" };
const LEVEL_STORAGE_KEY = "yoga-session-levels-v1";

function readLevelMap() {
  try { return JSON.parse(localStorage.getItem(LEVEL_STORAGE_KEY) || "{}"); }
  catch { return {}; }
}
function sessionKey(session) {
  return `${session.sessionName || ""}|${session.instructor || ""}|${session.sessionDate || ""}`;
}

function App() {
  const [page, setPage] = useState("Home");
  const [sessions, setSessions] = useState([]);
  const [levelMap, setLevelMap] = useState(readLevelMap);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterLevel, setFilterLevel] = useState("All");

  const saveLevelMap = (next) => {
    setLevelMap(next);
    localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(next));
  };

  const request = async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers }
    });
    const text = await response.text();
    if (!response.ok) throw new Error(text || `Request failed with status ${response.status}`);
    if (!text) return null;
    try { return JSON.parse(text); } catch { return text; }
  };

  const loadSessions = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await request("/displayAll");
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Could not load sessions. Check that the backend is running at ${API_URL}. ${err.message}`);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };
  const resetForm = () => { setForm(emptyForm); setEditingId(null); };
  const goToAdd = () => { resetForm(); setMessage(""); setError(""); setPage("Add Session"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleSubmit = async (event) => {
    event.preventDefault(); setMessage(""); setError("");
    const payload = {
      sessionName: form.sessionName.trim(),
      instructor: form.instructor.trim(),
      duration: Number(form.duration),
      sessionDate: form.sessionDate,
      availableSlots: Number(form.availableSlots)
    };
    try {
      if (editingId !== null) {
        await request(`/update/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
        setMessage("Yoga session updated successfully.");
      } else {
        await request("/addYogaSession", { method: "POST", body: JSON.stringify(payload) });
        setMessage("Yoga session added successfully.");
      }
      const key = sessionKey(payload);
      saveLevelMap({ ...levelMap, [key]: form.level });
      resetForm(); await loadSessions(); setPage("Sessions");
    } catch (err) { setError(`Could not save the session. ${err.message}`); }
  };

  const handleEdit = (session) => {
    setEditingId(session.id);
    setForm({
      sessionName: session.sessionName ?? "", instructor: session.instructor ?? "",
      duration: String(session.duration ?? ""), sessionDate: session.sessionDate ?? "",
      availableSlots: String(session.availableSlots ?? ""), level: levelMap[sessionKey(session)] || "Beginner"
    });
    setMessage(""); setError(""); setPage("Add Session"); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (session) => {
    if (!window.confirm(`Delete yoga session ${session.id}?`)) return;
    setMessage(""); setError("");
    try {
      await request(`/delete/${session.id}`, { method: "DELETE" });
      const next = { ...levelMap }; delete next[sessionKey(session)]; saveLevelMap(next);
      setMessage("Yoga session deleted successfully."); if (editingId === session.id) resetForm(); await loadSessions();
    } catch (err) { setError(`Could not delete the session. ${err.message}`); }
  };

  const getLevel = (session) => levelMap[sessionKey(session)] || "Beginner";
  const filteredSessions = useMemo(() => filterLevel === "All" ? sessions : sessions.filter((s) => getLevel(s) === filterLevel), [sessions, filterLevel, levelMap]);
  const navItems = ["Home", "Sessions", "Add Session", "Learning Levels", "About"];

  return (
    <main className="page">
      <nav className="top-nav" aria-label="Main navigation">
        <button className="brand" onClick={() => setPage("Home")}><span className="brand-mark">ॐ</span><span>Serene<span className="brand-light">Yoga</span></span></button>
        <div className="nav-links">
          {navItems.map((item) => <button key={item} className={`nav-link ${page === item ? "active" : ""}`} onClick={() => item === "Add Session" ? goToAdd() : setPage(item)}>{item}</button>)}
        </div>
        <button className="button primary nav-cta" onClick={goToAdd}>+ Add Session</button>
      </nav>

      {page === "Home" && <>
        <header className="welcome-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(13,55,48,.88), rgba(13,55,48,.42)), url('${HERO_IMAGE}')` }}>
          <div className="welcome-copy">
            <p className="eyebrow">BREATHE IN · FIND YOUR BALANCE</p>
            <h1>Welcome to your<br /><em>moment of calm.</em></h1>
            <p className="welcome-text">Make space for yourself. Explore mindful movement, build a steady practice, and find the yoga session that feels right for you.</p>
            <div className="welcome-actions"><button className="button primary large-button" onClick={() => setPage("Learning Levels")}>Explore yoga levels <span>→</span></button><button className="button glass-button" onClick={() => setPage("Sessions")}>View sessions</button></div>
            <div className="hero-note"><span>✦</span> Every breath is a fresh beginning</div>
          </div>
          <div className="hero-photo-caption"><span className="caption-dot" /> A little time for you</div>
        </header>
        <section className="home-content">
          <div className="intro-row"><div><p className="eyebrow">YOUR PRACTICE, YOUR PACE</p><h2>Find your flow</h2></div><p className="intro-description">Whether you are just starting out or deepening your practice, there is a place for you on the mat.</p></div>
          <div className="level-grid">{LEVELS.map((level, index) => <article className="level-card" key={level}><img src={LEVEL_IMAGES[level]} alt={`${level} yoga practice`} loading="lazy" /><div className="level-card-content"><span className="level-number">0{index + 1} / LEVEL</span><h3>{level}</h3><p>{LEVEL_INFO[level]}</p><button className="card-link" onClick={() => { setFilterLevel(level); setPage("Sessions"); }}>Explore {level.toLowerCase()} <span>↗</span></button></div></article>)}</div>
          <div className="home-bottom"><div><p className="eyebrow">READY WHEN YOU ARE</p><h2>Your next session starts here.</h2></div><button className="button primary large-button" onClick={goToAdd}>Create a session <span>→</span></button></div>
        </section>
      </>}

      {page === "Sessions" && <section className="page-section">
        <div className="page-title-row"><div><p className="eyebrow">YOUR WELLNESS SCHEDULE</p><h1 className="inner-title">Yoga sessions</h1><p className="muted-copy">Explore the schedule and manage your sessions.</p></div><button className="button primary" onClick={goToAdd}>+ Add session</button></div>
        {message && <div className="notice success" role="status">{message}</div>}{error && <div className="notice error" role="alert">{error}</div>}
        <div className="filter-row"><div className="filter-pills"><button className={filterLevel === "All" ? "filter-pill selected" : "filter-pill"} onClick={() => setFilterLevel("All")}>All levels</button>{LEVELS.map((level) => <button key={level} className={filterLevel === level ? "filter-pill selected" : "filter-pill"} onClick={() => setFilterLevel(level)}>{level}</button>)}</div><button className="button secondary" onClick={loadSessions} type="button">↻ Refresh</button></div>
        {loading ? <div className="empty-state">Loading sessions…</div> : filteredSessions.length === 0 ? <div className="empty-state"><div className="empty-icon">☀</div><h3>No sessions found</h3><p>Add a session or choose another level filter.</p><button className="button primary" onClick={goToAdd}>Add your first session</button></div> : <div className="session-card-grid">{filteredSessions.map((session) => <article className="session-card" key={session.id}><div className="session-card-image" style={{ backgroundImage: `url('${LEVEL_IMAGES[getLevel(session)]}')` }}><span className={`level-badge ${getLevel(session).toLowerCase()}`}>{getLevel(session)}</span></div><div className="session-card-body"><p className="session-date">{session.sessionDate || "Date to be announced"}</p><h3>{session.sessionName}</h3><p className="instructor-line">With {session.instructor}</p><div className="session-meta"><span>◷ {session.duration} min</span><span>♧ {session.availableSlots} spots</span></div><div className="session-card-actions"><button className="text-button edit" onClick={() => handleEdit(session)}>Edit session</button><button className="text-button delete" onClick={() => handleDelete(session)}>Delete</button></div></div></article>)}</div>}
      </section>}

      {page === "Add Session" && <section className="page-section form-page">
        <button className="back-link" onClick={() => setPage("Sessions")}>← Back to sessions</button>
        <div className="form-layout"><div className="form-side-image" style={{ backgroundImage: `linear-gradient(180deg, rgba(13,55,48,.1), rgba(13,55,48,.72)), url('${HERO_IMAGE}')` }}><div><p className="eyebrow">MAKE ROOM FOR WELLNESS</p><h2>{editingId !== null ? "Refine your practice." : "Create a space to breathe."}</h2><p>Plan a session that brings people together through movement and mindfulness.</p></div></div>
          <section className="panel form-panel"><div className="section-heading"><div><p className="eyebrow">SESSION DETAILS</p><h2>{editingId !== null ? "Update session" : "Add a session"}</h2></div><span className="heading-mark">✦</span></div>
            {message && <div className="notice success" role="status">{message}</div>}{error && <div className="notice error" role="alert">{error}</div>}
            <form onSubmit={handleSubmit}><div className="form-grid">
              <label>Session name<input name="sessionName" value={form.sessionName} onChange={handleChange} placeholder="Morning Flow Yoga" required maxLength="100" /></label>
              <label>Instructor<input name="instructor" value={form.instructor} onChange={handleChange} placeholder="Instructor name" required maxLength="100" /></label>
              <label>Duration (minutes)<input name="duration" type="number" min="1" value={form.duration} onChange={handleChange} placeholder="60" required /></label>
              <label>Session date<input name="sessionDate" type="date" value={form.sessionDate} onChange={handleChange} required /></label>
              <label>Available slots<input name="availableSlots" type="number" min="0" value={form.availableSlots} onChange={handleChange} placeholder="20" required /></label>
              <label>Session level<select name="level" value={form.level} onChange={handleChange} required>{LEVELS.map((level) => <option key={level}>{level}</option>)}</select></label>
            </div><div className="level-preview"><img src={LEVEL_IMAGES[form.level]} alt="Selected yoga level" /><div><span className={`level-badge ${form.level.toLowerCase()}`}>{form.level}</span><p>{LEVEL_INFO[form.level]}</p></div></div>
            <p className="helper-note">Session level is saved in this browser. The existing backend API accepts the five session fields above; add a <code>level</code> field to your Java entity if you want levels stored in PostgreSQL and shared across devices.</p>
            <div className="form-actions"><button className="button primary" type="submit">{editingId !== null ? "Save changes" : "Create session"}</button><button className="button secondary" type="button" onClick={() => { resetForm(); setPage("Sessions"); }}>Cancel</button></div></form>
          </section></div>
      </section>}

      {page === "Learning Levels" && <section className="page-section"><div className="centered-page-heading"><p className="eyebrow">START WHERE YOU ARE</p><h1 className="inner-title">Choose your practice</h1><p className="muted-copy">Every level is an invitation to listen to your body and move with intention.</p></div><div className="level-detail-grid">{LEVELS.map((level, index) => <article className="level-detail-card" key={level}><img src={LEVEL_IMAGES[level]} alt={`${level} yoga`} /><div className="level-detail-content"><span className="level-number">LEVEL 0{index + 1}</span><h2>{level}</h2><p>{LEVEL_INFO[level]}</p><ul>{(level === "Beginner" ? ["Learn foundational poses", "Practice mindful breathing", "Build confidence at your pace"] : level === "Intermediate" ? ["Connect poses into flowing sequences", "Improve strength and flexibility", "Develop balance and focus"] : ["Explore advanced transitions", "Challenge strength and stability", "Deepen an established practice"]).map((item) => <li key={item}>{item}</li>)}</ul><button className="button primary" onClick={() => { setFilterLevel(level); setPage("Sessions"); }}>View {level} sessions →</button></div></article>)}</div></section>}

      {page === "About" && <section className="page-section about-page"><div className="about-image" style={{ backgroundImage: `url('${HERO_IMAGE}')` }} /><div className="about-copy"><p className="eyebrow">A GENTLER WAY TO GROW</p><h1 className="inner-title">Wellness begins with one breath.</h1><p>Serene Yoga is a simple space to organise yoga sessions, discover practice levels, and make mindful movement part of everyday life.</p><p>Choose Beginner, Intermediate, or Advanced based on your comfort and experience. Move at your own pace, stay curious, and give yourself time to grow.</p><div className="about-stats"><div><strong>{sessions.length}</strong><span>Sessions listed</span></div><div><strong>3</strong><span>Practice levels</span></div><div><strong>1</strong><span>Breath at a time</span></div></div><button className="button primary large-button" onClick={goToAdd}>Plan a session →</button></div></section>}

      <footer className="site-footer"><span>ॐ Serene Yoga</span><span>Wellness · Balance · Mindfulness</span><span>Yoga Session Service · React frontend</span></footer>
    </main>
  );
}

export default App;
