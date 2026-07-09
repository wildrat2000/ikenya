import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
}

serve(async (req) => {
  try {
    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) throw new Error('RESEND_API_KEY not set');

    const payload: ContactPayload = await req.json();

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Itukarua Kenya <contact@itukarua.co.ke>',
        to: 'itukarua2020@gmail.com',
        subject: `New Contact — ${payload.name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#1a1f3a;">New Contact Form Submission</h2>
            <table style="background:#f8f9fa;padding:16px;border-radius:8px;margin:16px 0;width:100%;">
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;vertical-align:top;">Name</td><td style="font-weight:600;">${payload.name}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;vertical-align:top;">Email</td><td style="font-weight:600;">${payload.email}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;vertical-align:top;">Phone</td><td style="font-weight:600;">${payload.phone || '—'}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;vertical-align:top;">Service</td><td style="font-weight:600;">${payload.service || '—'}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;vertical-align:top;">Message</td><td style="font-weight:600;white-space:pre-wrap;">${payload.message || '—'}</td></tr>
            </table>
            <p><a href="https://qpassmxbswyseoesimou.supabase.co/auth/v1/admin" style="color:#4a90e2;">View in Admin Dashboard</a></p>
          </div>
        `,
      }),
    });

    if (!res.ok) console.error('Resend error:', await res.text());

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
