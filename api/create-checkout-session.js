// ============================================================
// POST /api/create-checkout-session
// Body: { userId: string, tier: 'individual' | 'bulk' }
// Tiers: individual = $20/yr (1 seat), bulk = $100/yr (6 seats)
// Returns: { url: string }  — Stripe Checkout URL to redirect to
// ============================================================

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, tier } = req.body;
  if (!userId || !tier) {
    return res.status(400).json({ error: 'Missing userId or tier' });
  }

  const priceId = tier === 'bulk'
    ? process.env.STRIPE_BULK_PRICE_ID
    : process.env.STRIPE_INDIVIDUAL_PRICE_ID;

  if (!priceId) {
    return res.status(500).json({ error: 'Price ID not configured' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId, tier },
      success_url: `${process.env.APP_BASE_URL}/auth.html?payment=success`,
      cancel_url:  `${process.env.APP_BASE_URL}/auth.html?reason=no_subscription`,
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
