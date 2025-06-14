// components/layouts/TourLayout.jsx
import DayTree from "../DayTree";
import SidePanel from "../ServiceEditorPanel";

export default function TourLayout({
  children,
  days,
  selectedDayIndex,
  onSelectDay,
  onAddDay,
  onShowEstimate,
  onOpenServiceEditor,
  onRemoveDay,
  rightPanelOpen,         // 🧩 Добавить это
  closeRightPanel
}) {
  return (
    <div className="grid grid-cols-[260px_1fr] min-h-screen">
      {/* Левый сайдбар */}
      <aside className="bg-gray-100 border-r p-4 space-y-4 overflow-y-auto">
        <DayTree
          days={days}
          selected={selectedDayIndex}
          onSelect={onSelectDay}
          onAddDay={onAddDay}
          onShowEstimate={onShowEstimate}
          onRemoveDay={onRemoveDay}
        />
      </aside>

      {/* Центральная зона */}
      <div className="relative flex flex-col h-full">
        {/* Кнопка "Редактор услуг" — всегда видимая */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onOpenServiceEditor}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ✨ Редактор услуг
          </button>
        </div>

        <main className="p-6 overflow-auto flex-1 bg-white">{children}</main>

        {/* Правая панель — выезжающая */}
        <SidePanel isOpen={rightPanelOpen} onClose={closeRightPanel} />
      </div>
    </div>
  );
}
