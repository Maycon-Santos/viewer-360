// Restart the viewer
V360.prototype.restart = function(){

    const $v360 = document.querySelectorAll('[v360], [V360]');

    for (let i = 0, l = $v360.length; i < l; i++)
        $v360[i].v360.restart();

}