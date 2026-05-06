// ============================================================
// SUPABASE CLIENT — shared by all pages
// ============================================================
// 1. Create a free project at https://supabase.com
// 2. Go to Project Settings → API
// 3. Replace the two placeholder values below with your
//    Project URL and anon key. The anon key is safe to commit
//    — RLS policies enforce all data access.
// 4. In Supabase Auth settings, disable "Enable email confirmations"
//    for easier local testing (re-enable for production).
// ============================================================

const SUPABASE_URL      = 'https://ohymwqkvdkhnmmhqxids.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_aQbR8d0vFF1wvNAhSqTj-A_1wAQ0KNR';

// eslint-disable-next-line no-undef
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Access check ────────────────────────────────────────────
// Returns true if the given user is allowed to use the quiz.
//
// Phase 1 rules:
//   admin   → always true
//   teacher → always true (subscription-gated in Phase 2)
//   student → true only if they have an active subscription
//             or a claimed seat on an active subscription

async function checkSubscriptionAccess(userId) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !profile) return false;

  if (profile.role === 'admin' || profile.role === 'teacher') return true;

  const now = new Date().toISOString();

  // Student with their own active subscription (direct purchase)
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('owner_id', userId)
    .eq('is_active', true)
    .gt('expires_at', now)
    .maybeSingle();
  if (sub) return true;

  // Student with a claimed seat on an active subscription
  const { data: seat } = await supabase
    .from('seats')
    .select('id, subscriptions(is_active, expires_at)')
    .eq('student_id', userId)
    .not('claimed_at', 'is', null)
    .maybeSingle();

  if (
    seat?.subscriptions?.is_active &&
    seat.subscriptions.expires_at > now
  ) return true;

  return false;
}
