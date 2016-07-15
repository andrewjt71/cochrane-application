var cochraneExport = require('./cochrane-export.js');

function handleFileSelect(file) {
    var file,
        reader;

    reader = new FileReader();

    reader.onload = (function(theFile) {
        return function(e) {
            var csvData,
                csvDownloadLink;

            updateUiDropped();
            csvData = cochraneExport.createExportFromFile(e.target.result),
            csvDownloadLink = createCsvDownloadLink(csvData);
            csvDownloadLink.click();
        };
    })(file);

    reader.readAsText(file);
}

function createCsvDownloadLink(csvData) {
    var csvDownloadLink = document.createElement('a'),
        blob = new Blob([csvData],{type: 'text/csv;charset=utf-8;'}),
        url = URL.createObjectURL(blob);

    csvDownloadLink.href = url;
    csvDownloadLink.setAttribute('download', 'cochrane-export.csv');

    return csvDownloadLink;
}

function updateUiFileSelection(fileName, fileType, fileSize, lastModifiedDate) {
    var output = [];
    output.push(
        '<strong>Filename: </strong>' + fileName,
        '<strong>Filetype: </strong>' + fileType,
        '<strong>Filesize: </strong>' + fileSize/1000000 + 'Mb',
        '<strong>Last modified: </strong>' + lastModifiedDate.toLocaleDateString()
    );
    $('.upload__file-confirmation').html(output.join('</br>'));
}

function updateUiDropable() {
    $('.upload__drop-zone').addClass('upload__dropzone--hover');
}

function updateUiDropped() {
    $('.upload__drop-zone').addClass('upload__dropzone--success');
    $('.upload__drop-zone').removeClass('upload__dropzone--hover');
}

function updateUiInitial() {
    $('.upload__drop-zone').removeClass('upload__dropzone--hover');
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
    updateUiDropable();
}

function handleDragLeave(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    updateUiInitial();
}

function handleDrop(evt) {
    var  file = evt.dataTransfer.files[0];

    evt.stopPropagation();
    evt.preventDefault();
    updateUiFileSelection(file.name, file.type, file.size, file.lastModifiedDate);
    handleFileSelect(file);
}

module.exports = {
    init: function ($dragDropElement) {
        $dragDropElement.get(0).addEventListener('dragover', handleDragOver, false);
        $dragDropElement.get(0).addEventListener('dragleave', handleDragLeave, false);
        $dragDropElement.get(0).addEventListener('drop', handleDrop, false);

        $('.button__get-started').on('click', function () {
            $('html,body').animate({
                scrollTop: $(".section__upload").offset().top
            });
        });
    }
}
