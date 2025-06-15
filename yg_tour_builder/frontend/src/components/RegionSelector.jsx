import { useEffect, useState, useMemo } from "react";
import DropdownMenu from "./DropdownMenu";

export default function RegionSelector({ value, onChange }) {
  const [directions, setDirections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Загружаем направления с сервера
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/directions`)
      .then(res => res.json())
      .then(data => {
        setDirections(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки направлений:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  // 🔸 Преобразуем в формат, подходящий для меню
  const items = useMemo(() => {
    return Object.entries(directions).map(([key, val]) => ({
      value: key,
      label: val.label || key,
    }));
  }, [directions]);

  if (loading) return <div>Загрузка направлений...</div>;
  if (error) return <div>Ошибка загрузки направлений</div>;

  // 🧭 Заголовок кнопки
  const title = value && directions[value]
    ? directions[value].label
    : "Выбери регион";

  return (
    <DropdownMenu
      title={title}
      items={items}
      onSelect={onChange}
    />
  );
}
