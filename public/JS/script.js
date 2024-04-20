document.addEventListener('DOMContentLoaded', function() {
    var icon = document.getElementById('info-icon');
    var popup = document.getElementById('popup');
    icon.addEventListener('click', function(event) {
        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
        event.stopPropagation();
    });
    document.addEventListener('click', function() {
        popup.style.display = 'none';
    });
});
