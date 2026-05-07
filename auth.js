// ============================================================
// AUTH PAGE LOGIC
// ============================================================

const params      = new URLSearchParams(location.search);
const inviteToken = params.get('token');
const noSubReason = params.get('reason') === 'no_subscription';

document.addEventListener('DOMContentLoaded', () => {
  // ── Wire up UI immediately (don't block on async session check) ──

  if (noSubReason || params.get('payment') === 'success') {
    document.getElementById('no-sub-notice').style.display = 'block';
    sessionStorage.removeItem('authRedirect'); // prevent stale redirect loops

    document.getElementById('notice-signout-btn').addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.href = '/auth.html';
    });

    if (params.get('payment') === 'success') {
      // Hide default notice, show activation-polling state
      document.getElementById('sub-notice-default').style.display = 'none';
      document.getElementById('sub-notice-success').style.display  = 'block';
      pollForActivation();
    } else {
      // Show the correct purchase button based on user role
      loadPurchaseButton();
    }
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
  // Skip auto-redirect when showing the no-subscription notice — the user
  // is already logged in but has no access; redirecting would cause a loop.
  if (!noSubReason) {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) redirectAfterLogin();
    }).catch(() => {
      // Session check failed — stay on auth page, user can still sign in
    });
  }
});

// ── Utilities ────────────────────────────────────────────────

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    )
  ]);
}

async function redirectAfterLogin() {
  const dest = sessionStorage.getItem('authRedirect') || '/dashboard.html';
  sessionStorage.removeItem('authRedirect');
  window.location.href = dest;
}

// ── Purchase button (shown on ?reason=no_subscription) ───────

async function loadPurchaseButton() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const btn = document.getElementById('purchase-btn');
    const msg = document.getElementById('sub-notice-msg');
    if (!btn || !profile) return;

    if (profile.role === 'teacher') {
      btn.textContent  = 'Purchase Teacher License — $100/yr (6 seats)';
      btn.style.display = 'block';
      btn.addEventListener('click', () => startCheckout(session.user.id, 'bulk'));
    } else {
      if (msg) msg.textContent = 'Purchase a subscription or contact your teacher for an invite.';
      btn.textContent  = 'Purchase Individual Access — $20/yr';
      btn.style.display = 'block';
      btn.addEventListener('click', () => startCheckout(session.user.id, 'individual'));
    }
  } catch (err) {
    console.error('loadPurchaseButton error:', err);
  }
}

async function startCheckout(userId, tier) {
  const btn = document.getElementById('purchase-btn');
  btn.disabled    = true;
  btn.textContent = 'Redirecting to checkout…';
  try {
    const res  = await fetch('/api/create-checkout-session', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ userId, tier }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      btn.disabled    = false;
      btn.textContent = tier === 'bulk'
        ? 'Purchase Teacher License — $100/yr (6 seats)'
        : 'Purchase Individual Access — $20/yr';
      alert('Could not start checkout. Please try again.');
    }
  } catch (err) {
    console.error('startCheckout error:', err);
    btn.disabled = false;
  }
}

// ── Activation polling (shown on ?payment=success) ───────────

async function pollForActivation() {
  const { data: { session } } = await supabase.auth.getSession()
    .catch(() => ({ data: {} }));
  if (!session) return;

  let attempts = 0;
  const max = 10; // poll up to ~20 seconds (every 2s)
  const interval = setInterval(async () => {
    attempts++;
    const active = await checkSubscriptionAccess(session.user.id).catch(() => false);
    if (active) {
      clearInterval(interval);
      window.location.href = '/dashboard.html';
      return;
    }
    if (attempts >= max) {
      clearInterval(interval);
      document.getElementById('payment-spinner').style.display  = 'none';
      document.getElementById('payment-fallback').style.display = 'block';
    }
  }, 2000);
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
  try {
    const { error } = await withTimeout(
      supabase.auth.signInWithPassword({ email, password }), 10000
    );
    if (error) { showError('signin-error', friendlyError(error)); return; }
    await redirectAfterLogin();
  } catch (err) {
    console.error('Sign in error:', err);
    showError('signin-error', err.message === 'timeout'
      ? 'Connection timed out. Is your Supabase project active?'
      : friendlyError(err));
  } finally {
    setLoading('form-signin', false);
  }
}

async function handleTeacherSignup(e) {
  e.preventDefault();
  clearError('teacher-error');

  const name     = document.getElementById('teacher-name').value.trim();
  const email    = document.getElementById('teacher-email').value.trim();
  const password = document.getElementById('teacher-password').value;

  setLoading('form-teacher', true);
  try {
    const { data, error } = await withTimeout(
      supabase.auth.signUp({
        email,
        password,
        options: { data: { role: 'teacher', full_name: name } }
      }), 10000
    );
    if (error) { showError('teacher-error', friendlyError(error)); return; }
    if (data.session) {
      await redirectAfterLogin();
    } else {
      switchForm('confirm');
    }
  } catch (err) {
    console.error('Teacher signup error:', err);
    showError('teacher-error', err.message === 'timeout'
      ? 'Connection timed out. Is your Supabase project active?'
      : friendlyError(err));
  } finally {
    setLoading('form-teacher', false);
  }
}

async function handleStudentSignup(e) {
  e.preventDefault();
  clearError('student-error');

  const name     = document.getElementById('student-name').value.trim();
  const email    = document.getElementById('student-email').value.trim();
  const password = document.getElementById('student-password').value;

  setLoading('form-student', true);
  try {
    const { data, error } = await withTimeout(
      supabase.auth.signUp({
        email,
        password,
        options: { data: { role: 'student', full_name: name } }
      }), 10000
    );
    if (error) { showError('student-error', friendlyError(error)); return; }
    if (data.session) {
      window.location.href = '/auth.html?reason=no_subscription';
    } else {
      switchForm('confirm');
    }
  } catch (err) {
    console.error('Student signup error:', err);
    showError('student-error', err.message === 'timeout'
      ? 'Connection timed out. Is your Supabase project active?'
      : friendlyError(err));
  } finally {
    setLoading('form-student', false);
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
