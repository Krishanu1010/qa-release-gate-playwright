export type TestEnvironment = 'local' | 'ci' | 'staging';

const environmentName = process.env.TEST_ENV ?? (process.env.CI ? 'ci' : 'local');
const supportedEnvironments: TestEnvironment[] = ['local', 'ci', 'staging'];

if (!supportedEnvironments.includes(environmentName as TestEnvironment)) {
  throw new Error(
    `Unsupported TEST_ENV "${environmentName}". Choose one of: ${supportedEnvironments.join(', ')}.`,
  );
}

const name = environmentName as TestEnvironment;
const localBaseUrl = 'http://127.0.0.1:4173';
const configuredBaseUrl = process.env.BASE_URL?.trim();
const baseURL = configuredBaseUrl || (name === 'staging' ? undefined : localBaseUrl);

if (!baseURL) {
  throw new Error('BASE_URL is required when TEST_ENV=staging.');
}

let parsedBaseUrl: URL;
try {
  parsedBaseUrl = new URL(baseURL);
} catch {
  throw new Error(`BASE_URL must be an absolute URL. Received: "${baseURL}".`);
}

if (!['http:', 'https:'].includes(parsedBaseUrl.protocol)) {
  throw new Error(`BASE_URL must use HTTP or HTTPS. Received: "${baseURL}".`);
}

export const environment = {
  name,
  baseURL: parsedBaseUrl.toString().replace(/\/$/, ''),
  startsDemoServer: name !== 'staging',
} as const;
