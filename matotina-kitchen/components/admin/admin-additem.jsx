"use client";

import { useState, useRef } from "react";

export default function AddItemModal({ onClose, onSave }) {
  const [form, setForm]               = useState({ title: "", category: "", description: "" });
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [error, setError]             = useState("");
  const fileInputRef                  = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.category.trim()) {
      setError("Title and category are required.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      let image_url = null;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const res = await fetch("/api/menu/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Image upload failed.");
        image_url = data.url;
      }
      onSave({ ...form, image_url });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const s = styles;

  return (
    <div style={s.backdrop} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={s.title}>Add New Item</h3>

        {/* Image Upload */}
        <div style={{ marginBottom: "20px" }}>
          <label style={s.label}>Image</label>
          <div style={s.imageBox} onClick={() => fileInputRef.current.click()}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ textAlign: "center" }}>
                <svg style={{ margin: "0 auto 8px", display: "block" }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8955a" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <span style={{ fontSize: "12px", color: "#c8955a" }}>Click to upload</span>
                <p style={{ fontSize: "11px", color: "#8a6a3a", marginTop: "4px" }}>JPEG, PNG, WEBP — max 5MB</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={s.label}>Title</label>
          <input style={s.input} placeholder="e.g. Gourmet Starters" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={s.label}>Category</label>
          <input style={s.input} placeholder="e.g. Appetizers" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={s.label}>Description</label>
          <textarea style={s.textarea} placeholder="Short description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        {error && <p style={s.error}>⚠ {error}</p>}

        <div style={s.actions}>
          <button onClick={onClose} disabled={uploading} style={s.cancelBtn}>Cancel</button>
          <button onClick={handleSave} disabled={uploading} style={s.saveBtn}>
            {uploading ? "Uploading..." : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "24px" },
  modal:    { background: "#1c1814", border: "1px solid rgba(180,120,60,0.45)", borderRadius: "4px", width: "100%", maxWidth: "480px", padding: "36px", boxShadow: "0 32px 80px rgba(0,0,0,0.8)" },
  title:    { fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#f0e8d8", marginBottom: "28px", fontWeight: 600 },
  label:    { display: "block", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#c8955a", marginBottom: "8px", fontWeight: 500 },
  input:    { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(180,120,60,0.35)", borderRadius: "4px", padding: "11px 14px", fontSize: "14px", color: "#f0e8d8", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  textarea: { width: "100%", height: "80px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(180,120,60,0.35)", borderRadius: "4px", padding: "11px 14px", fontSize: "14px", color: "#f0e8d8", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" },
  imageBox: { height: "140px", border: "1px dashed rgba(180,120,60,0.4)", borderRadius: "4px", background: "rgba(180,120,60,0.05)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" },
  error:    { fontSize: "12px", color: "#e07070", background: "rgba(224,112,112,0.1)", border: "1px solid rgba(224,112,112,0.3)", padding: "10px 14px", borderRadius: "4px", marginBottom: "16px" },
  actions:  { display: "flex", gap: "12px", marginTop: "28px" },
  cancelBtn:{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#c8b89a", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: "4px", cursor: "pointer" },
  saveBtn:  { flex: 2, padding: "12px", background: "rgba(180,120,60,0.25)", border: "1px solid rgba(180,120,60,0.6)", color: "#e0aa70", fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: "4px", cursor: "pointer" },
};