// 📦 Утилиты отрисовки модалки с услугами

export function flattenComponents(components, season) {
  const flat = [];
  components.forEach((comp) => {
    if (comp.group && Array.isArray(comp.items)) {
      comp.items.forEach((item) => {
        if (!item.season || item.season === season) {
          flat.push({ ...item, group: comp.group });
        }
      });
    } else {
      if (!comp.season || comp.season === season) {
        flat.push(comp);
      }
    }
  });
  return flat;
}

export function renderCompositeService(service, selected, handlers, season) {
  return (service.components || []).map((block, idx) => {
    if (block.group) {
      const items = block.items.filter((item) => !item.season || item.season === season);
      return (
        <div key={idx} className="border p-2 rounded">
          <div className="font-semibold mb-2">{block.group}</div>
          {items.map((item) => (
            <div key={item.key} className="flex items-center gap-3 mb-2">
              <input
                type="checkbox"
                checked={!!selected[item.key]}
                onChange={() => handlers.toggle(item.key)}
              />
              <span className="w-48">{item.key}</span>
              <input
                type="number"
                className="w-20 border rounded px-1"
                placeholder="шт"
                value={selected[item.key]?.qty || ""}
                onChange={(e) => handlers.handleQtyChange(item.key, e.target.value)}
                disabled={!selected[item.key]}
              />
              <input
                type="number"
                className="w-24 border rounded px-1"
                placeholder="₽"
                value={selected[item.key]?.price || ""}
                onChange={(e) => handlers.handlePriceChange(item.key, e.target.value)}
                disabled={!selected[item.key]}
              />
            </div>
          ))}
        </div>
      );
    } else if (!block.season || block.season === season) {
      return (
        <div key={block.key} className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={!!selected[block.key]}
            onChange={() => handlers.toggle(block.key)}
          />
          <span className="w-48">{block.key}</span>
          <input
            type="number"
            className="w-20 border rounded px-1"
            placeholder="шт"
            value={selected[block.key]?.qty || ""}
            onChange={(e) => handlers.handleQtyChange(block.key, e.target.value)}
            disabled={!selected[block.key]}
          />
          <input
            type="number"
            className="w-24 border rounded px-1"
            placeholder="₽"
            value={selected[block.key]?.price || ""}
            onChange={(e) => handlers.handlePriceChange(block.key, e.target.value)}
            disabled={!selected[block.key]}
          />
        </div>
      );
    }
    return null;
  });
}

export function renderSimpleService(service, selected, handlers) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-48">{service.label}</span>
      <input
        type="number"
        className="w-20 border rounded px-1"
        placeholder="шт"
        value={selected[service.key]?.qty || ""}
        onChange={(e) => handlers.handleQtyChange(service.key, e.target.value)}
      />
      <input
        type="number"
        className="w-24 border rounded px-1"
        placeholder="₽"
        value={selected[service.key]?.price || ""}
        onChange={(e) => handlers.handlePriceChange(service.key, e.target.value)}
      />
    </div>
  );
}