// USAGE MOVE TO: netlify/edge-functions/password-gate.js
//
// Simple site-wide password splash screen.
// Set the real password in Netlify: Site configuration > Environment variables
// as SITE_PASSWORD. Do NOT hardcode it here.
//
// To remove the gate later: delete this file (and the [[edge_functions]]
// block in netlify.toml) and redeploy.

const COOKIE_NAME = "avcasa_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export default async (request, context) => {
  const url = new URL(request.url);

  // Never gate the assets - only HTML pages need the check.
  // (Edge function config below already limits which paths this runs on,
  // this is just a belt-and-braces second check.)
  if (/\.(css|js|png|jpe?g|svg|woff2?|ttf|eot|ico|pdf|json)$/i.test(url.pathname)) {
    return context.next();
  }

  const correctPassword = Deno.env.get("SITE_PASSWORD");

  // If no password is configured, don't lock people out by accident.
  if (!correctPassword) {
    return context.next();
  }

  // Handle password form submission
  if (request.method === "POST") {
    const form = await request.formData();
    const submitted = form.get("password");

    if (submitted === correctPassword) {
      const response = new Response(null, {
        status: 303,
        headers: { Location: url.pathname },
      });
      response.headers.append(
        "Set-Cookie",
        `${COOKIE_NAME}=granted; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`
      );
      return response;
    }

    return new Response(renderGate(true), {
      status: 401,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  // Already unlocked?
  const cookie = request.headers.get("cookie") || "";
  if (cookie.includes(`${COOKIE_NAME}=granted`)) {
    return context.next();
  }

  // Otherwise show the splash screen
  return new Response(renderGate(false), {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};

function renderGate(wrongPassword) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>AVCASA — Site en préparation</title>
<style>
  * { box-sizing: border-box; }
  html, body {
    height: 100%;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: linear-gradient(160deg, #10243e 0%, #1c3f66 45%, #2d6ca3 100%);
    color: #fff;
  }
  .wrap {
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .card {
    width: 100%;
    max-width: 380px;
    text-align: center;
  }
  h1 {
    font-size: 1.9rem;
    letter-spacing: 0.06em;
    margin: 0 0 0.25rem;
    font-weight: 700;
  }
  p.sub {
    opacity: 0.85;
    margin: 0 0 2rem;
    font-size: 0.95rem;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  input[type="password"] {
    padding: 0.85rem 1rem;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.08);
    color: #fff;
    font-size: 1rem;
    outline: none;
  }
  input[type="password"]::placeholder { color: rgba(255,255,255,0.6); }
  input[type="password"]:focus { border-color: #fff; }
  button {
    padding: 0.85rem 1rem;
    border-radius: 8px;
    border: none;
    background: #fff;
    color: #10243e;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
  }
  button:hover { background: #e5eef7; }
  .error {
    color: #ffb3b3;
    font-size: 0.9rem;
    margin: 0;
    min-height: 1.2em;
  }
  .footer {
    margin-top: 2.5rem;
    font-size: 0.8rem;
    opacity: 0.6;
  }
</style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>AVCASA</h1>
      <p class="sub">Le site est en cours de préparation.<br/>Merci de saisir le mot de passe pour continuer.</p>
      <form method="POST">
        <input type="password" name="password" placeholder="Mot de passe" autofocus required />
        <p class="error">${wrongPassword ? "Mot de passe incorrect." : ""}</p>
        <button type="submit">Accéder au site</button>
      </form>
      <div class="footer">Association Vélivole de Château-Arnoux / Saint-Auban</div>
    </div>
  </div>
</body>
</html>`;
}
