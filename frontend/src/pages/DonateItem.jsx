import React, { useEffect, useState } from "react";
import "./DonateItem.css";

const initialForm = {
  title: "",
  category: "",
  condition: "",
  description: "",
  location: "",
  donationType: "Donate",
};

function DonateItem({ onSave, onViewDonations }) {
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const update = (e) => {
    setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const chooseImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
    setSuccess("");
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.category || !form.condition || !form.description.trim() || !form.location.trim()) {
      setError("Please complete every required field.");
      return;
    }
    const saved = onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      imageName: imageFile?.name || "",
    });
    if (!saved) {
      setError("Could not save this demo item in your browser. Check available storage.");
      return;
    }
    setForm(initialForm);
    setImageFile(null);
    setPreview("");
    e.currentTarget.reset();
    setSuccess("Item added to My Donations! The details are saved in this browser only.");
  };

  return (
    <div className="donate-page">
      <div className="donate-heading">
        <p>GIVE ITEMS A SECOND LIFE</p>
        <h1>Donate an Item 🎁</h1>
        <span>Share an item with the ReVive AI community.</span>
      </div>

      <form className="donate-form" onSubmit={submit}>
        <div className="donate-form-grid">
          <div className="donate-field">
            <label htmlFor="donate-title">Item Name *</label>
            <input id="donate-title" name="title" value={form.title} onChange={update}
              placeholder="e.g. Study table" maxLength={80} required />
          </div>
          <div className="donate-field">
            <label htmlFor="donate-category">Category *</label>
            <select id="donate-category" name="category" value={form.category} onChange={update} required>
              <option value="">Select a category</option>
              { ["Clothing", "Electronics", "Books", "Furniture", "Home Essentials", "Others"].map((x) => <option key={x}>{x}</option>) }
            </select>
          </div>
          <div className="donate-field">
            <label htmlFor="donate-condition">Item Condition *</label>
            <select id="donate-condition" name="condition" value={form.condition} onChange={update} required>
              <option value="">Select condition</option>
              { ["New", "Like New", "Good", "Fair", "Needs Repair"].map((x) => <option key={x}>{x}</option>) }
            </select>
          </div>
          <div className="donate-field">
            <label htmlFor="donate-type">Listing Type *</label>
            <select id="donate-type" name="donationType" value={form.donationType} onChange={update} required>
              <option value="Donate">Donate</option>
              <option value="Exchange">Exchange</option>
              <option value="Recycle">Recycle</option>
            </select>
          </div>
          <div className="donate-field donate-full">
            <label htmlFor="donate-description">Description *</label>
            <textarea id="donate-description" name="description" value={form.description}
              onChange={update} placeholder="Describe the item and its current condition..." rows={4} maxLength={500} required />
          </div>
          <div className="donate-field donate-full">
            <label htmlFor="donate-location">Pickup City / Area *</label>
            <input id="donate-location" name="location" value={form.location} onChange={update}
              placeholder="e.g. Kakinada" maxLength={100} required />
          </div>
          <div className="donate-field donate-full">
            <label htmlFor="donate-image">Item Photo (optional)</label>
            <input id="donate-image" type="file" accept="image/*" onChange={chooseImage} />
            <small>Maximum 5 MB. Photo preview only: images aren't saved until backend integration.</small>
            {preview && <img className="donate-preview" src={preview} alt="Selected item preview" />}
          </div>
        </div>
        {error && <p className="donate-error" role="alert">{error}</p>}
        {success && <div className="donate-success" role="status">{success}
          <button type="button" onClick={onViewDonations}>View My Donations →</button>
        </div>}
        <div className="donate-actions">
          <button type="reset" className="donate-reset" onClick={() => {
            setForm(initialForm); setImageFile(null); setPreview(""); setError(""); setSuccess("");
          }}>Clear Form</button>
          <button type="submit" className="donate-submit">Add Item →</button>
        </div>
      </form>
    </div>
  );
}

export default DonateItem;
