import { useServices } from "./hooks/useServices";

export default function ServiceEditor() {
  const { services, setServices, loading } = useServices();

  const handleChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = field.includes("Price") ? Number(value) : value;
    setServices(updated);
  };

  const handleAdd = () => {
    setServices((prev) => [
      ...prev,
      {
        key: `#новая`,
        label: "Новая услуга",
        description: "",
        summerPrice: 0,
        winterPrice: 0,
        type: "fixed",
        components: [],
      },
    ]);
  };

  const handleDelete = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  const handleSaveToServer = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/services.yaml`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services),
      });
      if (!res.ok) throw new Error(await res.text());
      alert("✅ Услуги сохранены на сервер");
    } catch (err) {
      console.error("❌ Ошибка сохранения:", err);
      alert("Ошибка сохранения на сервер");
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Загрузка услуг...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Редактор услуг</h2>

      <div className="flex gap-4">
        <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded">➕ Добавить услугу</button>
        <button onClick={handleSaveToServer} className="px-4 py-2 bg-blue-600 text-white rounded">💾 Сохранить на сервер</button>
      </div>

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
              <td className="border px-2 py-1"><input className="w-full border p-1" value={s.label} onChange={(e) => handleChange(i, "label", e.target.value)} /></td>
              <td className="border px-2 py-1"><input className="w-full border p-1" value={s.key} onChange={(e) => handleChange(i, "key", e.target.value)} /></td>
              <td className="border px-2 py-1"><input type="number" className="w-full border p-1" value={s.summerPrice || 0} onChange={(e) => handleChange(i, "summerPrice", e.target.value)} /></td>
              <td className="border px-2 py-1"><input type="number" className="w-full border p-1" value={s.winterPrice || 0} onChange={(e) => handleChange(i, "winterPrice", e.target.value)} /></td>
              <td className="border px-2 py-1">
                <select className="w-full border p-1" value={s.type} onChange={(e) => handleChange(i, "type", e.target.value)}>
                  <option value="fixed">фикс</option>
                  <option value="per_person">на человека</option>
                  <option value="composite">композит</option>
                  <option value="always_1">всегда 1</option>
                </select>
              </td>
              <td className="border px-2 py-1"><textarea className="w-full border p-1" rows={2} value={s.description} onChange={(e) => handleChange(i, "description", e.target.value)} /></td>
              <td className="border px-2 py-1 text-center"><button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(i)}>✖</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
