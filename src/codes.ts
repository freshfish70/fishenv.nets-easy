/**
 * Decline code groups derived from ./codes.md.
 *
 * HD = hard decline
 * SD = soft decline
 */
export const HARD_DECLINE: readonly string[] = [
  "04",
  "06",
  "07",
  "12",
  "14",
  "15",
  "41",
  "43",
  "46",
  "54",
  "56",
  "57",
  "79",
];

export const SOFT_DECLINE: readonly string[] = [
  "01",
  "03",
  "05",
  "13",
  "19",
  "22",
  "30",
  "31",
  "34",
  "42",
  "51",
  "55",
  "58",
  "59",
  "61",
  "62",
  "63",
  "65",
  "75",
  "78",
  "80",
  "82",
  "83",
  "85",
  "86",
  "91",
  "92",
  "93",
  "96",
];

/**
 * Backwards-compatible alias.
 */
export const NON_RETRYABLE_ERROR_CODES = HARD_DECLINE;
