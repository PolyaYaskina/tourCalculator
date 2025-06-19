import { useState } from "react";
import GroupedServiceMenu from "./GroupedServiceMenu";
import EditableServiceCard from "./EditableServiceCard";

export default function DayWorkspace({
  day,
  season,
  onDescriptionChange,
  onServiceChange,
  onAddService,
  onRemoveService,
  services = [],
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

        {day.services.map((svcObj, i) => (
          <EditableServiceCard
            key={i}
            svc={svcObj}
            season = {season}
            servicesCatalog={services}
            onChange={(updatedSvc) => {
              const newServices = [...day.services];
              newServices[i] = updatedSvc;
              onServiceChange(i, updatedSvc);
            }}
            onRemove={() => onRemoveService(i)}
          />
        ))}

        <div className="mt-4">
          <GroupedServiceMenu
            onSelect={(item) => {
              const isComposite = item.composite;
              let newSvc = { key: item.key };

              if (isComposite && item.components) {
                const season = "summer";
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

              onAddService(newSvc);
            }}
          />
        </div>
      </div>
    </div>
  );
}
