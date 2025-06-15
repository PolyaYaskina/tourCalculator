// src/hooks/useDirections.js
import { useEffect, useState } from "react";

export function useDirections() {
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/directions`)
      .then((res) => res.json())
      .then((data) => {
        const entries = Object.entries(data || {});
        const result = entries.map(([key, value]) => ({
          label: value.label || key,
          value: key,
        }));
        setDirections(result);
      })
      .catch((err) => console.error("Ошибка загрузки направлений:", err))
      .finally(() => setLoading(false));
  }, []);

  return { directions, loading };
}
