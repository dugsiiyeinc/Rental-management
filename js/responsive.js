document.querySelector('.menu-icon').addEventListener('click', function() { 
    document.querySelector('.sidebar').classList.toggle('active');
});

const links = document.querySelectorAll('.sidebar-menu ul li a');


const activeLink = localStorage.getItem('activeLink');
if (activeLink) {
    
    links.forEach(link => link.classList.remove('active'));

    
    links.forEach(link => {
        if (link.href === activeLink) {
            link.classList.add('active');
        }
    });
}

links.forEach(link => {
    link.addEventListener('click', function() {
       
        links.forEach(l => l.classList.remove('active'));

        this.classList.add('active');

        localStorage.setItem('activeLink', this.href);
    });
});

