Tech360Labs — Stripe Sandbox checkout test

WHAT CHANGED
- Added a Netlify Function at netlify/functions/create-checkout.mjs.
- The storefront bag now sends checkout requests to the Netlify Function.
- The function creates a Stripe Checkout Session using a secret key stored in Netlify, never in browser code.
- Only the KP-227 earbuds (product ID 1) can be added to the bag / checked out.
- Other sample products are marked Coming soon.
- Sandbox only: the function rejects any Stripe key that does not start with sk_test_.

IMPORTANT
This ZIP is prepared but is NOT deployed or configured yet. Checkout will not work until you deploy it to Netlify and add the environment variables below.

NETLIFY SETUP
1. Deploy this complete ZIP/site folder to the same Netlify site.
2. In Netlify, open Site configuration (or Project configuration) > Environment variables.
3. Add STRIPE_SECRET_KEY with your Stripe Sandbox secret key (starts with sk_test_). Get it from Stripe Dashboard while Sandbox mode is selected. Do not paste it into this chat or into any website file.
4. Add STRIPE_PRICE_KP227 with the Stripe Price ID for the KP-227 earbuds:
   price_1Ua2eqFMyKkr8hxE1EQZnGUJ
5. Save the variables and trigger a fresh deploy so the function can read them.
6. Test the bag checkout using Stripe's official test card number 4242 4242 4242 4242, any future expiry date, any 3-digit CVC, and any valid test billing details. Never use a real card in Sandbox.

SAFETY / LIMITS
- Keep STRIPE_SECRET_KEY private. Never add it to index.html or share it in chat.
- This is Stripe Sandbox only; it cannot collect real payments.
- The current function supports only KP-227 earbuds and quantities 1–10.
- It does not yet save orders, send fulfillment emails, or automatically place CJdropshipping orders. Check successful test payments in Stripe Sandbox.
- Before launch, verify suppliers, stock, shipping, taxes, customer support, refunds, product compliance, and policies. Do not switch to Live mode until the complete order/fulfillment process is tested.
