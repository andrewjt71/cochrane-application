var codes,
    colDelimeter = ',',
    lineDelimeter = '\r\n',
    colEnclosure = '"';

function createCsvFromFile(file) {
    // Set codes to empty array;
    codes = [];

    // Array of record text blobs
    var recordStrings = file.split(/Record #(?:\d)+ of (?:\d)+/);

    // Array of key value object representation of records.
    var recordObjects = transformRecordStringsToObjects(recordStrings);
    var csv = lineDelimeter;
    csv += codes.join(colDelimeter);
    csv += lineDelimeter;

    // Iterate through key value object representation of records.
    for (var i = 0; i < recordObjects.length; i++) {
        recordObject = recordObjects[i];

        // Iterate through existing codes and use to write records values to csv in order.
        for (var j = 0; j<codes.length; j++) {
            var code = codes[j];

            // Default to empty.
            var sanitizedValue = "";

            // If value exists for code.
            if (code in recordObject) {
                var value = recordObject[code];

                // Sanitize the value.
                sanitizedValue = value.split( colEnclosure ).join( colEnclosure + colEnclosure );
            }

            // Write record to csv.
            csv += colEnclosure + sanitizedValue + colEnclosure + colDelimeter;
        }

        // Write new line to csv.
        csv += lineDelimeter;
    }

    return csv;
}

function transformRecordStringsToObjects(resultArray) {
    var extractedRecords = [];

    // Iterate over result blobs of text
    for (var i = 0; i<resultArray.length; i++) {
        var result = resultArray[i],
            extractedRecord = {};

        if (result.trim() == '') {
            continue;
        }

        // Iterate over lines of text blob
        var lines = result.split(/(?:\r|\n)+/);

        for(var j = 0; j < lines.length; j++) {
            var line = lines[j].
                detectedCode,
                value;

            if (line == '') {
                continue;
            }

            detectedCode = line.substr(0, line.indexOf(':'));

            // Store code
            if (codes.indexOf(detectedCode) == -1) {
                codes.push(detectedCode);
            }

            // Get value from line (after the key:)
            value = line.substr(line.indexOf(':') +2, line.length -1);

            if (detectedCode in extractedRecord) {
                extractedRecord[detectedCode] += ', ' + value;
            } else {
                extractedRecord[detectedCode] = value;
            }
        }

        extractedRecords.push(extractedRecord);
    }

    return extractedRecords;
}

module.exports = {
    createExportFromFile: function (file) {
        return createCsvFromFile(file);
    }
}
