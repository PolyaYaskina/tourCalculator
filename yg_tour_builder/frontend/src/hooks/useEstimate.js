import { useEffect, useState } from "react";
import { useTourStore } from "../store/useTourStore";

export function useEstimate() {
  const { draft } = useTourStore();
  const [detail, setDetail] = useState([]);
  const [total, setTotal] = useState(0);
console.log("ESTIMATE", draft)
  useEffect(() => {
    const fetchEstimate = async () => {
      try {

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/estimate?numPeople=${draft.numPeople}&season=${draft.season}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(draft),
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
  }, [draft]); // триггер на любые изменения

  return { detail, total };
}
