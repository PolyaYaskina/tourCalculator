import DropdownMenu from "./DropdownMenu";
import { useTemplates } from "../hooks/useTemplates";
import { TourDay, TourDraft } from "../types";

type TemplateSelectorProps = {
  region: string;
  onSelect: (partialDraft: Partial<TourDraft>) => void;
};

export default function TemplateSelector({ region, onSelect }: TemplateSelectorProps) {
  const { templates, loading, error } = useTemplates(region);

  if (!region) return null;
  if (loading) return <div>Загрузка шаблонов...</div>;
  if (error) return <div>Ошибка загрузки шаблонов</div>;

  function getFilename(path: string): string {
    const index = path.indexOf("/");
    return index === -1 ? path : path.slice(index + 1);
  }

  const handleSelect = async (file: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/templates/${region}/${getFilename(file)}`);
      const data: TourDraft = await res.json();

      // Защита от кривого бэка: проверка, что есть days
      if (!Array.isArray(data.days)) {
        console.warn("Неверный формат шаблона: нет days");
        return;
      }

      // Подмешиваем недостающие поля, которые есть в DraftState
      onSelect({
        ...data,
        selectedDayIndex: 0,
        scenarioChosen: false,
      });
    } catch (err) {
      console.error("Ошибка загрузки шаблона:", err);
    }
  };

  const items = templates.map((t) => ({
    value: t.file,
    label: t.label || t.name,
  }));

  return (
    <DropdownMenu
      title="📁 Выбрать шаблон"
      items={items}
      onSelect={handleSelect}
    />
  );
}
