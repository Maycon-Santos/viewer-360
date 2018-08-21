V360.prototype.appendCanvas = function($target){

    let canvas = {};

    canvas.target = document.createElement('canvas');
    this.resizeCanvas($target, canvas.target);

    canvas.ctx = canvas.target.getContext('2d');

    const canvasStyle = {
        webkitTouchCallout: 'none',
        webkitUserSelect: 'none',
        khtmlUserSelect: 'none',
        mozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',

        msTouchAction: 'pan-y',
        touchAction: 'pan-y'
    };
    
    Object.keys(canvasStyle).map(style =>
        canvas.target.style[style] = canvasStyle[style]);

    $target.appendChild(canvas.target);

    return canvas;

}