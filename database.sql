-- =============================================================================
-- Itukarua Kenya — Supabase Database Schema with Row-Level Security
-- Run this in your Supabase SQL Editor (or via `psql`)
-- =============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tables
-- -------------------------------------------------------------------------
-- Profiles — synced from auth.users via trigger
CREATE TABLE public.profiles (
    id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email         text,
    full_name     text,
    avatar_url    text,
    role          text DEFAULT 'user'::text NOT NULL,
    created_at    timestamptz DEFAULT now(),
    updated_at    timestamptz DEFAULT now(),
    CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin', 'super_admin'))
);

-- Contact form submissions
CREATE TABLE public.contact_submissions (
    id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name          text NOT NULL,
    email         text NOT NULL,
    phone         text,
    service       text,
    message       text,
    sms_opt_in    boolean DEFAULT false,
    status        text DEFAULT 'unread'::text NOT NULL,
    created_at    timestamptz DEFAULT now(),
    CONSTRAINT contact_submissions_status_check CHECK (status IN ('unread', 'read', 'replied', 'archived'))
);

-- Newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
    id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email           text NOT NULL UNIQUE,
    name            text,
    subscribed      boolean DEFAULT true,
    subscribed_at   timestamptz DEFAULT now(),
    unsubscribed_at timestamptz
);

-- Client testimonials for the homepage "What Clients Say" section
CREATE TABLE IF NOT EXISTS public.testimonials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name text NOT NULL,
    company text,
    comment text NOT NULL,
    rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.testimonials OWNER TO postgres;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "admin write testimonials" ON public.testimonials;

CREATE POLICY "public read testimonials"
    ON public.testimonials FOR SELECT
    USING (true);

CREATE POLICY "admin write testimonials"
    ON public.testimonials FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Websites scroller settings (interval, transition, effect)
CREATE TABLE IF NOT EXISTS public.ad_carousel_settings (
    key text PRIMARY KEY,
    value text NOT NULL,
    updated_at timestamptz DEFAULT now(),
    CHECK (
        (key = 'web_scroll_interval_seconds' AND value ~ '^[0-9]+(\\.[0-9]+)?$') OR
        (key = 'web_transition_duration_seconds' AND value ~ '^[0-9]+(\\.[0-9]+)?$') OR
        (key = 'web_effect' AND value IN ('slide', 'fade', 'coverflow'))
    )
);

ALTER TABLE public.ad_carousel_settings OWNER TO postgres;
ALTER TABLE public.ad_carousel_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read ad_carousel_settings" ON public.ad_carousel_settings;
DROP POLICY IF EXISTS "admin write ad_carousel_settings" ON public.ad_carousel_settings;

CREATE POLICY "public read ad_carousel_settings"
    ON public.ad_carousel_settings FOR SELECT
    USING (true);

CREATE POLICY "admin write ad_carousel_settings"
    ON public.ad_carousel_settings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

INSERT INTO public.ad_carousel_settings (key, value) VALUES
    ('web_scroll_interval_seconds', '5'),
    ('web_transition_duration_seconds', '0.8'),
    ('web_effect', 'slide')
ON CONFLICT (key) DO NOTHING;

-- Portfolio sites for the homepage "Websites We Build" scroller.
CREATE TABLE IF NOT EXISTS public.portfolio_sites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    url text,
    image_url text,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.portfolio_sites OWNER TO postgres;
ALTER TABLE public.portfolio_sites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read portfolio_sites" ON public.portfolio_sites;
DROP POLICY IF EXISTS "admin write portfolio_sites" ON public.portfolio_sites;

CREATE POLICY "public read portfolio_sites"
    ON public.portfolio_sites FOR SELECT
    USING (true);

CREATE POLICY "admin write portfolio_sites"
    ON public.portfolio_sites FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

INSERT INTO public.portfolio_sites (title, description, url, image_url, sort_order) VALUES
    ('Prefetch Systems', 'IT solutions & web services', 'https://prefetchsystems.co.ke', NULL, 0),
    ('The Market Color Podcast', 'Podcast & media platform', 'https://themarketcolorpodcast.com', NULL, 1),
    ('AFRICAN LEADERSHIP CENTRE FOR DEVELOPMENT JUSTICE', 'Advancing Development Justice Across Africa', 'https://alcdj.org', NULL, 2),
    ('Itukarua', 'Local jobs & services hub', 'https://itukarua3.vercel.app', NULL, 3)
ON CONFLICT DO NOTHING;

-- 3. Trigger — auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data ->> 'full_name',
        NEW.raw_user_meta_data ->> 'avatar_url'
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. Enable Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- -------------------------------------------------------------------------
-- Profiles: public read, authenticated write own, admin full access
CREATE POLICY "profiles_public_select"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "profiles_self_insert"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_self_update"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- NOTE: Admin management of profiles is done via Supabase dashboard/service_role.
-- `profiles_public_select` above allows authenticated users to read their own role.

-- Contact submissions: public insert, admin-only read/update
CREATE POLICY "contact_submissions_public_insert"
    ON public.contact_submissions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "contact_submissions_admin_select"
    ON public.contact_submissions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

CREATE POLICY "contact_submissions_admin_update"
    ON public.contact_submissions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Newsletter subscribers: public insert, admin-only read/update
CREATE POLICY "newsletter_public_insert"
    ON public.newsletter_subscribers FOR INSERT
    WITH CHECK (true);

CREATE POLICY "newsletter_admin_select"
    ON public.newsletter_subscribers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

CREATE POLICY "newsletter_admin_update"
    ON public.newsletter_subscribers FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- 6. Indexes
CREATE INDEX idx_contact_submissions_status     ON public.contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX idx_newsletter_subscribers_email   ON public.newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_subscribed ON public.newsletter_subscribers(subscribed);
CREATE INDEX idx_profiles_role                  ON public.profiles(role);

-- 7. Booking System Tables
-- -------------------------------------------------------------------------
-- Appointments booked by visitors
CREATE TABLE public.appointments (
    id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name          text NOT NULL,
    email         text NOT NULL,
    phone         text,
    service       text,
    date          date NOT NULL,
    time          time without time zone NOT NULL,
    status        text DEFAULT 'pending'::text NOT NULL,
    notes         text,
    created_at    timestamptz DEFAULT now(),
    updated_at    timestamptz DEFAULT now(),
    CONSTRAINT appointments_status_check CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'))
);

-- Your weekly availability
CREATE TABLE public.availability (
    id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    day_of_week   integer NOT NULL,
    start_time    time without time zone NOT NULL,
    end_time      time without time zone NOT NULL,
    is_active     boolean DEFAULT true,
    CONSTRAINT availability_day_check CHECK (day_of_week BETWEEN 0 AND 6)
);

-- Dates/times you've manually blocked off
CREATE TABLE public.blocked_dates (
    id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    date          date NOT NULL,
    start_time    time without time zone,
    end_time      time without time zone,
    reason        text,
    created_at    timestamptz DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Appointments: public insert, admin full access
CREATE POLICY "appointments_public_insert"
    ON public.appointments FOR INSERT
    WITH CHECK (true);

CREATE POLICY "appointments_admin_all"
    ON public.appointments FOR ALL
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
    );

-- Availability: public read, admin write
CREATE POLICY "availability_public_select"
    ON public.availability FOR SELECT
    USING (true);

CREATE POLICY "availability_admin_all"
    ON public.availability FOR ALL
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
    );

-- Blocked dates: public read, admin write
CREATE POLICY "blocked_dates_public_select"
    ON public.blocked_dates FOR SELECT
    USING (true);

CREATE POLICY "blocked_dates_admin_all"
    ON public.blocked_dates FOR ALL
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
    );

-- Indexes
CREATE INDEX idx_appointments_date      ON public.appointments(date);
CREATE INDEX idx_appointments_status    ON public.appointments(status);
CREATE INDEX idx_appointments_email     ON public.appointments(email);
CREATE INDEX idx_blocked_dates_date     ON public.blocked_dates(date);
CREATE INDEX idx_availability_day       ON public.availability(day_of_week);

-- Default availability: Mon-Fri 9am-5pm
INSERT INTO public.availability (day_of_week, start_time, end_time) VALUES
    (1, '09:00', '17:00'),
    (2, '09:00', '17:00'),
    (3, '09:00', '17:00'),
    (4, '09:00', '17:00'),
    (5, '09:00', '17:00');

-- 8. Optional: seed your first super_admin (run after creating your user)
-- UPDATE public.profiles SET role = 'super_admin' WHERE email = 'your@email.com';
