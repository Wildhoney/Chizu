import * as React from "react";

/**
 * @returns {string}
 */
export function useCacheKey(): string {
  const id = React.useId();
  const alphanumeric = id.replace(/[^a-zA-Z0-9]/g, "");

  return alphanumeric.replace(/\d/g, (digit) =>
    String.fromCharCode(103 + parseInt(digit, 10)),
  );
}
