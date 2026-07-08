import { useState, useRef, useEffect } from "react";
import { supabase } from './supabaseClient';

/*
  NOTE ON HEAD TAGS
  ------------------
  The original file's <head> contained page-level tags that don't belong
  inside a React component:

    <title>Blog Studio — Negi Physiotherapy Clinic</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  Add these to public/index.html <head> (or your Head-management tool of
  choice) when this page mounts. The "noindex, nofollow" robots tag is
  important to keep since this is an internal admin tool, not something you
  want search engines crawling.

  EVERYTHING ELSE — every label, button, empty-state message, toolbar icon,
  hint, modal, toast copy, and the entire scoped stylesheet — is preserved
  exactly as it was in the original HTML/vanilla-JS file below.

  ARCHITECTURE NOTES (behavior-preserving, not content-changing):
  - The rich text editor (`contentEditable`) is still managed imperatively via
    a ref + document.execCommand, exactly like the original — this is the
    standard approach even in React, since contentEditable doesn't play well
    with controlled state.
  - Text fields (title, category, author, excerpt) are uncontrolled refs,
    read only at save time — matching the original's behavior of only
    reading .value when needed, rather than two-way binding every keystroke.
  - Both views (list / editor) are always mounted and toggled with a CSS
    class, exactly like the original's .npc-view / .npc-active pattern, so
    refs never go stale when switching views.
  - localStorage read/write, slugify, uid, date formatting, and all thresholds
    (2600ms toast, 80px popover offset, etc.) are unchanged.
*/

const STORAGE_KEY = "npc_blog_posts_v1";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

function uid() {
  return "p_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}

function slugify(str) {
  return (
    (str || "")
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80) || "untitled-post"
  );
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function BlogStudio() {
  const [view, setView] = useState("list"); // 'list' | 'editor' | 'login'
  const [posts, setPosts] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [currentThumb, setCurrentThumb] = useState(null);
  const [slugPreview, setSlugPreview] = useState("your-post-title");
  const [wordCount, setWordCount] = useState("0 words");
  const [readTime, setReadTime] = useState("~0 min read");
  const [savedStatus, setSavedStatus] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "Saved", error: false });
  const [confirmOverlay, setConfirmOverlay] = useState({ show: false });
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [linkPopover, setLinkPopover] = useState({ show: false, top: 0, left: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const titleRef = useRef(null);
  const categoryRef = useRef(null);
  const authorRef = useRef(null);
  const excerptRef = useRef(null);
  const contentRef = useRef(null);
  const thumbInputRef = useRef(null);
  const inlineImageInputRef = useRef(null);
  const linkInputRef = useRef(null);
  const linkBtnRef = useRef(null);
  const linkPopoverRef = useRef(null);

  const savedRangeRef = useRef(null);
  const savedStatusRef = useRef(true);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    savedStatusRef.current = savedStatus;
  }, [savedStatus]);

  async function loadPostsFromSupabase() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, category, author, excerpt, content, thumb, status, created_at, updated_at')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (e) {
      console.error('Error loading posts:', e);
      showToast('Error loading posts', true);
      setPosts([]);
    }
  }

  /* ---------------- Init ---------------- */
  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadPostsFromSupabase();
    } else {
      setView('login');
    }
  }, []);

  /* Warn before leaving with unsaved changes */
  useEffect(() => {
    function handler(e) {
      if (!savedStatusRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  /* Close link popover on outside click */
  useEffect(() => {
    function handleDocClick(e) {
      if (
        linkPopoverRef.current &&
        !linkPopoverRef.current.contains(e.target) &&
        e.target !== linkBtnRef.current
      ) {
        setLinkPopover((p) => (p.show ? { ...p, show: false } : p));
      }
    }
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  async function persistToSupabase(postData) {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .upsert(postData);
      
      if (error) {
        console.error('Supabase error:', error);
        showToast(`Error: ${error.message}`, true);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Error saving post:', e);
      showToast(`Error: ${e.message}`, true);
      return false;
    }
  }

  function showToast(message, isError) {
    clearTimeout(toastTimeoutRef.current);
    setToast({ show: true, message, error: !!isError });
    toastTimeoutRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 2600);
  }

  function updateWordCount() {
    const text = contentRef.current ? contentRef.current.innerText || "" : "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words + " word" + (words === 1 ? "" : "s"));
    setReadTime("~" + Math.max(1, Math.round(words / 200)) + " min read");
  }

  /* ---------------- Editor open / new ---------------- */
  function newPost() {
    setCurrentId(null);
    setCurrentThumb(null);
    if (titleRef.current) titleRef.current.value = "";
    if (categoryRef.current) categoryRef.current.value = "Patient Tips";
    if (authorRef.current) authorRef.current.value = "Dr. Mangesh Negi";
    if (excerptRef.current) excerptRef.current.value = "";
    if (contentRef.current) contentRef.current.innerHTML = "";
    setSlugPreview("your-post-title");
    setWordCount("0 words");
    setReadTime("~0 min read");
    setView("editor");
    window.scrollTo(0, 0);
    setSavedStatus(true);
  }

  function openEditor(id) {
    const p = posts.find((x) => x.id === id);
    if (!p) return;
    setCurrentId(id);
    setCurrentThumb(p.thumb || null);
    if (titleRef.current) titleRef.current.value = p.title || "";
    if (categoryRef.current) categoryRef.current.value = p.category || "Patient Tips";
    if (authorRef.current) authorRef.current.value = p.author || "Dr. Mangesh Negi";
    if (excerptRef.current) excerptRef.current.value = p.excerpt || "";
    if (contentRef.current) contentRef.current.innerHTML = p.content || "";
    setSlugPreview(p.slug || slugify(p.title));
    setView("editor");
    updateWordCount();
    window.scrollTo(0, 0);
    setSavedStatus(true);
  }

  function showList() {
    setView("list");
    loadPostsFromSupabase();
    window.scrollTo(0, 0);
  }

  /* ---------------- Save / delete ---------------- */
  function collectPostData(status) {
    const title = titleRef.current ? titleRef.current.value.trim() : "";
    const existing = posts.find((x) => x.id === currentId);
    return {
      id: currentId || uid(),
      title,
      slug: slugify(title),
      category: categoryRef.current ? categoryRef.current.value : "Patient Tips",
      author: (authorRef.current && authorRef.current.value.trim()) || "Dr. Mangesh Negi",
      excerpt: excerptRef.current ? excerptRef.current.value.trim() : "",
      content: contentRef.current ? contentRef.current.innerHTML.trim() : "",
      thumb: currentThumb,
      status,
      created_at: existing ? existing.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async function savePost(status) {
    const title = titleRef.current ? titleRef.current.value.trim() : "";
    if (!title) {
      showToast("Add a title before saving", true);
      if (titleRef.current) titleRef.current.focus();
      return;
    }
    
    setIsLoading(true);
    const data = collectPostData(status);
    const ok = await persistToSupabase(data);
    setIsLoading(false);
    
    if (ok) {
      const idx = posts.findIndex((x) => x.id === data.id);
      const next = idx >= 0 ? posts.map((p, i) => (i === idx ? data : p)) : [...posts, data];
      setPosts(next);
      setCurrentId(data.id);
      setSavedStatus(true);
      showToast(status === "published" ? "Published ✓" : "Draft saved ✓");
      if (status === "published") {
        setView("list");
      }
    }
  }

  async function deletePost(id) {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      const next = posts.filter((x) => x.id !== id);
      setPosts(next);
      showToast("Post deleted");
      setView("list");
    } catch (e) {
      console.error('Error deleting post:', e);
      showToast('Error deleting post', true);
    }
  }

  /* ---------------- Copy for website ---------------- */
  function copyPostJson(p) {
    const payload = JSON.stringify(p, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(payload)
        .then(() => showToast("Copied — send this to your developer to publish it live"))
        .catch(() => showToast("Couldn't copy automatically — long-press to copy manually", true));
    } else {
      showToast("Copying isn't supported in this browser", true);
    }
  }

  /* ---------------- Rich text toolbar ---------------- */
  function handleToolbarCommand(cmd) {
    if (contentRef.current) contentRef.current.focus();
    document.execCommand(cmd, false, null);
  }

  function handleBlockChange(e) {
    if (contentRef.current) contentRef.current.focus();
    const tag = e.target.value;
    document.execCommand("formatBlock", false, tag === "p" ? "P" : tag.toUpperCase());
    e.target.value = "p";
  }

  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0);
  }

  function handleLinkButtonClick() {
    saveSelection();
    const rect = linkBtnRef.current.getBoundingClientRect();
    setLinkPopover({
      show: true,
      top: rect.bottom + window.scrollY + 6,
      left: Math.max(10, rect.left + window.scrollX - 80),
    });
    if (linkInputRef.current) linkInputRef.current.value = "";
    setTimeout(() => {
      if (linkInputRef.current) linkInputRef.current.focus();
    }, 0);
  }

  function applyLink() {
    const raw = linkInputRef.current ? linkInputRef.current.value.trim() : "";
    setLinkPopover((p) => ({ ...p, show: false }));
    if (!raw) return;
    const url = /^https?:\/\//i.test(raw) ? raw : "https://" + raw;
    if (contentRef.current) contentRef.current.focus();
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
    document.execCommand("createLink", false, url);
  }

  function handleImageButtonClick() {
    saveSelection();
    if (inlineImageInputRef.current) {
      inlineImageInputRef.current.value = "";
      inlineImageInputRef.current.click();
    }
  }

  function handleInlineImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (contentRef.current) contentRef.current.focus();
      if (savedRangeRef.current) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
      document.execCommand("insertImage", false, reader.result);
      updateWordCount();
    };
    reader.readAsDataURL(file);
  }

  function handleContentInput() {
    updateWordCount();
    setSavedStatus(false);
  }

  /* ---------------- Thumbnail upload ---------------- */
  function handleThumbDropClick() {
    if (thumbInputRef.current) {
      thumbInputRef.current.value = "";
      thumbInputRef.current.click();
    }
  }

  function handleThumbChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCurrentThumb(reader.result);
      setSavedStatus(false);
    };
    reader.readAsDataURL(file);
  }

  /* ---------------- Field listeners ---------------- */
  function handleTitleInput() {
    setSlugPreview(slugify(titleRef.current ? titleRef.current.value : "") || "your-post-title");
    setSavedStatus(false);
  }

  function handleGenericFieldInput() {
    setSavedStatus(false);
  }

  /* ---------------- Delete flow ---------------- */
  function handleDeleteClick() {
    setPendingDeleteId(currentId);
    setConfirmOverlay({ show: true });
  }
  function handleConfirmCancel() {
    setConfirmOverlay({ show: false });
    setPendingDeleteId(null);
  }
  function handleConfirmOk() {
    if (pendingDeleteId) deletePost(pendingDeleteId);
    setConfirmOverlay({ show: false });
    setPendingDeleteId(null);
  }

  /* ---------------- Authentication ---------------- */
  function handleLogin(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      setPassword('');
      setView('list');
      loadPostsFromSupabase();
      showToast('Welcome back!');
    } else {
      showToast('Incorrect password', true);
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setView('login');
    setPassword('');
    showToast('Logged out');
  }

  const sortedPosts = [...posts].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const postCountText =
    posts.length === 0
      ? "No posts yet"
      : `${posts.length} post${posts.length === 1 ? "" : "s"} · ${publishedCount} published`;

  return (
    <div className="npc-blog-admin" id="npcApp">
      <style>{`
  .npc-blog-admin{
    --teal-900:#0d2b2b;
    --teal-800:#123838;
    --teal-700:#1a4949;
    --teal-600:#245c5c;
    --brass:#bd9457;
    --brass-light:#d8b878;
    --brass-dim:#8a7048;
    --brass-wash:#f6ecd9;
    --bg:#fbfaf7;
    --surface:#ffffff;
    --surface-alt:#f3efe6;
    --border:#e6e1d5;
    --ink:#1c2321;
    --ink-dim:#6b6f6a;
    --danger:#c1584a;
    --ok:#4f8f6d;
    --radius:14px;
    --radius-sm:8px;
    font-family:'Inter',sans-serif;
    background:var(--bg);
    color:var(--ink);
    min-height:100vh;
    width:100%;
    box-sizing:border-box;
    -webkit-font-smoothing:antialiased;
  }
  .npc-blog-admin *{box-sizing:border-box;}
  .npc-blog-admin h1,.npc-blog-admin h2,.npc-blog-admin h3,
  .npc-blog-admin .npc-brand,.npc-blog-admin button,.npc-blog-admin .npc-label{
    font-family:'Space Grotesk',sans-serif;
  }
  .npc-blog-admin a{color:var(--teal-700);}
  .npc-blog-admin svg{display:block;}

  /* ---------- Top bar ---------- */
  .npc-topbar{
    position:sticky;top:0;z-index:40;
    display:flex;align-items:center;justify-content:space-between;
    padding:16px 20px;
    background:rgba(251,250,247,0.92);
    border-bottom:1px solid var(--border);
    backdrop-filter:blur(8px);
  }
  .npc-brand{display:flex;align-items:center;gap:10px;font-weight:600;font-size:17px;letter-spacing:0.2px;color:var(--teal-900);}
  .npc-brand-mark{
    width:34px;height:34px;border-radius:9px;
    background:linear-gradient(135deg,var(--brass-light),var(--brass-dim));
    display:flex;align-items:center;justify-content:center;
    font-family:'Space Grotesk',sans-serif;font-weight:700;color:#fff;font-size:15px;
    flex-shrink:0;
  }
  .npc-brand-sub{font-size:11px;color:var(--ink-dim);font-weight:500;font-family:'Inter',sans-serif;letter-spacing:0.3px;}
  .npc-topbar-right{display:flex;align-items:center;gap:10px;}
  .npc-status-pill{
    font-size:12px;color:var(--ink-dim);display:flex;align-items:center;gap:6px;
    padding:6px 10px;border-radius:999px;background:var(--surface-alt);
    border:1px solid var(--border);
  }
  .npc-status-dot{width:7px;height:7px;border-radius:50%;background:var(--ok);flex-shrink:0;}
  .npc-status-dot.npc-unsaved{background:var(--brass);}

  /* ---------- Layout ---------- */
  .npc-shell{
    max-width:1180px;margin:0 auto;padding:22px 18px 90px;
    display:flex;flex-direction:column;gap:18px;
  }
  .npc-view{display:none;}
  .npc-view.npc-active{display:block;}

  /* ---------- List view ---------- */
  .npc-list-head{
    display:flex;align-items:flex-end;justify-content:space-between;gap:14px;
    margin-bottom:18px;flex-wrap:wrap;
  }
  .npc-list-head h1{font-size:26px;font-weight:600;margin:0 0 4px;color:var(--teal-900);}
  .npc-list-head p{margin:0;color:var(--ink-dim);font-size:14px;}
  .npc-btn{
    appearance:none;border:none;cursor:pointer;font-family:'Space Grotesk',sans-serif;
    font-weight:600;font-size:14px;border-radius:10px;padding:12px 18px;
    display:inline-flex;align-items:center;gap:8px;transition:transform .15s ease, opacity .15s ease, background .15s ease;
    white-space:nowrap;
  }
  .npc-btn:active{transform:scale(0.97);}
  .npc-btn-primary{background:linear-gradient(135deg,var(--teal-700),var(--teal-900));color:#fff;box-shadow:0 4px 14px rgba(18,56,56,0.18);}
  .npc-btn-primary:hover{opacity:0.92;}
  .npc-btn-ghost{background:var(--surface);color:var(--ink);border:1px solid var(--border);}
  .npc-btn-ghost:hover{background:var(--surface-alt);}
  .npc-btn-danger{background:#fbecea;color:var(--danger);border:1px solid #f0cfc9;}
  .npc-btn-danger:hover{background:#f7ddd8;}
  .npc-btn-sm{padding:8px 12px;font-size:12.5px;border-radius:8px;}
  .npc-btn-full{width:100%;justify-content:center;}

  .npc-empty{
    text-align:center;padding:70px 20px;border:1px dashed var(--border);
    border-radius:var(--radius);color:var(--ink-dim);background:var(--surface);
  }
  .npc-empty h3{color:var(--teal-900);font-size:18px;margin:14px 0 6px;}
  .npc-empty p{font-size:14px;margin:0 0 20px;}
  .npc-empty-icon{font-size:34px;}

  .npc-post-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;}
  .npc-post-card{
    background:var(--surface);
    border:1px solid var(--border);
    border-radius:var(--radius);
    padding:16px;display:flex;flex-direction:column;gap:10px;
    position:relative;overflow:hidden;
    box-shadow:0 2px 10px rgba(28,35,33,0.04);
  }
  .npc-post-card::before{
    content:"";position:absolute;top:0;left:0;right:0;height:3px;
    background:linear-gradient(90deg,var(--brass),var(--brass-light));
  }
  .npc-post-thumb{
    width:100%;height:120px;border-radius:9px;object-fit:cover;
    background:var(--surface-alt);
  }
  .npc-post-thumb-fallback{
    width:100%;height:120px;border-radius:9px;background:var(--surface-alt);
    display:flex;align-items:center;justify-content:center;color:var(--ink-dim);font-size:12px;
  }
  .npc-post-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
  .npc-tag{
    font-size:10.5px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;
    padding:4px 9px;border-radius:999px;background:var(--brass-wash);color:var(--brass-dim);
  }
  .npc-tag-draft{background:var(--surface-alt);color:var(--ink-dim);}
  .npc-post-title{font-size:16.5px;font-weight:600;color:var(--teal-900);line-height:1.35;font-family:'Space Grotesk',sans-serif;}
  .npc-post-excerpt{font-size:13px;color:var(--ink-dim);line-height:1.5;
    display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .npc-post-date{font-size:11.5px;color:var(--ink-dim);opacity:0.85;}
  .npc-post-actions{display:flex;gap:8px;margin-top:4px;}

  /* ---------- Editor view ---------- */
  .npc-editor-head{
    display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap;
  }
  .npc-back{
    background:none;border:none;color:var(--ink-dim);cursor:pointer;font-size:13px;
    display:flex;align-items:center;gap:6px;font-family:'Inter',sans-serif;font-weight:500;padding:6px 0;
  }
  .npc-back:hover{color:var(--teal-700);}
  .npc-editor-actions{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap;}

  .npc-field{margin-bottom:16px;}
  .npc-label{
    display:block;font-size:12px;font-weight:600;letter-spacing:0.4px;text-transform:uppercase;
    color:var(--brass-dim);margin-bottom:7px;
  }
  .npc-input, .npc-select, .npc-textarea{
    width:100%;background:var(--surface);border:1px solid var(--border);
    color:var(--ink);border-radius:10px;padding:13px 14px;font-size:15px;font-family:'Inter',sans-serif;
    transition:border-color .15s ease, box-shadow .15s ease;
  }
  .npc-input::placeholder,.npc-textarea::placeholder{color:#a8a398;}
  .npc-input:focus,.npc-select:focus,.npc-textarea:focus{
    outline:none;border-color:var(--brass);box-shadow:0 0 0 3px rgba(189,148,87,0.15);
  }
  .npc-title-input{font-size:24px;font-family:'Space Grotesk',sans-serif;font-weight:600;padding:14px 16px;color:var(--teal-900);}
  .npc-slug-row{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--ink-dim);margin-top:6px;}
  .npc-slug-row code{color:var(--teal-700);background:var(--brass-wash);padding:2px 7px;border-radius:5px;word-break:break-all;}
  .npc-row2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .npc-textarea{resize:vertical;min-height:70px;line-height:1.5;}

  .npc-thumb-drop{
    border:1.5px dashed var(--border);border-radius:12px;
    padding:18px;display:flex;align-items:center;gap:14px;cursor:pointer;
    background:var(--surface);transition:background .15s ease,border-color .15s ease;
  }
  .npc-thumb-drop:hover{background:var(--brass-wash);border-color:var(--brass);}
  .npc-thumb-drop img{width:70px;height:70px;object-fit:cover;border-radius:8px;flex-shrink:0;}
  .npc-thumb-drop-placeholder{
    width:70px;height:70px;border-radius:8px;background:var(--surface-alt);
    display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--brass-dim);
  }
  .npc-thumb-drop-text strong{display:block;font-size:14px;color:var(--teal-900);margin-bottom:2px;}
  .npc-thumb-drop-text span{font-size:12.5px;color:var(--ink-dim);}

  /* Rich text editor */
  .npc-editor-card{
    background:var(--surface);border-radius:var(--radius);overflow:hidden;
    border:1px solid var(--border);
    box-shadow:0 2px 10px rgba(28,35,33,0.04);
  }
  .npc-toolbar{
    display:flex;flex-wrap:wrap;align-items:center;gap:2px;padding:8px;background:var(--surface-alt);
    border-bottom:1px solid var(--border);
  }
  .npc-tb-btn{
    appearance:none;border:none;background:transparent;cursor:pointer;
    width:36px;height:36px;border-radius:7px;display:flex;align-items:center;justify-content:center;
    color:var(--teal-900);transition:background .12s ease,color .12s ease;
  }
  .npc-tb-btn svg{width:17px;height:17px;}
  .npc-tb-btn:hover{background:rgba(18,56,56,0.08);}
  .npc-tb-btn.npc-active{background:var(--teal-800);color:#fff;}
  .npc-tb-sep{width:1px;align-self:stretch;background:var(--border);margin:4px 5px;}
  .npc-tb-select{
    border:none;background:transparent;color:var(--teal-900);font-family:'Inter',sans-serif;
    font-size:13px;font-weight:600;padding:8px 6px;border-radius:7px;cursor:pointer;
  }
  .npc-tb-select:hover{background:rgba(18,56,56,0.08);}

  .npc-content-editable{
    min-height:340px;padding:26px 22px 60px;color:var(--ink);font-family:'Inter',sans-serif;
    font-size:16.5px;line-height:1.75;outline:none;
  }
  .npc-content-editable:empty:before{
    content:attr(data-placeholder);color:#a8a398;
  }
  .npc-content-editable h2{font-family:'Space Grotesk',sans-serif;font-size:24px;margin:26px 0 12px;color:var(--teal-900);}
  .npc-content-editable h3{font-family:'Space Grotesk',sans-serif;font-size:19px;margin:20px 0 10px;color:var(--teal-800);}
  .npc-content-editable p{margin:0 0 14px;}
  .npc-content-editable ul,.npc-content-editable ol{margin:0 0 14px;padding-left:24px;}
  .npc-content-editable li{margin-bottom:6px;}
  .npc-content-editable a{color:var(--teal-700);text-decoration:underline;}
  .npc-content-editable blockquote{
    border-left:3px solid var(--brass);margin:16px 0;padding:4px 0 4px 16px;color:var(--ink-dim);font-style:italic;
  }
  .npc-content-editable img{max-width:100%;border-radius:10px;margin:10px 0;display:block;}

  .npc-wordcount{
    display:flex;justify-content:space-between;padding:10px 16px;background:var(--surface-alt);
    font-size:11.5px;color:var(--ink-dim);border-top:1px solid var(--border);
  }

  .npc-hint{font-size:12px;color:var(--ink-dim);margin-top:6px;line-height:1.5;}

  /* Toast */
  .npc-toast{
    position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);
    background:var(--teal-900);border:1px solid var(--teal-700);color:#fff;
    padding:13px 20px;border-radius:11px;font-size:13.5px;font-weight:500;
    box-shadow:0 10px 30px rgba(0,0,0,0.2);z-index:100;opacity:0;pointer-events:none;
    transition:opacity .25s ease, transform .25s ease;display:flex;align-items:center;gap:9px;
    max-width:90vw;
  }
  .npc-toast.npc-show{opacity:1;transform:translateX(-50%) translateY(0);}
  .npc-toast-dot{width:7px;height:7px;border-radius:50%;background:var(--ok);flex-shrink:0;}
  .npc-toast.npc-error .npc-toast-dot{background:#e28a7d;}

  /* Confirm modal */
  .npc-modal-overlay{
    position:fixed;inset:0;background:rgba(28,35,33,0.45);z-index:90;
    display:none;align-items:center;justify-content:center;padding:20px;
  }
  .npc-modal-overlay.npc-show{display:flex;}
  .npc-modal{
    background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
    padding:24px;max-width:380px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,0.2);
  }
  .npc-modal h3{margin:0 0 8px;font-size:17px;color:var(--teal-900);}
  .npc-modal p{margin:0 0 20px;font-size:13.5px;color:var(--ink-dim);line-height:1.5;}
  .npc-modal-actions{display:flex;gap:10px;justify-content:flex-end;}

  /* Link input popover */
  .npc-link-popover{
    position:absolute;background:var(--surface);border:1px solid var(--brass);border-radius:10px;
    padding:10px;display:none;gap:8px;z-index:60;box-shadow:0 10px 24px rgba(0,0,0,0.15);
  }
  .npc-link-popover.npc-show{display:flex;}
  .npc-link-popover input{
    background:var(--surface-alt);border:1px solid var(--border);color:var(--ink);
    border-radius:7px;padding:8px 10px;font-size:13px;width:220px;
  }

  /* Sync notice */
  .npc-sync-note{
    display:flex;gap:10px;align-items:flex-start;background:var(--brass-wash);
    border:1px solid #ecd9b8;border-radius:12px;padding:13px 15px;margin-bottom:18px;
    font-size:12.5px;color:var(--brass-dim);line-height:1.5;
  }
  .npc-sync-note strong{color:var(--teal-800);}

  /* Responsive */
  @media (max-width:640px){
    .npc-shell{padding:16px 12px 100px;}
    .npc-topbar{padding:13px 14px;}
    .npc-brand-sub{display:none;}
    .npc-list-head h1{font-size:22px;}
    .npc-row2{grid-template-columns:1fr;gap:0;}
    .npc-title-input{font-size:20px;}
    .npc-editor-actions{width:100%;margin-left:0;}
    .npc-editor-actions .npc-btn{flex:1;}
    .npc-content-editable{padding:18px 16px 60px;font-size:16px;}
    .npc-post-grid{grid-template-columns:1fr;}
    .npc-tb-btn{width:34px;height:34px;}
    .npc-link-popover input{width:150px;}
  }
      `}</style>

      <div className="npc-topbar">
        <div className="npc-brand">
          <div className="npc-brand-mark">N</div>
          <div>
            <div>Blog Studio</div>
            <div className="npc-brand-sub">Negi Physiotherapy Clinic</div>
          </div>
        </div>
        <div className="npc-topbar-right">
          {isAuthenticated && (
            <div className="npc-status-pill">
              <span className={`npc-status-dot ${savedStatus ? "" : "npc-unsaved"}`}></span>
              <span>{savedStatus ? "All changes saved" : "Unsaved changes"}</span>
            </div>
          )}
          {isAuthenticated && (
            <button className="npc-btn npc-btn-ghost npc-btn-sm" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="npc-shell">
        {/* LOGIN VIEW */}
        <div className={`npc-view ${view === "login" ? "npc-active" : ""}`}>
          <div className="npc-empty" style={{ padding: "100px 20px" }}>
            <div className="npc-empty-icon">🔐</div>
            <h3>Admin Login</h3>
            <p>Enter your password to access the blog admin panel</p>
            <form onSubmit={handleLogin} style={{ maxWidth: "300px", margin: "0 auto" }}>
              <input
                type="password"
                className="npc-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: "16px" }}
              />
              <button className="npc-btn npc-btn-primary npc-btn-full" type="submit">
                Login
              </button>
            </form>
          </div>
        </div>

        {/* LIST VIEW */}
        <div className={`npc-view ${view === "list" ? "npc-active" : ""}`}>
          <div className="npc-sync-note">
            <span>ℹ️</span>
            <div>
              <strong>Connected to Supabase:</strong> All posts are automatically saved to your
              Supabase database. Published posts will appear on the public blog page immediately.
            </div>
          </div>

          <div className="npc-list-head">
            <div>
              <h1>Your blog posts</h1>
              <p>{postCountText}</p>
            </div>
            <button className="npc-btn npc-btn-primary" onClick={newPost}>
              ✎ Write new post
            </button>
          </div>

          {posts.length === 0 && (
            <div className="npc-empty">
              <div className="npc-empty-icon">📝</div>
              <h3>Nothing here yet</h3>
              <p>Write your first blog post — patient tips, clinic updates, or recovery stories.</p>
              <button className="npc-btn npc-btn-primary" onClick={newPost}>
                ✎ Write your first post
              </button>
            </div>
          )}

          {posts.length > 0 && (
            <div className="npc-post-grid">
              {sortedPosts.map((p) => (
                <div className="npc-post-card" key={p.id}>
                  {p.thumb ? (
                    <img className="npc-post-thumb" src={p.thumb} alt="" />
                  ) : (
                    <div className="npc-post-thumb-fallback">No cover photo</div>
                  )}
                  <div className="npc-post-meta">
                    {p.status === "published" ? (
                      <span className="npc-tag">Published</span>
                    ) : (
                      <span className="npc-tag npc-tag-draft">Draft</span>
                    )}
                    <span className="npc-tag npc-tag-draft">{p.category || "General"}</span>
                  </div>
                  <div className="npc-post-title">{p.title || "Untitled post"}</div>
                  <div className="npc-post-excerpt">{p.excerpt || "No excerpt written yet."}</div>
                  <div className="npc-post-date">Updated {formatDate(p.updated_at)}</div>
                  <div className="npc-post-actions">
                    <button
                      className="npc-btn npc-btn-ghost npc-btn-sm"
                      onClick={() => openEditor(p.id)}
                    >
                      Edit
                    </button>
                    {p.status === "published" && (
                      <button
                        className="npc-btn npc-btn-ghost npc-btn-sm"
                        onClick={() => copyPostJson(p)}
                      >
                        Copy for website
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EDITOR VIEW */}
        <div className={`npc-view ${view === "editor" ? "npc-active" : ""}`}>
          <div className="npc-editor-head">
            <button
              className="npc-back"
              onClick={() => {
                setSavedStatus(true);
                showList();
              }}
            >
              ← All posts
            </button>
            <div className="npc-editor-actions">
              {currentId && (
                <button className="npc-btn npc-btn-ghost npc-btn-sm" onClick={handleDeleteClick}>
                  🗑 Delete
                </button>
              )}
              <button
                className="npc-btn npc-btn-ghost npc-btn-sm"
                onClick={() => savePost("draft")}
              >
                Save draft
              </button>
              <button
                className="npc-btn npc-btn-primary npc-btn-sm"
                onClick={() => savePost("published")}
              >
                Publish
              </button>
            </div>
          </div>

          <div className="npc-field">
            <input
              type="text"
              className="npc-input npc-title-input"
              ref={titleRef}
              placeholder="Give your post a title…"
              onInput={handleTitleInput}
            />
            <div className="npc-slug-row">
              URL: <code>{slugPreview}</code>
            </div>
          </div>

          <div className="npc-row2">
            <div className="npc-field">
              <label className="npc-label">Category</label>
              <select className="npc-select" ref={categoryRef} onInput={handleGenericFieldInput}>
                <option>Patient Tips</option>
                <option>Recovery Stories</option>
                <option>Clinic Updates</option>
                <option>Injury Prevention</option>
                <option>Exercise & Mobility</option>
                <option>General Health</option>
              </select>
            </div>
            <div className="npc-field">
              <label className="npc-label">Author</label>
              <input
                type="text"
                className="npc-input"
                ref={authorRef}
                placeholder="e.g. Dr. Mangesh Negi"
                defaultValue="Dr. Mangesh Negi"
                onInput={handleGenericFieldInput}
              />
            </div>
          </div>

          <div className="npc-field">
            <label className="npc-label">Featured image</label>
            <div className="npc-thumb-drop" onClick={handleThumbDropClick}>
              {currentThumb ? (
                <img src={currentThumb} alt="" />
              ) : (
                <div className="npc-thumb-drop-placeholder">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="8.5" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M4 16.5L8.7 12.3C9.3 11.75 10.2 11.77 10.78 12.35L14 15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M12.5 15L15 12.6C15.6 12.03 16.5 12.03 17.08 12.6L20 15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
              )}
              <div className="npc-thumb-drop-text">
                <strong>Tap to add a cover photo</strong>
                <span>From your camera roll or files — JPG or PNG</span>
              </div>
            </div>
            <input
              type="file"
              ref={thumbInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleThumbChange}
            />
          </div>

          <div className="npc-field">
            <label className="npc-label">Short excerpt</label>
            <textarea
              className="npc-textarea"
              ref={excerptRef}
              placeholder="One or two sentences that summarize the post — shown on the blog listing page."
              rows={2}
              onInput={handleGenericFieldInput}
            ></textarea>
          </div>

          <div className="npc-field">
            <label className="npc-label">Post content</label>
            <div className="npc-editor-card">
              <div className="npc-toolbar">
                <select className="npc-tb-select" onChange={handleBlockChange} defaultValue="p">
                  <option value="p">Paragraph</option>
                  <option value="h2">Heading</option>
                  <option value="h3">Subheading</option>
                  <option value="blockquote">Quote</option>
                </select>
                <div className="npc-tb-sep"></div>
                <button
                  type="button"
                  className="npc-tb-btn"
                  title="Bold"
                  onClick={() => handleToolbarCommand("bold")}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <path d="M7 12h6.5a3.5 3.5 0 0 1 0 7H7v-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="npc-tb-btn"
                  title="Italic"
                  onClick={() => handleToolbarCommand("italic")}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M11 5h6M7 19h6M14 5L10 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="npc-tb-btn"
                  title="Underline"
                  onClick={() => handleToolbarCommand("underline")}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M6 4v7a6 6 0 0 0 12 0V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="npc-tb-sep"></div>
                <button
                  type="button"
                  className="npc-tb-btn"
                  title="Bullet list"
                  onClick={() => handleToolbarCommand("insertUnorderedList")}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="5" cy="6.5" r="1.4" fill="currentColor" />
                    <circle cx="5" cy="12" r="1.4" fill="currentColor" />
                    <circle cx="5" cy="17.5" r="1.4" fill="currentColor" />
                    <path d="M9.5 6.5h10M9.5 12h10M9.5 17.5h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="npc-tb-btn"
                  title="Numbered list"
                  onClick={() => handleToolbarCommand("insertOrderedList")}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9.5 6.5h10M9.5 12h10M9.5 17.5h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <text x="2.3" y="8.3" fontSize="6.5" fill="currentColor" fontFamily="Arial" fontWeight="700">1</text>
                    <text x="2.3" y="13.8" fontSize="6.5" fill="currentColor" fontFamily="Arial" fontWeight="700">2</text>
                    <text x="2.3" y="19.3" fontSize="6.5" fill="currentColor" fontFamily="Arial" fontWeight="700">3</text>
                  </svg>
                </button>
                <div className="npc-tb-sep"></div>
                <button
                  type="button"
                  className="npc-tb-btn"
                  title="Add link"
                  ref={linkBtnRef}
                  onClick={handleLinkButtonClick}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9.5 14.5l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M11 7.5l1-1a3.5 3.5 0 0 1 5 5l-1 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M13 16.5l-1 1a3.5 3.5 0 0 1-5-5l1-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="npc-tb-btn"
                  title="Insert image"
                  onClick={handleImageButtonClick}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4.5" width="18" height="14" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="8.2" cy="9.2" r="1.4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4 16.5l4.6-4.2c.6-.55 1.5-.53 2.08.05L14 15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M12.5 15l2.5-2.4c.6-.57 1.5-.57 2.08 0L20 15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="npc-tb-sep"></div>
                <button
                  type="button"
                  className="npc-tb-btn"
                  title="Undo"
                  onClick={() => handleToolbarCommand("undo")}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 8H15a4.5 4.5 0 0 1 0 9h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.5 4.5L7 8l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="npc-tb-btn"
                  title="Redo"
                  onClick={() => handleToolbarCommand("redo")}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M17 8H9a4.5 4.5 0 0 0 0 9h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13.5 4.5L17 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div
                className="npc-content-editable"
                ref={contentRef}
                contentEditable="true"
                data-placeholder="Start writing your post here…"
                onInput={handleContentInput}
                onMouseUp={saveSelection}
                onKeyUp={saveSelection}
                onTouchEnd={saveSelection}
              ></div>
              <div className="npc-wordcount">
                <span>{wordCount}</span>
                <span>{readTime}</span>
              </div>
            </div>
            <div className="npc-hint">
              Tip: select any text, then use the toolbar above to format it. Everything works the
              same way on your phone — just tap and hold to select text.
            </div>
          </div>

          <input
            type="file"
            ref={inlineImageInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleInlineImageChange}
          />
        </div>
      </div>

      <div
        className={`npc-link-popover ${linkPopover.show ? "npc-show" : ""}`}
        ref={linkPopoverRef}
        style={{ top: linkPopover.top, left: linkPopover.left }}
      >
        <input
          type="text"
          ref={linkInputRef}
          placeholder="Paste or type a link…"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyLink();
            }
          }}
        />
        <button className="npc-btn npc-btn-primary npc-btn-sm" onClick={applyLink}>
          Add
        </button>
      </div>

      <div className={`npc-modal-overlay ${confirmOverlay.show ? "npc-show" : ""}`}>
        <div className="npc-modal">
          <h3>Delete this post?</h3>
          <p>This will permanently remove it from this device. This can't be undone.</p>
          <div className="npc-modal-actions">
            <button className="npc-btn npc-btn-ghost npc-btn-sm" onClick={handleConfirmCancel}>
              Cancel
            </button>
            <button className="npc-btn npc-btn-danger npc-btn-sm" onClick={handleConfirmOk}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className={`npc-toast ${toast.show ? "npc-show" : ""} ${toast.error ? "npc-error" : ""}`}>
        <span className="npc-toast-dot"></span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}