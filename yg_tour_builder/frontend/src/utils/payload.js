export function buildPayload(days) {
  const payload = {};
  days.forEach((day, i) => {
    payload[i + 1] = {
      description: day.description.trim(),
      services: day.services.filter((s) => s.trim()),
    };
  });
  return payload;
}