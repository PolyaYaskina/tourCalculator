// 📦 ServiceEditorPanel.jsx — отъезжающая справа панель с редактором услуг
    import ServiceEditor from "../ServiceEditor";

    export default function ServiceEditorPanel({ isOpen, onClose }) {
      return (
        <div className={`fixed top-0 right-0 h-full w-1/4 bg-white shadow-lg border-l transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Редактор услуг</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">×</button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
            <ServiceEditor />
          </div>
        </div>
      );
    }