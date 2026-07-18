/**
 * Environment Variable Validator
 * Validates required environment variables at build/runtime startup.
 */

const requiredClientVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const requiredServerVars = [
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

const optionalServerVars = [
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_ADMIN_CHAT_ID",
  "TELEGRAM_WEBHOOK_SECRET",
  "NEXT_PUBLIC_TELEGRAM_BOT_USERNAME",
] as const;

interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

export function validateEnv(): EnvValidationResult {
  const result: EnvValidationResult = {
    valid: true,
    missing: [],
    warnings: [],
  };

  // Check client-side variables (must have NEXT_PUBLIC_ prefix)
  for (const key of requiredClientVars) {
    if (!process.env[key]) {
      result.missing.push(key);
      result.valid = false;
    }
  }

  // Check server-side variables (only in non-browser environments)
  if (typeof window === "undefined") {
    for (const key of requiredServerVars) {
      if (!process.env[key]) {
        result.missing.push(key);
        result.valid = false;
      }
    }

    for (const key of optionalServerVars) {
      if (!process.env[key]) {
        result.warnings.push(`${key} is not set. Related features may not work.`);
      }
    }
  }

  if (result.missing.length > 0) {
    console.error(
      `[EnvValidator] Missing required environment variables: ${result.missing.join(", ")}`
    );
  }

  if (result.warnings.length > 0) {
    console.warn(
      `[EnvValidator] Optional variables not configured:\n${result.warnings.join("\n")}`
    );
  }

  return result;
}

export function getEnvVar(key: string, required = false): string | undefined {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(
      `Required environment variable "${key}" is not set. ` +
      "Please check your .env.local file or deployment environment."
    );
  }
  return value;
}
