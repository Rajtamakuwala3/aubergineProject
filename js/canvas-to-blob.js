/**
 * blueimp JavaScript Canvas to Blob 2.14.0
 * https://github.com/blueimp/JavaScript-Canvas-to-Blob
 *
 * Copyright 2021, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT License
 * https://opensource.org/licenses/MIT
 */

/* global define */

;(function (global, factory) {
    'use strict'
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory()
    } else if (typeof define === 'function' && define.amd) {
        define(factory)
    } else {
        global.CanvasToBlob = factory()
    }
})(this, function () {
    'use strict'

    function dataURLtoBlob(dataURL, type, quality) {
        var binStr = atob(dataURL.split(',')[1]),
            len = binStr.length,
            arr = new Uint8Array(len)
        for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i)
        }
        return new Blob([arr], { type: type || 'image/jpeg', quality: quality })
    }

    function canvasToBlob(canvas, callback, type, quality) {
        if (canvas.toBlob) {
            canvas.toBlob(callback, type, quality)
            return
        }
        var dataURL = canvas.toDataURL(type, quality)
        callback(dataURLtoBlob(dataURL, type, quality))
    }

    function polyfill() {
        if (HTMLCanvasElement.prototype.toBlob) {
            return
        }
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
            value: function (callback, type, quality) {
                canvasToBlob(this, callback, type, quality)
            },
            writable: true,
            configurable: true,
        })
    }

    return {
        Blob: dataURLtoBlob,
        canvasToBlob: canvasToBlob,
        polyfill: polyfill,
    }
})
