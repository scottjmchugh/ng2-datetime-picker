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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var ng2_datetime_picker_component_1 = require("./ng2-datetime-picker.component");
var ng2_datetime_1 = require("./ng2-datetime");
function isInteger(value) {
    if (Number.isInteger) {
        return Number.isInteger(value);
    }
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
}
;
function isNaN(value) {
    if (Number.isNaN) {
        return Number.isNaN(value);
    }
    return value !== value;
}
;
/**
 * If the given string is not a valid date, it defaults back to today
 */
var Ng2DatetimePickerDirective = (function () {
    function Ng2DatetimePickerDirective(resolver, viewContainerRef, changeDetector, parent) {
        var _this = this;
        this.resolver = resolver;
        this.viewContainerRef = viewContainerRef;
        this.changeDetector = changeDetector;
        this.parent = parent;
        this.closeOnSelect = true;
        this.ngModelChange = new core_1.EventEmitter();
        this.valueChanged$ = new core_1.EventEmitter();
        this.popupClosed$ = new core_1.EventEmitter();
        /* input element string value is changed */
        this.inputElValueChanged = function (date) {
            _this.setInputElDateValue(date);
            _this.el.value = date.toString();
            if (_this.ctrl) {
                _this.ctrl.patchValue(_this.el.value);
            }
            _this.ngModel = _this.el['dateValue'];
            if (_this.ngModel) {
                _this.ngModel.toString = function () { return _this.el.value; };
                _this.ngModelChange.emit(_this.ngModel);
            }
        };
        //show datetimePicker element below the current element
        this.showDatetimePicker = function (event) {
            if (_this.componentRef) {
                return;
            }
            var factory = _this.resolver.resolveComponentFactory(ng2_datetime_picker_component_1.Ng2DatetimePickerComponent);
            _this.componentRef = _this.viewContainerRef.createComponent(factory);
            _this.ng2DatetimePickerEl = _this.componentRef.location.nativeElement;
            _this.ng2DatetimePickerEl.setAttribute('tabindex', '32767');
            _this.ng2DatetimePickerEl.addEventListener('mousedown', function (event) {
                _this.clickedDatetimePicker = true;
            });
            _this.ng2DatetimePickerEl.addEventListener('mouseup', function (event) {
                _this.clickedDatetimePicker = false;
            });
            _this.ng2DatetimePickerEl.addEventListener('blur', function (event) {
                _this.hideDatetimePicker();
            });
            var component = _this.componentRef.instance;
            component.defaultValue = _this.defaultValue || _this.el['dateValue'];
            component.dateFormat = _this.dateFormat;
            component.dateOnly = _this.dateOnly;
            component.timeOnly = _this.timeOnly;
            component.minuteStep = _this.minuteStep;
            component.minDate = _this.minDate;
            component.maxDate = _this.maxDate;
            component.minHour = _this.minHour;
            component.maxHour = _this.maxHour;
            component.disabledDates = _this.disabledDates;
            component.showCloseButton = _this.closeOnSelect === false;
            component.showCloseLayer = _this.showCloseLayer;
            _this.styleDatetimePicker();
            component.selected$.subscribe(_this.dateSelected);
            component.closing$.subscribe(function () {
                _this.hideDatetimePicker();
            });
            //Hack not to fire tab keyup event
            // this.justShown = true;
            // setTimeout(() => this.justShown = false, 100);
        };
        this.dateSelected = function (date) {
            _this.el.tagName === 'INPUT' && _this.inputElValueChanged(date);
            _this.valueChanged$.emit(date);
            if (_this.closeOnSelect !== false) {
                _this.hideDatetimePicker();
            }
            else {
                _this.ng2DatetimePickerEl.focus();
            }
        };
        this.hideDatetimePicker = function (event) {
            if (_this.clickedDatetimePicker) {
                return false;
            }
            else {
                setTimeout(function () {
                    if (_this.componentRef) {
                        _this.componentRef.destroy();
                    }
                    _this.componentRef = undefined;
                    _this.popupClosed$.emit(true);
                }, 500); // Delay is necessary otherwise object becomes undefined before destroy completes, resulting in a console error
            }
            event && event.stopPropagation();
        };
        this.keyEventListener = function (e) {
            // if (e.keyCode === 27 || e.keyCode === 9 || e.keyCode === 13) { //ESC, TAB, ENTER keys
            //   if (!this.justShown) {
            //     this.hideDatetimePicker();
            //   }
            // }
        };
        this.el = this.viewContainerRef.element.nativeElement;
    }
    /**
     * convert defaultValue, minDate, maxDate, minHour, and maxHour to proper types
     */
    Ng2DatetimePickerDirective.prototype.normalizeInput = function () {
        if (this.defaultValue && typeof this.defaultValue === 'string') {
            var d = ng2_datetime_1.Ng2Datetime.parseDate(this.defaultValue);
            this.defaultValue = isNaN(d.getTime()) ? new Date() : d;
        }
        if (this.minDate && typeof this.minDate == 'string') {
            var d = ng2_datetime_1.Ng2Datetime.parseDate(this.minDate);
            this.minDate = isNaN(d.getTime()) ? new Date() : d;
        }
        if (this.maxDate && typeof this.maxDate == 'string') {
            var d = ng2_datetime_1.Ng2Datetime.parseDate(this.minDate);
            this.maxDate = isNaN(d.getTime()) ? new Date() : d;
        }
        if (this.minHour) {
            if (this.minHour instanceof Date) {
                this.minHour = this.minHour.getHours();
            }
            else {
                var hour = Number(this.minHour.toString());
                if (!isInteger(hour) || hour > 23 || hour < 0) {
                    this.minHour = undefined;
                }
            }
        }
        if (this.maxHour) {
            if (this.maxHour instanceof Date) {
                this.maxHour = this.maxHour.getHours();
            }
            else {
                var hour = Number(this.maxHour.toString());
                if (!isInteger(hour) || hour > 23 || hour < 0) {
                    this.maxHour = undefined;
                }
            }
        }
    };
    Ng2DatetimePickerDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (this.parent && this.formControlName) {
            if (this.parent["form"]) {
                this.ctrl = this.parent["form"].get(this.formControlName);
            }
            else if (this.parent["name"]) {
                var formDir = this.parent.formDirective;
                if (formDir instanceof forms_1.FormGroupDirective && formDir.form.get(this.parent["name"])) {
                    this.ctrl = formDir.form.get(this.parent["name"]).get(this.formControlName);
                }
            }
            if (this.ctrl) {
                this.sub = this.ctrl.valueChanges.subscribe(function (date) {
                    _this.setInputElDateValue(date);
                    _this.updateDatepicker();
                });
            }
        }
        this.normalizeInput();
        //wrap this element with a <div> tag, so that we can position dynamic element correctly
        var wrapper = document.createElement("div");
        wrapper.className = 'ng2-datetime-picker-wrapper';
        this.el.parentElement.insertBefore(wrapper, this.el.nextSibling);
        wrapper.appendChild(this.el);
        if (this.ngModel && this.ngModel.getTime) {
            this.ngModel.toString = function () { return ng2_datetime_1.Ng2Datetime.formatDate(_this.ngModel, _this.dateFormat, _this.dateOnly); };
        }
        setTimeout(function () {
            if (_this.el.tagName === 'INPUT') {
                _this.inputElValueChanged(_this.el.value); //set this.el.dateValue and reformat this.el.value
            }
            if (_this.ctrl) {
                _this.ctrl.markAsPristine();
            }
        });
    };
    Ng2DatetimePickerDirective.prototype.ngAfterViewInit = function () {
        // if this element is not an input tag, move dropdown after input tag
        // so that it displays correctly
        this.inputEl = this.el.tagName === "INPUT" ?
            this.el : this.el.querySelector("input");
        if (this.inputEl) {
            this.inputEl.addEventListener('focus', this.showDatetimePicker);
            this.inputEl.addEventListener('blur', this.hideDatetimePicker);
        }
    };
    Ng2DatetimePickerDirective.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var date;
        if (changes && changes['ngModel']) {
            date = changes['ngModel'].currentValue;
            if (date && typeof date !== 'string') {
                date.toString = function () { return ng2_datetime_1.Ng2Datetime.formatDate(date, _this.dateFormat, _this.dateOnly); };
            }
        }
        this.setInputElDateValue(date);
        this.updateDatepicker();
    };
    Ng2DatetimePickerDirective.prototype.updateDatepicker = function () {
        if (this.componentRef) {
            var component = this.componentRef.instance;
            component.defaultValue = this.el['dateValue'];
        }
    };
    Ng2DatetimePickerDirective.prototype.setInputElDateValue = function (date) {
        if (typeof date === 'string' && date) {
            this.el['dateValue'] = this.getDate(date);
        }
        else if (typeof date === 'object') {
            this.el['dateValue'] = date;
        }
        else if (typeof date === 'undefined') {
            this.el['dateValue'] = null;
        }
        if (this.ctrl) {
            this.ctrl.markAsDirty();
        }
    };
    Ng2DatetimePickerDirective.prototype.ngOnDestroy = function () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    };
    Ng2DatetimePickerDirective.prototype.elementIn = function (el, containerEl) {
        while (el = el.parentNode) {
            if (el === containerEl)
                return true;
        }
        return false;
    };
    Ng2DatetimePickerDirective.prototype.styleDatetimePicker = function () {
        var _this = this;
        // setting position, width, and height of auto complete dropdown
        var thisElBCR = this.el.getBoundingClientRect();
        this.ng2DatetimePickerEl.style.width = thisElBCR.width + 'px';
        this.ng2DatetimePickerEl.style.position = 'absolute';
        this.ng2DatetimePickerEl.style.zIndex = '1000';
        this.ng2DatetimePickerEl.style.left = '0';
        this.ng2DatetimePickerEl.style.transition = 'height 0.3s ease-in';
        this.ng2DatetimePickerEl.style.visibility = 'hidden';
        setTimeout(function () {
            var thisElBcr = _this.el.getBoundingClientRect();
            var ng2DatetimePickerElBcr = _this.ng2DatetimePickerEl.getBoundingClientRect();
            if (thisElBcr.bottom + ng2DatetimePickerElBcr.height > window.innerHeight) {
                _this.ng2DatetimePickerEl.style.bottom =
                    (thisElBcr.bottom - window.innerHeight + 15) + 'px';
            }
            else {
                // otherwise, show below
                _this.ng2DatetimePickerEl.style.top = thisElBcr.height + 'px';
            }
            _this.ng2DatetimePickerEl.style.visibility = 'visible';
            _this.changeDetector.detectChanges();
        });
    };
    ;
    Ng2DatetimePickerDirective.prototype.getDate = function (arg) {
        var date = arg;
        if (typeof arg === 'string') {
            date = ng2_datetime_1.Ng2Datetime.parseDate(arg, this.parseFormat, this.dateFormat);
        }
        return date;
    };
    return Ng2DatetimePickerDirective;
}());
__decorate([
    core_1.Input('date-format'),
    __metadata("design:type", String)
], Ng2DatetimePickerDirective.prototype, "dateFormat", void 0);
__decorate([
    core_1.Input('parse-format'),
    __metadata("design:type", String)
], Ng2DatetimePickerDirective.prototype, "parseFormat", void 0);
__decorate([
    core_1.Input('date-only'),
    __metadata("design:type", Boolean)
], Ng2DatetimePickerDirective.prototype, "dateOnly", void 0);
__decorate([
    core_1.Input('time-only'),
    __metadata("design:type", Boolean)
], Ng2DatetimePickerDirective.prototype, "timeOnly", void 0);
__decorate([
    core_1.Input('close-on-select'),
    __metadata("design:type", Boolean)
], Ng2DatetimePickerDirective.prototype, "closeOnSelect", void 0);
__decorate([
    core_1.Input('default-value'),
    __metadata("design:type", Object)
], Ng2DatetimePickerDirective.prototype, "defaultValue", void 0);
__decorate([
    core_1.Input('minute-step'),
    __metadata("design:type", Number)
], Ng2DatetimePickerDirective.prototype, "minuteStep", void 0);
__decorate([
    core_1.Input('min-date'),
    __metadata("design:type", Object)
], Ng2DatetimePickerDirective.prototype, "minDate", void 0);
__decorate([
    core_1.Input('max-date'),
    __metadata("design:type", Object)
], Ng2DatetimePickerDirective.prototype, "maxDate", void 0);
__decorate([
    core_1.Input('min-hour'),
    __metadata("design:type", Object)
], Ng2DatetimePickerDirective.prototype, "minHour", void 0);
__decorate([
    core_1.Input('max-hour'),
    __metadata("design:type", Object)
], Ng2DatetimePickerDirective.prototype, "maxHour", void 0);
__decorate([
    core_1.Input('disabled-dates'),
    __metadata("design:type", Array)
], Ng2DatetimePickerDirective.prototype, "disabledDates", void 0);
__decorate([
    core_1.Input('show-close-layer'),
    __metadata("design:type", Boolean)
], Ng2DatetimePickerDirective.prototype, "showCloseLayer", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], Ng2DatetimePickerDirective.prototype, "formControlName", void 0);
__decorate([
    core_1.Input('ngModel'),
    __metadata("design:type", Object)
], Ng2DatetimePickerDirective.prototype, "ngModel", void 0);
__decorate([
    core_1.Output('ngModelChange'),
    __metadata("design:type", Object)
], Ng2DatetimePickerDirective.prototype, "ngModelChange", void 0);
__decorate([
    core_1.Output('valueChanged'),
    __metadata("design:type", Object)
], Ng2DatetimePickerDirective.prototype, "valueChanged$", void 0);
__decorate([
    core_1.Output('popupClosed'),
    __metadata("design:type", Object)
], Ng2DatetimePickerDirective.prototype, "popupClosed$", void 0);
Ng2DatetimePickerDirective = __decorate([
    core_1.Directive({
        selector: '[ng2-datetime-picker]',
        providers: [ng2_datetime_1.Ng2Datetime]
    }),
    __param(3, core_1.Optional()), __param(3, core_1.Host()), __param(3, core_1.SkipSelf()),
    __metadata("design:paramtypes", [core_1.ComponentFactoryResolver,
        core_1.ViewContainerRef,
        core_1.ChangeDetectorRef,
        forms_1.ControlContainer])
], Ng2DatetimePickerDirective);
exports.Ng2DatetimePickerDirective = Ng2DatetimePickerDirective;
//# sourceMappingURL=ng2-datetime-picker.directive.js.map