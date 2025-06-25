import { useState, useEffect, useMemo, useCallback } from "react";
import TourLayout from "./components/layouts/TourLayout";
import 'bootstrap/dist/css/bootstrap.min.css';
import DayWorkspace from "./components/DayWorkspace";
import EstimateTable from "./components/EstimateTable";
import { useServices } from "./hooks/useServices";
import { useEstimate } from "./hooks/useEstimate";
import RegionSelector from "./components/RegionSelector";
import TemplateSelector from "./components/TemplateSelector";
import { useTourStore } from "./store/useTourStore";
import type { TourDay } from "./types";

const generateEmptyDay = (): TourDay => ({ description: "", services: [{ key: "#трансфер" }] });

export default function App() {
  const {
    draft,
    setDraft,
    updateDay,
    setSelectedDayIndex,
    setScenarioChosen,
    applyTemplate
  } = useTourStore();

  const {
    title, region, numPeople, season,
    startDate, endDate, description,
    days, selectedDayIndex, scenarioChosen
  } = draft;

  const { services } = useServices();
  const [showEstimate, setShowEstimate] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [result, setResult] = useState("");

  const selectedDay = useMemo(() => days[selectedDayIndex] ?? null, [days, selectedDayIndex]);

  const currentSeason = useMemo(() => {
    if (!startDate) return "winter";
    const m = new Date(startDate).getMonth() + 1;
    return m >= 6 && m <= 9 ? "summer" : "winter";
  }, [startDate]);

  const { detail, total } = useEstimate({ days, numPeople, season: currentSeason });

  useEffect(() => {
    if (startDate && numPeople > 0) setScenarioChosen(true);
  }, [startDate, numPeople]);

  const handleAddDay = useCallback(() => {
    setDraft({ days: [...days, generateEmptyDay()] });
    setSelectedDayIndex(days.length);
    setShowEstimate(false);
  }, [days]);

  const handleRemoveDay = useCallback((index: number) => {
    if (days.length === 1) return;
    const updatedDays = days.filter((_, i) => i !== index);
    setDraft({ days: updatedDays });
    setSelectedDayIndex((prev) => (prev === index ? Math.max(0, index - 1) : prev > index ? prev - 1 : prev));
  }, [days]);

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

  const handleDownload = async (type: "excel" | "word") => {
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

  const addToAllDays = (serviceKey: string) => {
    setDraft({
      days: days.map((d) => ({
        ...d,
        services: d.services.find((s) => s.key === serviceKey) ? d.services : [...d.services, { key: serviceKey }],
      })),
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold mb-2">🛠️ Конструктор тура</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <input className="border p-2 rounded" placeholder="Название тура" value={title} onChange={(e) => setDraft({ title: e.target.value })} />
          <input type="date" className="border p-2 rounded" value={startDate} onChange={(e) => setDraft({ startDate: e.target.value })} />
          <input type="date" className="border p-2 rounded" value={endDate} onChange={(e) => setDraft({ endDate: e.target.value })} />
          <input type="number" min={1} className="border p-2 rounded" value={numPeople} onChange={(e) => setDraft({ numPeople: Number(e.target.value) })} />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Сезон: <strong>{currentSeason === "winter" ? "зима" : "лето"}</strong>,
          <RegionSelector value={region} onChange={(val) => setDraft({ region: val })} />
          <TemplateSelector region={region} onSelect={applyTemplate} />
        </div>
      </header>

      <div className="flex gap-4 px-6 py-3 bg-gray-50 border-b">
        <button onClick={() => addToAllDays("гид")} className="bg-gray-100 px-3 py-1 rounded">➕ Гид</button>
        <button onClick={() => addToAllDays("нацпарк")} className="bg-gray-100 px-3 py-1 rounded">➕ Нацпарк</button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
      <TourLayout
          showEstimate={showEstimate}
          setShowEstimate={setShowEstimate}
          services={services}
          detail={detail}
          total={total}
          currentSeason={currentSeason}
          rightPanelOpen={rightPanelOpen}
          setRightPanelOpen={setRightPanelOpen}
        />

      </div>

      {result && (
        <div className="p-6 bg-gray-100 border-t text-sm whitespace-pre-wrap">
          <h2 className="font-bold mb-2">📄 Markdown:</h2>
          <pre>{result}</pre>
        </div>
      )}

      <div className="flex gap-4 p-6 border-t bg-white">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleGenerate}>
          📅 Сгенерировать Markdown и смету
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => handleDownload("excel")}>📆 Скачать смету (Excel)</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => handleDownload("word")}>📆 Скачать маршрут (Word)</button>
      </div>
    </div>
  );
}