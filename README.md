# PickMyAI 🎯

**Find your perfect AI tool in under 2 minutes.**

Answer 5 questions. Get 3 hand-picked AI tools matched to your needs, budget, and skill level — powered by Claude AI.

---

## 🚀 Deploy to Netlify in 3 steps

1. Push this folder to a GitHub repo
2. Connect the repo to Netlify (netlify.com → Add new site → Import from Git)
3. Deploy — done. Your site is live.

---

## 🔑 API Key Setup

The matcher is powered by the Anthropic Claude API.

**Option A — User provides their own key (current default)**
Users paste their Anthropic API key directly in the app. It's saved to their browser's localStorage. No backend needed.

**Option B — Use your own key (recommended for production)**
1. Create a Netlify serverless function in `/netlify/functions/match.js`
2. Add your `ANTHROPIC_API_KEY` to Netlify environment variables
3. Point the fetch call in `index.html` to `/.netlify/functions/match` instead of the direct API

---

## 💰 Monetisation (coming soon)

- **Affiliate links** — earn commission when users sign up to tools via your links
- **Premium tier** — deeper recommendations, tool comparisons, saved history (add Supabase)
- **Email list** — weekly AI tool digest newsletter (connect to Resend or Mailchimp)

---

## 🛠 Tech Stack

- Pure HTML/CSS/JS — zero dependencies, zero build step
- Anthropic Claude API for AI-powered recommendations
- Netlify for hosting + CDN
- localStorage for API key storage (no backend needed to start)

---

## 📬 Email Collection

To activate the email signup, connect to Supabase or Resend:

```js
// In index.html subscribeEmail() function, replace the TODO with:
const res = await fetch('https://api.resend.com/audiences/YOUR_ID/contacts', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_RESEND_KEY', 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});
```

---

Built with ♥ by PickMyAI
