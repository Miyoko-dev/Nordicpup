import type { APIRoute } from 'astro';

const LIST_ID = '3edfa6f6-22cf-11f1-b3f0-3bda711e24fc';

export const POST: APIRoute = async ({ request, locals }) => {
  const API_KEY = (locals.runtime as any).env.EMAILOCTOPUS_KEY;

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
