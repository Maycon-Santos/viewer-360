// Transform an element that is not a 360 viewer into a
V360.prototype.set = function($element, props, callback){

    $element.setAttribute('v360', JSON.stringify(props).replace(/\"/g, "'"));

    this.init($element);

    $element.v360.onload = callback;

    return $element.v360;

}