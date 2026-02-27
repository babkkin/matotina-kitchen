"use client";
import { MapPin, Phone, Mail, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-xs font-semibold tracking-widest uppercase text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
      {children}
    </span>
    <div className="flex-1 h-px bg-amber-100" />
  </div>
);

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-sm font-medium mb-1.5 text-gray-700">
      {label} {required && <span className="text-amber-600">*</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition text-gray-800 placeholder-gray-400 text-sm";

const SelectField = ({ id, name, value, onChange, options, placeholder }) => (
  <div className="relative">
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`${inputClass} appearance-none pr-10 ${value === '' ? 'text-gray-400' : 'text-gray-800'}`}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
);

function SuccessModal({ name, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-card { animation: modalIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      <div
        className="modal-card relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-10 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          Thank you, {name || 'there'}!
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          Your inquiry has been submitted successfully. Our team will review your event details and get back to you within <span className="font-semibold text-gray-700">24–48 hours</span>.
        </p>
        <p className="text-gray-400 text-xs mb-8">
          Check your email for a confirmation shortly.
        </p>

        <button
          onClick={onClose}
          className="w-full bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors duration-300 font-medium text-sm"
        >
          Done
        </button>
      </div>
    </div>
  );
}

const EMPTY_FORM = {
  fullName: '', email: '', phone: '',
  eventType: '', eventDate: '', eventTime: '', venue: '', guests: '',
  serviceType: '', menuPreferences: '', dietaryRestrictions: '',
  budgetRange: '', referral: '',
};

export default function Contact() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submittedName, setSubmittedName] = useState('');
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ loading: false, error: data.message || 'Something went wrong.', success: false });
        return;
      }

      setSubmittedName(formData.fullName);
      setStatus({ loading: false, error: null, success: true });
      setFormData(EMPTY_FORM);
    } catch (err) {
      setStatus({ loading: false, error: 'Network error. Please try again.', success: false });
    }
  };

  return (
    <>
      {status.success && (
        <SuccessModal
          name={submittedName}
          onClose={() => setStatus(s => ({ ...s, success: false }))}
        />
      )}

      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-3">Catering Inquiry</p>
            <h2 className="text-4xl md:text-5xl mb-4 text-gray-700 font-light">Request a Quote</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Tell us about your event and we'll craft a personalized catering proposal just for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* FORM */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-8">

                <div className="space-y-4">
                  <SectionLabel>Contact Info</SectionLabel>
                  <Field label="Full Name" required>
                    <input type="text" id="fullName" name="fullName" required
                      value={formData.fullName} onChange={handleChange}
                      placeholder="Juan dela Cruz" className={inputClass} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Email" required>
                      <input type="email" id="email" name="email" required
                        value={formData.email} onChange={handleChange}
                        placeholder="you@email.com" className={inputClass} />
                    </Field>
                    <Field label="Phone Number" required>
                      <input type="tel" id="phone" name="phone" required
                        value={formData.phone} onChange={handleChange}
                        placeholder="+63 912 345 6789" className={inputClass} />
                    </Field>
                  </div>
                </div>

                <div className="space-y-4">
                  <SectionLabel>Event Details</SectionLabel>
                  <Field label="Event Type" required>
                    <SelectField
                      id="eventType" name="eventType"
                      value={formData.eventType} onChange={handleChange}
                      placeholder="Select event type"
                      options={['Birthday', 'Wedding', 'Corporate Event', 'Debut', 'Christening', 'Anniversary', 'Reunion', 'Other']}
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Event Date" required>
                      <input type="date" id="eventDate" name="eventDate" required
                        value={formData.eventDate} onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]} className={inputClass} />
                    </Field>
                    <Field label="Event Time">
                      <input type="time" id="eventTime" name="eventTime"
                        value={formData.eventTime} onChange={handleChange}
                        className={inputClass} />
                    </Field>
                  </div>
                  <Field label="Venue / Location">
                    <input type="text" id="venue" name="venue"
                      value={formData.venue} onChange={handleChange}
                      placeholder="e.g. SM MOA Events Center, Parañaque" className={inputClass} />
                  </Field>
                  <Field label="Number of Guests" required>
                    <input type="number" id="guests" name="guests" required min="1"
                      value={formData.guests} onChange={handleChange}
                      placeholder="e.g. 150" className={inputClass} />
                  </Field>
                </div>

                <div className="space-y-4">
                  <SectionLabel>Service Details</SectionLabel>
                  <Field label="Service Type" required>
                    <SelectField
                      id="serviceType" name="serviceType"
                      value={formData.serviceType} onChange={handleChange}
                      placeholder="Select service type"
                      options={['Buffet', 'Plated / Sit-down', 'Food Stall / Stations', "Cocktail / Hor d'oeuvres", 'Packed Meals', 'Other']}
                    />
                  </Field>
                  <Field label="Menu Preferences / Special Requests">
                    <textarea id="menuPreferences" name="menuPreferences" rows={3}
                      value={formData.menuPreferences} onChange={handleChange}
                      placeholder="Let us know your preferred dishes, cuisine style, or any special requirements..."
                      className={inputClass} />
                  </Field>
                  <Field label="Dietary Restrictions / Allergies">
                    <input type="text" id="dietaryRestrictions" name="dietaryRestrictions"
                      value={formData.dietaryRestrictions} onChange={handleChange}
                      placeholder="e.g. Halal, vegetarian options, nut-free, etc." className={inputClass} />
                  </Field>
                </div>

                <div className="space-y-4">
                  <SectionLabel>Optional</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Budget Range">
                      <SelectField
                        id="budgetRange" name="budgetRange"
                        value={formData.budgetRange} onChange={handleChange}
                        placeholder="Select a range"
                        options={['Under ₱20,000', '₱20,000 – ₱50,000', '₱50,000 – ₱100,000', '₱100,000 – ₱200,000', 'Above ₱200,000']}
                      />
                    </Field>
                    <Field label="How did you hear about us?">
                      <SelectField
                        id="referral" name="referral"
                        value={formData.referral} onChange={handleChange}
                        placeholder="Select one"
                        options={['Facebook', 'Instagram', 'TikTok', 'Friend / Family Referral', 'Google Search', 'Walk-in / Signage', 'Other']}
                      />
                    </Field>
                  </div>
                </div>

                {status.error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {status.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full bg-gray-900 text-white px-8 py-3.5 rounded-lg hover:bg-amber-700 transition-colors duration-300 font-medium tracking-wide text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status.loading ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-7">
                <h3 className="text-xl font-medium mb-5 text-gray-700">Contact Information</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-0.5">Address</div>
                      <div className="text-sm text-gray-500 leading-relaxed">Km. 30 National Road<br />Tunasan, Muntinlupa City</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-0.5">Phone</div>
                      <div className="text-sm text-gray-500">(555) 123-4567</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-0.5">Email</div>
                      <div className="text-sm text-gray-500">info@matotinaskitchen.com</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-7">
                <h3 className="text-xl font-medium mb-5 text-gray-700">Business Hours</h3>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="font-medium text-gray-700">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium text-gray-700">10:00 AM – 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-gray-700">Closed</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                <p className="text-sm text-amber-800 leading-relaxed">
                  💡 <span className="font-semibold">Pro tip:</span> The more details you provide, the faster we can prepare your personalized quote — usually within 24–48 hours!
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}