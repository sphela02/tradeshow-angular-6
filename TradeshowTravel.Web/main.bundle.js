webpackJsonp(["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/add-attendee-popup/add-attendee-popup.component.html":
/***/ (function(module, exports) {

module.exports = "<div [class.loading]=\"isLoading\">\n  <div class=\"modal-header\">\n    <h5 class=\"modal-title w-100\">Add Attendees</h5>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"cancelPopup()\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n  </div>\n  <div class=\"bg-secondary px-3 py-2 text-dark\">\n    To add attendees, please search for the employee, select the correct person in the search results and press 'ADD' to move them to the list below. Add any additional attendees and press 'Submit'.  The 'Attendee Delegate' field allows you to assign another person to fill out the information for the attendee.\n  </div>\n  <div class=\"modal-body\">\n    <div class=\"row pb-3\">\n      <div class=\"col-md-5\">\n        <div class=\"md-form\">\n          <app-person-finder id=\"attendee\"\n            [usePrimitive]=\"false\"\n            (valueChange)=\"onAttendeeChanged($event)\"\n            [(ngModel)]=\"attendee\">\n          </app-person-finder>\n          <label for=\"attendee\" class=\"active\">Attendee</label>\n        </div>\n      </div>\n      <div class=\"col-md-5\">\n        <div class=\"md-form\">\n          <app-person-finder id=\"delegate\"\n            [usePrimitive]=\"false\"\n            [disabled]=\"!attendee\"\n            [(ngModel)]=\"delegate\">\n          </app-person-finder>\n          <label for=\"delegate\" class=\"active\">Attendee Delegate (if applicable)</label>\n        </div>\n      </div>\n      <div class=\"col-md-2\">\n        <button type=\"button\"\n                (click)=\"addAttendee()\"\n                class=\"btn btn-info btn-sm waves-effect waves-light valign-bottom\"\n                [disabled]=\"!attendee\">\n                Add\n        </button>\n      </div>\n    </div>\n    <div class=\"row pb-1 pt-3\">\n      <h6 class=\"col-md-5\">\n        Attendee\n      </h6>\n      <h6 class=\"col-md-5\">\n        Attendee Delegate\n      </h6>\n    </div>\n    <div *ngFor=\"let item of attendees; let i = index\"\n      class=\"row border-top\">\n      <div class=\"col-md-5\">\n        <span class=\"valign-middle\">{{ HelperSvc.getDisplayName(item.Profile) }}</span>\n      </div>\n      <div class=\"col-md-5\">\n        <span class=\"valign-middle\">{{ item.Profile.Delegate?.DisplayName }}</span>\n      </div>\n      <div class=\"col-md-2\">\n        <button type=\"button\"\n                [attr.data-index]=\"i\"\n                (click)=\"removeAttendee($event)\"\n                class=\"btn btn-info btn-sm waves-effect waves-light\">\n                Remove\n        </button>\n      </div>\n    </div>\n    <div class=\"row border-top\">\n      <div class=\"col\">\n        <div class=\"md-form mt-0\">\n          <input type=\"checkbox\" class=\"filled-in\" id=\"sendRSVPRequest\" [(ngModel)]=\"sendRSVP\">\n          <label for=\"sendRSVPRequest\">Send attendees (or their delegates) an RSVP request?</label>\n        </div>\n      </div>\n    </div>\n    <div class=\"alert alert-danger m-0 py-1 mr-3\" role=\"alert\" [hidden]=\"!errorMsg\">\n      <i class=\"fa fa-exclamation-circle fa-lg\" aria-hidden=\"true\"></i>&nbsp; {{errorMsg}}\n    </div>\n  </div>\n  <div class=\"modal-footer justify-content-center\">\n    <button type=\"button\" class=\"btn btn-secondary btn-sm px-3\" (click)=\"cancelPopup()\">Cancel</button>\n    <button type=\"button\" class=\"btn btn-primary btn-sm px-4\" [disabled]=\"!attendee && !attendees.length\" (click)=\"onSubmit()\">Save</button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/add-attendee-popup/add-attendee-popup.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/add-attendee-popup/add-attendee-popup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddAttendeePopupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_service__ = __webpack_require__("./src/app/common.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AddAttendeePopupComponent = /** @class */ (function () {
    function AddAttendeePopupComponent(activeModal, service) {
        this.activeModal = activeModal;
        this.service = service;
        this.saveClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.attendees = [];
        this.HelperSvc = __WEBPACK_IMPORTED_MODULE_2__common_service__["a" /* CommonService */];
        this.isLoading = false;
        this.sendRSVP = true;
    }
    AddAttendeePopupComponent.prototype.ngOnInit = function () {
    };
    AddAttendeePopupComponent.prototype.onAttendeeChanged = function (value) {
        var _this = this;
        if (!value) {
            this.delegate = null;
            return;
        }
        this.service.getUserDelegate(this.attendee.Username)
            .subscribe(function (user) {
            _this.delegate = user;
        }, function (error) {
            _this.delegate = null;
        });
    };
    AddAttendeePopupComponent.prototype.addAttendee = function () {
        var _this = this;
        if (!this.attendee) {
            return;
        }
        // Already exist?
        if (this.attendees.some(function (a) {
            if (_this.attendee.Username == a.Profile.Username) {
                return true;
            }
        })) {
            this.attendee = null;
            this.delegate = null;
            return;
        }
        var item = {
            ID: 0,
            EventID: this.eventID,
            Username: this.attendee.Username,
            SendRSVP: this.sendRSVP,
            Profile: {
                Username: this.attendee.Username,
                FirstName: this.attendee.FirstName,
                LastName: this.attendee.LastName,
                Segment: this.attendee.Segment,
                Email: this.attendee.Email,
                DelegateUsername: (this.delegate) ? this.delegate.Username : null,
                Delegate: this.delegate
            }
        };
        this.attendees.push(item);
        this.attendee = null;
        this.delegate = null;
    };
    AddAttendeePopupComponent.prototype.removeAttendee = function (event) {
        var index = Number(event.currentTarget.dataset.index);
        if (index >= 0 && index < this.attendees.length) {
            this.attendees.splice(index, 1);
        }
    };
    AddAttendeePopupComponent.prototype.cancelPopup = function () {
        this.activeModal.close();
    };
    AddAttendeePopupComponent.prototype.onSubmit = function () {
        var _this = this;
        this.addAttendee();
        if (!this.attendees.length) {
            return;
        }
        this.errorMsg = null;
        this.isLoading = true;
        this.service.saveEventAttendees(this.eventID, this.attendees)
            .subscribe(function (result) {
            _this.errorMsg = null;
            _this.isLoading = false;
            _this.saveClicked.emit();
            _this.activeModal.close();
        }, function (error) {
            _this.errorMsg = error;
            _this.isLoading = false;
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Number)
    ], AddAttendeePopupComponent.prototype, "eventID", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */])
    ], AddAttendeePopupComponent.prototype, "saveClicked", void 0);
    AddAttendeePopupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-add-attendee-popup',
            template: __webpack_require__("./src/app/add-attendee-popup/add-attendee-popup.component.html"),
            styles: [__webpack_require__("./src/app/add-attendee-popup/add-attendee-popup.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */],
            __WEBPACK_IMPORTED_MODULE_3__tradeshow_service__["a" /* TradeshowService */]])
    ], AddAttendeePopupComponent);
    return AddAttendeePopupComponent;
}());



/***/ }),

/***/ "./src/app/alert-popup/alert-popup.component.html":
/***/ (function(module, exports) {

module.exports = "<div>\n  <div class=\"modal-header\">\n    <h5 class=\"modal-title w-100\">{{title}}</h5>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"onSecondary()\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n  </div>\n  <div class=\"modal-body\">\n    {{text}}\n  </div>\n  <div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-secondary btn-sm px-3\" (click)=\"onSecondary()\">\n      {{secondaryText}}\n    </button>\n    <button type=\"button\" class=\"btn btn-primary btn-sm px-4\" (click)=\"onPrimary()\">\n      {{primaryText}}\n    </button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/alert-popup/alert-popup.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/alert-popup/alert-popup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AlertPopupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AlertPopupComponent = /** @class */ (function () {
    function AlertPopupComponent(activeModal) {
        this.activeModal = activeModal;
        this.secondaryText = "CANCEL";
        this.primaryText = "OK";
        this.primaryClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.secondaryClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
    }
    AlertPopupComponent.prototype.ngOnInit = function () {
    };
    AlertPopupComponent.prototype.onSecondary = function () {
        this.secondaryClicked.emit();
        this.activeModal.close();
    };
    AlertPopupComponent.prototype.onPrimary = function () {
        this.primaryClicked.emit();
        this.activeModal.close();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", String)
    ], AlertPopupComponent.prototype, "title", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", String)
    ], AlertPopupComponent.prototype, "text", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", String)
    ], AlertPopupComponent.prototype, "secondaryText", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", String)
    ], AlertPopupComponent.prototype, "primaryText", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */])
    ], AlertPopupComponent.prototype, "primaryClicked", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */])
    ], AlertPopupComponent.prototype, "secondaryClicked", void 0);
    AlertPopupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-alert-popup',
            template: __webpack_require__("./src/app/alert-popup/alert-popup.component.html"),
            styles: [__webpack_require__("./src/app/alert-popup/alert-popup.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]])
    ], AlertPopupComponent);
    return AlertPopupComponent;
}());



/***/ }),

/***/ "./src/app/app-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__event_main_event_main_component__ = __webpack_require__("./src/app/event-main/event-main.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__attendee_main_attendee_main_component__ = __webpack_require__("./src/app/attendee-main/attendee-main.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__settings_settings_component__ = __webpack_require__("./src/app/settings/settings.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_shared__ = __webpack_require__("./src/app/shared/shared.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var routes = [
    { path: 'events', component: __WEBPACK_IMPORTED_MODULE_2__event_main_event_main_component__["a" /* EventMainComponent */], data: [{ eventViewMode: __WEBPACK_IMPORTED_MODULE_5__shared_shared__["e" /* EventViewMode */].List }] },
    { path: 'events/:id', component: __WEBPACK_IMPORTED_MODULE_2__event_main_event_main_component__["a" /* EventMainComponent */], data: [{ eventViewMode: __WEBPACK_IMPORTED_MODULE_5__shared_shared__["e" /* EventViewMode */].Display }] },
    { path: 'attendees', component: __WEBPACK_IMPORTED_MODULE_3__attendee_main_attendee_main_component__["a" /* AttendeeMainComponent */], data: [{ viewMode: __WEBPACK_IMPORTED_MODULE_5__shared_shared__["b" /* AttendeeViewMode */].List }] },
    { path: 'attendees/:id', component: __WEBPACK_IMPORTED_MODULE_3__attendee_main_attendee_main_component__["a" /* AttendeeMainComponent */], data: [{ viewMode: __WEBPACK_IMPORTED_MODULE_5__shared_shared__["b" /* AttendeeViewMode */].Display }] },
    { path: 'settings', component: __WEBPACK_IMPORTED_MODULE_4__settings_settings_component__["a" /* SettingsComponent */] },
    { path: '**', component: __WEBPACK_IMPORTED_MODULE_3__attendee_main_attendee_main_component__["a" /* AttendeeMainComponent */], data: [{ viewMode: __WEBPACK_IMPORTED_MODULE_5__shared_shared__["b" /* AttendeeViewMode */].MyProfile }] }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* NgModule */])({
            imports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* RouterModule */].forRoot(routes)],
            exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* RouterModule */]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<header>\r\n    <div id='sidebar' class=\"side-nav fixed\">\r\n        <div class=\"nav-container\">\r\n            <div class=\"navbar\">\r\n                <span class=\"h5 m-0 pl-3 py-1\">Event Travel Portal</span>\r\n            </div>\r\n            \r\n            <div class=\"user-menu row no-gutters\">\r\n                <div class=\"col-sm-auto px-2 text-center\">\r\n                    <img src=\"https://my.harris.com/PeopleFinder/employeePics/{{userProfile?.EmplID}}.jpg\" \r\n                         class=\"avatar img-fluid rounded-circle z-depth-0\"\r\n                         (error)=\"imgErrHandler($event)\"\r\n                         [hidden]=\"!showProfileAvatar\">\r\n                    <i class=\"fa fa-user-circle avatar\" [hidden]=\"showProfileAvatar\" aria-hidden=\"true\"></i>\r\n                </div>\r\n                <div class=\"col-sm\" *ngIf=\"userProfile\">\r\n                    <span class=\"d-block mt-2\">{{userProfile.FirstName}}&nbsp;{{userProfile.LastName}}</span>\r\n                    <a class=\"d-block p-0 font-weight-bold\" [routerLink]=\"['attendees', userProfile.Username.toLowerCase()]\">\r\n                        View Profile\r\n                    </a>\r\n                </div>\r\n            </div>\r\n            \r\n            <ul class=\"nav flex-column\">\r\n                <li class=\"nav-item border-top border-light\" aria-expanded=\"true\" [class.active]=\"activeMenu==SideMenuMode.Events\"\r\n                    *ngIf=\"showEventsMenu\">\r\n                    <a class=\"nav-link\" [routerLink]=\"'/events'\">\r\n                        <i class=\"fa fa-clock-o fa-lg\"></i> Events\r\n                    </a>\r\n                    <ul class=\"nav flex-column\"\r\n                        [class.d-none]=\"activeMenu != SideMenuMode.Events || !activeChildmenu\">\r\n                        <li class=\"nav-item border-top border-light\">\r\n                            <a class=\"nav-link ml-4\">{{activeChildmenu}}</a>\r\n                        </li>\r\n                    </ul>\r\n                </li>\r\n                <li class=\"nav-item border-top border-light\" aria-expanded=\"true\" [class.active]=\"activeMenu==SideMenuMode.Attendees\">\r\n                    <a class=\"nav-link\" [routerLink]=\"['attendees']\">\r\n                        <i class=\"fa fa-users\"></i> Contact Directory\r\n                    </a>\r\n                    <ul class=\"nav flex-column\"\r\n                        [class.d-none]=\"activeMenu != SideMenuMode.Attendees || !activeChildmenu\">\r\n                        <li class=\"nav-item border-top border-light\">\r\n                            <a class=\"nav-link ml-4\">{{activeChildmenu}}</a>\r\n                        </li>\r\n                    </ul>\r\n                </li>\r\n                <li class=\"nav-item border-top border-light\" aria-expanded=\"true\" [class.active]=\"activeMenu==SideMenuMode.Settings\"\r\n                    *ngIf=\"showAdminMenu\">\r\n                    <a class=\"nav-link\" [routerLink]=\"'/settings'\">\r\n                        <i class=\"fa fa-wrench\"></i> Administrative Settings\r\n                    </a>\r\n                    <ul class=\"nav flex-column\"\r\n                        [class.d-none]=\"activeMenu != SideMenuMode.Settings || !activeChildmenu\">\r\n                        <li class=\"nav-item border-top border-light\">\r\n                            <a class=\"nav-link ml-4\">{{activeChildmenu}}</a>\r\n                        </li>\r\n                    </ul>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n        <div class=\"harris-logo-wrapper\">\r\n            <img src=\"assets/harris-logo.png\" class=\"img-fluid flex-center\">\r\n        </div>\r\n    </div>\r\n    <nav class=\"navbar navbar-toggleable-md navbar-expand-lg fixed-top double-nav\">\r\n        <div class=\"float-left\">\r\n            <a href=\"#\" id=\"sidebarCollapse\" data-activates=\"sidebar\" class=\"button-collapse\">\r\n                <i class=\"fa fa-bars\"></i>\r\n            </a>\r\n        </div>\r\n        <span [ngSwitch]=\"activeMenu\" class=\"h5 m-0 pl-3 py-1\">\r\n            <a *ngSwitchCase=\"SideMenuMode.Events\" [routerLink]=\"['events']\" style=\"font-size: inherit;color:white\">Events</a>\r\n            <a *ngSwitchCase=\"SideMenuMode.Settings\" [routerLink]=\"['settings']\" style=\"font-size: inherit;color:white\">Administrative Settings</a>\r\n            <a *ngSwitchDefault [routerLink]=\"['attendees']\" style=\"font-size: inherit;color:white\">Contact Directory</a>\r\n            <span *ngIf=\"activeChildmenu\">&gt;</span>\r\n            <span *ngIf=\"activeChildmenu\">{{activeChildmenu}}</span>\r\n        </span>\r\n        <ul class=\"navbar-nav ml-auto nav-flex-icons\">\r\n            <!--li class=\"nav-item dropdown\">\r\n                <a class=\"nav-link waves-effect waves-light\" id=\"app-alerts\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\r\n                    <i class=\"fa fa-lg fa-bell-o mx-0 text-white\"></i>\r\n                    <span class=\"badge badge-secondary badge-pill\">1</span>\r\n                </a>\r\n                <div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"alerts\">\r\n                    <a class=\"dropdown-item waves-effect waves-light\" href=\"#\">Action</a>\r\n                    <div class=\"dropdown-divider m-0\"></div>\r\n                    <a class=\"dropdown-item waves-effect waves-light\" href=\"#\">Another action</a>\r\n                    <div class=\"dropdown-divider m-0\"></div>\r\n                    <a class=\"dropdown-item waves-effect waves-light\" href=\"#\">Something else here</a>\r\n                </div>\r\n            </li-->\r\n        </ul>\r\n    </nav>\r\n</header>\r\n<main class=\"m-0 pt-0\">\r\n    <div class=\"wrapper\">\r\n        <div id=\"content\" class=\"container-fluid p-0\">\r\n            <router-outlet></router-outlet>\r\n        </div>\r\n    </div>\r\n</main>"

/***/ }),

/***/ "./src/app/app.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_filter__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_mergeMap__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/mergeMap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pagetitle_service__ = __webpack_require__("./src/app/pagetitle.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shared_shared__ = __webpack_require__("./src/app/shared/shared.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var AppComponent = /** @class */ (function () {
    function AppComponent(_service, _pageTitleService) {
        this._service = _service;
        this._pageTitleService = _pageTitleService;
        this.Role = __WEBPACK_IMPORTED_MODULE_7__shared_Enums__["d" /* Role */];
        this.SideMenuMode = __WEBPACK_IMPORTED_MODULE_6__shared_shared__["f" /* SideMenuMode */];
        this.showProfileAvatar = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.reloadProfile();
        this.pageTitleSubscription = this._pageTitleService
            .message.subscribe(function (menuItem) {
            if (menuItem) {
                _this.activeChildmenu = menuItem.childMenu;
                _this.activeMenu = menuItem.mainMenu;
                if (_this.activeMenu == __WEBPACK_IMPORTED_MODULE_6__shared_shared__["f" /* SideMenuMode */].Profile) {
                    _this.reloadProfile();
                }
            }
        });
        this.appLoadingSubscription = this._pageTitleService
            .loading.subscribe(function (isLoading) {
            if (isLoading) {
                $('body').addClass('loading');
            }
            else {
                $('body.loading').removeClass('loading');
            }
        });
        setTimeout(function () {
            $("#sidebarCollapse").sideNav();
        }, 0);
    };
    AppComponent.prototype.reloadProfile = function () {
        var _this = this;
        this._service.getMyProfile()
            .subscribe(function (profile) {
            _this.userProfile = profile;
            _this.showProfileAvatar = profile.ShowPicture;
            _this.showAdminMenu = profile.Privileges == __WEBPACK_IMPORTED_MODULE_7__shared_Enums__["c" /* Permissions */].Admin;
            _this.showEventsMenu = profile.Privileges != __WEBPACK_IMPORTED_MODULE_7__shared_Enums__["c" /* Permissions */].None || (profile.Role != __WEBPACK_IMPORTED_MODULE_7__shared_Enums__["d" /* Role */].None && profile.Role != __WEBPACK_IMPORTED_MODULE_7__shared_Enums__["d" /* Role */].Attendee);
        });
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this.pageTitleSubscription.unsubscribe();
        this.appLoadingSubscription.unsubscribe();
    };
    AppComponent.prototype.imgErrHandler = function (event) {
        this.showProfileAvatar = false;
    };
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'tt-root',
            template: __webpack_require__("./src/app/app.component.html"),
            styles: [__webpack_require__("./src/app/app.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__tradeshow_service__["a" /* TradeshowService */],
            __WEBPACK_IMPORTED_MODULE_5__pagetitle_service__["a" /* PageTitleService */]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__("./src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__common_service__ = __webpack_require__("./src/app/common.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pagetitle_service__ = __webpack_require__("./src/app/pagetitle.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__settings_settings_component__ = __webpack_require__("./src/app/settings/settings.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__app_routing_module__ = __webpack_require__("./src/app/app-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__profile_edit_popup_profile_edit_popup_component__ = __webpack_require__("./src/app/profile-edit-popup/profile-edit-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__event_list_event_list_component__ = __webpack_require__("./src/app/event-list/event-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__event_main_event_main_component__ = __webpack_require__("./src/app/event-main/event-main.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__angular_platform_browser_animations__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__progress_kendo_angular_grid__ = __webpack_require__("./node_modules/@progress/kendo-angular-grid/dist/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__progress_kendo_angular_dropdowns__ = __webpack_require__("./node_modules/@progress/kendo-angular-dropdowns/dist/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__progress_kendo_angular_inputs__ = __webpack_require__("./node_modules/@progress/kendo-angular-inputs/dist/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__progress_kendo_angular_dateinputs__ = __webpack_require__("./node_modules/@progress/kendo-angular-dateinputs/dist/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__event_edit_popup_event_edit_popup_component__ = __webpack_require__("./src/app/event-edit-popup/event-edit-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__event_view_event_view_component__ = __webpack_require__("./src/app/event-view/event-view.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__shared_pipes_keys_pipe__ = __webpack_require__("./src/app/shared/pipes/keys.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__shared_pipes_replace_pipe__ = __webpack_require__("./src/app/shared/pipes/replace.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__shared_pipes_attendee_fields_filter_pipe__ = __webpack_require__("./src/app/shared/pipes/attendee-fields-filter.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__shared_pipes_organizer_fields_filter_pipe__ = __webpack_require__("./src/app/shared/pipes/organizer-fields-filter.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__shared_pipes_event_user_filter_pipe__ = __webpack_require__("./src/app/shared/pipes/event-user-filter.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__person_finder_person_finder_component__ = __webpack_require__("./src/app/person-finder/person-finder.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__event_delete_popup_event_delete_popup_component__ = __webpack_require__("./src/app/event-delete-popup/event-delete-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__shared_grid_seg_filter_component__ = __webpack_require__("./src/app/shared/grid-seg-filter.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__shared_grid_rsvp_filter_component__ = __webpack_require__("./src/app/shared/grid-rsvp-filter.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__event_users_popup_event_users_popup_component__ = __webpack_require__("./src/app/event-users-popup/event-users-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__event_field_popup_event_field_popup_component__ = __webpack_require__("./src/app/event-field-popup/event-field-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__alert_popup_alert_popup_component__ = __webpack_require__("./src/app/alert-popup/alert-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__add_attendee_popup_add_attendee_popup_component__ = __webpack_require__("./src/app/add-attendee-popup/add-attendee-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__profile_info_profile_info_component__ = __webpack_require__("./src/app/profile-info/profile-info.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__attendee_fields_popup_attendee_fields_popup_component__ = __webpack_require__("./src/app/attendee-fields-popup/attendee-fields-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__attendee_fields_attendee_fields_component__ = __webpack_require__("./src/app/attendee-fields/attendee-fields.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__attendee_delete_popup_attendee_delete_popup_component__ = __webpack_require__("./src/app/attendee-delete-popup/attendee-delete-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__send_rsvp_popup_send_rsvp_popup_component__ = __webpack_require__("./src/app/send-rsvp-popup/send-rsvp-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__send_reminder_popup_send_reminder_popup_component__ = __webpack_require__("./src/app/send-reminder-popup/send-reminder-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__attendee_view_attendee_view_component__ = __webpack_require__("./src/app/attendee-view/attendee-view.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__attendee_main_attendee_main_component__ = __webpack_require__("./src/app/attendee-main/attendee-main.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__attendee_list_attendee_list_component__ = __webpack_require__("./src/app/attendee-list/attendee-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__attendee_rsvp_popup_attendee_rsvp_popup_component__ = __webpack_require__("./src/app/attendee-rsvp-popup/attendee-rsvp-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__event_info_event_info_component__ = __webpack_require__("./src/app/event-info/event-info.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__privileged_users_list_privileged_users_list_component__ = __webpack_require__("./src/app/privileged-users-list/privileged-users-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__privileged_users_popup_privileged_users_popup_component__ = __webpack_require__("./src/app/privileged-users-popup/privileged-users-popup.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















































var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["J" /* NgModule */])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_10__app_routing_module__["a" /* AppRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["c" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["g" /* ReactiveFormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_14__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_15__progress_kendo_angular_grid__["c" /* GridModule */],
                __WEBPACK_IMPORTED_MODULE_16__progress_kendo_angular_dropdowns__["d" /* DropDownsModule */],
                __WEBPACK_IMPORTED_MODULE_17__progress_kendo_angular_inputs__["a" /* InputsModule */],
                __WEBPACK_IMPORTED_MODULE_18__progress_kendo_angular_dateinputs__["a" /* DateInputsModule */],
                __WEBPACK_IMPORTED_MODULE_4__ng_bootstrap_ng_bootstrap__["c" /* NgbModule */].forRoot()
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__common_service__["a" /* CommonService */],
                __WEBPACK_IMPORTED_MODULE_7__tradeshow_service__["a" /* TradeshowService */],
                __WEBPACK_IMPORTED_MODULE_8__pagetitle_service__["a" /* PageTitleService */]
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_9__settings_settings_component__["a" /* SettingsComponent */],
                __WEBPACK_IMPORTED_MODULE_11__profile_edit_popup_profile_edit_popup_component__["a" /* ProfileEditPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_12__event_list_event_list_component__["a" /* EventListComponent */],
                __WEBPACK_IMPORTED_MODULE_13__event_main_event_main_component__["a" /* EventMainComponent */],
                __WEBPACK_IMPORTED_MODULE_19__event_edit_popup_event_edit_popup_component__["a" /* EventEditPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_20__event_view_event_view_component__["a" /* EventViewComponent */],
                __WEBPACK_IMPORTED_MODULE_21__shared_pipes_keys_pipe__["a" /* KeysPipe */],
                __WEBPACK_IMPORTED_MODULE_22__shared_pipes_replace_pipe__["a" /* ReplacePipe */],
                __WEBPACK_IMPORTED_MODULE_26__person_finder_person_finder_component__["a" /* PersonFinderComponent */],
                __WEBPACK_IMPORTED_MODULE_27__event_delete_popup_event_delete_popup_component__["a" /* EventDeletePopupComponent */],
                __WEBPACK_IMPORTED_MODULE_28__shared_grid_seg_filter_component__["a" /* GridSegFilterComponent */],
                __WEBPACK_IMPORTED_MODULE_30__event_users_popup_event_users_popup_component__["a" /* EventUsersPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_31__event_field_popup_event_field_popup_component__["a" /* EventFieldPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_23__shared_pipes_attendee_fields_filter_pipe__["a" /* AttendeeFieldsFilterPipe */],
                __WEBPACK_IMPORTED_MODULE_24__shared_pipes_organizer_fields_filter_pipe__["a" /* OrganizerFieldsFilterPipe */],
                __WEBPACK_IMPORTED_MODULE_32__alert_popup_alert_popup_component__["a" /* AlertPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_33__add_attendee_popup_add_attendee_popup_component__["a" /* AddAttendeePopupComponent */],
                __WEBPACK_IMPORTED_MODULE_25__shared_pipes_event_user_filter_pipe__["a" /* EventUserFilterPipe */],
                __WEBPACK_IMPORTED_MODULE_34__profile_info_profile_info_component__["a" /* ProfileInfoComponent */],
                __WEBPACK_IMPORTED_MODULE_35__attendee_fields_popup_attendee_fields_popup_component__["a" /* AttendeeFieldsPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_36__attendee_fields_attendee_fields_component__["a" /* AttendeeFieldsComponent */],
                __WEBPACK_IMPORTED_MODULE_37__attendee_delete_popup_attendee_delete_popup_component__["a" /* AttendeeDeletePopupComponent */],
                __WEBPACK_IMPORTED_MODULE_38__send_rsvp_popup_send_rsvp_popup_component__["a" /* SendRsvpPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_39__send_reminder_popup_send_reminder_popup_component__["a" /* SendReminderPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_29__shared_grid_rsvp_filter_component__["a" /* GridRsvpFilterComponent */],
                __WEBPACK_IMPORTED_MODULE_40__attendee_view_attendee_view_component__["a" /* AttendeeViewComponent */],
                __WEBPACK_IMPORTED_MODULE_41__attendee_main_attendee_main_component__["a" /* AttendeeMainComponent */],
                __WEBPACK_IMPORTED_MODULE_42__attendee_list_attendee_list_component__["a" /* AttendeeListComponent */],
                __WEBPACK_IMPORTED_MODULE_43__attendee_rsvp_popup_attendee_rsvp_popup_component__["a" /* AttendeeRsvpPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_44__event_info_event_info_component__["a" /* EventInfoComponent */],
                __WEBPACK_IMPORTED_MODULE_45__privileged_users_list_privileged_users_list_component__["a" /* PrivilegedUsersListComponent */],
                __WEBPACK_IMPORTED_MODULE_46__privileged_users_popup_privileged_users_popup_component__["a" /* PrivilegedUsersPopupComponent */]
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_11__profile_edit_popup_profile_edit_popup_component__["a" /* ProfileEditPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_19__event_edit_popup_event_edit_popup_component__["a" /* EventEditPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_27__event_delete_popup_event_delete_popup_component__["a" /* EventDeletePopupComponent */],
                __WEBPACK_IMPORTED_MODULE_30__event_users_popup_event_users_popup_component__["a" /* EventUsersPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_31__event_field_popup_event_field_popup_component__["a" /* EventFieldPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_33__add_attendee_popup_add_attendee_popup_component__["a" /* AddAttendeePopupComponent */],
                __WEBPACK_IMPORTED_MODULE_35__attendee_fields_popup_attendee_fields_popup_component__["a" /* AttendeeFieldsPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_37__attendee_delete_popup_attendee_delete_popup_component__["a" /* AttendeeDeletePopupComponent */],
                __WEBPACK_IMPORTED_MODULE_38__send_rsvp_popup_send_rsvp_popup_component__["a" /* SendRsvpPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_39__send_reminder_popup_send_reminder_popup_component__["a" /* SendReminderPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_43__attendee_rsvp_popup_attendee_rsvp_popup_component__["a" /* AttendeeRsvpPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_46__privileged_users_popup_privileged_users_popup_component__["a" /* PrivilegedUsersPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_32__alert_popup_alert_popup_component__["a" /* AlertPopupComponent */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/attendee-delete-popup/attendee-delete-popup.component.html":
/***/ (function(module, exports) {

module.exports = "<div [class.loading]=\"loading\">\n  <div class=\"modal-header\">\n    <h5 class=\"modal-title w-100\">Are you sure?</h5>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"cancelPopup()\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n  </div>\n  <div class=\"bg-secondary px-3 py-2 text-dark\">\n    You are about to remove the user(s) below from the 'Attendee' list.  If the person has already RSVP'd, they will be removed from the list and notified via email.  If the user has not RSVP'd, no email will be sent.\n  </div>\n  <div class=\"modal-body\">\n    <div class=\"row\" style=\"max-height: 150px; overflow-y: scroll\">\n      <div class=\"col-md-auto\">\n        <ng-template ngFor let-name let-i=\"index\" [ngForOf]=\"names\">\n          <div *ngIf=\"i < (names.length / 2)\">\n            <span class=\"font-weight-bold\">{{name}}</span>\n          </div>\n        </ng-template>\n      </div>\n      <div class=\"col-md-auto\">\n        <ng-template ngFor let-name let-i=\"index\" [ngForOf]=\"names\">\n          <div *ngIf=\"i >= (names.length / 2)\">\n            <span class=\"font-weight-bold\">{{name}}</span>\n          </div>\n        </ng-template>\n      </div>\n    </div>\n    <div class=\"alert alert-danger m-0 py-1 mr-3\" role=\"alert\" [hidden]=\"!errorMsg\">\n      <i class=\"fa fa-exclamation-circle fa-lg\" aria-hidden=\"true\"></i>&nbsp; {{errorMsg}}\n    </div>\n  </div>\n  <div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-secondary btn-sm px-3\" (click)=\"cancelPopup()\">Cancel</button>\n    <button type=\"button\" class=\"btn btn-primary btn-sm px-3\" (click)=\"onSubmit()\">Remove</button>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/attendee-delete-popup/attendee-delete-popup.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/attendee-delete-popup/attendee-delete-popup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendeeDeletePopupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AttendeeDeletePopupComponent = /** @class */ (function () {
    function AttendeeDeletePopupComponent(service, activeModal) {
        this.service = service;
        this.activeModal = activeModal;
        this.removedClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
    }
    AttendeeDeletePopupComponent.prototype.ngOnInit = function () {
    };
    AttendeeDeletePopupComponent.prototype.cancelPopup = function () {
        this.activeModal.close();
    };
    AttendeeDeletePopupComponent.prototype.onSubmit = function () {
        var _this = this;
        var ids = [];
        Object.keys(this.attendees).forEach(function (k) {
            ids.push(Number(k));
        });
        this.service.deleteEventAttendees(this.eventID, ids)
            .subscribe(function (result) {
            _this.removedClicked.emit();
            _this.activeModal.close();
        }, function (error) {
            _this.errorMsg = error;
        });
    };
    AttendeeDeletePopupComponent.prototype.onInputsChanged = function () {
        var _this = this;
        if (this.attendees) {
            this._names = [];
            Object.keys(this.attendees).forEach(function (k) {
                var attendee = _this.attendees[Number(k)];
                var name = attendee.Profile.FirstName + " " +
                    attendee.Profile.LastName + " (" +
                    attendee.Username + ")";
                _this._names.push(name);
            });
            this._names.sort();
        }
    };
    Object.defineProperty(AttendeeDeletePopupComponent.prototype, "eventID", {
        get: function () {
            return this._eventID;
        },
        set: function (id) {
            this._eventID = id;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttendeeDeletePopupComponent.prototype, "attendees", {
        get: function () {
            return this._attendees;
        },
        set: function (attendees) {
            this._attendees = attendees;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttendeeDeletePopupComponent.prototype, "names", {
        get: function () {
            return this._names;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttendeeDeletePopupComponent.prototype, "loading", {
        get: function () {
            return this._loading;
        },
        set: function (loading) {
            this._loading = loading;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", Object)
    ], AttendeeDeletePopupComponent.prototype, "removedClicked", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], AttendeeDeletePopupComponent.prototype, "eventID", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], AttendeeDeletePopupComponent.prototype, "attendees", null);
    AttendeeDeletePopupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-attendee-delete-popup',
            template: __webpack_require__("./src/app/attendee-delete-popup/attendee-delete-popup.component.html"),
            styles: [__webpack_require__("./src/app/attendee-delete-popup/attendee-delete-popup.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__tradeshow_service__["a" /* TradeshowService */],
            __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]])
    ], AttendeeDeletePopupComponent);
    return AttendeeDeletePopupComponent;
}());



/***/ }),

/***/ "./src/app/attendee-fields-popup/attendee-fields-popup.component.html":
/***/ (function(module, exports) {

module.exports = "<div [class.loading]=\"isLoading\">\n  <div class=\"modal-header\">\n    <h5 class=\"modal-title w-100\">{{title}}</h5>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"cancelPopup()\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n  </div>\n  <div class=\"bg-secondary px-3 py-2 text-dark\" *ngIf=\"showRequired\">\n    The fields with a (<span class=\"text-danger\">*</span>) are required by <span class=\"font-weight-bold\">{{event.DataDueDate | date: 'MMM d, yyyy'}}</span>.\n  </div>\n  <div class=\"bg-secondary px-3 py-2 text-dark\" *ngIf=\"!showRequired\">\n    Only event organizers can see the fields below. Edit these fields in the \"Required Attendee Details\" tab.\n  </div>\n  <div class=\"modal-body\">\n    <div class=\"row\">\n      <div class=\"col-md\">\n        <ng-template ngFor let-field [ngForOf]=\"fields\" let-i=\"index\">\n          <div class=\"md-form\" *ngIf=\"i < (fields.length / 2)\">\n            <label for=\"f{{field.ID}}\" class=\"active\">\n              {{field.Label}} \n              <span [hidden]=\"!field.Tooltip\" class=\"fa fa-question-circle\" aria-hidden=\"true\" title=\"{{field.Tooltip}}\"></span> \n              <span [hidden]=\"!field.Required\" class=\"text-danger\">*</span>\n            </label>\n            <kendo-datepicker *ngIf=\"field.Input == InputType.Date\"\n              id=\"f{{field.ID}}\" name=\"f{{field.ID}}\"\n              [(ngModel)]=\"values[field.ID]\"\n              [max]=\"maxvalues[field.ID]\"\n              [min]=\"minvalues[field.ID]\"\n              placeholder=\" \"\n              style=\"width: 100%;\">\n            </kendo-datepicker>\n            <input type=\"text\" *ngIf=\"field.Input == InputType.ShortText\"\n              id=\"f{{field.ID}}\" name=\"f{{field.ID}}\" class=\"form-control\"\n              [(ngModel)]=\"values[field.ID]\">\n            <textarea rows=\"3\" *ngIf=\"field.Input == InputType.LongText\"\n              id=\"f{{field.ID}}\" name=\"f{{field.ID}}\" \n              class=\"form-control md-textarea py-1\"\n              [(ngModel)]=\"values[field.ID]\">\n            </textarea>\n            <kendo-dropdownlist *ngIf=\"field.Input == InputType.YesOrNo\"\n              id=\"f{{field.ID}}\" name=\"f{{field.ID}}\" \n              [data]=\"'|Yes|No'.split('|')\"\n              [(ngModel)]=\"values[field.ID]\"\n              style=\"width: 100%\">\n            </kendo-dropdownlist>\n            <kendo-dropdownlist *ngIf=\"field.Input == InputType.Select\"\n              id=\"f{{field.ID}}\" name=\"f{{field.ID}}\" \n              [data]=\"field.Options.split('|')\"\n              [(ngModel)]=\"values[field.ID]\"\n              style=\"width: 100%\">\n            </kendo-dropdownlist>\n            <kendo-multiselect *ngIf=\"field.Input == InputType.MultiSelect\"\n              id=\"f{{field.ID}}\" name=\"f{{field.ID}}\" \n              [data]=\"field.Options.split('|')\"\n              [(ngModel)]=\"values[field.ID]\">\n            </kendo-multiselect>\n          </div>\n        </ng-template>\n      </div>\n      <div class=\"col-md\">\n        <ng-template ngFor let-field [ngForOf]=\"fields\" let-i=\"index\">\n          <div class=\"md-form\" *ngIf=\"i >= (fields.length / 2)\">\n            <label for=\"f{{field.ID}}\" class=\"active\">\n              {{field.Label}} \n              <span [hidden]=\"!field.Tooltip\" class=\"fa fa-question-circle\" aria-hidden=\"true\" title=\"{{field.Tooltip}}\"></span> \n              <span [hidden]=\"!field.Required\" class=\"text-danger\">*</span>\n            </label>\n            <kendo-datepicker *ngIf=\"field.Input == InputType.Date\"\n              id=\"f{{field.ID}}\" name=\"f{{field.ID}}\"\n              [(ngModel)]=\"values[field.ID]\"\n              [max]=\"maxvalues[field.ID]\"\n              [min]=\"minvalues[field.ID]\"\n              placeholder=\" \"\n              style=\"width: 100%;\">\n            </kendo-datepicker>\n            <input type=\"text\" *ngIf=\"field.Input == InputType.ShortText\"\n              id=\"f{{field.ID}}\" name=\"f{{field.ID}}\" class=\"form-control\"\n              [(ngModel)]=\"values[field.ID]\">\n            <textarea rows=\"3\" *ngIf=\"field.Input == InputType.LongText\"\n              id=\"f{{field.ID}}\" name=\"f{{field.ID}}\" \n              class=\"form-control md-textarea py-1\"\n              [(ngModel)]=\"values[field.ID]\">\n            </textarea>\n            <kendo-dropdownlist *ngIf=\"field.Input == InputType.YesOrNo\"\n              id=\"f{{field.ID}}\" name=\"f{{field.ID}}\" \n              [data]=\"'|Yes|No'.split('|')\"\n              [(ngModel)]=\"values[field.ID]\"\n              style=\"width: 100%\">\n            </kendo-dropdownlist>\n            <kendo-dropdownlist *ngIf=\"field.Input == InputType.Select\"\n              id=\"f{{field.ID}}\" name=\"f{{field.ID}}\" \n              [data]=\"field.Options.split('|')\"\n              [(ngModel)]=\"values[field.ID]\"\n              style=\"width: 100%\">\n            </kendo-dropdownlist>\n            <kendo-multiselect *ngIf=\"field.Input == InputType.MultiSelect\"\n              id=\"f{{field.ID}}\" name=\"f{{field.ID}}\" \n              [data]=\"field.Options.split('|')\"\n              [(ngModel)]=\"values[field.ID]\">\n            </kendo-multiselect>\n          </div>\n        </ng-template>\n      </div>\n    </div>\n    <div class=\"alert alert-danger m-0 py-1 mr-3\" role=\"alert\" [hidden]=\"!errorMsg\">\n      <i class=\"fa fa-exclamation-circle fa-lg\" aria-hidden=\"true\"></i>&nbsp; {{errorMsg}}\n    </div>\n  </div>\n  <div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-secondary btn-sm px-3\" (click)=\"cancelPopup()\">Cancel</button>\n    <button type=\"button\" class=\"btn btn-primary btn-sm px-4\" (click)=\"onSubmit()\">Save</button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/attendee-fields-popup/attendee-fields-popup.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/attendee-fields-popup/attendee-fields-popup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendeeFieldsPopupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_service__ = __webpack_require__("./src/app/common.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AttendeeFieldsPopupComponent = /** @class */ (function () {
    function AttendeeFieldsPopupComponent(service, activeModal) {
        this.service = service;
        this.activeModal = activeModal;
        this.saveClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.InputType = __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */];
        this._filter = __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].None;
        this.maxvalues = {};
        this.minvalues = {};
        this.values = {};
        this.showRequired = false;
        this.isLoading = false;
    }
    AttendeeFieldsPopupComponent.prototype.ngOnInit = function () {
    };
    AttendeeFieldsPopupComponent.prototype.onInputsChanged = function () {
        var _this = this;
        if (this.event && this.event.Fields && this.filter) {
            this._fields = this.event.Fields.filter(function (f) { return _this.filter == f.Access && f.Included; });
        }
        else {
            this._fields = (this.event) ? this.event.Fields.filter(function (f) { return f.Included; }) : null;
        }
        // Load initial values
        if (this.fields && this.attendee) {
            this.fields.forEach(function (f) {
                _this.showRequired = f.Required ? true : _this.showRequired;
                switch (f.Input) {
                    case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].LongText:
                    case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].ShortText:
                    case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].Select:
                        if (f.Source) {
                            _this.values[f.ID] = _this.attendee[f.Source];
                        }
                        else {
                            _this.values[f.ID] = _this.attendee.Properties[f.ID];
                        }
                        break;
                    case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].Date:
                        var dt = null;
                        if (f.Source && _this.attendee[f.Source]) {
                            dt = new Date(_this.attendee[f.Source]);
                        }
                        else if (!f.Source && _this.attendee.Properties[f.ID]) {
                            dt = new Date(_this.attendee.Properties[f.ID]);
                        }
                        if (f.Source == "Arrival") {
                            _this.maxvalues[f.ID] = new Date(_this.event.EndDate);
                        }
                        if (f.Source == "Departure") {
                            _this.minvalues[f.ID] = new Date(_this.event.StartDate);
                        }
                        _this.values[f.ID] = dt;
                        break;
                    case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].YesOrNo:
                        if (f.Source) {
                            _this.values[f.ID] = __WEBPACK_IMPORTED_MODULE_4__common_service__["a" /* CommonService */].getYesOrNoText(_this.attendee[f.Source]);
                        }
                        else {
                            _this.values[f.ID] = __WEBPACK_IMPORTED_MODULE_4__common_service__["a" /* CommonService */].getYesOrNoText(_this.attendee.Properties[f.ID]);
                        }
                        break;
                    case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].MultiSelect:
                        var list = [];
                        if (f.Source && _this.attendee[f.Source]) {
                            list = _this.attendee[f.Source].split('|');
                        }
                        else if (!f.Source && _this.attendee.Properties[f.ID]) {
                            list = _this.attendee.Properties[f.ID].split('|');
                        }
                        _this.values[f.ID] = list;
                        break;
                }
            });
        }
    };
    Object.defineProperty(AttendeeFieldsPopupComponent.prototype, "attendee", {
        get: function () {
            return this._attendee;
        },
        set: function (attendee) {
            this._attendee = attendee;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttendeeFieldsPopupComponent.prototype, "filter", {
        get: function () {
            return this._filter;
        },
        set: function (role) {
            this._filter = role;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttendeeFieldsPopupComponent.prototype, "event", {
        get: function () {
            return this._event;
        },
        set: function (event) {
            this._event = event;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttendeeFieldsPopupComponent.prototype, "fields", {
        get: function () {
            return this._fields;
        },
        enumerable: true,
        configurable: true
    });
    AttendeeFieldsPopupComponent.prototype.cancelPopup = function () {
        this.activeModal.close();
    };
    AttendeeFieldsPopupComponent.prototype.onSubmit = function () {
        var _this = this;
        if (!this.attendee || !this.fields) {
            return;
        }
        var attendee = Object.assign({}, this.attendee);
        this.fields.forEach(function (f) {
            var value = null;
            if (f.Input == __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].MultiSelect) {
                if (_this.values[f.ID]) {
                    value = _this.values[f.ID].join('|');
                }
            }
            else {
                value = _this.values[f.ID];
            }
            if (f.Source) {
                attendee[f.Source] = value;
            }
            else {
                attendee.Properties[f.ID] = (value) ? value : "";
            }
        });
        this.errorMsg = null;
        this.isLoading = true;
        this.service.saveAttendee(this.event.ID, attendee)
            .subscribe(function (attendee) {
            _this.isLoading = false;
            _this.saveClicked.emit(attendee);
        }, function (error) {
            _this.isLoading = false;
            _this.errorMsg = error;
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */])
    ], AttendeeFieldsPopupComponent.prototype, "saveClicked", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", String)
    ], AttendeeFieldsPopupComponent.prototype, "title", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], AttendeeFieldsPopupComponent.prototype, "attendee", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], AttendeeFieldsPopupComponent.prototype, "filter", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], AttendeeFieldsPopupComponent.prototype, "event", null);
    AttendeeFieldsPopupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-attendee-fields-popup',
            template: __webpack_require__("./src/app/attendee-fields-popup/attendee-fields-popup.component.html"),
            styles: [__webpack_require__("./src/app/attendee-fields-popup/attendee-fields-popup.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__tradeshow_service__["a" /* TradeshowService */],
            __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]])
    ], AttendeeFieldsPopupComponent);
    return AttendeeFieldsPopupComponent;
}());



/***/ }),

/***/ "./src/app/attendee-fields/attendee-fields.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"card p-3\">\n  <div class=\"row\">\n    <div class=\"col-md-auto\">\n      <div class=\"h6\">{{title}}</div>\n    </div>\n    <div class=\"col-md\">\n      <span class=\"badge badge-pill px-3\" \n        [class.badge-success]=\"completionText=='COMPLETE'\"\n        [class.badge-danger]=\"completionText=='INCOMPLETE'\"\n        [hidden]=\"!completionText\">\n        {{completionText}}\n      </span>&nbsp;\n    </div>\n    <div class=\"col-md-auto\">\n      <a (click)=\"popupEditFields()\" [hidden]=\"!canEdit\">\n        <i class=\"fa fa-pencil-square fa-2x\" aria-hidden=\"true\"></i>\n      </a>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-md\">\n      <ng-template ngFor let-field [ngForOf]=\"fields\" let-i=\"index\">\n        <div class=\"row\" *ngIf=\"i < (fields.length / 2)\">\n          <div class=\"col-md-auto font-weight-bold pr-1\">\n            {{ field.Label }}:\n          </div>\n          <div class=\"col-md pl-0\" *ngIf=\"field.Input == InputType.Date\">\n            {{ values[field.ID] | date: 'MM/dd/yyyy' }}\n          </div>\n          <div class=\"col-md pl-0\" *ngIf=\"field.Input != InputType.Date\">\n            {{ values[field.ID] }}\n          </div>\n        </div>\n      </ng-template>\n    </div>\n    <div class=\"col-md\">\n      <ng-template ngFor let-field [ngForOf]=\"fields\" let-i=\"index\">\n        <div class=\"row\" *ngIf=\"i >= (fields.length / 2)\">\n          <div class=\"col-md-auto font-weight-bold pr-1\">\n            {{ field.Label }}:\n          </div>\n          <div class=\"col-md pl-0\" *ngIf=\"field.Input == InputType.Date\">\n            {{ values[field.ID] | date: 'MM/dd/yyyy' }}\n          </div>\n          <div class=\"col-md pl-0\" *ngIf=\"field.Input != InputType.Date\">\n            {{ values[field.ID] }}\n          </div>\n        </div>\n      </ng-template>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/attendee-fields/attendee-fields.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/attendee-fields/attendee-fields.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendeeFieldsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_service__ = __webpack_require__("./src/app/common.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__attendee_fields_popup_attendee_fields_popup_component__ = __webpack_require__("./src/app/attendee-fields-popup/attendee-fields-popup.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AttendeeFieldsComponent = /** @class */ (function () {
    function AttendeeFieldsComponent(service, modal) {
        this.service = service;
        this.modal = modal;
        this.attendeeChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.InputType = __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */];
        this._filter = __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].None;
        this.values = {};
    }
    AttendeeFieldsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getMyProfile().subscribe(function (user) {
            _this.currentUser = user;
            _this.onInputsChanged();
        });
    };
    AttendeeFieldsComponent.prototype.onInputsChanged = function () {
        var _this = this;
        if (this.event && this.event.Fields && this.filter) {
            this._fields = this.event.Fields.filter(function (f) { return _this.filter == f.Access && f.Included; });
        }
        else {
            this._fields = (this.event) ? this.event.Fields.filter(function (f) { return f.Included; }) : null;
        }
        // Load values
        if (this.fields && this.attendee) {
            this.fields.forEach(function (f) {
                switch (f.Input) {
                    case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].LongText:
                    case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].ShortText:
                    case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].Select:
                        if (f.Source) {
                            _this.values[f.ID] = _this.attendee[f.Source];
                        }
                        else {
                            _this.values[f.ID] = _this.attendee.Properties[f.ID];
                        }
                        break;
                    case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].Date:
                        var dt = null;
                        if (f.Source && _this.attendee[f.Source]) {
                            dt = new Date(_this.attendee[f.Source]);
                        }
                        else if (!f.Source && _this.attendee.Properties[f.ID]) {
                            dt = new Date(_this.attendee.Properties[f.ID]);
                        }
                        _this.values[f.ID] = dt;
                        break;
                    case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].YesOrNo:
                        if (f.Source) {
                            _this.values[f.ID] = __WEBPACK_IMPORTED_MODULE_3__common_service__["a" /* CommonService */].getYesOrNoText(_this.attendee[f.Source]);
                        }
                        else {
                            _this.values[f.ID] = __WEBPACK_IMPORTED_MODULE_3__common_service__["a" /* CommonService */].getYesOrNoText(_this.attendee.Properties[f.ID]);
                        }
                        break;
                    case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].MultiSelect:
                        var list = [];
                        if (f.Source && _this.attendee[f.Source]) {
                            list = _this.attendee[f.Source].split('|');
                        }
                        else if (!f.Source && _this.attendee.Properties[f.ID]) {
                            list = _this.attendee.Properties[f.ID].split('|');
                        }
                        _this.values[f.ID] = list.join(", ");
                        break;
                }
            });
            // are there any required and are they all set?
            this.completionText = null;
            if (this.fields.filter(function (f) { return f.Required; }).some(function (f) {
                if (!_this.values[f.ID]) {
                    return true;
                }
                _this.completionText = "COMPLETE";
            })) {
                this.completionText = "INCOMPLETE";
            }
        }
        // Make sure someone is not
        // trying to modify an old event.
        var today = new Date(Date.now());
        var start = (this.event) ? new Date(this.event.StartDate) : today;
        if (start < today) {
            this.canEdit = __WEBPACK_IMPORTED_MODULE_3__common_service__["a" /* CommonService */].canEditEvent(this.currentUser, this.event, __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].Support);
        }
        else {
            this.canEdit = __WEBPACK_IMPORTED_MODULE_3__common_service__["a" /* CommonService */].canEditProfile(this.currentUser, (this.attendee) ? this.attendee.Profile : null, this.event, __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].Lead | __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].Support | __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].Travel);
        }
    };
    AttendeeFieldsComponent.prototype.popupEditFields = function () {
        var _this = this;
        var modalOptions = {
            size: "lg"
        };
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_5__attendee_fields_popup_attendee_fields_popup_component__["a" /* AttendeeFieldsPopupComponent */], modalOptions);
        popupModalRef.componentInstance.title = "Edit " + (this.title ? this.title : "");
        popupModalRef.componentInstance.filter = this.filter;
        popupModalRef.componentInstance.event = this.event;
        popupModalRef.componentInstance.attendee = this.attendee;
        popupModalRef.componentInstance.saveClicked.subscribe(function (attendee) {
            _this.attendeeChange.emit(attendee);
            _this.attendee = attendee;
            popupModalRef.close();
        });
    };
    Object.defineProperty(AttendeeFieldsComponent.prototype, "attendee", {
        get: function () {
            return this._attendee;
        },
        set: function (attendee) {
            this._attendee = attendee;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttendeeFieldsComponent.prototype, "filter", {
        get: function () {
            return this._filter;
        },
        set: function (role) {
            this._filter = role;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttendeeFieldsComponent.prototype, "event", {
        get: function () {
            return this._event;
        },
        set: function (event) {
            this._event = event;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttendeeFieldsComponent.prototype, "fields", {
        get: function () {
            return this._fields;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", Object)
    ], AttendeeFieldsComponent.prototype, "attendeeChange", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", String)
    ], AttendeeFieldsComponent.prototype, "title", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], AttendeeFieldsComponent.prototype, "attendee", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], AttendeeFieldsComponent.prototype, "filter", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], AttendeeFieldsComponent.prototype, "event", null);
    AttendeeFieldsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-attendee-fields',
            template: __webpack_require__("./src/app/attendee-fields/attendee-fields.component.html"),
            styles: [__webpack_require__("./src/app/attendee-fields/attendee-fields.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__tradeshow_service__["a" /* TradeshowService */],
            __WEBPACK_IMPORTED_MODULE_4__ng_bootstrap_ng_bootstrap__["b" /* NgbModal */]])
    ], AttendeeFieldsComponent);
    return AttendeeFieldsComponent;
}());



/***/ }),

/***/ "./src/app/attendee-list/attendee-list.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"m-3\">\r\n  <div class=\"card\">\r\n    <div class=\"card-body pl-4\">\r\n      <span class=\"h5 card-title\">All Contacts</span>\r\n    </div>\r\n    <kendo-grid #attendeeGrid\r\n      [data]=\"view\"\r\n      [pageable]=\"true\"\r\n      [pageSize]=\"state.take\"\r\n      [skip]=\"state.skip\"\r\n      [sortable]=\"true\"\r\n      [sort]=\"state.sort\"\r\n      (sortChange)=\"sortChange($event)\"\r\n      filterable=\"menu\"\r\n      [filter]=\"state.filter\"\r\n      (dataStateChange)=\"dataStateChange($event)\"\r\n      style=\"height: calc(100vh - 137px);\"\r\n    >\r\n      <kendo-grid-column field=\"User.Name\" title=\"Name\" [filterable]=\"false\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          <a class=\"text-info\" [routerLink]=\"[dataItem.Username.toLowerCase()]\">\r\n            {{ dataItem.FirstName }} {{ dataItem.LastName }}\r\n          </a>\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.Email\" title=\"Email\" width=\"200\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Email }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.Telephone\" title=\"Work Number\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Telephone }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.Mobile\" title=\"Cell Number\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Mobile }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.Segment\" title=\"Segment\" width=\"120\">\r\n        <ng-template kendoGridFilterMenuTemplate\r\n          let-column=\"column\"\r\n          let-filter=\"filter\"\r\n          let-filterService=\"filterService\">\r\n          <grid-seg-filter\r\n            [isPrimitive]=\"true\"\r\n            [showFilter]=\"false\"\r\n            [field]=\"column.field\"\r\n            [operator]=\"'eq'\"\r\n            [filterService]=\"filterService\"\r\n            [currentFilter]=\"filter\"\r\n            [data]=\"segments\">\r\n          </grid-seg-filter>\r\n        </ng-template>\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Segment }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"EventsAttended\" title=\"Events Attended\" [filterable]=\"false\">\r\n      </kendo-grid-column>\r\n    </kendo-grid>\r\n  </div>\r\n</div>"

/***/ }),

/***/ "./src/app/attendee-list/attendee-list.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/attendee-list/attendee-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendeeListComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__progress_kendo_angular_grid__ = __webpack_require__("./node_modules/@progress/kendo-angular-grid/dist/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var flatten = function (filter) {
    var filters = (filter || {}).filters;
    if (filters) {
        return filters.reduce(function (acc, curr) { return acc.concat(curr.filters ? flatten(curr) : [curr]); }, []);
    }
    return [];
};
var AttendeeListComponent = /** @class */ (function () {
    function AttendeeListComponent(service) {
        this.service = service;
        this.segments = [];
        this.state = this.service.attendeeListState;
    }
    AttendeeListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getSegments()
            .subscribe(function (segments) {
            _this.segments = segments;
        });
        this.dataStateChange(this.state);
    };
    AttendeeListComponent.prototype.sortChange = function (sort) {
        this.state.sort = sort;
    };
    AttendeeListComponent.prototype.dataStateChange = function (state) {
        this.state = state;
        this.service.attendeeListState = state;
        this.loadAttendees();
    };
    AttendeeListComponent.prototype.loadAttendees = function () {
        var _this = this;
        this.grid.loading = true;
        var params = {
            Skip: this.state.skip,
            Size: this.state.take,
            Sort: this.state.sort.map(function (s) {
                return {
                    Field: s.field,
                    Desc: s.dir == "desc"
                };
            }),
            Filters: flatten(this.state.filter).map(function (filter) {
                var fd = filter;
                return {
                    Field: fd.field,
                    Operator: fd.operator,
                    Value: fd.value
                };
            })
        };
        this.service.getAttendees(params)
            .subscribe(function (results) {
            _this.view = {
                data: results.Attendees,
                total: results.Total
            };
            _this.grid.loading = false;
        }, function (error) {
            _this.grid.loading = false;
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("attendeeGrid"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__progress_kendo_angular_grid__["b" /* GridComponent */])
    ], AttendeeListComponent.prototype, "grid", void 0);
    AttendeeListComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-attendee-list',
            template: __webpack_require__("./src/app/attendee-list/attendee-list.component.html"),
            styles: [__webpack_require__("./src/app/attendee-list/attendee-list.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__tradeshow_service__["a" /* TradeshowService */]])
    ], AttendeeListComponent);
    return AttendeeListComponent;
}());



/***/ }),

/***/ "./src/app/attendee-main/attendee-main.component.html":
/***/ (function(module, exports) {

module.exports = "<div style=\"margin-top: 65px;position: relative;\" *ngIf=\"(viewMode == AttendeeViewMode.List)\">\n  <app-attendee-list>\n  </app-attendee-list>\n</div>\n\n<div style=\"margin-top: 49px;position: relative;\" *ngIf=\"(viewMode == AttendeeViewMode.Display)\">\n  <app-attendee-view\n    [profile]=\"profile\"\n    [attendee]=\"attendee\">\n  </app-attendee-view>\n</div>"

/***/ }),

/***/ "./src/app/attendee-main/attendee-main.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/attendee-main/attendee-main.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendeeMainComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_shared__ = __webpack_require__("./src/app/shared/shared.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pagetitle_service__ = __webpack_require__("./src/app/pagetitle.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AttendeeMainComponent = /** @class */ (function () {
    function AttendeeMainComponent(pagesvc, service, router, route) {
        this.pagesvc = pagesvc;
        this.service = service;
        this.router = router;
        this.route = route;
        this.AttendeeViewMode = __WEBPACK_IMPORTED_MODULE_1__shared_shared__["b" /* AttendeeViewMode */];
        this.viewMode = __WEBPACK_IMPORTED_MODULE_1__shared_shared__["b" /* AttendeeViewMode */].None;
    }
    AttendeeMainComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.pagesvc.setLoading(true);
        setTimeout(function () {
            _this.pagesvc.setActivePage(__WEBPACK_IMPORTED_MODULE_1__shared_shared__["f" /* SideMenuMode */].Attendees, null);
        });
        var id = this.route.snapshot.params.id;
        var mode = __WEBPACK_IMPORTED_MODULE_1__shared_shared__["b" /* AttendeeViewMode */].None;
        if (this.route.snapshot.data[0]) {
            mode = this.route.snapshot.data[0]['viewMode'];
        }
        this.service.getMyProfile()
            .subscribe(function (me) {
            _this.currentUser = me;
            if (me.Privileges == __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["c" /* Permissions */].None && (me.Role == __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].None || me.Role == __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Attendee)) {
                if (!id || (isNaN(Number(id)) && me.Username != id.toUpperCase())) {
                    mode = __WEBPACK_IMPORTED_MODULE_1__shared_shared__["b" /* AttendeeViewMode */].MyProfile;
                }
            }
            switch (mode) {
                case __WEBPACK_IMPORTED_MODULE_1__shared_shared__["b" /* AttendeeViewMode */].List:
                    _this.viewMode = mode;
                    _this.pagesvc.setLoading(false);
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__shared_shared__["b" /* AttendeeViewMode */].Display:
                    _this.showAttendeeInfo(id);
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__shared_shared__["b" /* AttendeeViewMode */].MyProfile:
                    _this.pagesvc.setLoading(false);
                    _this.router.navigate(['attendees', me.Username.toLowerCase()]);
                    break;
            }
        }, function (error) {
            _this.pagesvc.setLoading(false);
        });
    };
    AttendeeMainComponent.prototype.showAttendeeInfo = function (id) {
        var _this = this;
        if (isNaN(Number(id))) {
            this.service.getUserProfile(id)
                .subscribe(function (profile) {
                _this.profile = profile;
                _this.viewMode = __WEBPACK_IMPORTED_MODULE_1__shared_shared__["b" /* AttendeeViewMode */].Display;
                _this.pagesvc.setLoading(false);
            }, function (error) {
                _this.router.navigate(['attendees']);
                _this.viewMode = __WEBPACK_IMPORTED_MODULE_1__shared_shared__["b" /* AttendeeViewMode */].List;
                _this.pagesvc.setLoading(false);
            });
        }
        else {
            this.service.getEventAttendee(Number(id))
                .subscribe(function (attendee) {
                _this.attendee = attendee;
                _this.viewMode = __WEBPACK_IMPORTED_MODULE_1__shared_shared__["b" /* AttendeeViewMode */].Display;
                _this.pagesvc.setLoading(false);
            }, function (error) {
                _this.router.navigate(['attendees', _this.currentUser.Username.toLowerCase()]);
                _this.profile = _this.currentUser;
                _this.viewMode = __WEBPACK_IMPORTED_MODULE_1__shared_shared__["b" /* AttendeeViewMode */].Display;
                _this.pagesvc.setLoading(false);
            });
        }
    };
    AttendeeMainComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-attendee-main',
            template: __webpack_require__("./src/app/attendee-main/attendee-main.component.html"),
            styles: [__webpack_require__("./src/app/attendee-main/attendee-main.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__pagetitle_service__["a" /* PageTitleService */],
            __WEBPACK_IMPORTED_MODULE_3__tradeshow_service__["a" /* TradeshowService */],
            __WEBPACK_IMPORTED_MODULE_4__angular_router__["b" /* Router */],
            __WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* ActivatedRoute */]])
    ], AttendeeMainComponent);
    return AttendeeMainComponent;
}());



/***/ }),

/***/ "./src/app/attendee-rsvp-popup/attendee-rsvp-popup.component.html":
/***/ (function(module, exports) {

module.exports = "<div [class.loading]=\"isLoading\">\n  <div class=\"modal-header\">\n    <h5 class=\"modal-title w-100\">You are Invited to {{attendee?.Event.Name}}!</h5>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"cancelPopup()\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n  </div>\n  <div class=\"modal-body\">\n    <div class=\"bg-secondary\">\n      <app-event-info\n        [event]=\"attendee?.Event\" \n        [readonly]=\"true\">\n      </app-event-info>\n    </div>\n    <div class=\"mt-3\">\n      <span class=\"h6\">Do you want to RSVP for this event?</span>\n    </div>\n    <div class=\"my-3\">\n      <button class=\"btn btn-secondary p-2 m-0\" style=\"border: 1px solid black!important\" (click)=\"onNoClicked()\">\n        NO, I WILL NOT ATTEND\n      </button>\n      <button class=\"btn btn-info py-2 my-0\" (click)=\"onYesClicked()\">\n        YES, I WILL ATTEND\n      </button>\n    </div>\n  </div>\n  <div class=\"alert alert-danger m-0\" role=\"alert\" *ngIf=\"errorMsg\">\n    <i class=\"fa fa-exclamation-circle fa-lg\" aria-hidden=\"true\"></i>&nbsp; {{errorMsg}}\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/attendee-rsvp-popup/attendee-rsvp-popup.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/attendee-rsvp-popup/attendee-rsvp-popup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendeeRsvpPopupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AttendeeRsvpPopupComponent = /** @class */ (function () {
    function AttendeeRsvpPopupComponent(activeModal, service) {
        this.activeModal = activeModal;
        this.service = service;
        this.isLoading = false;
    }
    AttendeeRsvpPopupComponent.prototype.ngOnInit = function () {
    };
    AttendeeRsvpPopupComponent.prototype.cancelPopup = function () {
        this.activeModal.dismiss();
    };
    AttendeeRsvpPopupComponent.prototype.onYesClicked = function () {
        this.attendee.IsAttending = "Yes";
        this.saveAttendee();
    };
    AttendeeRsvpPopupComponent.prototype.onNoClicked = function () {
        this.attendee.IsAttending = "No";
        this.saveAttendee();
    };
    AttendeeRsvpPopupComponent.prototype.saveAttendee = function () {
        var _this = this;
        this.isLoading = true;
        this.service.saveAttendee(this.attendee.EventID, this.attendee)
            .subscribe(function (attendee) {
            _this.isLoading = false;
            attendee.Event = _this.attendee.Event;
            _this.activeModal.close(attendee);
        }, function (error) {
            _this.isLoading = false;
            _this.errorMsg = error;
        });
    };
    Object.defineProperty(AttendeeRsvpPopupComponent.prototype, "attendee", {
        get: function () {
            return this._attendee;
        },
        set: function (attendee) {
            this._attendee = attendee;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], AttendeeRsvpPopupComponent.prototype, "attendee", null);
    AttendeeRsvpPopupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-attendee-rsvp-popup',
            template: __webpack_require__("./src/app/attendee-rsvp-popup/attendee-rsvp-popup.component.html"),
            styles: [__webpack_require__("./src/app/attendee-rsvp-popup/attendee-rsvp-popup.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */],
            __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__["a" /* TradeshowService */]])
    ], AttendeeRsvpPopupComponent);
    return AttendeeRsvpPopupComponent;
}());



/***/ }),

/***/ "./src/app/attendee-view/attendee-view.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"tabs-wrapper bg-white\">\n  <ul class=\"nav classic-tabs tabs-white\" role=\"tablist\">\n    <li class=\"nav-item ml-3\">\n      <a class=\"nav-link waves-light waves-effect\" \n         [class.active]=\"activeTab == AttendeeDisplayTab.Profile\"\n         (click)=\"onTabClicked(AttendeeDisplayTab.Profile)\">Profile</a>\n    </li>\n    <li class=\"nav-item ml-3\" *ngIf=\"attendee\">\n      <a class=\"nav-link waves-light waves-effect\"\n         [class.active]=\"activeTab == AttendeeDisplayTab.Attendee\"\n         (click)=\"onTabClicked(AttendeeDisplayTab.Attendee)\">\n          {{attendee.Event.Name}}&nbsp;\n          <span (click)=\"onTabClose($event)\">\n            <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n          </span>\n      </a>\n    </li>\n  </ul>\n</div>\n\n<div class=\"mt-3 mx-3\" [class.d-none]=\"activeTab != AttendeeDisplayTab.Profile\">\n  \n  <div class=\"card mb-3\" *ngIf=\"profile\">\n    <app-profile-info \n      [(profile)]=\"profile\">\n    </app-profile-info>\n  </div>\n\n  <ul class=\"list-tabs mt-3 m-1\" *ngIf=\"events?.length\">\n    <li>\n      <a (click)=\"onStatusFilterClicked(EventStatusFilter.Upcoming)\" \n         [class.selected]=\"selectedStatus == EventStatusFilter.Upcoming\">\n        Upcoming Events\n      </a>\n    </li>\n    <li>\n      <a (click)=\"onStatusFilterClicked(EventStatusFilter.Past)\"\n        [class.selected]=\"selectedStatus == EventStatusFilter.Past\">\n        Past Events\n      </a>\n    </li>\n  </ul>\n\n  <div class=\"mt-3\" *ngIf=\"filteredevents\">\n    <div class=\"card show-card\" *ngFor=\"let event of filteredevents\">\n      <div class=\"pt-3 px-3\">\n        <div class=\"row\">\n          <div class=\"col-md\">\n            <span>{{ event.StartDate | date: 'MMMM d, yyyy' }} - {{ event.EndDate | date: 'MMMM d, yyyy' }}</span>\n          </div>\n          <div class=\"col-md-auto\" *ngIf=\"event.DelegateUsername\">\n            <div *ngIf=\"profile.Username == event.DelegateUsername\"\n              class=\"chip chip-grey m-0 px-2 py-1 text-center\" style=\"height: auto; line-height:1rem;\">\n              DELEGATE FOR <br> {{ event.Name }}\n            </div>\n            <div *ngIf=\"profile.Username != event.DelegateUsername\"\n              class=\"chip chip-grey m-0 px-2 py-1 text-center\" style=\"height: auto; line-height:1rem;\">\n              DELEGATED TO <br> {{ event.DelegateName }}\n            </div>\n          </div>\n        </div>\n        <h4>{{ event.EventName }}</h4>\n        <div class=\"progress mb-2\">\n          <div class=\"progress-bar\" role=\"progressbar\"\n               [class.bg-success]=\"event.Status == AttendeeStatus.Accepted && event.IsComplete\"\n               [class.bg-warning]=\"event.Status == AttendeeStatus.Accepted && !event.IsComplete\"\n               [class.bg-secondary]=\"event.Status == AttendeeStatus.Declined\"\n               [class.bg-danger]=\"event.Status == AttendeeStatus.Pending || event.Status == AttendeeStatus.Invited\"></div>\n        </div>\n        <div [ngSwitch]=\"event.Status\">\n          <span *ngSwitchCase=\"AttendeeStatus.Declined\">DECLINED RSVP</span>\n          <span *ngSwitchCase=\"AttendeeStatus.Accepted\">ACCEPTED RSVP</span>\n          <span *ngSwitchDefault>NO RESPONSE</span>\n        </div>\n      </div>\n      <div class=\"footer py-2 px-3\">\n        <a (click)=\"onAttendeeClicked(event.ID)\" class=\"text-info\">VIEW</a>\n      </div>\n    </div>\n  </div>\n\n</div>\n\n<div class=\"mt-3 mx-3\" [class.d-none]=\"activeTab != AttendeeDisplayTab.Attendee\" *ngIf=\"attendee\">\n\n  <div class=\"card mb-3\">\n    <app-event-info\n      [event]=\"attendee.Event\"\n      (eventChange)=\"onEventChanged($event)\">\n    </app-event-info>\n  </div>\n\n  <div class=\"card mb-3\">\n    <app-profile-info \n      [event]=\"attendee.Event\"\n      [profile]=\"attendee.Profile\"\n      (profileChange)=\"onProfileChanged($event)\">\n    </app-profile-info>\n  </div>\n\n  <div class=\"card mb-3\">\n    <app-attendee-fields \n      [title]=\"'Other Attendee Details'\"\n      [filter]=\"Role.All\"\n      [event]=\"attendee.Event\"\n      [attendee]=\"attendee\"\n      (attendeeChange)=\"onAttendeeChanged()\">\n    </app-attendee-fields>\n  </div>\n\n</div>"

/***/ }),

/***/ "./src/app/attendee-view/attendee-view.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/attendee-view/attendee-view.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendeeViewComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pagetitle_service__ = __webpack_require__("./src/app/pagetitle.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shared_shared__ = __webpack_require__("./src/app/shared/shared.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__attendee_rsvp_popup_attendee_rsvp_popup_component__ = __webpack_require__("./src/app/attendee-rsvp-popup/attendee-rsvp-popup.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var AttendeeViewComponent = /** @class */ (function () {
    function AttendeeViewComponent(service, pagesvc, modal) {
        this.service = service;
        this.pagesvc = pagesvc;
        this.modal = modal;
        this.Role = __WEBPACK_IMPORTED_MODULE_2__shared_Enums__["d" /* Role */];
        this.AttendeeStatus = __WEBPACK_IMPORTED_MODULE_2__shared_Enums__["a" /* AttendeeStatus */];
        this.AttendeeDisplayTab = __WEBPACK_IMPORTED_MODULE_4__shared_shared__["a" /* AttendeeDisplayTab */];
        this.EventStatusFilter = __WEBPACK_IMPORTED_MODULE_4__shared_shared__["d" /* EventStatusFilter */];
        this.activeTab = __WEBPACK_IMPORTED_MODULE_4__shared_shared__["a" /* AttendeeDisplayTab */].Profile;
        this.selectedStatus = __WEBPACK_IMPORTED_MODULE_4__shared_shared__["d" /* EventStatusFilter */].Upcoming;
    }
    AttendeeViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getMyProfile().subscribe(function (me) {
            _this._currentUser = me;
            _this.onAttendeeInputChanged();
        });
    };
    AttendeeViewComponent.prototype.onTabClicked = function (activeTab) {
        this.activeTab = activeTab;
    };
    AttendeeViewComponent.prototype.onTabClose = function (event) {
        event.stopPropagation();
        this.attendee = null;
        this.onTabClicked(__WEBPACK_IMPORTED_MODULE_4__shared_shared__["a" /* AttendeeDisplayTab */].Profile);
    };
    AttendeeViewComponent.prototype.onStatusFilterClicked = function (status) {
        if (this.selectedStatus != status) {
            this.selectedStatus = status;
            this.filterAttendeeEvents();
        }
    };
    AttendeeViewComponent.prototype.filterAttendeeEvents = function () {
        switch (this.selectedStatus) {
            case __WEBPACK_IMPORTED_MODULE_4__shared_shared__["d" /* EventStatusFilter */].Upcoming:
                this._filteredevents = this.events.filter(function (x) { return (new Date(Date.now()) < new Date(x.StartDate)); });
                break;
            case __WEBPACK_IMPORTED_MODULE_4__shared_shared__["d" /* EventStatusFilter */].Past:
                this._filteredevents = this.events.filter(function (x) { return (new Date(Date.now()) >= new Date(x.StartDate)); });
                break;
        }
    };
    Object.defineProperty(AttendeeViewComponent.prototype, "filteredevents", {
        get: function () {
            return this._filteredevents;
        },
        enumerable: true,
        configurable: true
    });
    AttendeeViewComponent.prototype.loadAttendeeEvents = function () {
        var _this = this;
        if (this.profile) {
            this.pagesvc.setLoading(true);
            this.service.getAttendeeEvents(this.profile.Username)
                .subscribe(function (events) {
                _this.events = events;
                _this.pagesvc.setLoading(false);
            }, function (error) {
                _this.pagesvc.setLoading(false);
            });
        }
    };
    AttendeeViewComponent.prototype.onAttendeeClicked = function (attendeeID) {
        var _this = this;
        if (this.attendee && this.attendee.ID == attendeeID) {
            this.onTabClicked(__WEBPACK_IMPORTED_MODULE_4__shared_shared__["a" /* AttendeeDisplayTab */].Attendee);
            return;
        }
        this.service.getEventAttendee(attendeeID)
            .subscribe(function (attendee) {
            if (_this.profile && attendee.Username == _this.profile.Username) {
                //attendee.Profile = this.profile;
            }
            _this.attendee = attendee;
        }, function (error) {
            _this.onTabClicked(__WEBPACK_IMPORTED_MODULE_4__shared_shared__["a" /* AttendeeDisplayTab */].Profile);
        });
    };
    AttendeeViewComponent.prototype.onEventChanged = function (event) {
        if (this.attendee) {
            this.attendee.Event = event;
        }
        this.loadAttendeeEvents();
    };
    AttendeeViewComponent.prototype.onProfileChanged = function (profile) {
        if (this.attendee) {
            if (this.attendee.Username == profile.Username) {
                this.attendee.Profile = profile;
            }
        }
        if (this.profile.Username == profile.Username) {
            this.profile = profile;
        }
    };
    AttendeeViewComponent.prototype.onAttendeeChanged = function () {
        this.loadAttendeeEvents();
    };
    AttendeeViewComponent.prototype.popupRsvp = function () {
        var _this = this;
        var modalOptions = { size: "lg" };
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_6__attendee_rsvp_popup_attendee_rsvp_popup_component__["a" /* AttendeeRsvpPopupComponent */], modalOptions);
        popupModalRef.componentInstance.attendee = this.attendee;
        popupModalRef.result.then(function (attendee) {
            _this.attendee = attendee;
            _this.onTabClicked(__WEBPACK_IMPORTED_MODULE_4__shared_shared__["a" /* AttendeeDisplayTab */].Attendee);
            _this.loadAttendeeEvents();
        }, function (reason) {
            _this.attendee = null;
            _this.onTabClicked(__WEBPACK_IMPORTED_MODULE_4__shared_shared__["a" /* AttendeeDisplayTab */].Profile);
        });
    };
    AttendeeViewComponent.prototype.onProfileInputChanged = function () {
        var _this = this;
        if (this.profile) {
            setTimeout(function () {
                _this.pagesvc.setActivePage(__WEBPACK_IMPORTED_MODULE_4__shared_shared__["f" /* SideMenuMode */].Attendees, _this.profile.FirstName + " " + _this.profile.LastName);
            });
            if (this.attendee && this.attendee.Username == this.profile.Username) {
                this.attendee.Profile = this.profile;
            }
            this.loadAttendeeEvents();
        }
    };
    AttendeeViewComponent.prototype.onAttendeeInputChanged = function () {
        var _this = this;
        if (this.attendee && this.currentUser) {
            if (!this.profile) {
                this.profile = this.attendee.Profile;
            }
            if (this.attendee.Username == this.currentUser.Username) {
                var today = new Date(Date.now());
                var start = new Date(this.attendee.Event.StartDate);
                if (!this.attendee.IsAttending && (today < start)) {
                    window.setTimeout(function () {
                        _this.popupRsvp();
                    }, 0);
                    return;
                }
            }
            this.onTabClicked(__WEBPACK_IMPORTED_MODULE_4__shared_shared__["a" /* AttendeeDisplayTab */].Attendee);
        }
    };
    Object.defineProperty(AttendeeViewComponent.prototype, "profile", {
        get: function () {
            return this._profile;
        },
        set: function (profile) {
            this._profile = profile;
            this.onProfileInputChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttendeeViewComponent.prototype, "attendee", {
        get: function () {
            return this._attendee;
        },
        set: function (attendee) {
            this._attendee = attendee;
            this.onAttendeeInputChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttendeeViewComponent.prototype, "currentUser", {
        get: function () {
            return this._currentUser;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttendeeViewComponent.prototype, "events", {
        get: function () {
            return this._events;
        },
        set: function (events) {
            this._events = events;
            this.filterAttendeeEvents();
            if ((events && events.length) &&
                (!this.filteredevents || !this.filteredevents.length)) {
                switch (this.selectedStatus) {
                    case __WEBPACK_IMPORTED_MODULE_4__shared_shared__["d" /* EventStatusFilter */].Upcoming:
                        this.onStatusFilterClicked(__WEBPACK_IMPORTED_MODULE_4__shared_shared__["d" /* EventStatusFilter */].Past);
                        break;
                    case __WEBPACK_IMPORTED_MODULE_4__shared_shared__["d" /* EventStatusFilter */].Past:
                        this.onStatusFilterClicked(__WEBPACK_IMPORTED_MODULE_4__shared_shared__["d" /* EventStatusFilter */].Upcoming);
                        break;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], AttendeeViewComponent.prototype, "profile", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], AttendeeViewComponent.prototype, "attendee", null);
    AttendeeViewComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-attendee-view',
            template: __webpack_require__("./src/app/attendee-view/attendee-view.component.html"),
            styles: [__webpack_require__("./src/app/attendee-view/attendee-view.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__tradeshow_service__["a" /* TradeshowService */],
            __WEBPACK_IMPORTED_MODULE_3__pagetitle_service__["a" /* PageTitleService */],
            __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__["b" /* NgbModal */]])
    ], AttendeeViewComponent);
    return AttendeeViewComponent;
}());



/***/ }),

/***/ "./src/app/common.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommonService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_util__ = __webpack_require__("./node_modules/util/util.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_util___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_util__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CommonService = /** @class */ (function () {
    function CommonService() {
    }
    CommonService.getDisplayName = function (profile) {
        var name;
        if (profile) {
            name = profile.FirstName + " " + profile.LastName;
            if (profile.Segment) {
                name += " (" + profile.Segment + ")";
            }
        }
        return name;
    };
    CommonService.getShowTypeString = function (showtype) {
        switch (showtype) {
            case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["e" /* ShowType */].International:
                return "International";
            case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["e" /* ShowType */].Domestic:
                return "Domestic";
            default:
                return "";
        }
    };
    CommonService.getInputTypeString = function (input) {
        switch (input) {
            case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].ShortText:
                return "Short Text";
            case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].LongText:
                return "Long Text";
            case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].Date:
                return "Date";
            case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].YesOrNo:
                return "Select Yes or No";
            case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].Select:
                return "Select One";
            case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].MultiSelect:
                return "Select Many";
            default:
                return "";
        }
    };
    CommonService.getMaskedText = function (input, maxVisibleChars) {
        if (input && input.length > maxVisibleChars) {
            return Array(input.length - maxVisibleChars).join("*") +
                input.substr(input.length - maxVisibleChars);
        }
        return input;
    };
    CommonService.enumToArray = function (data) {
        if (data) {
            return Object.keys(data).filter(function (type) { return !isNaN(type); }).map(function (i) { return Number(i); });
        }
        return [];
    };
    CommonService.makeFieldNameFromLabel = function (label) {
        var result = label;
        if (label) {
            result = result.replace(/\W/g, '');
            result = result.substring(0, Math.min(50, result.length));
        }
        return result;
    };
    CommonService.getDefaultEventField = function (access) {
        return {
            ID: 0,
            Label: null,
            Input: __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["b" /* InputType */].Unknown,
            Source: null,
            Tooltip: null,
            Options: null,
            Order: 0,
            Required: null,
            Included: true,
            Access: access
        };
    };
    CommonService.getYesOrNoText = function (value) {
        if (value) {
            if (Object(__WEBPACK_IMPORTED_MODULE_2_util__["isBoolean"])(value)) {
                return Boolean(value) ? "Yes" : "No";
            }
            switch (value.toString().toUpperCase()) {
                case "YES":
                case "TRUE":
                    return "Yes";
                default:
                    return "No";
            }
        }
        return null;
    };
    CommonService.getResponseText = function (status) {
        switch (status) {
            case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["a" /* AttendeeStatus */].Accepted:
                return "Yes";
            case __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["a" /* AttendeeStatus */].Declined:
                return "No";
            default:
                return "No Response";
        }
    };
    // Permission Checks
    CommonService.canEditProfile = function (currentUser, profile, event, maxRole) {
        if (profile === void 0) { profile = null; }
        if (event === void 0) { event = null; }
        if (maxRole === void 0) { maxRole = __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].All; }
        if (!currentUser) {
            return false;
        }
        if (currentUser.Privileges == __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["c" /* Permissions */].Admin) {
            return true;
        }
        if (profile) {
            if (profile.Username == currentUser.Username) {
                return true;
            }
            if (profile.DelegateUsername == currentUser.Username) {
                return true;
            }
        }
        if (event) {
            if (event.OwnerUsername == currentUser.Username) {
                return true;
            }
            if (event.Users.some(function (u) {
                if (u.User.Username == currentUser.Username &&
                    __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].None != (u.Role & maxRole)) {
                    return true;
                }
            })) {
                return true;
            }
        }
        return false;
    };
    CommonService.canViewPassportInfo = function (currentUser, profile, event) {
        if (event === void 0) { event = null; }
        if (event && event.ShowType != __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["e" /* ShowType */].International) {
            return false;
        }
        if (this.canEditProfile(currentUser, profile, event, __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].Lead | __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].Support | __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].Business)) {
            return true;
        }
        return false;
    };
    CommonService.canEditEvent = function (currentUser, event, maxRole) {
        if (event === void 0) { event = null; }
        if (maxRole === void 0) { maxRole = __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].Support | __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].Travel; }
        if (!currentUser) {
            return false;
        }
        if (currentUser.Privileges == __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["c" /* Permissions */].Admin) {
            return true;
        }
        if (!event) {
            return false;
        }
        if (event.OwnerUsername == currentUser.Username) {
            return true;
        }
        if (event.Users.some(function (u) {
            if (u.User.Username == currentUser.Username &&
                __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].None != (u.Role & maxRole)) {
                return true;
            }
        })) {
            return true;
        }
        return false;
    };
    CommonService.getEventRole = function (currentUser, event) {
        if (event === void 0) { event = null; }
        if (!currentUser) {
            return __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].None;
        }
        if (currentUser.Privileges == __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["c" /* Permissions */].Admin) {
            return __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].Lead;
        }
        if (event) {
            if (event.OwnerUsername == currentUser.Username) {
                return __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].Lead;
            }
            var role_1 = __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].None;
            if (event.Users.some(function (u) {
                if (u.User.Username == currentUser.Username) {
                    role_1 = u.Role;
                    return true;
                }
            })) {
                return role_1;
            }
        }
        else if (currentUser.Privileges == __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["c" /* Permissions */].CreateShows) {
            return __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].Lead;
        }
        return __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["d" /* Role */].None;
    };
    CommonService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], CommonService);
    return CommonService;
}());



/***/ }),

/***/ "./src/app/event-delete-popup/event-delete-popup.component.html":
/***/ (function(module, exports) {

module.exports = "<div [class.loading]=\"isLoading\">\n  <div class=\"modal-header\">\n    <h5 class=\"modal-title w-100\">Are you sure you want to Delete this event?</h5>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"cancelPopup()\">\n        <span aria-hidden=\"true\">&times;</span>\n    </button>\n  </div>\n  <div class=\"modal-body\">\n    <div class=\"alert alert-info\" role=\"alert\">\n      You are about to delete the event below. By deleting the event you will no longer have access to the data and it will not be included in any reports. Attendee profile data will not be affected.\n    </div>\n    <div class=\"md-form\">\n      <label for=\"deltxt\" [class.active]=\"deleteText\">Type \"DELETE\" to erase {{event.Name}}</label>\n      <input type=\"text\" id=\"deltxt\" name=\"deltxt\" class=\"form-control\" maxlength=\"6\" [(ngModel)]=\"deleteText\">\n    </div>\n    <div class=\"alert alert-danger m-0 py-1 mr-3\" role=\"alert\" [hidden]=\"!errorMsg\">\n      <i class=\"fa fa-exclamation-circle fa-lg\" aria-hidden=\"true\"></i>&nbsp; {{errorMsg}}\n    </div>\n  </div>\n  <div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-secondary btn-sm px-3\" (click)=\"cancelPopup()\">CANCEL</button>\n    <button type=\"button\" class=\"btn btn-primary btn-sm px-4\" [disabled]=\"deleteText!='DELETE'\" (click)=\"onDelete()\">DELETE</button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/event-delete-popup/event-delete-popup.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/event-delete-popup/event-delete-popup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EventDeletePopupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var EventDeletePopupComponent = /** @class */ (function () {
    function EventDeletePopupComponent(activeModal, service) {
        this.activeModal = activeModal;
        this.service = service;
        this.eventDeleted = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
    }
    EventDeletePopupComponent.prototype.ngOnInit = function () {
    };
    EventDeletePopupComponent.prototype.cancelPopup = function () {
        this.activeModal.close("Cancel clicked");
    };
    EventDeletePopupComponent.prototype.onDelete = function () {
        var _this = this;
        if (this.event) {
            this.isLoading = true;
            this.service.deleteEvent(this.event.ID)
                .subscribe(function (result) {
                _this.errorMsg = null;
                _this.eventDeleted.emit();
                _this.isLoading = false;
            }, function (error) {
                _this.errorMsg = error;
                _this.isLoading = false;
            });
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], EventDeletePopupComponent.prototype, "event", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */])
    ], EventDeletePopupComponent.prototype, "eventDeleted", void 0);
    EventDeletePopupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-event-delete-popup',
            template: __webpack_require__("./src/app/event-delete-popup/event-delete-popup.component.html"),
            styles: [__webpack_require__("./src/app/event-delete-popup/event-delete-popup.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */],
            __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__["a" /* TradeshowService */]])
    ], EventDeletePopupComponent);
    return EventDeletePopupComponent;
}());



/***/ }),

/***/ "./src/app/event-edit-popup/event-edit-popup.component.html":
/***/ (function(module, exports) {

module.exports = "<div [class.loading]=\"isLoading\">\r\n  <div class=\"modal-header\">\r\n    <h4 class=\"modal-title w-100 font-weight-bold\">{{ title }}</h4>\r\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"cancelPopup()\">\r\n        <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <div class=\"bg-secondary px-3 py-2 text-dark\" *ngIf=\"!showCreateSuccess\">\r\n    Fill out the details to the best of your ability. The fields with a (<span class=\"text-danger\">*</span>) are required. You can change these fields later.\r\n  </div>\r\n  <div class=\"modal-body\" [class.d-none]=\"showCreateSuccess\">\r\n    <form class=\"row\" novalidate (ngSubmit)=\"onSubmit(f)\" #f=\"ngForm\">\r\n      <div class=\"col-md-6\">\r\n        <h6 class=\"pb-2\">EVENT DETAILS</h6>\r\n        <div class=\"md-form\">\r\n          <label for=\"eventName\" class=\"active\">\r\n            Event Name <span class=\"text-danger\">*</span>\r\n          </label>\r\n          <input type=\"text\" id=\"eventName\" name=\"eventName\" class=\"form-control\"\r\n                  [disabled]=\"userRole != Role.Lead && userRole != Role.Support\"\r\n                  maxlength=\"50\" [(ngModel)]=\"event.Name\">\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"description\" class=\"active\">\r\n            Event Description\r\n          </label>\r\n          <textarea type=\"text\" id=\"description\" name=\"description\" \r\n            class=\"form-control md-textarea py-1\" rows=\"3\"\r\n            [disabled]=\"userRole != Role.Lead && userRole != Role.Support\"\r\n            [(ngModel)]=\"event.Description\"></textarea>\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"start\" class=\"active\">\r\n            Start Date <span class=\"text-danger\">*</span>\r\n          </label>\r\n          <kendo-datepicker\r\n            id=\"start\" name=\"start\"\r\n            [disabled]=\"userRole != Role.Lead && userRole != Role.Support\"\r\n            [(ngModel)]=\"event.StartDate\"\r\n            (valueChange)=\"onStartChange($event)\"\r\n            placeholder=\" \"\r\n            style=\"width: 100%;\">\r\n          </kendo-datepicker>\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"end\" class=\"active\">\r\n            End Date <span class=\"text-danger\">*</span>\r\n          </label>\r\n          <kendo-datepicker\r\n            id=\"end\" name=\"end\"\r\n            [disabled]=\"userRole != Role.Lead && userRole != Role.Support\"\r\n            [(ngModel)]=\"event.EndDate\"\r\n            (valueChange)=\"onEndChange($event)\"\r\n            placeholder=\" \"\r\n            style=\"width: 100%\">\r\n          </kendo-datepicker>\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"rsvpDueDate\" class=\"active\">\r\n            RSVP Deadline\r\n          </label>\r\n          <kendo-datepicker #rsvpDueDate\r\n            id=\"rsvpDueDate\" name=\"rsvpDueDate\"\r\n            [(ngModel)]=\"event.RsvpDueDate\"\r\n            placeholder=\" \"\r\n            style=\"width: 100%\">\r\n          </kendo-datepicker>\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"dataDueDate\" class=\"active\">\r\n            Response Deadline\r\n          </label>\r\n          <kendo-datepicker #dataDueDate\r\n            id=\"dataDueDate\" name=\"dataDueDate\"\r\n            [(ngModel)]=\"event.DataDueDate\"\r\n            placeholder=\" \"\r\n            style=\"width: 100%\">\r\n          </kendo-datepicker>\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"segments\" class=\"active\">\r\n            Participating Segment(s)\r\n          </label>\r\n          <kendo-multiselect\r\n            name=\"segments\"\r\n            [disabled]=\"userRole != Role.Lead && userRole != Role.Support\"\r\n            [data]=\"segmentList\"\r\n            [(ngModel)]=\"selectedSegments\">\r\n          </kendo-multiselect>\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"tier\" class=\"active\">Tier</label>\r\n          <kendo-dropdownlist\r\n            name=\"tier\"\r\n            [disabled]=\"userRole != Role.Lead && userRole != Role.Support\"\r\n            [data]=\"tierList\"\r\n            [(ngModel)]=\"event.Tier\"\r\n            style=\"width: 100%\">\r\n          </kendo-dropdownlist>\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"showType\" class=\"active\">\r\n            Show Type <span class=\"text-danger\">*</span>\r\n          </label>\r\n          <kendo-dropdownlist\r\n            name=\"showType\"\r\n            [data]=\"showtypeList\"\r\n            [textField]=\"'text'\"\r\n            [valueField]=\"'value'\"\r\n            [defaultItem]=\"ShowType.Unknown\"\r\n            [valuePrimitive]=\"true\"\r\n            [disabled]=\"userRole != Role.Lead && userRole != Role.Support\"\r\n            [(ngModel)]=\"event.ShowType\"\r\n            style=\"width:100%\">\r\n          </kendo-dropdownlist>\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"estAttCount\" class=\"active\">\r\n            Estimated Number of Attendees\r\n          </label>\r\n          <input type=\"text\" id=\"estAttCount\" name=\"estAttCount\" class=\"form-control\"\r\n            [(ngModel)]=\"event.EstAttendCount\"\r\n            [disabled]=\"userRole != Role.Lead && userRole != Role.Support\"\r\n            pattern=\"^[0-9]*$\">\r\n        </div>\r\n        <div class=\"row\">\r\n          <div class=\"col-md-7\">\r\n            <div class=\"md-form\">\r\n              <label for=\"roomCount\" class=\"active\">\r\n                Estimated Hotel Rooms Per Day\r\n              </label>\r\n              <kendo-numerictextbox #roomCount\r\n                [format]=\"'n0'\">\r\n              </kendo-numerictextbox>\r\n              <small>\r\n                <a (click)=\"addRoomBlock()\">\r\n                  <i class=\"text-info fa fa-plus-circle fa-lg mr-1\" aria-hidden=\"true\"></i> Add Hotel Block\r\n                </a>\r\n              </small>\r\n            </div>\r\n          </div>\r\n          <div class=\"col-md-5\">\r\n            <div class=\"md-form\">\r\n              <label for=\"roomDate\" class=\"active\">\r\n                Date\r\n              </label>\r\n              <kendo-datepicker #roomDate\r\n                id=\"roomDate\" name=\"roomDate\"\r\n                placeholder=\" \"\r\n                style=\"width: 100%\">\r\n              </kendo-datepicker>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class=\"row\" *ngFor=\"let block of roomBlockList; let i = index\">\r\n          <div class=\"col-md-7\">\r\n            <kendo-numerictextbox id=\"rb{{i}}\" name=\"rb{{i}}\"\r\n              [value]=\"roomBlockList[i].EstRoomCount\"\r\n              [(ngModel)]=\"roomBlockList[i].EstRoomCount\"\r\n              [format]=\"'n0'\">\r\n            </kendo-numerictextbox>\r\n          </div>\r\n          <div class=\"col-md-4\">\r\n            <div class=\"valign-middle\">\r\n              {{ roomBlockList[i].Date | date : 'MM/dd/yyyy' }}\r\n            </div>\r\n          </div>\r\n          <div class=\"col-md-1\">\r\n            <a class=\"valign-middle\" style=\"right: 15px\" (click)=\"removeRoomBlock($event)\" [attr.data-index]=\"i\">\r\n              <i class=\"text-warning fa fa-minus-circle fa-lg mr-1\" aria-hidden=\"true\"></i>\r\n            </a>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-md-6\">\r\n        <h6 class=\"pb-2\">LOCATION DETAILS</h6>\r\n        <div class=\"md-form\">\r\n          <label for=\"location\" class=\"active\">Location (Country, State, City etc)</label>\r\n          <input type=\"text\" id=\"location\" name=\"location\" class=\"form-control\"\r\n            [disabled]=\"userRole != Role.Lead && userRole != Role.Support\"\r\n            [(ngModel)]=\"event.Location\">\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"venue\" class=\"active\">Venue</label>\r\n          <input type=\"text\" id=\"venue\" name=\"venue\" class=\"form-control\"\r\n            [disabled]=\"userRole != Role.Lead && userRole != Role.Support\"\r\n            [(ngModel)]=\"event.Venue\">\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"housingLink\" class=\"active\">Housing Bureau Link (if applicable)</label>\r\n          <input type=\"text\" id=\"housingLink\" name=\"housingLink\" class=\"form-control\"\r\n            [(ngModel)]=\"event.BureauLink\">\r\n        </div>\r\n        <div class=\"md-form pb-3\">\r\n          <label for=\"hotel\" class=\"active\">Hotel Name(s)</label>\r\n          <div class=\"row pt-2\" *ngFor=\"let name of hotelList; let i = index\">\r\n            <div class=\"col-md-auto\">\r\n              <a class=\"valign-middle\" (click)=\"removeHotel($event)\" [attr.data-index]=\"i\">\r\n                <i class=\"text-warning fa fa-minus-circle fa-lg mr-1\" aria-hidden=\"true\"></i>\r\n              </a>\r\n            </div>\r\n            <div class=\"col pl-2\">\r\n              {{ name }}\r\n            </div>\r\n          </div>\r\n          <div class=\"row\">\r\n            <div class=\"col-md\">\r\n              <input type=\"text\" id=\"hotel\" name=\"hotel\" class=\"form-control py-2 mb-0\" maxlength=\"50\" #hotel>\r\n              <small>\r\n                <a (click)=\"addHotel()\">\r\n                  <i class=\"text-info fa fa-plus-circle fa-lg mr-1\" aria-hidden=\"true\"></i> Add Hotel\r\n                </a>\r\n              </small>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <h6 class=\"pb-2 pt-3\">ORGANIZERS</h6>\r\n        <div class=\"md-form pb-3\">\r\n          <label for=\"owner\" class=\"active\">\r\n            Lead Organizer <span class=\"text-danger\">*</span>\r\n          </label>\r\n          <app-person-finder id=\"owner\" name=\"owner\" \r\n            [disabled]=\"userRole != Role.Lead && userRole != Role.Support\"\r\n            [(ngModel)]=\"event.OwnerUsername\">\r\n          </app-person-finder>\r\n        </div>\r\n        <div class=\"md-form pb-3\">\r\n          <label for=\"support\" class=\"active\">Support Organizers</label>\r\n          <div class=\"row pt-2\" *ngFor=\"let user of supportList; let i = index\">\r\n            <div class=\"col-md-auto\">\r\n              <a class=\"valign-middle\" (click)=\"removeSupport($event)\" [attr.data-index]=\"i\">\r\n                <i class=\"fa fa-minus-circle fa-lg mr-1\" aria-hidden=\"true\"\r\n                  [class.text-warning]=\"userRole == Role.Lead || userRole == Role.Support\"\r\n                  [class.text-muted]=\"userRole != Role.Lead && userRole != Role.Support\">\r\n                </i>\r\n              </a>\r\n            </div>\r\n            <div class=\"col pl-2\">\r\n              {{ user.DisplayName }}\r\n            </div>\r\n          </div>\r\n          <div class=\"row\" *ngIf=\"userRole == Role.Lead || userRole == Role.Support\">\r\n            <div class=\"col-md\">\r\n              <app-person-finder id=\"support\" name=\"support\" [usePrimitive]=\"false\" #supportPF></app-person-finder>\r\n              <small>\r\n                <a (click)=\"addSupport()\">\r\n                  <i class=\"text-info fa fa-plus-circle fa-lg mr-1\" aria-hidden=\"true\"></i> Add Support Organizer\r\n                </a>\r\n              </small>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class=\"md-form pb-3\">\r\n          <label for=\"travel\" class=\"active\">BCD Contacts</label>\r\n          <div class=\"row pt-2\" *ngFor=\"let user of travelList; let i = index\">\r\n            <div class=\"col-md-auto\">\r\n              <a class=\"valign-middle\" (click)=\"removeTravel($event)\" [attr.data-index]=\"i\">\r\n                <i class=\"fa fa-minus-circle fa-lg mr-1\" aria-hidden=\"true\"\r\n                  [class.text-warning]=\"userRole == Role.Lead || userRole == Role.Support\"\r\n                  [class.text-muted]=\"userRole != Role.Lead && userRole != Role.Support\">\r\n                </i>\r\n              </a>\r\n            </div>\r\n            <div class=\"col pl-2\">\r\n              {{ user.DisplayName }}\r\n            </div>\r\n          </div>\r\n          <div class=\"row\" *ngIf=\"userRole == Role.Lead || userRole == Role.Support\">\r\n            <div class=\"col-md\">\r\n              <app-person-finder id=\"travel\" name=\"travel\" [usePrimitive]=\"false\" #travelPF></app-person-finder>\r\n              <small>\r\n                <a (click)=\"addTravel()\">\r\n                  <i class=\"text-info fa fa-plus-circle fa-lg mr-1\" aria-hidden=\"true\"></i> Add BCD Contact\r\n                </a>\r\n              </small>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class=\"md-form pb-3\">\r\n          <label for=\"business\" class=\"active\">Business Leads (if applicable)</label>\r\n          <div class=\"row pt-2\" *ngFor=\"let user of businessList; let i = index\">\r\n            <div class=\"col-md-auto\">\r\n              <a class=\"valign-middle\" (click)=\"removeBusiness($event)\" [attr.data-index]=\"i\">\r\n                <i class=\"fa fa-minus-circle fa-lg mr-1\" aria-hidden=\"true\"\r\n                  [class.text-warning]=\"userRole == Role.Lead || userRole == Role.Support\"\r\n                  [class.text-muted]=\"userRole != Role.Lead && userRole != Role.Support\">\r\n                </i>\r\n              </a>\r\n            </div>\r\n            <div class=\"col pl-2\">\r\n              {{ user.DisplayName }}\r\n            </div>\r\n          </div>\r\n          <div class=\"row\" *ngIf=\"userRole == Role.Lead || userRole == Role.Support\">\r\n            <div class=\"col-md\">\r\n              <app-person-finder id=\"business\" name=\"business\" [usePrimitive]=\"false\" #businessPF></app-person-finder>\r\n              <small>\r\n                <a (click)=\"addBusiness()\">\r\n                  <i class=\"text-info fa fa-plus-circle fa-lg mr-1\" aria-hidden=\"true\"></i> Add Business Lead\r\n                </a>\r\n              </small>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        \r\n      </div>\r\n    </form> \r\n    <div class=\"alert alert-danger m-0 py-1 mr-3\" role=\"alert\" [hidden]=\"!errorMsg\">\r\n      <i class=\"fa fa-exclamation-circle fa-lg\" aria-hidden=\"true\"></i>&nbsp; {{errorMsg}}\r\n    </div>\r\n  </div>\r\n  <div class=\"modal-body\" *ngIf=\"showCreateSuccess\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-auto\">\r\n        <i class=\"text-info fa fa-check-circle fa-5x mt-3\" style=\"font-size: 128px\" aria-hidden=\"true\"></i>\r\n      </div>\r\n      <div class=\"col-md\">\r\n        <div class=\"pb-3\">This event has been created and you have access to update attendee lists and information.</div>\r\n        <div class=\"font-weight-bold\">Please keep in mind:</div>\r\n        <ul>\r\n          <li>Email reminders will be sent automatically to event leads, BCD Travel, Business Leads and attendees</li>\r\n        </ul>\r\n        <div class=\"pb-3\">You can update this by going to the Settings tab of your new event</div>\r\n        <div>\r\n          <button type=\"button\" class=\"btn btn-secondary px-3\" (click)=\"cancelPopup()\">BACK TO EVENT LIST</button>\r\n          <button type=\"button\" class=\"btn btn-primary px-3\" (click)=\"onGotoEvent()\">VIEW NEW EVENT</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"modal-footer\">\r\n    <button type=\"button\" *ngIf=\"!showCreateSuccess\" class=\"btn btn-secondary btn-sm px-3\" (click)=\"cancelPopup()\">CANCEL</button>\r\n    <button type=\"button\" *ngIf=\"!showCreateSuccess\" class=\"btn btn-primary btn-sm px-4\" [disabled]=\"!IsValid\" (click)=\"f.ngSubmit.emit()\">SAVE</button>\r\n  </div>\r\n</div>"

/***/ }),

/***/ "./src/app/event-edit-popup/event-edit-popup.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/event-edit-popup/event-edit-popup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EventEditPopupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_service__ = __webpack_require__("./src/app/common.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__progress_kendo_angular_dateinputs__ = __webpack_require__("./node_modules/@progress/kendo-angular-dateinputs/dist/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__person_finder_person_finder_component__ = __webpack_require__("./src/app/person-finder/person-finder.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__progress_kendo_angular_inputs__ = __webpack_require__("./node_modules/@progress/kendo-angular-inputs/dist/es/index.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var EventEditPopupComponent = /** @class */ (function () {
    function EventEditPopupComponent(activeModal, service, router) {
        this.activeModal = activeModal;
        this.service = service;
        this.router = router;
        this.saveClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.ShowType = __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["e" /* ShowType */];
        this.Role = __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */];
        this.title = "Create New Event";
    }
    EventEditPopupComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.tierList = this.service.getTiers;
        this.service.getMyProfile().subscribe(function (user) {
            _this.currentUser = user;
            _this.onInputsChanged();
        });
        // Show Type Options Dropdown
        this.showtypeList = [];
        __WEBPACK_IMPORTED_MODULE_3__common_service__["a" /* CommonService */].enumToArray(__WEBPACK_IMPORTED_MODULE_5__shared_Enums__["e" /* ShowType */]).forEach(function (i) {
            var value = i;
            var text = __WEBPACK_IMPORTED_MODULE_3__common_service__["a" /* CommonService */].getShowTypeString(value);
            _this.showtypeList.push({ text: text, value: value });
        });
        this.service.getSegments()
            .subscribe(function (segs) {
            _this.segmentList = segs;
            if (!segs) {
                _this.activeModal.close();
            }
        }, function (err) {
            _this.activeModal.close();
        });
    };
    EventEditPopupComponent.prototype.onInputsChanged = function () {
        var _this = this;
        if (this.eventToEdit) {
            this.title = "Edit Event";
            this.event = Object.assign({}, this.eventToEdit);
            if (this.eventToEdit.StartDate) {
                this.event.StartDate = new Date(this.eventToEdit.StartDate);
            }
            if (this.eventToEdit.EndDate) {
                this.event.EndDate = new Date(this.eventToEdit.EndDate);
            }
            if (this.eventToEdit.RsvpDueDate) {
                this.event.RsvpDueDate = new Date(this.eventToEdit.RsvpDueDate);
            }
            if (this.eventToEdit.DataDueDate) {
                this.event.DataDueDate = new Date(this.eventToEdit.DataDueDate);
            }
        }
        else {
            this.event = {};
            this.event.SendReminders = true;
            this.isNewEvent = true;
        }
        if (!this.event.OwnerUsername && this.currentUser) {
            this.event.OwnerUsername = this.currentUser.Username;
        }
        this.selectedSegments = [];
        if (this.event.Segments) {
            this.selectedSegments = this.event.Segments.split(',');
        }
        this.hotelList = [];
        if (this.event.Hotels) {
            this.hotelList = this.event.Hotels.split('|');
        }
        this.roomBlockList = [];
        if (this.event.RoomBlocks) {
            this.event.RoomBlocks.forEach(function (b) {
                _this.roomBlockList.push({
                    Date: new Date(b.Date),
                    EstRoomCount: b.EstRoomCount
                });
            });
        }
        this.supportList = [];
        this.travelList = [];
        this.businessList = [];
        if (this.event.Users) {
            this.event.Users.forEach(function (u) {
                if (__WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Support == (u.Role & __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Support)) {
                    _this.supportList.push(u.User);
                }
                if (__WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Travel == (u.Role & __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Travel)) {
                    _this.travelList.push(u.User);
                }
                if (__WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Business == (u.Role & __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Business)) {
                    _this.businessList.push(u.User);
                }
            });
        }
        this.userRole = __WEBPACK_IMPORTED_MODULE_3__common_service__["a" /* CommonService */].getEventRole(this.currentUser, this.eventToEdit);
    };
    Object.defineProperty(EventEditPopupComponent.prototype, "eventToEdit", {
        get: function () {
            return this._eventToEdit;
        },
        set: function (event) {
            this._eventToEdit = event;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    EventEditPopupComponent.prototype.addSupport = function () {
        if (!this.supportPF.value) {
            return;
        }
        if (this.userRole != __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Lead && this.userRole != __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Support) {
            return;
        }
        var username = this.supportPF.value.Username;
        if (this.supportList.find(function (u) {
            return u.Username == username;
        })) {
            this.supportPF.value = null;
            return;
        }
        this.supportList.push(this.supportPF.value);
        this.supportPF.value = null;
    };
    EventEditPopupComponent.prototype.removeSupport = function (event) {
        if (this.userRole == __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Lead || this.userRole == __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Support) {
            var index = Number(event.currentTarget.dataset.index);
            if (index >= 0 && index < this.supportList.length) {
                this.supportList.splice(index, 1);
            }
        }
    };
    EventEditPopupComponent.prototype.addTravel = function () {
        if (!this.travelPF.value) {
            return;
        }
        if (this.userRole != __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Lead && this.userRole != __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Support) {
            return;
        }
        var username = this.travelPF.value.Username;
        if (this.travelList.find(function (u) {
            return u.Username == username;
        })) {
            this.travelPF.value = null;
            return;
        }
        this.travelList.push(this.travelPF.value);
        this.travelPF.value = null;
    };
    EventEditPopupComponent.prototype.removeTravel = function (event) {
        if (this.userRole == __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Lead || this.userRole == __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Support) {
            var index = Number(event.currentTarget.dataset.index);
            if (index >= 0 && index < this.travelList.length) {
                this.travelList.splice(index, 1);
            }
        }
    };
    EventEditPopupComponent.prototype.addBusiness = function () {
        if (!this.businessPF.value) {
            return;
        }
        if (this.userRole != __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Lead && this.userRole != __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Support) {
            return;
        }
        var username = this.businessPF.value.Username;
        if (this.businessList.find(function (u) {
            return u.Username == username;
        })) {
            this.businessPF.value = null;
            return;
        }
        this.businessList.push(this.businessPF.value);
        this.businessPF.value = null;
    };
    EventEditPopupComponent.prototype.removeBusiness = function (event) {
        if (this.userRole == __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Lead || this.userRole == __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Support) {
            var index = Number(event.currentTarget.dataset.index);
            if (index >= 0 && index < this.businessList.length) {
                this.businessList.splice(index, 1);
            }
        }
    };
    EventEditPopupComponent.prototype.addHotel = function () {
        if (!this.hotel.nativeElement.value) {
            return;
        }
        var name = this.hotel.nativeElement.value.toLowerCase();
        if (this.hotelList.find(function (h) {
            return name == h.toLowerCase();
        })) {
            this.hotel.nativeElement.value = "";
            return;
        }
        this.hotelList.push(this.hotel.nativeElement.value);
        this.hotel.nativeElement.value = null;
    };
    EventEditPopupComponent.prototype.removeHotel = function (event) {
        var index = Number(event.currentTarget.dataset.index);
        if (index >= 0 && index < this.hotelList.length) {
            this.hotelList.splice(index, 1);
        }
    };
    EventEditPopupComponent.prototype.addRoomBlock = function () {
        var _this = this;
        if (this.roomCount.value < 1) {
            return;
        }
        if (!this.roomDate.value) {
            return;
        }
        if (this.roomBlockList.some(function (b) {
            if (b.Date.getDate() == _this.roomDate.value.getDate() &&
                b.Date.getFullYear() == _this.roomDate.value.getFullYear() &&
                b.Date.getMonth() == _this.roomDate.value.getMonth()) {
                b.EstRoomCount = _this.roomCount.value;
                return true;
            }
        })) {
            return;
        }
        this.roomBlockList.push({
            Date: this.roomDate.value,
            EstRoomCount: this.roomCount.value
        });
        this.roomBlockList.sort(function (a, b) {
            return (a.Date > b.Date) ? 1 : ((b.Date > a.Date) ? -1 : 0);
        });
    };
    EventEditPopupComponent.prototype.removeRoomBlock = function (event) {
        var index = Number(event.currentTarget.dataset.index);
        if (index >= 0 && index < this.roomBlockList.length) {
            this.roomBlockList.splice(index, 1);
        }
    };
    EventEditPopupComponent.prototype.onStartChange = function (value) {
        if (!this.event.EndDate || value > this.event.EndDate) {
            this.event.EndDate = value;
        }
        if (this.event.RsvpDueDate && value < this.event.RsvpDueDate) {
            this.event.RsvpDueDate = value;
        }
        this.RsvpDueDate.max = value;
        if (this.event.DataDueDate && value < this.event.DataDueDate) {
            this.event.DataDueDate = value;
        }
        this.DataDueDate.max = value;
    };
    EventEditPopupComponent.prototype.onEndChange = function (value) {
        if (!this.event.StartDate || value < this.event.StartDate) {
            this.event.StartDate = value;
            this.onStartChange(value);
        }
    };
    EventEditPopupComponent.prototype.cancelPopup = function () {
        this.activeModal.close();
    };
    Object.defineProperty(EventEditPopupComponent.prototype, "IsValid", {
        get: function () {
            if (!this.event.Name) {
                return false;
            }
            if (!this.event.StartDate) {
                return false;
            }
            if (!this.event.EndDate) {
                return false;
            }
            if (!this.event.ShowType) {
                return false;
            }
            if (!this.event.OwnerUsername) {
                return false;
            }
            if (this.event.EstAttendCount) {
                if (isNaN(Number(this.event.EstAttendCount))) {
                    return false;
                }
                else if (this.event.EstAttendCount < 0) {
                    return false;
                }
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    EventEditPopupComponent.prototype.onGotoEvent = function () {
        this.router.navigate(['events', this.eventToEdit.ID]);
        this.activeModal.close();
    };
    EventEditPopupComponent.prototype.onSubmit = function (form) {
        var _this = this;
        this.addRoomBlock();
        this.addHotel();
        this.addSupport();
        this.addTravel();
        this.addBusiness();
        this.event.Segments = this.selectedSegments.join(',');
        this.event.Hotels = this.hotelList.join('|');
        this.event.RoomBlocks = [];
        // get room blocks
        this.roomBlockList.sort(function (a, b) {
            return (a.Date > b.Date) ? 1 : ((b.Date > a.Date) ? -1 : 0);
        }).forEach(function (b) {
            _this.event.RoomBlocks.push(b);
        });
        this.event.Users = [];
        // get support users
        this.supportList.forEach(function (u) {
            if (!_this.event.Users.find(function (f) {
                if (f.User.Username == u.Username) {
                    f.Role = f.Role | __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Support;
                    return true;
                }
                return false;
            })) {
                _this.event.Users.push({
                    Role: __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Support,
                    User: u
                });
            }
        });
        // get travel users
        this.travelList.forEach(function (u) {
            if (!_this.event.Users.find(function (f) {
                if (f.User.Username == u.Username) {
                    f.Role = f.Role | __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Travel;
                    return true;
                }
                return false;
            })) {
                _this.event.Users.push({
                    Role: __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Travel,
                    User: u
                });
            }
        });
        // get business users
        this.businessList.forEach(function (u) {
            if (!_this.event.Users.find(function (f) {
                if (f.User.Username == u.Username) {
                    f.Role = f.Role | __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Business;
                    return true;
                }
                return false;
            })) {
                _this.event.Users.push({
                    Role: __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Business,
                    User: u
                });
            }
        });
        this.isLoading = true;
        this.service.saveEventInfo(this.event)
            .subscribe(function (result) {
            _this.errorMsg = null;
            _this.saveClicked.emit(result);
            _this.isLoading = false;
            if (_this.isNewEvent) {
                _this.title = "New Event Created Successfully!";
                _this.eventToEdit = result;
                _this.showCreateSuccess = true;
            }
        }, function (error) {
            _this.errorMsg = error;
            _this.isLoading = false;
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("rsvpDueDate"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__progress_kendo_angular_dateinputs__["b" /* DatePickerComponent */])
    ], EventEditPopupComponent.prototype, "RsvpDueDate", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("dataDueDate"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__progress_kendo_angular_dateinputs__["b" /* DatePickerComponent */])
    ], EventEditPopupComponent.prototype, "DataDueDate", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("supportPF"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_6__person_finder_person_finder_component__["a" /* PersonFinderComponent */])
    ], EventEditPopupComponent.prototype, "supportPF", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("travelPF"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_6__person_finder_person_finder_component__["a" /* PersonFinderComponent */])
    ], EventEditPopupComponent.prototype, "travelPF", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("businessPF"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_6__person_finder_person_finder_component__["a" /* PersonFinderComponent */])
    ], EventEditPopupComponent.prototype, "businessPF", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("roomDate"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__progress_kendo_angular_dateinputs__["b" /* DatePickerComponent */])
    ], EventEditPopupComponent.prototype, "roomDate", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("roomCount"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_8__progress_kendo_angular_inputs__["b" /* NumericTextBoxComponent */])
    ], EventEditPopupComponent.prototype, "roomCount", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("hotel"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */])
    ], EventEditPopupComponent.prototype, "hotel", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */])
    ], EventEditPopupComponent.prototype, "saveClicked", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], EventEditPopupComponent.prototype, "eventToEdit", null);
    EventEditPopupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-event-edit',
            template: __webpack_require__("./src/app/event-edit-popup/event-edit-popup.component.html"),
            styles: [__webpack_require__("./src/app/event-edit-popup/event-edit-popup.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */],
            __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__["a" /* TradeshowService */],
            __WEBPACK_IMPORTED_MODULE_7__angular_router__["b" /* Router */]])
    ], EventEditPopupComponent);
    return EventEditPopupComponent;
}());



/***/ }),

/***/ "./src/app/event-field-popup/event-field-popup.component.html":
/***/ (function(module, exports) {

module.exports = "<div [class.loading]=\"isLoading\">\n  <div class=\"modal-header\">\n    <h5 class=\"modal-title w-100\">\n      {{field.ID > 0 ? \"Edit\" : \"Add\"}} {{field.Source ? \"\" : \"Custom\"}} Field\n    </h5>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"cancelPopup()\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n  </div>\n  <div class=\"modal-body\">\n    <form novalidate (ngSubmit)=\"onSubmit(f)\" #f=\"ngForm\">\n      <div class=\"md-form pb-3\">\n        <label for=\"fieldLabel\" class=\"active\">\n          Field Label <span class=\"text-danger\">*</span>\n        </label>\n        <input type=\"text\" id=\"fieldLabel\" name=\"fieldLabel\" class=\"form-control\"\n                maxlength=\"50\"\n                [(ngModel)]=\"field.Label\">\n      </div>\n      <div class=\"md-form pb-3\">\n        <label for=\"tooltip\" class=\"active\">Hint Text</label>\n        <input type=\"text\" id=\"tooltip\" name=\"tooltip\" class=\"form-control\"\n                maxlength=\"256\"\n                [(ngModel)]=\"field.Tooltip\">\n      </div>\n      <div class=\"md-form pb-3\">\n        <kendo-dropdownlist\n          name=\"required\"\n          [data]=\"requiredOptions\"\n          [textField]=\"'text'\"\n          [valueField]=\"'value'\"\n          [valuePrimitive]=\"true\"\n          [(ngModel)]=\"field.Required\"\n          style=\"width:100%\"\n          #req=\"ngModel\"\n          #requiredDropdown>\n        </kendo-dropdownlist>\n        <label for=\"required\" class=\"active\">\n          Required <span class=\"text-danger\">*</span>\n        </label>\n      </div>\n      <div class=\"md-form pb-3\">\n        <label for=\"inputtype\" class=\"active\">\n          Response Type <span class=\"text-danger\">*</span>\n        </label>\n        <kendo-dropdownlist \n          name=\"inputtype\"\n          [data]=\"inputOptions\"\n          [textField]=\"'text'\"\n          [valueField]=\"'value'\"\n          [defaultItem]=\"InputType.Unknown\"\n          [valuePrimitive]=\"true\"\n          [(ngModel)]=\"field.Input\"\n          [disabled]=\"field.Source\"\n          style=\"width:100%\"\n          #type=\"ngModel\"\n          #inputDropdown>\n        </kendo-dropdownlist>\n      </div>\n      <div class=\"md-form pb-3\" *ngIf=\"showOption\">\n        <label for=\"option\" class=\"active\">Field Choices <span class=\"text-danger\">*</span></label>\n        <div class=\"row pt-2\" *ngFor=\"let option of optionList; let i = index\">\n          <div class=\"col-md-auto\">\n            <a class=\"valign-middle\" (click)=\"removeOption($event)\" [attr.data-index]=\"i\">\n              <i class=\"text-warning fa fa-minus-circle fa-lg mr-1\" aria-hidden=\"true\"></i>\n            </a>\n          </div>\n          <div class=\"col pl-2\">\n            {{ option }}\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-md\">\n            <input type=\"text\" id=\"option\" name=\"option\" class=\"form-control\" maxlength=\"50\" #option>\n            <small>\n              <a (click)=\"addOption()\">\n                <i class=\"text-info fa fa-plus-circle fa-lg mr-1\" aria-hidden=\"true\"></i> Add Choice\n              </a>\n            </small>\n            <small class=\"text-danger ml-4\" [hidden]=\"!choiceErrMsg\">{{choiceErrMsg}}</small>\n          </div>\n        </div>\n      </div>\n    </form>\n    <div class=\"alert alert-danger m-0 py-1 mr-3\" role=\"alert\" [hidden]=\"!errorMsg\">\n      <i class=\"fa fa-exclamation-circle fa-lg\" aria-hidden=\"true\"></i>&nbsp; {{errorMsg}}\n    </div>\n  </div>\n  <div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-secondary btn-sm px-3\" (click)=\"cancelPopup()\">Cancel</button>\n    <button type=\"button\" class=\"btn btn-primary btn-sm px-4\" [disabled]=\"!isValid\" (click)=\"f.ngSubmit.emit()\">Save</button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/event-field-popup/event-field-popup.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/event-field-popup/event-field-popup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EventFieldPopupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_service__ = __webpack_require__("./src/app/common.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__progress_kendo_angular_dropdowns__ = __webpack_require__("./node_modules/@progress/kendo-angular-dropdowns/dist/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var EventFieldPopupComponent = /** @class */ (function () {
    function EventFieldPopupComponent(activeModal, service) {
        var _this = this;
        this.activeModal = activeModal;
        this.service = service;
        this.saveClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.InputType = __WEBPACK_IMPORTED_MODULE_2__shared_Enums__["b" /* InputType */];
        // Required Options Dropdown
        this.requiredOptions = [
            { text: "", value: null },
            { text: "Required", value: true },
            { text: "Optional", value: false }
        ];
        // Input Type Options Dropdown
        this.inputOptions = [];
        __WEBPACK_IMPORTED_MODULE_3__common_service__["a" /* CommonService */].enumToArray(__WEBPACK_IMPORTED_MODULE_2__shared_Enums__["b" /* InputType */]).forEach(function (i) {
            var value = i;
            var text = __WEBPACK_IMPORTED_MODULE_3__common_service__["a" /* CommonService */].getInputTypeString(i);
            _this.inputOptions.push({ text: text, value: value });
        });
    }
    EventFieldPopupComponent.prototype.ngOnInit = function () {
        if (!this.fieldToEdit || this.eventID < 1) {
            this.activeModal.close();
            return;
        }
        // Assign model field
        this.field = Object.assign({}, this.fieldToEdit);
        // Assign model option list
        if (this.field.Options) {
            this.optionList = this.field.Options.split('|');
        }
        else {
            this.optionList = [];
        }
    };
    Object.defineProperty(EventFieldPopupComponent.prototype, "showOption", {
        get: function () {
            return this.field.Input == __WEBPACK_IMPORTED_MODULE_2__shared_Enums__["b" /* InputType */].Select || this.field.Input == __WEBPACK_IMPORTED_MODULE_2__shared_Enums__["b" /* InputType */].MultiSelect;
        },
        enumerable: true,
        configurable: true
    });
    EventFieldPopupComponent.prototype.addOption = function () {
        if (!this.option.nativeElement.value) {
            this.choiceErrMsg = "Choice required";
            return;
        }
        var name = this.option.nativeElement.value.toLowerCase();
        if (name.indexOf('|') >= 0) {
            this.choiceErrMsg = "Invalid character(s): |";
            return;
        }
        if (this.optionList.find(function (h) {
            return name == h.toLowerCase();
        })) {
            this.option.nativeElement.value = "";
            this.choiceErrMsg = null;
            return;
        }
        this.optionList.push(this.option.nativeElement.value);
        this.option.nativeElement.value = null;
        this.choiceErrMsg = null;
    };
    EventFieldPopupComponent.prototype.removeOption = function (event) {
        var index = Number(event.currentTarget.dataset.index);
        if (index >= 0 && index < this.optionList.length) {
            this.optionList.splice(index, 1);
        }
    };
    EventFieldPopupComponent.prototype.cancelPopup = function () {
        this.activeModal.close();
    };
    Object.defineProperty(EventFieldPopupComponent.prototype, "isValid", {
        get: function () {
            if (!this.field.Label) {
                return false;
            }
            if (this.field.Required == null) {
                return false;
            }
            if (this.field.Input == __WEBPACK_IMPORTED_MODULE_2__shared_Enums__["b" /* InputType */].Unknown) {
                return false;
            }
            if (this.field.Input == __WEBPACK_IMPORTED_MODULE_2__shared_Enums__["b" /* InputType */].Select ||
                this.field.Input == __WEBPACK_IMPORTED_MODULE_2__shared_Enums__["b" /* InputType */].MultiSelect) {
                if (this.optionList.length == 0) {
                    return false;
                }
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    EventFieldPopupComponent.prototype.onSubmit = function (form) {
        var _this = this;
        if (!this.isValid) {
            return;
        }
        // Set Options
        this.field.Options = this.optionList.join('|');
        // Save the field
        this.isLoading = true;
        this.service.saveEventField(this.eventID, this.field)
            .subscribe(function (result) {
            _this.errorMsg = null;
            _this.saveClicked.emit(result);
            _this.isLoading = false;
            _this.activeModal.close();
        }, function (error) {
            _this.errorMsg = error;
            _this.isLoading = false;
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Number)
    ], EventFieldPopupComponent.prototype, "eventID", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], EventFieldPopupComponent.prototype, "fieldToEdit", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */])
    ], EventFieldPopupComponent.prototype, "saveClicked", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("requiredDropdown"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__progress_kendo_angular_dropdowns__["b" /* DropDownListComponent */])
    ], EventFieldPopupComponent.prototype, "requiredDropdown", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("inputDropdown"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__progress_kendo_angular_dropdowns__["b" /* DropDownListComponent */])
    ], EventFieldPopupComponent.prototype, "inputDropdown", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("option"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */])
    ], EventFieldPopupComponent.prototype, "option", void 0);
    EventFieldPopupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-event-field-popup',
            template: __webpack_require__("./src/app/event-field-popup/event-field-popup.component.html"),
            styles: [__webpack_require__("./src/app/event-field-popup/event-field-popup.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */],
            __WEBPACK_IMPORTED_MODULE_5__tradeshow_service__["a" /* TradeshowService */]])
    ], EventFieldPopupComponent);
    return EventFieldPopupComponent;
}());



/***/ }),

/***/ "./src/app/event-info/event-info.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"p-3\">\n  <div class=\"row\" *ngIf=\"!readonly\">\n    <div class=\"col\">\n      <span [class.text-success]=\"eventStatus == 'PAST'\"\n            [class.text-info]=\"eventStatus == 'UPCOMING'\">{{eventStatus}}</span>\n    </div>\n    <div class=\"col-md-auto text-right\">\n      <a class=\"waves-effect waves-light\" [class.invisible]=\"!showEditLink\" (click)=\"popupEditEvent()\">\n        <i aria-hidden=\"true\" class=\"fa fa-pencil-square fa-2x\"></i>\n      </a>\n    </div>\n  </div>\n  <div class=\"row mb-3\">\n    <div class=\"col\">\n      <span class=\"h4 card-title\">{{event.Name}}</span>\n    </div>\n  </div>\n  <div class=\"row\" *ngIf=\"event?.Description\">\n    <div class=\"col\">\n      <p><strong>Event Description</strong></p>\n      <p>{{event.Description}}</p>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-md-3\">\n      <div>\n        <strong>Venue:</strong> {{event.Venue}}\n      </div>\n      <div>\n        <strong>Start Date:</strong> {{event.StartDate | date:'MMM d, yyyy'}}\n      </div>\n      <div>\n        <strong>End Date:</strong> {{event.EndDate | date:'MMM d, yyyy'}}\n      </div>\n      <div>\n        <strong>Segments:</strong> {{event.Segments | replace:',':', '}}\n      </div>\n    </div>\n    <div class=\"col-md-3\">\n      <div>\n        <strong>Location:</strong>\n      </div>\n      <div>\n        {{ event.Location }}\n      </div>\n    </div>\n    <div class=\"col-md-3\">\n      <div>\n        <strong>Tier:</strong> {{event.Tier}}\n      </div>\n      <div>\n        <strong>Show Type:</strong> {{HelperSvc.getShowTypeString(event.ShowType)}}\n      </div>\n      <div>\n        <strong>RSVPs Due:</strong> {{event.RsvpDueDate | date:'MMM d, yyyy'}}\n      </div>\n      <div>\n        <strong>Responses Due:</strong> {{event.DataDueDate | date:'MMM d, yyyy'}}\n      </div>\n    </div>\n    <div class=\"col-md-3\" style=\"overflow-x: hidden;\">\n      <div>\n        <strong>Event Points of Contact</strong>\n      </div>\n      <div>\n        {{event.Owner?.FirstName}} {{event.Owner?.LastName}} (Lead) <a href=\"mailto:{{event.Owner?.Email}}\">{{event.Owner?.Email}}</a>\n      </div>\n      <ng-template ngFor let-u let-i=\"index\" [ngForOf]=\"event.Users | eventUserFilter : Role.Travel\">\n        <div *ngIf=\"showAllInfo || i == 0\">\n            {{ u.User.FirstName }} {{ u.User.LastName }} (BCD) <a href=\"mailto:{{u.User.Email}}\">{{ u.User.Email }}</a>\n        </div>\n      </ng-template>\n    </div>\n  </div>\n  <div class=\"row mt-3\" *ngIf=\"showAllInfo\">\n    <div class=\"col-md-3\">\n      <div>\n        <strong>Estimated Attendees:</strong> {{ event.EstAttendCount }}\n      </div>\n      <div class=\"mt-3\">\n        <strong>Housing Bureau Link:</strong> {{ event.BureauLink }}\n      </div>\n      <div class=\"mt-3\">\n        <strong>Hotels</strong>\n      </div>\n      <div *ngFor=\"let hotel of event.Hotels?.split('|')\">\n        {{hotel}}\n      </div>\n    </div>\n    <div class=\"col-md-3\">\n      <div>\n        <strong>Room Blocks Needed per Day</strong>\n      </div>\n      <div *ngFor=\"let block of event.RoomBlocks; let i = index\">\n        {{i + 1}}. {{block.EstRoomCount}} on {{block.Date | date : 'MM/dd/yyyy'}}\n      </div>\n    </div>\n    <div class=\"col-md-3\">\n      <div>\n        <strong>Support Organizers</strong>\n      </div>\n      <div *ngFor=\"let u of event.Users | eventUserFilter : Role.Support\">\n        {{ u.User.FirstName }} {{ u.User.LastName }} <a href=\"mailto:{{u.User.Email}}\">{{ u.User.Email }}</a>\n      </div>\n    </div>\n    <div class=\"col-md-3\">\n      <div>\n        <strong>Business Leads</strong>\n      </div>\n      <div *ngFor=\"let u of event.Users | eventUserFilter : Role.Business\">\n          {{ u.User.FirstName }} {{ u.User.LastName }} <a href=\"mailto:{{u.User.Email}}\">{{ u.User.Email }}</a>\n        </div>\n    </div>\n  </div>\n  <div class=\"row mt-3\" *ngIf=\"!readonly\">\n    <div class=\"col text-right\">\n      <a class=\"waves-effect waves-light text-info\" (click)=\"toggleShowAll()\">\n        VIEW {{showAllInfo ? 'LESS' : 'MORE' }} \n        <i class=\"fa \" aria-hidden=\"true\"\n          [class.fa-chevron-circle-up]=\"showAllInfo\" \n          [class.fa-chevron-circle-down]=\"!showAllInfo\"></i>\n      </a>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/event-info/event-info.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/event-info/event-info.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EventInfoComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_service__ = __webpack_require__("./src/app/common.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__event_edit_popup_event_edit_popup_component__ = __webpack_require__("./src/app/event-edit-popup/event-edit-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pagetitle_service__ = __webpack_require__("./src/app/pagetitle.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var EventInfoComponent = /** @class */ (function () {
    function EventInfoComponent(pagesvc, service, modal) {
        this.pagesvc = pagesvc;
        this.service = service;
        this.modal = modal;
        this.eventChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.HelperSvc = __WEBPACK_IMPORTED_MODULE_1__common_service__["a" /* CommonService */];
        this.Role = __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */];
        this.showEditLink = false;
        this.showAllInfo = false;
    }
    EventInfoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getMyProfile().subscribe(function (user) {
            _this.currentUser = user;
            _this.onInputsChanged();
        });
    };
    EventInfoComponent.prototype.popupEditEvent = function () {
        var _this = this;
        if (!this.showEditLink) {
            return;
        }
        var modalOptions = { size: "lg" };
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_3__event_edit_popup_event_edit_popup_component__["a" /* EventEditPopupComponent */], modalOptions);
        popupModalRef.componentInstance.eventToEdit = this.event;
        popupModalRef.componentInstance.saveClicked.subscribe(function (event) {
            _this.event = event;
            _this.eventChange.emit(event);
            popupModalRef.close();
        });
    };
    EventInfoComponent.prototype.toggleShowAll = function () {
        this.showAllInfo = !this.showAllInfo;
    };
    EventInfoComponent.prototype.onInputsChanged = function () {
        this.showEditLink = !this.readonly &&
            __WEBPACK_IMPORTED_MODULE_1__common_service__["a" /* CommonService */].canEditEvent(this.currentUser, this.event);
    };
    Object.defineProperty(EventInfoComponent.prototype, "event", {
        get: function () {
            return this._event;
        },
        set: function (event) {
            this._event = event;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventInfoComponent.prototype, "readonly", {
        get: function () {
            return this._readonly;
        },
        set: function (readonly) {
            this._readonly = readonly;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventInfoComponent.prototype, "eventStatus", {
        get: function () {
            var now = new Date(Date.now());
            var start = new Date(this.event.StartDate);
            if (start > now) {
                return "UPCOMING";
            }
            else {
                return "PAST";
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", Object)
    ], EventInfoComponent.prototype, "eventChange", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], EventInfoComponent.prototype, "event", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], EventInfoComponent.prototype, "readonly", null);
    EventInfoComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-event-info',
            template: __webpack_require__("./src/app/event-info/event-info.component.html"),
            styles: [__webpack_require__("./src/app/event-info/event-info.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__pagetitle_service__["a" /* PageTitleService */],
            __WEBPACK_IMPORTED_MODULE_6__tradeshow_service__["a" /* TradeshowService */],
            __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["b" /* NgbModal */]])
    ], EventInfoComponent);
    return EventInfoComponent;
}());



/***/ }),

/***/ "./src/app/event-list/event-list.component.html":
/***/ (function(module, exports) {

module.exports = "\n<div class=\"bg-white\" style=\"display: flex\">\n  <div style=\"width:100%;\">\n    <div class=\"tabs-wrapper\">\n      <ul class=\"nav classic-tabs tabs-white\" role=\"tablist\">\n        <li class=\"nav-item ml-3\">\n          <a class=\"nav-link waves-light waves-effect active show\">All Events</a>\n        </li>\n      </ul>\n    </div>\n  </div>\n  <div class=\"text-right\">\n    <button type=\"button\" *ngIf=\"showAddEvent\"\n            class=\"btn btn-info waves-effect waves-light\" \n            (click)=\"popupNewEvent()\">\n            Add&nbsp;Event\n    </button>\n  </div>\n</div>\n\n<div class=\"mt-3 ml-3\">\n  \n  <div class=\"card card-inline mr-3 mb-3\">\n    <div>\n      <div class=\"card-body text-center d-inline-block\">\n        <p class=\"mb-1\">Upcoming&nbsp;Events</p>\n        <h2>{{results?.Upcoming}}</h2>\n      </div>\n      <div class=\"card-body text-center d-inline-block\"\n           *ngFor=\"let key of results?.Segments | keys\">\n        <p class=\"mb-1\">{{key}}</p>\n        <h2>{{results?.Segments[key]}}</h2>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"card card-inline mr-3 mb-3\">\n    <div class=\"card-body text-center\">\n      <p class=\"mb-1\">Past&nbsp;Events</p>\n      <h2>{{results?.Past}}</h2>\n    </div>\n  </div>\n\n  <div class=\"card card-inline mr-3 mb-3\">\n    <div class=\"card-body\">\n      <p class=\"mb-0\">Date Filter</p>\n      <div style=\"margin-bottom: 9px;\">\n          <kendo-datepicker #startRange\n            [(ngModel)]=\"startDate\"\n            (valueChange)=\"onStartChange($event)\"\n            formatPlaceholder=\"narrow\"\n            placeholder=\"Start date\"\n            style=\"width: 120px;\">\n          </kendo-datepicker>\n          <kendo-datepicker #endRange\n            [(ngModel)]=\"endDate\"\n            (valueChange)=\"onEndChange($event)\"\n            formatPlaceholder=\"narrow\"\n            placeholder=\"End date\"\n            class=\"ml-3\"\n            style=\"width: 120px;\">\n          </kendo-datepicker>\n          <button class=\"btn btn-info waves-effect waves-light my-1 ml-3\" (click)=\"dateRangeChange()\">GO</button>\n      </div>\n    </div>\n  </div>\n\n</div>\n\n<div class=\"card-grid mx-3\">\n  <h6 class=\"p-3 m-0\">All Events</h6>\n  <kendo-grid #eventsGrid\n      [data]=\"view\"\n      [pageable]=\"true\"\n      [pageSize]=\"state.take\"\n      [skip]=\"state.skip\"\n      [sortable]=\"true\"\n      [sort]=\"state.sort\"\n      filterable=\"menu\"\n      [filter]=\"state.filter\"\n      (sortChange)=\"sortChange($event)\"\n      (dataStateChange)=\"dataStateChange($event)\"\n      style=\"height: calc(100vh - 296px);\"\n    >\n    <kendo-grid-column field=\"Name\" [width]=\"225\" [minResizableWidth]=\"225\">\n      <ng-template kendoGridCellTemplate let-dataItem let-rowIndex=\"rowIndex\">\n        <a class=\"text-info\" [routerLink]=\"[dataItem.ID]\">{{dataItem.Name}}</a>\n      </ng-template>\n      <ng-template kendoGridFilterMenuTemplate let-filter let-column=\"column\" let-filterService=\"filterService\">\n        <kendo-grid-string-filter-menu [column]=\"column\" [extra]=\"false\" [filter]=\"filter\" [filterService]=\"filterService\">\n            <kendo-filter-contains-operator></kendo-filter-contains-operator>\n            <kendo-filter-startswith-operator></kendo-filter-startswith-operator>\n            <kendo-filter-endswith-operator></kendo-filter-endswith-operator>\n        </kendo-grid-string-filter-menu>\n      </ng-template>\n    </kendo-grid-column>\n    <kendo-grid-column field=\"StartDate\" title=\"Start Date\" [filterable]=\"false\" [width]=\"150\" [minResizableWidth]=\"150\">\n      <ng-template kendoGridCellTemplate let-dataItem let-rowIndex=\"rowIndex\">\n        {{dataItem.StartDate | date:'MM/dd/yyyy'}}\n      </ng-template>\n    </kendo-grid-column>\n    <kendo-grid-column field=\"Segments\">\n      <ng-template kendoGridFilterMenuTemplate\n        let-column=\"column\"\n        let-filter=\"filter\"\n        let-filterService=\"filterService\"\n        >\n        <grid-seg-filter\n          [isPrimitive]=\"true\"\n          [showFilter]=\"false\"\n          [field]=\"column.field\"\n          [filterService]=\"filterService\"\n          [currentFilter]=\"filter\"\n          [data]=\"segments\"></grid-seg-filter>\n      </ng-template>\n      <ng-template kendoGridCellTemplate let-dataItem let-rowIndex=\"rowIndex\">\n        {{dataItem.Segments | replace:',':', '}}\n      </ng-template>\n    </kendo-grid-column>\n    <kendo-grid-column field=\"OwnerName\" title=\"Lead Organizer\" [filterable]=\"false\"></kendo-grid-column>\n    <kendo-grid-column field=\"EstAttendeeCount\" title=\"Estimated Attendees\" [filterable]=\"false\">\n      <ng-template kendoGridFilterMenuTemplate let-filter let-column=\"column\" let-filterService=\"filterService\">\n        <kendo-grid-numeric-filter-menu\n            [column]=\"column\"\n            [extra]=\"false\"\n            [filter]=\"filter\"\n            [filterService]=\"filterService\"\n            >\n        </kendo-grid-numeric-filter-menu>\n      </ng-template>\n    </kendo-grid-column>\n    <kendo-grid-column field=\"ActAttendeeCount\" title=\"Actual Attendees\" [filterable]=\"false\"></kendo-grid-column>\n    <kendo-grid-column field=\"Status\" [width]=\"115\" [minResizableWidth]=\"115\" [filterable]=\"false\">\n      <ng-template kendoGridCellTemplate let-dataItem>\n        <span [class.text-info]=\"dataItem.Status == 'Upcoming'\"\n              [class.text-success]=\"dataItem.Status == 'Past'\">\n          {{ dataItem.Status }}\n        </span>\n      </ng-template>\n    </kendo-grid-column>\n  </kendo-grid>\n</div>"

/***/ }),

/***/ "./src/app/event-list/event-list.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/event-list/event-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EventListComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__event_edit_popup_event_edit_popup_component__ = __webpack_require__("./src/app/event-edit-popup/event-edit-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__progress_kendo_angular_grid__ = __webpack_require__("./node_modules/@progress/kendo-angular-grid/dist/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var flatten = function (filter) {
    var filters = (filter || {}).filters;
    if (filters) {
        return filters.reduce(function (acc, curr) { return acc.concat(curr.filters ? flatten(curr) : [curr]); }, []);
    }
    return [];
};
var EventListComponent = /** @class */ (function () {
    function EventListComponent(router, modal, service) {
        this.router = router;
        this.modal = modal;
        this.service = service;
        this.segments = [];
        // init grid state
        this.state = this.service.eventListState;
        // init query results
        this.results = {
            Upcoming: 0,
            Past: 0,
            Total: 0
        };
    }
    EventListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.state.filter.filters.forEach(function (filter) {
            var cfd = filter;
            cfd.filters.forEach(function (f) {
                var fd = f;
                if (fd && fd.field == "StartDate") {
                    if (fd.operator == "gt") {
                        _this.startDate = new Date(fd.value);
                    }
                    else if (fd.operator == "lt") {
                        _this.endDate = new Date(fd.value);
                    }
                }
            });
        });
        this.service.getSegments()
            .subscribe(function (segments) {
            _this.segments = segments;
            var segs = {};
            segments.forEach(function (segment) {
                segs[segment] = 0;
            });
            _this.results.Segments = segs;
        });
        this.service.getMyProfile().subscribe(function (me) {
            _this.showAddEvent = (__WEBPACK_IMPORTED_MODULE_6__shared_Enums__["c" /* Permissions */].CreateShows == (me.Privileges & __WEBPACK_IMPORTED_MODULE_6__shared_Enums__["c" /* Permissions */].CreateShows));
        });
        this.dataStateChange(this.state);
    };
    EventListComponent.prototype.loadEvents = function () {
        var _this = this;
        this.grid.loading = true;
        // convert to service params
        var params = {
            Skip: this.state.skip,
            Size: this.state.take,
            Sort: this.state.sort.map(function (s) {
                return {
                    Field: s.field,
                    Desc: s.dir == "desc"
                };
            }),
            Filters: flatten(this.state.filter).map(function (filter) {
                var fd = filter;
                return {
                    Field: fd.field,
                    Operator: fd.operator,
                    Value: fd.value
                };
            })
        };
        this.service.getEvents(params)
            .subscribe(function (results) {
            _this.results = results;
            _this.view = {
                data: results.Events,
                total: results.Total
            };
            _this.grid.loading = false;
        }, function (error) {
            // show error message.
            _this.grid.loading = false;
        });
    };
    EventListComponent.prototype.dateRangeChange = function () {
        this.dataStateChange(this.state);
    };
    EventListComponent.prototype.sortChange = function (sort) {
        this.state.sort = sort;
    };
    EventListComponent.prototype.dataStateChange = function (state) {
        this.state = state;
        this.service.eventListState = state;
        this.loadEvents();
    };
    EventListComponent.prototype.onStartChange = function (value) {
        var filter = this.state.filter.filters[0];
        if (filter) {
            var fd = filter.filters[0];
            fd.value = value;
        }
        if (value > this.endDate) {
            this.endDate = value;
            this.onEndChange(value);
        }
    };
    EventListComponent.prototype.onEndChange = function (value) {
        var filter = this.state.filter.filters[0];
        if (filter) {
            var fd = filter.filters[1];
            fd.value = value;
        }
        if (value < this.startDate) {
            this.startDate = value;
            this.onStartChange(value);
        }
    };
    EventListComponent.prototype.popupNewEvent = function () {
        var _this = this;
        var modalOptions = {
            size: "lg",
            beforeDismiss: function () {
                return false;
            }
        };
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_2__event_edit_popup_event_edit_popup_component__["a" /* EventEditPopupComponent */], modalOptions);
        popupModalRef.componentInstance.eventToEdit = null;
        popupModalRef.componentInstance.saveClicked.subscribe(function (event) {
            _this.dataStateChange(_this.state);
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("eventsGrid"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__progress_kendo_angular_grid__["b" /* GridComponent */])
    ], EventListComponent.prototype, "grid", void 0);
    EventListComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-event-list',
            template: __webpack_require__("./src/app/event-list/event-list.component.html"),
            styles: [__webpack_require__("./src/app/event-list/event-list.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__angular_router__["b" /* Router */],
            __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["b" /* NgbModal */],
            __WEBPACK_IMPORTED_MODULE_3__tradeshow_service__["a" /* TradeshowService */]])
    ], EventListComponent);
    return EventListComponent;
}());



/***/ }),

/***/ "./src/app/event-main/event-main.component.html":
/***/ (function(module, exports) {

module.exports = "<div style=\"margin-top: 49px;position: relative;\">\n  <app-event-list\n    *ngIf=\"(viewMode == EventViewMode.List)\">\n  </app-event-list>\n\n  <app-event-view\n    *ngIf=\"(viewMode == EventViewMode.Display)\"\n    [event]=\"activeEvent\">\n  </app-event-view>\n</div>"

/***/ }),

/***/ "./src/app/event-main/event-main.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/event-main/event-main.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EventMainComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pagetitle_service__ = __webpack_require__("./src/app/pagetitle.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_shared__ = __webpack_require__("./src/app/shared/shared.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__event_list_event_list_component__ = __webpack_require__("./src/app/event-list/event-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__event_view_event_view_component__ = __webpack_require__("./src/app/event-view/event-view.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var EventMainComponent = /** @class */ (function () {
    function EventMainComponent(pagetitle, service, router, route) {
        this.pagetitle = pagetitle;
        this.service = service;
        this.router = router;
        this.route = route;
        this.EventViewMode = __WEBPACK_IMPORTED_MODULE_3__shared_shared__["e" /* EventViewMode */];
        this.viewMode = __WEBPACK_IMPORTED_MODULE_3__shared_shared__["e" /* EventViewMode */].None;
    }
    EventMainComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.pagetitle.setLoading(true);
        setTimeout(function () {
            _this.pagetitle.setActivePage(__WEBPACK_IMPORTED_MODULE_3__shared_shared__["f" /* SideMenuMode */].Events, null);
        });
        var eventID = this.route.snapshot.params.id;
        var mode = __WEBPACK_IMPORTED_MODULE_3__shared_shared__["e" /* EventViewMode */].List;
        if (this.route.snapshot.data[0]) {
            mode = this.route.snapshot.data[0]['eventViewMode'];
        }
        // Validate user can be here
        this.service.getMyProfile()
            .subscribe(function (me) {
            if (me.Privileges == __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["c" /* Permissions */].None && (me.Role == __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].None || me.Role == __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Attendee)) {
                _this.router.navigate(['attendees', me.Username.toLowerCase()]);
                return;
            }
            _this.pagetitle.setLoading(false);
            switch (mode) {
                case __WEBPACK_IMPORTED_MODULE_3__shared_shared__["e" /* EventViewMode */].List:
                    _this.viewMode = mode;
                    break;
                case __WEBPACK_IMPORTED_MODULE_3__shared_shared__["e" /* EventViewMode */].Display:
                    _this.showEventInfo(eventID);
                    break;
            }
        }, function (err) {
            _this.router.navigate(['events']);
            _this.viewMode = __WEBPACK_IMPORTED_MODULE_3__shared_shared__["e" /* EventViewMode */].None;
            _this.pagetitle.setLoading(false);
        });
    };
    EventMainComponent.prototype.showEventInfo = function (eventID) {
        var _this = this;
        this.viewMode = __WEBPACK_IMPORTED_MODULE_3__shared_shared__["e" /* EventViewMode */].None;
        this.service.getEventInfo(eventID)
            .subscribe(function (event) {
            _this.activeEvent = event;
            _this.viewMode = __WEBPACK_IMPORTED_MODULE_3__shared_shared__["e" /* EventViewMode */].Display;
        }, function (err) {
            _this.router.navigate(['events']);
            _this.viewMode = __WEBPACK_IMPORTED_MODULE_3__shared_shared__["e" /* EventViewMode */].List;
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_6__event_list_event_list_component__["a" /* EventListComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_6__event_list_event_list_component__["a" /* EventListComponent */])
    ], EventMainComponent.prototype, "childList", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_7__event_view_event_view_component__["a" /* EventViewComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_7__event_view_event_view_component__["a" /* EventViewComponent */])
    ], EventMainComponent.prototype, "childView", void 0);
    EventMainComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-event-main',
            template: __webpack_require__("./src/app/event-main/event-main.component.html"),
            styles: [__webpack_require__("./src/app/event-main/event-main.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__pagetitle_service__["a" /* PageTitleService */],
            __WEBPACK_IMPORTED_MODULE_4__tradeshow_service__["a" /* TradeshowService */],
            __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */],
            __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* ActivatedRoute */]])
    ], EventMainComponent);
    return EventMainComponent;
}());



/***/ }),

/***/ "./src/app/event-users-popup/event-users-popup.component.html":
/***/ (function(module, exports) {

module.exports = "<div [class.loading]=\"isLoading\">\n  <div class=\"modal-header\">\n    <h5 class=\"modal-title w-100\">User Group Permissions</h5>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"cancelPopup()\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n  </div>\n  <div class=\"modal-body\">\n    <div class=\"md-form pb-3\">\n      <label for=\"owner\" class=\"active\">Lead Organizer <span class=\"text-danger\">*</span></label>\n      <app-person-finder id=\"owner\" name=\"owner\" [usePrimitive]=\"false\" [(ngModel)]=\"owner\"></app-person-finder>\n    </div>\n    <div class=\"md-form pb-3\">\n      <label for=\"support\" class=\"active\">Support Organizers</label>\n      <div class=\"row pt-2\" *ngFor=\"let user of supportList; let i = index\">\n        <div class=\"col-md-auto\">\n          <a class=\"valign-middle\" (click)=\"removeSupport($event)\" [attr.data-index]=\"i\">\n            <i class=\"text-warning fa fa-minus-circle fa-lg mr-1\" aria-hidden=\"true\"></i>\n          </a>\n        </div>\n        <div class=\"col pl-2\">\n          {{ user.DisplayName }}\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md\">\n          <app-person-finder id=\"support\" name=\"support\" [usePrimitive]=\"false\" #supportPF></app-person-finder>\n          <small>\n            <a (click)=\"addSupport()\">\n              <i class=\"text-info fa fa-plus-circle fa-lg mr-1\" aria-hidden=\"true\"></i> Add Support Organizer\n            </a>\n          </small>\n        </div>\n      </div>\n    </div>\n    <div class=\"md-form pb-3\">\n      <label for=\"travel\" class=\"active\">BCD Contacts</label>\n      <div class=\"row pt-2\" *ngFor=\"let user of travelList; let i = index\">\n        <div class=\"col-md-auto\">\n          <a class=\"valign-middle\" (click)=\"removeTravel($event)\" [attr.data-index]=\"i\">\n            <i class=\"text-warning fa fa-minus-circle fa-lg mr-1\" aria-hidden=\"true\"></i>\n          </a>\n        </div>\n        <div class=\"col pl-2\">\n          {{ user.DisplayName }}\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md\">\n          <app-person-finder id=\"travel\" name=\"travel\" [usePrimitive]=\"false\" #travelPF></app-person-finder>\n          <small>\n            <a (click)=\"addTravel()\">\n              <i class=\"text-info fa fa-plus-circle fa-lg mr-1\" aria-hidden=\"true\"></i> Add BCD Contact\n            </a>\n          </small>\n        </div>\n      </div>\n    </div>\n    <div class=\"md-form pb-3\">\n      <label for=\"business\" class=\"active\">Business Leads (if applicable)</label>\n      <div class=\"row pt-2\" *ngFor=\"let user of businessList; let i = index\">\n        <div class=\"col-md-auto\">\n          <a class=\"valign-middle\" (click)=\"removeBusiness($event)\" [attr.data-index]=\"i\">\n            <i class=\"text-warning fa fa-minus-circle fa-lg mr-1\" aria-hidden=\"true\"></i>\n          </a>\n        </div>\n        <div class=\"col pl-2\">\n          {{ user.DisplayName }}\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md\">\n          <app-person-finder id=\"business\" name=\"business\" [usePrimitive]=\"false\" #businessPF></app-person-finder>\n          <small>\n            <a (click)=\"addBusiness()\">\n              <i class=\"text-info fa fa-plus-circle fa-lg mr-1\" aria-hidden=\"true\"></i> Add Business Lead\n            </a>\n          </small>\n        </div>\n      </div>\n    </div>\n    <div class=\"alert alert-danger m-0 py-1 mr-3\" role=\"alert\" [hidden]=\"!errorMsg\">\n      <i class=\"fa fa-exclamation-circle fa-lg\" aria-hidden=\"true\"></i>&nbsp; {{errorMsg}}\n    </div>\n  </div>\n  <div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-secondary btn-sm px-3\" (click)=\"cancelPopup()\">Cancel</button>\n    <button type=\"button\" class=\"btn btn-primary btn-sm px-4\" [disabled]=\"!owner\" (click)=\"onSubmit()\">Save</button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/event-users-popup/event-users-popup.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/event-users-popup/event-users-popup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EventUsersPopupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__person_finder_person_finder_component__ = __webpack_require__("./src/app/person-finder/person-finder.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var EventUsersPopupComponent = /** @class */ (function () {
    function EventUsersPopupComponent(activeModal, service) {
        this.activeModal = activeModal;
        this.service = service;
        this.saveClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.isLoading = false;
        this.supportList = [];
        this.travelList = [];
        this.businessList = [];
    }
    EventUsersPopupComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.eventToEdit) {
            this.owner = this.eventToEdit.Owner;
            if (this.eventToEdit.Users) {
                this.eventToEdit.Users.forEach(function (u) {
                    if (__WEBPACK_IMPORTED_MODULE_3__shared_Enums__["d" /* Role */].Support == (u.Role & __WEBPACK_IMPORTED_MODULE_3__shared_Enums__["d" /* Role */].Support)) {
                        _this.supportList.push(u.User);
                    }
                    if (__WEBPACK_IMPORTED_MODULE_3__shared_Enums__["d" /* Role */].Travel == (u.Role & __WEBPACK_IMPORTED_MODULE_3__shared_Enums__["d" /* Role */].Travel)) {
                        _this.travelList.push(u.User);
                    }
                    if (__WEBPACK_IMPORTED_MODULE_3__shared_Enums__["d" /* Role */].Business == (u.Role & __WEBPACK_IMPORTED_MODULE_3__shared_Enums__["d" /* Role */].Business)) {
                        _this.businessList.push(u.User);
                    }
                });
            }
        }
    };
    EventUsersPopupComponent.prototype.addSupport = function () {
        if (!this.supportPF.value) {
            return;
        }
        var username = this.supportPF.value.Username;
        if (this.supportList.find(function (u) {
            return u.Username == username;
        })) {
            this.supportPF.value = null;
            return;
        }
        this.supportList.push(this.supportPF.value);
        this.supportPF.value = null;
    };
    EventUsersPopupComponent.prototype.addTravel = function () {
        if (!this.travelPF.value) {
            return;
        }
        var username = this.travelPF.value.Username;
        if (this.travelList.find(function (u) {
            return u.Username == username;
        })) {
            this.travelPF.value = null;
            return;
        }
        this.travelList.push(this.travelPF.value);
        this.travelPF.value = null;
    };
    EventUsersPopupComponent.prototype.addBusiness = function () {
        if (!this.businessPF.value) {
            return;
        }
        var username = this.businessPF.value.Username;
        if (this.businessList.find(function (u) {
            return u.Username == username;
        })) {
            this.businessPF.value = null;
            return;
        }
        this.businessList.push(this.businessPF.value);
        this.businessPF.value = null;
    };
    EventUsersPopupComponent.prototype.removeSupport = function (event) {
        var index = Number(event.currentTarget.dataset.index);
        if (index >= 0 && index < this.supportList.length) {
            this.supportList.splice(index, 1);
        }
    };
    EventUsersPopupComponent.prototype.removeTravel = function (event) {
        var index = Number(event.currentTarget.dataset.index);
        if (index >= 0 && index < this.travelList.length) {
            this.travelList.splice(index, 1);
        }
    };
    EventUsersPopupComponent.prototype.removeBusiness = function (event) {
        var index = Number(event.currentTarget.dataset.index);
        if (index >= 0 && index < this.businessList.length) {
            this.businessList.splice(index, 1);
        }
    };
    EventUsersPopupComponent.prototype.cancelPopup = function () {
        this.activeModal.close("Cancel Clicked");
    };
    EventUsersPopupComponent.prototype.onSubmit = function () {
        var _this = this;
        if (!this.owner) {
            return;
        }
        var users = [];
        if (this.eventToEdit.OwnerUsername != this.owner.Username) {
            users.push({
                User: this.owner,
                Role: __WEBPACK_IMPORTED_MODULE_3__shared_Enums__["d" /* Role */].Lead
            });
        }
        // get support users
        this.supportList.forEach(function (u) {
            if (!users.find(function (f) {
                if (f.User.Username == u.Username) {
                    f.Role = f.Role | __WEBPACK_IMPORTED_MODULE_3__shared_Enums__["d" /* Role */].Support;
                    return true;
                }
                return false;
            })) {
                users.push({
                    Role: __WEBPACK_IMPORTED_MODULE_3__shared_Enums__["d" /* Role */].Support,
                    User: u
                });
            }
        });
        // get travel users
        this.travelList.forEach(function (u) {
            if (!users.find(function (f) {
                if (f.User.Username == u.Username) {
                    f.Role = f.Role | __WEBPACK_IMPORTED_MODULE_3__shared_Enums__["d" /* Role */].Travel;
                    return true;
                }
                return false;
            })) {
                users.push({
                    Role: __WEBPACK_IMPORTED_MODULE_3__shared_Enums__["d" /* Role */].Travel,
                    User: u
                });
            }
        });
        // get business users
        this.businessList.forEach(function (u) {
            if (!users.find(function (f) {
                if (f.User.Username == u.Username) {
                    f.Role = f.Role | __WEBPACK_IMPORTED_MODULE_3__shared_Enums__["d" /* Role */].Business;
                    return true;
                }
                return false;
            })) {
                users.push({
                    Role: __WEBPACK_IMPORTED_MODULE_3__shared_Enums__["d" /* Role */].Business,
                    User: u
                });
            }
        });
        this.isLoading = true;
        this.service.saveEventUsers(this.eventToEdit.ID, users)
            .subscribe(function (result) {
            _this.errorMsg = null;
            _this.eventToEdit.OwnerUsername = _this.owner.Username;
            _this.eventToEdit.Owner = _this.owner;
            _this.eventToEdit.Users = users;
            _this.activeModal.close();
        }, function (error) {
            _this.errorMsg = error;
            _this.isLoading = false;
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("supportPF"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__person_finder_person_finder_component__["a" /* PersonFinderComponent */])
    ], EventUsersPopupComponent.prototype, "supportPF", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("travelPF"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__person_finder_person_finder_component__["a" /* PersonFinderComponent */])
    ], EventUsersPopupComponent.prototype, "travelPF", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("businessPF"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__person_finder_person_finder_component__["a" /* PersonFinderComponent */])
    ], EventUsersPopupComponent.prototype, "businessPF", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], EventUsersPopupComponent.prototype, "eventToEdit", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */])
    ], EventUsersPopupComponent.prototype, "saveClicked", void 0);
    EventUsersPopupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-event-users-popup',
            template: __webpack_require__("./src/app/event-users-popup/event-users-popup.component.html"),
            styles: [__webpack_require__("./src/app/event-users-popup/event-users-popup.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */],
            __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__["a" /* TradeshowService */]])
    ], EventUsersPopupComponent);
    return EventUsersPopupComponent;
}());



/***/ }),

/***/ "./src/app/event-view/event-view.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"tabs-wrapper bg-white\">\r\n  <ul class=\"nav classic-tabs tabs-white\" role=\"tablist\">\r\n    <li class=\"nav-item ml-3\">\r\n      <a id=\"Details\" class=\"nav-link waves-light waves-effect\" \r\n         [class.active]=\"activeTab == EventDisplayTab.Details\"\r\n         (click)=\"onTabClick($event)\">{{event.Name}}</a>\r\n    </li>\r\n    <li class=\"nav-item ml-3\" *ngIf=\"canEditAttendees\">\r\n      <a id=\"Fields\" class=\"nav-link waves-light waves-effect\" \r\n         [class.active]=\"activeTab == EventDisplayTab.Fields\"\r\n         (click)=\"onTabClick($event)\">Attendee Details</a>\r\n    </li>\r\n    <li class=\"nav-item ml-3\" *ngIf=\"canEditSettings\">\r\n      <a id=\"Settings\" class=\"nav-link waves-light waves-effect\" \r\n         [class.active]=\"activeTab == EventDisplayTab.Settings\"\r\n         (click)=\"onTabClick($event)\">Settings</a>\r\n    </li>\r\n    <li class=\"nav-item ml-3\" *ngIf=\"selectedAttendee\">\r\n      <a id=\"Attendee\" class=\"nav-link waves-light waves-effect\"\r\n         [class.active]=\"activeTab == EventDisplayTab.Attendee\"\r\n         (click)=\"onTabClick($event)\">\r\n          {{selectedAttendee.Profile.FirstName}} {{selectedAttendee.Profile.LastName}}&nbsp;\r\n          <span (click)=\"onTabClose($event)\">\r\n            <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\r\n          </span>\r\n      </a>\r\n    </li>\r\n  </ul>\r\n</div>\r\n<!-- Event Info -->\r\n<div id=\"tabPanel1\" class=\"mt-3 mx-3\" [class.d-none]=\"activeTab != EventDisplayTab.Details\">\r\n  \r\n  <div class=\"card mb-3\">\r\n    <app-event-info\r\n      [(event)]=\"event\">\r\n    </app-event-info>\r\n  </div>\r\n\r\n  <!--div class=\"card mb-3\">\r\n    <div class=\"card-body\">\r\n      <span class=\"h5 card-title\">Notifications</span>\r\n      <ul class=\"list-properties mt-3\" style=\"overflow-y: auto;\">\r\n        <li>All Clear!</li>\r\n      </ul>\r\n    </div>\r\n  </div-->\r\n\r\n  <div class=\"d-flex justify-content-between mb-3\">\r\n    <div class=\"card card-inline\">\r\n      <div class=\"card-body text-center\">\r\n        <p class=\"mb-1\">Planned&nbsp;Attendees</p>\r\n        <h2>{{results?.Total}}</h2>\r\n      </div>\r\n    </div>\r\n    <div class=\"card card-inline\">\r\n      <div class=\"card-body text-center\">\r\n        <p class=\"mb-1\">RSVP'd&nbsp;Attendees</p>\r\n        <h2>{{results?.RSVPD}}</h2>\r\n      </div>\r\n    </div>\r\n    <div class=\"card card-inline\" style=\"max-width: 175px\">\r\n        <div class=\"card-body\">\r\n          <p class=\"mb-1\">RSVP'd&nbsp;by&nbsp;Segment</p>\r\n          <div>\r\n            <div class=\"float-left mb-1\" style=\"width: 70px\"\r\n                 *ngFor=\"let key of results?.Segments | keys\">\r\n              <strong>{{key}}: {{results?.Segments[key]}}</strong>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    <div class=\"card card-inline\">\r\n      <div class=\"card-body text-center\">\r\n        <p class=\"mb-1\">Completed&nbsp;Responses</p>\r\n        <h2>{{results?.Completed}}</h2>\r\n      </div>\r\n    </div>\r\n    <div class=\"card card-inline\">\r\n      <div class=\"card-body text-center\">\r\n        <p class=\"mb-1\">#&nbsp;Needing&nbsp;Hotel</p>\r\n        <h2>{{results?.Hotel}}</h2>\r\n      </div>\r\n    </div>\r\n    <div class=\"card card-inline\">\r\n      <div class=\"card-body text-center\">\r\n        <p class=\"mb-1\">Days&nbsp;Until&nbsp;Event</p>\r\n        <h2>{{daysUntilEvent}}</h2>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"card mb-3\">\r\n    <div class=\"card-body\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-auto\">\r\n          <span class=\"h5 card-title\">Attendees</span>&nbsp; \r\n          <span class=\"badge badge-small badge-warning badge-pill\"\r\n            *ngIf=\"checkedAttendeeCount\">\r\n            {{ checkedAttendeeCount }}&nbsp;\r\n            <a (click)=\"onClearAttendeeChecked()\">\r\n              <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\r\n            </a>\r\n          </span>\r\n        </div>\r\n        <div class=\"col-md text-right pl-0\">\r\n          <button type=\"button\" *ngIf=\"true\"\r\n                 [disabled]=\"!checkedAttendeeCount || attendeeGrid.loading\" \r\n                  class=\"btn btn-info btn-sm waves-effect waves-light px-3\"\r\n                  (click)=\"popupSendRSVP()\">\r\n                  <i class=\"fa fa-paper-plane\" aria-hidden=\"true\"></i>&nbsp; \r\n                  RSVP REQUEST\r\n          </button>\r\n          <button type=\"button\" *ngIf=\"canEditAttendees\"\r\n                 [disabled]=\"!checkedAttendeeCount || attendeeGrid.loading\" \r\n                  class=\"btn btn-info btn-sm waves-effect waves-light px-3\"\r\n                  (click)=\"popupSendReminder()\">\r\n                  <i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>&nbsp; \r\n                  Send Reminder\r\n          </button>\r\n          <button type=\"button\" *ngIf=\"canDeleteAttendee\"\r\n                 [disabled]=\"!checkedAttendeeCount || attendeeGrid.loading\"\r\n                  class=\"btn btn-info btn-sm waves-effect waves-light px-3\"\r\n                  (click)=\"popupDeleteAttendee()\">\r\n                  <i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i>&nbsp; \r\n                  Remove\r\n          </button>\r\n          <button type=\"button\" *ngIf=\"canAddAttendee\"\r\n                  class=\"btn btn-info btn-sm waves-effect waves-light px-3\"\r\n                  (click)=\"popupAddAttendees()\">\r\n                  <i class=\"fa fa-user-plus\" aria-hidden=\"true\"></i>&nbsp; \r\n                  Add Attendee\r\n          </button>\r\n          <button type=\"button\" id=\"Fields\" *ngIf=\"canEditAttendees\"\r\n                  (click)=\"onTabClick($event)\"\r\n                  class=\"btn btn-info btn-sm waves-effect waves-light px-3\">\r\n                  <i class=\"fa fa-pencil\" aria-hidden=\"true\"></i>&nbsp;\r\n                  Edit Attendee Details\r\n          </button>\r\n          <button type=\"button\" [disabled]=\"!results.Attendees?.length || attendeeGrid.loading\"\r\n                  (click)=\"onAttendeeExport()\"\r\n                  class=\"btn btn-info btn-sm waves-effect waves-light px-3\">\r\n                  <i class=\"fa fa-download\" aria-hidden=\"true\"></i>&nbsp; \r\n                  Export\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <kendo-grid #attendeeGrid\r\n      [data]=\"view\"\r\n      [pageable]=\"true\"\r\n      [pageSize]=\"state.take\"\r\n      [skip]=\"state.skip\"\r\n      [sortable]=\"true\"\r\n      [sort]=\"state.sort\"\r\n      (sortChange)=\"sortChange($event)\"\r\n      filterable=\"menu\"\r\n      [filter]=\"state.filter\"\r\n      (dataStateChange)=\"dataStateChange($event)\"\r\n      style=\"height: 500px;\"\r\n    >\r\n      <kendo-grid-column width=\"50\" [locked]=\"true\">\r\n        <ng-template kendoGridHeaderTemplate let-column let-columnIndex=\"columnIndex\">\r\n          <input type=\"checkbox\" id=\"attendee_all\" class=\"filled-in\"\r\n            [disabled]=\"!results.Attendees?.length || attendeeGrid.loading\"\r\n            [checked]=\"areAllChecked\"\r\n            (click)=\"onCheckAllAttendees($event)\">\r\n          <label for=\"attendee_all\" class=\"m-0 p-0 align-bottom\"></label>\r\n        </ng-template>\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          <input type=\"checkbox\" id=\"att_{{dataItem.ID}}\" class=\"filled-in\" \r\n            [checked]=\"checkedAttendees[dataItem.ID]\"\r\n            (click)=\"onAttendeeChecked(dataItem)\">\r\n          <label for=\"att_{{dataItem.ID}}\" class=\"m-0 p-0 align-bottom\"></label>\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n<!--\r\n      <kendo-grid-column width=\"80\" [locked]=\"true\" title=\"Pic\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          <i *ngIf=\"!dataItem.Profile.EmplID; else elseBlock\"\r\n             class=\"fa fa-user-circle avatar\" aria-hidden=\"true\">\r\n          </i>\r\n          <ng-template #elseBlock>\r\n            <img src=\"http://my.harris.com/PeopleFinder/employeePics/{{dataItem.Profile.EmplID}}.jpg\"\r\n                 class=\"avatar img-fluid rounded-circle z-depth-0\"\r\n                 (error)=\"imgErrHandler($event)\">\r\n            <i class=\"fa fa-user-circle avatar d-none\" aria-hidden=\"true\"></i>\r\n          </ng-template>\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n-->\r\n      <kendo-grid-column field=\"Name\" width=\"200\" [locked]=\"true\" [filterable]=\"false\" title=\"Name\">\r\n        <ng-template kendoGridCellTemplate let-dataItem> \r\n          <a (click)=\"onAttendeeInfoClicked(dataItem)\" class=\"text-info\">\r\n            {{dataItem.Profile.FirstName}} {{dataItem.Profile.LastName}}\r\n          </a>\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n\r\n      <kendo-grid-column width=\"70\" [locked]=\"true\" *ngIf=\"canEditAttendees\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          <div class=\"attendee-edit-dropdown\" [attr.data-id]=\"dataItem.ID\">\r\n            <a class=\"waves-effect waves-light align-bottom\" data-toggle=\"dropdown\">\r\n              <i class=\"fa fa-cog fa-lg\" aria-hidden=\"true\"></i>\r\n            </a>\r\n            <div class=\"dropdown-menu attendee-menu-list p-0\" role=\"menu\" style=\"width: 150px;\" id=\"att_menu_{{dataItem.ID}}\">\r\n              <a class=\"dropdown-item waves-effect waves-light px-3 py-1\" role=\"menuitem\" tabindex=\"-1\" \r\n                *ngIf=\"canEditProfiles\"\r\n                (click)=\"popupEditProfile(dataItem)\">\r\n                Edit Profile\r\n              </a>\r\n              <a class=\"dropdown-item waves-effect waves-light px-3 py-1\" role=\"menuitem\" tabindex=\"-1\" \r\n                (click)=\"popupEditAttendeeFields(dataItem)\">\r\n                Edit Attendee Fields\r\n              </a>\r\n              <a class=\"dropdown-item waves-effect waves-light px-3 py-1\" role=\"menuitem\" tabindex=\"-1\" \r\n                (click)=\"popupEditOrganizerFields(dataItem)\">\r\n                Edit Organizer Fields\r\n              </a>\r\n            </div>\r\n          </div>\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n\r\n      <kendo-grid-column field=\"DateRSVP\" filter=\"date\" title=\"RSVP Request Sent\" width=\"200\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.DateRSVP ? (dataItem.DateRSVP | date: 'MM/dd/yyyy') : \"NOT SENT\" }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      \r\n      <kendo-grid-column field=\"Status\" title=\"RSVP Response (Y/N)\" width=\"200\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ HelperSvc.getResponseText(dataItem.Status) }}\r\n        </ng-template>\r\n        <ng-template kendoGridFilterMenuTemplate\r\n          let-column=\"column\"\r\n          let-filter=\"filter\"\r\n          let-filterService=\"filterService\"\r\n          >\r\n          <grid-rsvp-filter\r\n            [field]=\"column.field\"\r\n            [filterService]=\"filterService\"\r\n            [currentFilter]=\"filter\">\r\n          </grid-rsvp-filter>\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n\r\n      <kendo-grid-column field=\"User.Title\" title=\"Job Title\" [filterable]=\"false\" width=\"200\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Profile.Title }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.Segment\" title=\"Segment\" width=\"100\">\r\n        <ng-template kendoGridFilterMenuTemplate\r\n          let-column=\"column\"\r\n          let-filter=\"filter\"\r\n          let-filterService=\"filterService\"\r\n          >\r\n          <grid-seg-filter\r\n            [isPrimitive]=\"true\"\r\n            [showFilter]=\"false\"\r\n            [field]=\"column.field\"\r\n            [operator]=\"'eq'\"\r\n            [filterService]=\"filterService\"\r\n            [currentFilter]=\"filter\"\r\n            [data]=\"segments\"></grid-seg-filter>\r\n        </ng-template>\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Profile.Segment }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.DelegateUsername\" title=\"Delegate\" [filterable]=\"false\" width=\"150\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{dataItem.Profile.Delegate?.FirstName}} {{dataItem.Profile.Delegate?.LastName}}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.Email\" title=\"Email\" [filterable]=\"false\" width=\"200\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Profile.Email }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.Telephone\" title=\"Work Number\" [filterable]=\"false\" width=\"200\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Profile.Telephone }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.Mobile\" title=\"Cell Number\" [filterable]=\"false\" width=\"200\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Profile.Mobile }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.BadgeName\" title=\"Name on Badge\" [filterable]=\"false\" width=\"200\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Profile.BadgeName }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n\r\n      <kendo-grid-column field=\"User.PassportName\" title=\"Passport Name\" [filterable]=\"false\" width=\"200\"\r\n        *ngIf=\"canViewPassportInfo\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Profile.PassportName }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.PassportNumber\" title=\"Passport Number\" [filterable]=\"false\" width=\"200\"\r\n        *ngIf=\"canViewPassportInfo\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Profile.PassportNumber }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.Nationality\" title=\"Nationality\" [filterable]=\"false\" width=\"200\"\r\n        *ngIf=\"canViewPassportInfo\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Profile.Nationality }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.COB\" title=\"Country of Birth\" [filterable]=\"false\" width=\"200\"\r\n        *ngIf=\"canViewPassportInfo\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Profile.COB }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.DOB\" title=\"Date of Birth\" [filterable]=\"false\" width=\"200\"\r\n        *ngIf=\"canViewPassportInfo\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{dataItem.Profile.DOB | date:'MM/dd/yyyy'}}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.COR\" title=\"Country of Residence\" [filterable]=\"false\" width=\"200\"\r\n        *ngIf=\"canViewPassportInfo\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Profile.COR }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n      <kendo-grid-column field=\"User.COI\" title=\"Country of Issue\" [filterable]=\"false\" width=\"200\"\r\n        *ngIf=\"canViewPassportInfo\">\r\n        <ng-template kendoGridCellTemplate let-dataItem>\r\n          {{ dataItem.Profile.COI }}\r\n        </ng-template>\r\n      </kendo-grid-column>\r\n\r\n      <ng-template ngFor let-field [ngForOf]=\"eventFields\">\r\n        <kendo-grid-column *ngIf=\"field.Source\" \r\n          [filterable]=\"field.Source == 'Arrival' || field.Source == 'Departure'\"\r\n          title=\"{{field.Label}}\"\r\n          field=\"{{field.Source}}\"\r\n          filter=\"date\" format=\"{0:d}\"\r\n          width=\"200\">\r\n          <ng-template *ngIf=\"field.Input == InputType.Date\" \r\n            kendoGridCellTemplate let-dataItem>\r\n            {{ dataItem[field.Source] | date: 'MM/dd/yyyy' }}\r\n          </ng-template>\r\n          <ng-template *ngIf=\"field.Input == InputType.YesOrNo\"\r\n            kendoGridCellTemplate let-dataItem>\r\n            {{ HelperSvc.getYesOrNoText(dataItem[field.Source]) }}\r\n          </ng-template>\r\n          <ng-template *ngIf=\"field.Input == InputType.MultiSelect\"\r\n            kendoGridCellTemplate let-dataItem>\r\n            {{ dataItem[field.Source] | replace : '|' : ', '}}\r\n          </ng-template>\r\n        </kendo-grid-column>\r\n        <kendo-grid-column *ngIf=\"!field.Source\" [filterable]=\"false\"\r\n          title=\"{{field.Label}}\"\r\n          width=\"200\">\r\n          <ng-template *ngIf=\"field.Input == InputType.Date\" \r\n            kendoGridCellTemplate let-dataItem>\r\n            {{ dataItem.Properties[field.ID] | date: 'MM/dd/yyyy' }}\r\n          </ng-template>\r\n          <ng-template *ngIf=\"field.Input == InputType.MultiSelect\" \r\n            kendoGridCellTemplate let-dataItem>\r\n            {{ dataItem.Properties[field.ID] | replace : '|' : ', '}}\r\n          </ng-template>\r\n          <ng-template *ngIf=\"field.Input != InputType.Date && field.Input != InputType.MultiSelect\" \r\n            kendoGridCellTemplate let-dataItem>\r\n            {{ dataItem.Properties[field.ID] }}\r\n          </ng-template>\r\n        </kendo-grid-column>\r\n      </ng-template>\r\n      \r\n    </kendo-grid>\r\n  </div>\r\n\r\n</div>\r\n<!-- Attendee Details -->\r\n<div id=\"tabPanel2\" class=\"mt-3 mx-3\" [class.d-none]=\"activeTab != EventDisplayTab.Fields\">\r\n  \r\n  <div class=\"card mb-3\">\r\n    <div class=\"card-body\">\r\n      <div class=\"row\">\r\n        <div class=\"col\">\r\n          <span class=\"h4 card-title\">Required Attendee Details</span>\r\n        </div>\r\n        <div class=\"col-md-auto text-right\">\r\n          <button type=\"button\" [hidden]=\"!isFieldsDirty\"\r\n                  class=\"btn btn-secondary waves-effect waves-light\"\r\n                  (click)=\"discardFieldChanges()\">\r\n                  Discard Changes\r\n          </button>\r\n          <button type=\"button\" [disabled]=\"!isFieldsDirty\"\r\n                  class=\"btn btn-info waves-effect waves-light\"\r\n                  (click)=\"saveFieldChanges()\">\r\n                  Save\r\n          </button>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col\">\r\n            Below are the details that event attendees will be required to fill out. When you are done click 'Save'.\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  \r\n  <!--Accordion wrapper-->\r\n  <div class=\"accordion mb-3\" id=\"accordionFields\" role=\"tablist\" aria-multiselectable=\"true\">\r\n    <!-- Accordion card -->\r\n    <div class=\"card\">\r\n      <!-- Card header -->\r\n      <div class=\"card-header pl-3\" role=\"tab\" id=\"headingProfileFields\">\r\n        <a data-toggle=\"collapse\" data-parent=\"#accordionFields\" href=\"#collapseProfileFields\" aria-expanded=\"false\" aria-controls=\"collapseProfileFields\" class=\"collapsed\">\r\n          <h5 class=\"mb-0\">\r\n            Attendee Profile (Default Questions) <i class=\"fa fa-angle-down rotate-icon\"></i>\r\n          </h5>\r\n        </a>\r\n      </div>\r\n      <!-- Card body -->\r\n      <div id=\"collapseProfileFields\" class=\"collapse\" role=\"tabpanel\" aria-labelledby=\"headingProfileFields\">\r\n        <div class=\"card-body p-0\">\r\n          <table class=\"table table-bordered table-responsive-md table-striped mb-0\">\r\n            <thead>\r\n              <tr>\r\n                <th>Field Name</th>\r\n                <th>Type</th>\r\n                <th>Required Y/N</th>\r\n                <th>Hint/Help</th>\r\n              </tr>\r\n            </thead>\r\n            <tbody>\r\n              <tr>\r\n                <td>Name</td>\r\n                <td>Short Text</td>\r\n                <td>Yes</td>\r\n                <td>Please use your real name.</td>\r\n              </tr>\r\n              <tr>\r\n                <td>Title</td>\r\n                <td>Short Text</td>\r\n                <td>Yes</td>\r\n                <td>This is your job title at work.</td>\r\n              </tr>\r\n              <tr>\r\n                <td>Segment</td>\r\n                <td>Dropdown</td>\r\n                <td>Yes</td>\r\n                <td></td>\r\n              </tr>\r\n              <tr>\r\n                <td>Delegate</td>\r\n                <td>Dropdown</td>\r\n                <td>No</td>\r\n                <td></td>\r\n              </tr>\r\n              <tr>\r\n                <td>Email</td>\r\n                <td>Short Text</td>\r\n                <td>Yes</td>\r\n                <td></td>\r\n              </tr>\r\n              <tr>\r\n                <td>Work Number</td>\r\n                <td>Short Text</td>\r\n                <td>No</td>\r\n                <td></td>\r\n              </tr>\r\n              <tr>\r\n                <td>Mobile Number</td>\r\n                <td>Short Text</td>\r\n                <td>Yes</td>\r\n                <td></td>\r\n              </tr>\r\n              <tr>\r\n                <td>Badge Name</td>\r\n                <td>Short Text</td>\r\n                <td>Yes</td>\r\n                <td></td>\r\n              </tr>\r\n              <tr>\r\n                <td>Passport Name</td>\r\n                <td>Short Text</td>\r\n                <td>{{event.ShowType == ShowType.International ? 'Yes' : 'No'}}</td>\r\n                <td></td>\r\n              </tr>\r\n              <tr>\r\n                <td>Passport Number</td>\r\n                <td>Short Text</td>\r\n                <td>{{event.ShowType == ShowType.International ? 'Yes' : 'No'}}</td>\r\n                <td></td>\r\n              </tr>\r\n              <tr>\r\n                <td>Nationality</td>\r\n                <td>Short Text</td>\r\n                <td>{{event.ShowType == ShowType.International ? 'Yes' : 'No'}}</td>\r\n                <td></td>\r\n              </tr>\r\n              <tr>\r\n                <td>Date of Birth</td>\r\n                <td>Date</td>\r\n                <td>{{event.ShowType == ShowType.International ? 'Yes' : 'No'}}</td>\r\n                <td></td>\r\n              </tr>\r\n              <tr>\r\n                <td>Country of Birth</td>\r\n                <td>Short Text</td>\r\n                <td>{{event.ShowType == ShowType.International ? 'Yes' : 'No'}}</td>\r\n                <td></td>\r\n              </tr>\r\n              <tr>\r\n                <td>Country of Residence</td>\r\n                <td>Short Text</td>\r\n                <td>{{event.ShowType == ShowType.International ? 'Yes' : 'No'}}</td>\r\n                <td></td>\r\n              </tr>\r\n              <tr>\r\n                <td>Country of Issue</td>\r\n                <td>Short Text</td>\r\n                <td>{{event.ShowType == ShowType.International ? 'Yes' : 'No'}}</td>\r\n                <td></td>\r\n              </tr>\r\n            </tbody>\r\n          </table>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <br/>\r\n    <!-- Accordion card -->\r\n    <div class=\"card\">\r\n      <!-- Card header -->\r\n      <div class=\"card-header pl-3\" role=\"tab\" id=\"headingAttendeeFields\">\r\n        <a class=\"collapsed\" data-toggle=\"collapse\" data-parent=\"#accordionFields\" href=\"#collapseAttendeeFields\" aria-expanded=\"true\" aria-controls=\"collapseAttendeeFields\">\r\n          <h5 class=\"mb-0\">\r\n            Other Attendee Details <i class=\"fa fa-angle-down rotate-icon\"></i>\r\n          </h5>\r\n        </a>\r\n      </div>\r\n      <!-- Card body -->\r\n      <div id=\"collapseAttendeeFields\" class=\"collapse show\" role=\"tabpanel\" aria-labelledby=\"headingAttendeeFields\">\r\n        <div class=\"card-body p-0\">\r\n          <kendo-grid \r\n            [height]=\"400\"\r\n            class=\"table table-striped\"\r\n            #attendeeFields>\r\n            <kendo-grid-column field=\"Included\" title=\"Inc?\" width=\"75\">\r\n              <ng-template kendoGridCellTemplate let-dataItem>\r\n                <input type=\"checkbox\" id=\"inc_{{dataItem.ID}}\" class=\"filled-in\" \r\n                       [checked]=\"dataItem.Included\" \r\n                       [attr.data-id]=\"dataItem.ID\"\r\n                       (click)=\"toggleInclude($event)\">\r\n                <label for=\"inc_{{dataItem.ID}}\" class=\"m-0 p-0 align-bottom\"></label>\r\n              </ng-template>\r\n            </kendo-grid-column>\r\n            <kendo-grid-column field=\"Label\" title=\"Field Label\"></kendo-grid-column>\r\n            <kendo-grid-column field=\"Input\" title=\"Type\">\r\n              <ng-template kendoGridCellTemplate let-dataItem>\r\n                {{ HelperSvc.getInputTypeString(dataItem.Input) }}\r\n              </ng-template>\r\n            </kendo-grid-column>\r\n            <kendo-grid-column field=\"Required\" title=\"Required Y/N\">\r\n              <ng-template kendoGridCellTemplate let-dataItem>\r\n                {{ dataItem.Required ? \"Yes\": \"No\" }}\r\n              </ng-template>\r\n            </kendo-grid-column>\r\n            <kendo-grid-column field=\"Tooltip\" title=\"Hint/Help\"></kendo-grid-column>\r\n            <kendo-grid-column class=\"text-right\" headerClass=\"text-right\">\r\n              <ng-template kendoGridHeaderTemplate>\r\n                  <button type=\"button\"\r\n                          class=\"btn btn-info btm-sm waves-effect waves-light m-0\"\r\n                          (click)=\"popupFieldEvent(0, Role.All)\">Add Field\r\n                  </button>\r\n              </ng-template>\r\n              <ng-template kendoGridCellTemplate let-dataItem>\r\n                <a aria-expanded=\"false\"\r\n                   aria-haspopup=\"true\" \r\n                   class=\"waves-effect waves-light align-bottom\" \r\n                   data-toggle=\"dropdown\" id=\"menu_{{dataItem.ID}}\">\r\n                  <i class=\"fa fa-cog fa-lg\" aria-hidden=\"true\"></i>\r\n                </a>\r\n                <div class=\"dropdown-menu dropdown-menu-right p-0\">\r\n                  <a class=\"dropdown-item waves-effect waves-light py-2 m-0\" \r\n                     (click)=\"popupFieldEvent(dataItem.ID, dataItem.Access)\">Edit</a>\r\n                  <div *ngIf=\"dataItem.Custom\" class=\"dropdown-divider m-0\"></div>\r\n                  <a *ngIf=\"!dataItem.Source\" \r\n                      class=\"dropdown-item waves-effect waves-light py-2 m-0\"\r\n                      (click)=\"popupDeleteField(dataItem)\">Delete</a>\r\n                </div>\r\n              </ng-template>\r\n            </kendo-grid-column>\r\n          </kendo-grid>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <br/>\r\n    <!-- Accordion card -->\r\n    <div class=\"card\">\r\n      <!-- Card header -->\r\n      <div class=\"card-header pl-3\" role=\"tab\" id=\"headingOrganizerFields\">\r\n        <a class=\"\" data-toggle=\"collapse\" data-parent=\"#accordionFields\" href=\"#collapseOrganizerFields\" aria-expanded=\"false\" aria-controls=\"collapseOrganizerFields\">\r\n          <h5 class=\"mb-0\">\r\n            Organizer Only <i class=\"fa fa-angle-down rotate-icon\"></i>\r\n          </h5>\r\n        </a>\r\n      </div>\r\n      <!-- Card body -->\r\n      <div id=\"collapseOrganizerFields\" class=\"collapse\" role=\"tabpanel\" aria-labelledby=\"headingOrganizerFields\">\r\n        <div class=\"card-body p-0\">\r\n            <kendo-grid \r\n            [height]=\"400\"\r\n            class=\"table table-striped\"\r\n            #organizerFields>\r\n            <kendo-grid-column field=\"Included\" title=\"Inc?\" width=\"75\">\r\n              <ng-template kendoGridCellTemplate let-dataItem>\r\n                <input type=\"checkbox\" id=\"inc_{{dataItem.ID}}\" class=\"filled-in\" \r\n                  [checked]=\"dataItem.Included\" \r\n                  [attr.data-id]=\"dataItem.ID\"\r\n                  (click)=\"toggleInclude($event)\">\r\n                <label for=\"inc_{{dataItem.ID}}\" class=\"m-0 p-0 align-bottom\"></label>\r\n              </ng-template>\r\n            </kendo-grid-column>\r\n            <kendo-grid-column field=\"Label\" title=\"Field Label\"></kendo-grid-column>\r\n            <kendo-grid-column field=\"Input\" title=\"Type\">\r\n              <ng-template kendoGridCellTemplate let-dataItem>\r\n                {{ HelperSvc.getInputTypeString(dataItem.Input) }}\r\n              </ng-template>\r\n            </kendo-grid-column>\r\n            <kendo-grid-column field=\"Required\" title=\"Required Y/N\">\r\n              <ng-template kendoGridCellTemplate let-dataItem>\r\n                {{ dataItem.Required ? \"Yes\": \"No\" }}\r\n              </ng-template>\r\n            </kendo-grid-column>\r\n            <kendo-grid-column field=\"Tooltip\" title=\"Hint/Help\"></kendo-grid-column>\r\n            <kendo-grid-column class=\"text-right\" headerClass=\"text-right\">\r\n              <ng-template kendoGridHeaderTemplate>\r\n                  <button type=\"button\"\r\n                          class=\"btn btn-info btm-sm waves-effect waves-light m-0\"\r\n                          (click)=\"popupFieldEvent(0, Role.BackOffice)\">Add Field\r\n                  </button>\r\n              </ng-template>\r\n              <ng-template kendoGridCellTemplate let-dataItem>\r\n                <a aria-expanded=\"false\"\r\n                   aria-haspopup=\"true\" \r\n                   class=\"waves-effect waves-light align-bottom\" \r\n                   data-toggle=\"dropdown\" id=\"menu_{{dataItem.ID}}\">\r\n                  <i class=\"fa fa-cog fa-lg\" aria-hidden=\"true\"></i>\r\n                </a>\r\n                <div class=\"dropdown-menu dropdown-menu-right p-0\">\r\n                  <a class=\"dropdown-item waves-effect waves-light py-2 m-0\" \r\n                     (click)=\"popupFieldEvent(dataItem.ID, dataItem.Access)\">Edit</a>\r\n                  <div *ngIf=\"dataItem.Custom\" class=\"dropdown-divider m-0\"></div>\r\n                  <a *ngIf=\"!dataItem.Source\" \r\n                      class=\"dropdown-item waves-effect waves-light py-2 m-0\"\r\n                      (click)=\"popupDeleteField(dataItem)\">Delete</a>\r\n                </div>\r\n              </ng-template>\r\n            </kendo-grid-column>\r\n          </kendo-grid>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n<!-- Settings -->\r\n<div id=\"tabPanel3\" class=\"mt-3 mx-3\" [class.d-none]=\"activeTab != EventDisplayTab.Settings\">\r\n\r\n  <div class=\"card mb-3\">\r\n    <div class=\"card-body\">\r\n      <div class=\"row\">\r\n        <div class=\"col\">\r\n          <span class=\"h4 card-title\">General Settings</span>\r\n        </div>\r\n        <div class=\"col text-right\">\r\n          <button type=\"button\"\r\n                  class=\"btn btn-info waves-effect waves-light float-right\"\r\n                  (click)=\"popupDeleteEvent()\">\r\n                  Delete Event\r\n          </button>\r\n          <!--button type=\"button\"\r\n                  class=\"btn btn-info waves-effect waves-light float-right\">\r\n                  Archive Event\r\n          </button-->\r\n        </div>\r\n      </div>\r\n      <div class=\"md-form mt-0\">\r\n        <input type=\"checkbox\" class=\"filled-in\" id=\"notify\" (click)=\"onSendReminderClicked($event)\" [checked]=\"event?.SendReminders\">\r\n        <label for=\"notify\">Send Reminder Emails Automatically</label>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"card mb-3\">\r\n    <div class=\"card-header py-3 border-bottom-0\">\r\n      <h5 class=\"float-left mb-0\">User Group Permissions</h5>\r\n      <a (click)=\"popupUsersEvent()\" class=\"float-right waves-effect waves-light\">\r\n        <i aria-hidden=\"true\" class=\"fa fa-pencil-square fa-2x\"></i>\r\n      </a>\r\n    </div>\r\n    <div class=\"card-body p-0\">\r\n      <div>\r\n        <table class=\"table table-bordered table-responsive-md table-striped table-hover mb-0\">\r\n          <thead>\r\n            <tr>\r\n              <th>User Group</th>\r\n              <th>Permissions</th>\r\n              <th>Users</th>\r\n            </tr>\r\n          </thead>\r\n          <tbody>\r\n            <tr>\r\n              <td>Lead Organizer</td>\r\n              <td>Edit All</td>\r\n              <td>{{event.Owner.FirstName}} {{event.Owner.LastName}}</td>\r\n            </tr>\r\n            <tr>\r\n              <td>Support Organizer</td>\r\n              <td>Edit All</td>\r\n              <td>\r\n                <ng-template ngFor let-u let-i=\"index\" let-c=\"count\" [ngForOf]=\"event.Users | eventUserFilter : Role.Support\">\r\n                  <span *ngIf=\"i == 0 && c > 1; else elseBlock\">\r\n                    {{ u.User.FirstName }} {{ u.User.LastName }};\r\n                  </span>\r\n                  <ng-template #elseBlock>\r\n                    <span>{{ u.User.FirstName }} {{ u.User.LastName }}</span>\r\n                  </ng-template>\r\n                </ng-template>\r\n              </td>\r\n            </tr>\r\n            <tr>\r\n              <td>BCD Organizer</td>\r\n              <td>Travel User</td>\r\n              <td>\r\n                <ng-template ngFor let-u let-i=\"index\" let-c=\"count\" [ngForOf]=\"event.Users | eventUserFilter : Role.Travel\">\r\n                  <span *ngIf=\"i == 0 && c > 1; else elseBlock\">\r\n                    {{ u.User.FirstName }} {{ u.User.LastName }};\r\n                  </span>\r\n                  <ng-template #elseBlock>\r\n                    <span>{{ u.User.FirstName }} {{ u.User.LastName }}</span>\r\n                  </ng-template>\r\n                </ng-template>\r\n              </td>\r\n            </tr>\r\n            <tr>\r\n              <td>Business Leads</td>\r\n              <td>Nominate Only</td>\r\n              <td>\r\n                <ng-template ngFor let-u let-i=\"index\" let-c=\"count\" [ngForOf]=\"event.Users | eventUserFilter : Role.Business\">\r\n                  <span *ngIf=\"i == 0 && c > 1; else elseBlock\">\r\n                    {{ u.User.FirstName }} {{ u.User.LastName }};\r\n                  </span>\r\n                  <ng-template #elseBlock>\r\n                    <span>{{ u.User.FirstName }} {{ u.User.LastName }}</span>\r\n                  </ng-template>\r\n                </ng-template>\r\n              </td>\r\n            </tr>\r\n          </tbody>\r\n        </table>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n<!-- Attendee Info -->\r\n<div id=\"tabAttendeePanel\" class=\"mt-3 mx-3\" \r\n  [class.d-none]=\"activeTab != EventDisplayTab.Attendee\"\r\n  *ngIf=\"selectedAttendee\">\r\n\r\n  <div class=\"card mb-3\">\r\n    <app-profile-info \r\n      [event]=\"event\"\r\n      [profile]=\"selectedAttendee?.Profile\"\r\n      (profileChange)=\"onAttendeeChanged()\">\r\n    </app-profile-info>\r\n  </div>\r\n\r\n  <div class=\"card mb-3\">\r\n    <app-attendee-fields \r\n      [title]=\"'Other Attendee Details'\"\r\n      [filter]=\"Role.All\"\r\n      [event]=\"event\"\r\n      [attendee]=\"selectedAttendee\"\r\n      (attendeeChange)=\"onAttendeeChanged()\">\r\n    </app-attendee-fields>\r\n  </div>\r\n\r\n  <div class=\"card\">\r\n    <app-attendee-fields \r\n      [title]=\"'Organizer Only'\"\r\n      [filter]=\"Role.BackOffice\"\r\n      [event]=\"event\"\r\n      [attendee]=\"selectedAttendee\"\r\n      (attendeeChange)=\"onAttendeeChanged()\">\r\n    </app-attendee-fields>\r\n  </div>\r\n\r\n</div>"

/***/ }),

/***/ "./src/app/event-view/event-view.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/event-view/event-view.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EventViewComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pagetitle_service__ = __webpack_require__("./src/app/pagetitle.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_shared__ = __webpack_require__("./src/app/shared/shared.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__event_delete_popup_event_delete_popup_component__ = __webpack_require__("./src/app/event-delete-popup/event-delete-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__event_users_popup_event_users_popup_component__ = __webpack_require__("./src/app/event-users-popup/event-users-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__progress_kendo_angular_grid__ = __webpack_require__("./node_modules/@progress/kendo-angular-grid/dist/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__event_field_popup_event_field_popup_component__ = __webpack_require__("./src/app/event-field-popup/event-field-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__common_service__ = __webpack_require__("./src/app/common.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__shared_pipes_attendee_fields_filter_pipe__ = __webpack_require__("./src/app/shared/pipes/attendee-fields-filter.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__shared_pipes_organizer_fields_filter_pipe__ = __webpack_require__("./src/app/shared/pipes/organizer-fields-filter.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__alert_popup_alert_popup_component__ = __webpack_require__("./src/app/alert-popup/alert-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__add_attendee_popup_add_attendee_popup_component__ = __webpack_require__("./src/app/add-attendee-popup/add-attendee-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__profile_edit_popup_profile_edit_popup_component__ = __webpack_require__("./src/app/profile-edit-popup/profile-edit-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__attendee_fields_popup_attendee_fields_popup_component__ = __webpack_require__("./src/app/attendee-fields-popup/attendee-fields-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__attendee_delete_popup_attendee_delete_popup_component__ = __webpack_require__("./src/app/attendee-delete-popup/attendee-delete-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__send_rsvp_popup_send_rsvp_popup_component__ = __webpack_require__("./src/app/send-rsvp-popup/send-rsvp-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__send_reminder_popup_send_reminder_popup_component__ = __webpack_require__("./src/app/send-reminder-popup/send-reminder-popup.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





















var flatten = function (filter) {
    var filters = (filter || {}).filters;
    if (filters) {
        return filters.reduce(function (acc, curr) { return acc.concat(curr.filters ? flatten(curr) : [curr]); }, []);
    }
    return [];
};
var EventViewComponent = /** @class */ (function () {
    function EventViewComponent(modal, pagetitle, router, service) {
        this.modal = modal;
        this.pagetitle = pagetitle;
        this.router = router;
        this.service = service;
        this.segments = [];
        this.EventDisplayTab = __WEBPACK_IMPORTED_MODULE_3__shared_shared__["c" /* EventDisplayTab */];
        this.activeTab = __WEBPACK_IMPORTED_MODULE_3__shared_shared__["c" /* EventDisplayTab */].Details;
        this.ShowType = __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["e" /* ShowType */];
        this.Role = __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */];
        this.InputType = __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["b" /* InputType */];
        this.HelperSvc = __WEBPACK_IMPORTED_MODULE_11__common_service__["a" /* CommonService */];
        this.showAllInfo = false;
        this.isFieldsDirty = false;
        this.canEditAttendees = false;
        this.canEditSettings = false;
        this.canAddAttendee = false;
        this.canDeleteAttendee = false;
        this.canEditProfiles = false;
        this.canViewPassportInfo = false;
        this.checkedAttendees = {};
        this.attendeeFilter = new __WEBPACK_IMPORTED_MODULE_12__shared_pipes_attendee_fields_filter_pipe__["a" /* AttendeeFieldsFilterPipe */]();
        this.organizerFilter = new __WEBPACK_IMPORTED_MODULE_13__shared_pipes_organizer_fields_filter_pipe__["a" /* OrganizerFieldsFilterPipe */]();
        // init grid state
        this.state = {
            skip: 0,
            take: 25,
            filter: { logic: 'and', filters: [] },
            sort: [{ field: 'Name', dir: 'asc' }]
        };
        // init query results
        this.results = { Total: 0, Hotel: 0, RSVPD: 0, Completed: 0 };
    }
    EventViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.event) {
            this.router.navigate(['events']);
        }
        this.service.getMyProfile().subscribe(function (me) {
            _this.currentUser = me;
            _this.onInputsChanged();
        });
        this.service.getSegments()
            .subscribe(function (segments) {
            _this.segments = segments;
            var segs = {};
            segments.forEach(function (segment) {
                segs[segment] = 0;
            });
            _this.results.Segments = segs;
        });
        if (!this.event.Fields) {
            this.event.Fields = [];
        }
        this.dataStateChange(this.state);
        this.rebindFieldTables(null);
    };
    EventViewComponent.prototype.onInputsChanged = function () {
        var _this = this;
        if (this.event) {
            setTimeout(function () {
                _this.pagetitle.setActivePage(__WEBPACK_IMPORTED_MODULE_3__shared_shared__["f" /* SideMenuMode */].Events, _this.event.Name);
            });
        }
        this.canEditAttendees = __WEBPACK_IMPORTED_MODULE_11__common_service__["a" /* CommonService */].canEditEvent(this.currentUser, this.event);
        this.canEditSettings = __WEBPACK_IMPORTED_MODULE_11__common_service__["a" /* CommonService */].canEditEvent(this.currentUser, this.event, __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Lead);
        this.canAddAttendee = __WEBPACK_IMPORTED_MODULE_11__common_service__["a" /* CommonService */].canEditEvent(this.currentUser, this.event, __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Lead | __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Support | __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Business);
        this.canDeleteAttendee = __WEBPACK_IMPORTED_MODULE_11__common_service__["a" /* CommonService */].canEditEvent(this.currentUser, this.event, __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Lead | __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Support | __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Business);
        this.canEditProfiles = __WEBPACK_IMPORTED_MODULE_11__common_service__["a" /* CommonService */].canEditProfile(this.currentUser, null, this.event, __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Lead | __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].Support);
        this.canViewPassportInfo = __WEBPACK_IMPORTED_MODULE_11__common_service__["a" /* CommonService */].canViewPassportInfo(this.currentUser, null, this.event);
    };
    Object.defineProperty(EventViewComponent.prototype, "event", {
        get: function () {
            return this._event;
        },
        set: function (event) {
            this._event = event;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    EventViewComponent.prototype.onTabClick = function (event) {
        this.activeTab = __WEBPACK_IMPORTED_MODULE_3__shared_shared__["c" /* EventDisplayTab */][event.target.id];
    };
    EventViewComponent.prototype.onTabClose = function (event) {
        event.stopPropagation();
        this.selectedAttendee = null;
        if (this.activeTab == __WEBPACK_IMPORTED_MODULE_3__shared_shared__["c" /* EventDisplayTab */].Attendee) {
            this.activeTab = __WEBPACK_IMPORTED_MODULE_3__shared_shared__["c" /* EventDisplayTab */].Details;
        }
    };
    Object.defineProperty(EventViewComponent.prototype, "selectedAttendee", {
        get: function () {
            return this._attendee;
        },
        set: function (attendee) {
            this._attendee = attendee;
        },
        enumerable: true,
        configurable: true
    });
    EventViewComponent.prototype.toggleShowAll = function () {
        this.showAllInfo = !this.showAllInfo;
    };
    Object.defineProperty(EventViewComponent.prototype, "daysUntilEvent", {
        get: function () {
            var date = new Date(Date.now());
            var temp = new Date(this.event.StartDate);
            var ms = temp.getTime() - date.getTime();
            if (ms > 0) {
                return Math.floor(ms / (1000 * 60 * 60 * 24));
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventViewComponent.prototype, "eventFields", {
        get: function () {
            return this.event.Fields.filter(function (f) { return f.Included; });
        },
        enumerable: true,
        configurable: true
    });
    EventViewComponent.prototype.imgErrHandler = function (event) {
        event.target.className += " d-none";
        var dom = event.target.nextSibling.nextSibling;
        dom.className = dom.className.replace('d-none', '');
    };
    EventViewComponent.prototype.getAttendeeQueryParams = function () {
        // convert to service params
        var params = {
            Skip: this.state.skip,
            Size: this.state.take,
            Sort: this.state.sort.map(function (s) {
                return {
                    Field: s.field,
                    Desc: s.dir == "desc"
                };
            }),
            Filters: flatten(this.state.filter).map(function (filter) {
                var fd = filter;
                return {
                    Field: fd.field,
                    Operator: fd.operator,
                    Value: fd.value
                };
            })
        };
        return params;
    };
    EventViewComponent.prototype.loadAttendees = function () {
        var _this = this;
        this.grid.loading = true;
        var params = this.getAttendeeQueryParams();
        this.service.getEventAttendees(this.event.ID, params)
            .subscribe(function (results) {
            _this.results = results;
            _this.view = {
                data: results.Attendees,
                total: results.Total
            };
            _this.grid.loading = false;
            _this.loadAttendeeContextMenuFix();
        }, function (error) {
            // show error message.
            _this.grid.loading = false;
        });
    };
    EventViewComponent.prototype.loadAttendeeContextMenuFix = function () {
        window.setTimeout(function () {
            $('.attendee-edit-dropdown').on('show.bs.dropdown', function (event) {
                var menuId = "#att_menu_" + event.target.dataset.id;
                $('body').append($(menuId).css({
                    position: 'absolute'
                }).detach());
            });
        }, 50);
    };
    EventViewComponent.prototype.sortChange = function (sort) {
        this.state.sort = sort;
    };
    EventViewComponent.prototype.dataStateChange = function (state) {
        this.state = state;
        this.loadAttendees();
    };
    Object.defineProperty(EventViewComponent.prototype, "checkedAttendeeCount", {
        get: function () {
            return Object.keys(this.checkedAttendees).length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventViewComponent.prototype, "areAllChecked", {
        get: function () {
            var _this = this;
            if (!this.results ||
                !this.results.Attendees ||
                !this.results.Attendees.length) {
                return false;
            }
            if (this.results.Attendees.some(function (a) {
                if (!_this.checkedAttendees[a.ID]) {
                    return true;
                }
            })) {
                return false;
            }
            else {
                return true;
            }
        },
        enumerable: true,
        configurable: true
    });
    EventViewComponent.prototype.onCheckAllAttendees = function (event) {
        var _this = this;
        if (event.target.checked) {
            this.results.Attendees.forEach(function (a) {
                if (!_this.checkedAttendees[a.ID]) {
                    _this.checkedAttendees[a.ID] = a;
                }
            });
        }
        else {
            this.results.Attendees.forEach(function (a) {
                if (_this.checkedAttendees[a.ID]) {
                    delete _this.checkedAttendees[a.ID];
                }
            });
        }
    };
    EventViewComponent.prototype.onClearAttendeeChecked = function () {
        this.checkedAttendees = {};
    };
    EventViewComponent.prototype.onAttendeeChecked = function (attendee) {
        if (attendee) {
            if (this.checkedAttendees[attendee.ID]) {
                delete this.checkedAttendees[attendee.ID];
            }
            else {
                this.checkedAttendees[attendee.ID] = attendee;
            }
        }
    };
    EventViewComponent.prototype.onAttendeeInfoClicked = function (attendee) {
        if (attendee) {
            this.selectedAttendee = attendee;
            this.activeTab = __WEBPACK_IMPORTED_MODULE_3__shared_shared__["c" /* EventDisplayTab */].Attendee;
        }
    };
    EventViewComponent.prototype.onAttendeeChanged = function () {
        // refresh the attendee list
        this.dataStateChange(this.state);
    };
    EventViewComponent.prototype.popupSendRSVP = function () {
        var _this = this;
        var modalOptions = {
            size: "lg"
        };
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_19__send_rsvp_popup_send_rsvp_popup_component__["a" /* SendRsvpPopupComponent */], modalOptions);
        popupModalRef.componentInstance.event = this.event;
        popupModalRef.componentInstance.attendees = this.checkedAttendees;
        popupModalRef.componentInstance.sendClicked.subscribe(function () {
            _this.onClearAttendeeChecked();
            _this.dataStateChange(_this.state);
        });
    };
    EventViewComponent.prototype.popupSendReminder = function () {
        var _this = this;
        var modalOptions = {
            size: "lg"
        };
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_20__send_reminder_popup_send_reminder_popup_component__["a" /* SendReminderPopupComponent */], modalOptions);
        popupModalRef.componentInstance.eventID = this.event.ID;
        popupModalRef.componentInstance.attendees = this.checkedAttendees;
        popupModalRef.componentInstance.sendClicked.subscribe(function () {
            _this.onClearAttendeeChecked();
        });
    };
    EventViewComponent.prototype.popupDeleteAttendee = function () {
        var _this = this;
        if (!this.checkedAttendees) {
            return;
        }
        var modalOptions = {};
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_18__attendee_delete_popup_attendee_delete_popup_component__["a" /* AttendeeDeletePopupComponent */], modalOptions);
        popupModalRef.componentInstance.eventID = this.event.ID;
        popupModalRef.componentInstance.attendees = this.checkedAttendees;
        popupModalRef.componentInstance.removedClicked.subscribe(function () {
            _this.onClearAttendeeChecked();
            _this.dataStateChange(_this.state);
        });
    };
    EventViewComponent.prototype.onAttendeeExport = function () {
        var _this = this;
        var params = this.getAttendeeQueryParams();
        this.pagetitle.setLoading(true);
        this.service.getEventAttendeeExport(this.event.ID, params).subscribe(function (data) {
            var filename = _this.event.Name + ".xlsx";
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(data, filename);
            }
            else {
                var url = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                document.body.appendChild(link);
                link.setAttribute('style', 'display: none');
                link.download = filename;
                link.href = url;
                link.click();
                window.URL.revokeObjectURL(url);
                link.remove();
            }
            _this.pagetitle.setLoading(false);
        }, function (error) {
            _this.pagetitle.setLoading(false);
        });
    };
    EventViewComponent.prototype.onSendReminderClicked = function (event) {
        var _this = this;
        this.event.SendReminders = event.target.checked;
        event.target.disabled = true;
        this.service.saveEventInfo(this.event)
            .subscribe(function (result) {
            event.target.disabled = false;
            _this.event = result;
        }, function (error) {
            event.target.disabled = false;
        });
    };
    EventViewComponent.prototype.popupAddAttendees = function () {
        var _this = this;
        var modalOptions = {
            size: "lg"
        };
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_15__add_attendee_popup_add_attendee_popup_component__["a" /* AddAttendeePopupComponent */], modalOptions);
        popupModalRef.componentInstance.eventID = this.event.ID;
        popupModalRef.componentInstance.saveClicked.subscribe(function () {
            _this.dataStateChange(_this.state);
        });
    };
    EventViewComponent.prototype.popupEditProfile = function (attendee) {
        var _this = this;
        if (!attendee || !attendee.Profile) {
            return;
        }
        var modalOptions = {
            size: "lg"
        };
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_16__profile_edit_popup_profile_edit_popup_component__["a" /* ProfileEditPopupComponent */], modalOptions);
        popupModalRef.componentInstance.event = this.event;
        popupModalRef.componentInstance.profile = attendee.Profile;
        popupModalRef.componentInstance.saveClicked.subscribe(function (profile) {
            _this.onAttendeeChanged();
            popupModalRef.close();
        });
    };
    EventViewComponent.prototype.popupEditAttendeeFields = function (attendee) {
        var _this = this;
        if (!attendee) {
            return;
        }
        var modalOptions = {
            size: "lg"
        };
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_17__attendee_fields_popup_attendee_fields_popup_component__["a" /* AttendeeFieldsPopupComponent */], modalOptions);
        popupModalRef.componentInstance.title = "Edit Other Attendee Details for " + attendee.Profile.FirstName + " " + attendee.Profile.LastName;
        popupModalRef.componentInstance.filter = __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].All;
        popupModalRef.componentInstance.event = this.event;
        popupModalRef.componentInstance.attendee = attendee;
        popupModalRef.componentInstance.saveClicked.subscribe(function (attendee) {
            _this.onAttendeeChanged();
            popupModalRef.close();
        });
    };
    EventViewComponent.prototype.popupEditOrganizerFields = function (attendee) {
        var _this = this;
        if (!attendee) {
            return;
        }
        var modalOptions = {
            size: "lg"
        };
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_17__attendee_fields_popup_attendee_fields_popup_component__["a" /* AttendeeFieldsPopupComponent */], modalOptions);
        popupModalRef.componentInstance.title = "Edit Organizer Only for " + attendee.Profile.FirstName + " " + attendee.Profile.LastName;
        popupModalRef.componentInstance.filter = __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["d" /* Role */].BackOffice;
        popupModalRef.componentInstance.event = this.event;
        popupModalRef.componentInstance.attendee = attendee;
        popupModalRef.componentInstance.saveClicked.subscribe(function (attendee) {
            _this.onAttendeeChanged();
            popupModalRef.close();
        });
    };
    EventViewComponent.prototype.rebindFieldTables = function (fields) {
        if (fields) {
            this.isFieldsDirty = false;
            this.event.Fields = fields;
        }
        this.attendeeFields.data = this.attendeeFilter.transform(this.event.Fields);
        this.organizerFields.data = this.organizerFilter.transform(this.event.Fields);
    };
    EventViewComponent.prototype.toggleInclude = function (event) {
        var _this = this;
        var id = Number(event.target.dataset.id);
        if (isNaN(id)) {
            return;
        }
        this.event.Fields.some(function (f) {
            if (f.ID == id) {
                _this.isFieldsDirty = true;
                f.Included = !f.Included;
                return true;
            }
        });
    };
    EventViewComponent.prototype.saveFieldChanges = function () {
        var _this = this;
        this.pagetitle.setLoading(true);
        this.service.saveEventFields(this.event.ID, this.event.Fields).subscribe(function (result) {
            _this.isFieldsDirty = false;
            _this.pagetitle.setLoading(false);
        }, function (error) {
            _this.pagetitle.setLoading(false);
        });
    };
    EventViewComponent.prototype.discardFieldChanges = function () {
        var _this = this;
        this.pagetitle.setLoading(true);
        this.service.getEventFields(this.event.ID).subscribe(function (fields) {
            _this.rebindFieldTables(fields);
            _this.pagetitle.setLoading(false);
        }, function (error) {
            _this.pagetitle.setLoading(false);
        });
    };
    EventViewComponent.prototype.popupDeleteField = function (field) {
        var _this = this;
        if (field == null) {
            return;
        }
        // Find the index
        var index = -1;
        if (!this.event.Fields.some(function (f, i) {
            if (field.ID == f.ID) {
                index = i;
                return true;
            }
        })) {
            return;
        }
        var modalOptions = {};
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_14__alert_popup_alert_popup_component__["a" /* AlertPopupComponent */], modalOptions);
        popupModalRef.componentInstance.title = "Delete Field";
        popupModalRef.componentInstance.text = "Are you sure you want to delete this field?";
        popupModalRef.componentInstance.primaryClicked.subscribe(function () {
            _this.pagetitle.setLoading(true);
            _this.service.deleteEventField(_this.event.ID, field.ID).subscribe(function (fields) {
                _this.rebindFieldTables(fields);
                _this.pagetitle.setLoading(false);
            }, function (error) {
                _this.pagetitle.setLoading(false);
            });
        });
    };
    EventViewComponent.prototype.popupFieldEvent = function (id, access) {
        var _this = this;
        var index = -1;
        var field = __WEBPACK_IMPORTED_MODULE_11__common_service__["a" /* CommonService */].getDefaultEventField(access);
        this.event.Fields.some(function (f, i) {
            if (f.ID == id) {
                index = i;
                field = f;
                return true;
            }
        });
        var modalOptions = {};
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_10__event_field_popup_event_field_popup_component__["a" /* EventFieldPopupComponent */], modalOptions);
        popupModalRef.componentInstance.eventID = this.event.ID;
        popupModalRef.componentInstance.fieldToEdit = field;
        popupModalRef.componentInstance.saveClicked.subscribe(function (field) {
            if (index < 0) {
                _this.event.Fields.push(field);
            }
            else {
                _this.event.Fields[index] = field;
            }
            _this.rebindFieldTables(null);
        });
    };
    EventViewComponent.prototype.popupDeleteEvent = function () {
        var _this = this;
        var modalOptions = {};
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_6__event_delete_popup_event_delete_popup_component__["a" /* EventDeletePopupComponent */], modalOptions);
        popupModalRef.componentInstance.event = this.event;
        popupModalRef.componentInstance.eventDeleted.subscribe(function () {
            popupModalRef.close();
            _this.router.navigate(['events']);
        });
    };
    EventViewComponent.prototype.popupUsersEvent = function () {
        var modalOptions = {};
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_8__event_users_popup_event_users_popup_component__["a" /* EventUsersPopupComponent */], modalOptions);
        popupModalRef.componentInstance.eventToEdit = this.event;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("attendeeGrid"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_9__progress_kendo_angular_grid__["b" /* GridComponent */])
    ], EventViewComponent.prototype, "grid", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("attendeeFields"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_9__progress_kendo_angular_grid__["b" /* GridComponent */])
    ], EventViewComponent.prototype, "attendeeFields", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("organizerFields"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_9__progress_kendo_angular_grid__["b" /* GridComponent */])
    ], EventViewComponent.prototype, "organizerFields", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], EventViewComponent.prototype, "event", null);
    EventViewComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-event-view',
            template: __webpack_require__("./src/app/event-view/event-view.component.html"),
            styles: [__webpack_require__("./src/app/event-view/event-view.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__ng_bootstrap_ng_bootstrap__["b" /* NgbModal */],
            __WEBPACK_IMPORTED_MODULE_2__pagetitle_service__["a" /* PageTitleService */],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */],
            __WEBPACK_IMPORTED_MODULE_7__tradeshow_service__["a" /* TradeshowService */]])
    ], EventViewComponent);
    return EventViewComponent;
}());



/***/ }),

/***/ "./src/app/pagetitle.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PageTitleService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__("./node_modules/rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var PageTitleService = /** @class */ (function () {
    function PageTitleService() {
        this.loadingSource = new __WEBPACK_IMPORTED_MODULE_1_rxjs__["BehaviorSubject"](false);
        this.messageSource = new __WEBPACK_IMPORTED_MODULE_1_rxjs__["BehaviorSubject"](null);
        this.message = this.messageSource.asObservable();
        this.loading = this.loadingSource.asObservable();
    }
    PageTitleService.prototype.setActivePage = function (main, child) {
        if (child === void 0) { child = null; }
        var selectedMenu = {
            mainMenu: main,
            childMenu: child
        };
        this.messageSource.next(selectedMenu);
    };
    PageTitleService.prototype.setLoading = function (isLoading) {
        this.loadingSource.next(isLoading);
    };
    PageTitleService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])()
    ], PageTitleService);
    return PageTitleService;
}());



/***/ }),

/***/ "./src/app/person-finder/person-finder.component.html":
/***/ (function(module, exports) {

module.exports = "<kendo-combobox\n  [data]=\"view | async\"\n  [valueField]=\"'Username'\"\n  [textField]=\"'DisplayName'\"\n  [valuePrimitive]=\"usePrimitive\"\n  [filterable]=\"true\"\n  (filterChange)=\"handleFilter($event)\"\n  [(ngModel)]=\"value\"\n  (valueChange)=\"comboValueChange($event)\"\n  (blur)=\"onBlur()\"\n  [disabled]=\"disabled\"\n  placeholder=\"Enter Name (Last, First / First Last)\"\n  style=\"width: 100%\">\n</kendo-combobox>"

/***/ }),

/***/ "./src/app/person-finder/person-finder.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/person-finder/person-finder.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PersonFinderComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__("./node_modules/rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PersonFinderComponent = /** @class */ (function () {
    function PersonFinderComponent(service) {
        this.service = service;
        this.usePrimitive = true;
        this.disabled = false;
        this.valueChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.onChangeCallback = function (_) { };
        this.onTouchedCallback = function () { };
    }
    PersonFinderComponent_1 = PersonFinderComponent;
    Object.defineProperty(PersonFinderComponent.prototype, "value", {
        get: function () {
            return this.innerValue;
        },
        set: function (v) {
            if (v !== this.innerValue) {
                this.innerValue = v;
                if (this.usePrimitive) {
                    this.view = this.service.getUsersByUsername(v);
                }
                else if (v) {
                    this.view = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
                        var user = [v];
                        observer.next(user);
                        observer.complete();
                    });
                }
                this.onChangeCallback(v);
                this.valueChange.emit(v);
            }
        },
        enumerable: true,
        configurable: true
    });
    PersonFinderComponent.prototype.writeValue = function (value) {
        if (value !== this.innerValue) {
            this.value = value;
        }
    };
    PersonFinderComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    PersonFinderComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    PersonFinderComponent.prototype.comboValueChange = function (value) {
        this.value = value;
    };
    PersonFinderComponent.prototype.onBlur = function () {
        this.onTouchedCallback();
    };
    PersonFinderComponent.prototype.handleFilter = function (value) {
        this.view = this.service.getUsersByName(value);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean)
    ], PersonFinderComponent.prototype, "usePrimitive", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean)
    ], PersonFinderComponent.prototype, "disabled", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", Object)
    ], PersonFinderComponent.prototype, "valueChange", void 0);
    PersonFinderComponent = PersonFinderComponent_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-person-finder',
            template: __webpack_require__("./src/app/person-finder/person-finder.component.html"),
            styles: [__webpack_require__("./src/app/person-finder/person-finder.component.scss")],
            providers: [
                {
                    provide: __WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* NG_VALUE_ACCESSOR */],
                    useExisting: Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_18" /* forwardRef */])(function () { return PersonFinderComponent_1; }),
                    multi: true
                }
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__tradeshow_service__["a" /* TradeshowService */]])
    ], PersonFinderComponent);
    return PersonFinderComponent;
    var PersonFinderComponent_1;
}());



/***/ }),

/***/ "./src/app/privileged-users-list/privileged-users-list.component.html":
/***/ (function(module, exports) {

module.exports = "<div>\n  <kendo-grid class=\"table table-striped\"\n    [data]=\"gridView\" \n    [sortable]=\"true\"\n    [sort]=\"sort\"\n    (sortChange)=\"sortChange($event)\">\n    <kendo-grid-column field=\"Username\" width=\"135\"></kendo-grid-column>\n    <kendo-grid-column field=\"FirstName\" title=\"First Name\"></kendo-grid-column>\n    <kendo-grid-column field=\"LastName\" title=\"Last Name\"></kendo-grid-column>\n    <kendo-grid-column field=\"Email\"></kendo-grid-column>\n    <kendo-grid-column field=\"Segment\" width=\"125\"></kendo-grid-column>\n    <kendo-grid-column field=\"Telephone\" title=\"Work Number\"></kendo-grid-column>\n    <kendo-grid-column *ngIf=\"showEdit\"  width=\"50\" \n      class=\"text-center\" headerClass=\"text-center\">\n      <ng-template kendoGridHeaderTemplate>\n        <button type=\"button\" class=\"close\" title=\"Add Users\" aria-label=\"Close\" (click)=\"popupAddUsers()\">\n          <span class=\"text-info fa fa-plus-circle\" aria-hidden=\"true\"></span>\n        </button>\n      </ng-template>\n      <ng-template kendoGridCellTemplate let-dataItem>\n        <button type=\"button\" class=\"close\" title=\"Remove {{dataItem.Username}}\" aria-label=\"Close\" (click)=\"onRemoveUser(dataItem.Username)\">\n          <span class=\"text-warning fa fa-minus-circle\" aria-hidden=\"true\"></span>\n        </button>\n      </ng-template>\n    </kendo-grid-column>\n  </kendo-grid>\n</div>"

/***/ }),

/***/ "./src/app/privileged-users-list/privileged-users-list.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/privileged-users-list/privileged-users-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PrivilegedUsersListComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__progress_kendo_angular_grid__ = __webpack_require__("./node_modules/@progress/kendo-angular-grid/dist/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__progress_kendo_data_query__ = __webpack_require__("./node_modules/@progress/kendo-data-query/dist/es/main.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__privileged_users_popup_privileged_users_popup_component__ = __webpack_require__("./src/app/privileged-users-popup/privileged-users-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__alert_popup_alert_popup_component__ = __webpack_require__("./src/app/alert-popup/alert-popup.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var PrivilegedUsersListComponent = /** @class */ (function () {
    function PrivilegedUsersListComponent(service, modal) {
        this.service = service;
        this.modal = modal;
        this._privilege = __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["c" /* Permissions */].None;
        this.sort = [{
                field: 'ProductName',
                dir: 'asc'
            }];
    }
    PrivilegedUsersListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getMyProfile().subscribe(function (me) {
            _this.showEdit = (me.Privileges == __WEBPACK_IMPORTED_MODULE_1__shared_Enums__["c" /* Permissions */].Admin);
        });
    };
    PrivilegedUsersListComponent.prototype.popupAddUsers = function () {
        var _this = this;
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_6__privileged_users_popup_privileged_users_popup_component__["a" /* PrivilegedUsersPopupComponent */]);
        popupModalRef.componentInstance.title = this.title;
        popupModalRef.componentInstance.privilege = this.privilege;
        popupModalRef.result.then(function (result) {
            _this.onInputsChanged();
        });
    };
    PrivilegedUsersListComponent.prototype.onRemoveUser = function (username) {
        var _this = this;
        if (!username) {
            return;
        }
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_7__alert_popup_alert_popup_component__["a" /* AlertPopupComponent */]);
        popupModalRef.componentInstance.title = "Remove User Permission";
        popupModalRef.componentInstance.text = "Are you sure you want to remove '" + username + "' from the " + this.title + "?";
        popupModalRef.componentInstance.primaryClicked.subscribe(function () {
            _this.grid.loading = true;
            _this.service.removePrivilegedUser(_this.privilege, username)
                .subscribe(function () {
                _this.onInputsChanged();
            }, function (error) {
                _this.grid.loading = false;
            });
        });
    };
    PrivilegedUsersListComponent.prototype.sortChange = function (sort) {
        this.sort = sort;
        this.onInputsChanged();
    };
    PrivilegedUsersListComponent.prototype.onInputsChanged = function () {
        var _this = this;
        if (this.privilege) {
            this.grid.loading = true;
            this.service.getPrivilegedUsers(this.privilege)
                .subscribe(function (users) {
                _this.gridView = {
                    data: Object(__WEBPACK_IMPORTED_MODULE_3__progress_kendo_data_query__["e" /* orderBy */])(users, _this.sort),
                    total: users.length
                };
                _this.grid.loading = false;
            }, function (error) {
                _this.grid.loading = false;
            });
        }
    };
    Object.defineProperty(PrivilegedUsersListComponent.prototype, "privilege", {
        get: function () {
            return this._privilege;
        },
        set: function (privilege) {
            this._privilege = privilege;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_2__progress_kendo_angular_grid__["b" /* GridComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2__progress_kendo_angular_grid__["b" /* GridComponent */])
    ], PrivilegedUsersListComponent.prototype, "grid", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", String)
    ], PrivilegedUsersListComponent.prototype, "title", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], PrivilegedUsersListComponent.prototype, "privilege", null);
    PrivilegedUsersListComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-privileged-users-list',
            template: __webpack_require__("./src/app/privileged-users-list/privileged-users-list.component.html"),
            styles: [__webpack_require__("./src/app/privileged-users-list/privileged-users-list.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__tradeshow_service__["a" /* TradeshowService */],
            __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__["b" /* NgbModal */]])
    ], PrivilegedUsersListComponent);
    return PrivilegedUsersListComponent;
}());



/***/ }),

/***/ "./src/app/privileged-users-popup/privileged-users-popup.component.html":
/***/ (function(module, exports) {

module.exports = "<div [class.loading]=\"isLoading\">\n  <div class=\"modal-header\">\n    <h5 class=\"modal-title w-100\">Add {{title}}</h5>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"cancelPopup()\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n  </div>\n  <div class=\"modal-body\">\n    <div>\n      <app-person-finder [usePrimitive]=\"false\" [(ngModel)]=\"user\"></app-person-finder>\n      <small>\n        <a (click)=\"addUser()\">\n          <i class=\"text-info fa fa-plus-circle fa-lg mr-1\" aria-hidden=\"true\"></i> Add {{title}}\n        </a>\n      </small>\n    </div>\n    <div class=\"row mt-3\" *ngIf=\"users.length\">\n      <div class=\"col-md h6\">{{title}}</div>\n    </div>\n    <div class=\"row\" *ngIf=\"users.length\">\n      <div class=\"col-md\">\n        <div class=\"row\" *ngFor=\"let user of users; let i = index\">\n          <div class=\"col-md-auto pr-1\">\n            <a (click)=\"removeUser(i)\">\n              <i class=\"text-warning fa fa-minus-circle fa-lg mr-1\" aria-hidden=\"true\"></i>\n            </a>\n          </div>\n          <div class=\"col-md px-0\">\n            {{ user.DisplayName }}\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"alert alert-danger m-0\" role=\"alert\" *ngIf=\"errorMsg\">\n    <i class=\"fa fa-exclamation-circle fa-lg\" aria-hidden=\"true\"></i>&nbsp; {{errorMsg}}\n  </div>\n  <div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-secondary btn-sm px-3\" (click)=\"cancelPopup()\">Cancel</button>\n    <button type=\"button\" class=\"btn btn-primary btn-sm px-4\" (click)=\"onSubmit()\">Save</button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/privileged-users-popup/privileged-users-popup.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/privileged-users-popup/privileged-users-popup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PrivilegedUsersPopupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PrivilegedUsersPopupComponent = /** @class */ (function () {
    function PrivilegedUsersPopupComponent(activeModal, service) {
        this.activeModal = activeModal;
        this.service = service;
        this.users = [];
    }
    PrivilegedUsersPopupComponent.prototype.ngOnInit = function () {
    };
    PrivilegedUsersPopupComponent.prototype.addUser = function () {
        var _this = this;
        if (!this.user) {
            return;
        }
        if (this.users.some(function (u) {
            if (_this.user.Username == u.Username) {
                return true;
            }
        })) {
            this.user = null;
            return;
        }
        this.users.push(this.user);
        this.users.sort(function (a, b) {
            return (a.DisplayName > b.DisplayName) ? 1 : (b.DisplayName > a.DisplayName ? -1 : 0);
        });
        this.user = null;
    };
    PrivilegedUsersPopupComponent.prototype.removeUser = function (index) {
        if (index >= 0 && index < this.users.length) {
            this.users.splice(index, 1);
        }
    };
    PrivilegedUsersPopupComponent.prototype.onSubmit = function () {
        var _this = this;
        this.addUser();
        if (!this.users.length) {
            return;
        }
        this.isLoading = true;
        var usernames = [];
        this.users.forEach(function (u) {
            usernames.push(u.Username);
        });
        this.service.savePrivilegedUsers(this.privilege, usernames)
            .subscribe(function () {
            _this.isLoading = false;
            _this.activeModal.close(true);
        }, function (error) {
            _this.errorMsg = error;
            _this.isLoading = false;
        });
    };
    PrivilegedUsersPopupComponent.prototype.cancelPopup = function () {
        this.activeModal.dismiss();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", String)
    ], PrivilegedUsersPopupComponent.prototype, "title", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Number)
    ], PrivilegedUsersPopupComponent.prototype, "privilege", void 0);
    PrivilegedUsersPopupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-privileged-users-popup',
            template: __webpack_require__("./src/app/privileged-users-popup/privileged-users-popup.component.html"),
            styles: [__webpack_require__("./src/app/privileged-users-popup/privileged-users-popup.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */],
            __WEBPACK_IMPORTED_MODULE_3__tradeshow_service__["a" /* TradeshowService */]])
    ], PrivilegedUsersPopupComponent);
    return PrivilegedUsersPopupComponent;
}());



/***/ }),

/***/ "./src/app/profile-edit-popup/profile-edit-popup.component.html":
/***/ (function(module, exports) {

module.exports = "<div [class.loading]=\"isLoading\">\r\n  <div class=\"modal-header\">\r\n    <h4 class=\"modal-title w-100 font-weight-bold\">Edit Attendee Profile</h4>\r\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"cancelPopup()\">\r\n        <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <div class=\"bg-secondary px-3 py-2 text-dark\" *ngIf=\"event\">\r\n      The fields with a (<span class=\"text-danger\">*</span>) are required by <span class=\"font-weight-bold\">{{event.DataDueDate | date: 'MMM d, yyyy'}}</span>.\r\n  </div>\r\n  <div class=\"modal-body\">\r\n    <form #profileForm=\"ngForm\" class=\"row\">\r\n      <div class=\"col-md-6\">\r\n        <div class=\"md-form\">\r\n          <label for=\"first\" class=\"active\">\r\n            First Name <span class=\"text-danger\" [hidden]=\"!event\">*</span>\r\n          </label>\r\n          <input type=\"text\" id=\"first\" name=\"first\" class=\"form-control\"\r\n                required maxlength=\"50\"\r\n                [(ngModel)]=\"profile.FirstName\">\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"last\" class=\"active\">\r\n            Last Name <span class=\"text-danger\" [hidden]=\"!event\">*</span>\r\n          </label>\r\n          <input type=\"text\" id=\"last\" name=\"last\" class=\"form-control\"\r\n                required maxlength=\"50\"\r\n                [(ngModel)]=\"profile.LastName\">\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"title\" class=\"active\">Title</label>\r\n          <input type=\"text\" id=\"title\" name=\"title\" class=\"form-control\" maxlength=\"100\"\r\n                [(ngModel)]=\"profile.Title\">\r\n        </div>\r\n        <div class=\"md-form\">\r\n            <label for=\"segment\" class=\"active\">\r\n              Segment <span class=\"text-danger\" [hidden]=\"!event\">*</span>\r\n            </label>\r\n            <kendo-dropdownlist \r\n              name=\"segment\"\r\n              [data]=\"segments\"\r\n              [(ngModel)]=\"profile.Segment\"\r\n              style=\"width: 100%\">\r\n            </kendo-dropdownlist>\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"delegate\" class=\"active\">Delegate (if applicable)</label>\r\n          <app-person-finder id=\"delegate\" name=\"delegate\"\r\n                [(ngModel)]=\"profile.DelegateUsername\">\r\n          </app-person-finder>\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"email\" class=\"active\">\r\n            Email <span class=\"text-danger\" [hidden]=\"!event\">*</span>\r\n          </label>\r\n          <input type=\"text\" id=\"email\" name=\"email\" class=\"form-control\" \r\n                required maxlength=\"256\"\r\n                [(ngModel)]=\"profile.Email\">\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"phone\" class=\"active\">\r\n            Work Number <span class=\"text-danger\" [hidden]=\"!event\">*</span>\r\n          </label>\r\n          <input type=\"text\" id=\"phone\" name=\"phone\" class=\"form-control\" maxlength=\"24\"\r\n                [(ngModel)]=\"profile.Telephone\">\r\n        </div>\r\n        <div class=\"md-form\">\r\n          <label for=\"mobile\" class=\"active\">\r\n            Mobile Number <span class=\"text-danger\" [hidden]=\"!event\">*</span>\r\n          </label>\r\n          <input type=\"text\" id=\"mobile\" name=\"mobile\" class=\"form-control\" maxlength=\"24\"\r\n                [(ngModel)]=\"profile.Mobile\">\r\n        </div>\r\n      </div>\r\n      <div class=\"col-md-6\">\r\n        <div class=\"md-form\">\r\n          <label for=\"badgeName\" class=\"active\">\r\n            Badge Name <span class=\"text-danger\" [hidden]=\"!event\">*</span>\r\n          </label>\r\n          <input type=\"text\" id=\"badgeName\" name=\"badgeName\" class=\"form-control\"\r\n                required maxlength=\"100\"\r\n                [(ngModel)]=\"profile.BadgeName\">\r\n        </div>\r\n        <div class=\"md-form\" *ngIf=\"showPassportInfo\">\r\n          <label for=\"passportName\" class=\"active\">\r\n            Passport Name <span class=\"text-danger\" [hidden]=\"!event\">*</span>\r\n          </label>\r\n          <input type=\"text\" id=\"passportName\" name=\"passportName\" class=\"form-control\" maxlength=\"100\"\r\n                [(ngModel)]=\"profile.PassportName\">\r\n        </div>\r\n        <div class=\"md-form\" *ngIf=\"showPassportInfo\">\r\n          <label for=\"passportNumber\" class=\"active\">\r\n            Passport Number <span class=\"text-danger\" [hidden]=\"!event\">*</span>\r\n          </label>\r\n          <input type=\"text\" id=\"passportNumber\" name=\"passportNumber\" class=\"form-control\"\r\n                [(ngModel)]=\"profile.PassportNumber\">\r\n        </div>\r\n        <div class=\"md-form\" *ngIf=\"showPassportInfo\">\r\n          <label for=\"nationality\" class=\"active\">\r\n            Nationality <span class=\"text-danger\" [hidden]=\"!event\">*</span>\r\n          </label>\r\n          <input type=\"text\" id=\"nationality\" name=\"nationality\" class=\"form-control\" maxlength=\"50\"\r\n                [(ngModel)]=\"profile.Nationality\">\r\n        </div>\r\n        <div class=\"md-form\" *ngIf=\"showPassportInfo\">\r\n          <label for=\"dob\" class=\"active\">\r\n            Date of Birth <span class=\"text-danger\" [hidden]=\"!event\">*</span>\r\n          </label>\r\n          <kendo-datepicker \r\n            id=\"dob\" name=\"dob\"\r\n            [(ngModel)]=\"profile.DOB\"\r\n            [activeView]=\"'decade'\"\r\n            placeholder=\" \"\r\n            style=\"width: 100%;\">\r\n          </kendo-datepicker>\r\n        </div>\r\n        <div class=\"md-form\" *ngIf=\"showPassportInfo\">\r\n          <label for=\"cob\" class=\"active\">\r\n            Country of Birth <span class=\"text-danger\" [hidden]=\"!event\">*</span>\r\n          </label>\r\n          <input type=\"text\" id=\"cob\" name=\"cob\" class=\"form-control\" maxlength=\"50\"\r\n                [(ngModel)]=\"profile.COB\">\r\n        </div>\r\n        <div class=\"md-form\" *ngIf=\"showPassportInfo\">\r\n          <label for=\"cor\" class=\"active\">\r\n            Country of Residence <span class=\"text-danger\" [hidden]=\"!event\">*</span>\r\n          </label>\r\n          <input type=\"text\" id=\"cor\" name=\"cor\" class=\"form-control\" maxlength=\"50\"\r\n                [(ngModel)]=\"profile.COR\">\r\n        </div>\r\n        <div class=\"md-form\" *ngIf=\"showPassportInfo\">\r\n          <label for=\"coi\" class=\"active\">\r\n            Country of Issue <span class=\"text-danger\" [hidden]=\"!event\">*</span>\r\n          </label>\r\n          <input type=\"text\" id=\"coi\" name=\"coi\" class=\"form-control\" maxlength=\"50\"\r\n                [(ngModel)]=\"profile.COI\">\r\n        </div>\r\n      </div>\r\n    </form>\r\n  </div>\r\n  <div class=\"modal-footer\">\r\n    <div class=\"alert alert-danger m-0 py-1 mr-3\" role=\"alert\" [hidden]=\"!errorMsg\">\r\n      <i class=\"fa fa-exclamation-circle fa-lg\" aria-hidden=\"true\"></i>&nbsp; {{errorMsg}}\r\n    </div>\r\n    <button type=\"button\" class=\"btn btn-secondary btn-sm px-3\" (click)=\"cancelPopup()\">CANCEL</button>\r\n    <button type=\"button\" class=\"btn btn-primary btn-sm px-4\" [disabled]=\"!profileForm.valid\" (click)=\"saveChanges()\">SAVE</button>\r\n  </div>\r\n</div>"

/***/ }),

/***/ "./src/app/profile-edit-popup/profile-edit-popup.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/profile-edit-popup/profile-edit-popup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileEditPopupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_service__ = __webpack_require__("./src/app/common.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pagetitle_service__ = __webpack_require__("./src/app/pagetitle.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_shared__ = __webpack_require__("./src/app/shared/shared.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ProfileEditPopupComponent = /** @class */ (function () {
    function ProfileEditPopupComponent(activeModal, service, pagesvc) {
        this.activeModal = activeModal;
        this.service = service;
        this.pagesvc = pagesvc;
        this.saveClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
    }
    ProfileEditPopupComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getMyProfile().subscribe(function (user) {
            _this.currentUser = user;
            _this.onInputsChanged();
        });
        this.service.getSegments()
            .subscribe(function (res) {
            _this.segments = res;
            if (res.indexOf(_this.profile.Segment) == -1) {
                _this.segments.push(_this.profile.Segment);
            }
        });
    };
    Object.defineProperty(ProfileEditPopupComponent.prototype, "profile", {
        get: function () {
            return this._profile;
        },
        set: function (profile) {
            this._profile = Object.assign({}, profile);
            this.onInputsChanged();
            if (profile && profile.DOB) {
                var temp = new Date(profile.DOB);
                this._profile.DOB = temp;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileEditPopupComponent.prototype, "event", {
        get: function () {
            return this._event;
        },
        set: function (event) {
            this._event = event;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    ProfileEditPopupComponent.prototype.onInputsChanged = function () {
        // show passport info?
        this.showPassportInfo = __WEBPACK_IMPORTED_MODULE_3__common_service__["a" /* CommonService */].canViewPassportInfo(this.currentUser, this.profile, this.event);
    };
    ProfileEditPopupComponent.prototype.saveChanges = function () {
        var _this = this;
        this.isLoading = true;
        this.service.saveUserProfile(this.profile)
            .subscribe(function (result) {
            _this.errorMsg = null;
            if (_this.currentUser.FirstName != _this.profile.FirstName ||
                _this.currentUser.LastName != _this.profile.LastName) {
                _this.pagesvc.setActivePage(__WEBPACK_IMPORTED_MODULE_5__shared_shared__["f" /* SideMenuMode */].Profile);
            }
            _this.saveClicked.emit(result);
            _this.isLoading = false;
        }, function (error) {
            _this.errorMsg = error;
            _this.isLoading = false;
        });
    };
    ProfileEditPopupComponent.prototype.cancelPopup = function () {
        this.activeModal.close("Cancel clicked");
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */])
    ], ProfileEditPopupComponent.prototype, "saveClicked", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ProfileEditPopupComponent.prototype, "profile", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ProfileEditPopupComponent.prototype, "event", null);
    ProfileEditPopupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-profile-edit-popup',
            template: __webpack_require__("./src/app/profile-edit-popup/profile-edit-popup.component.html"),
            styles: [__webpack_require__("./src/app/profile-edit-popup/profile-edit-popup.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */],
            __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__["a" /* TradeshowService */],
            __WEBPACK_IMPORTED_MODULE_4__pagetitle_service__["a" /* PageTitleService */]])
    ], ProfileEditPopupComponent);
    return ProfileEditPopupComponent;
}());



/***/ }),

/***/ "./src/app/profile-info/profile-info.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"card p-3\">\n  <div class=\"row\">\n    <div class=\"col-md-auto text-center\">\n      <div class=\"h6\">Attendee Profile</div>\n      <div>\n        <figure class=\"figure\">\n          <img src=\"{{photoBaseUrl}}/{{profile.EmplID}}.jpg\" \n              class=\"photo img-fluid rounded-circle z-depth-0\"\n              (error)=\"imgErrHandler($event)\"\n              *ngIf=\"showProfilePic\">\n          <figcaption class=\"figure-caption text-center font-weight-bold mt-1\" *ngIf=\"showProfilePic\">\n            <a class=\"text-dark\" (click)=\"downloadPhoto()\">Download</a>\n          </figcaption>\n        </figure>\n        <i class=\"fa fa-user-circle photo\" aria-hidden=\"true\" *ngIf=\"!showProfilePic\"></i>\n      </div>\n    </div>\n    <div class=\"col-md\">\n      <div class=\"mb-2\">\n        <span class=\"badge badge-pill px-3\" \n          [class.badge-success]=\"completionText=='COMPLETE'\"\n          [class.badge-danger]=\"completionText=='INCOMPLETE'\"\n          [hidden]=\"!completionText\">\n          {{completionText}}\n        </span>&nbsp;\n      </div>\n      <div class=\"mb-1\">\n        <span class=\"h5\">{{profile?.FirstName}} {{profile?.LastName}}</span>\n      </div>\n      <div class=\"mb-1\">\n        <span class=\"h6 text-muted\">{{profile?.Title}}</span>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-5\">\n          <strong>Segment:</strong> {{profile?.Segment}}\n        </div>\n        <div class=\"col-md-7\" [hidden]=\"!showPassportInfo\">\n          <strong>Passport Name:</strong> {{profile?.PassportName}}\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-5\">\n          <strong>Delegate:</strong> {{profile?.Delegate?.DisplayName}}\n        </div>\n        <div class=\"col-md-7\" [hidden]=\"!showPassportInfo\">\n          <strong>Passport Number:</strong> {{HelperSvc.getMaskedText(profile?.PassportNumber, 2)}}\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-5\">\n          <strong>Email:</strong> {{profile?.Email}}\n        </div>\n        <div class=\"col-md-7\" [hidden]=\"!showPassportInfo\">\n          <strong>Nationality:</strong> {{profile?.Nationality}}\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-5\">\n          <strong>Work Number:</strong> {{profile?.Telephone}}\n        </div>\n        <div class=\"col-md-7\" [hidden]=\"!showPassportInfo\">\n          <strong>Date of Birth:</strong> {{profile?.DOB | date:'MM/dd/yyyy'}}\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-5\">\n          <strong>Mobile Number:</strong> {{profile?.Mobile}}\n        </div>\n        <div class=\"col-md-7\" [hidden]=\"!showPassportInfo\">\n          <strong>Country of Birth:</strong> {{profile?.COB}}\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-5\">\n          <strong>Badge Name:</strong> {{profile?.BadgeName}}\n        </div>\n        <div class=\"col-md-7\" [hidden]=\"!showPassportInfo\">\n          <strong>Country of Residence:</strong> {{profile?.COR}}\n        </div>\n      </div>\n      <div class=\"row\" [hidden]=\"!showPassportInfo\">\n        <div class=\"offset-md-5 col-md-7\">\n          <strong>Country of Issue:</strong> {{profile?.COI}}\n        </div>\n      </div>\n    </div>\n    <div class=\"col-md-auto\">\n      <a class=\"waves-light waves-effect\" (click)=\"popupEditProfile()\">\n        <i class=\"fa fa-pencil-square fa-2x\" aria-hidden=\"true\" [hidden]=\"!showEditLink\"></i>\n      </a>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/profile-info/profile-info.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/profile-info/profile-info.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileInfoComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_service__ = __webpack_require__("./src/app/common.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__profile_edit_popup_profile_edit_popup_component__ = __webpack_require__("./src/app/profile-edit-popup/profile-edit-popup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pagetitle_service__ = __webpack_require__("./src/app/pagetitle.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var ProfileInfoComponent = /** @class */ (function () {
    function ProfileInfoComponent(service, modal, pagetitle, location) {
        this.service = service;
        this.modal = modal;
        this.pagetitle = pagetitle;
        this.location = location;
        this.profileChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.HelperSvc = __WEBPACK_IMPORTED_MODULE_1__common_service__["a" /* CommonService */];
        this.showEditLink = false;
        this.showProfilePic = false;
        this.showPassportInfo = false;
        var url = this.location.normalize(__WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].imgLibraryURL);
        if (url.indexOf("http") == -1) {
            url = this.location.prepareExternalUrl(url);
        }
        this.photoBaseUrl = url;
    }
    ProfileInfoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getMyProfile().subscribe(function (user) {
            _this.currentUser = user;
            _this.onInputsChanged();
        });
    };
    Object.defineProperty(ProfileInfoComponent.prototype, "profile", {
        get: function () {
            return this._profile;
        },
        set: function (profile) {
            this._profile = profile;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileInfoComponent.prototype, "event", {
        get: function () {
            return this._event;
        },
        set: function (event) {
            this._event = event;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    ProfileInfoComponent.prototype.onInputsChanged = function () {
        if (this.profile) {
            this.showProfilePic = this.profile.ShowPicture &&
                (this.profile.EmplID && this.profile.EmplID.length > 0);
        }
        // show edit link and passport info?
        this.showEditLink = this.HelperSvc.canEditProfile(this.currentUser, this.profile, this.event, __WEBPACK_IMPORTED_MODULE_4__shared_Enums__["d" /* Role */].Lead | __WEBPACK_IMPORTED_MODULE_4__shared_Enums__["d" /* Role */].Support);
        this.showPassportInfo = this.HelperSvc.canViewPassportInfo(this.currentUser, this.profile, this.event);
        if (this.event && this.profile) {
            this.completionText = "COMPLETE";
            if (!this.profile.FirstName ||
                !this.profile.LastName ||
                !this.profile.Segment ||
                !this.profile.Email ||
                !this.profile.Telephone ||
                !this.profile.Mobile ||
                !this.profile.BadgeName) {
                this.completionText = "INCOMPLETE";
            }
            else if (this.event.ShowType == __WEBPACK_IMPORTED_MODULE_4__shared_Enums__["e" /* ShowType */].International) {
                if (!this.profile.PassportName ||
                    !this.profile.PassportNumber ||
                    !this.profile.Nationality ||
                    !this.profile.DOB ||
                    !this.profile.COB ||
                    !this.profile.COR ||
                    !this.profile.COI) {
                    this.completionText = "INCOMPLETE";
                }
            }
        }
        else {
            this.completionText = null;
        }
    };
    ProfileInfoComponent.prototype.imgErrHandler = function (event) {
        this.showProfilePic = false;
    };
    ProfileInfoComponent.prototype.downloadPhoto = function () {
        var url = this.photoBaseUrl + '/' + this.profile.EmplID + ".jpg";
        var filename = this.profile.Username + ".jpg";
        this.service.getPhoto(url)
            .subscribe(function (photo) {
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(photo, filename);
            }
            else {
                var url = window.URL.createObjectURL(photo);
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.setAttribute('style', 'display: none');
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            }
        }, function (error) {
            console.log("download error:", JSON.stringify(error));
        });
    };
    ProfileInfoComponent.prototype.popupEditProfile = function () {
        var _this = this;
        var modalOptions = {
            size: "lg"
        };
        var popupModalRef = this.modal.open(__WEBPACK_IMPORTED_MODULE_6__profile_edit_popup_profile_edit_popup_component__["a" /* ProfileEditPopupComponent */], modalOptions);
        popupModalRef.componentInstance.event = this.event;
        popupModalRef.componentInstance.profile = this.profile;
        popupModalRef.componentInstance.saveClicked.subscribe(function (profile) {
            _this.profile = profile;
            _this.profileChange.emit(profile);
            popupModalRef.close();
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", Object)
    ], ProfileInfoComponent.prototype, "profileChange", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ProfileInfoComponent.prototype, "profile", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ProfileInfoComponent.prototype, "event", null);
    ProfileInfoComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-profile-info',
            template: __webpack_require__("./src/app/profile-info/profile-info.component.html"),
            styles: [__webpack_require__("./src/app/profile-info/profile-info.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__tradeshow_service__["a" /* TradeshowService */],
            __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__["b" /* NgbModal */],
            __WEBPACK_IMPORTED_MODULE_7__pagetitle_service__["a" /* PageTitleService */],
            __WEBPACK_IMPORTED_MODULE_8__angular_common__["f" /* Location */]])
    ], ProfileInfoComponent);
    return ProfileInfoComponent;
}());



/***/ }),

/***/ "./src/app/send-reminder-popup/send-reminder-popup.component.html":
/***/ (function(module, exports) {

module.exports = "<div [class.loading]=\"loading\">\n    <div class=\"modal-header\">\n      <h5 class=\"modal-title w-100\">Send Reminders</h5>\n      <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"cancelPopup()\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n    </div>\n    <div class=\"bg-secondary px-3 py-2 text-dark\">\n      Below are the people you are sending reminders.  You will be CC'd on this email.  When you are done click 'SEND'.\n    </div>\n    <div class=\"modal-body\">\n      <div class=\"row\">\n        <div class=\"col-md\">\n          <span class=\"font-weight-bold\">Recipient(s)</span> <span class=\"text-danger\">*</span>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md\">\n          <span class=\"badge badge-info badge-pill mr-1 font-weight-normal p-1 px-2\" *ngFor=\"let name of names\">\n            {{ name }}\n          </span>\n          <span *ngIf=\"!names || !names.length\" class=\"text-danger\">\n            You must select one or more attendees.\n          </span>\n        </div>\n      </div>\n      <div class=\"row mt-3\">\n        <div class=\"col-md\">\n          <span class=\"font-weight-bold\">Email Text</span> <span class=\"text-danger\">*</span>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md\">\n          <textarea kendoTextArea class=\"w-100\"\n            [(ngModel)]=\"request.EmailText\">\n          </textarea>\n        </div>\n      </div>\n      <div class=\"alert alert-danger m-0 py-1 mt-3 mr-3\" role=\"alert\" [hidden]=\"!errorMsg\">\n        <i class=\"fa fa-exclamation-circle fa-lg\" aria-hidden=\"true\"></i>&nbsp; {{errorMsg}}\n      </div>\n    </div>\n    <div class=\"modal-footer\">\n      <button type=\"button\" class=\"btn btn-secondary btn-sm px-3\" (click)=\"cancelPopup()\">Cancel</button>\n      <button type=\"button\" class=\"btn btn-primary btn-sm px-4\" [disabled]=\"!isValid\" (click)=\"onSubmit()\">Send</button>\n    </div>\n  </div>"

/***/ }),

/***/ "./src/app/send-reminder-popup/send-reminder-popup.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/send-reminder-popup/send-reminder-popup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SendReminderPopupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__progress_kendo_angular_inputs__ = __webpack_require__("./node_modules/@progress/kendo-angular-inputs/dist/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SendReminderPopupComponent = /** @class */ (function () {
    function SendReminderPopupComponent(service, activeModal) {
        this.service = service;
        this.activeModal = activeModal;
        this.sendClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this._request = {};
    }
    SendReminderPopupComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(SendReminderPopupComponent.prototype, "eventID", {
        get: function () {
            return this._eventID;
        },
        set: function (eventID) {
            this._eventID = eventID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendReminderPopupComponent.prototype, "attendees", {
        get: function () {
            return this._attendees;
        },
        set: function (attendees) {
            this._attendees = attendees;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendReminderPopupComponent.prototype, "request", {
        get: function () {
            return this._request;
        },
        set: function (request) {
            this._request = request;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendReminderPopupComponent.prototype, "names", {
        get: function () {
            return this._names;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendReminderPopupComponent.prototype, "loading", {
        get: function () {
            return this._loading;
        },
        set: function (loading) {
            this._loading = loading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendReminderPopupComponent.prototype, "isValid", {
        get: function () {
            if (!this.request || !this.request.AttendeeIDs) {
                return false;
            }
            if (!this.request.AttendeeIDs.length) {
                return false;
            }
            if (!this.request.EmailText) {
                return false;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    SendReminderPopupComponent.prototype.onInputsChanged = function () {
        var _this = this;
        if (this.attendees) {
            this.request.AttendeeIDs = [];
            this._names = [];
            Object.keys(this.attendees).forEach(function (k) {
                var attendee = _this.attendees[Number(k)];
                var name = attendee.Profile.FirstName + " " +
                    attendee.Profile.LastName + " (" +
                    attendee.Username + ")";
                _this._names.push(name);
                _this.request.AttendeeIDs.push(Number(k));
            });
            this._names.sort();
        }
    };
    SendReminderPopupComponent.prototype.onSubmit = function () {
        var _this = this;
        if (!this.isValid) {
            return;
        }
        this.loading = true;
        this.service.sendReminder(this.eventID, this.request)
            .subscribe(function (resp) {
            _this.loading = false;
            _this.sendClicked.emit();
            _this.activeModal.close();
        }, function (error) {
            _this.errorMsg = error;
            _this.loading = false;
        });
    };
    SendReminderPopupComponent.prototype.cancelPopup = function () {
        this.activeModal.close();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", Object)
    ], SendReminderPopupComponent.prototype, "sendClicked", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1__progress_kendo_angular_inputs__["d" /* TextAreaDirective */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__progress_kendo_angular_inputs__["d" /* TextAreaDirective */])
    ], SendReminderPopupComponent.prototype, "emailTextArea", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], SendReminderPopupComponent.prototype, "eventID", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], SendReminderPopupComponent.prototype, "attendees", null);
    SendReminderPopupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-send-reminder-popup',
            template: __webpack_require__("./src/app/send-reminder-popup/send-reminder-popup.component.html"),
            styles: [__webpack_require__("./src/app/send-reminder-popup/send-reminder-popup.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__tradeshow_service__["a" /* TradeshowService */],
            __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]])
    ], SendReminderPopupComponent);
    return SendReminderPopupComponent;
}());



/***/ }),

/***/ "./src/app/send-rsvp-popup/send-rsvp-popup.component.html":
/***/ (function(module, exports) {

module.exports = "<div [class.loading]=\"loading\">\n  <div class=\"modal-header\">\n    <h5 class=\"modal-title w-100\">Send RSVP Requests</h5>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"cancelPopup()\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n  </div>\n  <div class=\"bg-secondary px-3 py-2 text-dark\">\n    The attendees listed below will receive a 'RSVP' request email. Enter the due date, adjust the email text, and click 'SEND'.\n  </div>\n  <div class=\"modal-body\">\n    <div class=\"row\">\n      <div class=\"col-md\">\n        <span class=\"font-weight-bold\">RSVP Attendees</span> <span class=\"text-danger\">*</span>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-md\">\n        <span class=\"badge badge-info badge-pill mr-1 font-weight-normal p-1 px-2\" *ngFor=\"let name of names\">\n          {{ name }}\n        </span>\n        <span *ngIf=\"!names || !names.length\" class=\"text-danger\">\n          You must select one or more attendees that have not been sent the RSVP request.\n        </span>\n      </div>\n    </div>\n    <div class=\"row mt-3\">\n      <div class=\"col-md\">\n        <span class=\"font-weight-bold\">Due Date</span> <span class=\"text-danger\">*</span>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <kendo-datepicker #rsvpDueDate\n          [(ngModel)]=\"request.DueDate\"\n          placeholder=\" \"\n          style=\"width: 100%\">\n        </kendo-datepicker>\n      </div>\n    </div>\n    <div class=\"row mt-3\">\n      <div class=\"col-md\">\n        <span class=\"font-weight-bold\">Email Text</span> <span class=\"text-danger\">*</span>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-md\">\n        <textarea kendoTextArea class=\"w-100\"\n          [(ngModel)]=\"request.EmailText\">\n        </textarea>\n      </div>\n    </div>\n    <div class=\"alert alert-danger m-0 py-1 mt-3 mr-3\" role=\"alert\" [hidden]=\"!errorMsg\">\n      <i class=\"fa fa-exclamation-circle fa-lg\" aria-hidden=\"true\"></i>&nbsp; {{errorMsg}}\n    </div>\n  </div>\n  <div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-secondary btn-sm px-3\" (click)=\"cancelPopup()\">Cancel</button>\n    <button type=\"button\" class=\"btn btn-primary btn-sm px-4\" [disabled]=\"!isValid\" (click)=\"onSubmit()\">Send</button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/send-rsvp-popup/send-rsvp-popup.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/send-rsvp-popup/send-rsvp-popup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SendRsvpPopupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__progress_kendo_angular_dateinputs__ = __webpack_require__("./node_modules/@progress/kendo-angular-dateinputs/dist/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__progress_kendo_angular_inputs__ = __webpack_require__("./node_modules/@progress/kendo-angular-inputs/dist/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var RSVP_TEMPLATE = "Hello <EventAttendee.Name>,\n\nWe would like to inform you that you have been nominated to attend <EventInfo.Name>!  RSVP by <Event.RsvpDueDate> to attend.\n  \nPlease Review : <Page: EventInfo.Name>\n  \nThank you,\n  \nEvent Management Team";
var SendRsvpPopupComponent = /** @class */ (function () {
    function SendRsvpPopupComponent(activeModal, service) {
        this.activeModal = activeModal;
        this.service = service;
        this.sendClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this._request = {};
    }
    SendRsvpPopupComponent.prototype.ngOnInit = function () {
        this.request.EmailText = RSVP_TEMPLATE;
    };
    Object.defineProperty(SendRsvpPopupComponent.prototype, "event", {
        get: function () {
            return this._event;
        },
        set: function (event) {
            this._event = event;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendRsvpPopupComponent.prototype, "attendees", {
        get: function () {
            return this._attendees;
        },
        set: function (attendees) {
            this._attendees = attendees;
            this.onInputsChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendRsvpPopupComponent.prototype, "request", {
        get: function () {
            return this._request;
        },
        set: function (request) {
            this._request = request;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendRsvpPopupComponent.prototype, "names", {
        get: function () {
            return this._names;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendRsvpPopupComponent.prototype, "loading", {
        get: function () {
            return this._loading;
        },
        set: function (loading) {
            this._loading = loading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendRsvpPopupComponent.prototype, "isValid", {
        get: function () {
            if (!this.request || !this.request.AttendeeIDs) {
                return false;
            }
            if (!this.request.AttendeeIDs.length) {
                return false;
            }
            if (!this.request.DueDate) {
                return false;
            }
            if (!this.request.EmailText) {
                return false;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    SendRsvpPopupComponent.prototype.onInputsChanged = function () {
        var _this = this;
        if (this.event) {
            if (this.event.StartDate) {
                this.event.StartDate = new Date(this.event.StartDate);
                this.RsvpDueDate.max = this.event.StartDate;
            }
            if (this.event.RsvpDueDate) {
                this.event.RsvpDueDate = new Date(this.event.RsvpDueDate);
                this.request.DueDate = this.event.RsvpDueDate;
            }
            if (this.event.DataDueDate) {
                this.event.DataDueDate = new Date(this.event.DataDueDate);
            }
        }
        if (this.attendees) {
            this.request.AttendeeIDs = [];
            this._names = [];
            Object.keys(this.attendees).forEach(function (k) {
                var attendee = _this.attendees[Number(k)];
                if (attendee.Status == __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["a" /* AttendeeStatus */].Pending ||
                    attendee.Status == __WEBPACK_IMPORTED_MODULE_5__shared_Enums__["a" /* AttendeeStatus */].Invited) {
                    var name_1 = attendee.Profile.FirstName + " " +
                        attendee.Profile.LastName + " (" +
                        attendee.Username + ")";
                    _this._names.push(name_1);
                    _this.request.AttendeeIDs.push(Number(k));
                }
            });
            this._names.sort();
        }
    };
    SendRsvpPopupComponent.prototype.onSubmit = function () {
        var _this = this;
        if (!this.isValid) {
            return;
        }
        this.loading = true;
        this.service.sendRsvpRequest(this.event.ID, this.request)
            .subscribe(function (resp) {
            _this.loading = false;
            _this.event.RsvpDueDate = _this.request.DueDate;
            if (_this.event.DataDueDate < _this.request.DueDate) {
                _this.event.DataDueDate = _this.request.DueDate;
            }
            _this.sendClicked.emit();
            _this.activeModal.close();
        }, function (error) {
            _this.errorMsg = error;
            _this.loading = false;
        });
    };
    SendRsvpPopupComponent.prototype.cancelPopup = function () {
        this.activeModal.close();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", Object)
    ], SendRsvpPopupComponent.prototype, "sendClicked", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])("rsvpDueDate"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3__progress_kendo_angular_dateinputs__["b" /* DatePickerComponent */])
    ], SendRsvpPopupComponent.prototype, "RsvpDueDate", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_4__progress_kendo_angular_inputs__["d" /* TextAreaDirective */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__progress_kendo_angular_inputs__["d" /* TextAreaDirective */])
    ], SendRsvpPopupComponent.prototype, "emailTextArea", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], SendRsvpPopupComponent.prototype, "event", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], SendRsvpPopupComponent.prototype, "attendees", null);
    SendRsvpPopupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-send-rsvp-popup',
            template: __webpack_require__("./src/app/send-rsvp-popup/send-rsvp-popup.component.html"),
            styles: [__webpack_require__("./src/app/send-rsvp-popup/send-rsvp-popup.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */],
            __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__["a" /* TradeshowService */]])
    ], SendRsvpPopupComponent);
    return SendRsvpPopupComponent;
}());



/***/ }),

/***/ "./src/app/settings/settings.component.html":
/***/ (function(module, exports) {

module.exports = "<div style=\"margin-top: 65px;position: relative;\">\n<div *ngFor=\"let privilege of privileges\"\n  class=\"accordion m-3\" id=\"accordionPrivileges\" role=\"tablist\" aria-multiselectable=\"true\">\n  <div class=\"card\">\n    <!-- Card header -->\n    <div class=\"card-header pl-3\" role=\"tab\">\n      <a class=\"collapsed\" data-toggle=\"collapse\" data-parent=\"#accordionPrivileges\" href=\"#collapse{{privilege.value}}\" aria-expanded=\"true\">\n        <h5 class=\"mb-0\">\n          {{privilege.name}} <i class=\"fa fa-angle-down rotate-icon\"></i>\n        </h5>\n      </a>\n    </div>\n    <!-- Card body -->\n    <div id=\"collapse{{privilege.value}}\" class=\"collapse show\" role=\"tabpanel\">\n      <app-privileged-users-list \n        [title]=\"privilege.name\"\n        [privilege]=\"privilege.value\">\n      </app-privileged-users-list>\n    </div>\n  </div>\n</div>\n</div>"

/***/ }),

/***/ "./src/app/settings/settings.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/settings/settings.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pagetitle_service__ = __webpack_require__("./src/app/pagetitle.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__ = __webpack_require__("./src/app/tradeshow.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_shared__ = __webpack_require__("./src/app/shared/shared.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(pagesvc, service) {
        this.pagesvc = pagesvc;
        this.service = service;
    }
    SettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.pagesvc.setActivePage(__WEBPACK_IMPORTED_MODULE_3__shared_shared__["f" /* SideMenuMode */].Settings, null);
        });
        this.privileges = [];
        Object.keys(__WEBPACK_IMPORTED_MODULE_4__shared_Enums__["c" /* Permissions */])
            .filter(function (f) { return !isNaN(Number(f)) && Number(f) > 0; })
            .forEach(function (key) {
            var permission = Number(key);
            var privilege = { name: null, value: permission };
            switch (permission) {
                case __WEBPACK_IMPORTED_MODULE_4__shared_Enums__["c" /* Permissions */].Admin:
                    privilege.name = "Admin Users";
                    break;
                case __WEBPACK_IMPORTED_MODULE_4__shared_Enums__["c" /* Permissions */].CreateShows:
                    privilege.name = "Event Organizers";
                    break;
            }
            _this.privileges.push(privilege);
        });
        this.privileges.sort(function (a, b) {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
        });
    };
    SettingsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-settings',
            template: __webpack_require__("./src/app/settings/settings.component.html"),
            styles: [__webpack_require__("./src/app/settings/settings.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__pagetitle_service__["a" /* PageTitleService */],
            __WEBPACK_IMPORTED_MODULE_2__tradeshow_service__["a" /* TradeshowService */]])
    ], SettingsComponent);
    return SettingsComponent;
}());



/***/ }),

/***/ "./src/app/shared/Enums.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return Role; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return Permissions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ShowType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return InputType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendeeStatus; });
var Role;
(function (Role) {
    Role[Role["None"] = 0] = "None";
    Role[Role["Attendee"] = 1] = "Attendee";
    Role[Role["Travel"] = 2] = "Travel";
    Role[Role["Support"] = 4] = "Support";
    Role[Role["Business"] = 8] = "Business";
    Role[Role["Lead"] = 16] = "Lead";
    Role[Role["BackOffice"] = 30] = "BackOffice";
    Role[Role["All"] = 31] = "All";
    Role[Role["Admin"] = 31] = "Admin";
})(Role || (Role = {}));
var Permissions;
(function (Permissions) {
    Permissions[Permissions["None"] = 0] = "None";
    Permissions[Permissions["CreateShows"] = 1] = "CreateShows";
    Permissions[Permissions["Admin"] = 2147483647] = "Admin";
})(Permissions || (Permissions = {}));
var ShowType;
(function (ShowType) {
    ShowType[ShowType["Unknown"] = 0] = "Unknown";
    ShowType[ShowType["Domestic"] = 1] = "Domestic";
    ShowType[ShowType["International"] = 2] = "International";
})(ShowType || (ShowType = {}));
var InputType;
(function (InputType) {
    InputType[InputType["Unknown"] = 0] = "Unknown";
    InputType[InputType["ShortText"] = 1] = "ShortText";
    InputType[InputType["LongText"] = 2] = "LongText";
    InputType[InputType["Date"] = 3] = "Date";
    InputType[InputType["YesOrNo"] = 4] = "YesOrNo";
    InputType[InputType["Select"] = 5] = "Select";
    InputType[InputType["MultiSelect"] = 6] = "MultiSelect";
})(InputType || (InputType = {}));
var AttendeeStatus;
(function (AttendeeStatus) {
    AttendeeStatus[AttendeeStatus["Unknown"] = 0] = "Unknown";
    AttendeeStatus[AttendeeStatus["Accepted"] = 1] = "Accepted";
    AttendeeStatus[AttendeeStatus["Declined"] = 2] = "Declined";
    AttendeeStatus[AttendeeStatus["Invited"] = 3] = "Invited";
    AttendeeStatus[AttendeeStatus["Pending"] = 4] = "Pending";
})(AttendeeStatus || (AttendeeStatus = {}));


/***/ }),

/***/ "./src/app/shared/grid-rsvp-filter.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridRsvpFilterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__progress_kendo_angular_grid__ = __webpack_require__("./node_modules/@progress/kendo-angular-grid/dist/es/index.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var GridRsvpFilterComponent = /** @class */ (function () {
    function GridRsvpFilterComponent() {
        this.valueChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.values = [];
    }
    GridRsvpFilterComponent.prototype.ngAfterViewInit = function () {
        this.values = this.currentFilter.filters.map(function (f) { return f.value; });
    };
    GridRsvpFilterComponent.prototype.onYesClicked = function (event) {
        if (event.target.checked && !this.isYesChecked) {
            this.values.push("Accepted");
        }
        else if (!event.target.checed && this.isYesChecked) {
            this.values = this.values.filter(function (x) { return x !== "Accepted"; });
        }
        this.onInputsChanged();
    };
    GridRsvpFilterComponent.prototype.onNoClicked = function (event) {
        if (event.target.checked && !this.isNoChecked) {
            this.values.push("Declined");
        }
        else if (!event.target.checed && this.isNoChecked) {
            this.values = this.values.filter(function (x) { return x !== "Declined"; });
        }
        this.onInputsChanged();
    };
    GridRsvpFilterComponent.prototype.onNoneClicked = function (event) {
        if (event.target.checked && !this.isNoneChecked) {
            this.values.push("Pending");
            this.values.push("Invited");
        }
        else if (!event.target.checed && this.isNoneChecked) {
            this.values = this.values.filter(function (x) { return x !== "Pending" && x !== "Invited"; });
        }
        this.onInputsChanged();
    };
    GridRsvpFilterComponent.prototype.onInputsChanged = function () {
        var _this = this;
        this.filterService.filter({
            filters: this.values.map(function (value) { return ({
                field: _this.field,
                operator: "eq",
                value: value
            }); }),
            logic: 'or'
        });
    };
    Object.defineProperty(GridRsvpFilterComponent.prototype, "isYesChecked", {
        get: function () {
            return this.values.some(function (i) { return i == "Accepted"; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridRsvpFilterComponent.prototype, "isNoChecked", {
        get: function () {
            return this.values.some(function (i) { return i == "Declined"; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridRsvpFilterComponent.prototype, "isNoneChecked", {
        get: function () {
            return this.values.some(function (i) { return i == "Pending"; }) &&
                this.values.some(function (i) { return i == "Invited"; });
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], GridRsvpFilterComponent.prototype, "currentFilter", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__progress_kendo_angular_grid__["a" /* FilterService */])
    ], GridRsvpFilterComponent.prototype, "filterService", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", String)
    ], GridRsvpFilterComponent.prototype, "field", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", Object)
    ], GridRsvpFilterComponent.prototype, "valueChange", void 0);
    GridRsvpFilterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'grid-rsvp-filter',
            template: "\n    <div>\n      <input type=\"checkbox\" id=\"cbYes\" class=\"filled-in\" [checked]=\"isYesChecked\" (click)=\"onYesClicked($event)\" />\n      <label for=\"cbYes\">Yes</label>\n    </div>\n    <div>\n      <input type=\"checkbox\" id=\"cbNo\" class=\"filled-in\" [checked]=\"isNoChecked\" (click)=\"onNoClicked($event)\" />\n      <label for=\"cbNo\">No</label>\n    </div>\n    <div>\n      <input type=\"checkbox\" id=\"cbNone\" class=\"filled-in\" [checked]=\"isNoneChecked\" (click)=\"onNoneClicked($event)\" />\n      <label for=\"cbNone\">No Response</label>\n    </div>\n  ",
            styles: []
        }),
        __metadata("design:paramtypes", [])
    ], GridRsvpFilterComponent);
    return GridRsvpFilterComponent;
}());



/***/ }),

/***/ "./src/app/shared/grid-seg-filter.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridSegFilterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__progress_kendo_data_query__ = __webpack_require__("./node_modules/@progress/kendo-data-query/dist/es/main.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__progress_kendo_angular_grid__ = __webpack_require__("./node_modules/@progress/kendo-angular-grid/dist/es/index.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var GridSegFilterComponent = /** @class */ (function () {
    function GridSegFilterComponent() {
        var _this = this;
        this.showFilter = true;
        this.valueChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.value = [];
        this.textAccessor = function (dataItem) { return _this.isPrimitive ? dataItem : dataItem[_this.textField]; };
        this.valueAccessor = function (dataItem) { return _this.isPrimitive ? dataItem : dataItem[_this.valueField]; };
    }
    GridSegFilterComponent.prototype.ngAfterViewInit = function () {
        this.currentData = this.data;
        this.value = this.currentFilter.filters.map(function (f) { return f.value; });
        if (!this.operator) {
            this.operator = "contains";
        }
        //this.showFilter = typeof this.textAccessor(this.currentData[0]) === 'string';
    };
    GridSegFilterComponent.prototype.isItemSelected = function (item) {
        var _this = this;
        return this.value.some(function (x) { return x === _this.valueAccessor(item); });
    };
    GridSegFilterComponent.prototype.onSelectionChange = function (item) {
        var _this = this;
        if (this.value.some(function (x) { return x === item; })) {
            this.value = this.value.filter(function (x) { return x !== item; });
        }
        else {
            this.value.push(item);
        }
        this.filterService.filter({
            filters: this.value.map(function (value) { return ({
                field: _this.field,
                operator: _this.operator,
                value: value
            }); }),
            logic: 'or'
        });
    };
    GridSegFilterComponent.prototype.onInput = function (e) {
        var _this = this;
        this.currentData = Object(__WEBPACK_IMPORTED_MODULE_1__progress_kendo_data_query__["a" /* distinct */])(this.currentData.filter(function (dataItem) { return _this.value.some(function (val) { return val === _this.valueAccessor(dataItem); }); }).concat(Object(__WEBPACK_IMPORTED_MODULE_1__progress_kendo_data_query__["b" /* filterBy */])(this.data, {
            operator: this.operator,
            field: this.textField,
            value: e.target.value
        })), this.textField);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean)
    ], GridSegFilterComponent.prototype, "isPrimitive", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], GridSegFilterComponent.prototype, "currentFilter", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], GridSegFilterComponent.prototype, "data", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], GridSegFilterComponent.prototype, "textField", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], GridSegFilterComponent.prototype, "valueField", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2__progress_kendo_angular_grid__["a" /* FilterService */])
    ], GridSegFilterComponent.prototype, "filterService", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", String)
    ], GridSegFilterComponent.prototype, "field", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", String)
    ], GridSegFilterComponent.prototype, "operator", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean)
    ], GridSegFilterComponent.prototype, "showFilter", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", Object)
    ], GridSegFilterComponent.prototype, "valueChange", void 0);
    GridSegFilterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'grid-seg-filter',
            template: "\n  <ul>\n    <li *ngIf=\"showFilter\">\n      <input class=\"k-textbox\" (input)=\"onInput($event)\" />\n    </li>\n    <li\n      *ngFor=\"let item of currentData; let i = index;\"\n      (click)=\"onSelectionChange(valueAccessor(item))\"\n      [ngClass]=\"{'k-state-selected': isItemSelected(item)}\">\n      <input\n        type=\"checkbox\"\n        id=\"chk-{{valueAccessor(item)}}\"\n        class=\"k-checkbox\"\n        [checked]=\"isItemSelected(item)\" />\n      <label\n        class=\"k-multiselect-checkbox k-checkbox-label\"\n        for=\"chk-{{valueAccessor(item)}}\">\n          {{ textAccessor(item) }}\n      </label>\n    </li>\n  </ul>\n  ",
            styles: ["\n    ul {\n      list-style-type: none;\n      height: 200px;\n      overflow-y: scroll;\n      padding-left: 0;\n      padding-right: 12px;\n    }\n\n    ul>li {\n      padding: 8px 12px;\n      border: 1px solid rgba(0,0,0,.08);\n      border-bottom: none;\n    }\n\n    ul>li:last-of-type {\n      border-bottom: 1px solid rgba(0,0,0,.08);\n    }\n\n    .k-multiselect-checkbox {\n      pointer-events: none;\n    }\n  "]
        })
    ], GridSegFilterComponent);
    return GridSegFilterComponent;
}());



/***/ }),

/***/ "./src/app/shared/pipes/attendee-fields-filter.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendeeFieldsFilterPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var AttendeeFieldsFilterPipe = /** @class */ (function () {
    function AttendeeFieldsFilterPipe() {
    }
    AttendeeFieldsFilterPipe.prototype.transform = function (fields) {
        if (!fields) {
            return fields;
        }
        return fields.filter(function (f) { return __WEBPACK_IMPORTED_MODULE_1__Enums__["d" /* Role */].Attendee == (f.Access & __WEBPACK_IMPORTED_MODULE_1__Enums__["d" /* Role */].Attendee); });
    };
    AttendeeFieldsFilterPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Pipe */])({
            name: 'attendeeFieldsFilter'
        })
    ], AttendeeFieldsFilterPipe);
    return AttendeeFieldsFilterPipe;
}());



/***/ }),

/***/ "./src/app/shared/pipes/event-user-filter.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EventUserFilterPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var EventUserFilterPipe = /** @class */ (function () {
    function EventUserFilterPipe() {
    }
    EventUserFilterPipe.prototype.transform = function (users, role) {
        if (!users) {
            return users;
        }
        return users.filter(function (u) {
            return role == (u.Role & role);
        });
    };
    EventUserFilterPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Pipe */])({
            name: 'eventUserFilter'
        })
    ], EventUserFilterPipe);
    return EventUserFilterPipe;
}());



/***/ }),

/***/ "./src/app/shared/pipes/keys.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return KeysPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var KeysPipe = /** @class */ (function () {
    function KeysPipe() {
    }
    KeysPipe.prototype.transform = function (value, args) {
        var keys = [];
        for (var key in value) {
            keys.push(key);
        }
        return keys;
    };
    KeysPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Pipe */])({
            name: 'keys'
        })
    ], KeysPipe);
    return KeysPipe;
}());



/***/ }),

/***/ "./src/app/shared/pipes/organizer-fields-filter.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrganizerFieldsFilterPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var OrganizerFieldsFilterPipe = /** @class */ (function () {
    function OrganizerFieldsFilterPipe() {
    }
    OrganizerFieldsFilterPipe.prototype.transform = function (fields) {
        if (!fields) {
            return fields;
        }
        return fields.filter(function (f) {
            return (f.Access != __WEBPACK_IMPORTED_MODULE_1__Enums__["d" /* Role */].None) && (__WEBPACK_IMPORTED_MODULE_1__Enums__["d" /* Role */].Attendee != (f.Access & __WEBPACK_IMPORTED_MODULE_1__Enums__["d" /* Role */].Attendee));
        });
    };
    OrganizerFieldsFilterPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Pipe */])({
            name: 'organizerFieldsFilter'
        })
    ], OrganizerFieldsFilterPipe);
    return OrganizerFieldsFilterPipe;
}());



/***/ }),

/***/ "./src/app/shared/pipes/replace.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReplacePipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ReplacePipe = /** @class */ (function () {
    function ReplacePipe() {
    }
    ReplacePipe.prototype.transform = function (value, search, replacement) {
        if (value) {
            value = value.split(search).join(replacement);
        }
        return value;
    };
    ReplacePipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Pipe */])({
            name: 'replace'
        })
    ], ReplacePipe);
    return ReplacePipe;
}());



/***/ }),

/***/ "./src/app/shared/shared.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return SideMenuMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return EventViewMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return EventDisplayTab; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return AttendeeViewMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendeeDisplayTab; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return EventStatusFilter; });
var SideMenuMode;
(function (SideMenuMode) {
    SideMenuMode[SideMenuMode["Attendees"] = 0] = "Attendees";
    SideMenuMode[SideMenuMode["Events"] = 1] = "Events";
    SideMenuMode[SideMenuMode["Settings"] = 2] = "Settings";
    SideMenuMode[SideMenuMode["Profile"] = 3] = "Profile";
})(SideMenuMode || (SideMenuMode = {}));
var EventViewMode;
(function (EventViewMode) {
    EventViewMode[EventViewMode["None"] = 0] = "None";
    EventViewMode[EventViewMode["List"] = 1] = "List";
    EventViewMode[EventViewMode["Display"] = 2] = "Display";
})(EventViewMode || (EventViewMode = {}));
var EventDisplayTab;
(function (EventDisplayTab) {
    EventDisplayTab[EventDisplayTab["Details"] = 0] = "Details";
    EventDisplayTab[EventDisplayTab["Fields"] = 1] = "Fields";
    EventDisplayTab[EventDisplayTab["Settings"] = 2] = "Settings";
    EventDisplayTab[EventDisplayTab["Attendee"] = 3] = "Attendee";
})(EventDisplayTab || (EventDisplayTab = {}));
var AttendeeViewMode;
(function (AttendeeViewMode) {
    AttendeeViewMode[AttendeeViewMode["None"] = 0] = "None";
    AttendeeViewMode[AttendeeViewMode["List"] = 1] = "List";
    AttendeeViewMode[AttendeeViewMode["Display"] = 2] = "Display";
    AttendeeViewMode[AttendeeViewMode["MyProfile"] = 3] = "MyProfile";
})(AttendeeViewMode || (AttendeeViewMode = {}));
var AttendeeDisplayTab;
(function (AttendeeDisplayTab) {
    AttendeeDisplayTab[AttendeeDisplayTab["Profile"] = 0] = "Profile";
    AttendeeDisplayTab[AttendeeDisplayTab["Attendee"] = 1] = "Attendee";
})(AttendeeDisplayTab || (AttendeeDisplayTab = {}));
var EventStatusFilter;
(function (EventStatusFilter) {
    EventStatusFilter[EventStatusFilter["Upcoming"] = 0] = "Upcoming";
    EventStatusFilter[EventStatusFilter["Past"] = 1] = "Past";
})(EventStatusFilter || (EventStatusFilter = {}));


/***/ }),

/***/ "./src/app/tradeshow.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TradeshowService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__("./node_modules/rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_ErrorObservable__ = __webpack_require__("./node_modules/rxjs/_esm5/observable/ErrorObservable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_delay__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/delay.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_operators__ = __webpack_require__("./node_modules/rxjs/_esm5/operators.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shared_Enums__ = __webpack_require__("./src/app/shared/Enums.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__progress_kendo_date_math__ = __webpack_require__("./node_modules/@progress/kendo-date-math/dist/es/main.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var TradeshowService = /** @class */ (function () {
    function TradeshowService(http, location) {
        this.http = http;
        this.location = location;
        var url = this.location.normalize(__WEBPACK_IMPORTED_MODULE_5__environments_environment__["a" /* environment */].apiServiceURL);
        if (url.indexOf("http") == -1) {
            url = this.location.prepareExternalUrl(url);
        }
        this._serviceUrl = url;
        this._tiers = [
            "",
            "Tier 1",
            "Tier 2",
            "Tier 3",
            "Tier 4"
        ];
    }
    Object.defineProperty(TradeshowService.prototype, "currentUser", {
        get: function () {
            return this._currentUser;
        },
        set: function (user) {
            this._currentUser = user;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TradeshowService.prototype, "segments", {
        get: function () {
            return this._segments;
        },
        set: function (segments) {
            this._segments = segments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TradeshowService.prototype, "eventListState", {
        get: function () {
            if (!this._eventListState) {
                var date = new Date(Date.now());
                var start = date;
                var end = Object(__WEBPACK_IMPORTED_MODULE_8__progress_kendo_date_math__["t" /* lastDayOfMonth */])(Object(__WEBPACK_IMPORTED_MODULE_8__progress_kendo_date_math__["d" /* addMonths */])(date, 3));
                this._eventListState = {
                    skip: 0,
                    take: 25,
                    filter: {
                        filters: [{
                                logic: "and",
                                filters: [
                                    { field: "StartDate", operator: "gt", value: start },
                                    { field: "StartDate", operator: "lt", value: end }
                                ]
                            }]
                    },
                    sort: [{ field: 'StartDate', dir: 'asc' }]
                };
            }
            return this._eventListState;
        },
        set: function (state) {
            this._eventListState = state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TradeshowService.prototype, "attendeeListState", {
        get: function () {
            if (!this._attendeeListState) {
                this._attendeeListState = {
                    skip: 0,
                    take: 25,
                    filter: { logic: "and", filters: [] },
                    sort: [{ field: "User.FirstName", dir: "asc" }, { field: "User.LastName", dir: "asc" }]
                };
            }
            return this._attendeeListState;
        },
        set: function (state) {
            this._attendeeListState = state;
        },
        enumerable: true,
        configurable: true
    });
    TradeshowService.prototype.getPhoto = function (url) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.get(url, { responseType: 'blob', withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (pic) {
                observer.next(pic);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.getUsersByUsername = function (username) {
        var _this = this;
        var url = this._serviceUrl + "/users/search?username=" + encodeURI(username);
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.get(url, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (users) {
                observer.next(users);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.getUsersByName = function (name) {
        var _this = this;
        var url = this._serviceUrl + "/users/search?name=" + encodeURI(name);
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.get(url, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (users) {
                observer.next(users);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.getMyProfile = function () {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            if (_this.currentUser) {
                observer.next(_this.currentUser);
                observer.complete();
            }
            else {
                var url = _this._serviceUrl + "/users/me";
                _this.http.get(url, { withCredentials: true })
                    .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                    .subscribe(function (profile) {
                    _this.currentUser = profile;
                    observer.next(profile);
                    observer.complete();
                }, function (error) {
                    observer.error(error);
                });
            }
        });
    };
    TradeshowService.prototype.getUserProfile = function (username) {
        var _this = this;
        var url = this._serviceUrl + "/users/" + username.toLocaleLowerCase();
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (oberver) {
            if (_this.currentUser &&
                _this.currentUser.Username.toUpperCase() == username.toUpperCase()) {
                oberver.next(_this.currentUser);
                oberver.complete();
            }
            else {
                _this.http.get(url, { withCredentials: true })
                    .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                    .subscribe(function (profile) {
                    oberver.next(profile);
                    oberver.complete();
                }, function (error) {
                    oberver.error(error);
                });
            }
        });
    };
    TradeshowService.prototype.saveUserProfile = function (profileToSave) {
        var _this = this;
        var url = this._serviceUrl + "/users/save";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.post(url, profileToSave, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (profile) {
                if (_this.currentUser &&
                    _this.currentUser.Username.toUpperCase() == profile.Username.toUpperCase()) {
                    _this.currentUser = profile;
                }
                observer.next(profile);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.getUserDelegate = function (username) {
        var _this = this;
        var url = this._serviceUrl + "/users/" + username + "/delegate";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.get(url, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (user) {
                observer.next(user);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.getPrivilegedUsers = function (privilege) {
        var _this = this;
        var url = this._serviceUrl + "/privileged/" + privilege.toString() + "/users";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.get(url, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (profiles) {
                observer.next(profiles);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.savePrivilegedUsers = function (privilege, usernames) {
        var _this = this;
        var url = this._serviceUrl + "/privileged/" + privilege.toString() + "/save";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.post(url, usernames, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function () {
                observer.next(true);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.removePrivilegedUser = function (privilege, username) {
        var _this = this;
        var url = this._serviceUrl + "/privileged/" + privilege.toString() + "/" + username.toLocaleLowerCase();
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.delete(url, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function () {
                observer.next(true);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.getEvents = function (params) {
        var _this = this;
        var url = this._serviceUrl + "/events";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.post(url, params, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (results) {
                observer.next(results);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.getEventInfo = function (eventID) {
        var _this = this;
        var url = this._serviceUrl + "/events/" + eventID.toString();
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.get(url, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (event) {
                observer.next(event);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.saveEventInfo = function (eventToSave) {
        var _this = this;
        var url = this._serviceUrl + "/events/save";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.post(url, eventToSave, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (event) {
                observer.next(event);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.deleteEvent = function (eventID) {
        var _this = this;
        var url = this._serviceUrl + "/events/" + eventID.toString();
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.delete(url, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function () {
                observer.next(true);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.saveEventUsers = function (eventID, users) {
        var _this = this;
        var url = this._serviceUrl + "/events/" + eventID.toString() + "/users/save";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.post(url, users, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (event) {
                observer.next(event);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.getEventFields = function (eventID) {
        var _this = this;
        var url = this._serviceUrl + "/events/" + eventID.toString() + "/fields";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.get(url, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (fields) {
                observer.next(fields);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.saveEventFields = function (eventID, fields) {
        var _this = this;
        var url = this._serviceUrl + "/events/" + eventID.toString() + "/fields/save";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.post(url, fields, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (events) {
                observer.next(events);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.saveEventField = function (eventID, field) {
        var _this = this;
        var url = this._serviceUrl + "/events/" + eventID.toString() + "/fields/save";
        var fields = [field];
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.post(url, fields, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (result) {
                observer.next(result);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.deleteEventField = function (eventID, fieldID) {
        var _this = this;
        var url = this._serviceUrl +
            "/events/" + eventID.toString() +
            "/fields/" + fieldID.toString();
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.delete(url, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (fields) {
                observer.next(fields);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.getEventAttendeeExport = function (eventID, params) {
        var _this = this;
        var url = this._serviceUrl + "/events/" + eventID.toString() + "/attendees/export";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.post(url, params, {
                params: {},
                headers: {},
                responseType: 'blob',
                withCredentials: true
            })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (data) {
                observer.next(data);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.getEventAttendees = function (eventID, params) {
        var _this = this;
        var url = this._serviceUrl + "/events/" + eventID.toString() + "/attendees";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.post(url, params, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (results) {
                observer.next(results);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.saveAttendee = function (eventID, attendee) {
        var _this = this;
        var url = this._serviceUrl + "/events/" + eventID.toString() + "/attendees/save";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.post(url, attendee, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (attendee) {
                observer.next(attendee);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.saveEventAttendees = function (eventID, attendees) {
        var _this = this;
        var url = this._serviceUrl + "/events/" + eventID.toString() + "/attendees/saveall";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.post(url, attendees, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (result) {
                observer.next(result);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.getEventAttendee = function (attendeeID) {
        var _this = this;
        var url = this._serviceUrl + "/attendees/" + attendeeID.toString();
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.get(url, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (attendee) {
                observer.next(attendee);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.deleteEventAttendees = function (eventID, attendees) {
        var _this = this;
        var url = this._serviceUrl + "/events/" + eventID.toString() + "/attendees/delete";
        if (attendees && attendees.length) {
            url += "?ids=" + attendees.join("&ids=");
        }
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.delete(url, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (result) {
                observer.next(result);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.sendRsvpRequest = function (eventID, req) {
        var _this = this;
        var url = this._serviceUrl + "/events/" + eventID.toString() + "/sendrsvp";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.post(url, req, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (result) {
                observer.next(result);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.sendReminder = function (eventID, req) {
        var _this = this;
        var url = this._serviceUrl + "/events/" + eventID.toString() + "/sendreminder";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.post(url, req, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (result) {
                observer.next(result);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.getAttendees = function (params) {
        var _this = this;
        var url = this._serviceUrl + "/attendees";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.post(url, params, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (results) {
                observer.next(results);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.getAttendeeEvents = function (username) {
        var _this = this;
        var url = this._serviceUrl + "/attendees/" + username.toLowerCase() + "/events";
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.http.get(url, { withCredentials: true })
                .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                .subscribe(function (events) {
                observer.next(events);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    TradeshowService.prototype.getSegments = function () {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */](function (observer) {
            if (_this.segments && _this.segments.length) {
                observer.next(_this.segments);
                observer.complete();
            }
            else {
                var url = _this._serviceUrl + "/segments";
                _this.http.get(url, { withCredentials: true })
                    .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["a" /* catchError */])(_this.handleError))
                    .subscribe(function (segments) {
                    _this.segments = segments;
                    observer.next(segments);
                    observer.complete();
                }, function (error) {
                    observer.error(error);
                });
            }
        });
    };
    Object.defineProperty(TradeshowService.prototype, "getTiers", {
        get: function () {
            return this._tiers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TradeshowService.prototype, "getShowTypes", {
        get: function () {
            if (!this._showTypes) {
                var keys = Object.keys(__WEBPACK_IMPORTED_MODULE_7__shared_Enums__["e" /* ShowType */]);
                this._showTypes = keys.slice(keys.length / 2);
                this._showTypes[0] = "";
            }
            return this._showTypes;
        },
        enumerable: true,
        configurable: true
    });
    TradeshowService.prototype.handleError = function (error) {
        var msg = "Something bad happened; please try again later.";
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        }
        else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error("Backend returned code " + error.status + ", " +
                ("body was: " + error.error));
            if (error.error) {
                msg = error.error;
            }
        }
        // return an ErrorObservable with a user-facing error message
        return new __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_ErrorObservable__["a" /* ErrorObservable */](msg);
    };
    TradeshowService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_9__angular_common__["f" /* Location */]])
    ], TradeshowService);
    return TradeshowService;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
var environment = {
    production: false,
    apiServiceURL: 'api/',
    imgLibraryURL: 'http://my-dev.harris.com/tradeshowtravel/photos'
};


/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_17" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map