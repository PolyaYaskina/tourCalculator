// 🧩 ServiceCard.jsx — отображает одну услугу
import { useState } from "react";
import CompositeEditor from "./CompositeEditor";

export default function ServiceCard({ data, onChange, onDelete }) {
  const [open, setOpen] = useState(false);

  const handleField = (field, value) => {
    onChange({ ...data, [field]: field.includes("price") ? Number(value) : value });
  };

  const handleComponentUpdate = (components) => {
    onChange({ ...data, components });
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
      <div className="grid grid-cols-6 gap-4">
        <input className="border p-2" value={data.label} placeholder="Название" onChange={(e) => handleField("label", e.target.value)} />
        <input className="border p-2" value={data.key} placeholder="Ключ" onChange={(e) => handleField("key", e.target.value)} />
        <input type="number" className="border p-2" value={data.price || 0} placeholder="Цена ₽" onChange={(e) => handleField("price", e.target.value)} />
        <select className="border p-2" value={data.calc || ""} onChange={(e) => handleField("calc", e.target.value)}>
          <option value="fixed">фикс</option>
          <option value="per_person">на человека</option>
          <option value="per_10_people">на 10 человек</option>
          <option value="people_div_2">на 2 человек</option>
          <option value="people_div_3">на 3 человек</option>
        </select>
        <input className="border p-2" value={data.category || ""} placeholder="Категория" onChange={(e) => handleField("category", e.target.value)} />
        <input className="border p-2" value={data.season || ""} placeholder="Сезон" onChange={(e) => handleField("season", e.target.value)} />
      </div>

      <textarea className="border p-2 w-full" rows={1} value={data.description || ""} placeholder="Описание" onChange={(e) => handleField("description", e.target.value)} />

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={data.composite || false} onChange={(e) => handleField("composite", e.target.checked)} />
          Составная услуга
        </label>
        <input className="border p-2 flex-1" value={data.comment || ""} placeholder="Комментарий" onChange={(e) => handleField("comment", e.target.value)} />
        {data.composite && (
          <button
            onClick={() => setOpen(!open)}
            className="text-sm text-blue-600 hover:underline"
          >
            {open ? "▲ Скрыть компоненты" : "▼ Показать компоненты"}
          </button>
        )}
      </div>

      {data.composite && open && Array.isArray(data.components) && (
        <CompositeEditor components={data.components} onChange={handleComponentUpdate} />
      )}

      <div className="text-right mt-2">
        <button onClick={onDelete} className="text-red-600 hover:text-red-800 text-sm">
          ✖ Удалить услугу
        </button>
      </div>
    </div>
  );
}
