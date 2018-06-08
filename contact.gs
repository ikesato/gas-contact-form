TO = "YOUR EMAIL ADDRESS";
SHEET_NAME = "contacts";

function doPost(e) {
  console.log(e);
  try {
    storePostMessageToSpreadSheet(e.parameter);
  } catch(ex) {
    console.error(ex);
    var result = {"result":"Error", "message": ex.message};
    return ContentService.createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);
  }
  try {
    var m = formatMailBody(e.parameter);
    MailApp.sendEmail(TO, m.subject, m.body);
    var result = {"result": "OK"};
    return ContentService.createTextOutput(JSON.stringify(result))
             .setMimeType(ContentService.MimeType.JSON);
  } catch(ex) {
    console.warn(ex);
    var result = {"result":"OK", "message": ex.message}; // return OK, but the reason is set to "error".
    return ContentService.createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);
  }
}

function formatMailBody(param) {
  var body = "";
  body += "Email Address: " + param.email + "\n\n";
  body += param.message;
  var subject = "Contact From " + param.email;
  return {subject:subject, body: body};
}

function storePostMessageToSpreadSheet(param) {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getSheetByName(SHEET_NAME);
  var lastRow = sheet.getLastRow() + 1;
  var row = [
    new Date(),
    param.email,
    param.message
  ];
  sheet.getRange(lastRow, 1, 1, row.length).setValues([row]);
}

function logRemainingDailyQuata() {
  console.log(MailApp.getRemainingDailyQuota());
  Logger.log(MailApp.getRemainingDailyQuota());
}
