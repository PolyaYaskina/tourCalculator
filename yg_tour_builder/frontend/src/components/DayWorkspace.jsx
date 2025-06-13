export default function DayWorkspace({
  day,
  onDescriptionChange,
  onServiceChange,
  onAddService,
  onRemoveService,
  services = [], // добавляем сюда
}) {
  return (
    <div className="space-y-6">
      {/* 📄 Описание дня */}
      <div>
        <h2 className="text-lg font-semibold mb-2">📝 Описание</h2>
        <textarea
          className="w-full p-3 border rounded text-sm"
          rows={4}
          placeholder="Описание дня..."
          value={day.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>

      {/* 🛠 Список услуг */}
      <div>
        <h2 className="text-lg font-semibold mb-2">📦 Услуги</h2>
        {day.services.map((svc, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <select
              className="w-full p-2 border rounded bg-white text-sm"
              value={svc}
              onChange={(e) => onServiceChange(i, e.target.value)}
            >
              <option value="">Выберите услугу</option>
              {services.map((s) => (
                <option key={typeof s === "string" ? s : s.key} value={typeof s === "string" ? s : s.key}>
                  {typeof s === "string" ? s : s.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => onRemoveService(i)}
              className="text-red-500 hover:text-red-700 text-lg font-bold"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={onAddService}
          className="bg-gray-200 text-sm px-2 py-1 rounded hover:bg-gray-300"
        >
          ➕ Добавить услугу
        </button>
      </div>
    </div>
  );
}
