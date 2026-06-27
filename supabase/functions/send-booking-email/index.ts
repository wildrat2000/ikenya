import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

interface BookingPayload {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  date: string;
  time: string;
}

serve(async (req) => {
  try {
    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not set');
    }

    const payload: BookingPayload = await req.json();

    const dateObj = new Date(payload.date + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-KE', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    // Email to the customer — confirmation
    const customerRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Itukarua Kenya <bookings@itukarua.co.ke>',
        to: payload.email,
        subject: 'Booking Confirmation — Itukarua Kenya',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#1a1f3a;">Booking Confirmed</h2>
            <p>Hi <strong>${payload.name}</strong>,</p>
            <p>Your consultation with Itukarua Kenya has been booked:</p>
            <table style="background:#f8f9fa;padding:16px;border-radius:8px;margin:16px 0;">
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Date</td><td style="font-weight:600;">${formattedDate}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Time</td><td style="font-weight:600;">${payload.time}</td></tr>
              ${payload.service ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;">Service</td><td style="font-weight:600;">${payload.service}</td></tr>` : ''}
            </table>
            <p style="color:#64748b;">We'll review your request and get back to you shortly. If you need to reschedule, reply to this email.</p>
            <p style="color:#64748b;">— Itukarua Kenya Team</p>
          </div>
        `,
      }),
    });

    // Email to the admin — notification
    const adminRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Itukarua Bookings <bookings@itukarua.co.ke>',
        to: 'itukarua2020@gmail.com',
        subject: `New Booking — ${payload.name} — ${formattedDate} ${payload.time}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#1a1f3a;">New Appointment Booking</h2>
            <table style="background:#f8f9fa;padding:16px;border-radius:8px;margin:16px 0;">
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Name</td><td style="font-weight:600;">${payload.name}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Email</td><td style="font-weight:600;">${payload.email}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Phone</td><td style="font-weight:600;">${payload.phone || '—'}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Service</td><td style="font-weight:600;">${payload.service || '—'}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Date</td><td style="font-weight:600;">${formattedDate}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Time</td><td style="font-weight:600;">${payload.time}</td></tr>
            </table>
            <p><a href="https://qpassmxbswyseoesimou.supabase.co/functions/v1/send-booking-email" style="color:#4a90e2;">Manage in Admin Dashboard</a></p>
          </div>
        `,
      }),
    });

    if (!customerRes.ok || !adminRes.ok) {
      console.error('Resend error:', await customerRes.text(), await adminRes.text());
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
