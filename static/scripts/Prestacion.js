function filter(page = 1) {
    var idPrestacion = document.getElementById('idPrestacion').value;
    var Descripcion = document.getElementById('Descripcion').value;
    var tbody = document.getElementById('tableBody');
    var paginationDiv = document.getElementById('paginationDiv');
    var oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        paginationDiv.removeChild(oldPagination);
    }
    var loading = document.getElementById('loading');
    loading.style.display = 'flex';
    fetch(`/search_prestacion?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idPrestacion: idPrestacion,
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
                    <td>${row.IdCatalogo}</td>
                    <td>${row.IdPrestacion}</td>
                    <td>${row.IdFamilia}</td>
                    <td>${row.IdSubFamilia}</td>
                    <td>${row.Descripcion}</td>
                    <td>${row.UnidadMedida}</td>
                    <td>${row.Duracion}</td>
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
function saveConfig() {
    var IdCatalogo = document.getElementById("ConfigIdCatalogo").value;
    var IdPrestacion = document.getElementById("ConfigIdPrestacion").value;
    var IdFamilia = document.getElementById("configIdFamilia").value;
    var IdSubFamilia = document.getElementById("configIdSubFamilia").value;
    var Descripcion = document.getElementById("ConfigDescripcion").value;
    var UnidadMedida = document.getElementById("ConfigUnidadMedida").value;
    var Duracion = document.getElementById("ConfigDuracion").value;
  
    fetch("/insert_prestacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            IdCatalogo: IdCatalogo,
            IdPrestacion: IdPrestacion,
            IdFamilia: IdFamilia,
            IdSubFamilia: IdSubFamilia,
            Descripcion: Descripcion,
            UnidadMedida: UnidadMedida,
            Duracion: Duracion,
           

        }),
    })
        .then((response) => {
            if (response.status === 200) {
                console.log({ "IdCatalogo": IdCatalogo, "IdPrestacion": IdPrestacion, "IdFamilia": IdFamilia, "IdSubFamilia": IdSubFamilia,"Descripcion":Descripcion,"UnidadMedida":UnidadMedida,"Duracion":Duracion });
                alert("Dados inseridos com sucesso!");
            } else {
                alert("Erro ao inserir os dados.");
            }
            hideConfig();
        })
        .catch((error) => {
            console.error(error);
            alert("Erro ao inserir os dados.");
            console.log({ "IdCatalogo": IdCatalogo, "IdPrestacion": IdPrestacion, "IdFamilia": IdFamilia, "IdSubFamilia": IdSubFamilia,"Descripcion":Descripcion,"UnidadMedida":UnidadMedida,"Duracion":Duracion });
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
        var IdCatalogo = row.querySelector('td:nth-child(1)').innerText
        var IdPrestacion = row.querySelector('td:nth-child(2)').innerText;
        var IdFamilia = row.querySelector('td:nth-child(3)').innerText;
        var IdSubFamilia = row.querySelector('td:nth-child(4)').innerText;
        var Descripcion = row.querySelector('td:nth-child(5)').innerText;
        var UnidadMedida = row.querySelector('td:nth-child(6)').innerText;
        var Duracion = row.querySelector('td:nth-child(7)').innerText;

        document.getElementById("editIdCatalogo").value = IdCatalogo;
        document.getElementById("editIdPrestacion").value = IdPrestacion;
        document.getElementById("editIdFamilia").value = IdFamilia;
        document.getElementById("editIdSubFamilia").value = IdSubFamilia;
        document.getElementById("editDescripcion").value = Descripcion;
        document.getElementById("editUnidadMedida").value = UnidadMedida;
        document.getElementById("editDuracion").value = Duracion;
        
        document.getElementById("editIdCatalogo").setAttribute("data-old-value", IdCatalogo);
        document.getElementById("editIdPrestacion").setAttribute("data-old-value", IdPrestacion);
        document.getElementById("editIdFamilia").setAttribute("data-old-value", IdFamilia);
        document.getElementById("editIdSubFamilia").setAttribute("data-old-value", IdSubFamilia);
        document.getElementById("editDescripcion").setAttribute("data-old-value", Descripcion);
        document.getElementById("editUnidadMedida").setAttribute("data-old-value", UnidadMedida);
        document.getElementById("editDuracion").setAttribute("data-old-value", Duracion);

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
    var oldIdCatalogo = document.getElementById("editIdCatalogo").getAttribute("data-old-value");
    var oldIdPrestacion = document.getElementById("editIdPrestacion").getAttribute("data-old-value");
    var oldIdFamilia = document.getElementById("editIdFamilia").getAttribute("data-old-value");
    var oldIdSubFamilia = document.getElementById("editIdSubFamilia").getAttribute("data-old-value");
    var oldDescripcion = document.getElementById("editDescripcion").getAttribute("data-old-value");
    var oldUnidadMedida = document.getElementById("editUnidadMedida").getAttribute("data-old-value");
    var oldDuracion = document.getElementById("editDuracion").getAttribute("data-old-value");

    var newIdCatalogo = document.getElementById("editIdCatalogo").value;
    var newIdPrestacion = document.getElementById("editIdPrestacion").value;
    var newIdFamilia = document.getElementById("editIdFamilia").value;
    var newIdSubFamilia = document.getElementById("editIdSubFamilia").value;
    var newDescripcion = document.getElementById("editDescripcion").value;
    var newUnidadMedida= document.getElementById("editUnidadMedida").value;
    var newDuracion = document.getElementById("editDuracion").value;

    fetch("/update_prestacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            oldIdCatalogo: oldIdCatalogo,
            oldIdPrestacion: oldIdPrestacion,
            oldIdFamilia: oldIdFamilia,
            oldIdSubFamilia: oldIdSubFamilia,
            oldDescripcion: oldDescripcion,
            oldUnidadMedida: oldUnidadMedida,
            oldDuracion: oldDuracion,

            newIdCatalogo: newIdCatalogo,
            newIdPrestacion: newIdPrestacion,
            newIdFamilia: newIdFamilia,
            newIdSubFamilia: newIdSubFamilia,
            newDescripcion: newDescripcion,
            newUnidadMedida: newUnidadMedida,
            newDuracion: newDuracion

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
    var delCatalogo = row.querySelector('td:nth-child(1)').innerText;
    var delIdPrestacion = row.querySelector('td:nth-child(2)').innerText;
    var delIdFamilia = row.querySelector('td:nth-child(3)').innerText;
    var delIdSubFamilia = row.querySelector('td:nth-child(4)').innerText;
    var delDescripcion = row.querySelector('td:nth-child(5)').innerText;
    var delUnidadMedida = row.querySelector('td:nth-child(6)').innerText;
    var delDuracion = row.querySelector('td:nth-child(7)').innerText;

    if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
        fetch("/delete_prestacion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                delCatalogo: delCatalogo,
                delIdPrestacion: delIdPrestacion,
                delIdFamilia: delIdFamilia,
                delIdSubFamilia: delIdSubFamilia,
                delDescripcion: delDescripcion,
                delUnidadMedida: delUnidadMedida,
                delDuracion: delDuracion
              
            }),
        })
        console.log (delCatalogo,delIdPrestacion,delIdFamilia,delIdSubFamilia, delDescripcion, delUnidadMedida, delDuracion)
            .then((response) => {
                if (response.status === 200) {
                    alert("Fila borrada con éxito!");
                } else {
                    alert("Erro al borrar la fila.");
                    console.log (delPrestacion,delFamilia,delSubFamilia)
                }
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
  

$(document).ready(function() {
    $("form#configForm").on("submit", function(e) {
      e.preventDefault();
  
      var formData = new FormData(this);
  
      $.ajax({
        url: "/carga_prestacion",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function() {
          $("#loading").show();
        },
        success: function(response) {
          console.log(response);
          alert('Dados importados con exito!');
          hideImport();
        },
        error: function(error) {
          console.log("Error en carga los dados: " + error);
          alert('Error al importar los datos.Consulte el log.');
        },
        complete: function() {
          $("#loading").hide();
        }
      });
    });
  });

