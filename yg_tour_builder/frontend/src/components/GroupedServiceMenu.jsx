import { useState } from "react";
import useGroupedServices from "../hooks/useGroupedServices";

export default function GroupedServiceMenu({ onSelect }) {
  const { groups, loading, error } = useGroupedServices();
  const [openCategory, setOpenCategory] = useState(null);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;
  if (!groups || Object.keys(groups).length === 0) return <div>Нет услуг</div>;

  return (
    <div className="relative inline-block text-left">
      <button
        className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
        onClick={() =>
          setOpenCategory((prev) => (prev ? null : "__menu__"))
        }
      >
        ➕ Добавить услугу
      </button>

      {openCategory && (
        <div className="absolute z-10 mt-2 w-64 bg-white border rounded shadow">
            {Object.entries(groups || {}).map(([catKey, catData]) => {
              if (!catData || !Array.isArray(catData.items)) {
                console.warn(`❗ Неверная категория ${catKey}`, catData);
                return null;
              }

              return (
                <div key={catKey} className="border-b last:border-none">
                  <button
                    onClick={() =>
                      setOpenCategory((prev) => (prev === catKey ? null : catKey))
                    }
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 font-semibold text-sm"
                  >
                    {catData.label}
                  </button>
                  {openCategory === catKey && (
                    <div className="bg-gray-50">
                      {catData.items.map((item) => (
                        <button
                          key={item.key}
                          onClick={() => {
                            onSelect(item);
                            setOpenCategory(null);
                          }}
                          className="block w-full text-left px-5 py-1 text-sm hover:bg-gray-100"
                        >
                          {item.label}{" "}
                          {item.price ? `— ${item.price.toLocaleString()}₽` : ""}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

        </div>
      )}
    </div>
  );
}
