//Add buttons:
let add1 = document.querySelector(".add1");
let add2 = document.querySelector(".add2");
let add3 = document.querySelector(".add3");
let add4 = document.querySelector(".add4");
let add5 = document.querySelector(".add5");
let add6 = document.querySelector(".add6");
let add7 = document.querySelector(".add7");
let add8 = document.querySelector(".add8");
//Substract buttons:
let min1 = document.querySelector(".min1");
let min2 = document.querySelector(".min2");
let min3 = document.querySelector(".min3");
let min4 = document.querySelector(".min4");
let min5 = document.querySelector(".min5");
let min6 = document.querySelector(".min6");
let min7 = document.querySelector(".min7");
let min8 = document.querySelector(".min8");
//Number displayed in each counter:
let totalcount1 = document.querySelector(".totalcount1");
let totalcount2 = document.querySelector(".totalcount2");
let totalcount3 = document.querySelector(".totalcount3");
let totalcount4 = document.querySelector(".totalcount4");
let totalcount5 = document.querySelector(".totalcount5");
let totalcount6 = document.querySelector(".totalcount6");
let totalcount7 = document.querySelector(".totalcount7");
let totalcount8 = document.querySelector(".totalcount8");
//Columns in data table:
let tbl1 = document.querySelector(".tbl1");//Counts
let tbl2 = document.querySelector(".tbl2");
let tbl3 = document.querySelector(".tbl3");
let tbl4 = document.querySelector(".tbl4");
let tbl5 = document.querySelector(".tbl5");
let tbl6 = document.querySelector(".tbl6");
let tbl7 = document.querySelector(".tbl7");
let tbl8 = document.querySelector(".tbl8");
let tbl1b = document.querySelector(".tbl1b");//Colonies/slide
let tbl2b = document.querySelector(".tbl2b");
let tbl3b = document.querySelector(".tbl3b");
let tbl4b = document.querySelector(".tbl4b");
let tbl5b = document.querySelector(".tbl5b");
let tbl6b = document.querySelector(".tbl6b");
let tbl7b = document.querySelector(".tbl7b");
let tbl8b = document.querySelector(".tbl8b");
let tbl1c = document.querySelector(".tbl1c");//Colonies/L
let tbl2c = document.querySelector(".tbl2c");
let tbl3c = document.querySelector(".tbl3c");
let tbl4c = document.querySelector(".tbl4c");
let tbl5c = document.querySelector(".tbl5c");
let tbl6c = document.querySelector(".tbl6c");
let tbl7c = document.querySelector(".tbl7c");
let tbl8c = document.querySelector(".tbl8c");
let tbl1d = document.querySelector(".tbl1d");//Relative abundance (%)
let tbl2d = document.querySelector(".tbl2d");
let tbl3d = document.querySelector(".tbl3d");
let tbl4d = document.querySelector(".tbl4d");
let tbl5d = document.querySelector(".tbl5d");
let tbl6d = document.querySelector(".tbl6d");
let tbl7d = document.querySelector(".tbl7d");
let tbl8d = document.querySelector(".tbl8d");
let reset = document.querySelector(".reset");
let exp = document.querySelector(".exp");

//User inputs and outputs:
let gradinput = document.querySelector(".gradinput");
let depthinput = document.querySelector(".depthinput");
let diaminput = document.querySelector(".diaminput");
let gradoutput = document.querySelector(".gradoutput");
let depthoutput = document.querySelector(".depthoutput");
let diamoutput = document.querySelector(".diamoutput");

//Detect clicks on each button
add1.addEventListener('click', addCounter1);
add2.addEventListener('click', addCounter2);
add3.addEventListener('click', addCounter3);
add4.addEventListener('click', addCounter4);
add5.addEventListener('click', addCounter5);
add6.addEventListener('click', addCounter6);
add7.addEventListener('click', addCounter7);
add8.addEventListener('click', addCounter8);

min1.addEventListener('click', minCounter1);
min2.addEventListener('click', minCounter2);
min3.addEventListener('click', minCounter3);
min4.addEventListener('click', minCounter4);
min5.addEventListener('click', minCounter5);
min6.addEventListener('click', minCounter6);
min7.addEventListener('click', minCounter7);
min8.addEventListener('click', minCounter8);

//Add function for calculating relative abundance
add1.addEventListener('click', rel);
add2.addEventListener('click', rel);
add3.addEventListener('click', rel);
add4.addEventListener('click', rel);
add5.addEventListener('click', rel);
add6.addEventListener('click', rel);
add7.addEventListener('click', rel);
add8.addEventListener('click', rel);

min1.addEventListener('click', rel);
min2.addEventListener('click', rel);
min3.addEventListener('click', rel);
min4.addEventListener('click', rel);
min5.addEventListener('click', rel);
min6.addEventListener('click', rel);
min7.addEventListener('click', rel);
min8.addEventListener('click', rel);



reset.addEventListener('click', resetCounter);
exp.addEventListener('click', tableToCSV);

//////////Function to calculate relative abundance, colonies/slide, and colonies/l
function rel(){
    c1 = totalcount1.innerHTML//grab counts for each taxon
    c2 = totalcount2.innerHTML
    c3 = totalcount3.innerHTML
    c4 = totalcount4.innerHTML
    c5 = totalcount5.innerHTML
    c6 = totalcount6.innerHTML
    c7 = totalcount7.innerHTML
    c8 = totalcount8.innerHTML

    var totabundance = parseInt(c1)+parseInt(c2)+parseInt(c3)+parseInt(c4)+parseInt(c5)+parseInt(c6)+parseInt(c7)+parseInt(c8)//total cells counted of all taxa
    
    var r1 = parseFloat((c1/totabundance)*100)//relative abundance of each type
    var r2 = parseFloat((c2/totabundance)*100)
    var r3 = parseFloat((c3/totabundance)*100)
    var r4 = parseFloat((c4/totabundance)*100)
    var r5 = parseFloat((c5/totabundance)*100)
    var r6 = parseFloat((c6/totabundance)*100)
    var r7 = parseFloat((c7/totabundance)*100)
    var r8 = parseFloat((c8/totabundance)*100)
    
    tbl1d.innerHTML = parseFloat(r1.toFixed(1))//insert relative abundance in column "d" of table
    tbl2d.innerHTML = parseFloat(r2.toFixed(1))
    tbl3d.innerHTML = parseFloat(r3.toFixed(1))
    tbl4d.innerHTML = parseFloat(r4.toFixed(1))
    tbl5d.innerHTML = parseFloat(r5.toFixed(1))
    tbl6d.innerHTML = parseFloat(r6.toFixed(1))
    tbl7d.innerHTML = parseFloat(r7.toFixed(1))
    tbl8d.innerHTML = parseFloat(r8.toFixed(1))

    var rows = parseFloat(document.getElementById("text10").value)//#rows coutned by user
    var percslide = parseFloat(rows / 20) //percent of slide counted based on number of rows
    var gradcylinder = parseFloat(document.getElementById("text7").value)//volume in graduated cylinder provided by user
    var literconv = parseFloat(1000)//conversion factor from ml to liters
    var gradcylinderliter = parseFloat(gradcylinder / literconv)//volume in liters

    var cps1 = parseFloat(c1/percslide) //5 counted rows x 4 = total of 20 rows per slide
    var cps2 = parseFloat(c2/percslide) 
    var cps3 = parseFloat(c3/percslide) 
    var cps4 = parseFloat(c4/percslide) 
    var cps5 = parseFloat(c5/percslide) 
    var cps6 = parseFloat(c6/percslide) 
    var cps7 = parseFloat(c7/percslide) 
    var cps8 = parseFloat(c8/percslide) 

    var chambervol = parseFloat(0.001)//1 ml = 0.001 L (Sedgewick Rafter Cell volume)
    var propcounted = parseFloat(chambervol / gradcylinderliter) //proportion volume of Sedgewick Rafter counted based on #rows counted

    var cpsamp1 = parseFloat(cps1 / propcounted)//cells per sample
    var cpsamp2 = parseFloat(cps2 / propcounted)
    var cpsamp3 = parseFloat(cps3 / propcounted)
    var cpsamp4 = parseFloat(cps4 / propcounted)
    var cpsamp5 = parseFloat(cps5 / propcounted)
    var cpsamp6 = parseFloat(cps6 / propcounted)
    var cpsamp7 = parseFloat(cps7 / propcounted)
    var cpsamp8 = parseFloat(cps8 / propcounted)

    var diameter = parseFloat(document.getElementById("text9").value)
    var depth = parseFloat(document.getElementById("text8").value)
    var r = parseFloat(diameter/2)
    var lakewaterm3 = parseFloat(Math.PI * r^2 * depth)//Volume cylinder = pi*r^2*h
    var lakewaterL = parseFloat(lakewaterm3 * 1000) //cubic meters to liters

    var cpl1 = parseFloat(cpsamp1/lakewaterL)//cells per liter lake water
    var cpl2 = parseFloat(cpsamp2/lakewaterL)
    var cpl3 = parseFloat(cpsamp3/lakewaterL)
    var cpl4 = parseFloat(cpsamp4/lakewaterL)
    var cpl5 = parseFloat(cpsamp5/lakewaterL)
    var cpl6 = parseFloat(cpsamp6/lakewaterL)
    var cpl7 = parseFloat(cpsamp7/lakewaterL)
    var cpl8 = parseFloat(cpsamp8/lakewaterL)

    tbl1b.innerHTML = parseFloat(cps1.toFixed(3))//insert cells per sample in column "b" of table
    tbl2b.innerHTML = parseFloat(cps2.toFixed(3))
    tbl3b.innerHTML = parseFloat(cps3.toFixed(3))
    tbl4b.innerHTML = parseFloat(cps4.toFixed(3))
    tbl5b.innerHTML = parseFloat(cps5.toFixed(3))
    tbl6b.innerHTML = parseFloat(cps6.toFixed(3))
    tbl7b.innerHTML = parseFloat(cps7.toFixed(3))
    tbl8b.innerHTML = parseFloat(cps8.toFixed(3))

    tbl1c.innerHTML = parseFloat(cpl1.toFixed(3))//insert cells per liter lake water in column "c" of table
    tbl2c.innerHTML = parseFloat(cpl2.toFixed(3))
    tbl3c.innerHTML = parseFloat(cpl3.toFixed(3))
    tbl4c.innerHTML = parseFloat(cpl4.toFixed(3))
    tbl5c.innerHTML = parseFloat(cpl5.toFixed(3))
    tbl6c.innerHTML = parseFloat(cpl6.toFixed(3))
    tbl7c.innerHTML = parseFloat(cpl7.toFixed(3))
    tbl8c.innerHTML = parseFloat(cpl8.toFixed(3))

}

//////////Add-button functions
function addCounter1(){
    //First add counter # to table
    // console.log("It's working")
    counter_num = totalcount1.innerHTML
    c2 = totalcount2.innerHTML
    totalcount1.innerHTML = parseInt(counter_num) + 1
    tbl1.innerHTML = parseInt(counter_num) + 1
};

function addCounter2(){
    counter_num = totalcount2.innerHTML
    totalcount2.innerHTML = parseInt(counter_num) + 1
    tbl2.innerHTML = parseInt(counter_num) + 1
};
function addCounter3(){
    counter_num = totalcount3.innerHTML
    totalcount3.innerHTML = parseInt(counter_num) + 1
    tbl3.innerHTML = parseInt(counter_num) + 1
};
function addCounter4(){
    counter_num = totalcount4.innerHTML
    totalcount4.innerHTML = parseInt(counter_num) + 1
    tbl4.innerHTML = parseInt(counter_num) + 1
};
function addCounter5(){
    counter_num = totalcount5.innerHTML
    totalcount5.innerHTML = parseInt(counter_num) + 1
    tbl5.innerHTML = parseInt(counter_num) + 1
};
function addCounter6(){
    // console.log("It's working")
    counter_num = totalcount6.innerHTML
    totalcount6.innerHTML = parseInt(counter_num) + 1
    tbl6.innerHTML = parseInt(counter_num) + 1
};
function addCounter7(){
    counter_num = totalcount7.innerHTML
    totalcount7.innerHTML = parseInt(counter_num) + 1
    tbl7.innerHTML = parseInt(counter_num) + 1
};
function addCounter8(){
    counter_num = totalcount8.innerHTML
    totalcount8.innerHTML = parseInt(counter_num) + 1
    tbl8.innerHTML = parseInt(counter_num) + 1
};


///////////Minus button functions
function minCounter1(){
    // console.log("It's working")
    counter_num = totalcount1.innerHTML
    if (counter_num == 0){
        return false
    }
    totalcount1.innerHTML = parseInt(counter_num) - 1
    tbl1.innerHTML = parseInt(counter_num) - 1
};
function minCounter2(){
    counter_num = totalcount2.innerHTML
    if (counter_num == 0){
        return false
    }
    totalcount2.innerHTML = parseInt(counter_num) - 1
    tbl2.innerHTML = parseInt(counter_num) - 1
};
function minCounter3(){
    counter_num = totalcount3.innerHTML
    if (counter_num == 0){
        return false
    }
    totalcount3.innerHTML = parseInt(counter_num) - 1
    tbl3.innerHTML = parseInt(counter_num) - 1
};
function minCounter4(){
    counter_num = totalcount4.innerHTML
    if (counter_num == 0){
        return false
    }
    totalcount4.innerHTML = parseInt(counter_num) - 1
    tbl4.innerHTML = parseInt(counter_num) - 1
};
function minCounter5(){
    counter_num = totalcount5.innerHTML
    if (counter_num == 0){
        return false
    }
    totalcount5.innerHTML = parseInt(counter_num) - 1
    tbl5.innerHTML = parseInt(counter_num) - 1
};
function minCounter6(){
    counter_num = totalcount6.innerHTML
    if (counter_num == 0){
        return false
    }
    totalcount6.innerHTML = parseInt(counter_num) - 1
    tbl6.innerHTML = parseInt(counter_num) - 1
};
function minCounter7(){
    counter_num = totalcount7.innerHTML
    if (counter_num == 0){
        return false
    }
    totalcount7.innerHTML = parseInt(counter_num) - 1
    tbl7.innerHTML = parseInt(counter_num) - 1
};
function minCounter8(){
    counter_num = totalcount8.innerHTML
    if (counter_num == 0){
        return false
    }
    totalcount8.innerHTML = parseInt(counter_num) - 1
    tbl8.innerHTML = parseInt(counter_num) - 1
};


//////////Reset button function
function resetCounter(){
    if (confirm('Are you sure you want to reset?')) {        
    totalcount1.innerHTML = 0;
    totalcount2.innerHTML = 0;
    totalcount3.innerHTML = 0;
    totalcount4.innerHTML = 0;
    totalcount5.innerHTML = 0;
    totalcount6.innerHTML = 0;
    totalcount7.innerHTML = 0;
    totalcount8.innerHTML = 0;
    tbl1.innerHTML = 0;
    tbl2.innerHTML = 0;
    tbl3.innerHTML = 0;
    tbl4.innerHTML = 0;
    tbl5.innerHTML = 0;
    tbl6.innerHTML = 0;
    tbl7.innerHTML = 0;
    tbl8.innerHTML = 0;
    tbl1b.innerHTML = 0;
    tbl2b.innerHTML = 0;
    tbl3b.innerHTML = 0;
    tbl4b.innerHTML = 0;
    tbl5b.innerHTML = 0;
    tbl6b.innerHTML = 0;
    tbl7b.innerHTML = 0;
    tbl8b.innerHTML = 0;
    tbl1c.innerHTML = 0;
    tbl2c.innerHTML = 0;
    tbl3c.innerHTML = 0;
    tbl4c.innerHTML = 0;
    tbl5c.innerHTML = 0;
    tbl6c.innerHTML = 0;
    tbl7c.innerHTML = 0;
    tbl8c.innerHTML = 0;
        console.log('Counters have been reset.');
      } else {
        // Do nothing!
        console.log('Counters not reset');
      }

};

function tableToCSV() { //When the tableToCSV() function is triggered, it accesses each table row data using the document object model.

        // Variable to store the final csv data
        var csv_data = [];
    
        // Get each row data
        var rows = document.getElementsByTagName('tr'); //The getElementByTagName(‘tr’) retrieves all table row data and stores it in rows variable
        for (var i = 0; i < rows.length; i++) {
    
            // Get each column data
            var cols = rows[i].querySelectorAll('td'); //The rows[i].querySelectorAll(‘td’) will get each column data of that table row.
    
            // Stores each csv row data
            var csvrow = [];
            for (var j = 0; j < cols.length; j++) { //It is stored in csvrow variable. 
    
                // Get the text data of each cell of
                // a row and push it to csvrow
                csvrow.push(cols[j].innerHTML);
            }
    
            // Combine each column value with comma
            csv_data.push(csvrow.join(",")); //The csvrow variable data are combined w/ commas to represent a row of a CSV file - it's stored in a csv_data variable representing the data of our CSV file in combination.
        }
        // combine each row data with new line character
        csv_data = csv_data.join('\n'); //We then join csv_data values using the newline character as each row in a CSV file is represented in a new line.
        
        // Call this function to download csv file 
        downloadCSVFile(csv_data);
}

function downloadCSVFile(csv_data) { //This function will take the CSV data that was formed earlier, as the argument 

        // Create CSV file object and feed our
        // csv_data into it
        CSVFile = new Blob([csv_data], { type: "text/csv" }); //We will create a new file by creating a blob object of type CSV and then feed our CSV data into it
    
        // Create to temporary link to initiate
        // download process
        var temp_link = document.createElement('a'); //We need a link to trigger the browser window to download the file
    
        // Download csv file
        strname = document.getElementById('text1').value;
        strdate = document.getElementById('text2').value;
        temp_link.download = String(strname) + String(strdate)+".csv"; //We will create a new link using DOM and provide its attributes with the appropriate values
        var url = window.URL.createObjectURL(CSVFile);
        temp_link.href = url;
    
        // This link should not be displayed
        temp_link.style.display = "none"; //This link so created should not be visible to the user as this link is solely for download triggering purposes and not for any other
        document.body.appendChild(temp_link);
    
        // Automatically click the link to trigger download
        temp_link.click(); //Using click() event listener, we can automatically let the link be clicked and download our CSV file.
        document.body.removeChild(temp_link); 
        // Now our CSV file should be successfully downloade
    }
    

/////////////////////Submit info button
const out1 = document.getElementById('output1');
const out2 = document.getElementById('output2');
const out3 = document.getElementById('output3');
const out4 = document.getElementById('output4');
const out5 = document.getElementById('output5');
const out6 = document.getElementById('output6');
const out7 = document.getElementById('output7');
const out8 = document.getElementById('output8');
const out9 = document.getElementById('output9');
const out10 = document.getElementById('output10');
const out11 = document.getElementById('output11');
const outalert = document.getElementById('outalert');



function fn1(){ //called in html using "onclick=" in the button 
    str1 = document.getElementById('text1').value;
    str2 = document.getElementById('text2').value;
    str3 = document.getElementById('text3').value;
    str4 = document.getElementById('text4').value;
    str5 = document.getElementById('text5').value;
    str6 = document.getElementById('text6').value;
    str7 = document.getElementById('text7').value;
    str8 = document.getElementById('text8').value;
    str9 = document.getElementById('text9').value;
    str10 = document.getElementById('text10').value;
    str11 = document.getElementById('text11').value;
    out1.innerHTML = str1;
    out2.innerHTML = str2;
    out3.innerHTML = str3;
    out4.innerHTML = str4;
    out5.innerHTML = str5;
    out6.innerHTML = str6;
    out7.innerHTML = str7;
    out8.innerHTML = str8;
    out9.innerHTML = str9;
    out10.innerHTML = str10;
    out11.innerHTML = str11;
    outalert.innerHTML = "Info submitted";
}


// Get the modal for image 1
var modal1 = document.getElementById("myModal1");
var modal2 = document.getElementById("myModal2");
var modal3 = document.getElementById("myModal3");
var modal4 = document.getElementById("myModal4");
var modal5 = document.getElementById("myModal5");
var modal6 = document.getElementById("myModal6");
var modal7 = document.getElementById("myModal7");
var modal8 = document.getElementById("myModal8");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img1 = document.getElementById("myImg1");
var img2 = document.getElementById("myImg2");
var img3 = document.getElementById("myImg3");
var img4 = document.getElementById("myImg4");
var img5 = document.getElementById("myImg5");
var img6 = document.getElementById("myImg6");
var img7 = document.getElementById("myImg7");
var img8 = document.getElementById("myImg8");

var modalImg1 = document.getElementById("img01");
var modalImg2 = document.getElementById("img02");
var modalImg3 = document.getElementById("img03");
var modalImg4 = document.getElementById("img04");
var modalImg5 = document.getElementById("img05");
var modalImg6 = document.getElementById("img06");
var modalImg7 = document.getElementById("img07");
var modalImg8 = document.getElementById("img08");

var captionText1 = document.getElementById("caption1");
var captionText2 = document.getElementById("caption2");
var captionText3 = document.getElementById("caption3");
var captionText4 = document.getElementById("caption4");
var captionText5 = document.getElementById("caption5");
var captionText6 = document.getElementById("caption6");
var captionText7 = document.getElementById("caption7");
var captionText8 = document.getElementById("caption8");

img1.onclick = function(){
  modal1.style.display = "block";
  modalImg.src = this.src;
  captionText1.innerHTML = this.alt;}
img2.onclick = function(){
  modal2.style.display = "block";
  modalImg2.src = this.src;
  captionText2.innerHTML = this.alt;}
img3.onclick = function(){
  modal3.style.display = "block";
  modalImg3.src = this.src;
  captionText3.innerHTML = this.alt;}
img4.onclick = function(){
  modal4.style.display = "block";
  modalImg4.src = this.src;
  captionText4.innerHTML = this.alt;}
img5.onclick = function(){
  modal5.style.display = "block";
  modalImg5.src = this.src;
  captionText5.innerHTML = this.alt;}
img6.onclick = function(){
  modal6.style.display = "block";
  modalImg6.src = this.src;
  captionText6.innerHTML = this.alt;}
img7.onclick = function(){
  modal7.style.display = "block";
  modalImg7.src = this.src;
  captionText7.innerHTML = this.alt;}
img8.onclick = function(){
  modal8.style.display = "block";
  modalImg8.src = this.src;
  captionText8.innerHTML = this.alt;}


// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close1")[0];
var span2 = document.getElementsByClassName("close2")[0];
var span3 = document.getElementsByClassName("close3")[0];
var span4 = document.getElementsByClassName("close4")[0];
var span5 = document.getElementsByClassName("close5")[0];
var span6 = document.getElementsByClassName("close6")[0];
var span7 = document.getElementsByClassName("close7")[0];
var span8 = document.getElementsByClassName("close8")[0];


// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
  modal1.style.display = "none";}
span2.onclick = function() {
    modal2.style.display = "none";}
span3.onclick = function() {
    modal3.style.display = "none";}
span4.onclick = function() {
    modal4.style.display = "none";}
span5.onclick = function() {
    modal5.style.display = "none";}
span6.onclick = function() {
    modal6.style.display = "none";}
span7.onclick = function() {
    modal7.style.display = "none";}
span8.onclick = function() {
    modal8.style.display = "none";}
