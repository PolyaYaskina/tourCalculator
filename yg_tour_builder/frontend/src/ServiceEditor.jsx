// ServiceEditor.jsx
import { useState } from "react";
import ServiceCard from "./ServiceCard";
import { useServices } from "./hooks/useServices";

export default function ServiceEditor() {
  const { services, setServices } = useServices();
  const [selectedService, setSelectedService] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const [search, setSearch] = useState("");

  const handleSave = () => {
    if (!selectedService?.key) return;

    const exists = services.find((s) => s.key === selectedService.key);

    if (isNew && !exists) {
      setServices([...services, selectedService]);
    } else {
      const updated = services.map((s) =>
        s.key === selectedService.key ? selectedService : s
      );
      setServices(updated);
    }

    setIsNew(false);
  };

  const handleCreateNew = () => {
    setSelectedService({
      key: "",
      label: "",
      description: "",
      price: 0,
      calc: "fixed",
      category: "",
      season: "",
      composite: false,
      components: [],
      comment: "",
    });
    setIsNew(true);
    setSearch("");
  };

  const handleSelectFromList = (key) => {
    const svc = services.find((s) => s.key === key);
    if (svc) {
      setSelectedService(structuredClone(svc));
      setIsNew(false);
      setSearch("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">🛠️ Редактор услуг</h2>

      <div className="flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleCreateNew}
        >
          ➕ Добавить услугу
        </button>

        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="🔍 Поиск по ключу или названию..."
            className="border p-2 rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <div className="absolute z-10 bg-white border rounded mt-1 w-full max-h-60 overflow-y-auto">
              {services
                .filter((s) =>
                  `${s.label} ${s.key}`.toLowerCase().includes(search.toLowerCase())
                )
                .map((s) => (
                  <div
                    key={s.key}
                    onClick={() => handleSelectFromList(s.key)}
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                  >
                    {s.label} ({s.key})
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {selectedService && (
        <div className="bg-gray-50 border p-4 rounded">
          <ServiceCard
            data={selectedService}
            onChange={setSelectedService}
            onDelete={() => {
              setSelectedService(null);
              setIsNew(false);
            }}
          />
          <div className="text-right mt-4">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              💾 Сохранить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
