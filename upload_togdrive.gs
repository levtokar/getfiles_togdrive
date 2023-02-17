// doGet() function is an entry point of the script.
function doGet() {
  return ContentService.createTextOutput(uploadToDrive());
}

// This function returns the folder ID by folder name
function getFolderByName(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  var folderID = null;
  if (folders.hasNext()) {
    folderID = folders.next().getId();
  }
  return folderID;
}

// This function is used to download the file from URL and upload it to Google Drive folder
function download_zip(url, name1) {
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode('login' + ':' + 'password')
  };
  var params = {
    "method":"GET",
    "headers":headers
  };
  var msg = '';
  var response;
  var filename = '';
  try {
    response = UrlFetchApp.fetch(url, params);
  } catch(e) {
    return e.toString();
  }
  if (response.getResponseCode() === 200) {
    var folder = DriveApp.getRootFolder();
    var blob = response.getBlob();
    var head1 = response.getHeaders();
    blob.setContentType("application/zip");
    var unzip_blob = Utilities.unzip(blob);
    blob = unzip_blob[0];
    blob.setContentType(MimeType.MICROSOFT_EXCEL);
    var folderid = getFolderByName('Синхронизация');
    var file = {
      title: name1,
      parents: [{id: folderid}],
    };
    Drive.Files.insert(file, blob, {convert: true});
    while (DriveApp.getFilesByName(name1).hasNext() == false) {
    };
    return head1;
  }
}


// This function downloads and uploads multiple files from different URLs
// it is needed, because of 50 mb filesize limit of gdrive. File is split on the server, uploaded in parts to gdrive, and 
//assembled once again into one file. It's only needed because of gdrive limitations.

function uploadToDrive() {
  download_zip('http://5.101.78.26/888_1', 'kaspi_sync1');
  download_zip('http://5.101.78.26/888_2', 'kaspi_sync2');
  download_zip('http://5.101.78.26/888_3', 'kaspi_sync3');
  download_zip('http://5.101.78.26/888_4', 'kaspi_sync4');
  var spreadsheetId = DriveApp.getFilesByName('Итоговая Общая база').next().getId();
  var spreadsheetId2_1 = DriveApp.getFilesByName('kaspi_sync1').next().getId();
  var spreadsheetId2_2 = DriveApp.getFilesByName('kaspi_sync2').next().getId();
  var spreadsheetId2_3 = DriveApp.getFilesByName('kaspi_sync3').next().getId();
  var spreadsheetId2_4 = DriveApp.getFilesByName('kaspi_sync4').next().getId();
  var spreadsheetId3 = DriveApp.getFilesByName('Буфер синхронизации').next().getId();
  var spread1 = SpreadsheetApp.openById(spreadsheetId);
  var spread2_1 = SpreadsheetApp.openById(spreadsheetId2_1);
  var spread2_2 = SpreadsheetApp.openById(spreadsheetId2_2);
  var spread2_3 = SpreadsheetApp.openById(spreadsheetId2_3);
  var spread2_4 = SpreadsheetApp.openById(spreadsheetId2_4);     
  
  var spread3 = SpreadsheetApp.openById(spreadsheetId3);      
  var main_sheet = spread1.getSheets()[0];
  var main_sheet2 = spread1.getSheetByName('Синхронизация');   
  var main_sheet3 = spread3.getSheetByName('Синхронизация');   
    
  var sub_sheet_1 = spread2_1.getSheets()[0];
  var sub_sheet_2 = spread2_2.getSheets()[0];
  var sub_sheet_3 = spread2_3.getSheets()[0];
  var sub_sheet_4 = spread2_4.getSheets()[0];
  
  var s;        
    
 //reads data to memory arrays
  var last_main=main_sheet.getLastRow();
 
  var last_sub_1=sub_sheet_1.getLastRow();    
  var last_sub_2=sub_sheet_2.getLastRow();
  var last_sub_3=sub_sheet_3.getLastRow();
  var last_sub_4=sub_sheet_4.getLastRow();

  var sub_description1 = sub_sheet_1.getRange('F1:F'+last_sub_1).getValues()
  var sub_description2 = sub_sheet_2.getRange('F1:F'+last_sub_2).getValues()
  var sub_description3 = sub_sheet_3.getRange('F1:F'+last_sub_3).getValues()
  var sub_description4 = sub_sheet_4.getRange('F1:F'+last_sub_4).getValues()
  
  //merging data for description column
  sub_description1 = sub_description1.concat(sub_description2,sub_description3,sub_description4); 

  var sub_stock1 = sub_sheet_1.getRange('AE1:AE'+last_sub_1).getValues()
  var sub_stock2 = sub_sheet_2.getRange('AE1:AE'+last_sub_2).getValues()
  var sub_stock3 = sub_sheet_3.getRange('AE1:AE'+last_sub_3).getValues()
  var sub_stock4 = sub_sheet_4.getRange('AE1:AE'+last_sub_4).getValues()
  
  //merging data for stock column     
  sub_stock1 = sub_stock1.concat(sub_stock2,sub_stock3,sub_stock4);
  
  
  
  var sub_photos1 = sub_sheet_1.getRange('R1:R'+last_sub_1).getValues()
  var sub_photos2 = sub_sheet_2.getRange('R1:R'+last_sub_2).getValues()
  var sub_photos3 = sub_sheet_3.getRange('R1:R'+last_sub_3).getValues()
  var sub_photos4 = sub_sheet_4.getRange('R1:R'+last_sub_4).getValues()
  
  //merging data for photos column     
  sub_photos1 = sub_photos1.concat(sub_photos2,sub_photos3,sub_photos4);  
  
  
  var sub_sku1 = sub_sheet_1.getRange('X1:X'+last_sub_1).getValues();    
  var sub_sku2 = sub_sheet_2.getRange('X1:X'+last_sub_2).getValues();    
  var sub_sku3 = sub_sheet_3.getRange('X1:X'+last_sub_3).getValues();    
  var sub_sku4 = sub_sheet_4.getRange('X1:X'+last_sub_4).getValues();    
  
  //merging data for sku column
  sub_sku1 = sub_sku1.concat(sub_sku2,sub_sku3,sub_sku4);
  
  
  
  var sub_id1 = sub_sheet_1.getRange('W1:W'+last_sub_1).getValues();      
  var sub_id2 = sub_sheet_2.getRange('W1:W'+last_sub_2).getValues();      
  var sub_id3 = sub_sheet_3.getRange('W1:W'+last_sub_3).getValues();      
  var sub_id4 = sub_sheet_4.getRange('W1:W'+last_sub_4).getValues();      
  
  //merging data for sub_id column
  sub_id1 = sub_id1.concat(sub_id2,sub_id3,sub_id4);  
  
  
  
 var sub_id_main1 = sub_sheet_1.getRange('A1:A'+last_sub_1).getValues();       
 var sub_id_main2 = sub_sheet_2.getRange('A1:A'+last_sub_2).getValues();       
 var sub_id_main3 = sub_sheet_3.getRange('A1:A'+last_sub_3).getValues();       
 var sub_id_main4 = sub_sheet_4.getRange('A1:A'+last_sub_4).getValues();        
  
 //merging data for main_id column
 sub_id_main1 = sub_id_main1.concat(sub_id_main2,sub_id_main3,sub_id_main4);
  
  
 var sub_id_nameof1 = sub_sheet_1.getRange('B1:B'+last_sub_1).getValues();        
 var sub_id_nameof2 = sub_sheet_2.getRange('B1:B'+last_sub_2).getValues();        
 var sub_id_nameof3 = sub_sheet_3.getRange('B1:B'+last_sub_3).getValues();        
 var sub_id_nameof4 = sub_sheet_4.getRange('B1:B'+last_sub_4).getValues();         
  
 //merging data for names column 
 sub_id_nameof1 = sub_id_nameof1.concat(sub_id_nameof2,sub_id_nameof3,sub_id_nameof4);
  
 
 var sub_vol1 = sub_sheet_1.getRange('T1:T'+last_sub_1).getValues();     
 var sub_vol2 = sub_sheet_2.getRange('T1:T'+last_sub_2).getValues();     
 var sub_vol3 = sub_sheet_3.getRange('T1:T'+last_sub_3).getValues();     
 var sub_vol4 = sub_sheet_4.getRange('T1:T'+last_sub_4).getValues();      
 
 //merging data for volume column  
 sub_vol1 = sub_vol1.concat(sub_vol2,sub_vol3,sub_vol4);  
  
  
  
 var sub_barcode1 = sub_sheet_1.getRange('Y1:Y'+last_sub_1).getValues();       
 var sub_barcode2 = sub_sheet_2.getRange('Y1:Y'+last_sub_2).getValues();        
 var sub_barcode3 = sub_sheet_3.getRange('Y1:Y'+last_sub_3).getValues();        
 var sub_barcode4 = sub_sheet_4.getRange('Y1:Y'+last_sub_4).getValues();        
  
 //merging data for barcode column 
 sub_barcode1 = sub_barcode1.concat(sub_barcode2,sub_barcode3,sub_barcode4);   
 
 
 var sub_price1 = sub_sheet_1.getRange('AA1:AA'+last_sub_1).getValues();
 var sub_price2 = sub_sheet_2.getRange('AA1:AA'+last_sub_2).getValues();
 var sub_price3 = sub_sheet_3.getRange('AA1:AA'+last_sub_3).getValues();
 var sub_price4 = sub_sheet_4.getRange('AA1:AA'+last_sub_4).getValues(); 
  
 //merging data for price column 
 sub_price1 = sub_price1.concat(sub_price2,sub_price3,sub_price4);   

  //clearing all previous data
  main_sheet3.getRange('A1:B'+ main_sheet3.getLastRow()).clear();  
  main_sheet3.getRange('F2:F'+ main_sheet3.getLastRow()).clear();      
  main_sheet3.getRange('J2:M'+ main_sheet3.getLastRow()).clear();   
  main_sheet3.getRange('S1:S'+ main_sheet3.getLastRow()).clear();    
  main_sheet3.getRange('R1:R'+ main_sheet3.getLastRow()).clear();    
  
  
  //adding new data to sheet
  main_sheet3.getRange('B1:B'+sub_stock1.length).setValues(sub_stock1);  
  
  main_sheet3.getRange('A1:A'+sub_sku1.length).setValues(sub_sku1); 
 
  main_sheet3.getRange('F1:F'+sub_id1.length).setValues(sub_id1);

  main_sheet3.getRange('J1:J'+sub_id_main1.length).setValues(sub_id_main1);
    
  main_sheet3.getRange('K1:K'+sub_id_nameof1.length).setValues(sub_id_nameof1);    
    
  main_sheet3.getRange('L1:L'+sub_vol1.length).setValues(sub_vol1);    

  main_sheet3.getRange('M1:M'+sub_barcode1.length).setValues(sub_barcode1); 
    
  main_sheet3.getRange('N1:N'+sub_price1.length).setValues(sub_price1);
 
  main_sheet3.getRange('S1:S'+sub_description1.length).setValues(sub_description1);
  
  main_sheet3.getRange('R1:R'+sub_photos1.length).setValues(sub_photos1);
   

  //creating timestamp of current update
  var d = new Date();
  var currentTime = d.toLocaleTimeString();
  main_sheet.getRange('A1').setValue(currentTime);  
  
  
  //returning flag of completion
  return 'it is done';

  
   
};
  
  
  
