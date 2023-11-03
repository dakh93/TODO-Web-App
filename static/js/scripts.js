window.addEventListener('DOMContentLoaded', () => {
    let scrollPos = 0;
    const mainNav = document.getElementById('mainNav');
    const headerHeight = mainNav.clientHeight;
    window.addEventListener('scroll', function() {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if ( currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
            } else {
                mainNav.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            // Scrolling Down
            mainNav.classList.remove(['is-visible']);
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });

})
    // JavaScript function to toggle the button state and text
    function toggleState(id) {
        var button = document.getElementById("toggleButton" + id);


        var state = 1
        if (button.innerHTML.trim() === "In Progress") {
            button.innerHTML = "Done";
            button.style.backgroundColor = "#383838"
            state = 0
        } else {
            button.style.backgroundColor = "#198754"
            button.innerHTML = "In Progress";
            state = 1
        }

        // Send an AJAX request to save the updated button state
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/save_data', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                console.log(response.message);
            }
        };

        xhr.send(JSON.stringify({ 'buttonState': state, 'id':id }));

    }



document.getElementById("addTask").addEventListener("click", function() {
            var inputField = document.getElementById("inputDescription")
            var content = inputField.value;

            // Make an AJAX request to add a new row to the database
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/add_task', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    var table = document.getElementById("tasksTable");
                    var rowIndex = table.rows.length;
                    var newRow = '<tr><td>' + response.description + ' <a class="btn btn-success text-uppercase btn-lg" id="toggleButton' + rowIndex + '" onclick="toggleState('+rowIndex+')" >In Progress</a></td></tr> ';
                    table.insertAdjacentHTML('beforeend', newRow);

                      // Empty the input field after adding the row
                      inputField.value = '';
                }
            };
            xhr.send('content=' + content);
        });