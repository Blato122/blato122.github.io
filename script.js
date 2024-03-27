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