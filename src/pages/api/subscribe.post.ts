import type { APIRoute } from 'astro';

const LIST_ID = '3edfa6f6-22cf-11f1-b3f0-3bda711e24fc';
const API_KEY = 'eo_ca40f8c218ec500da0322ef8027f47adf656c6d9a1b56493102e40ab1c28a0b8';

export const post: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const email = body.email?.trim();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return new Response(JSON.stringify({ error: true, message: "Ange en giltig e‑postadress." }), { status: 400 });
    }

    const res = await fetch(`https://api.emailoctopus.com/lists/${LIST_ID}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
      }),
    });

    const data = await res.json();

    if (res.status === 404) {
      return new Response(JSON.stringify({ error: true, message: "Listan hittades inte. Kontrollera LIST_ID." }), { status: 404 });
    }

    if (data?.type === "https://emailoctopus.com/api-documentation/v2#already-exists") {
      return new Response(JSON.stringify({ error: false, message: "Du är redan prenumerant!" }), { status: 200 });
    }

    if (!res.ok) {
      return new Response(JSON.stringify({ error: true, message: data.detail || "Något gick fel med registreringen." }), { status: res.status });
    }

    return new Response(JSON.stringify({ success: true, message: "Tack! Du är nu prenumerant 🎉" }), { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: true, message: "Serverfel. Försök igen senare." }), { status: 500 });
  }
};
