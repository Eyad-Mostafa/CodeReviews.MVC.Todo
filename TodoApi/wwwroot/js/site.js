const uri = 'api/todoitems';
let todos = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');

    if (!addNameTextbox.value.trim()) {
        addNameTextbox.classList.add('is-invalid');
        addNameTextbox.focus();
        return;
    }
    addNameTextbox.classList.remove('is-invalid');

    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This item will be deleted permanently.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${uri}/${id}`, {
                method: 'DELETE'
            })
                .then(() => {
                    getItems();
                    Swal.fire(
                        'Deleted!',
                        'The item has been deleted.',
                        'success'
                    );
                })
                .catch(error => console.error('Unable to delete item.', error));
        }
    });
}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';

    Swal.fire({
        icon: 'info',
        title: 'Record not updated yet',
        text: 'Make your changes and click "Update" to save.',
        timer: 3000,
        showConfirmButton: false
    });
}
    
function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim()
    };

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => {
            getItems();
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'The to-do item has been updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        })
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isComplete;
        isCompleteCheckbox.classList.add('form-check-input', 'mx-2', 'checkbox-lg');
        if (item.isComplete) {
            isCompleteCheckbox.style.boxShadow = '0 0 8px 2px #28a745';
            isCompleteCheckbox.style.borderColor = '#28a745';
        } else {
            isCompleteCheckbox.style.boxShadow = '0 0 8px 2px #dc3545';
            isCompleteCheckbox.style.borderColor = '#dc3545';
        }
        isCompleteCheckbox.style.width = '1.5em';
        isCompleteCheckbox.style.height = '1.5em';

        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.classList.add('btn', 'btn-warning', 'btn-sm', 'me-2');
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);


        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });

    todos = data;
}