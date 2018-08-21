// Start viewer (Do not confuse with $DOM.v360.animation)
V360.prototype.start = function(){

    const $v360 = document.querySelectorAll('[v360], [V360]');

    for (let i = 0, l = $v360.length; i < l; i++)
        $v360[i].v360.start();

}