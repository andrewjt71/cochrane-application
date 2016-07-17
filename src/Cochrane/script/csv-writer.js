class CsvWriter {

    constructor() {
        this._colDelimeter = ',';
        this._lineDelimeter = '\r\n';
        this._colEnclosure = '"';
    }

    createCsvFromRecordObjects(recordObjects, codes) {
        var csv = this._lineDelimeter;

        // Add column headers to csv
        csv += codes.join(this._colDelimeter);
        csv += this._lineDelimeter;

        // Iterate through key value object representation of records.
        for (var i = 0; i < recordObjects.length; i++) {


            var recordObject = recordObjects[i];

            // Iterate through existing codes and use to write records values to csv in order.
            for (var j = 0; j < codes.length; j++) {
                var code = codes[j];

                // Default to empty.
                var sanitizedValue = "";

                // If value exists for code.
                if (code in recordObject) {
                    var value = recordObject[code];

                    // Sanitize the value.
                    sanitizedValue = value.split( this._colEnclosure ).join( this._colEnclosure + this._colEnclosure );
                }

                // Write record values to csv.
                csv += this._colEnclosure + sanitizedValue + this._colEnclosure + this._colDelimeter;
            }

            // Write new line to csv.
            csv += this._lineDelimeter;
        }
console.log(csv);
        return csv;
    }
}

module.exports = CsvWriter;
