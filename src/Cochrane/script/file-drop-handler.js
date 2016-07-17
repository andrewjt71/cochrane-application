class FileDropHandler {
    constructor (cochraneAnalyser, csvWriter) {
        this._cochraneAnalyser = cochraneAnalyser;
        this._csvWriter = csvWriter;

        var $dragDropElement = $('.upload__drop-zone');

        $dragDropElement.get(0).addEventListener('dragover', evt => this.handleDragOver(evt), false);
        $dragDropElement.get(0).addEventListener('dragleave', evt => this.handleDragLeave(evt), false);
        $dragDropElement.get(0).addEventListener('drop', evt => this.handleDrop(evt), false);

        $('.button__get-started').on('click', function () {
            $('html,body').animate({
                scrollTop: $(".section__upload").offset().top
            });
        });
    }

    handleFileSelect(file) {
        var file,
            reader;

        reader = new FileReader();

        reader.onload = function (event) {
            var csvData,
                csvDownloadLink,
                recordObjects,
                csvData;

            this.updateUiDropped();
            this._cochraneAnalyser.analyse(event.target.result);
            recordObjects = this._cochraneAnalyser.getRecordObjects();
            csvData = this._csvWriter.createCsvFromRecordObjects(recordObjects, this._cochraneAnalyser.getCodes());
            csvDownloadLink = this.createCsvDownloadLink(csvData);
            csvDownloadLink.click();
        }.bind(this)

        reader.readAsText(file);
    }

    createCsvDownloadLink(csvData) {
        var csvDownloadLink = document.createElement('a'),
            blob = new Blob([csvData],{type: 'text/csv;charset=utf-8;'}),
            url = URL.createObjectURL(blob);

        csvDownloadLink.href = url;
        csvDownloadLink.setAttribute('download', 'cochrane-export.csv');

        return csvDownloadLink;
    }

    updateUiFileSelection(fileName, fileType, fileSize, lastModifiedDate) {
        var output = [];
        output.push(
            '<strong>Filename: </strong>' + fileName,
            '<strong>Filetype: </strong>' + fileType,
            '<strong>Filesize: </strong>' + fileSize/1000000 + 'Mb',
            '<strong>Last modified: </strong>' + lastModifiedDate.toLocaleDateString()
        );
        $('.upload__file-confirmation').html(output.join('</br>'));
    }

    updateUiDropable() {
        $('.upload__drop-zone').addClass('upload__dropzone--hover');
    }

    updateUiDropped() {
        $('.upload__drop-zone').addClass('upload__dropzone--success');
        $('.upload__drop-zone').removeClass('upload__dropzone--hover');
    }

    updateUiInitial() {
        $('.upload__drop-zone').removeClass('upload__dropzone--hover');
    }

    handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
        this.updateUiDropable();
    }

    handleDragLeave(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        this.updateUiInitial();
    }

    handleDrop(evt) {
        var  file = evt.dataTransfer.files[0];

        evt.stopPropagation();
        evt.preventDefault();
        this.updateUiFileSelection(file.name, file.type, file.size, file.lastModifiedDate);
        this.handleFileSelect(file);
    }
}

module.exports = FileDropHandler;
