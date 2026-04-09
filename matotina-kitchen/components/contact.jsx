"use client";
import { useState, useCallback, useRef } from "react";
import { MapPin, Phone, Mail, ChevronDown, X, Sparkles, Clock, Users, UtensilsCrossed, AlertTriangle } from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  "Birthday", "Wedding", "Corporate Event", "Debut",
  "Christening", "Anniversary", "Reunion", "Other",
];
const SERVICE_TYPES = [
  "Buffet", "Plated / Sit-down", "Food Stall / Stations",
  "Cocktail / Hors d'oeuvres", "Packed Meals", "Other",
];
const CUISINE_STYLES = [
  "Filipino", "Western / Continental", "Asian Fusion",
  "Chinese", "Japanese", "Italian", "Mix / No Preference",
];
const VENUE_TYPES = [
  "Indoor (with kitchen)", "Indoor (no kitchen)", "Outdoor", "Not sure yet",
];
const EVENT_DURATIONS = [
  "2–3 hours", "4–5 hours", "6–8 hours", "Full day (8+ hours)", "Multi-day",
];
const STAFF_OPTIONS = [
  "Full service (waiters + setup + cleanup)",
  "Setup & breakdown only",
  "Food delivery only",
  "Not sure yet",
];
const BUDGET_RANGES = [
  "Under ₱20,000", "₱20,000 – ₱50,000", "₱50,000 – ₱100,000",
  "₱100,000 – ₱200,000", "Above ₱200,000",
];
const REFERRAL_SOURCES = [
  "Facebook", "Instagram", "TikTok", "Friend / Family Referral",
  "Google Search", "Walk-in / Signage", "Other",
];

const EMPTY_FORM = {
  // Contact
  fullName: "", email: "", phone: "",
  // Event
  eventType: "", eventDate: "", eventTime: "",
  eventDuration: "", venue: "", venueType: "", guests: "",
  // Service
  serviceType: "", cuisineStyle: "", staffing: "",
  dietaryRestrictions: "", menuPreferences: "",
  // Optional
  budgetRange: "", isReturningClient: "", competingQuotes: "", referral: "",
  // AI
  aiMenu: "",
};

const TODAY = new Date().toISOString().split("T")[0];

/**
 * Fields that must be filled before Lil Tina can generate a menu.
 * Each entry has the field key, a human-readable label, and the section
 * it belongs to so the missing-fields message is helpful.
 */
const AI_REQUIRED_FIELDS = [
  { key: "eventType",     label: "Event Type",      section: "Event Details" },
  { key: "eventDuration", label: "Event Duration",  section: "Event Details" },
  { key: "guests",        label: "No. of Guests",   section: "Event Details" },
  { key: "venue",         label: "Venue",           section: "Event Details" },
  { key: "venueType",     label: "Venue Setup",     section: "Event Details" },
  { key: "serviceType",   label: "Service Type",    section: "Service Details" },
  { key: "cuisineStyle",  label: "Cuisine Style",   section: "Service Details" },
  { key: "staffing",      label: "Staffing Needs",  section: "Service Details" },
];

/**
 * Fields whose values are sent to the API — if any change after a menu
 * has been generated the menu is considered stale.
 */
const AI_CONTEXT_KEYS = AI_REQUIRED_FIELDS.map((f) => f.key).concat([
  "dietaryRestrictions",
  "menuPreferences",
  "budgetRange",
]);

// ─── Primitive UI ─────────────────────────────────────────────────────────────

const inputBase =
  "w-full px-4 py-2.5 border rounded-lg bg-stone-50 focus:bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 " +
  "transition-all text-gray-800 placeholder-gray-400 text-sm border-stone-200";

const SectionLabel = ({ children, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
      {Icon && <Icon className="w-3 h-3" aria-hidden="true" />}
      {children}
    </span>
    <div className="flex-1 h-px bg-amber-100" />
  </div>
);

const Field = ({ label, required, hint, htmlFor, children }) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="flex items-baseline justify-between text-sm font-medium mb-1.5 text-gray-700"
    >
      <span>
        {label}
        {required && <span className="text-amber-600 ml-0.5" aria-hidden="true">*</span>}
      </span>
      {hint && <span className="text-xs text-gray-400 font-normal">{hint}</span>}
    </label>
    {children}
  </div>
);

const SelectField = ({ id, name, value, onChange, options, placeholder, required }) => (
  <div className="relative">
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`${inputBase} appearance-none pr-10 ${!value ? "text-gray-400" : "text-gray-800"}`}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
  </div>
);

// ─── Success Modal ────────────────────────────────────────────────────────────

function SuccessModal({ name, onClose }) {
  const handleKey = useCallback(
    (e) => { if (e.key === "Escape") onClose(); },
    [onClose],
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKey}
    >
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        .modal-card { animation: modalIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <div
        className="modal-card relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-10 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} aria-label="Close dialog"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition rounded-full p-1 hover:bg-gray-100">
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h3 id="success-title" className="text-2xl font-semibold text-gray-800 mb-2">
          Thank you, {name || "there"}!
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          Your inquiry has been submitted. Our team will review your event details
          and reach out within{" "}
          <span className="font-semibold text-gray-700">24–48 hours</span>.
        </p>
        <p className="text-gray-400 text-xs mb-8">A confirmation has been sent to your email.</p>

        <button onClick={onClose}
          className="w-full bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors duration-300 font-medium text-sm">
          Done
        </button>
      </div>
    </div>
  );
}

// ─── AI Menu Section ──────────────────────────────────────────────────────────

function AiMenuSection({ formData, onChange }) {
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  // Snapshot of context values at the time the menu was last generated
  const [snapshot, setSnapshot] = useState(null);
  const abortRef                = useRef(null);

  // Fields that are still empty but required before generating
  const missingFields = AI_REQUIRED_FIELDS.filter((f) => !formData[f.key]);
  const canGenerate   = missingFields.length === 0;

  // Is the current menu stale? — true when a menu exists AND any context
  // field has changed since the last generation
  const isStale = !!(
    formData.aiMenu &&
    snapshot &&
    AI_CONTEXT_KEYS.some((k) => formData[k] !== snapshot[k])
  );

  const handleGenerate = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/lil-tina", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        signal:  controller.signal,
        body: JSON.stringify({
          eventType:           formData.eventType,
          serviceType:         formData.serviceType,
          cuisineStyle:        formData.cuisineStyle,
          guests:              formData.guests,
          eventDuration:       formData.eventDuration,
          venueType:           formData.venueType,
          budgetRange:         formData.budgetRange,
          dietaryRestrictions: formData.dietaryRestrictions,
          menuPreferences:     formData.menuPreferences,
        }),
      });

      if (!res.ok) {
        let msg = `Server error (${res.status})`;
        try { const b = await res.json(); if (b?.message) msg = b.message; } catch { /* ignore */ }
        throw new Error(msg);
      }

      const data = await res.json();
      if (!data?.menu) throw new Error("The server returned an empty menu.");

      // Save a snapshot of the context at generation time
      const snap = {};
      AI_CONTEXT_KEYS.forEach((k) => { snap[k] = formData[k]; });
      setSnapshot(snap);

      onChange({ target: { name: "aiMenu", value: data.menu } });
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Failed to generate menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setError(null);
    setSnapshot(null);
    onChange({ target: { name: "aiMenu", value: "" } });
  };

  return (
    <div className="space-y-4 bg-amber-50 border border-amber-200 rounded-2xl p-6">
      {/* Header */}
      <div>
        <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          Ask Lil Tina for a Menu Suggestion
        </h4>
        <p className="text-xs text-amber-700 mt-1">
          Based on everything you've filled in above, Lil Tina will suggest a
          tailored menu you can edit before submitting.
        </p>
      </div>

      {/* Missing fields notice — shown when required fields aren't complete */}
      {!canGenerate && (
        <div className="bg-white border border-amber-200 rounded-lg px-4 py-3 space-y-1.5">
          <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            Please fill in the following fields first:
          </p>
          <ul className="space-y-0.5">
            {missingFields.map((f) => (
              <li key={f.key} className="text-xs text-amber-700 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                <span className="font-medium">{f.label}</span>
                <span className="text-amber-500">— {f.section}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stale menu warning */}
      {isStale && (
        <div role="alert" className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-xs font-semibold text-yellow-800">
              Your details have changed since this menu was generated.
            </p>
            <p className="text-xs text-yellow-700 mt-0.5">
              Regenerate the menu so it reflects your latest selections.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !canGenerate}
          aria-busy={loading}
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          {loading
            ? "Generating…"
            : isStale
              ? "Regenerate Menu"
              : formData.aiMenu
                ? "Regenerate Menu"
                : "Generate Menu Suggestion"}
        </button>

        {formData.aiMenu && !loading && (
          <button type="button" onClick={handleClear}
            className="text-xs text-amber-700 hover:text-red-500 transition-colors flex items-center gap-1">
            <X className="w-3 h-3" aria-hidden="true" /> Clear
          </button>
        )}
      </div>

      {/* API error */}
      {error && (
        <p role="alert" className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg flex items-center gap-2">
          <X className="w-3 h-3 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Generated menu textarea */}
      {formData.aiMenu && (
        <Field label="Lil Tina's Menu Suggestion" hint="Feel free to edit" htmlFor="aiMenu">
          <textarea
            id="aiMenu"
            name="aiMenu"
            value={formData.aiMenu}
            onChange={onChange}
            rows={8}
            className={`${inputBase} bg-white border-amber-300 focus:ring-amber-400`}
          />
        </Field>
      )}
    </div>
  );
}

// ─── Contact Sidebar ──────────────────────────────────────────────────────────

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    label: "Address",
    content: <>Km. 30 National Road<br />Tunasan, Muntinlupa City</>,
  },
  {
    icon: Phone,
    label: "Phone",
    content: (
      <a href="tel:+6325551234567" className="hover:text-amber-700 transition-colors">
        (555) 123-4567
      </a>
    ),
  },
  {
    icon: Mail,
    label: "Email",
    content: (
      <a href="mailto:info@matotinaskitchen.com" className="hover:text-amber-700 transition-colors break-all">
        info@matotinaskitchen.com
      </a>
    ),
  },
];

const EXPECTATION_ITEMS = [
  { icon: Clock,    title: "24–48 hr Response",    desc: "We'll review your inquiry and get back to you quickly." },
  { icon: Users,    title: "Personalized Proposal", desc: "A custom catering plan tailored to your event and budget." },
  { icon: Sparkles, title: "Expert Consultation",   desc: "We'll walk you through menus, setup, and service options." },
];

function ContactSidebar() {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-stone-50 border border-stone-100 rounded-2xl p-7">
        <h3 className="text-lg font-semibold mb-5 text-gray-700">Get in Touch</h3>
        <div className="space-y-5">
          {CONTACT_ITEMS.map(({ icon: Icon, label, content }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0" aria-hidden="true">
                <Icon className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-0.5">{label}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-7 space-y-4">
        <h3 className="text-lg font-semibold text-amber-800">What to Expect</h3>
        {EXPECTATION_ITEMS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-3">
            <Icon className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <div className="text-sm font-semibold text-amber-900">{title}</div>
              <div className="text-xs text-amber-700 leading-relaxed">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Contact() {
  const [formData,      setFormData]      = useState(EMPTY_FORM);
  const [submittedName, setSubmittedName] = useState("");
  const [status,        setStatus]        = useState({ loading: false, error: null, success: false });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const res = await fetch("/api/quote", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });

      let data = {};
      try { data = await res.json(); } catch { /* non-JSON body – ignore */ }

      if (!res.ok) {
        setStatus({ loading: false, error: data.message || "Something went wrong.", success: false });
        return;
      }

      setSubmittedName(formData.fullName);
      setStatus({ loading: false, error: null, success: true });
      setFormData(EMPTY_FORM);
    } catch {
      setStatus({ loading: false, error: "Network error. Please try again.", success: false });
    }
  };

  return (
    <>
      {status.success && (
        <SuccessModal
          name={submittedName}
          onClose={() => setStatus((s) => ({ ...s, success: false }))}
        />
      )}

      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-3">
              Catering Inquiry
            </p>
            <h2 className="text-4xl md:text-5xl mb-4 text-gray-700 font-light">
              Request a Quote
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Tell us about your event and we'll craft a personalized catering
              proposal just for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} noValidate className="space-y-8">

                {/* ── 1. Contact Info ── */}
                <fieldset className="space-y-4">
                  <SectionLabel>Contact Info</SectionLabel>

                  <Field label="Full Name" required htmlFor="fullName">
                    <input id="fullName" type="text" name="fullName"
                      value={formData.fullName} onChange={handleChange}
                      required autoComplete="name" placeholder="e.g. Maria Santos"
                      className={inputBase} />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Email" required htmlFor="email">
                      <input id="email" type="email" name="email"
                        value={formData.email} onChange={handleChange}
                        required autoComplete="email" placeholder="you@email.com"
                        className={inputBase} />
                    </Field>
                    <Field label="Phone Number" required htmlFor="phone">
                      <input id="phone" type="tel" name="phone"
                        value={formData.phone} onChange={handleChange}
                        required autoComplete="tel" placeholder="+63 917 123 4567"
                        className={inputBase} />
                    </Field>
                  </div>
                </fieldset>

                {/* ── 2. Event Details ── */}
                <fieldset className="space-y-4">
                  <SectionLabel icon={Users}>Event Details</SectionLabel>

                  <Field label="Event Type" required htmlFor="eventType">
                    <SelectField id="eventType" name="eventType"
                      value={formData.eventType} onChange={handleChange}
                      required placeholder="Select event type" options={EVENT_TYPES} />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Event Date" required htmlFor="eventDate">
                      <input id="eventDate" type="date" name="eventDate"
                        value={formData.eventDate} onChange={handleChange}
                        required min={TODAY} className={inputBase} />
                    </Field>
                    <Field label="Event Time" htmlFor="eventTime">
                      <input id="eventTime" type="time" name="eventTime"
                        value={formData.eventTime} onChange={handleChange}
                        className={inputBase} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Event Duration" required htmlFor="eventDuration">
                      <SelectField id="eventDuration" name="eventDuration"
                        value={formData.eventDuration} onChange={handleChange}
                        required placeholder="Select duration" options={EVENT_DURATIONS} />
                    </Field>
                    <Field label="Number of Guests" required htmlFor="guests">
                      <input id="guests" type="number" name="guests"
                        value={formData.guests} onChange={handleChange}
                        required min="1" max="10000" placeholder="e.g. 150"
                        className={inputBase} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* venue is now required */}
                    <Field label="Venue / Location" required htmlFor="venue">
                      <input id="venue" type="text" name="venue"
                        value={formData.venue} onChange={handleChange}
                        required placeholder="e.g. SM MOA Events Center, Pasay"
                        className={inputBase} />
                    </Field>
                    <Field label="Venue Setup" required htmlFor="venueType">
                      <SelectField id="venueType" name="venueType"
                        value={formData.venueType} onChange={handleChange}
                        required placeholder="Indoor / Outdoor?" options={VENUE_TYPES} />
                    </Field>
                  </div>
                </fieldset>

                {/* ── 3. Service Details ── */}
                <fieldset className="space-y-4">
                  <SectionLabel icon={UtensilsCrossed}>Service Details</SectionLabel>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Service Type" required htmlFor="serviceType">
                      <SelectField id="serviceType" name="serviceType"
                        value={formData.serviceType} onChange={handleChange}
                        required placeholder="Select service type" options={SERVICE_TYPES} />
                    </Field>
                    <Field label="Cuisine Style" required htmlFor="cuisineStyle">
                      <SelectField id="cuisineStyle" name="cuisineStyle"
                        value={formData.cuisineStyle} onChange={handleChange}
                        required placeholder="Select cuisine" options={CUISINE_STYLES} />
                    </Field>
                  </div>

                  <Field label="Staffing Needs" required htmlFor="staffing">
                    <SelectField id="staffing" name="staffing"
                      value={formData.staffing} onChange={handleChange}
                      required placeholder="Select staffing option" options={STAFF_OPTIONS} />
                  </Field>

                  <Field label="Dietary Restrictions / Allergies" hint="Optional" htmlFor="dietaryRestrictions">
                    <input id="dietaryRestrictions" type="text" name="dietaryRestrictions"
                      value={formData.dietaryRestrictions} onChange={handleChange}
                      placeholder="e.g. Halal, vegetarian, nut-free"
                      className={inputBase} />
                  </Field>

                  <Field label="Additional Notes / Special Requests" hint="Optional" htmlFor="menuPreferences">
                    <textarea id="menuPreferences" name="menuPreferences"
                      value={formData.menuPreferences} onChange={handleChange}
                      rows={3} placeholder="e.g. must-have dishes, theme, setup preferences…"
                      className={inputBase} />
                  </Field>
                </fieldset>

                {/* ── 4. Optional ── */}
                <fieldset className="space-y-4">
                  <SectionLabel>Optional</SectionLabel>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Budget Range" htmlFor="budgetRange">
                      <SelectField id="budgetRange" name="budgetRange"
                        value={formData.budgetRange} onChange={handleChange}
                        placeholder="Select a range" options={BUDGET_RANGES} />
                    </Field>
                    <Field label="How did you hear about us?" htmlFor="referral">
                      <SelectField id="referral" name="referral"
                        value={formData.referral} onChange={handleChange}
                        placeholder="Select one" options={REFERRAL_SOURCES} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Have you booked with us before?" htmlFor="isReturningClient">
                      <SelectField id="isReturningClient" name="isReturningClient"
                        value={formData.isReturningClient} onChange={handleChange}
                        placeholder="Select one"
                        options={["Yes, returning client", "No, first time"]} />
                    </Field>
                    <Field label="Are you getting other quotes?" htmlFor="competingQuotes">
                      <SelectField id="competingQuotes" name="competingQuotes"
                        value={formData.competingQuotes} onChange={handleChange}
                        placeholder="Select one"
                        options={["Yes, comparing caterers", "No, just you", "Undecided"]} />
                    </Field>
                  </div>
                </fieldset>

                {/* ── 5. AI Menu (last — all context is filled by now) ── */}
                <AiMenuSection formData={formData} onChange={handleChange} />

                {/* Submit error */}
                {status.error && (
                  <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    <X className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                    {status.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status.loading}
                  aria-busy={status.loading}
                  className="w-full bg-gray-900 text-white px-8 py-3.5 rounded-lg hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300 font-medium text-sm"
                >
                  {status.loading ? "Sending…" : "Send Inquiry"}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <ContactSidebar />
          </div>
        </div>
      </section>
    </>
  );
}