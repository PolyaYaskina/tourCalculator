import { Fragment } from "react";

export default function EstimateTable({ detail, total }) {
  if (!detail.length) return null;

  const grouped = detail.reduce((acc, row) => {
    acc[row.day] = acc[row.day] || [];
    acc[row.day].push(row);
    return acc;
  }, {});

  return (
    <div className="mt-6 bg-white p-4 rounded border shadow">
      <h2 className="text-lg font-semibold mb-4">📊 Смета</h2>
      <table className="w-full text-sm table-auto border-collapse">
        <thead>
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
                  <td className="border px-3 py-2 text-right">{row.sum}</td>
                  <td className="border px-3 py-2 text-right">{row.sumWithNDS}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-yellow-100 font-semibold">
            <td className="border px-3 py-2 text-center" colSpan={5}>
              ИТОГО
            </td>
            <td className="border px-3 py-2 text-right">{total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}