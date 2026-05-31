exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const { goal, budget, skill, industry, integration } = body;

  const prompt = `You are PickMyAI, an expert AI tool recommender. Recommend exactly 3 real, well-known AI tools for this user.

User profile:
- Goal: ${goal}
- Budget: ${budget}
- Skill level: ${skill}
- Industry: ${industry}
- Integration preference: ${integration}

Rules:
- Only recommend real, existing, popular AI tools
- Tool 1 = absolute best match for this profile
- Tool 2 = best budget-conscious or simpler alternative
- Tool 3 = most powerful/advanced option for power users
- The "why" must be one specific sentence explaining exactly why it fits THIS user's profile — not generic praise
- Price should be realistic and current (e.g. "Free", "Free / $20/mo", "$49/mo")

Respond ONLY with a valid JSON array. No markdown, no explanation, no code fences:
[
  {"name":"Tool Name","tagline":"Short tagline under 7 words","why":"One specific sentence why this fits.","price":"Free / $20/mo","badge":"best match","url":"https://toolwebsite.com"},
  {"name":"Tool Name","tagline":"Short tagline under 7 words","why":"One specific sentence why this fits.","price":"$10/mo","badge":"budget pick","url":"https://toolwebsite.com"},
  {"name":"Tool Name","tagline":"Short tagline under 7 words","why":"One specific sentence why this fits.","price":"$49/mo","badge":"power user","url":"https://toolwebsite.com"}
]`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const tools = JSON.parse(clean);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(tools)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get recommendations', detail: err.message })
    };
  }
};
