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
    } else {
        current = old_date;
        slider.value = (current.getHours() >= 10) ? current.getHours() : ("0" + current.getHours());
        info.innerText = "not available";
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
    console.log("img_element: error")
    img_element.src = 'image-not-found.png';
});

let slider = document.getElementById("gouter-time-slider");
let hour_display = document.getElementById("gouter-hour");
let info = document.getElementById("gouter-info");

// Update the display value when slider value changes
slider.addEventListener("input", function() {
    console.log("slider: input")
    update_date(Number(slider.value));
});

// Initial update
update_photo();

// split into 2 files???
// to do:
// https://stackoverflow.com/questions/70983766/range-slider-avoid-moving-forward-when-reaching-a-value-specified-in-another-e
// to u góry zamiast ograniczania sztucznie slidera
// i może jeszcze sprawdzanie slidera w jego event listenerze zamiast w funkcji potem?
// po co zmieniac wartosc i potem z powrotem ja przywracac? lepiej w ogole nie zmienac chyab
// chyvba jednak nie, to bedzie neiwygodne, lepiej calosc na raz moze jednak