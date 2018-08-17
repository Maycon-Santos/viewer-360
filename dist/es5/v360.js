"use strict";

Object.prototype.merge = function (object) {
    for (var key in object) {
        this[key] = object[key];
    }
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var V360 = function () {
        function V360() {
                _classCallCheck(this, V360);

                var $v360 = document.querySelectorAll('[v360], [V360]');

                for (var i = 0, l = $v360.length; i < l; i++) {
                        this.init($v360[i]);
                }
        }

        _createClass(V360, [{
                key: 'init',
                value: function init($target) {

                        var props = {

                                target: $target,

                                srcs: undefined,
                                sprite: undefined,
                                frames: 0,
                                dragSensitivity: 5,

                                canvas: this.appendCanvas($target),

                                imgs: [],
                                currentImg: 0,

                                mousePressing: undefined,
                                mouseStart: 0,

                                loadedImages: 0

                        };

                        props.merge(JSON.parse($target.getAttribute('v360').replace(/\'/g, '"')));

                        this.preload(props);
                        this.onresize(props);

                        this.V360DOM($target, props);
                }
        }]);

        return V360;
}();

window.addEventListener('load', function () {
        return new V360();
});
'use strict';

V360.prototype.appendCanvas = function ($target) {

    var canvas = {};

    canvas.target = document.createElement('canvas');
    this.resizeCanvas($target, canvas.target);

    canvas.ctx = canvas.target.getContext('2d');

    $target.appendChild(canvas.target);

    return canvas;
};
'use strict';

V360.prototype.preload = function (props) {

        // Preload all images
        for (var j = 1; j <= props.frames; j++) {

                // Insert and get img from the array
                var img = props.imgs[props.imgs.push(new Image()) - 1];

                img.onload = this.onload(props);

                if (props.sprite) {
                        img.src = props.sprite;
                        break;
                }

                img.src = props.srcs.replace('#{frame}', ('000' + j).slice(-3));
        }
};
"use strict";

V360.prototype.resizeCanvas = function ($target, $canvas) {

    $canvas.width = $target.offsetWidth;
    $canvas.height = $target.offsetHeight;
};
"use strict";

V360.prototype.resizeImage = function ($canvas, imgs) {

        for (var i = 0, l = imgs.length; i < l; i++) {

                var $img = imgs[i];

                // If l == 1 is a sprite
                if ($canvas.width <= $canvas.height && l > 1) {

                        $img.height = $img.height * $canvas.width / $img.width;
                        $img.width = $canvas.width;
                } else {

                        $img.width = $img.width * $canvas.height / $img.height;
                        $img.height = $canvas.height;
                }
        }
};
"use strict";

V360.prototype.setImage = function ($canvas, ctx, imgs, n, frames) {

    ctx.clearRect(0, 0, $canvas.width, $canvas.height);

    // If length == 1 is a sprite
    if (imgs.length > 1) ctx.drawImage(imgs[n], 0, 0, imgs[n].width, imgs[n].height);else {
        ctx.drawImage(imgs[0], -(imgs[0].width / frames * n), 0, imgs[0].width, imgs[0].height);
    }
};
'use strict';

V360.prototype.V360DOM = function ($target, props) {
    var _this = this;

    var mousedownHandle = this.onmousedown(props);
    var mouseupHandle = this.onmouseup(props);
    var mousemoveHandle = this.onmousemove(props);
    var resizeHandle = this.onresize(props);

    props.canvas.target.addEventListener('mousedown', mousedownHandle);
    window.addEventListener('mouseup', mouseupHandle);
    window.addEventListener('mousemove', mousemoveHandle);
    window.addEventListener('resize', resizeHandle);

    $target.V360 = {};

    $target.V360.destroy = function () {

        props.canvas.target.removeEventListener('mousedown', mousedownHandle);
        window.removeEventListener('mouseup', mouseupHandle);
        window.removeEventListener('mousemove', mousemoveHandle);
        window.removeEventListener('resize', resizeHandle);

        props.canvas.target.remove();
    };

    $target.V360.start = function () {
        return _this.init($target);
    };

    $target.V360.restart = function () {

        $target.V360.destroy();
        $target.V360.start();
    };
};
"use strict";

V360.prototype.onload = function (props) {
        var _this = this;

        var $canvas = props.canvas.target;
        var ctx = props.canvas.ctx;
        var imgs = props.imgs;

        return function (e) {

                props.loadedImages++;

                if (props.loadedImages < props.frames && !props.sprite) return;

                _this.resizeImage($canvas, imgs);

                _this.setImage($canvas, ctx, imgs, props.currentImg, props.frames);

                _this.onmousedown(props);
                _this.onmouseup(props);
                _this.onmousemove(props);
        };
};
"use strict";

V360.prototype.onmousedown = function (props) {

    return function (e) {

        props.mousePressing = true;
        props.mouseStart = e.pageX;
    };
};
"use strict";

V360.prototype.onmousemove = function (props) {
        var _this = this;

        return function (e) {

                e.preventDefault();

                if (!props.mousePressing) return;

                var mouseMoved = (props.mouseStart - e.pageX) / props.dragSensitivity;

                if (mouseMoved > 1) mouseMoved = 1;
                if (mouseMoved < -1) mouseMoved = -1;

                if (mouseMoved == 1 || mouseMoved == -1) {

                        props.mouseStart = e.pageX;

                        var roundMouseMoved = Math.round(mouseMoved);

                        props.currentImg += roundMouseMoved / Math.abs(roundMouseMoved);

                        if (props.currentImg > props.frames - 1) props.currentImg = 0;
                        if (props.currentImg < 0) props.currentImg = props.frames - 1;

                        _this.setImage(props.canvas.target, props.canvas.ctx, props.imgs, props.currentImg, props.frames);
                }
        };
};
"use strict";

V360.prototype.onmouseup = function (props) {

    return function () {

        props.mousePressing = false;
        props.mouseStart = 0;
    };
};
"use strict";

V360.prototype.onresize = function (props) {
            var _this = this;

            return function () {

                        var $target = props.target;
                        var $canvas = props.canvas.target;

                        if ($canvas.width != $target.offsetWidth || $canvas.height != $target.height) {

                                    var ctx = props.canvas.ctx;
                                    var imgs = props.imgs;
                                    var currentImg = props.currentImg;

                                    _this.resizeCanvas($target, $canvas);
                                    _this.resizeImage($canvas, imgs);

                                    _this.setImage($canvas, ctx, imgs, currentImg, props.frames);
                        }
            };
};
//# sourceMappingURL=v360.js.map
