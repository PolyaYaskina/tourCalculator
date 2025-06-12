// 📦 ServiceEditor.jsx — контейнер, управляющий списком услуг
import { useServices } from "./hooks/useServices";
import ServiceCard from "./ServiceCard";

export default function ServiceEditor() {
  const { services, setServices, loading } = useServices();

  const handleAdd = () => {
    setServices((prev) => [
      ...prev,
      {
        key: `#новая`,
        label: "Новая услуга",
        description: "",
        price: 0,
        calc: "fixed",
        category: "",
        season: "",
        comment: "",
        composite: false,
        components: [],
      },
    ]);
  };

  const updateService = (index, updatedService) => {
    const updated = [...services];
    updated[index] = updatedService;
    setServices(updated);
  };

  const removeService = (index) => {
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

      {services.map((s, i) => (
        <ServiceCard
          key={i}
          data={s}
          onChange={(updated) => updateService(i, updated)}
          onDelete={() => removeService(i)}
        />
      ))}
    </div>
  );
}
