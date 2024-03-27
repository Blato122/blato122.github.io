const base_url = 'https://raw.githubusercontent.com/blato122/mont-blanc-cam/main/gouter/';
  
const today = new Date(); // current date, can't go past that
const init = new Date('March 27, 2024 8:00:00'); // date of starting the program, can't go earlier than that

let current_year = today.getFullYear();
let current_month = today.getMonth() + 1; // months are 0-indexed
let current_day = today.getDate();
let current_hour = today.getHours();

let img_element = document.getElementById('gouter-photo');

function update_photo() {
    let hour_str = (current_hour >= 10) ? current_hour : ("0" + current_hour);
    let img_url = `${base_url}${current_year}/${current_month}/${current_day}/${hour_str}.jpg`;
    console.log(img_url);
    img_element.src = img_url;
}

function update_date(hours=0, days=0, months=0, years=0) {
    current_year = current_year + years;
    current_month = current_month + months;
    current_day = current_day + days;
    current_hour = current_hour + hours;

    let current_date = new Date(current_year, current_month, current_day, current_hour)
    if (current_date >= init && current_date <= today) {
        update_photo();
    }
}

// prev_month_button.addEventListener('click', () => {
//     update_date(0, 0, -1, 0);
// });

// next_month_button.addEventListener('click', () => { 
//     update_date(0, 0, 1, 0);
// });

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("gouter-time-slider").value = today.getHours();
    document.getElementById("gouter-hour").innerText = today.getHours();
});

img_element.addEventListener("error", () => {
    img_element.src = 'image-not-found.png';
});

let slider = document.getElementById("gouter-time-slider");
let hourDisplay = document.getElementById("gouter-hour");

// Update the display value when slider value changes
slider.addEventListener("input", function() {
  hourDisplay.innerText = slider.value;
  prev_hour = current_hour;
  current_hour = Number(slider.value);
  update_date(current_hour - prev_hour);
});

// Initial update
update_photo();
// time zone?
// split into 2 files???
// usunac 26 marca bo nie ma wszystkich zdjec