import { useEffect, useRef, useState } from "react";

export function useTourDraft({
  days,
  numPeople,
  startDate,
  region,
  scenarioChosen,
  setDays,
  setNumPeople,
  setStartDate,
  setRegion,
  setScenarioChosen,
}) {
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  // Загрузка черновика
  useEffect(() => {
    const raw = localStorage.getItem("tour_draft");
    if (!raw) {
      setIsDraftLoaded(true);
      return;
    }

    try {
      const data = JSON.parse(raw);
      if (data.days) setDays(data.days);
      if (data.numPeople) setNumPeople(data.numPeople);
      if (data.startDate) setStartDate(data.startDate);
      if (data.region) setRegion(data.region);
      if (data.scenarioChosen) setScenarioChosen(data.scenarioChosen);
    } catch (err) {
      console.warn("Ошибка при загрузке черновика:", err);
    } finally {
      // Дать React время применить setX
      setTimeout(() => setIsDraftLoaded(true), 0);
    }
  }, []);

  // Сохранение после полной загрузки
  useEffect(() => {
    if (!isDraftLoaded) return;
    const draft = JSON.stringify({
      days,
      numPeople,
      startDate,
      region,
      scenarioChosen,
    });
    console.log("💾 Сохраняем черновик:", draft);
    localStorage.setItem("tour_draft", draft);
  }, [days, numPeople, startDate, region, scenarioChosen, isDraftLoaded]);
}