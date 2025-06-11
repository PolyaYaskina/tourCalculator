import { useEffect, useState } from "react";
import YAML from "yaml";

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 Загрузка при инициализации
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/services.yaml`);
        const text = await res.text();
        const parsed = YAML.parse(text);
        setServices(Array.isArray(parsed) ? parsed : parsed?.services || []);
      } catch (err) {
        console.error("Ошибка загрузки services.yaml:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // 💾 Автосохранение в localStorage (опционально)
  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  return { services, setServices, loading };
}
