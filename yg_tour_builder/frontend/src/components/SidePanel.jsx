// components/SidePanel.jsx
import { useState } from "react";
import ServiceEditor from "./ServiceEditor";

export default function SidePanel() {
  const [activeTab, setActiveTab] = useState("services");

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab("services")}
          className={`px-3 py-1 text-sm rounded ${activeTab === "services" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Услуги
        </button>
        {/* возможны другие вкладки */}
      </div>

      {activeTab === "services" && <ServiceEditor />}
    </div>
  );
}
