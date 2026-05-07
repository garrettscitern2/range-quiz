// ============================================================
// POST /api/stripe-webhook
// Receives Stripe events and activates subscriptions.
//
// bodyParser is disabled via the config export below so we
// receive the raw request body needed for Stripe signature
// verification. Without the raw body, constructEvent() fails.
// ============================================================

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Service-role client bypasses RLS — only used server-side
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Returns June 1 of the current school year.
// Before June 1  → June 1 this calendar year
// On/after June 1 → June 1 next calendar year
function calcExpiresAt() {
  const now  = new Date();
  const june = new Date(Date.UTC(now.getUTCFullYear(), 5, 1));
  if (now < june) return june.toISOString();
  return new Date(Date.UTC(now.getUTCFullYear() + 1, 5, 1)).toISOString();
}

// Read the raw request body as a Buffer from the Node.js stream
function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await readRawBody(req);
  const sig     = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, tier } = session.metadata || {};

    if (!userId || !tier) {
      // Not a Range Quiz checkout — ignore silently
      return res.status(200).json({ received: true });
    }

    const seatsPurchased = tier === 'bulk' ? 6 : 1;
    const expiresAt      = calcExpiresAt();

    // Upsert so repurchases renew the existing row
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .upsert(
        {
          owner_id:           userId,
          tier,
          seats_purchased:    seatsPurchased,
          seats_used:         0,
          is_active:          true,
          expires_at:         expiresAt,
          stripe_customer_id: session.customer ?? null,
        },
        { onConflict: 'owner_id' }
      );

    if (error) {
      console.error('Supabase upsert error:', error);
      return res.status(500).end();
    }

    console.log(`Subscription activated: userId=${userId} tier=${tier} expires=${expiresAt}`);
  }

  res.status(200).json({ received: true });
}

// Disable Vercel's automatic JSON body parsing so the raw
// body bytes are available for Stripe signature verification.
handler.config = {
  api: {
    bodyParser: false,
  },
};

module.exports = handler;
