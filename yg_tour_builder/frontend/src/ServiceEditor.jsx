import { useEffect, useState } from "react";

export default function ServiceEditor() {



    const [services, setServices] = useState(() => {
      try {
        const stored = localStorage.getItem("services");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    });

  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  const handleChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = field.includes("Price") ? Number(value) : value;
    setServices(updated);
  };

const handleAdd = () => {
  const stored = localStorage.getItem("services");
  const current = stored ? JSON.parse(stored) : [];

  const updated = [
    ...current,
    {
      key: `#новая`,
      label: "Новая услуга",
      description: "",
      summerPrice: 0,
      winterPrice: 0,
      type: "fixed",
      components: [],
    },
  ];

  setServices(updated);
  localStorage.setItem("services", JSON.stringify(updated));
};

  const handleDelete = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Редактор услуг</h2>
      <button
        onClick={handleAdd}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        ➕ Добавить услугу
      </button>

      <table className="w-full text-sm border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Название</th>
            <th className="border px-2 py-1">Ключ</th>
            <th className="border px-2 py-1">Лето ₽</th>
            <th className="border px-2 py-1">Зима ₽</th>
            <th className="border px-2 py-1">Тип</th>
            <th className="border px-2 py-1">Описание</th>
            <th className="border px-2 py-1">✖</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s, i) => (
            <tr key={i} className="even:bg-gray-50">
              <td className="border px-2 py-1">
                <input
                  className="w-full border p-1"
                  value={s.label}
                  onChange={(e) => handleChange(i, "label", e.target.value)}
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  className="w-full border p-1"
                  value={s.key}
                  onChange={(e) => handleChange(i, "key", e.target.value)}
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  className="w-full border p-1"
                  value={s.summerPrice || 0}
                  onChange={(e) =>
                    handleChange(i, "summerPrice", e.target.value)
                  }
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  className="w-full border p-1"
                  value={s.winterPrice || 0}
                  onChange={(e) =>
                    handleChange(i, "winterPrice", e.target.value)
                  }
                />
              </td>
              <td className="border px-2 py-1">
                <select
                  className="w-full border p-1"
                  value={s.type}
                  onChange={(e) => handleChange(i, "type", e.target.value)}
                >
                  <option value="fixed">фикс</option>
                  <option value="per_person">на человека</option>
                  <option value="composite">композит</option>
                  <option value="always_1">всегда 1</option>
                </select>
              </td>
              <td className="border px-2 py-1">
                <textarea
                  className="w-full border p-1"
                  rows={2}
                  value={s.description}
                  onChange={(e) =>
                    handleChange(i, "description", e.target.value)
                  }
                />
              </td>
              <td className="border px-2 py-1 text-center">
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(i)}
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
