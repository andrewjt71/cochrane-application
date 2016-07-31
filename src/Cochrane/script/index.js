var FileDropHandler = require('./file-drop-handler.js'),
    CochraneAnalyser = require('./cochrane-analyser.js'),
    CsvWriter = require('./csv-writer.js'),
    Progress = require('./progress.js'),
    ScrollButton = require('./scroll-button.js'),
    cochraneAnalyser = new CochraneAnalyser(),
    csvWriter = new CsvWriter(),
    MultiTermSelect = require('./multi-term-select.js');

$(document).ready(function() {
    $('.upload').each(function() {
        var multiTermSelector,
            fileDropHandler;

        multiTermSelector = new MultiTermSelect($(this).find('.multi-term-select'));
        fileDropHandler = new FileDropHandler($(this), cochraneAnalyser, csvWriter, multiTermSelector);
    });

    $('.scroll-button').each(function() {
        var scrollButton = new ScrollButton($(this));
    });
});
