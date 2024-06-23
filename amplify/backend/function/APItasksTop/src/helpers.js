"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextDueDate = exports.dateString = void 0;
var dateString = function (date) {
    return "".concat(date.getFullYear(), "-").concat(date.getMonth() + 1, "-").concat(date.getDate());
};
exports.dateString = dateString;
var nextDueDate = function (task) {
    var date = new Date(task.due);
    if (task.repeat === 'Daily')
        date.setDate(date.getDate() + 1);
    if (task.repeat === 'Custom' && task.repeatUnit === 'day')
        date.setDate(date.getDate() + task.repeatInterval);
    else if (task.repeat === 'Weekly')
        date.setDate(date.getDate() + 7);
    else if (task.repeat === 'Custom' && task.repeatUnit === 'week') {
        if (!('repeatWeekdays' in task) || !task.repeatWeekdays.some(function (x) { return x; }))
            date.setDate(date.getDate() + 7 * task.repeatInterval);
        else {
            var i = (date.getDay() + 1) % 7;
            while (!task.repeatWeekdays[i])
                i = (i + 1) % 7;
            if (i > date.getDay())
                date.setDate(date.getDate() + i - date.getDay());
            else {
                date.setDate(date.getDate() + 7 * task.repeatInterval);
                date.setDate(date.getDate() + i - date.getDay());
            }
        }
    }
    else if (task.repeat === 'Weekdays') {
        var daysToAdd = date.getDay() === 5 ? 3 : 1;
        date.setDate(date.getDate() + daysToAdd * task.repeatInterval);
    }
    else if (task.repeat === 'Monthly')
        date.setMonth(date.getMonth() + 1);
    else if (task.repeat === 'Custom' && task.repeatUnit === 'month')
        date.setMonth(date.getMonth() + task.repeatInterval);
    else if (task.repeat === 'Yearly')
        date.setFullYear(date.getFullYear() + 1);
    else if (task.repeat === 'Custom' && task.repeatUnit === 'year')
        date.setFullYear(date.getFullYear() + task.repeatInterval);
    date.setHours(date.getHours() + 2);
    // if (task.until && new Date(task.until) < new Date(dateString(date)))
    //   return undefined
    return new Date((0, exports.dateString)(date));
};
exports.nextDueDate = nextDueDate;
