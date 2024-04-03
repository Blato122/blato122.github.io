// to do
// jak na bergfex - dodać opcję pobrania historii (ale tutaj całej) z danej godziny!! i od today, dekrementując dzień, aż do init iść
// i wyświetlić w siatce jakiejś! żeby nie tylko jedno na stronie całej było (może nowa podstona jakaś? nowa karta w sensue)
function display_history(days) {

}

function CET_CEST_now() {
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

function preloadImages(array, waitForOtherResources, timeout) {
    let loaded = false, list = preloadImages.list, imgs = array.slice(0), t = timeout || 15*1000, timer;
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    if (!waitForOtherResources || document.readyState === 'complete') {
        loadNow();
    } else {
        window.addEventListener("load", () => {
            clearTimeout(timer);
            loadNow();
        });
        // in case window.addEventListener doesn't get called (sometimes some resource gets stuck)
        // then preload the images anyway after some timeout time
        timer = setTimeout(loadNow, t);
    }

    function loadNow() {
        if (!loaded) {
            loaded = true;
            for (let i = 0; i < imgs.length; i++) {
                let img = new Image();
                img.onload = img.onerror = img.onabort = function() {
                    let index = list.indexOf(this);
                    if (index !== -1) {
                        // remove image from the array once it's loaded
                        // for memory consumption reasons
                        list.splice(index, 1);
                    }
                }
                list.push(img);
                img.src = imgs[i];
            }
        }
    }
}

///

function update_photo(cam) {
    let hour_str = (cam.current_date.getHours() >= 10) ? cam.current_date.getHours() : ("0" + cam.current_date.getHours());
    let img_url = `${cam.base_url}${cam.current_date.getFullYear()}/${cam.current_date.getMonth() + 1}/${cam.current_date.getDate()}/${hour_str}.jpg`; // months are 0-indexed
    console.log("displaying image: " + img_url);
    cam.img_element.src = img_url;
    cam.date.innerText = cam.current_date; // date only changes when the photo changes
}

// 0x vs 0b???
const SET_HOUR = 0x0001;
const SET_DAY = 0x0010;
const SET_MONTH = 0x0100;
const SET_YEAR = 0x1000;
const SET_ALL = 0x1111;

// https://levelup.gitconnected.com/bit-masking-in-javascript-831eb26f04a3
// https://stackoverflow.com/questions/1959040/is-it-possible-to-send-a-variable-number-of-arguments-to-a-javascript-function
// --> (options, ...value) i w value dac po prostu offsety tych pol ktore chce update (np. hours i day - mniejszy indeks to krotszy okres)
function update_date(cam, options, ...values) {
    let old_date = new Date(cam.current_date);

    let i = 0;
    if (options & SET_HOUR) cam.current_date.setHours(values[i++]);
    if (options & SET_DAY) cam.current_date.setDate(values[i++]);
    if (options & SET_MONTH) cam.current_date.setMonths(values[i++]);
    if (options & SET_HOUR) cam.current_date.setFullYear(values[i]);

    console.log(values)
    console.log(cam.current_date.getHours())
    console.log(cam.current_date.getDate())
    console.log(cam.current_date.getMonth())
    console.log(cam.current_date.getFullYear())
    
    console.log("trying to set a new date: " + cam.current_date);
    if (cam.current_date >= init && cam.current_date <= today) {
        update_photo(cam);
        cam.info.innerText = "";
    } else {
        cam.current_date = old_date;
        cam.slider.value = (cam.current_date.getHours() >= 10) ? cam.current_date.getHours() : ("0" + cam.current_date.getHours());
        cam.info.innerText = "not available - cannot go past " + today + " or before " + init;
    }
    cam.hour_display.innerText = cam.slider.value;
}

//  sprawdzić czy te daty CET w ogóle działają! + po zmianie czasu!
// split into 2 files??? ale syf tu jest już
// to do:
// https://stackoverflow.com/questions/70983766/range-slider-avoid-moving-forward-when-reaching-a-value-specified-in-another-e
// to u góry zamiast ograniczania sztucznie slidera
// i może jeszcze sprawdzanie slidera w jego event listenerze zamiast w funkcji potem?
// po co zmieniac wartosc i potem z powrotem ja przywracac? lepiej w ogole nie zmienac chyab
// chyvba jednak nie, to bedzie neiwygodne, lepiej calosc na raz moze jednak

class Camera { // change name to gallery? + W SUMIE TE FUNKCJE UPDATE TEŻ DAĆ TUTAJ CHYBA XD?
    constructor(name) {
        this.name = name;
        this.base_url = `https://raw.githubusercontent.com/blato122/mont-blanc-cam/main/${this.name}/`;
        this.img_element = document.getElementById(this.name + '-photo');
        this.slider = document.getElementById(this.name + "-time-slider");
        this.hour_display = document.getElementById(this.name + "-hour");
        this.info = document.getElementById(this.name + "-info");
        this.date = document.getElementById(this.name + "-date");
        this.current_date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours());
        console.log("lalala")
        console.log(this.current_date);
    }

    init() {
        // https://stackoverflow.com/questions/39993676/code-inside-domcontentloaded-event-not-working
        // initialize: hour slider position, current hour text, info text as an empty string
        if (document.readyState !== 'loading') {
            console.log("document already ready")
            document.getElementById(this.name + "-time-slider").value = today.getHours();
            document.getElementById(this.name + "-hour").innerText = today.getHours();
            document.getElementById(this.name + "-info").innerText = "";
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                console.log("document was not ready: DOMContentLoaded")
                document.getElementById(this.name + "-time-slider").value = today.getHours();
                document.getElementById(this.name + "-hour").innerText = today.getHours();
                document.getElementById(this.name + "-info").innerText = "";
            });
        }
    }

    setup_misc() {
        this.img_element.addEventListener("error", () => {
            if (this.current_date <= today) {
                this.info.innerText = "not available yet - try again in a few minutes"; // nie powinno tego wypisywać, gdy jest siódma... a brakuje zdjęcia (ale będzie już ok od 29 marca)
            }
            console.log("img_element: error")
            this.img_element.src = 'image-not-found.png';
        });
        
        // update when slider value changes
        this.slider.addEventListener("input", () => {  // podać tutaj nazwę kamery!!!
            console.log("slider: input")
            update_date(this, SET_HOUR, Number(this.slider.value));
        });
    }

    setup_navigation() {
        let prev_day_button = document.getElementById(this.name + '-prev-day');
        let next_day_button = document.getElementById(this.name + '-next-day');
        let prev_month_button = document.getElementById(this.name + '-prev-month');
        let next_month_button = document.getElementById(this.name + '-next-month');
        let prev_year_button = document.getElementById(this.name + '-prev-year');
        let next_year_button = document.getElementById(this.name + '-next-year');
        let now_button = document.getElementById(this.name + '-now');
        
        now_button.addEventListener('click', () => {
            update_date(this, SET_ALL, today.getHours(), today.getDate(), today.getMonth(), today.getFullYear()); 
            this.slider.value = this.current_date.getHours();
            this.hour_display.innerText = this.slider.value;
            // today w sumie to nie now. no ale ktoś musiałby przez 1h siedzieć na tej stronie żeby było opóźnienie
        });
        
        prev_day_button.addEventListener('click', () => {
            update_date(this, SET_DAY, this.current_date.getDate() - 1); // zamist this to dac te funkcje do tej klasy!!!!!!! po prostu
        });
        
        next_day_button.addEventListener('click', () => {
            update_date(this, SET_DAY, this.current_date.getDate() + 1);
        });
        
        prev_month_button.addEventListener('click', () => {
            update_date(this, SET_MONTH, this.current_date.getMonth() - 1);
        });
        
        next_month_button.addEventListener('click', () => {
            update_date(this, SET_MONTH, this.current_date.getMonth() + 1);
        });
        
        prev_year_button.addEventListener('click', () => {
            update_date(this, SET_YEAR, this.current_date.getFullYear() - 1);
        });
        
        next_year_button.addEventListener('click', () => {
            update_date(this, SET_YEAR, this.current_date.getFullYear() + 1);
        });
    }

    all() {
        this.init();
        this.setup_misc();
        this.setup_navigation();
    }
}


// slownik ze zmiennymi gouter/tete?


// global!!!
const today = CET_CEST_now(); // current date, can't go past that (CET/CEST)
const init = new Date('27 March 2024 08:00:00 GMT+0100'); // date of starting the program, can't go earlier than that (CET)
// let gouter_current = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours());
// let tete_rousse_current = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours());
// let current = {
//     "gouter": new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours()),
//     "tete_rousse": new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours())
// }

let cams = {
    "gouter": new Camera("gouter"),
    "tete_rousse": new Camera("tete_rousse")
}


// name: gouter / tete_rousse
function webcam_setup(name) {
    // const base_url = `https://raw.githubusercontent.com/blato122/mont-blanc-cam/main/${name}/`; // or tete rousse!

    // cet/cest time check!
    if (today.getHours() == 6 || today.getHours() == 22) {
        return; // czy wyswiwtlic cos moze?
    }

    //preload photos

    // kurde chyba obiekt kamera zrobić i w nim mieć poniższe 5 zmiennych + current datę.. - ok
    let cam = cams[name];

    cam.all();
    
    // initial update
    update_photo(cam); // clean that up?
}

function main() {
    webcam_setup("gouter");
    webcam_setup("tete_rousse")
}

main(); // w sumie, co się dzieje jak się otworzy stronę o np. 23? które zdjęcie pokazuje?
// zdjęcia z danego dnia pobeirać do tablicy i z niej wystiwltac?