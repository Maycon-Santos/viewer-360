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
                }return 'teste';
        }

        _createClass(V360, [{
                key: 'init',
                value: function init($target) {

                        // If you are already a V360
                        if ($target.v360 && $target.v360.played) return $target.v360.restart();

                        var props = {

                                target: $target,

                                srcs: undefined,
                                sprite: undefined,
                                frames: 0,
                                dragSensitivity: 5,

                                canvas: this.appendCanvas($target),

                                imgs: [],
                                currentFrame: 0,

                                allowDrag: true,
                                mousePressing: undefined,
                                mouseStart: 0,

                                loadedImages: 0

                        };

                        // Replace all ' to "
                        props.merge(JSON.parse($target.getAttribute('v360').replace(/\'/g, '"')));

                        this.preload(props);
                        this.onresize(props);

                        this.V360DOM($target, props);
                }
        }]);

        return V360;
}();

window.addEventListener('load', function () {
        return window.v360 = new V360();
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
"use strict";

/*  
    * Github: https://gist.github.com/gre/1650294
    * Easing Functions - inspired from http://gizma.com/easing/
    * only considering the t value for the range [0, 1] => [0, 1]
*/
V360.prototype.easingFunctions = {
    // no easing, no acceleration
    linear: function linear(t) {
        return t;
    },
    // accelerating from zero velocity
    easeInQuad: function easeInQuad(t) {
        return t * t;
    },
    // decelerating to zero velocity
    easeOutQuad: function easeOutQuad(t) {
        return t * (2 - t);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function easeInOutQuad(t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    // accelerating from zero velocity 
    easeInCubic: function easeInCubic(t) {
        return t * t * t;
    },
    // decelerating to zero velocity 
    easeOutCubic: function easeOutCubic(t) {
        return --t * t * t + 1;
    },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function easeInOutCubic(t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    // accelerating from zero velocity 
    easeInQuart: function easeInQuart(t) {
        return t * t * t * t;
    },
    // decelerating to zero velocity 
    easeOutQuart: function easeOutQuart(t) {
        return 1 - --t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function easeInOutQuart(t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    // accelerating from zero velocity
    easeInQuint: function easeInQuint(t) {
        return t * t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuint: function easeOutQuint(t) {
        return 1 + --t * t * t * t * t;
    },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function easeInOutQuint(t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
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

V360.prototype.resizeImage = function (props) {

            var $canvas = props.canvas.target;
            var imgs = props.imgs;
            var sprite = !!props.sprite;
            var frames = props.frames;

            for (var i = 0, l = imgs.length; i < l; i++) {

                        var $img = imgs[i];

                        if ($canvas.width <= $canvas.height) {

                                    if (sprite) $img.width = $img.width / frames;

                                    $img.height = $img.height * $canvas.width / $img.width;
                                    $img.width = $canvas.width;

                                    if (sprite) $img.width = $img.width * frames;
                        } else {

                                    if (sprite) $img.width = $img.width / frames;

                                    $img.width = $img.width * $canvas.height / $img.height;
                                    $img.height = $canvas.height;

                                    if (sprite) $img.width = $img.width * frames;
                        }
            }
};
"use strict";

V360.prototype.setImage = function (props, n) {

    var $canvas = props.canvas.target;
    var ctx = props.canvas.ctx;
    var imgs = props.imgs;
    var frames = props.frames;
    var sprite = !!props.sprite;

    var $img = imgs[sprite ? 0 : n];

    ctx.clearRect(0, 0, $canvas.width, $canvas.height);

    if (sprite) {

        var pos = -($img.width / frames * n);
        var spriteWidth = $img.width / frames;

        ctx.drawImage($img, pos, 0, $img.width, $img.height);

        ctx.clearRect(spriteWidth, 0, $canvas.width - spriteWidth, $canvas.height);
    } else ctx.drawImage($img, 0, 0, $img.width, $img.height);
};
'use strict';

V360.prototype.V360DOM = function ($target, props) {
    var _this = this;

    var $canvas = props.canvas.target;
    var frames = props.frames - 1;

    // Handles
    var mousedownHandle = this.onmousedown(props);
    var mouseupHandle = this.onmouseup(props);
    var mousemoveHandle = this.onmousemove(props);
    var resizeHandle = this.onresize(props);

    $canvas.addEventListener('mousedown', mousedownHandle);
    window.addEventListener('mouseup', mouseupHandle);
    window.addEventListener('mousemove', mousemoveHandle);
    window.addEventListener('resize', resizeHandle);

    $target.v360 = { played: true };

    $target.v360.start = function () {

        _this.init($target);

        $target.v360.played = true;
    };

    $target.v360.stop = function () {

        // Remove events
        $canvas.removeEventListener('mousedown', mousedownHandle);
        window.removeEventListener('mouseup', mouseupHandle);
        window.removeEventListener('mousemove', mousemoveHandle);
        window.removeEventListener('resize', resizeHandle);

        // Remove canvas of the DOM
        if ($canvas) $canvas.remove();

        $target.v360.played = false;
    };

    $target.v360.restart = function () {

        $target.v360.stop();
        $target.v360.start();
    };

    var stopAnimation = void 0;
    $target.v360.animate = function (to, duration) {
        var easingFunction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'linear';
        var callback = arguments[3];


        var start = performance.now();
        var progressed = 0;

        props.allowDrag = false;

        requestAnimationFrame(function animate(time) {

            var timeFraction = (time - start) / duration;

            // Calculate the current animation state
            var progress = this.easingFunctions[easingFunction || 'linear'](timeFraction);

            if (to == Infinity || to == -Infinity) {

                if (~~timeFraction > progressed) {
                    progressed = ~~timeFraction;
                    props.currentFrame += to == Infinity ? 1 : -1;
                }
            } else if (~~(progress * Math.abs(to)) > progressed) {

                progressed = ~~(progress * Math.abs(to));

                var direction = to / Math.abs(to);
                var nextFrame = props.currentFrame + ~~(progress * to);

                props.currentFrame += nextFrame / Math.abs(nextFrame) * direction;

                console.log(props.currentFrame);
            }

            if (props.currentFrame > frames) props.currentFrame = 0;else if (props.currentFrame < 0) props.currentFrame = frames;

            this.setImage(props, props.currentFrame);

            if (stopAnimation) return props.allowDrag = !(stopAnimation = false);

            if (to == Infinity) return requestAnimationFrame(animate.bind(this));

            if (timeFraction < 1) return requestAnimationFrame(animate.bind(this));else if (typeof callback == 'function') return callback();

            // If you get here means the animation has come to an end
            props.allowDrag = true;
        }.bind(_this));
    };

    $target.v360.stopAnimation = function () {
        return stopAnimation = true;
    };
};
"use strict";

V360.prototype.onload = function (props) {
        var _this = this;

        return function (e) {

                props.loadedImages++;

                if (props.loadedImages < props.frames && !props.sprite) return;

                _this.resizeImage(props);

                _this.setImage(props, props.currentFrame);

                _this.onmousedown(props);
                _this.onmouseup(props);
                _this.onmousemove(props);
        };
};
"use strict";

V360.prototype.onmousedown = function (props) {

        return function (e) {

                if (!props.allowDrag) return;

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

                        props.currentFrame += roundMouseMoved / Math.abs(roundMouseMoved);

                        if (props.currentFrame > props.frames - 1) props.currentFrame = 0;
                        if (props.currentFrame < 0) props.currentFrame = props.frames - 1;

                        _this.setImage(props, props.currentFrame);
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

                                    var currentFrame = props.currentFrame;

                                    _this.resizeCanvas($target, $canvas);
                                    _this.resizeImage(props);

                                    _this.setImage(props, currentFrame);
                        }
            };
};
'use strict';

V360.prototype.restart = function () {

    var $v360 = document.querySelectorAll('[v360], [V360]');

    for (var i = 0, l = $v360.length; i < l; i++) {
        $v360[i].v360.restart();
    }
};
"use strict";

V360.prototype.set = function ($element, props) {

    $element.setAttribute('v360', JSON.stringify(props).replace(/\"/g, "'"));

    this.init($element);
};
'use strict';

V360.prototype.start = function () {

    var $v360 = document.querySelectorAll('[v360], [V360]');

    for (var i = 0, l = $v360.length; i < l; i++) {
        $v360[i].v360.start();
    }
};
'use strict';

V360.prototype.stop = function () {

    var $v360 = document.querySelectorAll('[v360], [V360]');

    for (var i = 0, l = $v360.length; i < l; i++) {
        $v360[i].v360.stop();
    }
};
//# sourceMappingURL=v360.js.map
