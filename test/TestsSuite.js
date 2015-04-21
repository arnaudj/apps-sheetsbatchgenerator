// QUnit for Google Apps Script
// Ref: https://github.com/simula-innovation/qunit/tree/gas/gas
// How to run: "Publish -> Deploy as a webapp"

QUnit.helpers( this );

function tests() {
  console = Logger;
  helpersTest();
}

function doGet( e ) {
  QUnit.urlParams( e.parameter );
  QUnit.config({title: "QUnit for Google Apps Script - Test suite"});
  QUnit.load( tests );
  return QUnit.getHtml();
};
