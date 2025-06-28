import { Fragment } from "react";
import { useTourStore } from "../store/useTourStore";

const NDS_RATE = 0.06;


export default function EstimateTable() {
  const {
    draft: { days, numPeople },
  } = useTourStore();


  if (!Array.isArray(days) || days.length === 0) return null;

  const detail = days.flatMap((day, dayIndex) => {
    if (!Array.isArray(day.services)) return [];

    return day.services.map((service) => {
      const price = service.price ?? 0;
       const qty = service.qty ?? numPeople ?? 1;
      const sum = price * qty;
      const sumWithNDS = sum * (1 + NDS_RATE);

      return {
        day: dayIndex + 1,
        service: service.key,
        price,
        qty,
        sum,
        sumWithNDS,
      };
    });
  });

  const total = detail.reduce((acc, row) => acc + row.sumWithNDS, 0);

  const grouped = detail.reduce((acc, row) => {
    acc[row.day] = acc[row.day] || [];
    acc[row.day].push(row);
    return acc;
  }, {} as Record<number, typeof detail>);

  return (
    <div className="mt-6 bg-white p-4 rounded border shadow">
      <h2 className="text-lg font-semibold mb-4">📊 Смета</h2>

      <div className="max-h-[70vh] overflow-auto border rounded relative">
        <table className="w-full text-sm table-auto border-collapse">
          <thead className="sticky top-0 bg-white z-10 shadow">
            <tr className="bg-gray-200">
              <th className="border px-3 py-2">День</th>
              <th className="border px-3 py-2">Опция</th>
              <th className="border px-3 py-2 text-right">Цена</th>
              <th className="border px-3 py-2 text-right">Кол-во</th>
              <th className="border px-3 py-2 text-right">Сумма</th>
              <th className="border px-3 py-2 text-right">Сумма с НДС</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([day, rows]) => (
              <Fragment key={day}>
                <tr className="bg-gray-100 border-t-2 border-gray-300">
                  <td colSpan={6} className="px-3 py-2 font-semibold text-left">
                    🗓 День {day}
                  </td>
                </tr>
                {rows.map((row, idx) => (
                  <tr key={`${day}-${idx}`}>
                    <td className="border px-3 py-2 text-center">{row.day}</td>
                    <td className="border px-3 py-2">{row.service}</td>
                    <td className="border px-3 py-2 text-right">{row.price}</td>
                    <td className="border px-3 py-2 text-right">{row.qty}</td>
                    <td className="border px-3 py-2 text-right">{row.sum.toFixed(0)}</td>
                    <td className="border px-3 py-2 text-right">{row.sumWithNDS.toFixed(0)}</td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>

        <div className="sticky bottom-0 bg-white border-t p-3 text-right font-semibold shadow-inner">
          💰 ИТОГО: <span className="text-green-700">{total.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}