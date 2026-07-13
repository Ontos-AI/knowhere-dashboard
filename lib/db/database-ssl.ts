const UNSAFE_DB_SSL_ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);

export function getDatabaseSslConfig(unsafeDbSslEnabled: string | undefined):
  | false
  | {
      rejectUnauthorized: boolean;
    } {
  const shouldDisableDatabaseSsl = UNSAFE_DB_SSL_ENABLED_VALUES.has(
    (unsafeDbSslEnabled ?? "false").trim().toLowerCase()
  );

  if (shouldDisableDatabaseSsl) {
    return false;
  }

  return {
    rejectUnauthorized: true,
  };
}
