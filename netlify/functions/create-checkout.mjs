
export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405, headers: { "content-type": "application/json" }
    });
  }

  const secretKey = Netlify.env.get("STRIPE_SECRET_KEY");
  const priceId = Netlify.env.get("STRIPE_PRICE_KP227");
  const siteUrl = Netlify.env.get("URL");

  if (!secretKey || !priceId || !siteUrl) {
    return new Response(JSON.stringify({
      error: "Checkout is not configured yet. Add the required Sandbox environment variables in Netlify."
    }), { status: 500, headers: { "content-type": "application/json" } });
  }
  if (!secretKey.startsWith("sk_test_")) {
    return new Response(JSON.stringify({
      error: "This setup accepts Sandbox keys only. Do not use a Live key yet."
    }), { status: 400, headers: { "content-type": "application/json" } });
  }

  let body;
  try { body = await request.json(); }
  catch {
    return new Response(JSON.stringify({ error: "Invalid request." }), {
      status: 400, headers: { "content-type": "application/json" }
    });
  }

  const items = body?.items;
  if (!Array.isArray(items) || items.length !== 1 ||
      Number(items[0]?.id) !== 1 ||
      !Number.isInteger(Number(items[0]?.quantity)) ||
      Number(items[0].quantity) < 1 || Number(items[0].quantity) > 10) {
    return new Response(JSON.stringify({
      error: "Only 1–10 units of the KP-227 earbuds are enabled for this Sandbox test."
    }), { status: 400, headers: { "content-type": "application/json" } });
  }

  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("success_url", `${siteUrl}/?checkout=success`);
  form.set("cancel_url", `${siteUrl}/?checkout=cancel`);
  form.set("line_items[0][price]", priceId);
  form.set("line_items[0][quantity]", String(Number(items[0].quantity)));
  form.set("billing_address_collection", "auto");

  try {
    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${secretKey}`,
        "content-type": "application/x-www-form-urlencoded"
      },
      body: form
    });
    const session = await stripeResponse.json();
    if (!stripeResponse.ok) {
      return new Response(JSON.stringify({
        error: session?.error?.message || "Stripe could not create the test checkout."
      }), { status: 502, headers: { "content-type": "application/json" } });
    }
    return new Response(JSON.stringify({ url: session.url }), {
      status: 200, headers: { "content-type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Could not connect to Stripe." }), {
      status: 502, headers: { "content-type": "application/json" }
    });
  }
};
