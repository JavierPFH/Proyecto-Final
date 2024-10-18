function filter(page = 1) {
    var Centro = document.getElementById('Centro').value;
    var CodLote = document.getElementById('CodLote').value;
    var tbody = document.getElementById('tableBody');
    var paginationDiv = document.getElementById('paginationDiv');
    var oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        paginationDiv.removeChild(oldPagination);
    }
    // Barra de carga
    var loading = document.getElementById('loading');
    loading.style.display = 'flex';

    fetch(`/search_lotes?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Centro: Centro,
            CodLote: CodLote
        })
    })
        .then(response => response.json())
        .then(data => {
            // clear de la tabla
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
           
            // rellena las rows con los datos de la tabla
            data.results.forEach((row, index) => {
            var fechaInicio = new Date(row.Fecha_inicio).toISOString().slice(0, 19).replace('T', ' ').concat(".0000000");

            var fechafin = new Date(row.Fecha_fin).toISOString().slice(0, 19).replace('T', ' ').concat(".0000000");

            var tr = document.createElement('tr');

            tr.innerHTML = `
            <td>${row.IdLote}</td>
            <td>${row.Centro}</td>
            <td>${row.CodLote}</td>
            <td>${fechaInicio}</td>
            <td>${fechafin}</td>
            <td>${row.Descripcion}</td>
            <td>${row.Servicio_Canario}</td>
            <td>${row.Servicio_Compania}</td>
            <td>
            <a href="#" title="Editar" onclick="editRow(${index})"><i class="fas fa-pencil-alt"></i></a>
            <a href="#" title="Borrar Linea" onclick="deleterow(${index})"><i class="fas fa-trash-alt"></i></a>
            </td>`;
            tr.setAttribute("data-index", index);
            tbody.appendChild(tr);
});
            // Agrega el menu desplegable
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
            // Oculta la barra de carga
            loading.style.display = 'none';
        })
        .catch(error => {
            console.error(error);
        });
        
}

filter();

// Popup de configuracion
function showConfig() {
    var popup = document.getElementById("configPopup");
    popup.style.display = "block";
}

// Oculta Popup de configuracion
function hideConfig() {
    var popup = document.getElementById("configPopup");
    popup.style.display = "none";
}

// Popup de edición
function showEdit() {
    var popup = document.getElementById("editPopup");
    popup.style.display = "block";
}

// Oculta Popup de edición
function hideEdit() {
    var popup = document.getElementById("editPopup");
    popup.style.display = "none";
}

// Guarda los datos proporcionados
function GuardarConfig() {
  // Obtiene los valores de los campos
  var IdLote = document.getElementById("configIdLote").value;
  var Centro = document.getElementById("configCentro").value;
  var CodLote = document.getElementById("configCodLote").value;
  var Fecha_inicio = document.getElementById("configFechaInicio").value;
  var Fecha_fin = document.getElementById("configFechaFin").value;
  var Descripcion = document.getElementById("configDescripcion").value;
  var ServicioCanario = document.getElementById("configServicioCanario").value;
  var ServicioCompañia = document.getElementById("configServicioCompañia").value;

  // LLama endpoint del servidor Python para Guardar y procesar el insert
  fetch("/insert_lote", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
        IdLote: IdLote,
        Centro: Centro,
        CodLote: CodLote,
        Fecha_inicio: new Date(Fecha_inicio).toISOString(),
        Fecha_fin: new Date(Fecha_fin).toISOString(),
        Descripcion: Descripcion,
        Servicio_Canario: ServicioCanario,
        Servicio_Compania: ServicioCompañia
        }),
  })
      .then((response) => {
          if (response.status === 200) {
              alert("Inforación guardada");
              // Esconder popup de configuracion
              hideConfig();  
              filter();              
              
          } else {
              alert("Error: Datos no guardados");
          }
      })
      .catch((error) => {
          console.error(error);
          alert("Excepción: Guardar datos");
          hideConfig();
      });
}

function editRow(index) {
    // Busca el id "tableBody"
    var row = document.querySelector(`#tableBody tr[data-index='${index}']`);

    // Comprueba la línea
    if (row) {
        // Recoge los campos de la tabla
        var IdLote = row.querySelector('td:nth-child(1)').innerText;
        var Centro = row.querySelector('td:nth-child(2)').innerText;
        var CodLote = row.querySelector('td:nth-child(3)').innerText;
        var Fecha_inicio = row.querySelector('td:nth-child(4)').innerText;
        var Fecha_fin = row.querySelector('td:nth-child(5)').innerText;
        var Descripcion = row.querySelector('td:nth-child(6)').innerText;
        var Servicio_Canario = row.querySelector('td:nth-child(7)').innerText;
        var Servicio_Compania = row.querySelector('td:nth-child(8)').innerText;
        
        // Completa los campos con los valores del Popup
        document.getElementById("editIdLote").value = IdLote;
        document.getElementById("editCentro").value = Centro;
        document.getElementById("editCodLote").value = CodLote;
        document.getElementById("editFechaInicio").value = Fecha_inicio;
        document.getElementById("editFechaFin").value = Fecha_fin;
        document.getElementById("editDescripcion").value = Descripcion;
        document.getElementById("editServicioCanario").value = Servicio_Canario;
        document.getElementById("editServicioCompañia").value = Servicio_Compania;


        // Almacena atributos de data-old-value
        document.getElementById("editIdLote").setAttribute("data-old-value", IdLote);
        document.getElementById("editCentro").setAttribute("data-old-value", Centro);
        document.getElementById("editCodLote").setAttribute("data-old-value", CodLote);
        document.getElementById("editFechaInicio").setAttribute("data-old-value", Fecha_inicio);
        document.getElementById("editFechaFin").setAttribute("data-old-value", Fecha_fin);
        document.getElementById("editDescripcion").setAttribute("data-old-value", Descripcion);
        document.getElementById("editServicioCanario").setAttribute("data-old-value", Servicio_Canario);
        document.getElementById("editServicioCompañia").setAttribute("data-old-value", Servicio_Compania);

        showEdit();
    } else {
        alert(`Línea con ID: ${index} no encontrada.`);
        return;
    }
}

// Actualiza el registro
function updateRow() {
    // Obteniene los valores de los campos
    var oldIdLote = document.getElementById("editIdLote").getAttribute("data-old-value");
    var oldCentro = document.getElementById("editCentro").getAttribute("data-old-value");
    var oldCodLote = document.getElementById("editCodLote").getAttribute("data-old-value");
    var oldFecha_inicio = document.getElementById("editFechaInicio").getAttribute("data-old-value");
    var oldFecha_fin = document.getElementById("editFechaFin").getAttribute("data-old-value");
    var oldDescripcion = document.getElementById("editDescripcion").getAttribute("data-old-value");
    var oldServicioCanario = document.getElementById("editServicioCanario").getAttribute("data-old-value");
    var oldServicioCompañia = document.getElementById("editServicioCompañia").getAttribute("data-old-value");

    var newIdLote = document.getElementById("editIdLote").value;
    var newCentro = document.getElementById("editCentro").value;
    var newCodLote = document.getElementById("editCodLote").value;
    var newFecha_inicio = document.getElementById("editFechaInicio").value;
    var newFecha_fin = document.getElementById("editFechaFin").value;
    var newDescripcion = document.getElementById("editDescripcion").value;
    var newServicioCanario = document.getElementById("editServicioCanario").value;
    var newServicioCompañia = document.getElementById("editServicioCompañia").value;

    
    // Llama al endpoint del servidor Python para actualizar y procesar los datos actualizados
    fetch("/update_lote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            oldIdLote: oldIdLote,
            oldCentro: oldCentro,
            oldCodLote: oldCodLote,
            oldFecha_inicio: oldFecha_inicio,
            oldFecha_fin: oldFecha_fin,
            oldDescripcion: oldDescripcion,
            oldServicioCanario: oldServicioCanario,
            oldServicioCompañia: oldServicioCompañia,

            newIdLote: newIdLote,
            newCentro: newCentro,
            newCodLote: new Date(newFecha_inicio).toISOString(),
            newFecha_fin: new Date(newFecha_fin).toISOString(),
            newDescripcion: newDescripcion,
            newServicioCanario: newServicioCanario,
            newServicioCompañia: newServicioCompañia
        }),

    })
        .then((response) => {
            if (response.status === 200) {
                alert("Inforación actualizada");
            } else {
                alert("Error: Datos no actualizaados");
            }
            hideEdit();
            filter();
        })
        .catch((error) => {
            console.error(error);
            alert("Excepción: Actualizar datos");
            hideEdit();

        });
}

// Elimina el registro
function deleterow(index) {
    var row = document.querySelector(`#tableBody tr[data-index='${index}']`);

    // Obteniene valores de los campos
    var delIdLote = row.querySelector('td:nth-child(1)').innerText;
    var delCentro = row.querySelector('td:nth-child(2)').innerText;
    var delCodLote = row.querySelector('td:nth-child(3)').innerText;
    var delFecha_inicio = row.querySelector('td:nth-child(4)').innerText;
    var delFecha_fin = row.querySelector('td:nth-child(5)').innerText;
    var delDescripcion = row.querySelector('td:nth-child(6)').innerText;
    var delServicioCanario = row.querySelector('td:nth-child(7)').innerText;
    var delServicioCompañia = row.querySelector('td:nth-child(8)').innerText;

    // Alert de confirmación
    if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
        // Llama al endpoint del servidor Python para actualizar y procesar los datos actualizados
        fetch("/delete_lote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                delIdLote:delIdLote,
                delCentro: delCentro,
                delCodLote: delCodLote,
                // delFecha_inicio: delFecha_inicio,
                // delFecha_fin: delFecha_fin,

                // delFecha_inicio: new Date(delFecha_inicio).toISOString(),
                // delFecha_fin: new Date(delFecha_fin).toISOString(),

                delDescripcion: delDescripcion,
                delServicioCanario: delServicioCanario,
                delServicioCompañia: delServicioCompañia
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    alert("Registro borrado");
                } else {
                    alert("Error: Fila no borrada");
                }
                hideEdit();
                filter();
            })
            .catch((error) => {
                console.error(error);
                alert("Excepción: Borrar datos");
                hideEdit();
            });
    }
}

// Muestra la ventana de importar Excel
function showImportPopup(){
    document.getElementById('importPopup').style.display = "block"
}

// Oculta la ventana de importar Excel
function hideImportPopup(){
    document.getElementById('importPopup').style.display = "none"
}

// Maneja la importacion de datos
$(document).ready(function() {
    $("form#configForm").on("submit", function(e) {
      e.preventDefault();
  
      var formData = new FormData(this);
  
      $.ajax({
        url: "/carga_lotes",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function() {
          $("#loading").show();
        },
        success: function(response) {
          // code 200
          console.log(response);
          alert('Dados importados con exito!');
          hideImport();
          // Actualizar la tabla
        },
        error: function(xhr, status, error) {
          // Error al importar
          console.log("Error en carga los dados: " + error);
          alert('Error al importar los datos.Consulte el log.');
          // Muestra el error
        },
        complete: function() {
          $("#loading").hide();
        }
      });
    });
  });