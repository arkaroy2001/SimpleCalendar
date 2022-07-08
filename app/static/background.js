// chrome.browserAction.onClicked.addListener(function() {

//     chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, function(tab) {
//         // Tab opened.
//     });

// });

//one click opens index.html
//two clicks open popup.html

const daysStr = {
	0: "Sun",
	1: "Mon",
	2: "Tue",
	3: "Wed",
	4: "Thu",
	5: "Fri",
	6: "Sat"
};

const daysIndex = {
	Sun: 0,
	Mon: 1,
	Tue: 2,
	Wed: 3,
	Thu: 4,
	Fri: 5,
	Sat: 6
};

const monthsStr = {
	0: "Jan",
	1: "Feb",
	2: "Mar",
	3: "Apr",
	4: "May",
	5: "Jun",
	6: "Jul",
	7: "Aug",
	8: "Sep",
	9: "Oct",
	10: "Nov",
	11: "Dec"
};

const monthsIndex = {
	Jan: 0,
	Feb: 1,
	Mar: 2,
	Apr: 3,
	May: 4,
	Jun: 5,
	Jul: 6,
	Aug: 7,
	Sep: 8,
	Oct: 9,
	Nov: 10,
	Dec: 11
};

const now = new Date();
//for testing purposes use 'let' instead of 'const'
const todayDay = now.getDay(),
	todayDate = now.getDate(),
	todayMonth = now.getMonth(),
    todayYear = now.getFullYear();

const state = {
    todayDay,
    todayDate,
    todayMonth,
    todayYear
};  

var currentFullYear = analyzeYear(state.todayYear);
//console.log(currentFullYear);
var currentFullMonth = currentFullYear.months[monthsStr[state.todayMonth]];
//console.log(currentFullMonth);

showCalendarInfo();
makeClockTikTok();

function makeClockTikTok(){

    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    let dayState = (hours>12)?true:false;

    hours = (hours>12)?(hours-12):hours;
    
    if(!dayState && hours == 0){
        hours=12;
    }
    const timeTemplate = `
    <span>${hours}</span>:
    <span>${minutes > 9 ? minutes : "0" + minutes} </span>:
    <span>${seconds > 9 ? seconds : "0" + seconds}</span>
    <span>${dayState ? "PM": "AM"}</span>
    `;

    var current = new Date();
    document.getElementById("time").innerHTML=timeTemplate;
}

setInterval(makeClockTikTok, 1000);



updateCurrentDay();

function updateCurrentDay(){
    let today = new Date();
    document.getElementById("current-year").innerHTML = today.getFullYear();
    document.getElementById("cur-day").innerHTML = daysStr[today.getDay()];
    document.getElementById("cur-month").innerHTML = monthsStr[today.getMonth()];
    document.getElementById("cur-date").innerHTML = today.getDate();
}

setInterval(updateCurrentDay(), 1000);

var monthArrDiff = [];


function showCalendarInfo(){
    document.querySelector("#cal-year").innerHTML = state.todayYear;
    document.querySelector("#cal-month").innerHTML = monthsStr[state.todayMonth];
    printMonthCalendar();
}

//print each cell's day number and color
function printMonthCalendar(){
    const monthArr = calcMonthCalendar();
    monthArrDiff = calcMonthCalendarDiff();

    for(let i = 0; i<6; i++){
        let currentWeek = monthArr[i];
        //console.log(currentWeek);
        const week = document.querySelector("#table-body").children[i+1];
        //console.log(week);
        for(let j = 0; j<7; j++){
            // console.log(week.children[j]);
            week.children[j].children[0].innerHTML = currentWeek[j].day;
            if(currentWeek[j].state == "prevMonth" || 
            currentWeek[j].state == "nextMonth"){
                week.children[j].style.backgroundColor = "rgb(149, 152, 237)";
                week.children[j].style.color = "rgb(202, 204, 250)";
                week.children[j].style.cursor = "pointer";
                week.children[j].children[0].style.background = "None";
                week.children[j].children[0].style.border = "None";
            }
            else{
                week.children[j].style.backgroundColor = "white";
                week.children[j].style.color = "black";
                week.children[j].children[0].style.background = "None";
                week.children[j].children[0].style.border = "None";
            }
            
            let checker1 = document.querySelector("#cal-year").innerHTML == todayYear;
            let checker2 = document.querySelector("#cal-month").innerHTML == todayMonth;
            let checker3 = currentWeek[j].day == todayDate;

            if(document.querySelector("#cal-year").innerHTML == todayYear &&
            document.querySelector("#cal-month").innerHTML == monthsStr[todayMonth] &&
            currentWeek[j].day == todayDate && currentWeek[j].state == "currMonth"){
                //console.log(week.children[j]);
                week.children[j].style.color = "black";
                week.children[j].children[0].style.border = "1px double red";
                // week.children[j].style.innerHTML.borderRadius = "2px";
                week.children[j].children[0].style.background = "red";
                week.children[j].children[0].style.borderRadius = "30px";
            }
        }
    }
    //console.log("DONE")
}

//get last month days in current month view
function makePrevMonthArr(firstDayIndex) {
	let prevMonthIdx;
	let prevMonthDays;
	if (state.todayMonth === 0) {
		prevMonthDays = analyzeMonth("Dec", state.todayYear - 1).days_length;
	} else {
		prevMonthIdx = monthsIndex[currentFullMonth.month] - 1;
		prevMonthDays = currentFullYear.months[monthsStr[prevMonthIdx]].days_length;
	}
	let result = [];
	for (let i = 1; i <= firstDayIndex; i++) {
		const day = prevMonthDays - firstDayIndex + i;
		result.push({ day, state: "prevMonth" });
	}

	return result;
}

function makePrevMonthArrDiff(firstDayIndex) {
	let prevMonthIdx;
	let prevMonthDays;
	if (state.todayMonth === 0) {
		prevMonthDays = analyzeMonth("Dec", state.todayYear - 1).days_length;
	} else {
		prevMonthIdx = monthsIndex[currentFullMonth.month] - 1;
		prevMonthDays = currentFullYear.months[monthsStr[prevMonthIdx]].days_length;
	}
	let result = [];
	for (let i = 1; i <= firstDayIndex; i++) {
		const day = prevMonthDays - firstDayIndex + i;
		result.push({ [day]: "prevMonth" });
	}

	return result;
}
function calcMonthCalendarDiff(){
    const currMonthDiff = Array.from(
		{ length: currentFullMonth.days_length },
		(_, i) => ({ [i + 1]: "currMonth" })
    ); 

    const nextMonthDiff = Array.from(
		{ length: currentFullMonth.days_length },
		(_, i) => ({ [i + 1]: "nextMonth" })
    );

    const flatResultArrDiff = [
		...makePrevMonthArrDiff(currentFullMonth.first_day_index),
		...currMonthDiff,
		...nextMonthDiff // this includes extra numbers that will be trimmed
    ].slice(0, 7 * 6);

    console.log(flatResultArrDiff);
    // const resultArrDiff = [];
	// for (let i = 0; i < 7; i++) {
	// 	resultArrDiff.push(flatResultArrDiff.slice(i * 7, (i + 1) * 7));
    // }

    return flatResultArrDiff;
}
function calcMonthCalendar(){
    // Create array: [1, 2, 3, ..., 30, 31]
	const currMonth = Array.from(
		{ length: currentFullMonth.days_length },
		(_, i) => ({ day: i + 1, state: "currMonth" })
    ); 
    //console.log(currMonth);

    const nextMonth = Array.from(
		{ length: currentFullMonth.days_length },
		(_, i) => ({ day: i + 1, state: "nextMonth" })
    );

    
    //console.log(nextMonth);

    //Create a flat array with leading zeros and trailing last week:
	//[0, 0, 0, 0, 1, 2, 3, ..., 30, 31, 1, 2, 3, 4, 5, 6, 7]
	const flatResultArr = [
		...makePrevMonthArr(currentFullMonth.first_day_index),
		...currMonth,
		...nextMonth // this includes extra numbers that will be trimmed
    ].slice(0, 7 * 6); // 7 days/week * 6 weeks
    
    //console.log(flatResultArr);
    
    // Chunk the flat array into slices of 7:
    const resultArr = [];
	for (let i = 0; i < 7; i++) {
		resultArr.push(flatResultArr.slice(i * 7, (i + 1) * 7));
    }
    console.log(resultArr);
	return resultArr;
}

function nextMonth(){
    state.todayMonth += 1;
    if(state.todayMonth==12){
        state.todayYear += 1;
        currentFullYear = analyzeYear(state.todayYear);
        state.todayMonth=0;
    }
    currentFullMonth = currentFullYear.months[monthsStr[state.todayMonth]];
    showCalendarInfo();
}

//exp: analyizYear(2019) will get you all months length,first day,last day with indexes
function analyzeYear(year){
    let counter = 0;
	const currentYear = {
		year: year,
		is_leap: false,
		months: {
			Jan: 0,
			Feb: 1,
			Mar: 2,
			Apr: 3,
			May: 4,
			Jun: 5,
			Jul: 6,
			Aug: 7,
			Sep: 8,
			Oct: 9,
			Nov: 10,
			Dec: 11
		}
    };
    
    while(counter<12){
        Object.keys(currentYear.months).forEach(month=>{
            currentYear.months[month] = analyzeMonth(month, year);
        });
        counter++;
    }

    if (currentYear.months["Feb"].days_length === 29) {
		currentYear.is_leap = true;
	}
    
    return currentYear;
}

//exp: run analyizMonth(String:'Dec',Int:2019) note:(must capitalize month like Sep,Nov)
function analyzeMonth(month, year){
    const testDays = 31;
    let counter = 0;
    
    const monthObj = {
        year: year,
        month: month,
        month_index: monthsIndex[month],
        first_day: "",
		first_day_index: null,
        days_length: 0,
        last_day: "",
		last_day_index: null
    };

    while (counter < testDays){
        counter++;
        const dateTest = `${counter} ${month} ${year}`;
        //console.log(dateTest);
        const dateArr = new Date(dateTest).toDateString().split(" ");
        //console.log(dateArr);
        if(dateArr[1] === month){
            if(counter === 1){
                monthObj.first_day = dateArr[0];
                monthObj.first_day_index = daysIndex[dateArr[0]];
            }
            monthObj.days_length++;
            monthObj.last_day = dateArr[0];
            monthObj.last_day_index = daysIndex[dateArr[0]];
        }
        else{
            return monthObj;
        }
    }
    return monthObj;
}

function prevMonth(){
    state.todayMonth -= 1;
    if(state.todayMonth==-1){
        state.todayYear -= 1;
        currentFullYear = analyzeYear(state.todayYear);
        state.todayMonth=11;
    }
    currentFullMonth = currentFullYear.months[monthsStr[state.todayMonth]];
    showCalendarInfo();
}

document.querySelector(".fa-caret-left").addEventListener("click", prevMonth);
document.querySelector(".fa-caret-right").addEventListener("click", nextMonth);




const buttons = document.querySelectorAll('.text-button');

//Works for Chrome
textField.document.designMode="On";

//Works for Firefox
// textField.contentDocument.designMode="On";
// getIFrameDocument("textField").designMode = "On";

for(let i=0; i<buttons.length; i++){
    buttons[i].addEventListener('click',()=>{
        let cmd = buttons[i].getAttribute('data-cmd');
        textField.document.execCommand(cmd,false,null);

    })
}

// $('.align-btn-group > .text-button').click(function() {
//     $(".align-btn-group > .text-button").removeClass("active");
//     $(this).addClass('active');
// });

// $('.change-text-btn-group > .text-button').click(function() {
//     $(this).toggleClass('active');
// });

// $('.list-btn-group > .text-button').click(function() {
//     if($(this).hasClass('active')){
//         $(this).removeClass('active');
//     }else{
//         $(".list-btn-group > .text-button").removeClass("active");
//         $(this).addClass('active');
//     }
// });
document.getElementById('output').contentWindow.document.body.innerHTML = localStorage.getItem("quick-notes-text")

textField.addEventListener('input', ()=>{
    console.log("HERE");
    let text = document.getElementById('output').contentWindow.document.body.innerHTML;
    localStorage.setItem("quick-notes-text", text);
})


// document.getElementById('output').contentWindow.document.body.innerHTML = chrome.storage.local.get("quick-notes-text", function(data){
//     console.log(data);
// })

// textField.addEventListener('input', ()=>{
//     console.log("HERE");
//     let text = document.getElementById('output').contentWindow.document.body.innerHTML;
//     chrome.storage.local.set({"poop": text});
// })

// function makeBold(){
//     console.log("HERE");
//     document.getElementById('output').style.fontWeight = '900';
// }

// document.querySelector(".fa-bold").addEventListener("click",makeBold);
let id_counter = 0;
var notes;
let staticNotes = [
    {
        id: id_counter++,
        desc:"Check out syllabus",
        date: "7 18 2021"
    },
    {
        id: id_counter++,
        desc:"Make project",
        date: "7 19 2021"
    },
    {
        id: id_counter++,
        desc:"Start cut",
        date: "7 20 2021"
    }
];

//localStorage.removeItem("notes");
let notesFound = localStorage.getItem("notes");
console.log(notesFound);

if(!notesFound){
    console.log("notes not found");
    console.log(JSON.stringify(staticNotes));
    localStorage.setItem("notes", JSON.stringify(staticNotes));
    notes = staticNotes;
}else{
    notes = JSON.parse(notesFound);
}

function updateLocalStorage() {
	let currentNotes = notes;
	localStorage.setItem("notes", JSON.stringify(currentNotes));
}


document.body.addEventListener("click", e => {
	let noteDate;
	let noteId;
	let note;
	let verbWord;
    if (e.target.parentElement.parentElement.id == "table-body" || 
    e.target.parentElement.parentElement.parentElement.id == "table-body") {

        console.log(e.target.parentElement.nodeName);
        console.log(e.target.parentElement.getBoundingClientRect());
        console.log(e.clientX);
        document.querySelector("#noteMonth").innerHTML = monthsStr[state.todayMonth]; 
 
        if(e.target.nodeName == "SPAN"){
            document.querySelector("#noteDate").innerHTML = e.target.innerHTML;
        }
        else{
            document.querySelector("#noteDate").innerHTML = e.target.querySelector("span").innerHTML
        }
        // document.querySelector(".modal").style.top = e.clientY + "px";
        // document.querySelector(".modal").style.left = e.clientX + "px";
        document.querySelector(".modal").style.top = (e.target.getBoundingClientRect().top + (e.target.getBoundingClientRect().height)+20) + "px";
        document.querySelector(".modal").style.left = e.target.getBoundingClientRect().left + "px";
        document.querySelector("#noteYear").innerHTML = state.todayYear;
		$(".modal").addClass('is-visible');
    }
    
});

// document.querySelector("#table-body").addEventListener("click", function(){
//     console.log("HERE");
// 	$(".modal").addClass('is-visible');
// })

//click on the x button click out of the modal window
document.querySelector(".close-modal").addEventListener("click", function(){
    console.log("HERE");
	$(".modal").removeClass('is-visible');
})

//click anywhere outside the modal dialog to close the modal window
document.addEventListener("click", e => {
    if (e.target == document.querySelector(".modal.is-visible")) {
        $(".modal").removeClass('is-visible');
    }
})





