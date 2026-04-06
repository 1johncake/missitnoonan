exports.handler = async function(event) {
  const url = event.queryStringParameters && event.queryStringParameters.url;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing url parameter' })
    };
  }

  // Whitelist — only allow your own Google Sheet
  const ALLOWED = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSqbVI6yCwYknOsNDGxuR95oBBrRIrUq2EISUq-BkSNqaEN9VQn5wFf4RVLRWvQWig3VBobPD0hPSG4/';
  if (!url.startsWith(ALLOWED)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'URL not allowed' })
    };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Upstream HTTP ${response.status}`);
    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: err.message })
    };
  }
};
