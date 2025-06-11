import { useState, useEffect } from "react";
import YAML from "yaml";

export function useServices() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFromStorage = () => {
    const raw = localStorage.getItem("services");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return null;
    }
  };

  useEffect(() => {
    console.log("🔄 Монтируем useServices");
    const raw = localStorage.getItem("services");
    console.log("📦 services из localStorage:", raw);

    const initial = loadFromStorage();
    if (initial && initial.length > 0) {
      setServices(initial);
      setIsLoading(false);
      return;
    }

    // ⬇️ Если пусто — загрузка YAML
    fetch(`${import.meta.env.VITE_API_URL}/services.yaml`)
      .then((res) => res.text())
      .then((text) => {
        try {
          const parsed = YAML.parse(text);
          const list = Array.isArray(parsed) ? parsed : parsed?.services;
          if (!Array.isArray(list)) throw new Error("Invalid YAML structure");

          setServices(list);
          localStorage.setItem("services", JSON.stringify(list));
        } catch (err) {
          console.error("Ошибка YAML:", err);
          setServices([]);
        } finally {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Ошибка загрузки services.yaml:", err);
        setServices([]);
        setIsLoading(false);
      });
  }, []);

  // 🔁 Следим за событиями
  useEffect(() => {
    const reload = () => {
      const latest = loadFromStorage();
      if (latest) {
        console.log("🔃 Обновляем из localStorage после события:", latest);
        setServices(latest);
      }
    };

    window.addEventListener("focus", reload);
    window.addEventListener("storage", reload);
    return () => {
      window.removeEventListener("focus", reload);
      window.removeEventListener("storage", reload);
    };
  }, []);

  return { services, isLoading };
}
