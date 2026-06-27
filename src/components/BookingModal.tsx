import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase, supabaseUrl, supabaseKey } from '@/lib/supabase';
import { SERVICES } from '@/data/site';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ open, onClose }) => {
  const [step, setStep] = useState<'details' | 'slots' | 'done'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setStep('details');
      setName('');
      setEmail('');
      setPhone('');
      setService('');
      setSelectedDate('');
      setSelectedTime('');
      setError('');
    }
  }, [open]);

  const generateAvailableDates = async () => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        dates.push(d.toISOString().split('T')[0]);
      }
    }
    setAvailableDates(dates);
    setStep('slots');
  };

  const loadSlots = async (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setLoading(true);
    try {
      const dayOfWeek = new Date(date).getDay();

      const { data: availability } = await supabase
        .from('availability')
        .select('*')
        .eq('day_of_week', dayOfWeek)
        .eq('is_active', true)
        .single();

      const { data: blocked } = await supabase
        .from('blocked_dates')
        .select('*')
        .eq('date', date);

      const { data: booked } = await supabase
        .from('appointments')
        .select('time')
        .eq('date', date)
        .not('status', 'eq', 'cancelled');

      if (!availability) {
        setAvailableTimes([]);
        return;
      }

      const start = availability.start_time.slice(0, 5);
      const end = availability.end_time.slice(0, 5);
      const slots: string[] = [];
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      let h = sh, m = sm;
      while (h < eh || (h === eh && m < em)) {
        const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        slots.push(time);
        m += 30;
        if (m >= 60) { h++; m -= 60; }
      }

      const blockedSlots = blocked?.flatMap(b => {
        if (!b.start_time || !b.end_time) return [];
        const bs: string[] = [];
        let bh = parseInt(b.start_time.slice(0, 2)), bm = parseInt(b.start_time.slice(3, 5));
        const beh = parseInt(b.end_time.slice(0, 2)), bem = parseInt(b.end_time.slice(3, 5));
        while (bh < beh || (bh === beh && bm < bem)) {
          bs.push(`${String(bh).padStart(2, '0')}:${String(bm).padStart(2, '0')}`);
          bm += 30;
          if (bm >= 60) { bh++; bm -= 60; }
        }
        return bs;
      }) || [];

      const bookedTimes = booked?.map(b => b.time.slice(0, 5)) || [];

      const free = slots.filter(s => !blockedSlots.includes(s) && !bookedTimes.includes(s));
      setAvailableTimes(free);
    } catch {
      setAvailableTimes([]);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!name || !email || !selectedDate || !selectedTime) return;
    setLoading(true);
    setError('');
    try {
      const { error: err } = await supabase.from('appointments').insert({
        name,
        email,
        phone,
        service,
        date: selectedDate,
        time: selectedTime,
        status: 'pending',
      });
      if (err) throw err;

      fetch(`${supabaseUrl}/functions/v1/send-booking-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
        body: JSON.stringify({ name, email, phone, service, date: selectedDate, time: selectedTime }),
      }).catch(() => {});

      setStep('done');
    } catch {
      setError('Failed to book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-[#1a1f3a] mb-6">Book a Consultation</h2>

        {step === 'details' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input required value={name} onChange={e => setName(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a90e2] focus:ring-2 focus:ring-[#4a90e2]/20 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a90e2] focus:ring-2 focus:ring-[#4a90e2]/20 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Phone (optional)</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a90e2] focus:ring-2 focus:ring-[#4a90e2]/20 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Service of interest</label>
              <select value={service} onChange={e => setService(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a90e2] focus:ring-2 focus:ring-[#4a90e2]/20 outline-none bg-white">
                <option value="">Select a service</option>
                {SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
              </select>
            </div>
            <button onClick={generateAvailableDates} disabled={!name || !email}
              className="w-full bg-[#f39c12] hover:bg-[#e08e0b] text-white px-6 py-3.5 rounded-lg font-semibold transition-colors disabled:opacity-60">
              Continue to Pick Date & Time
            </button>
          </div>
        )}

        {step === 'slots' && (
          <div className="space-y-4">
            <p className="text-slate-600">Select a date and time slot:</p>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {availableDates.slice(0, 14).map(d => {
                const dt = new Date(d + 'T00:00:00');
                const label = dt.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' });
                return (
                  <button key={d} onClick={() => loadSlots(d)}
                    className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedDate === d ? 'bg-[#4a90e2] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}>
                    {label}
                  </button>
                );
              })}
            </div>

            {loading && <div className="flex justify-center py-4"><Loader2 className="animate-spin text-[#4a90e2]" size={24} /></div>}

            {!loading && selectedDate && (
              <div className="grid grid-cols-4 gap-2">
                {availableTimes.length === 0 ? (
                  <p className="col-span-4 text-slate-500 text-center py-4">No available slots for this date</p>
                ) : (
                  availableTimes.map(t => (
                    <button key={t} onClick={() => setSelectedTime(t)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedTime === t ? 'bg-[#1a1f3a] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}>
                      {t}
                    </button>
                  ))
                )}
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button onClick={submit} disabled={!selectedTime || loading}
              className="w-full bg-[#f39c12] hover:bg-[#e08e0b] text-white px-6 py-3.5 rounded-lg font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <Loader2 size={18} className="animate-spin" />}
              Confirm Booking
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center py-8">
            <CheckCircle2 size={56} className="text-green-500 mx-auto" />
            <h3 className="mt-4 text-xl font-bold text-[#1a1f3a]">Booking Confirmed!</h3>
            <p className="mt-2 text-slate-600">We'll send a confirmation to {email} and be in touch shortly.</p>
            <button onClick={onClose} className="mt-6 text-[#4a90e2] font-semibold">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;