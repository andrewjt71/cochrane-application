var fileDrop = require('./file-drop.js');

$(document).ready(function() {
    var dragDropElement = $('.upload__drop-zone');
    if (dragDropElement.length) {
        fileDrop.init(dragDropElement);
    }
});
