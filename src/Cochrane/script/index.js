var FileDropHandler = require('./file-drop-handler.js');
var CochraneAnalyser = require('./cochrane-analyser.js');
var CsvWriter = require('./csv-writer.js');

$(document).ready(function() {
    var cochraneAnalyser = new CochraneAnalyser();
    var csvWriter = new CsvWriter();

    var fileDropHandler = new FileDropHandler(cochraneAnalyser, csvWriter);




    // var dragDropElement = $('.upload__drop-zone');
    // if (dragDropElement.length) {
    //     fileDrop.init(dragDropElement);
    // }
});
