import { useTourStore } from "../store/useTourStore";

export default function DayTree({ onShowEstimate }: { onShowEstimate: () => void }) {
  const {
    draft: { days, selectedDayIndex },
    setSelectedDayIndex,
    setDraft,
    updateDay,
    removeDay,
    addDay
  } = useTourStore();

  console.log("DAYTREE!",days);
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-2">🗂 Дни тура</h2>
      <ul className="space-y-1">

        {days.map((_, i) => (
          <li
            key={i}
            onClick={() => setSelectedDayIndex(i)}
            className={`group flex items-center justify-between cursor-pointer px-3 py-2 rounded text-sm ${
              i === selectedDayIndex ? "bg-blue-600 text-white" : "hover:bg-gray-200"
            }`}
          >
            <span>День {i + 1}</span>
            {days.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeDay(i);
                }}
                className="text-red-500 hover:text-red-700 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Удалить день"
              >
                🗑
              </button>
            )}
          </li>
        ))}
      </ul>

      <button onClick={addDay} className="w-full mt-4 bg-black text-white py-2 rounded">
        ➕ Добавить день
      </button>

      <button
        onClick={onShowEstimate}
        className="w-full mt-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium py-2 px-3 rounded"
      >
        📊 Показать смету
      </button>
    </div>
  );
}
