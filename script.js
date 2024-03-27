

const base_url = 'https://raw.githubusercontent.com/blato122/mont-blanc-cam/main/gouter/';
  
const today = new Date(); // current date, can't go past that
const init = new Date('March 26, 2024 20:00:00'); // date of starting the program, can't go earlier than that

let date = new Date();
let current_year = date.getFullYear();
let current_month = date.getMonth() + 1; // months are 0-indexed
let current_day = date.getDate();
let current_hour = (date.getHours() < 10) ? ("0" + date.getHours()) : date.getHours();

let img_element = document.getElementById('gouter-photo');
let prev_hour_button = document.getElementById('gouter-prev-hour');
let next_hour_button = document.getElementById('gouter-next-hour');
// zamiast tego to suwak z boku z godzinami, co przeskakuje o 1!
// i wtedy nie trzeba checka czy nie wychodzi się poza 7 lub 22!

function update_photo() {
    let img_url = `${base_url}${current_year}/${current_month}/${current_day}/${current_hour}.jpg`;
    console.log(img_url)
    img_element.src = img_url;
}

function update_date(hours=0, days=0, months=0, years=0) {
    current_year = current_year + years;
    current_month = current_month + months;
    current_day = current_day + days;
    current_hour = (current_hour + hours < 10) ? ("0" + current_hour + hours) : current_hour + hours; // redundant all od this

    if (current_hour == "07") {
        current_hour == 22; // idk if these will work
        current_day -= 1;
    }

    if (current_hour == 23) {
        current_hour == "08"
        current_day += 1;
    }

    update_photo();
}

prev_hour_button.addEventListener('click', () => {
    update_date(-1);
});

next_hour_button.addEventListener('click', () => { // ale cool! można godzinami przechodzić między dniami!!! ale zmienić że jak się zmniejsza na 7
// czy tam 6, to przenosi na ostanią godzinę poprzedniego dnia czyli 21 lib 22, nwm
// całkiem ez to 

// no i blokować dalsze przesuwanie jak już nie ma zdjęć!! żeby nie wychodzić coraz dalej za zakres!
// i dać przycisk powrotu do bieżącej daty :))))))
    update_date(1);
});

// Initial update
update_photo();

// time zone?

// into 2 files maybe idk 

// Get the slider element
let slider = document.getElementById("gouter-time-slider");
// Get the display element
let hourDisplay = document.getElementById("hour");

// Update the display value when slider value changes
slider.addEventListener("input", function() {
  // Update the display value
  hourDisplay.innerText = slider.value;
  update_date(slider.value - Number(current_hour))
  current_hour = slider.value
});

// split into 2 files???