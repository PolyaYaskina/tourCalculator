// components/layouts/TourLayout.tsx
import DayTree from "../DayTree.tsx";
import SidePanel from "../ServiceEditorPanel";
import { useTourStore } from "../../store/useTourStore";
import DayWorkspace from "../DayWorkspace";
import EstimateTable from "../EstimateTable.tsx"; // если он у тебя не импортирован

export default function TourLayout({
  children,
  rightPanelOpen,
  setRightPanelOpen,
  showEstimate,
  setShowEstimate,
  services,
  detail,
  total,
  currentSeason,
}) {
  const {
    draft: { days, selectedDayIndex },
    updateDay,
  } = useTourStore();

  console.log("LAYOUT!", days);

  if (!Array.isArray(days)) {
    console.error("❌ Некорректный формат days:", days);
    return <div className="p-6 text-red-500">Ошибка: данные тура повреждены.</div>;
  }

  const selectedDay = days[selectedDayIndex];

  return (
    <div className="grid grid-cols-[260px_1fr] min-h-screen">
      {/* Левый сайдбар */}
      <aside className="bg-gray-100 border-r p-4 space-y-4 overflow-y-auto">
        <DayTree onShowEstimate={() => setShowEstimate(true)} />
      </aside>

      {/* Центральная зона */}
      <div className="relative flex flex-col h-full">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setRightPanelOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ✨ Редактор услуг
          </button>
        </div>

        <main className="p-6 overflow-auto flex-1 bg-white">
          {showEstimate ? (
            <EstimateTable />
          ) : selectedDay ? (
            <DayWorkspace
              day={selectedDay}
              season={currentSeason}
              services={services}
              onDescriptionChange={(desc) =>
                updateDay(selectedDayIndex, { description: desc })
              }
              onServiceChange={(index, newValue) => {
                const newServices = [...selectedDay.services];
                newServices[index] = newValue;
                updateDay(selectedDayIndex, { services: newServices });
              }}
              onAddService={(key) => {
                updateDay(selectedDayIndex, {
                  services: [...selectedDay.services, { key }],
                });
              }}
              onRemoveService={(indexToRemove) => {
                updateDay(selectedDayIndex, {
                  services: selectedDay.services.filter((_, i) => i !== indexToRemove),
                });
              }}
            />
          ) : (
            <div className="p-6 text-gray-500">Выберите день</div>
          )}
        </main>

        <SidePanel isOpen={rightPanelOpen} onClose={() => setRightPanelOpen(false)} />
      </div>
    </div>
  );
}
