import { useState, useEffect, useMemo, useCallback } from "react";
import TourLayout from "./components/layouts/TourLayout";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DayWorkspace from "./components/DayWorkspace";
import EstimateTable from "./components/EstimateTable";
import { useServices } from "./hooks/useServices";
import { useEstimate } from "./hooks/useEstimate";
import { buildPayload } from "./utils/payload";
import RegionSelector from "./components/RegionSelector";
import { useDirections } from "./hooks/useDirections";
import TemplateSelector from "./components/TemplateSelector";
import { useTourStore } from "./store/useTourStore";

const initialDay = () => ({ description: "", services: ["#трансфер"] });

export default function App() {
    const {
      title, setTitle,
      region, setRegion,
      startDate, setStartDate,
      endDate, setEndDate,
      numPeople, setNumPeople,
      days, setDays,
      selectedDayIndex, setSelectedDayIndex,
      updateDay,
      scenarioChosen, setScenarioChosen,
    } = useTourStore();

const { services } = useServices(); //
const [showEstimate, setShowEstimate] = useState(false);
const [rightPanelOpen, setRightPanelOpen] = useState(false);
const [result, setResult] = useState(""); //result - генерация маркдаун перед выгрузкой

  const selectedDay = useMemo(
      () => days[selectedDayIndex] ?? null,
      [days, selectedDayIndex]
  );
  console.log("Selected index:", selectedDayIndex);


  const season = useMemo(() => {
    if (!startDate) return "winter";
    const m = new Date(startDate).getMonth() + 1;
    return m >= 6 && m <= 9 ? "summer" : "winter";
  }, [startDate]);

  const { detail, total } = useEstimate({ days, numPeople, season });

  useEffect(() => {
    if (startDate && numPeople > 0) setScenarioChosen(true);
  }, [startDate, numPeople]);


    const handleAddDay = useCallback(() => {
      setDays([...days, initialDay()]);
      setSelectedDayIndex(days.length);
      setShowEstimate(false);
    }, [days, setDays, setSelectedDayIndex]);

const handleRemoveDay = useCallback((index) => {
  if (days.length === 1) return; // Нельзя удалить последний день

  const updatedDays = days.filter((_, i) => i !== index);
  setDays(updatedDays);

  // Корректируем индекс выбранного дня
  setSelectedDayIndex((prevIndex) => {
    if (prevIndex === index) {
      return Math.max(0, index - 1); // если удалён активный — сместить влево
    }
    if (prevIndex > index) {
      return prevIndex - 1; // если правее — сдвинуть
    }
    return prevIndex; // если левее — не трогаем
  });
}, [days]);

    const handleSelectTemplate = async (file) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/template/file?file=${encodeURIComponent(file)}`);
        const data = await res.json();
        console.log("📦 Загруженный шаблон:", data);
      if (!Array.isArray(data.days)) return;
      const valid = data.days.every(d => typeof d.description === "string" && Array.isArray(d.services));
      if (valid) setDays(data.days);
    } catch (err) {
      console.error("Ошибка загрузки шаблона:", err);
    }
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
          <input className="border p-2 rounded" placeholder="Название тура" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="date" className="border p-2 rounded" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" className="border p-2 rounded" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <input type="number" min={1} className="border p-2 rounded" value={numPeople} onChange={(e) => setNumPeople(Number(e.target.value))} />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Сезон: <strong>{season === "winter" ? "зима" : "лето"}</strong>,
          <RegionSelector
             value={region}
             onChange={(val) => setRegion(val)}
          />
          <TemplateSelector region={region} onSelect={handleSelectTemplate} />
        </div>
      </header>

      <div className="flex gap-4 px-6 py-3 bg-gray-50 border-b">
        <button onClick={() => addToAllDays("гид")} className="bg-gray-100 px-3 py-1 rounded">➕ Гид</button>
        <button onClick={() => addToAllDays("нацпарк")} className="bg-gray-100 px-3 py-1 rounded">➕ Нацпарк</button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <TourLayout
          days={days}
          selectedDayIndex={selectedDayIndex}
           onSelectDay={(i) => {
            console.log("CLICKED DAY", i); // 👈 сюда
            setSelectedDayIndex(i);
            setShowEstimate(false);
          }}
          onAddDay={handleAddDay}
          onRemoveDay={handleRemoveDay}
          onShowEstimate={() => setShowEstimate(true)}
          onOpenServiceEditor={() => setRightPanelOpen(true)}
          rightPanelOpen={rightPanelOpen}
          closeRightPanel={() => setRightPanelOpen(false)}
        >
          {showEstimate ? (
              <EstimateTable detail={detail} total={total} />
            ) : selectedDay ? (
              <DayWorkspace
                day={selectedDay}
                season = {season}
                services={services}
                onDescriptionChange={(desc) => updateDay({ description: desc })}
                onServiceChange={(index, newValue) => {
                  const newServices = [...selectedDay.services];
                  newServices[index] = newValue;
                  updateDay({ services: newServices });
                }}
                onAddService={(key) => {
                  updateDay({ services: [...(selectedDay.services || []), key] });
                }}
                onRemoveService={(indexToRemove) => {
                  updateDay({
                    services: selectedDay.services.filter((_, i) => i !== indexToRemove),
                  });
                }}
              />
            ) : (
              <div className="p-6 text-gray-500">Выберите день</div>
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
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleGenerate}>
          📥 Сгенерировать Markdown и смету
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => handleDownload("excel")}>
          💾 Скачать смету (Excel)
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => handleDownload("word")}>
          💾 Скачать маршрут (Word)
        </button>
      </div>
    </div>
  );
}
