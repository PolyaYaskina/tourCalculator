"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTourStore = void 0;
var zustand_1 = require("zustand");
var middleware_1 = require("zustand/middleware");
var generateEmptyDay = function () { return ({
    description: "",
    services: [{ key: "#трансфер" }],
}); };
var initialDraft = {
    title: "",
    region: "baikal",
    numPeople: 2,
    season: "summer",
    startDate: undefined,
    endDate: undefined,
    description: undefined,
    days: [generateEmptyDay()],
    selectedDayIndex: 0,
    scenarioChosen: false,
};
exports.useTourStore = (0, zustand_1.create)()((0, middleware_1.persist)(function (set, get) { return ({
    draft: initialDraft,
    showEstimate: false,
    rightPanelOpen: false,
    setShowEstimate: function (val) {
        return set(function () { return ({ showEstimate: val }); });
    },
    setRightPanelOpen: function (val) {
        return set(function () { return ({ rightPanelOpen: val }); });
    },
    setDraft: function (updates) {
        return set(function (state) { return ({
            draft: __assign(__assign({}, state.draft), updates),
        }); });
    },
    updateDay: function (index, updates) {
        return set(function (state) {
            var days = __spreadArray([], state.draft.days, true);
            if (index < 0 || index >= days.length)
                return state;
            days[index] = __assign(__assign({}, days[index]), updates);
            return { draft: __assign(__assign({}, state.draft), { days: days }) };
        });
    },
    removeDay: function (index) {
        return set(function (state) {
            var draft = state.draft, selectedDayIndex = state.selectedDayIndex;
            if (draft.days.length === 1)
                return {}; // нельзя удалить последний день
            var newDays = draft.days.filter(function (_, i) { return i !== index; });
            var newIndex = selectedDayIndex === index
                ? Math.max(0, index - 1)
                : selectedDayIndex > index
                    ? selectedDayIndex - 1
                    : selectedDayIndex;
            return {
                draft: __assign(__assign({}, draft), { days: newDays, selectedDayIndex: newIndex }),
            };
        });
    },
    addDay: function () {
        return set(function (state) {
            var newDays = __spreadArray(__spreadArray([], state.draft.days, true), [generateEmptyDay()], false);
            return {
                draft: __assign(__assign({}, state.draft), { days: newDays, selectedDayIndex: newDays.length - 1 }),
            };
        });
    },
    setSelectedDayIndex: function (index) {
        return set(function (state) { return ({
            draft: __assign(__assign({}, state.draft), { selectedDayIndex: index }),
        }); });
    },
    setScenarioChosen: function (val) {
        return set(function (state) { return ({
            draft: __assign(__assign({}, state.draft), { scenarioChosen: val }),
        }); });
    },
    reset: function () {
        return set(function () { return ({
            draft: __assign({}, initialDraft),
        }); });
    },
    applyTemplate: function (template) {
        return set(function () {
            if (!Array.isArray(template.days)) {
                console.warn("⚠️ Некорректный шаблон: поле days не массив");
                return {};
            }
            var selectedDayIndex = template.selectedDayIndex, scenarioChosen = template.scenarioChosen, safeTemplate = __rest(template, ["selectedDayIndex", "scenarioChosen"]);
            return {
                draft: __assign(__assign(__assign({}, initialDraft), safeTemplate), { selectedDayIndex: 0, scenarioChosen: false }),
            };
        });
    },
    addServiceToDay: function (dayIndex, newService) {
        return set(function (state) {
            var days = __spreadArray([], state.draft.days, true);
            if (dayIndex < 0 || dayIndex >= days.length)
                return state;
            days[dayIndex] = __assign(__assign({}, days[dayIndex]), { services: __spreadArray(__spreadArray([], days[dayIndex].services, true), [newService], false) });
            return { draft: __assign(__assign({}, state.draft), { days: days }) };
        });
    },
    removeServiceFromDay: function (dayIndex, serviceIndex) {
        return set(function (state) {
            var days = __spreadArray([], state.draft.days, true);
            if (dayIndex < 0 || dayIndex >= days.length)
                return state;
            var updatedServices = days[dayIndex].services.filter(function (_, i) { return i !== serviceIndex; });
            days[dayIndex] = __assign(__assign({}, days[dayIndex]), { services: updatedServices });
            return { draft: __assign(__assign({}, state.draft), { days: days }) };
        });
    },
    updateServiceInDay: function (dayIndex, serviceIndex, updates) {
        return set(function (state) {
            var days = __spreadArray([], state.draft.days, true);
            if (dayIndex < 0 || dayIndex >= days.length)
                return state;
            var services = __spreadArray([], days[dayIndex].services, true);
            if (serviceIndex < 0 || serviceIndex >= services.length)
                return state;
            services[serviceIndex] = __assign(__assign({}, services[serviceIndex]), updates);
            days[dayIndex] = __assign(__assign({}, days[dayIndex]), { services: services });
            return { draft: __assign(__assign({}, state.draft), { days: days }) };
        });
    },
}); }, {
    name: "tour-storage", // ключ в localStorage
    partialize: function (state) { return ({
        draft: state.draft,
        showEstimate: state.showEstimate,
        rightPanelOpen: state.rightPanelOpen,
    }); },
}));
