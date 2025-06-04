import { useState, useEffect } from "react";
import { SERVICE_OPTIONS, DESCRIPTION_TEMPLATES } from "./data/constants";

const initialDay = () => ({ description: "", services: ["#трансфер"] });

export default function TourEditor() {
  const [days, setDays] = useState([{ ...initialDay() }]);
  const [numPeople, setNumPeople] = useState(1);
  const [season, setSeason] = useState("winter");
  const [result, setResult] = useState("");
  const [detail, setDetail] = useState([]);
  const [total, setTotal] = useState(0);

  const handleAddDay = () => setDays([...days, initialDay()]);

  const handleDescriptionChange = (dayIndex, value) => {
    const updated = [...days];
    updated[dayIndex].description = value;
    setDays(updated);
  };

  const handleRemoveService = (dayIndex, serviceIndex) => {
    const updated = [...days];
    updated[dayIndex].services.splice(serviceIndex, 1);
    setDays(updated);
  };
  const handleServiceChange = (dayIndex, serviceIndex, value) => {
    const updated = [...days];
    updated[dayIndex].services[serviceIndex] = value;

    const option = SERVICE_OPTIONS.find((o) => o.key === value);
    if (
      option?.description &&
      !updated[dayIndex].description.includes(option.description)
    ) {
      updated[dayIndex].description += `\n${option.description}`;
    }

    setDays(updated);
  };

  const handleAddService = (dayIndex) => {
    const updated = [...days];
    updated[dayIndex].services.push("");
    setDays(updated);
  };

  const handleTemplateInsert = (dayIndex, templateText) => {
    const updated = [...days];
    const current = updated[dayIndex].description.trim();
    updated[dayIndex].description = current
      ? current + "\n" + templateText
      : templateText;
    setDays(updated);
  };

  const fetchEstimate = async (payloadOverride) => {
    const payload = payloadOverride || {};
    if (!payloadOverride) {
      days.forEach((day, i) => {
        const dayNum = i + 1;
        const filtered = day.services.filter((s) => s.trim());
        payload[dayNum] = {
          description: day.description.trim(),
          services: filtered,
        };
      });
    }

    try {
      const res = await fetch("http://localhost:8000/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setDetail(data.detail || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Ошибка запроса:", err);
    }
  };

  const handleGenerate = async () => {
    const payload = {};
    days.forEach((day, i) => {
      const dayNum = i + 1;
      const filtered = day.services.filter((s) => s.trim());
      payload[dayNum] = {
        description: day.description.trim(),
        services: filtered,
      };
    });

    try {
      const res = await fetch("http://localhost:8000/generate/markdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(data.markdown || "Ошибка генерации");
      await fetchEstimate(payload);
    } catch (error) {
      console.error("Ошибка запроса:", error);
      setResult("Ошибка генерации или подключения к серверу");
    }
  };

  useEffect(() => {
    fetchEstimate();
  }, [days, numPeople, season]);

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center">🛠️ Конструктор тура</h1>

      <div className="flex items-center gap-6">
        <label className="text-sm font-medium">Количество человек:</label>
        <input
          type="number"
          className="border p-2 rounded w-24"
          min={1}
          value={numPeople}
          onChange={(e) => setNumPeople(Number(e.target.value))}
        />
        <label className="text-sm font-medium">Сезон:</label>
        <select
          className="border p-2 rounded"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        >
          <option value="winter">Зима</option>
          <option value="summer">Лето</option>
        </select>
      </div>

      {days.map((day, dayIndex) => (
        <div
          key={dayIndex}
          className="border p-4 rounded bg-white shadow space-y-4"
        >
          <h2 className="text-lg font-semibold">День {dayIndex + 1}</h2>
          <textarea
            className="w-full p-3 border rounded text-sm"
            rows={3}
            placeholder="Описание дня..."
            value={day.description}
            onChange={(e) => handleDescriptionChange(dayIndex, e.target.value)}
          />
          <div className="flex flex-wrap gap-2 text-sm">
            {DESCRIPTION_TEMPLATES.map((tpl, i) => (
              <button
                key={i}
                className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                onClick={() => handleTemplateInsert(dayIndex, tpl.value)}
              >
                + {tpl.label}
              </button>
            ))}
          </div>
          {day.services.map((svc, svcIndex) => (
            <div key={svcIndex} className="flex items-center gap-2">
              <select
                className="w-full p-2 border rounded bg-white text-sm"
                value={svc}
                onChange={(e) =>
                  handleServiceChange(dayIndex, svcIndex, e.target.value)
                }
              >
                <option value="">Выберите услугу</option>
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                className="text-red-500 hover:text-red-700 text-lg font-bold"
                onClick={() => handleRemoveService(dayIndex, svcIndex)}
                title="Удалить услугу"
              >
                ×
              </button>
            </div>
          ))}
          <button
            className="bg-gray-200 text-sm px-2 py-1 rounded hover:bg-gray-300"
            onClick={() => handleAddService(dayIndex)}
          >
            ➕ Добавить услугу
          </button>
        </div>
      ))}

      <div className="flex flex-wrap gap-4">
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          onClick={handleAddDay}
        >
          ➕ Добавить день
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleGenerate}
        >
          📥 Сгенерировать Markdown и смету
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded border whitespace-pre-wrap">
          <h2 className="text-lg font-semibold mb-2">📄 Markdown:</h2>
          <pre>{result}</pre>
        </div>
      )}

      {detail.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded border shadow">
          <h2 className="text-lg font-semibold mb-4">📊 Смета</h2>
          <table className="w-full text-sm table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-3 py-2">День</th>
                <th className="border px-3 py-2">Опция</th>
                <th className="border px-3 py-2 text-right">Цена</th>
              </tr>
            </thead>
            <tbody>
              {detail.map((row, i) => (
                <tr key={i}>
                  <td className="border px-3 py-2 text-center">{row.day}</td>
                  <td className="border px-3 py-2">{row.service}</td>
                  <td className="border px-3 py-2 text-right">{row.price}</td>
                </tr>
              ))}
              <tr className="bg-yellow-100 font-semibold">
                <td className="border px-3 py-2 text-center" colSpan={2}>
                  ИТОГО
                </td>
                <td className="border px-3 py-2 text-right">{total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
