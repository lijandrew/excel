// Run either generateStudentInvoices or generateTeacherInvoices
// Edit these date values     VVV
const startDate = new Date("August 1, 2020");
const endDate = new Date("August 31, 2020");





const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];
let year = `${startDate.getFullYear()}`;
let yearStr = year.substring(2, 4);
let monthIndex = startDate.getMonth();
let monthStr = `${monthIndex + 1}`;
let monthName = MONTH_NAMES[monthIndex];
const sheetName = `${monthStr}\/${yearStr}`;

/*
let teacherInfo = {
"JIM TRUGLIO": {
rate: 999,
subject: "BIOLOGY",
initials: "JT",
},
}
*/
let teacherInfo = (() => {
  let info = {};
  let ss = SpreadsheetApp.openById("1IGjRgcKuJMvme3og3i9DXVm7UL8NnmFhMmyn0j--T5k");
  let sheet = ss.getActiveSheet();
  for (let row = 2;; row++) {
    if (sheet.getRange(`A${row}`).getValue().trim() === "") break;
    let name = sheet.getRange(`A${row}`).getValue().trim().toUpperCase();
    let rate = sheet.getRange(`B${row}`).getValue();
    let subject = sheet.getRange(`C${row}`).getValue();
    let initials = sheet.getRange(`D${row}`).getValue();
    info[name] = {
      rate,
      subject,
      initials
    };
  }
  return info;
})();





/* ===================== STATEMENT GENERATOR ===================== */
function generateStatement() {
  const statementFolder = DriveApp.getFolderById("1WOlmxhKszdkVA5VNxwI673IrDnr4pcDn");
  let validCalArr = getValidCalArr();

  /* Prepare students */
  let studentNameArr = getStudentNameArr(validCalArr);
  let studentInvArr = [];
  for (let studentName of studentNameArr) {
    studentInvArr.push(getStudentInv(studentName, validCalArr));
  }

  /* Prepare teachers */
  let teacherInvArr = [];
  for (let cal of validCalArr) {
    teacherInvArr.push(getTeacherInv(cal));
  }

  let temp = statementFolder.getFilesByName(sheetName + " Statement"); // trash old copy of teacher folder if exists
  while (temp.hasNext()) {
    temp.next().setTrashed(true);
  }
  let template = DriveApp.getFileById("1Gs1Tec8yFWvlhLw-DdyLJjhNSn2fLOHkeNrZwOo7mzc");
  let ssFile = template.makeCopy(`${sheetName} Statement`, statementFolder);
  let ss = SpreadsheetApp.open(ssFile);
  ss.renameActiveSheet(`${sheetName}`);
  let sheet = ss.getActiveSheet();

  sheet.getRange("D1").setValue(`${monthName} Statement`);

  /* Fill students */
  let row = 7;
  for (let studentInv of studentInvArr) {
    sheet.getRange(`A${row}`).setValue(formatName(studentInv.studentName));
    let total = 0;
    for (let teacherKey of Object.keys(studentInv.invoice)) { // calculate student payment
      // Logger.log(teacherInfo[teacherKey]);
      total += studentInv.invoice[teacherKey].totalHours * teacherInfo[teacherKey].rate;
    }
    sheet.getRange(`B${row}`).setValue(total);
    row++;
  }

  /* Fill teachers */
  row = 7;
  for (let teacherInv of teacherInvArr) {
    sheet.getRange(`E${row}`).setValue(formatName(teacherInv.teacherName));
    let total = 0;
    for (let studentKey of Object.keys(teacherInv.invoice)) { // calculate teacher payment
      total += teacherInv.invoice[studentKey].totalHours * teacherInfo[teacherInv.teacherName].rate;
    }
    sheet.getRange(`F${row}`).setValue(total);
    row++;
  }

  Logger.log("generateStatement: successful");
}
/* ===================================================================== */





/* ===================== STUDENT INVOICE GENERATOR ===================== */
function generateStudentInvoices() {
  let validCalArr = getValidCalArr();
  let studentFolder = DriveApp.getFolderById("1MMlS3mVmsCdvM2Xv-sTKEAwXG-NUUH5W");
  let studentNameArr = getStudentNameArr(validCalArr);
  for (let studentName of studentNameArr) {
    let studentInv = getStudentInv(studentName, validCalArr); // get student invoice object

    /* Set up spreadsheet file */
    let ssFile = getFileFromFolder(studentFolder, formatName(studentName)); // try to get student file
    if (ssFile === null) { // if file not found (new student), make new file from template
      let template = DriveApp.getFileById("1P-9YpkUURljQ9air6wr1dKXp2vOgKOLZWQ1aow56DJU");
      ssFile = template.makeCopy(formatName(studentName), studentFolder); // give the new spreadsheet a starter template sheet
    }
    let ss = SpreadsheetApp.open(ssFile); // open file as Spreadsheet

    /* Set up sheet tab */
    let savedIndex = null;
    let tempSheetArr = ss.getSheets();
    for (let i = 0; i < tempSheetArr.length - 1; i++) { // search for already existing occurrence. save index.
      if (tempSheetArr[i].getSheetName() === sheetName) {
        savedIndex = i;
        break;
      }
    }
    let sheet;
    if (savedIndex !== null) { // if sheet already exists, delete it and reinsert fresh copy at saved index (effectively reset it)
      ss.deleteSheet(tempSheetArr[savedIndex]);
      sheet = ss.insertSheet(sheetName, savedIndex, {
        template: ss.getSheetByName("template")
      });
    } else { // create new sheet. find correct sheet index by comparing years and months.
      let i = 0;
      let currYear = parseInt(sheetName.split("/")[1]);
      let currMonth = parseInt(sheetName.split("/")[0]);
      for (; i < tempSheetArr.length - 1; i++) {
        let compareYear = parseInt(tempSheetArr[i].getSheetName().split("/")[1]);
        let compareMonth = parseInt(tempSheetArr[i].getSheetName().split("/")[0]);
        if (currYear < compareYear) continue;
        if (currYear === compareYear && currMonth < compareMonth) continue;
        break;
      }
      sheet = ss.insertSheet(sheetName, i, {
        template: ss.getSheetByName("template")
      }); // if sheet doesn't exist, simply insert copy of template sheet at start
    }

    /* Populate sheet */
    sheet.getRange("C1").setValue(`${monthName} Invoice`);
    sheet.getRange("C2").setValue(`Student Name: ${formatName(studentName)}`);
    // sheet.getRange("E19").setValue(`='${ss.getSheets()[1].getSheetName()}'!F25`); // Prev. balance carry over
    let row = 7;
    for (let teacherName of Object.keys(studentInv.invoice)) { // fill in invoice using invoice object
      let teacherEntry = studentInv.invoice[teacherName];
      Logger.log(teacherName);
      Logger.log(teacherInfo[teacherName]);
      let modifiedTeacherName = teacherInfo[teacherName].subject + ", " + teacherInfo[teacherName].initials;
      sheet.getRange(`C${row}`).setValue(`${modifiedTeacherName} - ${teacherEntry.dates.join(", ")}`);
      sheet.getRange(`D${row}`).setValue(teacherEntry.totalHours);
      sheet.getRange(`E${row}`).setValue(teacherInfo[teacherName].rate);
      row++;
    }
  }

  Logger.log("generateStudentInvoices: successful");
}
/* ===================================================================== */





/* Generates teacher invoices. */
function generateTeacherInvoices() {
  let teacherFolder = DriveApp.getFolderById("1crZqb8Zj1UonBEeuCyW1LAKm0ijYYKNs");
  let validCalArr = getValidCalArr();
  let temp = teacherFolder.getFoldersByName(sheetName); // trash old copy of month teacher folder if exists
  while (temp.hasNext()) {
    temp.next().setTrashed(true);
  }
  let teacherDateFolder = teacherFolder.createFolder(sheetName);

  for (let cal of validCalArr) {
    let teacherInv = getTeacherInv(cal);
    let teacherName = cal.getTitle().trim().toUpperCase();

    let template = DriveApp.getFileById("1P-9YpkUURljQ9air6wr1dKXp2vOgKOLZWQ1aow56DJU");
    let ssFile = template.makeCopy(formatName(teacherName), teacherDateFolder);
    let ss = SpreadsheetApp.open(ssFile);
    ss.renameActiveSheet(sheetName);
    let sheet = ss.getActiveSheet();

    sheet.getRange("C1").setValue(`${monthName} Invoice`);
    sheet.getRange("C2").setValue(`Teacher Name: ${formatName(teacherName)}`);
    let row = 7;
    for (let studentName of Object.keys(teacherInv.invoice)) {
      let studentEntry = teacherInv.invoice[studentName];
      sheet.getRange(`C${row}`).setValue(`${studentName} - ${studentEntry.dates.join(", ")}`);
      sheet.getRange(`D${row}`).setValue(studentEntry.totalHours);
      row++;
    }
  }

  Logger.log("generateTeacherInvoices: successful");
}
/* ===================================================================== */





/* FORMAT
studentInv: {
  studentName: 'Andrew',
  invoice: {
    'SETH KLEIN': {
      totalHours: 5,
      dates: ['8/1', '8/2', '8/3']
    },
  }
}
*/
function getStudentInv(studentName, validCalArr) {
  let studentInv = {
    studentName,
    invoice: {}
  };
  for (let cal of validCalArr) {
    let teacherName = cal.getTitle().trim().toUpperCase();
    let eventArr = cal.getEvents(startDate, endDate, {
      search: studentName
    });
    for (let event of eventArr) {
      if (!isValidEvent(event)) continue;
      if (!(teacherName in studentInv.invoice)) {
        studentInv.invoice[teacherName] = {
          totalHours: 0,
          dates: []
        };
      }
      let date = event.getStartTime().toLocaleDateString();
      date = date.substring(0, date.lastIndexOf("/")); // remove year
      let hours = Math.abs(event.getEndTime() - event.getStartTime()) / 1000 / 60 / 60;
      studentInv.invoice[teacherName].dates.push(date);
      studentInv.invoice[teacherName].totalHours += hours;
    }
  }
  return studentInv;
}





/* FORMAT
teacherInv: {
  teacherName: 'SETH KLEIN',
  invoice: {
    'JACK GU': {
        totalHours: 5,
        dates: ['8/1', '8/2', '8/3']
    },
  }
}
*/
function getTeacherInv(cal) {
  let teacherInv = {
    teacherName: cal.getTitle().trim().toUpperCase(),
    invoice: {}
  };
  let eventArr = cal.getEvents(startDate, endDate);
  for (let event of eventArr) {
    let studentName = cal.getTitle().trim().toUpperCase();
    if (isValidEvent(event)) {
      let studentName = eventToStudentName(event);
      if (!(studentName in teacherInv.invoice)) {
        teacherInv.invoice[studentName] = {
          totalHours: 0,
          dates: []
        };
      }
      let date = event.getStartTime().toLocaleDateString();
      date = date.substring(0, date.lastIndexOf("/")); // remove year
      let hours = Math.abs(event.getEndTime() - event.getStartTime()) / 1000 / 60 / 60;
      teacherInv.invoice[studentName].dates.push(date);
      teacherInv.invoice[studentName].totalHours += hours;
    }
  }
  return teacherInv;
}



/* Helper function: formatName
 * @param name - the name (FIRSTNAME LASTNAME)
 * @return - the name formatted in last, first format.
 */
function formatName(name) {
  let tokens = name.split(" ");
  if (tokens.length === 1) {
    return name;
  }
  if (tokens.length === 2) {
    return tokens[1] + ", " + tokens[0];
  }
  if (tokens.length >= 3) {
    let last = "";
    for (let i = 2; i < tokens.length; i++) {
      last += tokens[i] + " ";
    }
    last = last.trim();
    let first = tokens[0] + " " + tokens[1];

    return last + ", " + first;
  }
}




/* Helper function: getFileFromFolder
 * -------------------------------
 * @param folder - the GDrive folder to check
 * @param filename - the filename to look for
 * @return - the first occurrence of the file with matching filename. null if no match.
 */
function getFileFromFolder(folder, filename) {
  let files = folder.getFilesByName(filename);
  while (files.hasNext()) {
    return files.next();
  }
  return null;
}





/* Helper function: eventToStudentName
 * -------------------------------
 * @param title - the event title string.
 * @return - the extracted, formatted student name.
 */
function eventToStudentName(event) {
  return event.getTitle().split("-")[0].trim().toUpperCase();
}





/* Helper function: isValidEvent
 * -------------------------------
 * @param event - the event to check.
 * @return - true if event is valid (title has "-"), false otherwise.
 */
function isValidEvent(event) {
  let title = event.getTitle();
  if (title.split("-").length > 1) return true;
  return false;
}





/* Helper function: getValidCalArr
 * -------------------------------
 * @return - an array of Calendars that have at least one valid lesson event.
 */
function getValidCalArr() {
  let calArr = CalendarApp.getAllCalendars();
  let validCalArr = [];
  for (let cal of calArr) {
    let eventArr = cal.getEvents(startDate, endDate);
    for (let event of eventArr) {
      if (isValidEvent(event)) {
        validCalArr.push(cal);
        break;
      }
    }
  }
  return validCalArr;
}





/* Helper function: getStudentNameArr
 * ----------------------------------
 * @param validCalArr - an array of Calendars that have at least one valid lesson event.
 *                      Obtained using getValidCalArr().
 * @return - The array of unique student names, taken from events in the valid calendars.
 */
function getStudentNameArr(validCalArr) {
  let studentNameArr = [];
  for (let cal of validCalArr) {
    let eventArr = cal.getEvents(startDate, endDate);
    for (let event of eventArr) {
      let title = event.getTitle();
      if (title.split("-").length === 1) continue;
      let studentName = eventToStudentName(event);
      if (!studentNameArr.includes(studentName)) {
        studentNameArr.push(studentName);
      }
    }
  }
  return studentNameArr;
}





/* ===================== DOC ===================== */

/* Student invoice logic
To generate student invoices:
- Scan valid calendars for students and produce a set of unique student names.
- Enter 'Students' subfolder and open matching student spreadsheet file OR create from template if file does not exist (i.e. new student)
- Create a sheet tab with name MONTH/YEAR. If tab already exists, just open it and let the program overwrite.
- Link the current sheet's previous balance cell to the previous sheet's final balance cell (rollover balance).
- For each student name, create a studentInv object, and ...
    - Make a new key/val pair for each teacher, with teacher name as the key.
    - Update the key/val pairs for all events matching the student name.
- Using the studentInv object, fill a template with the info from the studentInv obj. */
/* Teacher invoice logic
To generate teacher invoices:
- Same as student invoice method, EXCEPT:
- To get a teacherInv object, we only need to scan THAT teacher's calendar (as opposed to all calendars).
- The students become the invoice keys. Things mirror over as expected. */

/* ===================================================================== */
