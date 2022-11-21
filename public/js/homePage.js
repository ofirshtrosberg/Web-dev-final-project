// ad 
const myModal = new bootstrap.Modal(document.getElementById('exampleModalCenter'))

if (!window.location.search.includes('afterLogin=true')) {
    myModal.toggle()

    document.getElementById('modal-close-button').onclick = () => {
        myModal.hide();
        // to hide the element below the footer caused by the modal
        document.querySelector('.modal-dialog-centered').style.display = 'none'
    }
}