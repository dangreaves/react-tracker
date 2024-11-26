/**
 * Generate a simple non-secure unique ID.
 *
 * This uses a simple date + random algo to avoid bringing in any dependencies
 * or relying on crypto.
 *
 * There is no need for it to be cryptographically secure since it's only used
 * to give tracker events a unique ID.
 */
export function generateNonSecureUniqueId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
