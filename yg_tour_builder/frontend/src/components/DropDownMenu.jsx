import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

/**
 * Универсальное Bootstrap-меню
 * @param {string} title — заголовок на кнопке
 * @param {Array<{ label: string, value: string }>} items — пункты меню
 * @param {function} onSelect — что делать при выборе
 */
export default function DropdownMenu({ title, items, onSelect }) {
  return (
    <DropdownButton
      id={`dropdown-${title.toLowerCase().replace(/\s/g, "-")}`}
      title={title}
      onSelect={onSelect}
    >
      {items.map((item) => (
        <Dropdown.Item key={item.value} eventKey={item.value}>
          {item.label}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
