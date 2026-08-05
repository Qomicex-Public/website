export const config = { runtime: 'edge' };

import type { APIRoute } from 'astro';
import {
  getIntegrationKey,
  getDeployContext,
  buildChangeUrl,
  type FlashdutyChangePayload,
  type FlashdutyAlertPayload,
} from '../../../lib/flashduty';

const FLASHDUTY_BASE = 'https://api.flashcat.cloud';

async function pushToFlashduty(path: string, body: FlashdutyChangePayload | FlashdutyAlertPayload) {
  const key = getIntegrationKey();
  if (!key) {
    return { ok: false, error: 'FLASHDUTY_INTEGRATION_KEY not configured' } as const;
  }

  const url = `${FLASHDUTY_BASE}${path}?integration_key=${encodeURIComponent(key)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, status: res.status, error: text } as const;
    }

    return { ok: true } as const;
  } catch (err) {
    return { ok: false, error: (err as Error).message } as const;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as FlashdutyChangePayload | FlashdutyAlertPayload;

    if (!body?.change_status && !body?.alert_status) {
      return new Response(JSON.stringify({ error: 'change_status or alert_status required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { labels, change_key } = getDeployContext();

    if ('change_status' in body) {
      const change: FlashdutyChangePayload = {
        ...body,
        change_key: body.change_key || change_key,
        labels: { ...labels, ...body.labels },
        link: body.link || buildChangeUrl(),
      };

      const result = await pushToFlashduty('/event/push/change/standard', change);
      return new Response(JSON.stringify(result), {
        status: result.ok ? 200 : 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const alert: FlashdutyAlertPayload = {
      ...body,
      alert_key: body.alert_key || change_key,
      labels: { ...labels, ...body.labels },
    };

    const result = await pushToFlashduty('/event/push/alert/standard', alert);
    return new Response(JSON.stringify(result), {
      status: result.ok ? 200 : 502,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
