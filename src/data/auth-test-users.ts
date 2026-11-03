import { randomBytes } from 'node:crypto';
import { environment } from '../../config/environment';

export type AuthTestUser = {
  email: string;
  password: string;
  displayName: string;
  role: 'customer' | 'agent';
};

function resolveCredential(name: string, generate: () => string): string {
  const configured = process.env[name]?.trim();
  if (configured) return configured;

  if (environment.name === 'staging') {
    throw new Error(`${name} must be set when TEST_ENV=staging.`);
  }

  const generated = generate();
  process.env[name] = generated;
  return generated;
}

const customerEmail = process.env.QA_CUSTOMER_EMAIL?.trim() || 'customer@example.test';
const agentEmail = process.env.QA_AGENT_EMAIL?.trim() || 'agent@example.test';

export const authTestUsers: Record<'customer' | 'agent', AuthTestUser> = {
  customer: {
    email: customerEmail,
    password: resolveCredential('QA_CUSTOMER_PASSWORD', () => randomBytes(24).toString('base64url')),
    displayName: 'Casey Customer',
    role: 'customer',
  },
  agent: {
    email: agentEmail,
    password: resolveCredential('QA_AGENT_PASSWORD', () => randomBytes(24).toString('base64url')),
    displayName: 'Avery Agent',
    role: 'agent',
  },
};
