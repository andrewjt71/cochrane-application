/**
 * Class FileDropHandler
 *
 * Handles numerous events on the file drop upload component.
 */
class FileDropHandler {
    constructor ($dropElement, cochraneAnalyser, csvWriter, multiTermSelector) {
        this._cochraneAnalyser = cochraneAnalyser;
        this._csvWriter = csvWriter;
        this._$dropElement = $dropElement;
        this.multiTermSelector = multiTermSelector;
        this._$modal = $('.upload__modal', this._$dropElement);
        this._$columnSelect = $('.column-select', this._$dropElement);

        this._$exportPrepButton = $('.upload__btn-prepare-export', this._$dropElement);
        this._$exportButton = $('.upload__btn-export', this._$dropElement);
        this._$searchTermInput = $('.search-terms', this._$dropElement);

        this._$columnSelect.dropdown();
        this._$dropElement.get(0).addEventListener('dragover', evt => this.handleDragOver(evt), false);
        this._$dropElement.get(0).addEventListener('dragleave', evt => this.handleDragLeave(evt), false);
        this._$dropElement.get(0).addEventListener('drop', evt => this.handleDrop(evt), false);
        this._$exportPrepButton.on('click', evt => this.handlePrepareExport(evt));
        this._$exportButton.on('click', evt => this.handleExport(evt));
    }

    /**
     * Update options in column select input
     *
     * @param array values
     */
    updateColumnSelectValues (values) {
        var columnSelectOptionsHtml = '';

        for (var i = 0; i < values.length; i++) {
            columnSelectOptionsHtml += "<option value='" + values[i] + "'>" + values[i] + "</option>";
        }

        this._$columnSelect.html(columnSelectOptionsHtml);
    }

    /**
     * Get search string set in input.
     *
     * @return string
     */
    getSearchString() {
        return this.multiTermSelector.getValues().join('|');
    }

    /**
     * Get filter columns from column select input.
     */
    getSelectedColumns() {
        return this._$columnSelect.val();
    }

    /**
     * Create csv with data generated by analyser and download in the browser.
     *
     * @param string searchString
     * @param array selectedColumns
     */
    createAndDownloadCsv(searchString, selectedColumns) {
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

    /**
     * Create download link for specified data to download
     *
     * @param string csvData
     *
     * @return {}
     */
    createCsvDownloadLink(csvData) {
        var csvDownloadLink = document.createElement('a'),
            blob = new Blob([csvData],{type: 'text/csv;charset=utf-8;'}),
            url = URL.createObjectURL(blob);

        csvDownloadLink.href = url;
        csvDownloadLink.setAttribute('download', 'cochrane-export.csv');

        return csvDownloadLink;
    }

    /**
     * Update UI to show details of dropped file
     *
     * @param string fileName
     * @param string fileType
     * @param string fileSize
     * @param string lastModifiedDate
     */
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

    /**
     * Update UI for hover state
     */
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

    /**
     * Update UI for post analyse state
     */
    updateUiAnalysed() {
        this.hideAllMessages();
        this.showMessage('success');
        this.updateDropZoneState('dropped');
        this._$exportPrepButton.removeClass('hidden');
    }

    /**
     * Update Drop down component for a given state
     *
     * @param string state
     */
    updateDropZoneState(state) {
        $('.upload__drop-zone', this._$dropElement).removeClass('upload__drop-zone--dropped');
        $('.upload__drop-zone', this._$dropElement).removeClass('upload__drop-zone--valid');
        $('.upload__drop-zone', this._$dropElement).removeClass('upload__drop-zone--invalid');

        if (state !== 'initial'){
            $('.upload__drop-zone', this._$dropElement).addClass('upload__drop-zone--' + state);
        }
    }

    /**
     * Set UI to initial state
     */
    updateUiInitial() {
        this._$exportPrepButton.addClass('hidden');
        this.updateDropZoneState('initial');
        this.hideAllMessages();
        this.showMessage('drop');

        this._$columnSelect.parent().find('a').remove();
        this._$searchTermInput.val('');
        this.multiTermSelector.clearTerms();
        $('.upload__file-confirmation').addClass('hidden');
    }

    /**
     * Hide all messages in component.
     */
    hideAllMessages() {
        $('.upload__drop-zone__message--success').addClass('hidden');
        $('.upload__drop-zone__message--invalid').addClass('hidden');
        $('.upload__drop-zone__message--valid').addClass('hidden');
        $('.upload__drop-zone__message--drop').addClass('hidden');
    }

    /**
     * Display message of a given type
     *
     * @param string type
     */
    showMessage(type) {
        $('.upload__drop-zone__message--' + type).removeClass('hidden');
    }

    /**
     * Handle export event
     */
    handleExport() {
        this.createAndDownloadCsv(this.getSearchString(), this.getSelectedColumns());
        this._$modal.modal('hide');
    }

    /**
     * Handle export preparation event
     */
    handlePrepareExport() {
        this.updateUiInitial();
        this._$modal.modal({blurring: true, closable: false}).modal('show').modal('refresh');
    }

    /**
     * Handle file drag over event
     */
    handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
        this.updateUiHover(evt.dataTransfer.items[0].type == "text/plain");
    }

    /**
     * Handle file hover leave event
     */
    handleDragLeave(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        this.updateUiInitial();
    }

    /**
     * Handle file drop event
     *
     * @param {} evt
     */
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
