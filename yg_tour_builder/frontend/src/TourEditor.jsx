import { useState, useEffect } from "react";
import { SERVICE_OPTIONS, DESCRIPTION_TEMPLATES } from "./data/constants";
import { CALCULATORS } from "./data/calculator";

const initialDay = () => ({ description: "", services: ["#трансфер"] });

export default function TourEditor() {
  const [days, setDays] = useState([{ ...initialDay() }]);
  const [numPeople, setNumPeople] = useState(1);
  const [season, setSeason] = useState("winter");
  const [result, setResult] = useState("");
  const [table, setTable] = useState([]);

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
    if (option?.description && !updated[dayIndex].description.includes(option.description)) {
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
    updated[dayIndex].description = current ? current + "\n" + templateText : templateText;
    setDays(updated);
  };

  const getServiceInfo = (svcKey) => {
    const option = SERVICE_OPTIONS.find((o) => o.key === svcKey);
    if (!option) return [];

    const getPrice = (item) => (season === "winter" ? item.winterPrice : item.summerPrice);
    const getQty = (item) => {
      const fn = CALCULATORS[item.calc] || (() => 1);
      return fn(numPeople);
    };

    if (option.composite && Array.isArray(option.components)) {
      return option.components.map((comp) => {
        const qty = getQty(comp);
        const price = getPrice(comp);
        const sum = price * qty;
        return {
          label: comp.label || comp.key,
          price,
          qty,
          sum,
          sumWithNDS: Math.round(sum * 1.06),
          note: option.label
        };
      });
    }

    const qty = getQty(option);
    const price = getPrice(option);
    const sum = price * qty;
    return [
      {
        label: option.label,
        price,
        qty,
        sum,
        sumWithNDS: Math.round(sum * 1.06)
      }
    ];
  };

  const calculateTable = () => {
    const newTable = [];
    let total = 0;
    let totalWithNDS = 0;

    days.forEach((day, i) => {
      const dayNum = i + 1;
      const filtered = day.services.filter((s) => s.trim());

      filtered.forEach((svc) => {
        const rows = getServiceInfo(svc);
        rows.forEach(({ label, price, qty, sum, sumWithNDS, note }) => {
          newTable.push({
            day: dayNum,
            label: note ? `${label} (${note})` : label,
            price,
            qty,
            sum,
            sumWithNDS
          });
          total += sum;
          totalWithNDS += sumWithNDS;
        });
      });
    });

    newTable.push({ label: "ИТОГО", sum: total, sumWithNDS: totalWithNDS });
    return newTable;
  };

  const handleGenerate = async () => {
    const payload = {};
    days.forEach((day, i) => {
      const dayNum = i + 1;
      const filtered = day.services.filter((s) => s.trim());
      payload[dayNum] = {
        description: day.description.trim(),
        services: filtered
      };
    });

    try {
      const res = await fetch("http://localhost:8000/generate/markdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setResult(data.markdown || "Ошибка генерации");
      setTable(calculateTable());
    } catch (error) {
      console.error("Ошибка запроса:", error);
      setResult("Ошибка генерации или подключения к серверу");
    }
  };

  useEffect(() => {
    setTable(calculateTable());
  }, [numPeople, days, season]);

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
        <div key={dayIndex} className="border p-4 rounded bg-white shadow space-y-4">
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
      onChange={(e) => handleServiceChange(dayIndex, svcIndex, e.target.value)}
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

      {table.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded border shadow">
          <h2 className="text-lg font-semibold mb-4">📊 Смета</h2>
          <table className="w-full text-sm table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-3 py-2">День</th>
                <th className="border px-3 py-2">Опция</th>
                <th className="border px-3 py-2 text-right">Цена</th>
                <th className="border px-3 py-2 text-right">Кол-во</th>
                <th className="border px-3 py-2 text-right">Сумма</th>
                <th className="border px-3 py-2 text-right">Сумма с НДС</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row, i) => (
                <tr key={i} className={row.label === "ИТОГО" ? "bg-yellow-100 font-semibold" : ""}>
                  <td className="border px-3 py-2 text-center">{row.day || ""}</td>
                  <td className="border px-3 py-2">{row.label}</td>
                  <td className="border px-3 py-2 text-right">{row.price || ""}</td>
                  <td className="border px-3 py-2 text-right">{row.qty || ""}</td>
                  <td className="border px-3 py-2 text-right">{row.sum}</td>
                  <td className="border px-3 py-2 text-right">{row.sumWithNDS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
