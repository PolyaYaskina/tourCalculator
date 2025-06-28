"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EstimateTable;
var react_1 = require("react");
var useTourStore_1 = require("../store/useTourStore");
var NDS_RATE = 0.06;
function EstimateTable() {
    var _a = (0, useTourStore_1.useTourStore)().draft, days = _a.days, numPeople = _a.numPeople;
    if (!Array.isArray(days) || days.length === 0)
        return null;
    var detail = days.flatMap(function (day, dayIndex) {
        if (!Array.isArray(day.services))
            return [];
        return day.services.map(function (service) {
            var _a, _b, _c;
            var price = (_a = service.price) !== null && _a !== void 0 ? _a : 0;
            var qty = (_c = (_b = service.qty) !== null && _b !== void 0 ? _b : numPeople) !== null && _c !== void 0 ? _c : 1;
            var sum = price * qty;
            var sumWithNDS = sum * (1 + NDS_RATE);
            return {
                day: dayIndex + 1,
                service: service.key,
                price: price,
                qty: qty,
                sum: sum,
                sumWithNDS: sumWithNDS,
            };
        });
    });
    var total = detail.reduce(function (acc, row) { return acc + row.sumWithNDS; }, 0);
    var grouped = detail.reduce(function (acc, row) {
        acc[row.day] = acc[row.day] || [];
        acc[row.day].push(row);
        return acc;
    }, {});
    return (<div className="mt-6 bg-white p-4 rounded border shadow">
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
            {Object.entries(grouped).map(function (_a) {
            var day = _a[0], rows = _a[1];
            return (<react_1.Fragment key={day}>
                <tr className="bg-gray-100 border-t-2 border-gray-300">
                  <td colSpan={6} className="px-3 py-2 font-semibold text-left">
                    🗓 День {day}
                  </td>
                </tr>
                {rows.map(function (row, idx) { return (<tr key={"".concat(day, "-").concat(idx)}>
                    <td className="border px-3 py-2 text-center">{row.day}</td>
                    <td className="border px-3 py-2">{row.service}</td>
                    <td className="border px-3 py-2 text-right">{row.price}</td>
                    <td className="border px-3 py-2 text-right">{row.qty}</td>
                    <td className="border px-3 py-2 text-right">{row.sum.toFixed(0)}</td>
                    <td className="border px-3 py-2 text-right">{row.sumWithNDS.toFixed(0)}</td>
                  </tr>); })}
              </react_1.Fragment>);
        })}
          </tbody>
        </table>

        <div className="sticky bottom-0 bg-white border-t p-3 text-right font-semibold shadow-inner">
          💰 ИТОГО: <span className="text-green-700">{total.toFixed(0)}</span>
        </div>
      </div>
    </div>);
}
