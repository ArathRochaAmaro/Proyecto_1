//Conectar mi JavaScript con el HTML y poder leer los datos y pintar la tabla
const inputNombre = document.getElementById("nombreP");
const inputOxigeno = document.getElementById("oxigenoP");
const inputRitmo = document.getElementById("ritmoP");
const btnRegistrar = document.getElementById("btnRegistrar");
const tablaPacientes = document.getElementById("listaPacientes");

//Se usa addEventListener para ver cuando carga la pagina y
// cuando el usuario hace clic en el boton.
document.addEventListener("DOMContentLoaded", cargarPacientes);
btnRegistrar.addEventListener("click", agregarPaciente);

// Aqui se crea la clase Paciente con su constructor para colocar los datos del usuario
class Paciente {
    constructor(nombre, oxigeno, ritmo) {
        this.nombre = nombre;
        this.oxigeno = Number(oxigeno);
        this.ritmo = Number(ritmo);
        this.riesgo = this.calcularRiesgo();
    }

    // Aqui son las estructuras condicionales if-else y
    // operadores logicos para evaluar las reglas de negocio
    // del triage medico según los signos vitales.
    calcularRiesgo() {
        if (this.oxigeno < 90 || this.ritmo > 130) {
            return "Rojo";
        } else if (this.oxigeno >= 90 && this.oxigeno <= 94) {
            return "Amarillo";
        } else {
            return "Verde";
        }
    }
}
// Aquí se verefica que no este vacio, creamos la instancia con new Paciente, la metemos al 
// arreglo con .push(), y la guardamos en el localStorage usando.
function agregarPaciente() {
    const nombre = inputNombre.value.trim();
    const oxigeno = inputOxigeno.value;
    const ritmo = inputRitmo.value;

    if (nombre === "" || oxigeno === "" || ritmo === "") {
        return alert("Completa todos los campos");
    }

    const nuevoPaciente = new Paciente(nombre, oxigeno, ritmo);
    const pacientes = obtenerPacientes();
    
    pacientes.push(nuevoPaciente); //Agrega el nuevo paciente al final de la lista
    
    // Usar LocalStorage para guardar datos
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
    
    mostrarPacientes();
    
    // Limpiar inputs
    inputNombre.value = "";
    inputOxigeno.value = "";
    inputRitmo.value = "";
}

// Obtener pacientes de LocalStorage, los datos del navegador
function obtenerPacientes() {
    return JSON.parse(localStorage.getItem("pacientes")) || [];
}

// Lee los pacientes guardados y los coloca en tabla
function mostrarPacientes() {
    const pacientes = obtenerPacientes();
    tablaPacientes.innerHTML = "";

    pacientes.forEach((paciente, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${paciente.nombre}</td>
            <td>${paciente.oxigeno}%</td>
            <td>${paciente.ritmo} lpm</td>
            <td>
                ${obtenerRiesgo(paciente.riesgo)}
                <button onclick="eliminarPaciente(${index})">❌</button>
            </td>
        `;

        tablaPacientes.appendChild(tr);
    });
}

// Funcion auxiliar para mostrar el emoji según el riesgo
function obtenerRiesgo(riesgo) {
    if (riesgo === "Rojo") return "🔴 Rojo (Crítico)";
    if (riesgo === "Amarillo") return "🟡 Amarillo (Urgente)";
    return "🟢 Verde (Estable)";
}

// Funcion para cargar pacientes al recargar
function cargarPacientes() {
    mostrarPacientes();
}

// Funcion para eliminar paciente 
function eliminarPaciente(index) {
    const pacientes = obtenerPacientes();
    pacientes.splice(index, 1);
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
    mostrarPacientes();
    //Usamos .splice(index, 1) para quitarlo del arreglo, actualizamos el localStorage con setItem
}