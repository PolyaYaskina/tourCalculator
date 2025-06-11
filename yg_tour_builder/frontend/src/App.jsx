import { useState } from "react";
import TourEditor from "./TourEditor";
import ServiceEditor from "./ServiceEditor";

export default function App() {
  const [activeTab, setActiveTab] = useState("tour");

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("tour")}
          className={`px-4 py-2 rounded ${activeTab === "tour" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Калькулятор
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`px-4 py-2 rounded ${activeTab === "services" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Услуги
        </button>
      </div>

      {/* 🔁 Компоненты всегда живые, просто скрыты */}
      <div className={activeTab === "tour" ? "block" : "hidden"}>
        <TourEditor />
      </div>
      <div className={activeTab === "services" ? "block" : "hidden"}>
        <ServiceEditor />
      </div>
    </div>
  );
}
