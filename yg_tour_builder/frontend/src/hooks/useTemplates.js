// src/hooks/useTemplates.js Меню загрузки шаблона
import { useEffect, useState } from "react";

export function useTemplates(region) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!region) return;

    fetch(`${import.meta.env.VITE_API_URL}/directions`)
      .then(res => res.json())
      .then((data) => {
        const tmpl = data?.[region]?.templates || [];
        setTemplates(tmpl);
        setError(null);
      })
      .catch((err) => {
        console.error("Ошибка загрузки шаблонов:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [region]);

  return { templates, loading, error };
}
