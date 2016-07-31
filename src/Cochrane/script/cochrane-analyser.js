/**
 * Class Cochrane Analyser
 *
 * Analyses cochrane text export to extract unique record properties and records
 */
class CochraneAnalyser {
    constructor() {
        this._codes = [];
        this._recordObjects;
    }

    /**
     * Returns codes detected by latest analysis.
     *
     * @return array
     */
    getCodes() {
        return this._codes;
    }

    /**
     * Returns array or object representation of records detected by latest analysis.
     *
     * @return array
     */
    getRecordObjects() {
        return this._recordObjects;
    }

    /**
     * Analyses a text file.
     *
     * Updates _codes and _recordObjects with findings
     *
     * @param string textFile
     *
     * @return void
     */
    analyse(textFile) {
        var recordStrings;

        // Set codes to empty array;
        this._codes = [];

        // Set extractedRecords to empty array
        this._recordObjects = [];

        // Array of record text blobs
        recordStrings = textFile.split(/Record #(?:\d)+ of (?:\d)+/);

        // Iterate over result blobs of text
        for (var i = 0; i < recordStrings.length; i++) {
            var result = recordStrings[i],
                extractedRecord = {},
                lines;

            if (result.trim() == '') {
                continue;
            }

            // Iterate over lines of text blob
            lines = result.split(/(?:\r|\n)+/);

            for(var j = 0; j < lines.length; j++) {
                var line = lines[j],
                    detectedCode,
                    value;

                if (line == '') {
                    continue;
                }

                detectedCode = line.substr(0, line.indexOf(':'));

                // Store code
                if (this._codes.indexOf(detectedCode) == -1) {
                    this._codes.push(detectedCode);
                }

                // Get value from line (after the key:)
                value = line.substr(line.indexOf(':') +2, line.length -1);

                if (detectedCode in extractedRecord) {
                    extractedRecord[detectedCode] += ', ' + value;
                } else {
                    extractedRecord[detectedCode] = value;
                }
            }

            this._recordObjects.push(extractedRecord);
        }
    }
}

module.exports = CochraneAnalyser;
