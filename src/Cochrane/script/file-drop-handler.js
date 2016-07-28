class FileDropHandler {
    constructor ($dropElement, cochraneAnalyser, csvWriter) {
        this._cochraneAnalyser = cochraneAnalyser;
        this._csvWriter = csvWriter;
        this._$dropElement = $dropElement;
        this._$modal = $('.upload__modal', this._$dropElement);
        this._$columnSelect = $('.column-select', this._$dropElement);

        this._$exportButton = $('.upload__btn-export', this._$dropElement);
        this._$exportButton2 = $('.btn-export', this._$dropElement);
        this._$searchTermInput = $('.search-terms', this._$dropElement);

        this._$columnSelect.dropdown();
        this._$dropElement.get(0).addEventListener('dragover', evt => this.handleDragOver(evt), false);
        this._$dropElement.get(0).addEventListener('dragleave', evt => this.handleDragLeave(evt), false);
        this._$dropElement.get(0).addEventListener('drop', evt => this.handleDrop(evt), false);
        this._$exportButton.on('click', evt => this.handleExport(evt));
        this._$exportButton2.on('click', evt => this.handleExportClick(evt));
    }

    handleExportClick() {
        this.downloadCsv(this.getSearchString(), this.getSelectedColumns());
        this._$modal.modal('hide');
    }

    handleExport() {
        this.updateUiInitial();
        this._$modal.modal({blurring: true, closable: false}).modal('show');
    }

    updateColumnSelectValues (values) {
        var columnSelectOptionsHtml = '';

        for (var i = 0; i < values.length; i++) {
            columnSelectOptionsHtml += "<option value='" + values[i] + "'>" + values[i] + "</option>";
        }

        this._$columnSelect.html(columnSelectOptionsHtml);
    }

    getSearchString() {
        return this._$searchTermInput.val();
    }

    getSelectedColumns() {
        return this._$columnSelect.val();
    }

    downloadCsv(searchString, selectedColumns) {
        var recordObjects,
            csvData,
            csvDownloadLink;

        recordObjects = this._cochraneAnalyser.getRecordObjects();

        csvData = this._csvWriter.createCsvFromRecordObjects(
            recordObjects,
            this._cochraneAnalyser.getCodes(),
            searchString,
            selectedColumns
        );

        csvDownloadLink = this.createCsvDownloadLink(csvData);
        csvDownloadLink.click();
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
        $('.upload__file-confirmation').removeClass('hidden');
    }

    updateUiHover(valid) {
        this.hideAllMessages();

        if (valid) {
            this.showMessage('valid');
            this.updateDropZoneState('valid');
        } else {
            this.showMessage('invalid');
            this.updateDropZoneState('invalid');
        }
    }

    updateUiAnalysed() {
        this.hideAllMessages();
        this.showMessage('success');
        this.updateDropZoneState('dropped');
        this._$exportButton.removeClass('hidden');
    }

    updateDropZoneState(state) {
        $('.upload__drop-zone', this._$dropElement).removeClass('upload__drop-zone--dropped');
        $('.upload__drop-zone', this._$dropElement).removeClass('upload__drop-zone--valid');
        $('.upload__drop-zone', this._$dropElement).removeClass('upload__drop-zone--invalid');

        if (state !== 'initial'){
            $('.upload__drop-zone', this._$dropElement).addClass('upload__drop-zone--' + state);
        }
    }

    updateUiInitial() {
        this._$exportButton.addClass('hidden');
        this.updateDropZoneState('initial');
        this.hideAllMessages();
        this.showMessage('drop');

        this._$columnSelect.parent().find('a').remove();
        this._$searchTermInput.val('');

        $('.upload__file-confirmation').addClass('hidden');
    }

    hideAllMessages() {
        $('.upload__drop-zone__message--success').addClass('hidden');
        $('.upload__drop-zone__message--invalid').addClass('hidden');
        $('.upload__drop-zone__message--valid').addClass('hidden');
        $('.upload__drop-zone__message--drop').addClass('hidden');
    }

    showMessage(type) {
        $('.upload__drop-zone__message--' + type).removeClass('hidden');
    }

    handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
        this.updateUiHover(evt.dataTransfer.items[0].type == "text/plain");
    }

    handleDragLeave(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        this.updateUiInitial();
    }

    handleDrop(evt) {
        var reader = new FileReader(),
            file = evt.dataTransfer.files[0];

        evt.stopPropagation();
        evt.preventDefault();
        this.updateUiFileSelection(file.name, file.type, file.size, file.lastModifiedDate);

        reader.onload = function (event) {
            var recordObjects,
                csvData,
                valid = (file.type == "text/plain");

            if (valid) {

                this._cochraneAnalyser.analyse(event.target.result);
                this.updateUiAnalysed();
                this.updateColumnSelectValues(this._cochraneAnalyser.getCodes());
            } else {
                this.updateUiInitial()
            }
        }.bind(this)

        reader.readAsText(file);
    }
}

module.exports = FileDropHandler;
