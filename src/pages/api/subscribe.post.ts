import type { APIRoute } from 'astro';

const FORM_ID = '3edfa6f6-22cf-11f1-b3f0-3bda711e24fc';
const API_KEY = 'eo_ca40f8c218ec500da0322ef8027f47adf656c6d9a1b56493102e40ab1c28a0b8';

export const post: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const email = data.email;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
    }

    const res = await fetch(`https://api.emailoctopus.com/lists/${FORM_ID}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ email_address: email, status: 'SUBSCRIBED' }),
    });

    if (!res.ok) {
      const error = await res.json();
      return new Response(JSON.stringify({ error }), { status: res.status });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
