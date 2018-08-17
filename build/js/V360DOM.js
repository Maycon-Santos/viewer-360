V360.prototype.V360DOM = function($target, props){

    const mousedownHandle = this.onmousedown(props);
    const mouseupHandle = this.onmouseup(props);
    const mousemoveHandle = this.onmousemove(props);
    const resizeHandle = this.onresize(props);

    props.canvas.target.addEventListener('mousedown', mousedownHandle);
    window.addEventListener('mouseup', mouseupHandle);
    window.addEventListener('mousemove', mousemoveHandle);
    window.addEventListener('resize', resizeHandle);

    $target.V360 = {};

    $target.V360.destroy = () => {

        props.canvas.target.removeEventListener('mousedown', mousedownHandle);
        window.removeEventListener('mouseup', mouseupHandle);
        window.removeEventListener('mousemove', mousemoveHandle);
        window.removeEventListener('resize', resizeHandle);

        props.canvas.target.remove();

    }

    $target.V360.start = () => this.init($target);

    $target.V360.restart = () => {

        $target.V360.destroy();
        $target.V360.start();

    }


}