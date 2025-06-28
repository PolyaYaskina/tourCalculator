"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TemplateSelector;
var DropdownMenu_1 = require("./DropdownMenu");
var useTemplates_1 = require("../hooks/useTemplates");
function TemplateSelector(_a) {
    var _this = this;
    var region = _a.region, onSelect = _a.onSelect;
    var _b = (0, useTemplates_1.useTemplates)(region), templates = _b.templates, loading = _b.loading, error = _b.error;
    if (!region)
        return null;
    if (loading)
        return <div>Загрузка шаблонов...</div>;
    if (error)
        return <div>Ошибка загрузки шаблонов</div>;
    function getFilename(path) {
        var index = path.indexOf("/");
        return index === -1 ? path : path.slice(index + 1);
    }
    var handleSelect = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var res, raw, draft;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(import.meta.env.VITE_API_URL, "/templates/").concat(region, "/").concat(getFilename(file)))];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    raw = _a.sent();
                    console.log("RAW:", raw);
                    draft = {
                        title: "Из шаблона",
                        region: region,
                        season: raw.season,
                        numPeople: 2,
                        days: Array.isArray(raw.days) ? raw.days : [], // 💥 проверка
                        startDate: undefined,
                        endDate: undefined,
                        description: undefined,
                    };
                    console.log("TEMPLATE:", draft);
                    onSelect(draft); // ⬅️ вот тут и вызывается applyTemplate
                    return [2 /*return*/];
            }
        });
    }); };
    var items = templates.map(function (t) { return ({
        value: t.file,
        label: t.label || t.name,
    }); });
    return (<DropdownMenu_1.default title="📁 Выбрать шаблон" items={items} onSelect={handleSelect}/>);
}
