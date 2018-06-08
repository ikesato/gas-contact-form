TO = "YOUR EMAIL ADDRESS";
SHEET_NAME = "contacts";
SECRET_KEY = "YOUR SECRET KEY FOR reCAPTCHA";

function doPost(e) {
  console.log(e);
  try {
    authorize(e.parameter["g-recaptcha-response"]);
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

function authorize(token) {
  var url = "https://www.google.com/recaptcha/api/siteverify";
  var params = {
    method: "POST",
    payload: {
      secret: SECRET_KEY,
      response: token,
    },
  }
  var body = UrlFetchApp.fetch(url, params);
  var res = JSON.parse(body);
  if (!res.success) {
    console.error("Failed to authorize", res);
    throw new Error("Failed to authorize");
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
