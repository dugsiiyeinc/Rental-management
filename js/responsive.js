document.querySelector('.menu-icon').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('active');
});
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
        sidebarLinks.forEach(item => item.classList.remove('active'));
        
        this.classList.add('active');
        
        
    });
});