import { useState, useEffect } from "react";
import { buildPayload } from "../utils/payload";

export function useEstimate({ days, numPeople, season }) {
  const [detail, setDetail] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchEstimate = async () => {
      const query = new URLSearchParams({
        numPeople: numPeople.toString(),
        season,
      });

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/estimate?${query.toString()}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildPayload(days)),
          }
        );

        const data = await res.json();
        setDetail(data.detail || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error("Ошибка запроса:", err);
      }
    };

    fetchEstimate();
  }, [days, numPeople, season]);

  return { detail, total };
}
