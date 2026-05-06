// ============================================================
// DASHBOARD — teacher and student views
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('dash-root');
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.href = '/auth.html'; return; }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', session.user.id)
      .single();

    if (!profile) { window.location.href = '/auth.html'; return; }

    if (profile.role === 'teacher' || profile.role === 'admin') {
      await renderTeacherDashboard(session.user.id, profile);
    } else {
      await renderStudentDashboard(session.user.id, profile);
    }
  } catch (err) {
    console.error('Dashboard error:', err);
    root.innerHTML = '<div class="auth-loading">Something went wrong. <a href="/index.html">Go back</a></div>';
  }
});

// ── Shared utilities ─────────────────────────────────────────

function pct(num, den) {
  return den > 0 ? Math.round((num / den) * 100) : 0;
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

function topMissed(attempts, limit = 10) {
  const map = {};
  attempts.forEach(a => {
    if (!map[a.plant_name]) map[a.plant_name] = { total: 0, missed: 0 };
    map[a.plant_name].total++;
    if (!a.was_fully_correct) map[a.plant_name].missed++;
  });
  return Object.entries(map)
    .filter(([, v]) => v.missed > 0)
    .sort((a, b) => b[1].missed - a[1].missed)
    .slice(0, limit);
}

function signOutListener() {
  document.getElementById('dash-signout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth.html';
  });
}

// ── Shell ────────────────────────────────────────────────────

function shell(subtitle, bodyHtml) {
  return `
    <div class="dash-wrap">
      <header class="dash-header">
        <div class="dash-header-inner">
          <div>
            <div class="dash-title">Range Quiz</div>
            <div class="dash-subtitle">${subtitle}</div>
          </div>
          <div class="dash-header-actions">
            <a href="/index.html" class="dash-header-link">Take a Quiz</a>
            <button id="dash-signout" class="dash-header-link dash-signout-btn">Sign Out</button>
          </div>
        </div>
      </header>
      <main class="dash-main">
        ${bodyHtml}
      </main>
    </div>
  `;
}

// ── STUDENT DASHBOARD ─────────────────────────────────────────

async function renderStudentDashboard(userId, profile) {
  const root = document.getElementById('dash-root');

  // Fetch data in parallel
  const [sessionsRes, attemptsRes] = await Promise.all([
    supabase
      .from('quiz_sessions')
      .select('id, quiz_set, filter_category, question_count, plants_correct, chars_correct, chars_total, completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(50),
    supabase
      .from('plant_attempts')
      .select('plant_name, was_fully_correct')
      .eq('user_id', userId)
  ]);

  const sessions = sessionsRes.data || [];
  const attempts = attemptsRes.data || [];
  const missed   = topMissed(attempts);

  // Summary stats
  const totalQuizzes = sessions.length;
  const avgPlant = totalQuizzes > 0
    ? Math.round(sessions.reduce((s, r) => s + pct(r.plants_correct, r.question_count), 0) / totalQuizzes)
    : null;
  const avgChar = totalQuizzes > 0
    ? Math.round(sessions.reduce((s, r) => s + pct(r.chars_correct, r.chars_total), 0) / totalQuizzes)
    : null;

  // Recent quiz rows
  const recentRows = sessions.slice(0, 20).map(s => `
    <div class="dash-row">
      <div class="dash-row-main">
        <span class="dash-tag dash-tag--${s.quiz_set}">${s.quiz_set === 'texas' ? 'Texas' : 'National'}</span>
        ${s.filter_category ? `<span class="dash-tag">${s.filter_category}</span>` : ''}
        <span class="dash-row-date">${fmtDate(s.completed_at)}</span>
      </div>
      <div class="dash-row-scores">
        <span class="dash-score">
          <span class="dash-score-val">${pct(s.plants_correct, s.question_count)}%</span>
          <span class="dash-score-lbl">plants</span>
        </span>
        <span class="dash-score">
          <span class="dash-score-val">${pct(s.chars_correct, s.chars_total)}%</span>
          <span class="dash-score-lbl">chars</span>
        </span>
      </div>
    </div>
  `).join('');

  // Most-missed plants
  const missedRows = missed.length
    ? missed.map(([name, v]) => `
        <div class="dash-row dash-missed-row">
          <span class="dash-missed-name">${name}</span>
          <span class="dash-missed-count">${v.missed}/${v.total} missed</span>
        </div>
      `).join('')
    : '<div class="dash-empty">No misses yet — keep it up!</div>';

  const statsHtml = totalQuizzes === 0
    ? '<div class="dash-empty">No quizzes completed yet. <a href="/index.html">Take your first quiz →</a></div>'
    : `
        <div class="dash-stat-grid">
          <div class="dash-stat">
            <div class="dash-stat-val">${totalQuizzes}</div>
            <div class="dash-stat-lbl">Quizzes</div>
          </div>
          <div class="dash-stat">
            <div class="dash-stat-val">${avgPlant}%</div>
            <div class="dash-stat-lbl">Avg Plant Score</div>
          </div>
          <div class="dash-stat">
            <div class="dash-stat-val">${avgChar}%</div>
            <div class="dash-stat-lbl">Avg Char Score</div>
          </div>
        </div>
      `;

  root.innerHTML = shell(`${profile.full_name || 'Student'} — Dashboard`, `
    ${statsHtml}

    ${totalQuizzes > 0 ? `
      <div class="dash-section">
        <div class="dash-section-title">Recent Quizzes</div>
        <div class="dash-list">${recentRows}</div>
      </div>

      <div class="dash-section">
        <div class="dash-section-title">Most Missed Plants</div>
        <div class="dash-list">${missedRows}</div>
      </div>
    ` : ''}
  `);

  signOutListener();
}

// ── TEACHER DASHBOARD ─────────────────────────────────────────

async function renderTeacherDashboard(userId, profile) {
  const root = document.getElementById('dash-root');

  // Subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('id, seats_purchased, seats_used, expires_at, is_active')
    .eq('owner_id', userId)
    .eq('is_active', true)
    .maybeSingle();

  // Seats (all, claimed or not)
  const { data: seats } = await supabase
    .from('seats')
    .select('id, invite_token, claimed_at, student_id')
    .eq('teacher_id', userId)
    .order('created_at', { ascending: true });

  const seatList = seats || [];
  const claimedStudentIds = seatList.filter(s => s.student_id).map(s => s.student_id);

  // Student profiles
  let studentProfiles = {};
  if (claimedStudentIds.length > 0) {
    const { data: profs } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', claimedStudentIds);
    (profs || []).forEach(p => { studentProfiles[p.id] = p; });
  }

  // Student quiz sessions (RLS returns only teacher's students' sessions)
  let studentSessions = [];
  let studentAttempts = [];
  if (claimedStudentIds.length > 0) {
    const [sessRes, attRes] = await Promise.all([
      supabase
        .from('quiz_sessions')
        .select('user_id, quiz_set, plants_correct, question_count, chars_correct, chars_total, completed_at')
        .in('user_id', claimedStudentIds)
        .order('completed_at', { ascending: false }),
      supabase
        .from('plant_attempts')
        .select('plant_name, was_fully_correct')
        .in('user_id', claimedStudentIds)
    ]);
    studentSessions = sessRes.data || [];
    studentAttempts = attRes.data || [];
  }

  // Per-student summary
  const studentSummaries = claimedStudentIds.map(sid => {
    const name = studentProfiles[sid]?.full_name || 'Unknown';
    const sess = studentSessions.filter(s => s.user_id === sid);
    if (sess.length === 0) return { sid, name, quizzes: 0, avgPlant: null, avgChar: null, lastActive: null };
    const avgPlant = Math.round(sess.reduce((a, s) => a + pct(s.plants_correct, s.question_count), 0) / sess.length);
    const avgChar  = Math.round(sess.reduce((a, s) => a + pct(s.chars_correct, s.chars_total), 0) / sess.length);
    return { sid, name, quizzes: sess.length, avgPlant, avgChar, lastActive: sess[0].completed_at };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const missed = topMissed(studentAttempts);

  // ── Subscription card ──
  const subHtml = sub ? `
    <div class="dash-stat-grid">
      <div class="dash-stat">
        <div class="dash-stat-val">${sub.seats_purchased}</div>
        <div class="dash-stat-lbl">Seats Purchased</div>
      </div>
      <div class="dash-stat">
        <div class="dash-stat-val">${sub.seats_purchased - (sub.seats_used || 0)}</div>
        <div class="dash-stat-lbl">Seats Remaining</div>
      </div>
      <div class="dash-stat">
        <div class="dash-stat-val">${fmtDate(sub.expires_at)}</div>
        <div class="dash-stat-lbl">Expires</div>
      </div>
    </div>
  ` : '<div class="dash-empty">No active subscription found.</div>';

  // ── Students table ──
  const studentRows = studentSummaries.length
    ? studentSummaries.map(s => `
        <div class="dash-row">
          <div class="dash-row-main">
            <span class="dash-student-name">${s.name}</span>
            <span class="dash-row-date">${s.lastActive ? fmtDate(s.lastActive) : 'No quizzes yet'}</span>
          </div>
          <div class="dash-row-scores">
            ${s.quizzes > 0 ? `
              <span class="dash-score">
                <span class="dash-score-val">${s.avgPlant}%</span>
                <span class="dash-score-lbl">plants</span>
              </span>
              <span class="dash-score">
                <span class="dash-score-val">${s.avgChar}%</span>
                <span class="dash-score-lbl">chars</span>
              </span>
              <span class="dash-score">
                <span class="dash-score-val">${s.quizzes}</span>
                <span class="dash-score-lbl">quizzes</span>
              </span>
            ` : '<span class="dash-muted">No data yet</span>'}
          </div>
        </div>
      `).join('')
    : '<div class="dash-empty">No students yet. Generate an invite link to add students.</div>';

  // ── Invite section ──
  const canInvite = sub && (sub.seats_purchased - (sub.seats_used || 0)) > 0;
  const unclaimedLinks = seatList.filter(s => !s.student_id).map(s => `
    <div class="dash-invite-link-row">
      <span class="dash-invite-link-text" id="link-${s.id}">${window.location.origin}/auth.html?token=${s.invite_token}</span>
      <button class="dash-copy-btn" onclick="copyInvite('${s.id}', '${window.location.origin}/auth.html?token=${s.invite_token}')">Copy</button>
    </div>
  `).join('');

  const inviteHtml = `
    ${unclaimedLinks
      ? `<div class="dash-section-subtitle">Pending (not yet claimed)</div>
         <div class="dash-invite-links">${unclaimedLinks}</div>`
      : ''}
    <button id="gen-invite-btn" class="action-btn dash-invite-gen-btn"
      ${!canInvite ? 'disabled' : ''}>
      ${canInvite ? 'Generate New Invite Link' : 'No seats remaining'}
    </button>
    <div id="new-invite-area"></div>
  `;

  // ── Class-wide missed plants ──
  const missedRows = missed.length
    ? missed.map(([name, v]) => `
        <div class="dash-row dash-missed-row">
          <span class="dash-missed-name">${name}</span>
          <span class="dash-missed-count">${v.missed}/${v.total} missed</span>
        </div>
      `).join('')
    : '<div class="dash-empty">No quiz data yet from students.</div>';

  root.innerHTML = shell(`${profile.full_name || 'Teacher'} — Dashboard`, `
    ${subHtml}

    <div class="dash-section">
      <div class="dash-section-title">Students</div>
      <div class="dash-list">${studentRows}</div>
    </div>

    <div class="dash-section">
      <div class="dash-section-title">Class-Wide Most Missed Plants</div>
      <div class="dash-list">${missedRows}</div>
    </div>

    <div class="dash-section">
      <div class="dash-section-title">Invite Students</div>
      ${sub ? inviteHtml : '<div class="dash-empty">Purchase a subscription to invite students.</div>'}
    </div>
  `);

  signOutListener();

  if (canInvite) {
    document.getElementById('gen-invite-btn').addEventListener('click', () => generateInvite(userId, sub.id));
  }
}

// ── Generate invite link ──────────────────────────────────────

async function generateInvite(teacherId, subscriptionId) {
  const btn = document.getElementById('gen-invite-btn');
  btn.disabled = true;
  btn.textContent = 'Generating…';

  const { data: seat, error } = await supabase
    .from('seats')
    .insert({ subscription_id: subscriptionId, teacher_id: teacherId })
    .select('invite_token')
    .single();

  if (error || !seat) {
    alert('Failed to generate invite link. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Generate New Invite Link';
    return;
  }

  const link = `${window.location.origin}/auth.html?token=${seat.invite_token}`;
  const area = document.getElementById('new-invite-area');
  area.innerHTML = `
    <div class="dash-new-link-box">
      <div class="dash-new-link-label">New invite link — copy and send to your student:</div>
      <div class="dash-invite-link-row">
        <span class="dash-invite-link-text">${link}</span>
        <button class="dash-copy-btn" onclick="navigator.clipboard.writeText('${link}').then(()=>this.textContent='Copied!').catch(()=>{})">Copy</button>
      </div>
    </div>
  `;

  btn.textContent = 'Generate Another Link';
  btn.disabled = false;
}

// ── Copy helper (called from inline onclick) ──────────────────

function copyInvite(id, url) {
  navigator.clipboard.writeText(url)
    .then(() => {
      const el = document.getElementById(`link-${id}`);
      if (el) { const orig = el.textContent; el.textContent = 'Copied!'; setTimeout(() => el.textContent = orig, 2000); }
    })
    .catch(() => {});
}
