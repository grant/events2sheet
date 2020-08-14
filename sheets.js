const path = require('path');
const {google} = require('googleapis');
const sheets = google.sheets('v4');

// https://docs.google.com/spreadsheets/d/1QXY4IyIwT1UW0MArUNpMTX2kD20NCn9GpKFBaaGiLuM/edit
const SPREADSHEET_ID = '1QXY4IyIwT1UW0MArUNpMTX2kD20NCn9GpKFBaaGiLuM';

/**
 * Appends row data to the Google Sheet
 */
exports.appendToSheet = async (row) => {
  // Obtain user credentials to use for the request
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'creds.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  google.options({auth});

  // Add header
  sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'A1:Z1',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [
          'HEADERS ->',
          'LOG TIME',
          'ce-specversion',
          'ce-id',
          'ce-source',
          'ce-time',
          'ce-type',
          'ce-dataschema',
          'ce-subject',
          'BODY',
          'RAW REQUEST',
        ]
      ],
    },
  })

  // Add new row
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'A1:A1', // Needed, but not used when values are present.
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        row, // Example: ['Grant', '1/1/2000'],
      ],
    },
  });
}
