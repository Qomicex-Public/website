export type FlashdutyChangeStatus = 'Planned' | 'Ready' | 'Processing' | 'Canceled' | 'Done';

export interface FlashdutyChangePayload {
  change_status: FlashdutyChangeStatus;
  change_key: string;
  title: string;
  description?: string;
  link?: string;
  labels?: Record<string, string>;
}

export interface FlashdutyAlertPayload {
  alert_status: 'firing' | 'resolved';
  alert_key: string;
  title: string;
  description?: string;
  labels?: Record<string, string>;
}

export type FlashdutyPayload = FlashdutyChangePayload | FlashdutyAlertPayload;

export function getIntegrationKey(): string {
  return process.env.FLASHDUTY_INTEGRATION_KEY || '';
}

export function getDeployContext() {
  const labels: Record<string, string> = {
    service: 'website',
    env: process.env.VERCEL_ENV || 'production',
  };

  if (process.env.VERCEL_GIT_REPO_SLUG) {
    labels.vercel_project = process.env.VERCEL_GIT_REPO_SLUG;
  }

  const change_key = process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_DEPLOYMENT_URL || 'unknown';

  return { labels, change_key };
}

export function buildChangeUrl(deploymentUrl?: string): string {
  return deploymentUrl || `https://${process.env.VERCEL_URL || 'www.qomicex.top'}`;
}
