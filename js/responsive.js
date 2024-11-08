document.querySelector('.menu-icon').addEventListener('click', function() { 
    document.querySelector('.sidebar').classList.toggle('active');
});

// Hel dhammaan anchor tags-ka gudaha sidebar-menu
const links = document.querySelectorAll('.sidebar-menu ul li a');

// Dib u soo celi `active` class-ka marka boggu dib u shido
const activeLink = localStorage.getItem('activeLink');
if (activeLink) {
    // Ka saar `active` class-ka dhammaan links
    links.forEach(link => link.classList.remove('active'));

    // Ka hel link-iga ee URL-ku uu la siman yahay midka keydsan
    links.forEach(link => {
        if (link.href === activeLink) {
            link.classList.add('active');
        }
    });
}

// Add event listener for each link
links.forEach(link => {
    link.addEventListener('click', function() {
        // Ka saar `active` class-ka dhammaan links, oo ay ku jirto midka dashboard-ka
        links.forEach(l => l.classList.remove('active'));

        // Ku dar `active` class-ka link-iga la gujiyay
        this.classList.add('active');

        // Kaydi URL-ka link-iga ee la gujiyay
        localStorage.setItem('activeLink', this.href);
    });
});

