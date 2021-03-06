"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 * Static variables that you can override
 *   1. days.           default 1,2,....31
 *   2. daysOfWeek,     default Sunday, Monday, .....
 *   3. firstDayOfWeek, default 0 as in Sunday
 *   4. months,         default January, February
 *   5. formatDate(d)   default returns YYYY-MM-DD HH:MM
 *   6. parseDate(str)  default returns date from YYYY-MM-DD HH:MM
 */
var Ng2Datetime = Ng2Datetime_1 = (function () {
    function Ng2Datetime() {
    }
    Ng2Datetime.formatDate = function (d, format, dateOnly) {
        var ret;
        if (d && !format) {
            // return d.toLocaleString('en-us', hash); // IE11 does not understand this
            var pad0 = function (number) { return ("0" + number).slice(-2); };
            ret = d.getFullYear() + '-' + pad0(d.getMonth() + 1) + '-' + pad0(d.getDate());
            ret += dateOnly ? '' : ' ' + pad0(d.getHours()) + ':' + pad0(d.getMinutes());
            return ret;
        }
        else if (d && moment) {
            return moment(d).format(format);
        }
        else {
            return '';
        }
    };
    Ng2Datetime.parseDate = function (dateStr, parseFormat, dateFormat) {
        if (typeof moment === 'undefined') {
            dateStr = Ng2Datetime_1.removeTimezone(dateStr);
            dateStr = dateStr + Ng2Datetime_1.addDSTOffset(dateStr);
            return Ng2Datetime_1.parseFromDefaultFormat(dateStr);
        }
        else if (dateFormat || parseFormat) {
            // try parse using each format because changing format programmatically calls this twice,
            // once with string in parse format and once in date format
            var formats = [];
            if (parseFormat) {
                formats.push(parseFormat);
            }
            if (dateFormat) {
                formats.push(dateFormat);
            }
            var m = moment(dateStr, formats);
            var date = m.toDate();
            if (!m.isValid()) {
                date = moment(dateStr, moment.ISO_8601).toDate(); // parse as ISO format
            }
            return date;
        }
        else if (dateStr.length > 4) {
            var date = moment(dateStr, 'YYYY-MM-DD HH:mm').toDate();
            return date;
        }
        else {
            return new Date();
        }
    };
    //remove timezone
    Ng2Datetime.removeTimezone = function (dateStr) {
        // if no time is given, add 00:00:00 at the end
        var matches = dateStr.match(/[0-9]{2}:/);
        dateStr += matches ? '' : ' 00:00:00';
        return dateStr.replace(/([0-9]{2}-[0-9]{2})-([0-9]{4})/, '$2-$1') //mm-dd-yyyy to yyyy-mm-dd
            .replace(/([\/-][0-9]{2,4})\ ([0-9]{2}\:[0-9]{2}\:)/, '$1T$2') //reformat for FF
            .replace(/EDT|EST|CDT|CST|MDT|PDT|PST|UT|GMT/g, '') //remove timezone
            .replace(/\s*\(\)\s*/, '') //remove timezone
            .replace(/[\-\+][0-9]{2}:?[0-9]{2}$/, '') //remove timezone
            .replace(/000Z$/, '00'); //remove timezone
    };
    Ng2Datetime.addDSTOffset = function (dateStr) {
        var date = Ng2Datetime_1.parseFromDefaultFormat(dateStr);
        var jan = new Date(date.getFullYear(), 0, 1);
        var jul = new Date(date.getFullYear(), 6, 1);
        var stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
        var isDST = date.getTimezoneOffset() < stdTimezoneOffset;
        var offset = isDST ? stdTimezoneOffset - 60 : stdTimezoneOffset;
        var diff = offset >= 0 ? '-' : '+';
        offset = Math.abs(offset);
        return diff +
            ('0' + (offset / 60)).slice(-2) + ':' +
            ('0' + (offset % 60)).slice(-2);
    };
    ;
    Ng2Datetime.parseFromDefaultFormat = function (dateStr) {
        var tmp = dateStr.split(/[\+\-:\ T]/); // split by dash, colon or space
        return new Date(parseInt(tmp[0], 10), parseInt(tmp[1], 10) - 1, parseInt(tmp[2], 10), parseInt(tmp[3] || '0', 10), parseInt(tmp[4] || '0', 10), parseInt(tmp[5] || '0', 10));
    };
    Ng2Datetime.prototype.getMonthData = function (year, month) {
        year = month > 11 ? year + 1 :
            month < 0 ? year - 1 : year;
        month = (month + 12) % 12;
        var firstDayOfMonth = new Date(year, month, 1);
        var lastDayOfMonth = new Date(year, month + 1, 0);
        var lastDayOfPreviousMonth = new Date(year, month, 0);
        var daysInMonth = lastDayOfMonth.getDate();
        var daysInLastMonth = lastDayOfPreviousMonth.getDate();
        var dayOfWeek = firstDayOfMonth.getDay();
        // Ensure there are always leading days to give context
        var leadingDays = (dayOfWeek - Ng2Datetime_1.firstDayOfWeek + 7) % 7 || 7;
        var trailingDays = Ng2Datetime_1.days.slice(0, 6 * 7 - (leadingDays + daysInMonth));
        if (trailingDays.length > 7) {
            trailingDays = trailingDays.slice(0, trailingDays.length - 7);
        }
        var localizedDaysOfWeek = Ng2Datetime_1.daysOfWeek
            .concat(Ng2Datetime_1.daysOfWeek)
            .splice(Ng2Datetime_1.firstDayOfWeek, 7);
        var monthData = {
            year: year,
            month: month,
            weekends: Ng2Datetime_1.weekends,
            firstDayOfWeek: Ng2Datetime_1.firstDayOfWeek,
            fullName: Ng2Datetime_1.months[month].fullName,
            shortName: Ng2Datetime_1.months[month].shortName,
            localizedDaysOfWeek: localizedDaysOfWeek,
            days: Ng2Datetime_1.days.slice(0, daysInMonth),
            leadingDays: Ng2Datetime_1.days.slice(-leadingDays - (31 - daysInLastMonth), daysInLastMonth),
            trailingDays: trailingDays
        };
        return monthData;
    };
    return Ng2Datetime;
}());
Ng2Datetime.locale = {
    date: 'date',
    time: 'time',
    year: 'year',
    month: 'month',
    day: 'day',
    hour: 'hour',
    minute: 'minute',
    currentTime: "current time"
};
Ng2Datetime.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
Ng2Datetime.weekends = [];
Ng2Datetime.daysOfWeek = typeof moment === 'undefined' ? [
    { fullName: 'Sunday', shortName: 'Su' },
    { fullName: 'Monday', shortName: 'Mo' },
    { fullName: 'Tuesday', shortName: 'Tu' },
    { fullName: 'Wednesday', shortName: 'We' },
    { fullName: 'Thursday', shortName: 'Th' },
    { fullName: 'Friday', shortName: 'Fr' },
    { fullName: 'Saturday', shortName: 'Sa' }
] : moment.weekdays().map(function (el, index) {
    return {
        fullName: el,
        shortName: moment.weekdaysShort()[index].substr(0, 2)
    };
});
Ng2Datetime.firstDayOfWeek = typeof moment === 'undefined' ? 0 : moment.localeData().firstDayOfWeek();
Ng2Datetime.months = typeof moment === 'undefined' ? [
    { fullName: 'January', shortName: 'Jan' },
    { fullName: 'February', shortName: 'Feb' },
    { fullName: 'March', shortName: 'Mar' },
    { fullName: 'April', shortName: 'Apr' },
    { fullName: 'May', shortName: 'May' },
    { fullName: 'June', shortName: 'Jun' },
    { fullName: 'July', shortName: 'Jul' },
    { fullName: 'August', shortName: 'Aug' },
    { fullName: 'September', shortName: 'Sep' },
    { fullName: 'October', shortName: 'Oct' },
    { fullName: 'November', shortName: 'Nov' },
    { fullName: 'December', shortName: 'Dec' }
] : moment.months().map(function (el, index) {
    return {
        fullName: el,
        shortName: moment['monthsShort']()[index]
    };
});
Ng2Datetime = Ng2Datetime_1 = __decorate([
    core_1.Injectable()
], Ng2Datetime);
exports.Ng2Datetime = Ng2Datetime;
var Ng2Datetime_1;
//# sourceMappingURL=ng2-datetime.js.map