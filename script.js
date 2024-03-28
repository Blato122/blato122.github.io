function CET_now() {
    let local_date = new Date();
    let utc_offset_mins = local_date.getTimezoneOffset();
    let cet_offset_mins = utc_offset_mins + 60;
    let cest_offset_mins = utc_offset_mins + 120;
    let cet_offset_millis = cet_offset_mins * 60 * 1000;
    let cest_offset_millis = cest_offset_mins * 60 * 1000;

    let cest_start = new Date('29 March ' + local_date.getFullYear() + ' 02:00:00 GMT+0100');
    let cest_finish = new Date('25 October ' + local_date.getFullYear() + ' 03:00:00 GMT+0200');

    if(local_date >= cest_start && local_date <= cest_finish) {
        return new Date(local_date + cest_offset_millis);
    } else {
        return new Date(local_date + cet_offset_millis);
    }
}

const base_url = 'https://raw.githubusercontent.com/blato122/mont-blanc-cam/main/gouter/';
  
const today = CET_now(); // current date, can't go past that (CET/CEST)
const init = new Date('27 March 2024 08:00:00 GMT+0100'); // date of starting the program, can't go earlier than that (CET)
let current = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours());

let img_element = document.getElementById('gouter-photo');
let slider = document.getElementById("gouter-time-slider");
let hour_display = document.getElementById("gouter-hour");
let info = document.getElementById("gouter-info");
let date = document.getElementById("gouter-date")

function update_photo() {
    let hour_str = (current.getHours() >= 10) ? current.getHours() : ("0" + current.getHours());
    let img_url = `${base_url}${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()}/${hour_str}.jpg`; // months are 0-indexed
    console.log(img_url);
    img_element.src = img_url;
}

function update_date(hours=today.getHours(), days=0, months=0, years=0) {
    let old_date = new Date(current);

    current.setFullYear(current.getFullYear() + years);
    current.setMonth(current.getMonth() + months);
    current.setDate(current.getDate() + days);
    current.setHours(hours);

    console.log(current);
    if (current >= init && current <= today) {
        update_photo();
        info.innerText = "";
        date.innerText = current; // !
    } else {
        current = old_date;
        slider.value = (current.getHours() >= 10) ? current.getHours() : ("0" + current.getHours());
        info.innerText = "not available - cannot go past " + today + " or before " + init;
    }
    hour_display.innerText = slider.value;
}

// https://stackoverflow.com/questions/39993676/code-inside-domcontentloaded-event-not-working
if (document.readyState !== 'loading') {
    console.log("document already ready")
    document.getElementById("gouter-time-slider").value = today.getHours();
    document.getElementById("gouter-hour").innerText = today.getHours();
    document.getElementById("gouter-info").innerText = "";
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log("document was not ready: DOMContentLoaded")
        document.getElementById("gouter-time-slider").value = today.getHours();
        document.getElementById("gouter-hour").innerText = today.getHours();
        document.getElementById("gouter-info").innerText = "";
    });
}

img_element.addEventListener("error", () => {
    if (current <= today) {
        info.innerText = "not available yet - try again in a few minutes"; // nie powinno tego wypisywać, gdy jest siódma... a brakuje zdjęcia (ale będzie już ok od 29 marca)
    }
    console.log("img_element: error")
    img_element.src = 'image-not-found.png';
});

// Update the display value when slider value changes
slider.addEventListener("input", function() {
    console.log("slider: input")
    update_date(Number(slider.value));
});

let prev_day_button = document.getElementById('gouter-prev-day');
let next_day_button = document.getElementById('gouter-next-day');
let prev_month_button = document.getElementById('gouter-prev-month');
let next_month_button = document.getElementById('gouter-next-month');
let prev_year_button = document.getElementById('gouter-prev-year');
let next_year_button = document.getElementById('gouter-next-year');

prev_day_button.addEventListener('click', () => {
    update_date(current.getHours(), -1);
});

next_day_button.addEventListener('click', () => {
    update_date(current.getHours(), 1);
});

prev_month_button.addEventListener('click', () => {
    update_date(current.getHours(), 0, -1);
});

next_month_button.addEventListener('click', () => {
    update_date(current.getHours(), 0, 1);
});

prev_year_button.addEventListener('click', () => {
    update_date(current.getHours(), 0, 0, -1);
});

next_year_button.addEventListener('click', () => {
    update_date(current.getHours(), 0, 0, 1);
});

// Initial update
update_photo();

// jak na bergfex - dodać opcję pobrania historii (ale tutaj całej) z danej godziny!! i od today, dekrementując dzień, aż do init iść
// i wyświetlić w siatce jakiejś! żeby nie tylko jedno na stronie całej było (może nowa podstona jakaś? nowa karta w sensue)

// dodać tete rousse też! ale najpierw pousuwać chyba niektóre zmienne globalne. typu current i zrobić je normalnie
// i wtedy całość jako jedna wielka funkcja z argumentem gouter/tete-rousse jako string (arg + "-prev-year" np. potem gdzie arg to gouter/tete)

//  sprawdzić czy te daty CET w ogóle działają! + po zmianie czasu!
// split into 2 files??? ale syf tu jest już
// to do:
// https://stackoverflow.com/questions/70983766/range-slider-avoid-moving-forward-when-reaching-a-value-specified-in-another-e
// to u góry zamiast ograniczania sztucznie slidera
// i może jeszcze sprawdzanie slidera w jego event listenerze zamiast w funkcji potem?
// po co zmieniac wartosc i potem z powrotem ja przywracac? lepiej w ogole nie zmienac chyab
// chyvba jednak nie, to bedzie neiwygodne, lepiej calosc na raz moze jednak