// https://www.w3schools.com/js/js_loop_forof.asp
// https://www.w3schools.com/howto/howto_css_modal_images.asp

window.addEventListener('load', () => {
    // Get the modal
    let modal = document.getElementById("modal-full-img");
    // Get the <span> element that closes the modal - why not by id??
    let close_modal = document.getElementsByClassName("close-modal")[0];
    // Get the button that opens the modal
    let imgs = document.getElementsByClassName("modal-button");
    // Get the photo inside the modal
    let modal_img = document.getElementsByClassName("modal-content")[0];

    // When the user clicks a photo, open the modal 
    for (let img of imgs) {
        img.addEventListener('click', () => {
            modal.style.display = "block";
            modal_img.src = img.src;
            modal_img.alt = img.alt;
        });
    }

    // When the user clicks on <span> (x), close the modal
    close_modal.onclick = () => {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});