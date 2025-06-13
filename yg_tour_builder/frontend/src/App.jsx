import { useState, useEffect, useMemo } from "react";
import TourLayout from "./components/layouts/TourLayout";
import DayWorkspace from "./components/DayWorkspace";
import EstimateTable from "./components/EstimateTable";
import { useServices } from "./hooks/useServices";
import { useEstimate } from "./hooks/useEstimate";
import { useTourDraft } from "./hooks/useTourDraft";
import { buildPayload } from "./utils/payload";

// 🧱 Шаблон дня
const initialDay = () => ({ description: "", services: ["#трансфер"] });

export default function App() {
  const { services, isLoading } = useServices();
  const [days, setDays] = useState([{ ...initialDay() }]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [showEstimate, setShowEstimate] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [numPeople, setNumPeople] = useState(2);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [region, setRegion] = useState("baikal");
  const [result, setResult] = useState("");
  const [scenarioChosen, setScenarioChosen] = useState(false);

  const selectedDay = days[selectedDayIndex];
    useTourDraft({
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
    });
  const season = useMemo(() => {
    if (!startDate) return "winter";
    const m = new Date(startDate).getMonth() + 1;
    return m >= 6 && m <= 9 ? "summer" : "winter";
  }, [startDate]);

  const { detail, total } = useEstimate({ days, numPeople, season });

  useEffect(() => {
    if (startDate && numPeople > 0) setScenarioChosen(true);
  }, [startDate, numPeople]);

  const updateSelectedDay = (newDay) => {
    const updated = [...days];
    updated[selectedDayIndex] = newDay;
    setDays(updated);
  };

  const updateDay = (modifier) => {
  const updated = { ...selectedDay, ...modifier };
  const copy = [...days];
  copy[selectedDayIndex] = updated;
  setDays(copy);
  };
  const handleChooseTemplate = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/template`);
      const data = await res.json();
      if (!Array.isArray(data.days)) return;
      const valid = data.days.every(d => typeof d.description === "string" && Array.isArray(d.services));
      if (valid) setDays(data.days);
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

  const addToAllDays = (serviceKey) => {
    setDays((prev) =>
      prev.map((d) => ({
        ...d,
        services: d.services.includes(serviceKey)
          ? d.services
          : [...d.services, serviceKey],
      }))
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 📌 Шапка */}
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold mb-2">🛠️ Конструктор тура</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Название тура"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <input
            type="number"
            min={1}
            className="border p-2 rounded"
            value={numPeople}
            onChange={(e) => setNumPeople(Number(e.target.value))}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Сезон: <strong>{season === "winter" ? "зима" : "лето"}</strong>, Регион:
          <select
            className="ml-2 border p-1 rounded text-sm"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="baikal">Байкал</option>
            <option value="mongolia" disabled>Монголия (скоро)</option>
            <option value="kyrgyzstan" disabled>Киргизия (скоро)</option>
            <option value="china" disabled>Китай (скоро)</option>
          </select>
        </div>
      </header>

      <div className="flex gap-4 px-6 py-3 bg-gray-50 border-b">
        <button onClick={handleChooseTemplate} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
          🧭 Стандартный тур
        </button>
        <button onClick={handleChooseEmpty} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
          📄 Пустой тур
        </button>
        <button onClick={() => addToAllDays("гид")} className="bg-gray-100 px-3 py-1 rounded">
          ➕ Гид
        </button>
        <button onClick={() => addToAllDays("нацпарк")} className="bg-gray-100 px-3 py-1 rounded">
          ➕ Нацпарк
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <TourLayout
          days={days}
          selectedDayIndex={selectedDayIndex}
          onSelectDay={(i) => {
            setSelectedDayIndex(i);
            setShowEstimate(false);
          }}
          onAddDay={() => {
            setDays([...days, initialDay()]);
            setSelectedDayIndex(days.length);
            setShowEstimate(false);
          }}
          onShowEstimate={() => setShowEstimate(true)}
          onOpenServiceEditor={() => setRightPanelOpen(true)}
          rightPanelOpen={rightPanelOpen}
          closeRightPanel={() => setRightPanelOpen(false)}
        >
          {showEstimate ? (
            <EstimateTable detail={detail} total={total} />
          ) : (
          <DayWorkspace
              day={selectedDay}
              services={services}
              onDescriptionChange={(desc) => updateDay({ description: desc })}
              onServiceChange={(index, newValue) => {
                  const newServices = [...selectedDay.services];
                  newServices[index] = newValue;
                  updateDay({ services: newServices });
                }}
              onAddService={() => {
                  updateDay({ services: [...(selectedDay.services || []), ""] });
                }}
             onRemoveService={(indexToRemove) => {
              updateDay({
                services: selectedDay.services.filter((_, i) => i !== indexToRemove),
              });
            }}
            />

          )}
        </TourLayout>
      </div>

      {result && (
        <div className="p-6 bg-gray-100 border-t text-sm whitespace-pre-wrap">
          <h2 className="font-bold mb-2">📄 Markdown:</h2>
          <pre>{result}</pre>
        </div>
      )}

      <div className="flex gap-4 p-6 border-t bg-white">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleGenerate}
        >
          📥 Сгенерировать Markdown и смету
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => handleDownload("excel")}
        >
          💾 Скачать смету (Excel)
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => handleDownload("word")}
        >
          💾 Скачать маршрут (Word)
        </button>
      </div>
    </div>
  );
}
