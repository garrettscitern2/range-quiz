// ============================================================
// AUTH PAGE LOGIC
// ============================================================

const params      = new URLSearchParams(location.search);
const inviteToken = params.get('token');
const noSubReason = params.get('reason') === 'no_subscription';

document.addEventListener('DOMContentLoaded', () => {
  // ── Wire up UI immediately (don't block on async session check) ──

  if (noSubReason) {
    document.getElementById('no-sub-notice').style.display = 'block';
  }

  if (inviteToken) {
    // Invite flow: hide tabs, show invite form
    document.getElementById('auth-tabs').style.display = 'none';
    switchForm('invite');
  }

  // Tab switching
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      switchForm(tab.dataset.flow);
    });
  });

  // Form submissions
  document.getElementById('form-signin') .addEventListener('submit', handleSignIn);
  document.getElementById('form-teacher').addEventListener('submit', handleTeacherSignup);
  document.getElementById('form-student').addEventListener('submit', handleStudentSignup);
  document.getElementById('form-invite') .addEventListener('submit', handleInviteSignup);

  // ── Check if already logged in (async, after UI is ready) ──
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) redirectAfterLogin();
  }).catch(() => {
    // Session check failed — stay on auth page, user can still sign in
  });
});

// ── Utilities ────────────────────────────────────────────────

async function redirectAfterLogin() {
  const dest = sessionStorage.getItem('authRedirect') || '/index.html';
  sessionStorage.removeItem('authRedirect');
  window.location.href = dest;
}

function switchForm(id) {
  document.querySelectorAll('.auth-form').forEach(f => {
    f.classList.toggle('active', f.id === `form-${id}`);
  });
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearError(id) {
  showError(id, '');
}

function setLoading(formId, loading) {
  const btn = document.querySelector(`#${formId} button[type="submit"]`);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? 'Please wait…' : btn.dataset.label;
}

function friendlyError(err) {
  const msg = (err?.message || '').toLowerCase();
  if (msg.includes('already registered') || msg.includes('already in use') || msg.includes('already exists')) {
    return 'An account with this email already exists. Sign in instead.';
  }
  if (msg.includes('invalid login') || msg.includes('invalid credentials') || msg.includes('email not confirmed')) {
    return 'Invalid email or password.';
  }
  if (msg.includes('password')) {
    return 'Password must be at least 8 characters.';
  }
  return err?.message || 'Something went wrong. Please try again.';
}

// ── Handlers ─────────────────────────────────────────────────

async function handleSignIn(e) {
  e.preventDefault();
  clearError('signin-error');

  const email    = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;

  setLoading('form-signin', true);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  setLoading('form-signin', false);

  if (error) { showError('signin-error', friendlyError(error)); return; }
  await redirectAfterLogin();
}

async function handleTeacherSignup(e) {
  e.preventDefault();
  clearError('teacher-error');

  const name     = document.getElementById('teacher-name').value.trim();
  const email    = document.getElementById('teacher-email').value.trim();
  const password = document.getElementById('teacher-password').value;

  setLoading('form-teacher', true);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: 'teacher', full_name: name } }
  });
  setLoading('form-teacher', false);

  if (error) { showError('teacher-error', friendlyError(error)); return; }

  // If email confirmation is disabled, data.session is set immediately
  if (data.session) {
    await redirectAfterLogin();
  } else {
    switchForm('confirm');
  }
}

async function handleStudentSignup(e) {
  e.preventDefault();
  clearError('student-error');

  const name     = document.getElementById('student-name').value.trim();
  const email    = document.getElementById('student-email').value.trim();
  const password = document.getElementById('student-password').value;

  setLoading('form-student', true);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: 'student', full_name: name } }
  });
  setLoading('form-student', false);

  if (error) { showError('student-error', friendlyError(error)); return; }

  if (data.session) {
    // Signed in but no subscription yet — show the no-access notice
    window.location.href = '/auth.html?reason=no_subscription';
  } else {
    switchForm('confirm');
  }
}

async function handleInviteSignup(e) {
  e.preventDefault();
  clearError('invite-error');

  const name     = document.getElementById('invite-name').value.trim();
  const email    = document.getElementById('invite-email').value.trim();
  const password = document.getElementById('invite-password').value;

  setLoading('form-invite', true);

  // Verify the token exists and is unclaimed before creating the account
  const { data: seat } = await supabase
    .from('seats')
    .select('id, subscription_id')
    .eq('invite_token', inviteToken)
    .is('student_id', null)
    .maybeSingle();

  if (!seat) {
    showError('invite-error', 'Invite link not found or already used.');
    setLoading('form-invite', false);
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: 'student', full_name: name } }
  });

  if (error) {
    showError('invite-error', friendlyError(error));
    setLoading('form-invite', false);
    return;
  }

  // Claim the seat if we have an immediate session
  if (data.session) {
    await supabase
      .from('seats')
      .update({
        student_id: data.session.user.id,
        claimed_at: new Date().toISOString()
      })
      .eq('invite_token', inviteToken)
      .is('student_id', null);

    await redirectAfterLogin();
  } else {
    // Email confirmation required — seat will be claimed on first sign-in (Phase 3)
    switchForm('confirm');
  }

  setLoading('form-invite', false);
}
