document.querySelectorAll('.size-button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.size-button').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});
