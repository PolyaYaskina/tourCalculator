import { useState } from "react";
import TourEditor from "./TourEditor";
import ServiceEditorPanel from "./components/ServiceEditorPanel";

export default function App() {
  const [servicePanelOpen, setServicePanelOpen] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* 🌍 Основная колонка — тур редактор */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">🛠️ Конструктор тура</h1>
          <button
            onClick={() => setServicePanelOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ✨ Услуги
          </button>
        </div>
        <TourEditor />
      </div>

      {/* 📦 Боковая панель */}
      <ServiceEditorPanel
        isOpen={servicePanelOpen}
        onClose={() => setServicePanelOpen(false)}
      />
    </div>
  );
}



// import { useState } from "react";
// import TourEditor from "./TourEditor";
// import ServiceEditor from "./ServiceEditor";
// import TourPage from "./pages/TourPage"; // или где у тебя TourLayout
// export default function App() {
//   return <TourPage />;
// }
//
// export default function App() {
//   const [activeTab, setActiveTab] = useState("tour");
//
//   return (
//     <div className="p-8 max-w-3xl mx-auto">
//       <div className="flex space-x-4 mb-6">
//         <button
//           onClick={() => setActiveTab("tour")}
//           className={`px-4 py-2 rounded ${activeTab === "tour" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//         >
//           Калькулятор
//         </button>
//         <button
//           onClick={() => setActiveTab("services")}
//           className={`px-4 py-2 rounded ${activeTab === "services" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//         >
//           Услуги
//         </button>
//       </div>
//
//       {/* 🔁 Компоненты всегда живые, просто скрыты */}
//       <div className={activeTab === "tour" ? "block" : "hidden"}>
//         <TourEditor />
//       </div>
//       <div className={activeTab === "services" ? "block" : "hidden"}>
//         <ServiceEditor />
//       </div>
//     </div>
//   );
//}
