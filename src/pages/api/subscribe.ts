import type { APIRoute } from 'astro';

export const prerender = false;

const LIST_ID = '3edfa6f6-22cf-11f1-b3f0-3bda711e24fc';
const API_KEY = 'eo_d2fa87b69116a8f3ea353a7f452781168587656ea3761ed314a8ed2c5c2c74a1';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const email = body.email?.trim();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return new Response(JSON.stringify({
        error: true,
        message: "Ange en giltig e‑postadress."
      }), { status: 400 });
    }
    const res = await fetch(`https://emailoctopus.com/api/1.6/lists/${LIST_ID}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: API_KEY,
        email_address: email,
        status: 'subscribed',
      }),
    });
    const data = await res.json();
    if (data?.error?.code === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
      return new Response(JSON.stringify({
        error: false,
        message: "Du är redan prenumerant!"
      }), { status: 200 });
    }
    if (!res.ok) {
      return new Response(JSON.stringify({
        error: true,
        message: data?.error?.message || "Något gick fel med registreringen."
      }), { status: res.status });
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Tack! Du är nu prenumerant 🎉"
    }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({
      error: true,
      message: "Serverfel. Försök igen senare."
    }), { status: 500 });
  }
};
