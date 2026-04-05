const AUTH_PATHS = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
]);

export function safeReturnPath(from) {
  if (typeof from !== "string" || !from.startsWith("/")) return null;
  if (from.startsWith("//")) return null;
  const pathname = from.split(/[?#]/)[0];
  if (AUTH_PATHS.has(pathname)) return null;
  return from;
}
