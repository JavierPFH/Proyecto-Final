function filter(page = 1) {
    var CodCentro = document.getElementById('CodCentro').value;
    var IdPrestacion = document.getElementById('IdPrestacion').value;
    var tbody = document.getElementById('tableBody');
    var paginationDiv = document.getElementById('paginationDiv');
    var oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        paginationDiv.removeChild(oldPagination);
    }
    var loading = document.getElementById('loading');
    loading.style.display = 'flex';

    fetch(`/search_origenprestacion?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            CodCentro: CodCentro,
            IdPrestacion: IdPrestacion
        })
    })
        .then(response => response.json())
        .then(data => {
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            data.results.forEach((row, index) => {
                var tr = document.createElement('tr');
                tr.setAttribute('data-id', row.IdPrestacion);
                tr.innerHTML = `
                
                <td>${row.CodCentro}</td>
                <td>${row.IdAmbito}</td>
                <td>${row.IdServicio}</td>
                <td>${row.IdCatalogo}</td>
                <td>${row.IdPrestacion}</td>
                <td><a href="#" title="Editar" onclick="editRow(${index})"><i class="fas fa-pencil-alt"></i></a>
                <a href="#" title="Excluir linha" onclick="deleterow(${index})"><i class="fas fa-trash-alt"></i></a></td>
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

function GudarConfig() {
    var CodCentro = document.getElementById("configCodCentro").value;
    var IdAmbito = document.getElementById("configIdAmbito").value;
    var IdServicio = document.getElementById("configIdServicio").value;
    var IdCatalogo = document.getElementById("ConfigIdCatalogo").value;
    var IdPrestacion = document.getElementById("ConfigIdPrestacion").value;
   
    fetch("/insert_origenprestacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            CodCentro: CodCentro,
            IdAmbito: IdAmbito,
            IdServicio: IdServicio,
            IdCatalogo: IdCatalogo,
            IdPrestacion: IdPrestacion,
            
        }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Dados inseridos com sucesso!");
                filter();
            } else {
                alert("Erro ao inserir os dados.");
            }
            hideConfig();
        })
        .catch((error) => {
            console.error(error);
            alert("Erro ao inserir os dados.");
            console.log({ "IdFamilia": IdFamilia, "Descripcion": Descripcion, "Servicio": Servicio, "CodTipo": CodTipo });
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
        var CodCentro = row.querySelector('td:nth-child(1)').innerText;
        var IdAmbito = row.querySelector('td:nth-child(2)').innerText;
        var IdServicio = row.querySelector('td:nth-child(3)').innerText;
        var IdCatalogo = row.querySelector('td:nth-child(4)').innerText;
        var IdPrestacion = row.querySelector('td:nth-child(5)').innerText;
        
        document.getElementById("editCodCentro").value = CodCentro;
        document.getElementById("editIdAmbito").value = IdAmbito;
        document.getElementById("editServicio").value = IdServicio;
        document.getElementById("editIdCatalogo").value = IdCatalogo;
        document.getElementById("editIdPrestacion").value = IdPrestacion;
        
        document.getElementById("editCodCentro").setAttribute("data-old-value", CodCentro);
        document.getElementById("editIdAmbito").setAttribute("data-old-value", IdAmbito);
        document.getElementById("editServicio").setAttribute("data-old-value", IdServicio);
        document.getElementById("editIdCatalogo").setAttribute("data-old-value", IdCatalogo);
        document.getElementById("editIdPrestacion").setAttribute("data-old-value", IdPrestacion);
       
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
    var oldCodCentro = document.getElementById("editCodCentro").getAttribute("data-old-value");
    var oldIdAmbito = document.getElementById("editIdAmbito").getAttribute("data-old-value");
    var oldIdServicio = document.getElementById("editServicio").getAttribute("data-old-value");
    var oldIdCatalogo = document.getElementById("editIdCatalogo").getAttribute("data-old-value");
    var oldIdPrestacion = document.getElementById("editIdPrestacion").getAttribute("data-old-value");
   

    var newCodCentro = document.getElementById("editCodCentro").value;
    var newIdAmbito = document.getElementById("editIdAmbito").value;
    var newIdServicio = document.getElementById("editServicio").value;
    var newIdCatalogo = document.getElementById("editIdCatalogo").value;
    var newIdPrestacion = document.getElementById("editIdPrestacion").value;
  
    fetch("/update_origenprestacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            oldCodCentro: oldCodCentro,
            oldIdAmbito: oldIdAmbito,
            oldIdServicio: oldIdServicio,
            oldIdCatalogo: oldIdCatalogo,
            oldIdPrestacion: oldIdPrestacion,

            newCodCentro: newCodCentro,
            newIdAmbito: newIdAmbito,
            newIdServicio: newIdServicio,
            newIdCatalogo: newIdCatalogo,
            newIdPrestacion: newIdPrestacion,
           
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
    var delCodCentro = row.querySelector('td:nth-child(1)').innerText;
    var delIdAmbito = row.querySelector('td:nth-child(2)').innerText;
    var delIdServicio = row.querySelector('td:nth-child(3)').innerText;
    var delIdCatalogo = row.querySelector('td:nth-child(4)').innerText;
    var delIdPrestacion = row.querySelector('td:nth-child(5)').innerText;


    if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
        fetch("/delete_origenprestacion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                delCodCentro: delCodCentro,
                delIdAmbito: delIdAmbito,
                delIdServicio: delIdServicio,
                delIdCatalogo: delIdCatalogo,
                delIdPrestacion: delIdPrestacion,
            }),
        })
        .then((response) => {
            if (response.status === 200) {
                alert("Fila borrada con éxito!");
                filter()
            } else {
                alert("Erro al borrar la fila.");
            }
            hideEdit();
        });
    }
}
