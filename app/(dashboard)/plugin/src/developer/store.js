"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
var store = function () {
    return {
        data: {},
        put: function (key, value) {
            // data[key] = value
            this.data[key] = value;
        },
        getStore: function () {
            return this.data;
        }
    };
};
exports.store = store;
