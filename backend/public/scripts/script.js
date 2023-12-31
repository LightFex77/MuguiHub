const valorInput = document.getElementById("valorInput");
const fechaVencimientoInput = document.getElementById("fechaVencimientoInput");
const tipoProductoSelect = document.getElementById("tipo_producto");

const clienteInput = document.getElementById("clienteInput");
const botonBuscar = document.getElementById('botonBuscar');
const clienteRuc = document.getElementById('clienteRuc');

let clienteEncontrado = false; // Variable para indicar si se encontró el cliente
let json;

const guardarButton = document.getElementById("guardarButton");

const errorMensaje = document.getElementById("errorMensaje");
const errorFecha = document.getElementById("errorFecha");
const errorTipo = document.getElementById("errorTipo");

function validarValor(valor) {
    const valorNumeric = valor.replace(/\./g, "");
    const regex = /^[0-9]+$/;
    
    const val = parseInt(valorNumeric)
    if(regex.test(valorNumeric) && !isNaN(val) && val>0){
        errorMensaje.style.display = "none";
        return true
    }else{
        errorMensaje.style.display = "inline";
        return false
    }
}
function validarFecha(fecha) {
    const fechaActual = new Date();
    if (fecha >= fechaActual) {
        errorFecha.style.display = "none";
        return true
    } else {
        errorFecha.style.display = "inline";
        return false
    }
}
function validarSelect(option){
    if(option != ""){
        errorTipo.style.display = "none"
        return true
    }else{
        errorTipo.style.display = "inline"
        return false
    }
}
valorInput.addEventListener("input", function () {
    let valor = valorInput.value;
  
    // Eliminar los puntos existentes del valor
    valor = valor.replace(/\./g, "");
  
    // Agregar los puntos cada tres dígitos
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
    // Actualizar el valor del campo de entrada
    valorInput.value = valor;
    validarValor(valor)
  });
fechaVencimientoInput.addEventListener("change", function () {
    const fechaVencimiento = new Date(fechaVencimientoInput.value);

   validarFecha(fechaVencimiento)
});
tipoProductoSelect.addEventListener("change", function (){
    const selectValue = tipoProductoSelect.value;
    validarSelect(selectValue)
})


document.getElementById("compras").onsubmit = async function crear(e) {
    e.preventDefault()

    const form = new FormData(e.target);
    const valor = form.get("valor");
    const fechaVencimiento = new Date(form.get("fecha_vencimiento"));
    const tipo = form.get("tipo_producto");

    const esValorValido = validarValor(valor);
    const esFechaValido = validarFecha(fechaVencimiento);
    const esSelectValido = validarSelect(tipo);
    
    if (esValorValido && esFechaValido && esSelectValido) {
        const data = {
            "valor": form.get("valor").replace(/\./g, ""),
            "fecha_vencimiento": form.get("fecha_vencimiento"),
            "tipo": parseInt(form.get("tipo_producto")),
        }
        
        if (clienteEncontrado) {
          data.cliente_id = json.id; // Agregar el valor del cliente_id si se encontró el cliente
      }
        const respuesta = await fetch("/compras", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        alert("Se creo")
    } else {
        alert("Faltan datos")
    }
}

//crear la funcion que haga una lista de opciones en el SELECT

async function compraLista() {

    //buscar la base de datos y obtenerla GET
    const respuestaBd = await fetch("/tipo-producto", {
        method: "GET"
    })

    //Obtener los datos en JSON
    const bdJson = await respuestaBd.json();
    const resultado = bdJson.resultado;

    const selectProductos = document.getElementById("tipo_producto");

    //Crear recorrido de los elementos para SELECT
    for (const productos of resultado) {
        const item = document.createElement("option");
        item.setAttribute('value', `${productos.id}`);
        item.innerText = productos.texto

        selectProductos.append(item)
    }
}
//Hacer que la funcion se ejecute cada vez que se inicia la pagina
compraLista()



async function buscarCliente() {
    const respuestaBd = await fetch("/clientes", {
      method: "GET"
    });
  
    const bdJson = await respuestaBd.json();
    const clientesJson = bdJson.resultado;
  
    botonBuscar.addEventListener("click", (e) => {
      e.preventDefault();
      const ruc = clienteInput.value;
  
      // let clienteEncontrado = false; // Variable para indicar si se encontró el cliente
  
      for (json of clientesJson) {
        console.log(json.ruc);
  
        if (json.ruc === ruc && ruc !== "") {
          clienteRuc.style.display = "block";
          clienteRuc.innerHTML = `
            <span class="nombre">Nombre:</span> <p style="color: #677589">${json.nombre}</p>
            <span class="nombre">Apellido:</span> <p style="color: #677589">${json.apellido}</p>
          `;
          clienteEncontrado = true; // Se encontró el cliente
          break; // Salir del bucle
        }
      }
  
      if (!clienteEncontrado && ruc !== "") {
        clienteRuc.style.display = "block";
        clienteRuc.innerHTML = `
          <span class="nombre">El cliente RUC: <b style="color: #677589">${ruc}</b> no existe<br>Desea crearlo?<br></span>
          <button id="crearRuc">Si</button>
          <button id="noCrearRuc">No</button>
        `;
  
        const crearRuc = document.getElementById("crearRuc");
        const noCrearRuc = document.getElementById("noCrearRuc");
        const modal = document.getElementById("modal");
        const rucInput = document.getElementById("ruc");
  
        crearRuc.addEventListener("click", (e) => {
          e.preventDefault();
          modal.style.opacity = 1;
          modal.style.pointerEvents = "unset";
          rucInput.value = ruc;
          clienteRuc.style.display = "none";
        });
  
        noCrearRuc.addEventListener("click", (e) => {
          e.preventDefault();
          clienteRuc.style.display = "none";
        });
      } else if (ruc === "") {
        clienteRuc.style.display = "block";
        clienteRuc.innerHTML = `
          <span style="color:red">La casilla se encuentra vacía</span>
        `;
      }
    });
  }

buscarCliente();


document.getElementById('compras').reset();