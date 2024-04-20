// move that somewhere else later!!!
// https://www.w3schools.com/w3css/w3css_tabulators.asp
function switch_tab(event, tab) {
    let tabs = document.getElementsByClassName("tab");
    let tablinks = document.getElementsByClassName("tab-select");

    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tab).style.display = "block";
    event.currentTarget.className += " active";
}

const HISTORY_URL = 'https://blato122.github.io/history.html';

function history_handler() {
    // jakos obslugiwac to, jak sie nie wybierze nic!!!!!!! (?)
    let start_date_picker = document.getElementById('start-date-picker');
    let end_date_picker = document.getElementById('end-date-picker');
    let start_date = new Date(start_date_picker.value);
    let end_date = new Date(end_date_picker.value);

    let hour_picker = document.getElementById('hour-picker');

    if (hour_picker.value < 7 || hour_picker.value > 21) {
        return; // bad practice??!?!?!?! early return
    }

    start_date.setHours(hour_picker.value);
    end_date.setHours(hour_picker.value);

    let list = document.getElementById("dropdown-camera-list"); 
    let camera = list.options[list.selectedIndex].value; // not .text
    console.log(camera);

    if (camera != "none") {
        display_history(camera, start_date, end_date);
    }

    // let gouter_picker = document.getElementById('gouter-picker');
    // let tete_rousse_picker = document.getElementById('tete_rousse-picker');

    // let checked = [];
    // if (tete_rousse_picker.checked) {
    //     checked.push(tete_rousse_picker.value);
    // } 
    // if (gouter_picker.checked) {
    //     checked.push(gouter_picker.value);
    // }

    // for (var i = 0; i < checked.length; ++i) {
    //     display_history(checked[i], start_date, end_date);
    // }
}

// default zakres ustawić na 60 dni np! i default godzina jako ta current
function display_history(cam, start_date, end_date) { // end - późniejsza data, start - wcześniejsza data, ale idziemy od końca
    elements = []
    let current_date = new Date(end_date);
    while (current_date >= start_date) { // if the start date is less than end date, won't even start
        console.log("current date: " + current_date);

        current_date.setDate(current_date.getDate() - 1);
        
        // define outside? but init with what?
        let hour_str = (current_date.getHours() >= 10) ? current_date.getHours() : ("0" + current_date.getHours());
        let img_url = `${cams[cam].base_url}${current_date.getFullYear()}/${current_date.getMonth() + 1}/${current_date.getDate()}/${hour_str}.jpg`; // months are 0-indexed

        elements.push({
            "url": img_url,
            "date": current_date.toLocaleString() // so that is takes up less space and is more readable
        });
    }

    let history = window.open(HISTORY_URL);

    history.onload = () => {
        let photo_grid = history.document.getElementById('photo_grid');

        console.log(this.elements);
        const ROW_LEN = 3;
        let n_elements = this.elements.length;
        let cols = (n_elements < ROW_LEN) ? n_elements : ROW_LEN;
        let rows = Math.ceil(n_elements / cols);

        // create a photo grid
        for (let i = 0; i < rows; ++i) {
            let row = history.document.createElement('div');
            row.classList.add('row');
        
            for (let j = 0; j < cols; j++) {
                let col = history.document.createElement('div');
                col.classList.add('col');
        
                let idx = i * cols + j;
                if (idx < n_elements) { // so that we don't try to access some other stuff when there are less than `cols` elements in the last row
                    let img = history.document.createElement('img');
                    img.src = this.elements[idx]["url"];

                    img.addEventListener("error", () => {
                        console.log("history img: error")
                        img.src = '../image-not-found.png'; // RELATIVE PATH!!! change that to absoulte or sth???s
                    });

                    let date = history.document.createElement('div'); // czy 'p'??
                    date.innerText = this.elements[idx]["date"];

                    col.appendChild(img);
                    col.appendChild(date);
                }
        
                row.appendChild(col);
            }
        
            photo_grid.appendChild(row);
        }
    };
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

// dok to :) poniżej
// dodać full photo on click! i tu i w history

// zawiera wszystkie zdjęcia z danego dnia
// tylko offset o 7 trzeba, no bo zdjęcie z 7 godziny jest na indeksie 0
// chyba że słownik znowu
let preloaded_images_day = {}

function preload_images() {
    // wyczyścić tablicę przed rozpoczęciem?
    // https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript

    for (let cam_name in cams) {
        let cam = cams[cam_name]
        console.log(cam.name);
        // Check if preloaded_images_day[cam] is undefined, and initialize it if it is
        if (!preloaded_images_day[cam]) { // auto conversion from a Camera object to a string via toString() method
            preloaded_images_day[cam] = [];
        }

        let url_no_hour = `${cam.base_url}${cam.current_date.getFullYear()}/${cam.current_date.getMonth() + 1}/${cam.current_date.getDate()}/REPLACE-WITH-HOUR-STR.jpg`;
        preloaded_images_day[cam].length = 0; // xd
        for (let i = 7; i <= 21; i++) {
            let hour_str = (i >= 10) ? i : ("0" + i);
            let img = new Image();
            // whaat lol
            // ten listener już jest - ALE WTEDY nie ma adresu od razu tego not found tylko dopiero po wystapieniu erroru potem
            // i przez to trzeba ladowac foto zle i dopiero potem error i jest wolniej czy cos
            img.onerror = () => {
                img.src = 'image-not-found.png'; 
            };
            img.src = url_no_hour.replace("REPLACE-WITH-HOUR-STR", hour_str); //? + // ten string do replace dać do jakiegoś consta może?!?!!!!!
            preloaded_images_day[cam].push(img); // src czy url czy co
        }
    }
    console.log(preloaded_images_day);
}

function update_photo(cam) {
    // let hour_str = (cam.current_date.getHours() >= 10) ? cam.current_date.getHours() : ("0" + cam.current_date.getHours());
    // let img_url = `${cam.base_url}${cam.current_date.getFullYear()}/${cam.current_date.getMonth() + 1}/${cam.current_date.getDate()}/${hour_str}.jpg`; // months are 0-indexed
    let hour = cam.current_date.getHours();
    let img_url = preloaded_images_day[cam][hour-7].src; // 7.00 to indeks 0
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

    // console.log(cam.current_date.getHours())
    // console.log(cam.current_date.getDate())
    // console.log(cam.current_date.getMonth())
    // console.log(cam.current_date.getFullYear())

    let i = 0;
    if (options & SET_HOUR) cam.current_date.setHours(values[i++]);
    if (options & SET_DAY) cam.current_date.setDate(values[i++]);
    if (options & SET_MONTH) cam.current_date.setMonth(values[i++]);
    if (options & SET_YEAR) cam.current_date.setFullYear(values[i]);

    if (options & SET_DAY || options & SET_MONTH || options & SET_YEAR) {
        preload_images();
    }

    // console.log(values)
    // console.log(cam.current_date.getHours())
    // console.log(cam.current_date.getDate())
    // console.log(cam.current_date.getMonth())
    // console.log(cam.current_date.getFullYear())
    
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

// albo w ogóle w github actions wyłączyć pobieranie dla czasu zimowego!
//  sprawdzić czy te daty CET w ogóle działają! + po zmianie czasu!

// split into 2 files??? ale syf tu jest już

class Camera { // change name to gallery? + W SUMIE TE FUNKCJE UPDATE TEŻ DAĆ TUTAJ CHYBA?
    constructor(name) {
        this.name = name;
        this.base_url = `https://raw.githubusercontent.com/blato122/mont-blanc-cam/main/${this.name}/`;
        this.img_element = document.getElementById(this.name + '-photo');
        this.slider = document.getElementById(this.name + "-time-slider");
        this.hour_display = document.getElementById(this.name + "-hour");
        this.info = document.getElementById(this.name + "-info");
        this.date = document.getElementById(this.name + "-date");
        this.current_date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours());
    }

    // so that Camera objects can be used as dictionary keys
    toString() {
        return this.name;
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
        // this.img_element.addEventListener("change", () => {
        //     let today_cropped = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), 0, 0, 0);
        //     if (this.current_date.getTime() === today_cropped.getTime()) {
        //         this.info.innerText = "not available yet - try again in a few minutes";
        //         // i slider na poprzednią godzinę
        //     }
        //     // console.log("img_element: error")
        //     // if (this.img_element.src != 'image-not-found.png') {
        //     //     this.img_element.src = 'image-not-found.png'; // ok fine
        //     // }
        // });
        
        // update when slider value changes
        this.slider.addEventListener("input", () => {  // podać tutaj nazwę kamery!!!
            console.log("slider: input")
            update_date(this, SET_HOUR, Number(this.slider.value));
            
            let today_cropped = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), 0, 0, 0);
            if (this.img_element.src == 'https://blato122.github.io/image-not-found.png' && (this.current_date.getTime() === today_cropped.getTime())) {
                this.info.innerText = "not available yet - try again in a few minutes";
            }
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
    "gouter_old": new Camera("gouter_old"),
    "tete_rousse": new Camera("tete_rousse")
}


// name: gouter / tete_rousse
function webcam_setup(name) {
    // const base_url = `https://raw.githubusercontent.com/blato122/mont-blanc-cam/main/${name}/`; // or tete rousse!

    // cet/cest time check!
    if (today.getHours() < 6) { // < i > raczej... jak już
        // return; // czy wyswiwtlic cos moze?
        today.setDate(today.getDate() - 1);
        today.setHours(21);
    } else if (today.getHours() > 21) {
        today.setHours(21);
    }

    //preload photos

    let cam = cams[name];
    cam.all();
    
    // initial update
    // update_photo(cam); // clean that up?
    update_date(cam, SET_ALL, today.getHours(), today.getDate(), today.getMonth(), today.getFullYear()); //?
}

function main() {
    webcam_setup("gouter");
    webcam_setup("gouter_old");
    webcam_setup("tete_rousse");
}

main(); // w sumie, co się dzieje jak się otworzy stronę o np. 23? które zdjęcie pokazuje?
