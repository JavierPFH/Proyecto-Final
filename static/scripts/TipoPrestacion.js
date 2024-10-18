function filter(page = 1) {
    var Codigo = document.getElementById('Codigo').value;
    var Descripcion = document.getElementById('Descripcion').value;
    var tbody = document.getElementById('tableBody');
    var paginationDiv = document.getElementById('paginationDiv');
    var oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        paginationDiv.removeChild(oldPagination);
    }
    var loading = document.getElementById('loading');
    loading.style.display = 'flex';

    fetch(`/search_tipoprestacion?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Codigo: Codigo,
            Descripcion: Descripcion
        })
    })
        .then(response => response.json())
        .then(data => {
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            data.results.forEach((row, index) => {
                var tr = document.createElement('tr');
                tr.setAttribute("data-index", index);
                tr.setAttribute('data-id', row.IdFamilia);
                tr.innerHTML = `
                    <td>${row.Codigo}</td>
                    <td>${row.Descripcion}</td>
                `;
                tbody.appendChild(tr);
                console.log(row);

            });
            var paginationDiv = document.getElementById('paginationDiv');
            if (paginationDiv.firstChild) {
                paginationDiv.removeChild(paginationDiv.firstChild);
            }

            if (data.num_pages > 1) {
                var pagination = document.createElement('select');
                pagination.id = 'pagination';
                for (var i = 1; i <= data.num_pages; i++) {
                    var option = document.createElement('option');
                    option.value = i;
                    option.text = `Pagina ${i}`;
                    if (i == data.page) {
                        option.selected = true;
                    }
                    pagination.appendChild(option);
                }
                pagination.addEventListener('change', event => {
                    filter(event.target.value);
                });
                paginationDiv.appendChild(pagination);
            }
            loading.style.display = 'none';
        })
        .catch(error => {
            console.error(error);
        });
}

filter();

function showConfig() {
    var popup = document.getElementById("configPopup");
    popup.style.display = "block";
}

function hideConfig() {
    var popup = document.getElementById("configPopup");
    popup.style.display = "none";
}

 Guardar
function GudarConfig() {
    var Codigo = document.getElementById("configCodigo").value;
    var Descripcion = document.getElementById("configDescripcion").value;

    fetch("/insert_tipoprestacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Codigo: Codigo,
            Descripcion: Descripcion,

        }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Dados inseridos com sucesso!");
            } else {
                alert("Erro ao inserir os dados.");
            }
            hideConfig();
        })
        .catch((error) => {
            console.error(error);
            alert("Erro ao inserir os dados.");
            console.log({ "Codigo": Codigo, "Descripcion": Descripcion });
            hideConfig();
        });
}

function showEdit() {
    var popup = document.getElementById("editPopup");
    popup.style.display = "block";
}

function editRow(index) {
    var row = document.querySelector(`#tableBody tr[data-index='${index}']`);

    if (row) {
        var Codigo = row.querySelector('td:nth-child(1)').innerText;
        var Descripcion = row.querySelector('td:nth-child(2)').innerText;

        document.getElementById("editCodigo").value = Codigo;
        document.getElementById("editDescripcion").value = Descripcion;

        document.getElementById("editCodigo").setAttribute("data-old-value", Codigo);
        document.getElementById("editDescripcion").setAttribute("data-old-value", Descripcion);

        showEdit();
    } else {
        alert(`Linha com ID ${index} não encontrada.`);
        console.error(`Linha com ID ${index} não encontrada.`);
        return;
    }
}

function hideEdit() {
    var popup = document.getElementById("editPopup");
    popup.style.display = "none";
}


function updateRow() {
    var oldCodigo = document.getElementById("editCodigo").getAttribute("data-old-value");
    var oldDescripcion = document.getElementById("editDescripcion").getAttribute("data-old-value");

    var newCodigo = document.getElementById("editCodigo").value;
    var newDescripcion = document.getElementById("editDescripcion").value;

    fetch("/update_tipoprestacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            oldCodigo: oldCodigo,
            oldDescripcion: oldDescripcion,
            newCodigo: newCodigo,
            newDescripcion: newDescripcion,

           
        }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Dados atualizados com sucesso!");
            } else {
                alert("Erro ao atualizar os dados.");
            }
            hideEdit();
        });
}
function deleterow(index) {
    var row = document.querySelector(`#tableBody tr[data-index='${index}']`);
    var delCodigo = row.querySelector('td:nth-child(1)').innerText;
    var delDescripcion = row.querySelector('td:nth-child(2)').innerText;

    if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
            fetch("/delete_tipoprestacion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                delCodigo: delCodigo,
                delDescripcion: delDescripcion,
           
            }),
        })
        .then((response) => {
            if (response.status === 200) {
                alert("Fila borrada con éxito!");
            } else {
                alert("Erro al borrar la fila.");
            }
            hideEdit();
        });
    }
}
