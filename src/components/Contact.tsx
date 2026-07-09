import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import { COMPANY, SERVICES } from '@/data/site';
import { supabase } from '@/lib/supabase';
import BookingModal from './BookingModal';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [sms, setSms] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [showBooking, setShowBooking] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name) return;
    setStatus('loading');
    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        service: form.service || null,
        message: form.message || null,
        sms_opt_in: sms,
      });
      if (error) throw error;
      supabase.functions.invoke('send-contact-email', {
        body: { name: form.name, email: form.email, phone: form.phone, service: form.service, message: form.message },
      }).catch(() => {});
      setStatus('done');
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12">
        <div>
          <span className="text-[#4a90e2] font-semibold uppercase tracking-wider text-sm">Get In Touch</span>
          <h1 className="mt-3 text-3xl lg:text-4xl font-extrabold text-[#1a1f3a]">
            Request a free consultation
          </h1>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Tell us about your project or IT needs. Our Nairobi team will get back to you with a practical,
            client-focused plan.
          </p>

          <div className="mt-8 space-y-4">
            <a href={`mailto:${COMPANY.contactEmail}`} className="flex items-center gap-4 text-slate-700 hover:text-[#4a90e2]">
              <span className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center"><Mail size={20} className="text-[#4a90e2]" /></span>
              {COMPANY.email}
            </a>
            <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-4 text-slate-700 hover:text-[#4a90e2]">
              <span className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center"><Phone size={20} className="text-[#4a90e2]" /></span>
              {COMPANY.phone}
            </a>
            <div className="flex items-center gap-4 text-slate-700">
              <span className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center"><MapPin size={20} className="text-[#4a90e2]" /></span>
              {COMPANY.location}
            </div>
          </div>

          <button
            onClick={() => setShowBooking(true)}
            className="mt-8 inline-flex items-center gap-2 bg-[#1a1f3a] hover:bg-[#252b4d] text-white px-6 py-3.5 rounded-lg font-semibold transition-colors"
          >
            <Calendar size={18} /> Book a Meeting
          </button>
        </div>

        <div className="bg-slate-50 rounded-2xl p-7 border border-slate-100">
          {status === 'done' ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <CheckCircle2 size={56} className="text-green-500" />
              <h3 className="mt-4 text-xl font-bold text-[#1a1f3a]">Thank you!</h3>
              <p className="mt-2 text-slate-600">We've received your request and will be in touch shortly.</p>
              <button onClick={() => setStatus('idle')} className="mt-5 text-[#4a90e2] font-semibold">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a90e2] focus:ring-2 focus:ring-[#4a90e2]/20 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a90e2] focus:ring-2 focus:ring-[#4a90e2]/20 outline-none"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Phone number (optional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a90e2] focus:ring-2 focus:ring-[#4a90e2]/20 outline-none"
                  placeholder="+254 ..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Service of interest</label>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a90e2] focus:ring-2 focus:ring-[#4a90e2]/20 outline-none bg-white"
                >
                  <option value="">Select a service</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Message</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a90e2] focus:ring-2 focus:ring-[#4a90e2]/20 outline-none resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
              <label className="flex items-start gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} className="mt-1" />
                <span>Text me updates. Msg &amp; data rates may apply. Reply STOP to unsubscribe.</span>
              </label>
              {status === 'error' && <p className="text-sm text-red-500">Something went wrong. Please try again.</p>}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#f39c12] hover:bg-[#e08e0b] text-white px-6 py-3.5 rounded-lg font-semibold transition-colors disabled:opacity-60"
              >
                {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : null}
                Request Consultation
              </button>
            </form>
          )}
        </div>
      </div>
      <BookingModal open={showBooking} onClose={() => setShowBooking(false)} />
    </section>
  );
};

export default Contact;
