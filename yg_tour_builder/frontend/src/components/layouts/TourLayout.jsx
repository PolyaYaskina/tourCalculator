// components/layouts/TourLayout.jsx
import SidePanel from "../SidePanel"; // добавим позже

export default function TourLayout({ children }) {
  return (
    <div className="grid grid-cols-[240px_1fr_360px] min-h-screen">
      {/* Левый сайдбар */}
      <aside className="bg-gray-100 border-r p-4 space-y-4">
        <h2 className="text-lg font-semibold">Навигация</h2>
        <div className="text-sm text-gray-500">В разработке...</div>
      </aside>

      {/* Центральная часть */}
      <main className="bg-white p-6 overflow-auto">{children}</main>

      {/* Правая панель */}
      <aside className="bg-gray-50 border-l p-4">
        <SidePanel />
      </aside>
    </div>
  );
}
