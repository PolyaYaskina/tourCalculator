import { useState, useMemo } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useSelectedState } from "../hooks/useSelectedState";
import { flattenComponents, renderSimpleService, renderCompositeService } from "../utils/serviceRenderers";

export default function EditableServiceCard({ svc, season, servicesCatalog, onChange, onRemove }) {
  const [show, setShow] = useState(false);
  console.log("🔑 svc.key:", svc.key);

  const service = useMemo(() => servicesCatalog.find((s) => s.key === svc.key), [svc.key, servicesCatalog]);

  const [selected, setSelected] = useSelectedState(service, svc);

  const toggle = (key) => {
    setSelected((prev) => ({
      ...prev,
      [key]: prev[key] ? undefined : { qty: 1, price: getDefaultPrice(key) },
    }));
  };

  const handleQtyChange = (key, value) => {
    setSelected((prev) => ({
      ...prev,
      [key]: { ...prev[key], qty: value },
    }));
  };

  const handlePriceChange = (key, value) => {
    setSelected((prev) => ({
      ...prev,
      [key]: { ...prev[key], price: value },
    }));
  };

  const getDefaultPrice = (key) => {
    const all = flattenComponents(service?.components || [], season);
    return all.find((c) => c.key === key)?.price || 0;
  };

  if (!service) {
    return (
      <div className="p-2 border rounded bg-red-100 text-sm">
        ❌ Услуга «{svc.key}» не найдена в каталоге.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
      <div className="flex-1">
        <strong>{service.label}</strong>
      </div>
      <button onClick={() => setShow(true)} className="text-blue-500 hover:text-blue-700" title="Настроить услугу">⚙</button>
      <button onClick={onRemove} className="text-red-500 hover:text-red-700 text-lg font-bold" title="Удалить">×</button>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Настройка: {service.label}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="space-y-4">
          {service.composite
            ? renderCompositeService(service, selected, { toggle, handleQtyChange, handlePriceChange }, season)
            : renderSimpleService(service, selected, { handleQtyChange, handlePriceChange })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Закрыть</Button>
          <Button
            variant="primary"
            onClick={() => {
              if (service.composite) {
                const components = Object.entries(selected).map(([key, val]) => ({
                  key,
                  qty: parseFloat(val.qty || 1),
                  price: parseFloat(val.price || 0),
                }));
                onChange({ ...svc, components });
              } else {
                const item = selected[service.key] || {};
                onChange({
                  key: service.key,
                  qty: parseFloat(item.qty || 1),
                  price: parseFloat(item.price || service.price || 0),
                });
              }
              setShow(false);
            }}
          >
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
