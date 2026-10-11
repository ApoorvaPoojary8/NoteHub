import React from "react";

import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";

import {

  ArrowRight,

  Bolt,

  BookOpenText,

  Check,

  CircleUserRound,

  ClipboardPenLine,

  FolderKanban,

  LockKeyhole,

  Menu,

  Search,

  ShieldCheck,

  X,

} from "lucide-react";

import { apiRequest } from "./api";





function useScrollAnimations() {
  React.useEffect(() => {
    const selector =
      ".hero-copy, .hero-art-wrap, .section-heading, " +
      ".feature-card, .bottom-cta-inner, .dashboard-heading, " +
      ".stat-card, .note-card";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    const observeElements = (root) => {
      if (root.matches?.(selector)) {
        observer.observe(root);
      }

      root.querySelectorAll?.(selector).forEach((element) => {
        observer.observe(element);
      });
    };

    observeElements(document);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            observeElements(node);
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);
}






const Logo = () => (

  <Link className="brand" to="/" aria-label="NoteHub home">

    <span className="brand-mark"><BookOpenText size={21} strokeWidth={2.4} /></span>

    <span>Note<span>Hub</span></span>

  </Link>

);



function Navbar() {

  const [menuOpen, setMenuOpen] = React.useState(false);

  return (

    <header className="site-header">

      <div className="nav-inner">

        <Logo />

        <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">

          {menuOpen ? <X size={22} /> : <Menu size={22} />}

        </button>

        <nav className={`main-nav ${menuOpen ? "open" : ""}`}>

          <a className="active" href="#home" onClick={() => setMenuOpen(false)}>Home</a>

          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>

          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>

        </nav>

        <div className="nav-actions">

          <Link className="button button-quiet" to="/login">Login</Link>

          <Link className="button button-primary nav-signup" to="/signup">Sign Up</Link>

        </div>

      </div>

    </header>

  );

}



const features = [

  {

    icon: ClipboardPenLine,

    title: "Create Notes",

    tagline: "Jot down your ideas.",

    description: "Capture thoughts quickly in a focused writing space that helps you turn ideas into action."

  },

  {

    icon: FolderKanban,

    title: "Organize",

    tagline: "Keep everything in one place.",

    description: "Keep your notes tidy and easy to find as your projects, plans, and ideas grow."

  },

  {

    icon: Search,

    title: "Search",

    tagline: "Find notes instantly.",

    description: "Find the note you need without digging through pages of saved information."

  },

  {

    icon: ShieldCheck,

    title: "Secure",

    tagline: "Your notes stay private.",

    description: "Your personal workspace is designed to keep your notes organized and private."

  }

];



function Home() {

  const navigate = useNavigate();

   useScrollAnimations();

  return (

    <>

      <Navbar />

      <main id="home">

        <section className="hero">

          <div className="hero-glow hero-glow-top" />

          <div className="container hero-grid">

            <div className="hero-copy">

              <div className="eyebrow"><span className="pulse-dot" />YOUR DIGITAL NOTEBOOK</div>

              <h1>Capture Your <span>Ideas, Anytime</span></h1>

              <p className="hero-description">

                Create, organize and manage your notes easily. Stay productive and never lose your thoughts again.

              </p>

              <div className="hero-actions">

                <Link className="button button-primary button-large" to="/signup">

                  Get Started <ArrowRight size={18} className="arrow-icon" />

                </Link>

                <a className="button button-secondary button-large" href="#features">Learn More</a>

              </div>

              <div className="hero-meta">

                <span><Bolt size={17} /> Simple and organized</span>

                <span><LockKeyhole size={17} /> Your notes, your space</span>

              </div>

            </div>



            <div className="hero-art-wrap" aria-label="Illustration of digital notes">

              <div className="art-glow" />

              <div className="notes-art">

                <div className="art-window-bar"><span /><span /><span /><b>my workspace</b></div>

                <div className="art-board">

                  <div className="paper paper-back">

                    <div className="paper-mini-label">IDEAS</div>

                    <div className="paper-line wide" /><div className="paper-line" /><div className="paper-line short" />

                    <div className="paper-sticker">✦</div>

                  </div>

                  <div className="paper paper-front">

                    <div className="paper-top"><span className="orange-square"><ClipboardPenLine size={16}/></span><span className="paper-date">TODAY · 09:41</span></div>

                    <h3>Big ideas<br/><em>start small.</em></h3>

                    <p>Write it down.<br/>Make it happen.</p>

                    <div className="paper-footer"><span /> NOTE #024</div>

                  </div>

                  <div className="floating-note"><span className="tiny-check"><Check size={13}/></span><div><b>Project plan</b><small>Saved just now</small></div></div>

                  <div className="art-spark spark-one">✳</div>

                  <div className="art-spark spark-two">✦</div>

                </div>

                <div className="art-status"><span className="status-light" /><b>Workspace ready</b><span className="status-right">ALL NOTES SYNCED</span></div>

              </div>

            </div>

          </div>

        </section>



        <section className="features-section" id="features">

          <div className="container">

            <div className="section-heading">

              <span className="section-kicker">STREAMLINED WORKFLOW</span>

              <h2>Everything you need to <span>think clearly</span></h2>

              <p>A calm, organized home for everything on your mind.</p>

            </div>

            <div className="feature-grid">

              {features.map(({ icon: Icon, title, tagline, description }) => (

                <article className="feature-card" key={title}>

                  <div className="feature-icon"><Icon size={25} strokeWidth={1.9} /></div>

                  <h3>{title}</h3>

                  <p className="feature-tagline">{tagline}</p>

                  <p className="feature-description">{description}</p>

                </article>

              ))}

            </div>

          </div>

        </section>



        <section className="bottom-cta" id="about">

          <div className="container bottom-cta-inner">

            <div>

              <span className="section-kicker">MAKE SPACE FOR YOUR IDEAS</span>

              <h2>Your next great idea starts here.</h2>

              <p>Keep your thoughts together and get back to what matters.</p>

            </div>

            <button className="button button-primary button-large" onClick={() => navigate("/signup")}>

              Create your account <ArrowRight size={18} />

            </button>

          </div>

        </section>

      </main>

      <footer className="site-footer">

        <div className="container">

          <div className="footer-main">

            <div className="footer-brand">

              <Logo />

              <p>Capture, organize, and manage your notes with effortless clarity.</p>

            </div>

            <nav className="footer-nav">

              <a href="#home">Home</a><a href="#features">Features</a><a href="#about">About</a>

              <Link to="/login">Login</Link>

            </nav>

          </div>

          <div className="footer-bottom"><span>© {new Date().getFullYear()} NoteHub. All rights reserved.</span><span>Made for your ideas <span className="heart">✦</span></span></div>

        </div>

      </footer>

    </>

  );

}





function AuthPage({ mode }) {

  const isSignup = mode === "signup";

  const navigate = useNavigate();



  const [error, setError] = React.useState("");

  const [loading, setLoading] = React.useState(false);



  async function handleAuth(event) {

    event.preventDefault();

    setError("");



    const form = new FormData(event.currentTarget);



    const name = form.get("name")?.toString().trim() || "";

    const email =

      form.get("email")?.toString().trim().toLowerCase() || "";

    const password = form.get("password")?.toString() || "";

    const confirmPassword =

      form.get("confirmPassword")?.toString() || "";



    // Validate signup fields

    if (isSignup && name.length < 2) {

      setError("Please enter your full name.");

      return;

    }



    if (!email) {

      setError("Please enter your email address.");

      return;

    }



    if (!password) {

      setError("Please enter your password.");

      return;

    }



    if (isSignup && password.length < 8) {

      setError("Password must contain at least 8 characters.");

      return;

    }



    if (isSignup && password !== confirmPassword) {

      setError("Passwords do not match.");

      return;

    }



    setLoading(true);



    try {

      const endpoint = isSignup

        ? "/api/auth/signup"

        : "/api/auth/login";



      const payload = isSignup

        ? { name, email, password }

        : { email, password };



      const result = await apiRequest(endpoint, {

        method: "POST",

        body: JSON.stringify(payload),

      });



      if (!result?.access_token || !result?.user) {

        throw new Error("Invalid response from the server.");

      }



      sessionStorage.setItem("notehub_token", result.access_token);

      sessionStorage.setItem(

        "notehub_user",

        JSON.stringify(result.user)

      );



      navigate("/dashboard");

    } catch (err) {

      const message = err.message || "";



      if (message.toLowerCase().includes("already exists")) {

        setError("This email is already registered. Please log in.");

      } else if (

        message.toLowerCase().includes("incorrect email or password")

      ) {

        setError("Incorrect email or password. Please try again.");

      } else {

        setError(message || "Unable to authenticate. Please try again.");

      }

    } finally {

      setLoading(false);

    }

  }



  return (

    <>

      <Navbar />



      <main className="auth-page">

        <div className="auth-glow" />



        <section className="auth-card">

          <div className="auth-icon">

            <BookOpenText size={26} />

          </div>



          <span className="section-kicker">

            {isSignup

              ? "START SOMETHING GREAT"

              : "YOUR IDEAS ARE WAITING"}

          </span>



          <h1>{isSignup ? "Create Account" : "Welcome Back"}</h1>



          <p>

            {isSignup

              ? "Join NoteHub and start organizing your ideas."

              : "Log in to your account to continue."}

          </p>



          <form onSubmit={handleAuth}>

            {isSignup && (

              <label>

                Full Name

                <input

                  name="name"

                  required

                  minLength={2}

                  type="text"

                  placeholder="Enter your full name"

                  autoComplete="name"

                />

              </label>

            )}



            <label>

              Email Address

              <input

                name="email"

                required

                type="email"

                placeholder="Enter your email address"

                autoComplete="email"

              />

            </label>



            <label>

              Password

              <input

                name="password"

                required

                minLength={isSignup ? 8 : undefined}

                type="password"

                placeholder={

                  isSignup

                    ? "Create a password (8+ characters)"

                    : "Enter your password"

                }

                autoComplete={

                  isSignup ? "new-password" : "current-password"

                }

              />

            </label>



            {isSignup && (

              <label>

                Confirm Password

                <input

                  name="confirmPassword"

                  required

                  minLength={8}

                  type="password"

                  placeholder="Confirm your password"

                  autoComplete="new-password"

                />

              </label>

            )}



            {!isSignup && (

              <div className="forgot-row">

                <a

                  href="#forgot"

                  onClick={(event) => {

                    event.preventDefault();

                    setError(

                      "Password reset is not available yet. Please contact the administrator."

                    );

                  }}

                >

                  Forgot Password?

                </a>

              </div>

            )}



            {error && (

              <p

                role="alert"

                aria-live="polite"

                style={{ color: "#ff6b6b" }}

              >

                {error}

              </p>

            )}



            <button

              className="button button-primary auth-submit"

              type="submit"

              disabled={loading}

            >

              {loading

                ? "Please wait..."

                : isSignup

                  ? "Create Account"

                  : "Login"}



              {!loading && <ArrowRight size={17} />}

            </button>

          </form>



          <div className="auth-switch">

            {isSignup

              ? "Already have an account?"

              : "Don't have an account?"}{" "}

            <Link to={isSignup ? "/login" : "/signup"}>

              {isSignup ? "Login" : "Sign Up"}

            </Link>

          </div>



          <Link className="back-home" to="/">

            ← Back to Home

          </Link>

        </section>

      </main>



      <footer className="auth-footer">

        © {new Date().getFullYear()} NoteHub. All rights reserved.

      </footer>

    </>

  );

}









function DashboardPreview() {

  useScrollAnimations();



  const navigate = useNavigate();



  const [notes, setNotes] = React.useState([]);

  const [query, setQuery] = React.useState("");

  const [modal, setModal] = React.useState(null);

  const [title, setTitle] = React.useState("");

  const [content, setContent] = React.useState("");

  const [category, setCategory] = React.useState("Personal");

  const [filter, setFilter] = React.useState("All Notes");

  const [loading, setLoading] = React.useState(true);

  const [saving, setSaving] = React.useState(false);

  const [error, setError] = React.useState("");



  const token = sessionStorage.getItem("notehub_token");



  const user = React.useMemo(() => {

    try {

      return JSON.parse(

        sessionStorage.getItem("notehub_user") || "null"

      );

    } catch {

      return null;

    }

  }, []);



  React.useEffect(() => {

    if (!token) {

      navigate("/login", { replace: true });

      return;

    }



    loadNotes();

  }, []);



  async function loadNotes() {
    setLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/notes", { token });
      console.log("NoteHub API response:", result);

      const items = Array.isArray(result)
        ? result
        : Array.isArray(result?.notes)
          ? result.notes
          : [];

      const normalizedNotes = items.map((note) => ({
        ...note,
        id: String(note.id || note._id || ""),
        title: note.title || "Untitled Note",
        content: note.content || "",
        category: String(note.category || "Personal").trim(),
      }));

      console.log("NoteHub notes loaded:", normalizedNotes);
      setNotes(normalizedNotes);
    } catch (err) {
      console.error("Unable to load NoteHub notes:", err);
      setError(err.message || "Unable to load your notes.");
    } finally {
      setLoading(false);
    }
  }

  const visible = notes.filter((note) => {

    const matchesCategory =

      filter === "All Notes" || String(note.category || "Personal").toLowerCase() === filter.toLowerCase();



    const matchesSearch =

      `${note.title || ""} ${note.content || ""}`

        .toLowerCase()

        .includes(query.toLowerCase());



    return matchesCategory && matchesSearch;

  });



  function openCreate() {

    setError("");

    setModal({ id: null });

    setTitle("");

    setContent("");

    setCategory("Personal");

  }



  function openEdit(note) {

    setError("");

    setModal(note);

    setTitle(note.title || "");

    setContent(note.content || "");

    setCategory(note.category || "Personal");

  }



  async function saveNote(event) {

    event.preventDefault();

    setError("");



    if (!title.trim()) {

      setError("Please enter a note title.");

      return;

    }



    setSaving(true);



    try {

      const payload = {

        title: title.trim(),

        content: content.trim(),

        category,

      };



      if (modal?.id) {

        await apiRequest(`/api/notes/${modal.id}`, {

          method: "PUT",

          token,

          body: JSON.stringify(payload),

        });

      } else {

        await apiRequest("/api/notes", {

          method: "POST",

          token,

          body: JSON.stringify(payload),

        });

      }



      setModal(null);

      await loadNotes();

    } catch (err) {

      setError(err.message || "Unable to save your note.");

    } finally {

      setSaving(false);

    }

  }



  async function deleteNote(id) {

    if (!window.confirm("Delete this note?")) return;



    setError("");



    try {

      await apiRequest(`/api/notes/${id}`, {

        method: "DELETE",

        token,

      });



      await loadNotes();

    } catch (err) {

      setError(err.message || "Unable to delete your note.");

    }

  }



  function logout() {

    sessionStorage.removeItem("notehub_token");

    sessionStorage.removeItem("notehub_user");

    navigate("/login", { replace: true });

  }



  function formatDate(note) {

    const value = note.updated_at || note.created_at;



    if (!value) return "Saved";



    const date = new Date(value);



    return Number.isNaN(date.getTime())

      ? "Saved"

      : date.toLocaleDateString();

  }



  return (

    <>

      <div className="dashboard-shell">

        <aside className="dashboard-sidebar">

          <Logo />



          <div className="sidebar-label">WORKSPACE</div>



          <button className="sidebar-link selected">

            <ClipboardPenLine size={18} />

            Dashboard

          </button>





          <div className="sidebar-label sidebar-label-bottom">

            ACCOUNT

          </div>



          <button className="sidebar-link" onClick={logout}>

            <ArrowRight size={18} />

            Log out

          </button>



          <div className="sidebar-user">

            <div className="avatar">

              {(user?.name || "U").charAt(0).toUpperCase()}

            </div>



            <div>

              <b>{user?.name || "NoteHub User"}</b>

              <small>{user?.email || "Personal workspace"}</small>

            </div>

          </div>

        </aside>



        <main className="dashboard-main">

          <header className="dashboard-toolbar">

            <div className="dashboard-search">

              <Search size={18} />

              <input

                value={query}

                onChange={(event) => setQuery(event.target.value)}

                placeholder="Search notes by title or content..."

              />

            </div>



            <button

              className="button button-primary"

              onClick={openCreate}

            >

              ＋ New Note

            </button>

          </header>



          <div className="dashboard-content">

            <div className="dashboard-heading">

              <div>

                <span className="section-kicker">YOUR WORKSPACE</span>

                <h1>

                  My Notes<span>.</span>

                </h1>

                <p>

                  Your personal notes, saved to your account.

                </p>

              </div>



              <div className="note-count">

                <b>{notes.length.toString().padStart(2, "0")}</b>

                <span>total notes</span>

              </div>

            </div>



            <div className="stats-row">

              <div className="stat-card">

                <span>Total Notes</span>

                <b>{notes.length}</b>

              </div>



              <div className="stat-card">

                <span>Categories</span>

                <b>

                  {new Set(notes.map((note) => note.category)).size}

                </b>

              </div>



              <div className="stat-card">

                <span>Account</span>

                <b>Personal</b>

              </div>

            </div>



            {error && (

              <p role="alert" style={{ color: "#ff6b6b" }}>

                {error}

              </p>

            )}



            <div className="notes-toolbar">

              <div className="filter-tabs">

                {["All Notes", "Study", "Work", "Personal"].map(

                  (item) => (

                    <button

                      key={item}

                      className={

                        filter === item

                          ? "filter-tab active"

                          : "filter-tab"

                      }

                      onClick={() => setFilter(item)}

                    >

                      {item}

                    </button>

                  )

                )}

              </div>



              <span className="results-count">

                {visible.length} notes

              </span>

            </div>



            {loading ? (

              <div className="empty-state">

                <p>Loading your notes...</p>

              </div>

            ) : visible.length > 0 ? (

              <div className="notes-grid">

                {visible.map((note) => (

                  <article className="note-card" key={note.id}>

                    <div className="note-card-top">

                      <span

                        className={`category-chip ${(note.category || "Personal").toLowerCase()}`}

                      >

                        {note.category || "Personal"}

                      </span>



                      <button

                        className="icon-button"

                        title="Delete note"

                        onClick={() => deleteNote(note.id)}

                      >

                        ×

                      </button>

                    </div>



                    <h2>{note.title}</h2>

                    <p>{note.content}</p>



                    <div className="note-card-footer">

                      <span>{formatDate(note)}</span>



                      <button

                        className="edit-link"

                        onClick={() => openEdit(note)}

                      >

                        Edit <ArrowRight size={14} />

                      </button>

                    </div>

                  </article>

                ))}

              </div>

            ) : (

              <div className="empty-state">

                <BookOpenText size={34} />

                <h2>No notes found</h2>

                <p>

                  {query || filter !== "All Notes"

                    ? "Try another search or category."

                    : "Create your first note to get started."}

                </p>



                <button

                  className="button button-primary"

                  onClick={openCreate}

                >

                  Create a note

                </button>

              </div>

            )}

          </div>

        </main>

      </div>



      {modal && (

        <div

          className="modal-backdrop"

          onMouseDown={(event) => {

            if (event.target === event.currentTarget && !saving) {

              setModal(null);

              setError("");

            }

          }}

        >

          <form className="note-modal" onSubmit={saveNote}>

            <div className="modal-heading">

              <div>

                <span className="section-kicker">

                  {modal.id ? "MAKE IT BETTER" : "GET IT DOWN"}

                </span>



                <h2>{modal.id ? "Edit Note" : "Create Note"}</h2>

              </div>



              <button

                type="button"

                className="icon-button modal-close"

                disabled={saving}

                onClick={() => {

                  setModal(null);

                  setError("");

                }}

              >

                ×

              </button>

            </div>



            {error && (

              <p role="alert" style={{ color: "#ff6b6b" }}>

                {error}

              </p>

            )}



            <label>

              Title

              <input

                autoFocus

                value={title}

                onChange={(event) => setTitle(event.target.value)}

                placeholder="Give your note a title"

                required

              />

            </label>



            <label>

              Category

              <select

                value={category}

                onChange={(event) => setCategory(event.target.value)}

              >

                <option>Personal</option>

                <option>Study</option>

                <option>Work</option>

              </select>

            </label>



            <label>

              Content

              <textarea

                value={content}

                onChange={(event) => setContent(event.target.value)}

                placeholder="Start writing your thoughts..."

                rows={6}

              />

            </label>



            <div className="modal-actions">

              <button

                type="button"

                className="button button-secondary"

                disabled={saving}

                onClick={() => {

                  setModal(null);

                  setError("");

                }}

              >

                Cancel

              </button>



              <button

                className="button button-primary"

                type="submit"

                disabled={saving}

              >

                {saving ? "Saving..." : "Save Note"}

              </button>

            </div>

          </form>

        </div>

      )}

    </>

  );

}





function NotFound() {

  return <div className="not-found"><h1>Page not found</h1><Link className="button button-primary" to="/">Back to Home</Link></div>;

}



export default function App() {

  return <Routes>

    <Route path="/" element={<Home />} />

    <Route path="/signup" element={<AuthPage mode="signup" />} />

    <Route path="/login" element={<AuthPage mode="login" />} />

    <Route path="/dashboard" element={<DashboardPreview />} />

    <Route path="*" element={<NotFound />} />

  </Routes>;

}
