import React, { Fragment, useState, useEffect } from "react";
import { useTourDraft } from "./hooks/useTourDraft";
import { useServices } from "./hooks/useServices";
import { useEstimate } from "./hooks/useEstimate";
import { buildPayload } from "./utils/payload";
import EstimateTable from "./components/EstimateTable";

const initialDay = () => ({ description: "", services: ["#трансфер"] });

export default function TourEditor() {
  const { services, isLoading } = useServices();
  const [days, setDays] = useState([{ ...initialDay() }]);
  const [numPeople, setNumPeople] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [region, setRegion] = useState("baikal");
  const [scenarioChosen, setScenarioChosen] = useState(false);
  const season = (() => {
    if (!startDate) return "winter";
    const month = new Date(startDate).getMonth() + 1;
    return month >= 6 && month <= 9 ? "summer" : "winter";
  })();

  const { detail, total } = useEstimate({ days, numPeople, season });

  useTourDraft({
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
  });

  useEffect(() => {
    if (startDate && numPeople > 0) setScenarioChosen(true);
  }, [startDate, numPeople]);

  const handleChooseTemplate = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/template`);
      const data = await res.json();
      if (!data || !Array.isArray(data.days)) return;
      const valid = data.days.every(
        (d) => typeof d === "object" && typeof d.description === "string" && Array.isArray(d.services)
      );
      if (!valid) return;
      setDays(data.days);
    } catch (err) {
      console.error("Ошибка загрузки шаблона:", err);
    }
  };

  const handleChooseEmpty = () => setDays([{ ...initialDay() }]);

  const handleGenerate = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/generate/markdown`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(days)),
      });
      const data = await res.json();
      setResult(data.markdown || "Ошибка генерации");
    } catch (err) {
      console.error("Ошибка генерации:", err);
    }
  };

  const handleDownload = async (type) => {
    const url = `${import.meta.env.VITE_API_URL}/download/${type}`;
    const filename = type === "word" ? "itinerary.docx" : "estimate.xlsx";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: type === "word"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        body: JSON.stringify(buildPayload(days)),
      });
      const blob = await res.blob();
      const urlBlob = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(urlBlob);
    } catch (err) {
      console.error(`Ошибка скачивания ${type}:`, err);
    }
  };

  const [result, setResult] = useState("");

  if (isLoading) return <div className="text-center p-8 text-gray-500">Загрузка услуг...</div>;

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center">🛠️ Конструктор тура</h1>

      <div className="flex flex-wrap items-center gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium block">Количество человек:</label>
            <input type="number" className="border p-2 rounded w-full" min={1} value={numPeople} onChange={(e) => setNumPeople(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium block">Дата заезда:</label>
            <input type="date" className="border p-2 rounded w-full" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium block">Сезон:</label>
            <span className="block p-2 border rounded bg-gray-100">{season === "winter" ? "Зима" : "Лето"}</span>
          </div>
          <div>
            <label className="text-sm font-medium block">Регион:</label>
            <select className="border p-2 rounded w-full" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="baikal">Байкал</option>
              <option value="china" disabled>Китай (скоро)</option>
              <option value="kyrgyzstan" disabled>Киргизия (скоро)</option>
              <option value="mongolia" disabled>Монголия (скоро)</option>
            </select>
          </div>
        </div>
      </div>

      {scenarioChosen && (
        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium block">Выберите старт:</label>
          <div className="flex gap-4 flex-wrap">
            <button onClick={handleChooseTemplate} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">🧭 Стандартный тур</button>
            <button onClick={handleChooseEmpty} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">📄 Пустой тур</button>
          </div>
        </div>
      )}

      {days.map((day, i) => (
        <div key={i} className="border p-4 rounded bg-white shadow space-y-4">
          <h2 className="text-lg font-semibold">День {i + 1}</h2>
          <textarea
            className="w-full p-3 border rounded text-sm"
            rows={3}
            placeholder="Описание дня..."
            value={day.description}
            onChange={(e) => {
              const updated = [...days];
              updated[i].description = e.target.value;
              setDays(updated);
            }}
          />
          {day.services.map((svc, j) => (
            <div key={j} className="flex items-center gap-2">
              <select
                className="w-full p-2 border rounded bg-white text-sm"
                value={svc}
                onChange={(e) => {
                  const updated = [...days];
                  updated[i].services[j] = e.target.value;
                  setDays(updated);
                }}
              >
                <option value="">Выберите услугу</option>
                {services.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
              <button
                className="text-red-500 hover:text-red-700 text-lg font-bold"
                onClick={() => {
                  const updated = [...days];
                  updated[i].services.splice(j, 1);
                  setDays(updated);
                }}
              >×</button>
            </div>
          ))}
          <button
            className="bg-gray-200 text-sm px-2 py-1 rounded hover:bg-gray-300"
            onClick={() => {
              const updated = [...days];
              updated[i].services.push("");
              setDays(updated);
            }}
          >➕ Добавить услугу</button>
        </div>
      ))}

      <div className="flex flex-wrap gap-4">
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800" onClick={() => setDays([...days, initialDay()])}>➕ Добавить день</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleGenerate}>📥 Сгенерировать Markdown и смету</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => handleDownload("excel")}>💾 Скачать смету (Excel)</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => handleDownload("word")}>💾 Скачать маршрут (Word)</button>
      </div>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded border whitespace-pre-wrap">
          <h2 className="text-lg font-semibold mb-2">📄 Markdown:</h2>
          <pre>{result}</pre>
        </div>
      )}

      <EstimateTable detail={detail} total={total} />
    </div>
  );
}
