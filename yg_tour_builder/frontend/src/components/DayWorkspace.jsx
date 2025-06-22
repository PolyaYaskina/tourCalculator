import { useTourStore } from "../store/useTourStore";
import GroupedServiceMenu from "./GroupedServiceMenu";
import EditableServiceCard from "./EditableServiceCard";

export default function DayWorkspace({ season, services = [] }) {
  const {
    draft: { days, selectedDayIndex },
    addServiceToDay,
    updateServiceInDay,
    removeServiceFromDay,
    updateDay,
  } = useTourStore();

  const day = days[selectedDayIndex];

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
          onChange={(e) => updateDay(selectedDayIndex, { description: e.target.value })}
        />
      </div>

      {/* 🛠 Список услуг */}
      <div>
        <h2 className="text-lg font-semibold mb-2">📦 Услуги</h2>

        {day.services.map((svcObj, i) => (
          <EditableServiceCard
            key={i}
            svc={svcObj}
            season={season}
            servicesCatalog={services}
            onChange={(updatedSvc) => updateServiceInDay(selectedDayIndex, i, updatedSvc)}
            onRemove={() => removeServiceFromDay(selectedDayIndex, i)}
          />
        ))}

        <div className="mt-4">
          <GroupedServiceMenu
            onSelect={(item) => {
              const isComposite = item.composite;
              let newSvc = { key: item.key };

              if (isComposite && item.components) {
                const flatten = [];

                item.components.forEach((comp) => {
                  if (comp.group && Array.isArray(comp.items)) {
                    comp.items.forEach((sub) => {
                      if (!sub.season || sub.season === season) {
                        flatten.push({
                          key: sub.key,
                          qty: 1,
                          price: sub.price ?? 0,
                        });
                      }
                    });
                  } else {
                    if (!comp.season || comp.season === season) {
                      flatten.push({
                        key: comp.key,
                        qty: 1,
                        price: comp.price ?? 0,
                      });
                    }
                  }
                });

                newSvc.components = flatten;
              }

              addServiceToDay(selectedDayIndex, newSvc);
            }}
          />
        </div>
      </div>
    </div>
  );
}
