    // Mostrar Popup de configuracion
    function showConfig() {
        var popup = document.getElementById("configPopup");
        popup.style.display = "block";
    }

    // Oculta popup de configuracion
    function hideConfig() {
        var popup = document.getElementById("configPopup");
        popup.style.display = "none";
    }

    function saveConfig() {
        var server = document.getElementById("server").value;
        var database = document.getElementById("database").value;
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
    
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/save_config", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
    
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Si es un 200 reinicia la app
                restartApp();
                hideConfig();
            }
        };
    
        xhr.send(JSON.stringify({"server": server, "database": database, "username": username, "password": password}));
    }
    
    function restartApp() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/restart", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
    
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 500) {
                location.reload();
            }
        };
    
        xhr.send();
    }

    // Testea la conneccion nueva
    function testConnection() {
         var server = document.getElementById("server").value;
         var database = document.getElementById("database").value;
         var username = document.getElementById("username").value;
         var password = document.getElementById("password").value;

    fetch('/test_connection', {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json'
        },
        body: JSON.stringify({
      server: server,
      database: database,
      username: username,
      password: password
        })
    })
    .then(response => {
     if (response.ok) {
       alert('Conexión realizada con éxito!');
        } else {
         alert('No es posible conectar al servidor.');
     }
    })
    .catch(error => {
        alert('Error al intentar conectar al servidor.');
    });
    }

    document.getElementById("prestacionLink").addEventListener("click", function() {
    fetch("/prestacion", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});

document.getElementById("familiaLink").addEventListener("click", function() {
    fetch("/familia", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});
document.getElementById("subfamiliaLink").addEventListener("click", function() {
    fetch("/subfamilia", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});
document.getElementById("tipoprestacionLink").addEventListener("click", function() {
    fetch("/tipoprestacion", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});
document.getElementById("origenprestacionLink").addEventListener("click", function() {
    fetch("/origenprestacion", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});


document.getElementById("prestacionservicioLink").addEventListener("click", function() {
    fetch("/prestacionservicio", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});


document.getElementById("garantesLink").addEventListener("click", function() {
    fetch("/garante", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});

document.getElementById("contratoLink").addEventListener("click", function() {
    fetch("/Contrato", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});

document.getElementById("lotesLink").addEventListener("click", function() {
    fetch("/lotes", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});