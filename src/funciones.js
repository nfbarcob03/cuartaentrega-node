//Laammada al file sistem
const fs = require ('fs');
//Lista de estudiantes
listaEstudiantes=[];
listaCursos=[];
listaUnCursos=[]

//Funciones para crear  estudiantes
const crear_curso = (curso) => {
	//La funcion listar trae el json ya guardao antes
	//Con registros anteriores
	listarCursos();
	let duplicadoNombre=listaCursos.find(cur=>cur.nombre==curso.nombre)
	let duplicadoId=listaCursos.find(cur=>cur._id==curso._id)
	if(!duplicadoNombre && !duplicadoId){
		listaCursos.push(curso);
		console.log(listaCursos);
		//La funcion guardar, en un archivo .json listaEstudiantes
		guardarCurso();
		return true;
	}else{
		console.log('Ya existe un curso con ese nombre o ese ID, no se puede crear');
		return false;
	}
}

//La funcion listar trae el json ya guardao antes
//Con registros anteriores
const listarCursos = ()=>{
	try{
		//Permanece mas en el tiempo, en caso de que sea constante
		listaCursos = require('./listado_cursos.json')
		//Si es modificado asincronicamente
		//listaEstudiantes = JSON.parse(fs.readFileSync('listado.json'));
	}catch(error){
		listaCursos=[];
	}
}

const listarUnCursos = (doc_curso) => {
	try{
		//Permanece mas en el tiempo, en caso de que sea constante
		ubicacion='../' + doc_curso
		listaUnCursos = require(ubicacion)
		//Si es modificado asincronicamente
		//listaEstudiantes = JSON.parse(fs.readFileSync('listado.json'));
	}catch(error){
		console.log("list nueva")
		listaUnCursos=[];
		fs.appendFile(doc_curso, listaUnCursos, function (err) {
  			if (err) throw err;
  			console.log('Saved!');
		});

	}
}
//Funcion para guardar en un JSON los estudiantes

const cambiarCurso = (idCurso)=>{
	listaCursos = require('./listado_cursos.json')
	let curs= listaCursos.find(buscar=>buscar._id==idCurso)
	if(!curs){
		console.log('El curso no existe')
		return false;
	}else{
		//Se asume que ingresa una materia valida
		if (curs.estado=="Disponible"){
			curs.estado="Cerrado";
		}else{
			curs.estado="Disponible";
		}
		guardarCurso()
		return true;
	}
}
const gurdarListaUnCurso=(doc_curso)=>{
	let datos=JSON.stringify(listaUnCursos);
		fs.writeFile(doc_curso, datos, (err)=>{
		if(err) throw(err);
		console.log('Archivo creado con exito');
	})
}

const guardarEstudianteCurso = (estudiante)=>{
	c=estudiante.curso.split(' ');
	let doc_curso=c[0] + '.json';
	listarUnCursos(doc_curso);
	let duplicadoId=listaUnCursos.find(est=>est.identificacion==estudiante.identificacion)
	let duplicadoNombre=listaUnCursos.find(est=>est.estudiante==estudiante.estudiante)
	if(!duplicadoId && !duplicadoNombre){
		listaUnCursos.push(estudiante);
		//La funcion guardar, en un archivo .json listaEstudiantes
		gurdarListaUnCurso(doc_curso);
		return true;
	}else{
		console.log('Ya existe un usuario con ese nombre o ese ID, no se puede crear');
		return false;
	}
	
}

const eliminarEstudiante = (estudiante)=>{
	c=estudiante.curso.split(' ');
	let doc_curso=c[0] + '.json';
	listarUnCursos(doc_curso);
	console.log(estudiante.identificacion)
	console.log(listaUnCursos)
	let indice= listaUnCursos.findIndex(est=> est.estudiante==estudiante.estudiante);
	console.log(indice)
	if(indice==-1){
		console.log("no lo encontre")
		return false;
	}else{
		console.log("lo encontre")
		listaUnCursos.splice(indice, 1);
		gurdarListaUnCurso(doc_curso);
		return true;
	}
}

const guardarCurso=()=>{
	let datos=JSON.stringify(listaCursos);
	fs.appendFile('listado_cursos.json', datos, (err)=>{
		if(err) throw(err);
	})
}





//Se exporta las funciones parea que otros scrips los utilicen
module.exports = {
	crear_curso,
	eliminarEstudiante,
	cambiarCurso,
	guardarEstudianteCurso,
}