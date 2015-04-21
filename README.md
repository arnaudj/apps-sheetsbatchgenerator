# Google Apps Sheets Batch Generator

Allows to create documents in batch from a template sheet, with variations based on variables.
Supports export as PDF for download (cf option EXPORT_AS_PDF)

### Format
Variables are stored in a sheet:
* 1 column: 1 variable
* 1 row : the corresponding variable value

For each row, 1 output document is generated.



### Deployment
1. Add the script to your spreadsheet.
2. Add a sheet named 'TemplatesVariables' to store the variables matrix
3. Add to this sheet as many rows as needed (1 for each document to generate)
* _NB: for each row: the special column OUTPUT_NAME will contain the name of the output document._
4. Start the script: Run Generate Batch from menu
5. Go to google drive 'Recent files' to see files created
6. Check your emails for PDF download (if enabled)


### Known limitations
* Each variable must have its own cell, in template document (no support for regular content
plus variable in a single cell)
* Currently, only one sheet per spreadsheet is subject to templating (others are copied, but not
templated).
- Output folder cannot be configured

### Example
#### Template sheet
In first sheet:

![template](https://raw.github.com/arnaudj/apps-sheetsbatchgenerator/master/res/static/template.png)

#### Variables matrix sheet
In sheet TemplatesVariables:

![variables](https://raw.github.com/arnaudj/apps-sheetsbatchgenerator/master/res/static/varmatrix.png)

#### Output
Will produce 3 documents (doc 1..3) to Google Drive:

![output 1](https://raw.github.com/arnaudj/apps-sheetsbatchgenerator/master/res/static/doc1.png)

Same principle for doc2 and doc3.

### Misc

_Reference_: [Google apps-script reference](https://developers.google.com/apps-script/reference/)
