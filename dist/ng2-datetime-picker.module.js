"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var ng2_datetime_1 = require("./ng2-datetime");
var ng2_datetime_picker_component_1 = require("./ng2-datetime-picker.component");
var ng2_datetime_picker_directive_1 = require("./ng2-datetime-picker.directive");
var Ng2DatetimePickerModule = (function () {
    function Ng2DatetimePickerModule() {
    }
    return Ng2DatetimePickerModule;
}());
Ng2DatetimePickerModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, forms_1.FormsModule],
        declarations: [ng2_datetime_picker_component_1.Ng2DatetimePickerComponent, ng2_datetime_picker_directive_1.Ng2DatetimePickerDirective],
        exports: [ng2_datetime_picker_component_1.Ng2DatetimePickerComponent, ng2_datetime_picker_directive_1.Ng2DatetimePickerDirective],
        entryComponents: [ng2_datetime_picker_component_1.Ng2DatetimePickerComponent],
        providers: [ng2_datetime_1.Ng2Datetime]
    })
], Ng2DatetimePickerModule);
exports.Ng2DatetimePickerModule = Ng2DatetimePickerModule;
//# sourceMappingURL=ng2-datetime-picker.module.js.map