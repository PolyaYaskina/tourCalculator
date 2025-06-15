// src/components/TemplateSelector.jsx
import DropdownMenu from "./DropdownMenu";
import { useTemplates } from "../hooks/useTemplates";

export default function TemplateSelector({ region, onSelect }) {
  const { templates, loading, error } = useTemplates(region);

  if (!region) return null;
  if (loading) return <div>Загрузка шаблонов...</div>;
  if (error) return <div>Ошибка загрузки шаблонов</div>;

  const items = templates.map((t) => ({
    value: t.file,
    label: t.label || t.name,
  }));

  return (
    <DropdownMenu
      title="📁 Выбрать шаблон"
      items={items}
      onSelect={onSelect}
    />
  );
}
