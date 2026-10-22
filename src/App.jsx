// Se deben cerrar las etiquetas de cierre obligatoriamente
//Se deben cerrar aun si no son de cierre como Img con /.
// Es requerido un return para que react funcione
import { useState, useEffect } from 'react'

import Header from "./components/Header"
import Formulario from "./components/Formulario"
import ListadoPacientes from "./components/ListadoPacientes"


const CAMPOS = ['id', 'nombre', 'propietario', 'email', 'fecha', 'sintomas']

// Lee los pacientes de localStorage descartando datos corruptos o manipulados
const obtenerLS = () => {
  try {
    const pacientesLS = JSON.parse(localStorage.getItem('pacientes'))
    if (!Array.isArray(pacientesLS)) return []
    return pacientesLS.filter(p =>
      p && typeof p === 'object' && CAMPOS.every(campo => typeof p[campo] === 'string')
    )
  } catch {
    return []
  }
}

function App() {

  // Inicializacion diferida: se lee localStorage antes del primer render,
  // asi el efecto de guardado nunca sobrescribe los datos con un arreglo vacio
  const [pacientes, setPacientes] = useState(obtenerLS)
  const [paciente, setPaciente] = useState({})

  useEffect(() => {
    localStorage.setItem('pacientes', JSON.stringify( pacientes ));
  }, [pacientes])


  //Funcion para eliminarpaciente
  const eliminarPaciente = id => {
    const pacientesActualizados = pacientes.filter( paciente => paciente.id !== id)
    setPacientes(pacientesActualizados)
    if (paciente.id === id) setPaciente({})
  }

  return (  
    <div className="container mx-auto mt-20">
     <Header 
     />

     <div className="mt-12 md:flex">
        <Formulario
          pacientes={pacientes}
          setPacientes={setPacientes}
          paciente={paciente}
          setPaciente={setPaciente}

        />
        <ListadoPacientes
          pacientes={pacientes}
          setPaciente={setPaciente}
          eliminarPaciente={eliminarPaciente}
        />
      </div>

    </div>
  )
}

export default App
