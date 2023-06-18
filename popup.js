document.addEventListener('DOMContentLoaded', function() {
    var checkbox = document.getElementById('switch');

    // Load the current state of the switch from storage and set the checkbox accordingly
    chrome.storage.sync.get('switchState', function(data) {
        checkbox.checked = data.switchState;
    });

    // Whenever the checkbox is toggled, save its new state to storage
    checkbox.addEventListener('change', function() {
        chrome.storage.sync.set({ switchState: this.checked });
    });
});
