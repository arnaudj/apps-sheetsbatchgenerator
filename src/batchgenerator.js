// Export as PDF documents once they are ready (will email links to you by email)
var EXPORT_AS_PDF = 1;

var TPL_VARS_SHEET_NAME = 'TemplatesVariables'; // Name of sheet holding variables
// Range of cells where variables data is to be retrieved (can be broader than needed, but *must* start at right coordinates)
var TPL_VARS_RANGEINSHEET = 'C6:Z99'; 
var totalTemplateHits = 0;
var exportURLs = '';

/**
 * Adds a custom menu with items to show the sidebar and dialog.
 */
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createAddonMenu()
      .addItem('Generate batch', 'generateBatch')
      .addToUi();
}

function generateBatch() {
  Logger.log('generateBatch(): Loading template data');

  // Read configurable variables
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var shVars = ss.getSheetByName(TPL_VARS_SHEET_NAME);
  SpreadsheetApp.setActiveSheet(shVars);
  var outputDocs = loadTemplatesData(shVars.getRange(TPL_VARS_RANGEINSHEET));
  var nbDocs = outputDocs.length;
  Logger.log("** Ready to produce: " + nbDocs + " documents with templates vars map: ");
  Logger.log(outputDocs);
  
  // Create output documents
  for (i=0; i<outputDocs.length; i++) {
    var ssOutput = produceOutputDoc(ss, outputDocs[i]);
    exportAsPDFIfNeeded(ssOutput);
  }
  
  // Finalize
  Logger.log("** Done.");
  ss.toast("Finished creating " + outputDocs.length + " documents. Total elements replaced: " + totalTemplateHits
           + (EXPORT_AS_PDF ? ".\nPdf export links emailed to you." : ""), "Report", 90);
  
  Logger.log("** Emailing PDF URLs: " + exportURLs);
  if (EXPORT_AS_PDF) {
    var currentUserEmail = Session.getActiveUser().getEmail();
    Logger.log("** email: " + currentUserEmail);
    MailApp.sendEmail(currentUserEmail, 'Batch templates output', 'URLs of PDFs:\n\n' + exportURLs);
  }
}

function produceOutputDoc(sourceSheet, outputDoc) {
  // Duplicate
  Logger.log("Ready to duplicate current spreadsheet.");
  if (!outputDoc.hasOwnProperty('OUTPUT_NAME')) {
    Logger.log("ERROR: No output file name for document, skipping.");
    return;
  }
  var ssDest = sourceSheet.copy(outputDoc['OUTPUT_NAME']);
  Logger.log("Created clone '" + ssDest.getName() + "', at " + ssDest.getUrl());

  // Remove variables sheet from target document
  var ssDestVarsSheet = ssDest.getSheetByName(TPL_VARS_SHEET_NAME);
  if (ssDestVarsSheet != null)
    ssDest.deleteSheet(ssDestVarsSheet);
  
  // Replace template vars in 1st sheet of target spreadsheet
  // TODO Walk other sheets as well (or drop them)
  var range = ssDest.getDataRange();
  var values = range.getValues();
  var tplHits = 0;
  for (r=0; r<values.length; r++) {
    for (c=0; c<values[0].length; c++) {
      var cell = values[r][c];
      if (outputDoc.hasOwnProperty(cell)) {
        values[r][c] = outputDoc[cell];
        tplHits++, totalTemplateHits++;
      }
    }
  }
  range.setValues(values); // commit changes
  Logger.log("Spreadsheet '" + ssDest.getName() + "': " + tplHits + " variables replaced.");

  return ssDest;
}

function exportAsPDFIfNeeded(ssOutput) {
  // Export as PDF if enabled
  if (EXPORT_AS_PDF) {
    // Export via API doesn't allow to hide gridlines, nor set print size. 
    // Workaround as manual http download: (cf https://code.google.com/p/google-apps-script-issues/issues/detail?id=3579)
    // DocsList.createFile(ssDest.getAs('application/pdf')).rename(ssDest.getName() + ".pdf");
    var url = "https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=" + ssOutput.getId() + 
      "&exportFormat=pdf&gridlines=0&printtitle=0&size=7&fzr=true&portrait=1&fitw=1";
    exportURLs += url + "\n\n";
  }
}

/**
 * @return array of objects maps. Format: [map1, ... mapN], with mapX: {var1:val1, ..varN:valN}, where varX
 * will be replaced by valX, in the target document #X.
 */
function loadTemplatesData(range) {
  var outputDocs = []; // Store all output document(s)'s data
  
  var values = range.getValues();
  var valuesBounds = {rows: values.length, cols: values[0].length};
  for (r=0; r<valuesBounds.rows; r++) {
    if (r == 0) // skip header (var names holder)
      continue;
    
    if (values[r][0].length == 0) // reached end of data rows, no more doc to produce
      break;
    
    var docIndex = r -1;
    if (typeof outputDocs[docIndex] === 'undefined')
        outputDocs[docIndex] = {};
    var docTemplateMap = outputDocs[docIndex];
    
    for (c=0; c<valuesBounds.cols; c++) {
      var tplVarVal = values[r][c];
      if (tplVarVal.length == 0) // reached end of data cols, no more vars to load
        break;
      
      var tplVarName = values[0][c];
      docTemplateMap[tplVarName] = tplVarVal;
    }
  }
  return outputDocs;
}

