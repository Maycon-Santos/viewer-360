V360.prototype.appendCanvas = function($target){

    let canvas = {};

    canvas.target = document.createElement('canvas');
    this.resizeCanvas($target, canvas.target);

    canvas.ctx = canvas.target.getContext('2d');

    $target.appendChild(canvas.target);

    return canvas;

}