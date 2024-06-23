"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortTasks = void 0;
var helpers_1 = require("./helpers");
var sortTasks = function (tasks, today) {
    var in2Days = new Date(today);
    in2Days.setDate(in2Days.getDate() + 2);
    var sortFlags = [
        // due today or past due
        function (t) { return 'due' in t && new Date(t.due) <= today; },
        // strict deadline and due today or past due
        function (t) {
            return 'due' in t &&
                'strictDeadline' in t &&
                new Date(t.due) <= today &&
                t.strictDeadline;
        },
        // has not been done today
        // t =>
        //   !t.hasOwnProperty('history') ||
        //   t.history.filter(d => d === dateString(today)).length === 0,
        // if I do this today, I won't have to do it tomorrow
        function (t) {
            var _a;
            return 'due' in t &&
                new Date(t.due) <= today &&
                ((_a = (0, helpers_1.nextDueDate)(t)) !== null && _a !== void 0 ? _a : Infinity) >= in2Days;
        },
    ];
    tasks.sort(function (a, b) {
        for (var _i = 0, sortFlags_1 = sortFlags; _i < sortFlags_1.length; _i++) {
            var flag = sortFlags_1[_i];
            if (flag(a) && !flag(b))
                return -1;
            if (flag(b) && !flag(a))
                return 1;
        }
        if ('due' in a && 'due' in b)
            return a.due.localeCompare(b.due);
        if ('timeFrame' in a && 'timeFrame' in b) {
            if (a.timeFrame === 0)
                return -1;
            if (b.timeFrame === 0)
                return 1;
            return a.timeFrame - b.timeFrame;
        }
        return 0;
    });
};
exports.sortTasks = sortTasks;
