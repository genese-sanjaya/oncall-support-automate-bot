import fetch from 'node-fetch';
import { confluenceConfig } from '../config/config.js';

async function getOrCreateChildPage(title, parentId) {
  const { baseUrl, authEmail, authToken, spaceKey } = confluenceConfig;
  const searchUrl = `${baseUrl}/rest/api/content?title=${encodeURIComponent(title)}&spaceKey=${spaceKey}`;

  const searchRes = await fetch(searchUrl, {
    headers: {
      Authorization:
        'Basic ' + Buffer.from(`${authEmail}:${authToken}`).toString('base64'),
      Accept: 'application/json',
    },
  });
  const searchData = await searchRes.json();
  if (searchData.size > 0) {
    return searchData.results[0].id;
  }

  const body = {
    type: 'page',
    title,
    space: { key: spaceKey },
    ancestors: [{ id: parentId }],
    body: {
      storage: { value: '<p>Placeholder</p>', representation: 'storage' },
    },
  };
  const createRes = await fetch(`${baseUrl}/rest/api/content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' + Buffer.from(`${authEmail}:${authToken}`).toString('base64'),
    },
    body: JSON.stringify(body),
  });
  const page = await createRes.json();
  return page.id;
}

export async function publishToConfluence(report) {
  const { baseUrl, spaceKey, parentPageId, authEmail, authToken } =
    confluenceConfig;
  const today = new Date();
  const yyyyMm = today.toISOString().slice(0, 7);
  const yyyyMmDd = today.toISOString().slice(0, 10);

  const monthPageId = await getOrCreateChildPage(yyyyMm, parentPageId);

  const body = {
    type: 'page',
    title: yyyyMmDd,
    space: { key: spaceKey },
    ancestors: [{ id: monthPageId }],
    body: {
      storage: { value: `<pre>${report}</pre>`, representation: 'storage' },
    },
  };

  const res = await fetch(`${baseUrl}/rest/api/content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' + Buffer.from(`${authEmail}:${authToken}`).toString('base64'),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error('❌ Failed to publish to Confluence:', await res.text());
  } else {
    console.log(`✅ Report published under ${yyyyMm}/${yyyyMmDd}`);
  }
}
