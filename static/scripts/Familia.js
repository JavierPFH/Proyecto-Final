function filter(page = 1) {
    var IdFamilia = document.getElementById('IdFamilia').value;
    var Descripcion = document.getElementById('Descripcion').value;
    var tbody = document.getElementById('tableBody');
    var paginationDiv = document.getElementById('paginationDiv');
    var oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        paginationDiv.removeChild(oldPagination);
    }
    var loading = document.getElementById('loading');
    loading.style.display = 'flex';

    fetch(`/search_familia?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          IdFamilia: IdFamilia,
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
            tr.innerHTML = `
            
            <td>${row.IdFamilia}</td>
            <td>${row.Descripcion}</td>
            <td>${row.Servicio || ''}</td>
            <td>${row.CodTipo}</td>
            <td>
            <a href="#" title="Editar" onclick="editRow(${index})"><i class="fas fa-pencil-alt"></i></a>
            <a href="#" title="Excluir linha" onclick="deleterow(${index})"><i class="fas fa-trash-alt"></i></a>
            </td>
            `;
            tr.setAttribute("data-index", index);

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

function GuardarConfig() {
    
    var IdFamilia = document.getElementById("configIdFamilia").value;
    var Descripcion = document.getElementById("configDescripcion").value;
    var Servicio = document.getElementById("configIdServicio").value;
    var CodTipo = document.getElementById("configCodTipo").value;

    // Convertir campos vacíos a null
    IdFamilia = IdFamilia === '' ? null : IdFamilia;
    Descripcion = Descripcion === '' ? null : Descripcion;
    Servicio = Servicio === ''?null:Servicio;
    CodTipo=CodTipo===''?null:CodTipo;

    // LLama endpoint del servidor Python para Guardar y procesar el insert
    fetch("/insert_familia", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            IdFamilia: IdFamilia,
            Descripcion: Descripcion,
            Servicio: Servicio,
            CodTipo: CodTipo,
        }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Inforación salva con exito!");
                // Esconder popup de configuração
                hideConfig();  
                filter();              
                
            } else {
                alert("Error al guardar los dados.");
                
            }

        })
        .catch((error) => {
            console.error(error);
            alert("Error al guardar os dados.");
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
        var Servicio = row.querySelector('td:nth-child(3)').innerText;
        var CodTipo = row.querySelector('td:nth-child(4)').innerText;


        document.getElementById("editIdFamilia").value = IdFamilia;
        document.getElementById("editDescripcion").value = Descripcion;
        document.getElementById("editIdServicio").value = Servicio;
        document.getElementById("editCodTipo").value = CodTipo;

        document.getElementById("editIdFamilia").setAttribute("data-old-value", IdFamilia);
        document.getElementById("editDescripcion").setAttribute("data-old-value", Descripcion);
        document.getElementById("editIdServicio").setAttribute("data-old-value", Servicio);
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
    var oldIdFamilia = document.getElementById("editIdFamilia").getAttribute("data-old-value");
    var oldDescripcion = document.getElementById("editDescripcion").getAttribute("data-old-value");
    var oldServicio = document.getElementById("editIdServicio").getAttribute("data-old-value");
    var oldCodTipo = document.getElementById("editCodTipo").getAttribute("data-old-value");

    oldIdFamilia = oldIdFamilia === '' ? null : oldIdFamilia;
    oldDescripcion = oldDescripcion === '' ? null : oldDescripcion;
    oldServicio = oldServicio === '' ? null : oldServicio;
    oldCodTipo = oldCodTipo === '' ? null : oldCodTipo;

    var newIdFamilia = document.getElementById("editIdFamilia").value;
    var newDescripcion = document.getElementById("editDescripcion").value;
    var newServicio = document.getElementById("editIdServicio").value;
    var newCodTipo = document.getElementById("editCodTipo").value;

    newIdFamilia = newIdFamilia === '' ? null : newIdFamilia;
    newDescripcion = newDescripcion === '' ? null : newDescripcion;
    newServicio = newServicio === '' ? null : newServicio;
    newCodTipo = newCodTipo === '' ? null : newCodTipo;

    // Llamar al endpoint del servidor Python para actualizar y procesar los datos actualizados
    fetch("/update_familia", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
           
        body: JSON.stringify({
            oldIdFamilia: oldIdFamilia,
            oldDescripcion: oldDescripcion,
            oldServicio: oldServicio,
            oldCodTipo: oldCodTipo,
            
            newIdFamilia: newIdFamilia,
            newDescripcion: newDescripcion,
            newServicio: newServicio,
            newCodTipo: newCodTipo,

        }),

    })
        .then((response) => {
            if (response.status === 200) {
                alert("Actualizado con exito!");
                filter();
            } else {
                alert("Error al actualizar los dados.");
            }
            hideEdit();
        })
        .catch((error) => {
            console.error(error);
            alert("Se produció un erro de sistema.");
            hideEdit();
        });
}
function deleterow(index) {
    var row = document.querySelector(`#tableBody tr[data-index='${index}']`);
    var delIdFamilia = row.querySelector('td:nth-child(1)').innerText;
    var delDescripcion = row.querySelector('td:nth-child(2)').innerText;
    var delServicio = row.querySelector('td:nth-child(3)').innerText;
    var delCodTipo = row.querySelector('td:nth-child(4)').innerText;

    delIdFamilia = delIdFamilia === '' ? null : delIdFamilia;
    delDescripcion = delDescripcion === '' ? null : delDescripcion;
    delServicio = delServicio === '' ? null : delServicio;
    delCodTipo = delCodTipo === '' ? null : delCodTipo;

    if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
        fetch("/delete_familia", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                delIdFamilia: delIdFamilia,
                delDescripcion: delDescripcion,
                delServicio: delServicio,
                delCodTipo: delCodTipo,

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
