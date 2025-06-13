// 🧩 ServiceCard.jsx — вертикальный layout редактирования услуги
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
    <div className="space-y-4">
      {/* 📛 Основные поля */}
      <div>
        <label className="block text-sm font-medium mb-1">Название</label>
        <input className="w-full border p-2 rounded" value={data.label} placeholder="Название" onChange={(e) => handleField("label", e.target.value)} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ключ</label>
        <input className="w-full border p-2 rounded" value={data.key} placeholder="Ключ" onChange={(e) => handleField("key", e.target.value)} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Цена ₽</label>
        <input type="number" className="w-full border p-2 rounded" value={data.price || 0} placeholder="Цена" onChange={(e) => handleField("price", e.target.value)} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Расчёт</label>
        <select className="w-full border p-2 rounded" value={data.calc || ""} onChange={(e) => handleField("calc", e.target.value)}>
          <option value="fixed">фикс</option>
          <option value="per_person">на человека</option>
          <option value="per_10_people">на 10 человек</option>
          <option value="people_div_2">на 2 человек</option>
          <option value="people_div_3">на 3 человек</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Категория</label>
        <input className="w-full border p-2 rounded" value={data.category || ""} placeholder="Категория" onChange={(e) => handleField("category", e.target.value)} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Сезон</label>
        <input className="w-full border p-2 rounded" value={data.season || ""} placeholder="Сезон" onChange={(e) => handleField("season", e.target.value)} />
      </div>

      {/* 📝 Описание */}
      <div>
        <label className="block text-sm font-medium mb-1">Описание</label>
        <textarea className="w-full border p-2 rounded" rows={2} value={data.description || ""} placeholder="Описание" onChange={(e) => handleField("description", e.target.value)} />
      </div>

      {/* ⚙️ Композит */}
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={data.composite || false} onChange={(e) => handleField("composite", e.target.checked)} />
          <span className="text-sm">Составная услуга</span>
        </label>
        <input className="w-full border p-2 rounded" value={data.comment || ""} placeholder="Комментарий" onChange={(e) => handleField("comment", e.target.value)} />
        {data.composite && (
          <button
            onClick={() => setOpen(!open)}
            className="text-sm text-blue-600 hover:underline"
          >
            {open ? "▲ Скрыть компоненты" : "▼ Показать компоненты"}
          </button>
        )}
        {data.composite && open && Array.isArray(data.components) && (
          <CompositeEditor components={data.components} onChange={handleComponentUpdate} />
        )}
      </div>

      {/* ❌ Удаление */}
      <div className="text-right">
        <button onClick={onDelete} className="text-red-600 hover:text-red-800 text-sm">
          ✖ Удалить услугу
        </button>
      </div>
    </div>
  );
}