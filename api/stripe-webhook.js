// ============================================================
// POST /api/stripe-webhook
// Receives Stripe events. bodyParser disabled in vercel.json
// so the raw body is available for signature verification.
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
// If today is before June 1, that's this calendar year.
// If today is on/after June 1, it's next calendar year.
function calcExpiresAt() {
  const now  = new Date();
  const june = new Date(Date.UTC(now.getUTCFullYear(), 5, 1)); // June 1 UTC
  if (now < june) return june.toISOString();
  return new Date(Date.UTC(now.getUTCFullYear() + 1, 5, 1)).toISOString();
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
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
      // Not a Range Quiz checkout — ignore
      return res.status(200).json({ received: true });
    }

    const seatsPurchased = tier === 'bulk' ? 6 : 1;
    const expiresAt      = calcExpiresAt();

    // Upsert so repurchases renew the existing row instead of erroring
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

    console.log(`Subscription activated: userId=${userId}, tier=${tier}, expires=${expiresAt}`);
  }

  res.status(200).json({ received: true });
};
