const base_url = 'https://raw.githubusercontent.com/blato122/mont-blanc-cam/main/gouter/';
  
const today = new Date(); // current date, can't go past that
const init = new Date('March 27, 2024 8:00:00'); // date of starting the program, can't go earlier than that
const current = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours()); // months are 0-indexed

let img_element = document.getElementById('gouter-photo');

function update_photo() {
    let hour_str = (current.getHours() >= 10) ? current.getHours() : ("0" + current.getHours());
    let img_url = `${base_url}${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()}/${hour_str}.jpg`;
    console.log(img_url);
    img_element.src = img_url;
}

function update_date(hours=today.getHours(), days=0, months=0, years=0) {
    let old_date = current;

    current.setFullYear(current.getFullYear() + years); // jak z tym indeksem, nie wiem czy to w ogole zadziala
    current.setMonth(current.getMonth() + months); // od 0 indeks w koncu? - bez znaczenia
    current.setDate(current.getDate() + days);
    current.setHours(hours);

    // current_year = current_year + years;
    // current_month = current_month + months;
    // current_day = current_day + days;
    // current_hour = hours;

    console.log(current);
    if (current >= init && current <= today) {
        update_photo(); // hmm, does that if make sense? i mean it does but maybe we can do better thatn tahta! !! ! ! !hehehe
    } else {
        current_date = old_date;
        slider.value = (old_date.getHours() >= 10) ? old_date.getHours() : ("0" + old_date.getHours());
    }
}

// https://stackoverflow.com/questions/39993676/code-inside-domcontentloaded-event-not-working
if (document.readyState !== 'loading') {
    console.log("document already ready")
    document.getElementById("gouter-time-slider").value = today.getHours();
    document.getElementById("gouter-hour").innerText = today.getHours();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log("document was not ready: DOMContentLoaded")
        document.getElementById("gouter-time-slider").value = today.getHours();
        document.getElementById("gouter-hour").innerText = today.getHours();
    });
}

img_element.addEventListener("error", () => {
    console.log("img_element: error")
    img_element.src = 'image-not-found.png';
});

let slider = document.getElementById("gouter-time-slider");
let hourDisplay = document.getElementById("gouter-hour");

// Update the display value when slider value changes
slider.addEventListener("input", function() {
    console.log("slider: input")
    hourDisplay.innerText = slider.value;
    update_date(Number(slider.value));
});

// Initial update
update_photo();
// time zone?
// split into 2 files???