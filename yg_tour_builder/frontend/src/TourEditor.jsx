import React, { Fragment, useState, useEffect } from "react";
import { DESCRIPTION_TEMPLATES } from "./data/constants";
import YAML from "yaml";
import { useTourDraft } from "./hooks/useTourDraft";
import { useServices } from "./hooks/useServices";
// 🧱 Начальное состояние одного дня
const initialDay = () => ({ description: "", services: ["#трансфер"] });
  // 📡 Получение расчёта


// 📦 Хук для загрузки services.yaml с бэкенда
// export function useServices() {
//   const [services, setServices] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//
//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/services.yaml`)
//       .then((res) => res.text())
//       .then((text) => {
//         try {
//           const parsed = YAML.parse(text);
//           const actual = Array.isArray(parsed) ? parsed : parsed?.services;
//           setServices(actual || []);
//         } catch (err) {
//           console.error("Ошибка парсинга services.yaml:", err);
//           setServices([]);
//         } finally {
//           setIsLoading(false);
//         }
//       })
//       .catch((err) => {
//         console.error("Ошибка загрузки services.yaml:", err);
//         setServices([]);
//         setIsLoading(false);
//       });
//   }, []);
//
//   return { services, isLoading };
// }

export default function TourEditor() {
  const { services, isLoading } = useServices();
  const [days, setDays] = useState([{ ...initialDay() }]);
  const [numPeople, setNumPeople] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [result, setResult] = useState("");
  const [detail, setDetail] = useState([]);
  const [total, setTotal] = useState(0);
  const [region, setRegion] = useState("baikal");
  const [scenarioChosen, setScenarioChosen] = useState(false);

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
  setScenarioChosen
});

const season = (() => {
  if (!startDate) return "winter"; // дефолт
  const month = new Date(startDate).getMonth() + 1;
  return (month >= 6 && month <= 9) ? "summer" : "winter";
})();

useEffect(() => {
  if (startDate && numPeople > 0) {
    setScenarioChosen(true);
  }
}, [startDate, numPeople]);


const fetchEstimate = async (payloadOverride) => {
  const payload = payloadOverride || {};
  if (!payloadOverride) {
    days.forEach((day, i) => {
      payload[i + 1] = {
        description: day.description.trim(),
        services: day.services.filter((s) => s.trim()),
      };
    });
  }

  try {
    const query = new URLSearchParams({
      numPeople: numPeople.toString(),
      season,
    });

    const res = await fetch(`${import.meta.env.VITE_API_URL}/estimate?${query.toString()}`, {
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

  useEffect(() => {
    fetchEstimate();
  }, [days, numPeople, season]);

  if (isLoading) {
    return <div className="text-center p-8 text-gray-500">Загрузка услуг...</div>;
  }

  // 📌 Добавить день
  const handleAddDay = () => setDays([...days, initialDay()]);

  // ✏️ Изменение описания дня
  const handleDescriptionChange = (dayIndex, value) => {
    const updated = [...days];
    updated[dayIndex].description = value;
    setDays(updated);
  };

  // ❌ Удалить услугу
  const handleRemoveService = (dayIndex, serviceIndex) => {
    const updated = [...days];
    updated[dayIndex].services.splice(serviceIndex, 1);
    setDays(updated);
  };

  // 🔁 Изменение услуги
  const handleServiceChange = (dayIndex, serviceIndex, value) => {
    const updated = [...days];
    updated[dayIndex].services[serviceIndex] = value;
    const option = services?.find((o) => o.key === value);
    if (option?.description && !updated[dayIndex].description.includes(option.description)) {
      updated[dayIndex].description += `\n${option.description}`;
    }
    setDays(updated);
  };

  // ➕ Добавить услугу в день
  const handleAddService = (dayIndex) => {
    const updated = [...days];
    updated[dayIndex].services.push("");
    setDays(updated);
  };

//подгрузка шаблона
const handleChooseTemplate = async () => {
  try {
    // 1. Делаем запрос на сервер
    const res = await fetch(`${import.meta.env.VITE_API_URL}/template`);

    // 2. Парсим JSON
    const data = await res.json();

    // 3. Проверка — есть ли поле days и массив ли оно
    if (!data || !Array.isArray(data.days)) {
      console.error("Некорректный шаблон с сервера");
      return;
    }

    // 4. Подстраховка: проверим, что каждый элемент — объект с нужными полями
    const valid = data.days.every(
      (d) =>
        typeof d === "object" &&
        typeof d.description === "string" &&
        Array.isArray(d.services)
    );

    if (!valid) {
      console.error("Шаблон содержит некорректные дни");
      return;
    }

    // 5. Обновляем состояние дней и пересчитываем смету
    setDays(data.days);
    fetchEstimate();

  } catch (err) {
    // Если всё пошло по *кривому маршруту*, логируем ошибку
    console.error("Ошибка загрузки шаблона с бэка:", err);
  }
};

const handleChooseEmpty = () => {
  setDays([{ ...initialDay() }]);
  fetchEstimate();
};

  // 🧩 Вставка шаблона описания дня
  const handleTemplateInsert = (dayIndex, templateText) => {
    const updated = [...days];
    const current = updated[dayIndex].description.trim();
    updated[dayIndex].description = current ? current + "\n" + templateText : templateText;
    setDays(updated);
  };
const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/itinerary/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data || !Array.isArray(data.days)) {
      console.error("Некорректный ответ при парсинге файла");
      return;
    }

    setDays(data.days);
  } catch (err) {
    console.error("Ошибка загрузки файла:", err);
  }
};
  // 🧮 Расчёт информации по услуге
  const getServiceInfo = (svcKey) => {
    const option = services?.find((o) => o.key === svcKey);
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
          note: option.label,
        };
      });
    }

    const qty = getQty(option);
    const price = getPrice(option);
    const sum = price * qty;
    return [{ label: option.label, price, qty, sum, sumWithNDS: Math.round(sum * 1.06) }];
  };



  // ⚙️ Генерация Markdown и расчёта
  const handleGenerate = async () => {
    const payload = {};
    days.forEach((day, i) => {
      payload[i + 1] = {
        description: day.description.trim(),
        services: day.services.filter((s) => s.trim()),
      };
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/generate/markdown`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);

      const data = JSON.parse(text);
      setResult(data.markdown || "Ошибка генерации");
      await fetchEstimate(payload);
    } catch (error) {
      console.error("Ошибка генерации:", error);
      setResult("Ошибка генерации или подключения к серверу");
    }
  };

  // 📥 Скачивание Word или Excel
  const handleDownload = async (type) => {
    const payload = {};
    days.forEach((day, i) => {
      payload[i + 1] = {
        description: day.description.trim(),
        services: day.services.filter((s) => s.trim()),
      };
    });

    const url = `${import.meta.env.VITE_API_URL}/download/${type}`;
    const filename = type === "word" ? "itinerary.docx" : "estimate.xlsx";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept:
            type === "word"
              ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        body: JSON.stringify(payload),
      });

      const blob = await res.blob();
      const urlBlob = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(urlBlob);
    } catch (err) {
      console.error(`Ошибка скачивания ${type === "word" ? "Word" : "Excel"}:`, err);
    }
  };


 return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center">🛠️ Конструктор тура</h1>

      <div className="flex flex-wrap items-center gap-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium block">Количество человек:</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              min={1}
              value={numPeople}
              onChange={(e) => setNumPeople(Number(e.target.value))}
            />
          </div>
      </div>
      <div>
        <label className="text-sm font-medium block">Дата заезда:</label>
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium block">Сезон:</label>
        <span className="block p-2 border rounded bg-gray-100">{season === "winter" ? "Зима" : "Лето"}</span>
      </div>
      <div>
        <label className="text-sm font-medium block">Регион:</label>
        <select
          className="border p-2 rounded w-full"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="baikal">Байкал</option>
          <option value="china" disabled>Китай (скоро)</option>
          <option value="kyrgyzstan" disabled>Киргизия (скоро)</option>
          <option value="mongolia" disabled>Монголия (скоро)</option>
        </select>
      </div>
    </div>

    {scenarioChosen && (
      <div className="mt-4 space-y-2">
        <label className="text-sm font-medium block">Выберите старт:</label>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleChooseTemplate}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            🧭 Стандартный тур
          </button>
          <button
            onClick={handleChooseEmpty}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            📄 Пустой тур
          </button>
          <label className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 cursor-pointer">
            📂 Загрузить из файла
            <input
              type="file"
              accept=".docx,.xlsx"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>
    )}

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
                onChange={(e) =>
                  handleServiceChange(dayIndex, svcIndex, e.target.value)
                }
              >
                <option value="">Выберите услугу</option>
                {services.map((opt) => (
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
                <th className="border px-3 py-2 text-right">Кол-во</th>
                <th className="border px-3 py-2 text-right">Сумма</th>
                <th className="border px-3 py-2 text-right">Сумма с НДС</th>
                </tr>
            </thead>
            <tbody>
              {Object.entries(
                detail.reduce((acc, row) => {
                  acc[row.day] = acc[row.day] || [];
                  acc[row.day].push(row);
                  return acc;
                }, {})
              ).map(([day, rows]) => (
                <Fragment key={day}>
                  <tr className="bg-gray-100 border-t-2 border-gray-300">
                    <td colSpan={6} className="px-3 py-2 font-semibold text-left">
                      🗓 День {day}
                    </td>
                  </tr>
                  {rows.map((row, idx) => (
                    <tr key={`${day}-${idx}`}>
                      <td className="border px-3 py-2 text-center">{row.day}</td>
                      <td className="border px-3 py-2">{row.service}</td>
                      <td className="border px-3 py-2 text-right">{row.price}</td>
                      <td className="border px-3 py-2 text-right">{row.qty}</td>
                      <td className="border px-3 py-2 text-right">{row.sum}</td>
                      <td className="border px-3 py-2 text-right">{row.sumWithNDS}</td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-yellow-100 font-semibold">
                <td className="border px-3 py-2 text-center" colSpan={5}>ИТОГО</td>
                <td className="border px-3 py-2 text-right">{total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
