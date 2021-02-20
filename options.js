function save_options() {
    var gradient = document.getElementById('gradient').value;
    chrome.storage.sync.set({
        gradient: gradient,
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        gradient: 'default'
    }, function (items) {
        document.getElementById('gradient').value = items.gradient;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);