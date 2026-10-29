// SPDX-FileCopyrightText: 2026 Marcus Baw
// SPDX-License-Identifier: MIT

// Formatting helpers used by the templates. They follow the NHS digital
// service manual style: "8am to 6:30pm", "Thursday 12 November 2026", "£82,000".

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ukTime(value) {
  const match = /^(\d{2}):(\d{2})$/.exec(String(value ?? ""));
  if (!match) return value;
  const hours = Number(match[1]);
  const minutes = match[2];
  if (hours === 12 && minutes === "00") return "midday";
  if (hours === 0 && minutes === "00") return "midnight";
  const suffix = hours >= 12 ? "pm" : "am";
  const h = hours % 12 === 0 ? 12 : hours % 12;
  return minutes === "00" ? `${h}${suffix}` : `${h}:${minutes}${suffix}`;
}

export function timeRange(slot) {
  return `${ukTime(slot.opens)} to ${ukTime(slot.closes)}`;
}

export function ukDate(value, withDay = true) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? ""));
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  const text = `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  return withDay ? `${DAYS[date.getUTCDay()]} ${text}` : text;
}

export function money(value) {
  if (typeof value !== "number") return value;
  return `£${Math.round(value).toLocaleString("en-GB")}`;
}

export function postcodeMapUrl(site) {
  if (site.map_url) return site.map_url;
  const query = encodeURIComponent([...(site.address ?? []), site.postcode].join(", "));
  return `https://www.openstreetmap.org/search?query=${query}`;
}

export function hostOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
