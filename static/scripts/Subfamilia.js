function filter(page = 1) {
    var IdSubFamilia = document.getElementById('IdSubFamilia').value;
    var Descripcion = document.getElementById('Descripcion').value;
    var tbody = document.getElementById('tableBody');
    var paginationDiv = document.getElementById('paginationDiv');
    var oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        paginationDiv.removeChild(oldPagination);
    }
    var loading = document.getElementById('loading');
    loading.style.display = 'flex';

    fetch(`/search_subfamilia?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            IdSubFamilia: IdSubFamilia,
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
                tr.setAttribute('data-id', row.IdSubFamilia);
                tr.setAttribute('data-d', row.Descripcion);
                tr.setAttribute('data-f', row.IdFamilia);
                tr.setAttribute('data-s', row.Servicio);
                tr.innerHTML = `
                    <td>${row.IdSubFamilia}</td>
                    <td>${row.Descripcion}</td>
                    <td>${row.IdFamilia}</td>
                    <td>${row.Servicio}</td>
            
                    <td><a href="#" title="Editar" onclick="editRow(${index})"><i class="fas fa-pencil-alt"></i></a>
                    <a href="#" title="Excluir linha" onclick="deleterow(${index})"><i class="fas fa-trash-alt"></i></a></td>
           
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

function GudarConfig() {
    var IdSubFamilia = document.getElementById("configIdSubFamilia").value;
    var Descripcion = document.getElementById("configDescripcion").value;
    var IdFamilia = document.getElementById("configIdFamilia").value;
    var Servicio = document.getElementById("configIdServicio").value;
    
    fetch("/insert_subfamilia", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            IdSubFamilia: IdSubFamilia,
            Descripcion: Descripcion,
            IdFamilia: IdFamilia,
            Servicio: Servicio,
            
           
        }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Dados inseridos com sucesso!");
            } else {
                throw new Error("Erro ao inserir os dados. " );
            }
            hideConfig();
        })
        .catch((error) => {
            console.error(error);
            alert("Erro ao inserir os dados." + error.message);
            console.log({ "IdSubFamilia": IdSubFamilia, "Descripcion": Descripcion, "IdFamilia": IdFamilia, "configIdServicio": Servicio});
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
        var IdSubFamilia = row.querySelector('td:nth-child(1)').innerText;
        var Descripcion = row.querySelector('td:nth-child(2)').innerText;
        var IdFamilia = row.querySelector('td:nth-child(3)').innerText;
        var Servicio = row.querySelector('td:nth-child(4)').innerText;
        
        document.getElementById("editIdSubFamilia").value = IdSubFamilia;
        document.getElementById("editDescripcion").value = Descripcion;
        document.getElementById("editIdFamilia").value = IdFamilia;
        document.getElementById("editIdServicio").value = Servicio;
        
        document.getElementById("editIdSubFamilia").setAttribute("data-old-value", IdSubFamilia);
        document.getElementById("editDescripcion").setAttribute("data-old-value", Descripcion);
        document.getElementById("editIdFamilia").setAttribute("data-old-value", IdFamilia);
        document.getElementById("editIdServicio").setAttribute("data-old-value", Servicio);
        
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
    var oldIdSubFamilia = document.getElementById("editIdSubFamilia").getAttribute("data-old-value");
    var oldDescripcion = document.getElementById("editDescripcion").getAttribute("data-old-value");
    var oldIdFamilia = document.getElementById("editIdFamilia").getAttribute("data-old-value");
    var oldServicio = document.getElementById("editIdServicio").getAttribute("data-old-value");
    


    var newIdSubFamilia = document.getElementById("editIdSubFamilia").value;
    var newDescripcion = document.getElementById("editDescripcion").value;
    var newIdFamilia = document.getElementById("editIdFamilia").value;
    var newServicio = document.getElementById("editIdServicio").value;
    console.log(oldServicio,newServicio)
  
    fetch("/update_subfamilia", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            oldIdSubFamilia: oldIdSubFamilia,
            oldDescripcion: oldDescripcion,
            oldIdFamilia: oldIdFamilia,
            oldServicio: oldServicio,
            
            newIdSubFamilia: newIdSubFamilia,
            newDescripcion: newDescripcion,
            newIdFamilia: newIdFamilia,
            newServicio: newServicio,
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
    var delIdSubFamilia = row.querySelector('td:nth-child(1)').innerText;
    var delDescripcion = row.querySelector('td:nth-child(2)').innerText;
    var delIdFamilia = row.querySelector('td:nth-child(3)').innerText;
    var delServicio = row.querySelector('td:nth-child(4)').innerText;
    
    if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
        fetch("/delete_subfamilia", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                delIdSubFamilia: delIdSubFamilia,
                delDescripcion: delDescripcion,
                delIdFamilia: delIdFamilia,
                delServicio: delServicio,
                
                
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    alert("Fila borrada con éxito!");
                    filter();
                } else {
                    alert("Erro al borrar la fila.");
                }
                hideEdit();
            });
    }
}


