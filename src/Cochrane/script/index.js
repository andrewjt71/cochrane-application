var FileDropHandler = require('./file-drop-handler.js');
var CochraneAnalyser = require('./cochrane-analyser.js');
var CsvWriter = require('./csv-writer.js');
var Progress = require('./progress.js');

var cochraneAnalyser = new CochraneAnalyser();
var csvWriter = new CsvWriter();

$(document).ready(function() {

    $('.upload').each(function() {
        var fileDropHandler = new FileDropHandler($(this), cochraneAnalyser, csvWriter);
    });

    // @todo: Move this to a module.
    $('.button__get-started').on('click', function () {
        $('html,body').animate({
            scrollTop: $(".section__upload").offset().top
        });
    });
});
