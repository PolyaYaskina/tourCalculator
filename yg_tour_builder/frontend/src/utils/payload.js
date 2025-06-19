export function buildPayload(days) {
  const payload = {};
  days.forEach((day, i) => {
    payload[i + 1] = {
      description: (day.description || "").trim(),
      services: (day.services || [])
        .map((s) => (typeof s === "string" ? s : s.key))
        .filter((key) => typeof key === "string" && key.trim()),
    };
  });
  return payload;
}
