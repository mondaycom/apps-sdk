"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ForbiddenError = exports.InternalServerError = exports.BadRequestError = exports.NotFoundError = exports.ImplementationError = exports.BaseError = exports.ERROR_CODE = void 0;
var http_status_codes_1 = require("http-status-codes");
var ERROR_CODE;
(function (ERROR_CODE) {
    ERROR_CODE["GENERAL"] = "general";
    ERROR_CODE["NOT_IMPLEMENTED"] = "not implemented";
    ERROR_CODE["FORBIDDEN"] = "forbidden";
    ERROR_CODE["NOT_FOUND"] = "not found";
    ERROR_CODE["BAD_REQUEST"] = "bad request";
    ERROR_CODE["INTERNAL_SERVER"] = "internal server error";
})(ERROR_CODE = exports.ERROR_CODE || (exports.ERROR_CODE = {}));
var BaseError = /** @class */ (function (_super) {
    __extends(BaseError, _super);
    function BaseError(errorCode, message, status) {
        var _this = _super.call(this, message) || this;
        _this.errorCode = errorCode;
        _this.message = message;
        _this.status = status;
        return _this;
    }
    return BaseError;
}(Error));
exports.BaseError = BaseError;
var ImplementationError = /** @class */ (function (_super) {
    __extends(ImplementationError, _super);
    function ImplementationError(message) {
        var _this = _super.call(this, ERROR_CODE.NOT_IMPLEMENTED, message, http_status_codes_1.StatusCodes.NOT_IMPLEMENTED) || this;
        _this.message = message;
        return _this;
    }
    return ImplementationError;
}(BaseError));
exports.ImplementationError = ImplementationError;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message) {
        var _this = _super.call(this, ERROR_CODE.NOT_FOUND, message, http_status_codes_1.StatusCodes.NOT_FOUND) || this;
        _this.message = message;
        return _this;
    }
    return NotFoundError;
}(BaseError));
exports.NotFoundError = NotFoundError;
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(message) {
        var _this = _super.call(this, ERROR_CODE.BAD_REQUEST, message, http_status_codes_1.StatusCodes.BAD_REQUEST) || this;
        _this.message = message;
        return _this;
    }
    return BadRequestError;
}(BaseError));
exports.BadRequestError = BadRequestError;
var InternalServerError = /** @class */ (function (_super) {
    __extends(InternalServerError, _super);
    function InternalServerError(message) {
        var _this = _super.call(this, ERROR_CODE.INTERNAL_SERVER, message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR) || this;
        _this.message = message;
        return _this;
    }
    return InternalServerError;
}(BaseError));
exports.InternalServerError = InternalServerError;
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        var _this = _super.call(this, ERROR_CODE.FORBIDDEN, message, http_status_codes_1.StatusCodes.FORBIDDEN) || this;
        _this.message = message;
        return _this;
    }
    return ForbiddenError;
}(BaseError));
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=apps-sdk-error.js.map