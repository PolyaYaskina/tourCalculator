import { useEffect, useState } from "react";

/**
 * Хук для инициализации и хранения состояния выбранных компонентов услуги
 */
export function useSelectedState(service, svc) {
  const [selected, setSelected] = useState({});

  useEffect(() => {
    const init = {};
    if (service?.composite && svc.components) {
      svc.components.forEach((c) => {
        init[c.key] = { qty: c.qty || 1, price: c.price || 0 };
      });
    } else if (service) {
      init[svc.key] = {
        qty: svc.qty || 1,
        price: svc.price || service.price || 0,
      };
    }
    setSelected(init);
  }, [svc, service]);

  return [selected, setSelected];
}