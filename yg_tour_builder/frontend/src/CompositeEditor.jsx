// 🧱 CompositeEditor.jsx — управление компонентами составной услуги

export default function CompositeEditor({ components, onChange }) {
  const update = (index, field, value) => {
    const updated = [...components];
    updated[index][field] = field.includes("price") ? Number(value) : value;
    onChange(updated);
  };

  const remove = (index) => {
    const updated = [...components];
    updated.splice(index, 1);
    onChange(updated);
  };

  const add = () => {
    onChange([...components, { key: "", label: "", calc: "always_1", price: 0 }]);
  };

  return (
    <div className="mt-4 border-t pt-4 space-y-2">
      <div className="text-sm font-semibold">Компоненты:</div>

      {components.map((comp, j) => (
        <div key={j} className="grid grid-cols-5 gap-2 bg-white border p-3 rounded shadow-sm items-center">
          <input
            className="border p-1"
            placeholder="Ключ"
            value={comp.key || ""}
            onChange={(e) => update(j, "key", e.target.value)}
          />
          <input
            className="border p-1"
            placeholder="Название"
            value={comp.label || ""}
            onChange={(e) => update(j, "label", e.target.value)}
          />
          <select
            className="border p-1"
            value={comp.calc || ""}
            onChange={(e) => update(j, "calc", e.target.value)}
          >
            <option value="always_1">всегда 1</option>
            <option value="per_person">на человека</option>
            <option value="per_10_people">на 10 человек</option>
            <option value="people_div_2">на 2 человек</option>
            <option value="people_div_3">на 3 человек</option>
          </select>
          <input
            type="number"
            className="border p-1"
            placeholder="Цена"
            value={comp.price || 0}
            onChange={(e) => update(j, "price", e.target.value)}
          />
          <button
            onClick={() => remove(j)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            ✖
          </button>
        </div>
      ))}

      <div className="text-right">
        <button
          onClick={add}
          className="px-2 py-1 text-sm bg-green-200 rounded hover:bg-green-300"
        >
          ➕ Добавить компонент
        </button>
      </div>
    </div>
  );
}
