"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var ng2_datetime_1 = require("./ng2-datetime");
//@TODO
// . display currently selected day
/**
 * show a selected date in monthly calendar
 */
var Ng2DatetimePickerComponent = (function () {
    function Ng2DatetimePickerComponent(elementRef, ng2Datetime, cdRef) {
        this.ng2Datetime = ng2Datetime;
        this.cdRef = cdRef;
        this.minuteStep = 1;
        this.selected$ = new core_1.EventEmitter();
        this.closing$ = new core_1.EventEmitter();
        this.locale = ng2_datetime_1.Ng2Datetime.locale;
        this.el = elementRef.nativeElement;
    }
    Object.defineProperty(Ng2DatetimePickerComponent.prototype, "year", {
        // public ngAfterViewInit ():void {
        //   let stopPropagation = (e: Event) => e.stopPropagation();
        //   if (!this.dateOnly) {
        //     this.hours.nativeElement.addEventListener('keyup', stopPropagation);
        //     this.hours.nativeElement.addEventListener('mousedown', stopPropagation);
        //     this.minutes.nativeElement.addEventListener('keyup', stopPropagation);
        //     this.minutes.nativeElement.addEventListener('mousedown', stopPropagation);
        //   }
        // }
        get: function () {
            return this.selectedDate.getFullYear();
        },
        set: function (year) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ng2DatetimePickerComponent.prototype, "month", {
        get: function () {
            return this.selectedDate.getMonth();
        },
        set: function (month) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ng2DatetimePickerComponent.prototype, "day", {
        get: function () {
            return this.selectedDate.getDate();
        },
        set: function (day) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ng2DatetimePickerComponent.prototype, "monthData", {
        get: function () {
            return this._monthData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ng2DatetimePickerComponent.prototype, "today", {
        get: function () {
            var dt = new Date();
            dt.setHours(0);
            dt.setMinutes(0);
            dt.setSeconds(0);
            dt.setMilliseconds(0);
            return dt;
        },
        set: function (today) { },
        enumerable: true,
        configurable: true
    });
    Ng2DatetimePickerComponent.prototype.isWeekend = function (dayNum, month) {
        if (typeof month === 'undefined') {
            return ng2_datetime_1.Ng2Datetime.weekends.indexOf(dayNum % 7) !== -1; //weekday index
        }
        else {
            var weekday = this.toDate(dayNum, month).getDay();
            return ng2_datetime_1.Ng2Datetime.weekends.indexOf(weekday) !== -1;
        }
    };
    Ng2DatetimePickerComponent.prototype.ngOnInit = function () {
        if (!this.defaultValue || isNaN(this.defaultValue.getTime())) {
            this.defaultValue = new Date();
        }
        this.selectedDate = this.defaultValue;
        // set hour and minute using moment if available to avoid having Javascript change timezones
        if (typeof moment === 'undefined') {
            this.hour = this.selectedDate.getHours();
            this.minute = this.selectedDate.getMinutes();
        }
        else {
            var m = moment(this.selectedDate);
            this.hour = m.hours();
            this.minute = m.minute();
        }
        this._monthData = this.ng2Datetime.getMonthData(this.year, this.month);
    };
    Ng2DatetimePickerComponent.prototype.toDate = function (day, month) {
        return new Date(this._monthData.year, month || this._monthData.month, day);
    };
    Ng2DatetimePickerComponent.prototype.toDateOnly = function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    };
    Ng2DatetimePickerComponent.prototype.selectCurrentTime = function () {
        this.hour = (new Date()).getHours();
        this.minute = (new Date()).getMinutes();
        this.selectDateTime();
    };
    /**
     * set the selected date and close it when closeOnSelect is true
     * @param date {Date}
     */
    Ng2DatetimePickerComponent.prototype.selectDateTime = function (date) {
        var _this = this;
        this.selectedDate = date || this.selectedDate;
        if (this.isDateDisabled(this.selectedDate)) {
            return false;
        }
        // editing hours and minutes via javascript date methods causes date to lose timezone info,
        // so edit using moment if available
        var hour = parseInt('' + this.hour || '0', 10);
        var minute = parseInt('' + this.minute || '0', 10);
        if (typeof moment !== 'undefined') {
            // here selected date has a time of 00:00 in local time,
            // so build moment by getting year/month/day separately
            // to avoid it saving as a day earlier
            var m = moment([this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate()]);
            m.hours(hour);
            m.minutes(minute);
            this.selectedDate = m.toDate();
        }
        else {
            this.selectedDate.setHours(hour);
            this.selectedDate.setMinutes(minute);
        }
        //console.log('this.selectedDate', this.selectedDate)
        this.selectedDate.toString = function () {
            return ng2_datetime_1.Ng2Datetime.formatDate(_this.selectedDate, _this.dateFormat, _this.dateOnly);
        };
        this.selected$.emit(this.selectedDate);
    };
    ;
    /**
     * show prev/next month calendar
     */
    Ng2DatetimePickerComponent.prototype.updateMonthData = function (num) {
        this._monthData = this.ng2Datetime.getMonthData(this._monthData.year, this._monthData.month + num);
    };
    Ng2DatetimePickerComponent.prototype.isDateDisabled = function (date) {
        var dateInTime = date.getTime();
        this.disabledDatesInTime =
            this.disabledDatesInTime || (this.disabledDates || []).map(function (d) { return d.getTime(); });
        if (this.minDate && (dateInTime < this.minDate.getTime())) {
            return true;
        }
        else if (this.maxDate && (dateInTime > this.maxDate.getTime())) {
            return true;
        }
        else if (this.disabledDatesInTime.indexOf(dateInTime) >= 0) {
            return true;
        }
        return false;
    };
    Ng2DatetimePickerComponent.prototype.close = function () {
        this.closing$.emit(true);
    };
    return Ng2DatetimePickerComponent;
}());
__decorate([
    core_1.Input('date-format'),
    __metadata("design:type", String)
], Ng2DatetimePickerComponent.prototype, "dateFormat", void 0);
__decorate([
    core_1.Input('date-only'),
    __metadata("design:type", Boolean)
], Ng2DatetimePickerComponent.prototype, "dateOnly", void 0);
__decorate([
    core_1.Input('time-only'),
    __metadata("design:type", Boolean)
], Ng2DatetimePickerComponent.prototype, "timeOnly", void 0);
__decorate([
    core_1.Input('selected-date'),
    __metadata("design:type", Date)
], Ng2DatetimePickerComponent.prototype, "selectedDate", void 0);
__decorate([
    core_1.Input('hour'),
    __metadata("design:type", Number)
], Ng2DatetimePickerComponent.prototype, "hour", void 0);
__decorate([
    core_1.Input('minute'),
    __metadata("design:type", Number)
], Ng2DatetimePickerComponent.prototype, "minute", void 0);
__decorate([
    core_1.Input('minuteStep'),
    __metadata("design:type", Number)
], Ng2DatetimePickerComponent.prototype, "minuteStep", void 0);
__decorate([
    core_1.Input('default-value'),
    __metadata("design:type", Date)
], Ng2DatetimePickerComponent.prototype, "defaultValue", void 0);
__decorate([
    core_1.Input('min-date'),
    __metadata("design:type", Date)
], Ng2DatetimePickerComponent.prototype, "minDate", void 0);
__decorate([
    core_1.Input('max-date'),
    __metadata("design:type", Date)
], Ng2DatetimePickerComponent.prototype, "maxDate", void 0);
__decorate([
    core_1.Input('min-hour'),
    __metadata("design:type", Number)
], Ng2DatetimePickerComponent.prototype, "minHour", void 0);
__decorate([
    core_1.Input('max-hour'),
    __metadata("design:type", Number)
], Ng2DatetimePickerComponent.prototype, "maxHour", void 0);
__decorate([
    core_1.Input('disabled-dates'),
    __metadata("design:type", Array)
], Ng2DatetimePickerComponent.prototype, "disabledDates", void 0);
__decorate([
    core_1.Input('show-close-button'),
    __metadata("design:type", Boolean)
], Ng2DatetimePickerComponent.prototype, "showCloseButton", void 0);
__decorate([
    core_1.Input('show-close-layer'),
    __metadata("design:type", Boolean)
], Ng2DatetimePickerComponent.prototype, "showCloseLayer", void 0);
__decorate([
    core_1.Output('selected$'),
    __metadata("design:type", core_1.EventEmitter)
], Ng2DatetimePickerComponent.prototype, "selected$", void 0);
__decorate([
    core_1.Output('closing$'),
    __metadata("design:type", core_1.EventEmitter)
], Ng2DatetimePickerComponent.prototype, "closing$", void 0);
__decorate([
    core_1.ViewChild('hours'),
    __metadata("design:type", core_1.ElementRef)
], Ng2DatetimePickerComponent.prototype, "hours", void 0);
__decorate([
    core_1.ViewChild('minutes'),
    __metadata("design:type", core_1.ElementRef)
], Ng2DatetimePickerComponent.prototype, "minutes", void 0);
Ng2DatetimePickerComponent = __decorate([
    core_1.Component({
        providers: [ng2_datetime_1.Ng2Datetime],
        selector: 'ng2-datetime-picker',
        template: "\n<div class=\"closing-layer\" (click)=\"close()\" *ngIf=\"showCloseLayer\" ></div>\n<div class=\"ng2-datetime-picker\">\n  <div class=\"close-button\" *ngIf=\"showCloseButton\" (click)=\"close()\"></div>\n  \n  <!-- Month - Year  -->\n  <div class=\"month\" *ngIf=\"!timeOnly\">\n    <b class=\"prev_next prev\" (click)=\"updateMonthData(-12)\">&laquo;</b>\n    <b class=\"prev_next prev\" (click)=\"updateMonthData(-1)\">&lsaquo;</b>\n     <span title=\"{{monthData?.fullName}}\">\n           {{monthData?.shortName}}\n     </span>\n    {{monthData.year}}\n    <b class=\"prev_next next\" (click)=\"updateMonthData(+12)\">&raquo;</b>\n    <b class=\"prev_next next\" (click)=\"updateMonthData(+1)\">&rsaquo;</b>\n  </div>\n\n  <!-- Date -->\n  <div class=\"days\" *ngIf=\"!timeOnly\">\n\n    <!-- Su Mo Tu We Th Fr Sa -->\n    <div class=\"day-of-week\"\n         *ngFor=\"let dayOfWeek of monthData.localizedDaysOfWeek; let ndx=index\"\n         [class.weekend]=\"isWeekend(ndx + monthData.firstDayOfWeek)\"\n         title=\"{{dayOfWeek.fullName}}\">\n      {{dayOfWeek.shortName}}\n    </div>\n\n    <!-- Fill up blank days for this month -->\n    <div *ngIf=\"monthData.leadingDays.length < 7\">\n      <div class=\"day\"\n          (click)=\"updateMonthData(-1)\"\n           *ngFor=\"let dayNum of monthData.leadingDays\">\n        {{dayNum}}\n      </div>\n    </div>\n\n    <div class=\"day\"\n         *ngFor=\"let dayNum of monthData.days\"\n         (click)=\"selectDateTime(toDate(dayNum))\"\n         title=\"{{monthData.year}}-{{monthData.month+1}}-{{dayNum}}\"\n         [ngClass]=\"{\n           selectable: !isDateDisabled(toDate(dayNum)),\n           selected: toDate(dayNum).getTime() === toDateOnly(selectedDate).getTime(),\n           today: toDate(dayNum).getTime() === today.getTime(),\n           weekend: isWeekend(dayNum, monthData.month)\n         }\">\n      {{dayNum}}\n    </div>\n\n    <!-- Fill up blank days for this month -->\n    <div *ngIf=\"monthData.trailingDays.length < 7\">\n      <div class=\"day\"\n           (click)=\"updateMonthData(+1)\"\n           *ngFor=\"let dayNum of monthData.trailingDays\">\n        {{dayNum}}\n      </div>\n    </div>\n  </div>\n\n  <!-- Time -->\n  <div class=\"time\" id=\"time\" *ngIf=\"!dateOnly\">\n    <div class=\"select-current-time\" (click)=\"selectCurrentTime()\">{{locale.currentTime}}</div>\n    <label class=\"timeLabel\">{{locale.time}}</label>\n    <span class=\"timeValue\">\n      {{(\"0\"+hour).slice(-2)}} : {{(\"0\"+minute).slice(-2)}}\n    </span><br/>\n    <label class=\"hourLabel\">{{locale.hour}}:</label>\n    <input #hours class=\"hourInput\"\n           tabindex=\"90000\"\n           (change)=\"selectDateTime()\"\n           type=\"range\"\n           min=\"{{minHour || 0}}\"\n           max=\"{{maxHour || 23}}\"\n           [(ngModel)]=\"hour\" />\n    <label class=\"minutesLabel\">{{locale.minute}}:</label>\n    <input #minutes class=\"minutesInput\"\n           tabindex=\"90000\"\n           step=\"{{minuteStep}}\"\n           (change)=\"selectDateTime()\"\n           type=\"range\" min=\"0\" max=\"59\" range=\"10\" [(ngModel)]=\"minute\"/>\n  </div>\n</div>\n  ",
        styles: [
            "\n@keyframes slideDown {\n  0% {\n    transform:  translateY(-10px);\n  }\n  100% {\n    transform: translateY(0px);\n  }\n}\n\n@keyframes slideUp {\n  0% {\n    transform: translateY(100%);\n  }\n  100% {\n    transform: translateY(0%);\n  }\n}\n\n.ng2-datetime-picker-wrapper {\n  position: relative;\n}\n\n.ng2-datetime-picker {\n  color: #333;\n  outline-width: 0;\n  font: normal 14px sans-serif;\n  border: 1px solid #ddd;\n  display: inline-block;\n  background: #fff;\n  animation: slideDown 0.1s ease-in-out;\n  animation-fill-mode: both;\n}\n.ng2-datetime-picker .close-button:before {\n  content: 'X';\n  position: absolute;\n  padding: 0 5px;\n  cursor: pointer;\n  color: #ff0000;\n  right: 0;\n  z-index: 1;\n}\n.ng2-datetime-picker > .month {\n  text-align: center;\n  line-height: 22px;\n  padding: 10px;\n  background: #fcfcfc;\n  text-transform: uppercase;\n  font-weight: bold;\n  border-bottom: 1px solid #ddd;\n  position: relative;\n}\n.ng2-datetime-picker > .month > .prev_next {\n  color: #555;\n  display: block;\n  font: normal 24px sans-serif;\n  outline: none;\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  width: 25px;\n  text-align: center;\n}\n.ng2-datetime-picker > .month > .prev_next:hover {\n  background-color: #333;\n  color: #fff;\n}\n.ng2-datetime-picker > .month > .prev_next.prev {\n  float: left;\n}\n.ng2-datetime-picker > .month > .prev_next.next {\n  float: right;\n}\n.ng2-datetime-picker > .days {\n  width: 210px; /* 30 x 7 */\n  margin: 10px;\n  text-align: center;\n}\n.ng2-datetime-picker > .days .day-of-week,\n.ng2-datetime-picker > .days .day {\n  box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  border: 1px solid transparent;\n  width: 30px;\n  line-height: 28px;\n  float: left;\n}\n.ng2-datetime-picker > .days .day-of-week {\n  font-weight: bold;\n}\n.ng2-datetime-picker > .days .day-of-week.weekend {\n  color: #ccc;\n  background-color: inherit;\n}\n.ng2-datetime-picker > .days .day:not(.selectable) {\n  color: #ccc;\n  cursor: default;\n}\n.ng2-datetime-picker > .days .weekend {\n  color: #ccc;\n  background-color: #eee;\n}\n.ng2-datetime-picker > .days .day.selectable  {\n  cursor: pointer;\n}\n.ng2-datetime-picker > .days .day.selected {\n  background: gray;\n  color: #fff;\n}\n.ng2-datetime-picker > .days .day:not(.selected).selectable:hover {\n  background: #eee;\n}\n.ng2-datetime-picker > .days:after {\n  content: '';\n  display: block;\n  clear: left;\n  height: 0;\n}\n.ng2-datetime-picker .time {\n  position: relative;\n  padding: 10px;\n  text-transform: Capitalize;\n}\n.ng2-datetime-picker .select-current-time {\n  position: absolute;\n  top: 1em;\n  right: 5px;\n  z-index: 1;\n  cursor: pointer;\n  color: #0000ff;\n}\n.ng2-datetime-picker .hourLabel,\n.ng2-datetime-picker .minutesLabel {\n  display: inline-block;\n  width: 40px;\n  text-align: right;\n}\n.ng2-datetime-picker input[type=range] {\n  width: 200px;\n}\n\n.closing-layer {\n  display: block;\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: rgba(0,0,0,0);\n}\n\n@media (max-width: 767px) {\n  .ng2-datetime-picker {\n    position: fixed;\n    bottom: 0;\n    left: 0;\n    right: 0;    \n    animation: slideUp 0.1s ease-in-out;\n  }\n\n  .ng2-datetime-picker .days {\n    margin: 10px auto;\n  }\n\n  .closing-layer {\n    display: block;\n    position: fixed;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    background: rgba(0,0,0,0.2);\n  }\n}\n  "
        ],
        encapsulation: core_1.ViewEncapsulation.None
    }),
    __metadata("design:paramtypes", [core_1.ElementRef,
        ng2_datetime_1.Ng2Datetime,
        core_1.ChangeDetectorRef])
], Ng2DatetimePickerComponent);
exports.Ng2DatetimePickerComponent = Ng2DatetimePickerComponent;
//# sourceMappingURL=ng2-datetime-picker.component.js.map