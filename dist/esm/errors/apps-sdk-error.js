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
import { StatusCodes } from 'http-status-codes';
export var ERROR_CODE;
(function (ERROR_CODE) {
    ERROR_CODE["GENERAL"] = "general";
    ERROR_CODE["NOT_IMPLEMENTED"] = "not implemented";
    ERROR_CODE["FORBIDDEN"] = "forbidden";
    ERROR_CODE["NOT_FOUND"] = "not found";
    ERROR_CODE["BAD_REQUEST"] = "bad request";
    ERROR_CODE["INTERNAL_SERVER"] = "internal server error";
})(ERROR_CODE || (ERROR_CODE = {}));
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
export { BaseError };
var ImplementationError = /** @class */ (function (_super) {
    __extends(ImplementationError, _super);
    function ImplementationError(message) {
        var _this = _super.call(this, ERROR_CODE.NOT_IMPLEMENTED, message, StatusCodes.NOT_IMPLEMENTED) || this;
        _this.message = message;
        return _this;
    }
    return ImplementationError;
}(BaseError));
export { ImplementationError };
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message) {
        var _this = _super.call(this, ERROR_CODE.NOT_FOUND, message, StatusCodes.NOT_FOUND) || this;
        _this.message = message;
        return _this;
    }
    return NotFoundError;
}(BaseError));
export { NotFoundError };
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(message) {
        var _this = _super.call(this, ERROR_CODE.BAD_REQUEST, message, StatusCodes.BAD_REQUEST) || this;
        _this.message = message;
        return _this;
    }
    return BadRequestError;
}(BaseError));
export { BadRequestError };
var InternalServerError = /** @class */ (function (_super) {
    __extends(InternalServerError, _super);
    function InternalServerError(message) {
        var _this = _super.call(this, ERROR_CODE.INTERNAL_SERVER, message, StatusCodes.INTERNAL_SERVER_ERROR) || this;
        _this.message = message;
        return _this;
    }
    return InternalServerError;
}(BaseError));
export { InternalServerError };
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        var _this = _super.call(this, ERROR_CODE.FORBIDDEN, message, StatusCodes.FORBIDDEN) || this;
        _this.message = message;
        return _this;
    }
    return ForbiddenError;
}(BaseError));
export { ForbiddenError };
//# sourceMappingURL=apps-sdk-error.js.map