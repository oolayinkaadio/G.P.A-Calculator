const yesBtn = document.querySelector('.yes');
const noBtn = document.querySelector('.no');

window.onload = () => {
    // modal.classList.toggle('hidden');
    yesBtn.addEventListener('click', (e) => {
        window.location.replace('./polytechnic-gpa.html')
    })
    noBtn.addEventListener('click', (e) => {
        window.location.replace('./university-gpa.html')
        
    })
}