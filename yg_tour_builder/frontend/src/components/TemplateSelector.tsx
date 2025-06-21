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
  const res = await fetch(`${import.meta.env.VITE_API_URL}/templates/${region}/${getFilename(file)}`);
  const raw = await res.json();
 console.log("RAW:", raw)
  const draft: Partial<TourDraft> = {
    title: "Из шаблона",
    region,
    season: raw.season,
    numPeople: 2,
    days: Array.isArray(raw.days) ? raw.days : [], // 💥 проверка
    startDate: undefined,
    endDate: undefined,
    description: undefined,
  };
 console.log("TEMPLATE:", draft)
  onSelect(draft); // ⬅️ вот тут и вызывается applyTemplate
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
