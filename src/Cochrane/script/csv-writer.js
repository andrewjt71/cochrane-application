class CsvWriter {

    constructor() {
        this._colDelimeter = ',';
        this._lineDelimeter = '\r\n';
        this._colEnclosure = '"';
    }

    createCsvFromRecordObjects(recordObjects, codes, searchTerm, selectedColumns) {
        var csv = this._lineDelimeter;

        // Default selected columns to full list of codes.
        if (selectedColumns.length == 0) {
            selectedColumns = codes.slice(0);
        }

        // Add column headers to csv
        csv += codes.join(this._colDelimeter);
        csv += this._lineDelimeter;

        // Iterate through key value object representation of records.
        for (var i = 0; i < recordObjects.length; i++) {

            var recordObject = recordObjects[i];

            // If no search term then include all rows.
            var matchesSearchCriteria = searchTerm == undefined;
            var newLine = '';

            // Iterate through existing codes and use to write records values to csv in order.
            for (var j = 0; j < codes.length; j++) {
                var code = codes[j];

                // Default to empty.
                var sanitizedValue = "";

                if (code in recordObject) {
                    var value = recordObject[code];

                    if (selectedColumns.indexOf(code) !== -1) {
                        var re = new RegExp(searchTerm, 'i');

                        // Row has not yet matched criteria, check against current code.
                        if (!matchesSearchCriteria) {
                            if (re.test(value)) {
                                matchesSearchCriteria = true;
                            }
                        }
                    }
                    // Sanitize the value.
                    sanitizedValue = value.split( this._colEnclosure ).join( this._colEnclosure + this._colEnclosure );
                }

                newLine += this._colEnclosure + sanitizedValue + this._colEnclosure + this._colDelimeter;
            }

            if (matchesSearchCriteria) {
                newLine += this._lineDelimeter;
                csv += newLine;
            }
        }

        return csv;
    }
}

module.exports = CsvWriter;
