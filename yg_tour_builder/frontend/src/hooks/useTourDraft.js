import { useEffect, useState } from "react";

export function useTourDraft({
  days,
  numPeople,
  startDate,
  endDate,
  title,
  region,
  scenarioChosen,
  setDays,
  setNumPeople,
  setStartDate,
  setEndDate,
  setTitle,
  setRegion,
  setScenarioChosen,
}) {
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  // 🗃️ Загрузка черновика
  useEffect(() => {
    const raw = localStorage.getItem("tour_draft");
    if (!raw) {
      setIsDraftLoaded(true);
      return;
    }

    try {
      const data = JSON.parse(raw);
      console.log("📦 Загруженный черновик:", data);
      if (data.days) setDays(data.days);
      if (data.numPeople) setNumPeople(data.numPeople);
      if (data.startDate) setStartDate(data.startDate);
      if (data.endDate) setEndDate(data.endDate);
      if (data.title) setTitle(data.title);
      if (data.region) setRegion(data.region);
      if (data.scenarioChosen) setScenarioChosen(data.scenarioChosen);
    } catch (err) {
      console.warn("⚠️ Ошибка при загрузке черновика:", err);
    }
    setIsDraftLoaded(true);
  }, []);

  // 💾 Автосохранение черновика
  useEffect(() => {
    if (!isDraftLoaded) return;
    const draft = JSON.stringify({
      days,
      numPeople,
      startDate,
      endDate,
      title,
      region,
      scenarioChosen,
    });
   // console.log("💾 Сохраняем черновик:", draft);
    localStorage.setItem("tour_draft", draft);
  }, [
    days,
    numPeople,
    startDate,
    endDate,
    title,
    region,
    scenarioChosen,
    isDraftLoaded,
  ]);
}
