-- ============================================================
-- Range Quiz — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── Extensions ─────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── profiles ───────────────────────────────────────────────
-- Mirrors auth.users. Created automatically on signup via trigger.

CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text        NOT NULL CHECK (role IN ('admin','teacher','student')),
  full_name   text        NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: own row select"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- NOTE: "profiles: teacher sees their students" is added after
--       the seats table is created below (avoids forward-reference error).

CREATE POLICY "profiles: own row update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger: auto-create profile row when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── subscriptions ──────────────────────────────────────────
-- One row per teacher (bulk) or direct-purchase student.
-- Populated by Stripe webhook in Phase 2.

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id                uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id      text        UNIQUE,
  stripe_subscription_id  text        UNIQUE,
  tier                    text        NOT NULL CHECK (tier IN ('individual','bulk')),
  seats_purchased         int         NOT NULL DEFAULT 1,
  seats_used              int         NOT NULL DEFAULT 0,
  expires_at              timestamptz,
  is_active               boolean     NOT NULL DEFAULT false,
  created_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions: owner select"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "subscriptions: admin select"
  ON public.subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── seats ──────────────────────────────────────────────────
-- Links students to a teacher's subscription via invite token.

CREATE TABLE IF NOT EXISTS public.seats (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id  uuid        NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  teacher_id       uuid        NOT NULL REFERENCES public.profiles(id),
  student_id       uuid        REFERENCES public.profiles(id),
  invite_token     text        UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  invite_email     text,
  claimed_at       timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seats: teacher sees own seats"
  ON public.seats FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "seats: student sees own seat"
  ON public.seats FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "seats: teacher inserts"
  ON public.seats FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "seats: student claims own seat"
  ON public.seats FOR UPDATE
  USING  (student_id IS NULL OR auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Deferred profile policy (seats table now exists)
CREATE POLICY "profiles: teacher sees their students"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.seats
      WHERE seats.teacher_id = auth.uid()
        AND seats.student_id = profiles.id
    )
  );

-- Trigger: increment seats_used when a seat is claimed
CREATE OR REPLACE FUNCTION public.handle_seat_claimed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF OLD.student_id IS NULL AND NEW.student_id IS NOT NULL THEN
    UPDATE public.subscriptions
    SET seats_used = seats_used + 1
    WHERE id = NEW.subscription_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_seat_claimed ON public.seats;
CREATE TRIGGER on_seat_claimed
  AFTER UPDATE ON public.seats
  FOR EACH ROW EXECUTE PROCEDURE public.handle_seat_claimed();

-- ── quiz_sessions ──────────────────────────────────────────
-- One row per completed quiz.

CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_set         text        NOT NULL CHECK (quiz_set IN ('texas','national')),
  filter_category  text,
  question_count   int         NOT NULL,
  plants_correct   int         NOT NULL,
  chars_correct    int         NOT NULL,
  chars_total      int         NOT NULL,
  mode             text        NOT NULL DEFAULT 'standard',
  completed_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_sessions: own rows"
  ON public.quiz_sessions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "quiz_sessions: teacher sees students"
  ON public.quiz_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.seats
      WHERE seats.teacher_id = auth.uid()
        AND seats.student_id = quiz_sessions.user_id
    )
  );

-- ── plant_attempts ─────────────────────────────────────────
-- One row per plant per quiz session. Source of truth for practice mode.

CREATE TABLE IF NOT EXISTS public.plant_attempts (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        uuid        NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  user_id           uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_set          text        NOT NULL,
  plant_id          int         NOT NULL,
  plant_name        text        NOT NULL,
  was_fully_correct boolean     NOT NULL,
  chars_correct     int         NOT NULL,
  chars_total       int         NOT NULL,
  attempted_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.plant_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plant_attempts: own rows"
  ON public.plant_attempts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "plant_attempts: teacher sees students"
  ON public.plant_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.seats
      WHERE seats.teacher_id = auth.uid()
        AND seats.student_id = plant_attempts.user_id
    )
  );
