function filter(page = 1) {
    var IdGarante = document.getElementById('IdGarante').value;
    var Descripcion = document.getElementById('Descripcion').value;
    var tbody = document.getElementById('tableBody');
    var paginationDiv = document.getElementById('paginationDiv');
    var oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        paginationDiv.removeChild(oldPagination);
    }
    var loading = document.getElementById('loading');
    loading.style.display = 'flex';
    fetch(`/search_garante?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            IdGarante: IdGarante,
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
                tr.innerHTML = `
                    <td>${row.IdGarante}</td>
                    <td>${row.Descripcion}</td>
                    <td>${row.NIFCIF}</td>
                   
                    <td>
                        <a href="#" title="Editar" onclick="editRow(${index})"><i class="fas fa-pencil-alt"></i></a>
                        <a href="#" title="Excluir linha" onclick="deleterow(${index})"><i class="fas fa-trash-alt"></i></a>
                    </td>
                `;
                tbody.appendChild(tr);
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
                    option.text = `Página ${i}`;
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
function GuardarConfig() {
    var IdGarante = document.getElementById("configIdGarante").value;
    var Descripcion = document.getElementById("configDescripcion").value;
    var Nifcif = document.getElementById("confignifcif").value;
    Nifcif = Nifcif === '' ? '' : Nifcif;
  
    fetch("/insert_garante", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            IdGarante: IdGarante,
            Descripcion: Descripcion,
            Nifcif: Nifcif,
            
           

        }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Dados inseridos com sucesso!");
            } else {
                alert("Erro ao inserir os dados.");
            }
            hideConfig();
            filter();
        })
        .catch((error) => {
            console.error(error);
            alert("Erro ao inserir os dados.");
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
     
        var IdFamilia = row.querySelector('td:nth-child(1)').innerText;
        var Descripcion = row.querySelector('td:nth-child(2)').innerText;
        var NIFCIF = row.querySelector('td:nth-child(3)').innerText;
       
        document.getElementById("editIdGarante").value = IdFamilia;
        document.getElementById("editDescripcion").value = Descripcion;
        document.getElementById("editnifcif").value = NIFCIF;
        document.getElementById("editCodTipo").value = CodTipo;

        document.getElementById("editIdGarante").setAttribute("data-old-value", IdFamilia);
        document.getElementById("editDescripcion").setAttribute("data-old-value", Descripcion);
        document.getElementById("editnifcif").setAttribute("data-old-value", NIFCIF);
        document.getElementById("editCodTipo").setAttribute("data-old-value", CodTipo);

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
    var oldIdGarante = document.getElementById("editIdGarante").getAttribute("data-old-value");
    var oldDescripcion = document.getElementById("editDescripcion").getAttribute("data-old-value");
    var oldNIFCIF = document.getElementById("editnifcif").getAttribute("data-old-value");
    var newIdGarante = document.getElementById("editIdGarante").value;
    var newDescripcion = document.getElementById("editDescripcion").value;
    var newNIFCIF = document.getElementById("editnifcif").value;

    oldNIFCIF = oldNIFCIF === '' ? ' ' : oldNIFCIF;
    newNIFCIF = newNIFCIF === '' ? ' ' : newNIFCIF;

    fetch("/update_garante", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            oldIdGarante: oldIdGarante,
            oldDescripcion: oldDescripcion,
            oldNIFCIF: oldNIFCIF,
            newIdGarante: newIdGarante,
            newDescripcion: newDescripcion,
            newNIFCIF: newNIFCIF,

        }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Dados atualizados com sucesso!");
                filter();
            } else {
                alert("Erro ao atualizar os dados.");
            }
            hideEdit();
        });
}
function deleterow(index) {
    var row = document.querySelector(`#tableBody tr[data-index='${index}']`);
    var delIdGarante = row.querySelector('td:nth-child(1)').innerText;
    var delDescripcion = row.querySelector('td:nth-child(2)').innerText;
    var delNifCif = row.querySelector('td:nth-child(3)').innerText;
    delNifCif = delNifCif === '' ? ' ' : delNifCif;

    if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
        fetch("/delete_garante", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                delIdGarante: delIdGarante,
                delDescripcion: delDescripcion,
                delNifCif: delNifCif,
              
            }),
        })
         console.log (delIdGarante,delDescripcion,delNifCif)
            .then((response) => {
                if (response.status === 200) {
                    alert("Fila borrada con éxito!");
                } else {
                    alert("Erro al borrar la fila.");
                    console.log (delIdGarante,delDescripcion,delNifCif)
                }
                hideEdit();
                filter();
            })
            .catch((error) => {
                console.error(error);
                alert("Excepcion: Borrar Datos");
                hideEdit();
            });
    }
}

function showImportPopup() {
    document.getElementById("importPopup").style.display = "block";
  }
  
  function hideImport() {
    document.getElementById("importPopup").style.display = "none";
  }