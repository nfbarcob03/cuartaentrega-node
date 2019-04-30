//npm i bcrypt oara encriptar contraseñas
//npm i express-session manejar datos en sesion

const express= require('express');
const app = express();
const path= require('path');
const hbs=require('hbs');
const Usuario=require('./../models/estudiante');
const Asignatura=require('./../models/asignatura');
const bcrypt = require('bcrypt');
const multer=require('multer')
const session = require('express-session');
var salt = bcrypt.genSaltSync(10);

// Estudiante= require('./../models/estudiante');

//Para encriptar contraseña
//const bcrypt = require('bcrypt');
//const saltRounds = 10;


const dirViews = path.join(__dirname, '../../templates/views')
const dirPartials = path.join(__dirname, '../../templates/partials')
//var salt = bcrypt.genSaltSync(saltRounds);

require('./../helpers/helpers');


hbs.registerPartials(dirPartials)
app.set('views', dirViews)
app.set('view engine', 'hbs');


//------------Inicio
app.get('/',(req,res)=>{
	res.render('index',{
		titulo:'Inicio'
	});
});

app.get('/verusuarios', (req,res)=>{
	Usuario.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log(err)
		}
		res.render('verusuarios',{
			listado:respuesta
		})
	})
})

app.post('/eliminarEstudiante', (req, res)=>{
	let identificacion=req.body.identificacion;
	let estudiante=req.body.nombre;
	let email=req.body.email;
	let telefono=req.body.tel;
	let cursoIdentificador=req.body.curso_id;
	console.log(cursoIdentificador +' '+ estudiante)
	Asignatura.findOneAndUpdate({'identificador':cursoIdentificador,'estudiantes': {$elemMatch: {'estudiante':estudiante}}}, {'$pull': {'estudiantes': {'estudiante':estudiante}}},{new:true, runValidators: true, context: 'query'},(err,result)=>{
		if(err){
			return res.render('error',{
			mensaje:"Error, " + err.message,
			titulo:"Error"
			})
		}
		if(!result){
			return res.render('error',{
			mensaje:"No se ha encontrado ningun estudiante con ese nombre"
		})
		}
		res.render('exitosa',{
			mensaje:"Se ha eliminado el estudiante"
		})
	})



	//let est={estudiante:estudiante, identificacion:identificacion.toString(), email:email, telefono:telefono, curso:curso};
	//let exito=funciones.eliminarEstudiante(est);
	//if(exito){
	//	res.render('listadoInscritos',{
	//	titulo:'Se ha eliminado el estudiante con Exito'
	//});
	//}else{
	//	res.render('errorCurso',{
	//	titulo:'Error'
	//});
	//}	
})

app.get('/crearCursos', (req, res)=>{
	res.render('crearCursos', {
		titulo:'Cree un nuevo curso de Educacíon Continua '
		})
})

app.post('/ingresar', (req,res)=>{
	Usuario.findOne({nombre:req.body.user}, (err,result)=>{
		if(err){
			return console.log("no se pudo ingrresar a la BD "+ err)
		}
		if(!result){
			return res.render('ingresar',{
			mensaje:"Contraseña o usuario invalidos"
		})
		}
		if(!bcrypt.compareSync(req.body.password, result.password)){
			return res.render('ingresar',{
			mensaje:"Contraseña o usuario invalidos"
		})
		}
		//Se configura las variables de sesion y para identificarla se usa el _id del usuario de la BD
		req.session.usuario=result._id
		req.session.nombre=result.nombre
		req.session.tipo=result.tipo
		req.session.avatar=result.avatar.toString('base64')

		if (result.tipo=="coordinador"){
			req.session.coordinador=true
			res.render('ingresar',{
			mensaje:"Ingreso correcto. Bienvenido Admin "+ result.nombre,
			session:true,
			coordinador:true,
			nombre:result.nombre,
			avatar:result.avatar.toString('base64')
		})
		}else{
			req.session.aspirante=true
			res.render('ingresar',{
			mensaje:"Ingreso correcto. Bienvenido ASpirante "+ result.nombre,
			session:true,
			aspirante:true,
			nombre:result.nombre,
			avatar:result.avatar.toString('base64')
		})
		}

		//Session, se crea el token (para trabajar con jwt)
		//let token=jwt.sign({
		//	  data: result
		//	}, 'tdea-nfbb', { expiresIn: '1h' });
		//
		//localStorage.setItem('token', token);
	})
})

app.post('/crearCurso', (req, res)=>{
	let asignatura = new Asignatura({
		nombre:req.body.nombre,
		identificador:parseInt(req.body.identificador),
		descripcion:req.body.descripcion,
		valor:parseInt(req.body.valor),
		modalidad:req.body.modalidad,
		intensidad:req.body.intensidad,
		estado:'abierto'
	})
	
	asignatura.save((err,result)=>{
		if(err){
			console.log('Error al comunicarse con la BD' + err)
			return res.render('error',{
			titulo:'Error BD',
			mensaje:'Error al comunicarse con la BD' + err
			});
		}
		res.render('exitosa', {
			titulo:'Exito!',
			mensaje:'Registro exitoso del curso '+ result.nombre
		});
	});
})

app.get('/actualizarCurso', (req,res)=>{
	Asignatura.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log('Error con la BD: '+ err)
		}
		res.render('actualizarCurso',{
		titulo:'Actualizar cursos',
		listado:respuesta
		})
	})
})

app.post('/actualizarCurso', (req,res)=>{
	Asignatura.findOneAndUpdate({identificador:req.body.identificador},req.body,{new:true, runValidators: true, context: 'query'}, (err,result)=>{
		if(err){
			return res.render('error',{
			mensaje:"Error, " + err.message,
			titulo:"Error"
			})
		}
		if(!result){
			return res.render('error',{
			mensaje:"No se puede cambiar el id del curso " + err
		})
		}
		res.render('actualizarCurso2',{
			titulo: "Actualizacion exitosa",
			curso:result
		})
	})
})

app.get('/registro', (req, res)=>{
	res.render('registro', {
		titulo:'Inacribase a un curso de Educación Continua '
		})
})

//var storage = multer.diskStorage({
//  destination: function (req, file, cb) {
//    cb(null, 'public/uploads')
//  },
//  filename: function (req, file, cb) {
//   cb(null, req.body.nombre +'_'+req.body.identificacion + path.extname(file.originalname))
//  }
//})
 
var upload = multer({
	limits:{
		fileSize:1000000
	},
	fileFilter(req,file,cb){
		if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
			cb(new Error('No es un archivo valido'))
		}
		cb(null, true)
	}
})


app.post('/registro',upload.single('archivo') ,(req, res)=>{
	
	let usuario= new Usuario({
		nombre: req.body.nombre,
		password:bcrypt.hashSync(req.body.password, salt),
		identificacion:req.body.identificacion,
		correo:req.body.email,
		telefono:req.body.telefono,
		tipo:'aspirante',
		avatar:req.file.buffer
	})

	usuario.save((err,result)=>{
		if(err){
			console.log('Error al comunicarse con la BD' + err)
			return res.render('error',{
			titulo:'Error BD',
			mensaje:'Error al comunicarse con la BD' + err
			});
		}
		res.render('exitosa', {
		titulo:'Exito!',
		mensaje:'Registro exitoso de '+ result.nombre
		});
	});
});

app.get('/actualizarUsuario', (req,res)=>{
	Usuario.findById(req.session.usuario,(err,user)=>{
		if(err){
			console.log("no se pudo conectar con la BD: "+ err)
			return res.render('error',{
			nombre:"Error, " + err.message,
			titulo:"Error"
			})
		}
		res.render('actualizarUsuario',{
			nombre: user.nombre,
			identificacion:user.identificacion,
			correo:user.correo,
			telefono:user.telefono
		})
	})
})

app.post('/actualizarUsuario', upload.single('archivo'),(req,res)=>{
	password=bcrypt.hashSync(req.body.password, salt)
	Usuario.findByIdAndUpdate(req.session.usuario,{nombre: req.body.nombre,
													password:password,
													identificacion:req.body.identificacion,
													correo:req.body.email,
													telefono:req.body.telefono,
													tipo:req.session.tipo,
													avatar:req.file.buffer
													},{new:true, runValidators: true, context: 'query'}, (err,result)=>{
		if(err){
			return res.render('error',{
			nombre:"Error, " + err.message,
			titulo:"Error"
			})
		}
		if(!result){
			return res.render('actualizarUsuario',{
			nombre:"No se ha encontrado ningun estudiante con ese nombre " + err
		})
		}
		req.session.avatar=result.avatar.toString('base64')
		res.render('actualizarUsuario',{
			nombre: result.nombre,
			identificacion:result.identificacion,
			correo:result.correo,
			telefono:result.telefono,
			avatar:req.session.avatar
		})
	})
})

app.post('/eliminarUsuario', (req,res)=>{
	Usuario.findOneAndDelete({nombre:req.body.nombre},req.body, (err,result)=>{
		if(err){
			return console.log(err)
		}
		if(!result){
			return res.render('actualizar',{
			nombre:"No se ha encontrado ningun estudiante con ese nombre"
		})
		}
		res.render('eliminar',{
			nombre:result.nombre
		})
	})
})

app.post('/cambioEstado', (req, res)=>{
	var idCurso=req.body.cursoSelect;
	var estadoActual=""
	var nuevoEstado="" 

	Asignatura.findOne({identificador:idCurso}, (err,result)=>{
		estadoActual=result.estado
		console.log(estadoActual)
		if(estadoActual=="abierto"){
			nuevoEstado="cerrado"
		}else{
			nuevoEstado="abierto"
		}
		console.log(idCurso)
		console.log(nuevoEstado)
		Asignatura.findOneAndUpdate({identificador:idCurso},{$set:{estado:nuevoEstado}},{new:true, runValidators: true, context: 'query'}, (err,result)=>{
			if(err){
				return res.render('error',{
				nombre:"Error, " + err.message,
				titulo:"Error"
				})
			}
			if(!result){
				return res.render('actualizarUsuario',{
				nombre:"No se ha encontrado ningun estudiante con ese nombre " + err
			})
			}
			res.render('exitosa',{
				nombre:"Exito!",
				mensaje:"Actualizacion Exitosa"
			})
		})
	})
})

app.post('/listaActualizarCursos', (req, res)=>{
	var idCurso=req.body.cursoSelect;

	Asignatura.findOne({identificador:idCurso}, (err,result)=>{
			if(err){
				return res.render('error',{
				mensaje:"Error, " + err.message,
				titulo:"Error"
				})
			}
			if(!result){
				return res.render('error',{
				mensaje:"No se ha encontrado ningun estudiante con ese nombre " + err
			})
			}
			curso=result
			res.render('actualizarCurso2',{
				titulo:"Actualizar Curso",
				curso:curso
			})
		})
	})

app.get('/verInscritos', (req,res)=>{
	Asignatura.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log('Error con la BD: '+ err)
		}
		res.render('listadoInscritos',{
		titulo:'Listado de Cursos',
		listado:respuesta
		})
	})
})


app.get('/listar_cursos_usuario', (req,res)=>{
	Asignatura.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log('Error con la BD: '+ err)
		}
		res.render('listar_cursos_usuario',{
		titulo:'Listado de Cursos',
		listado:respuesta
		})
	})
	
})

app.get('/inscripcion_curso', (req,res)=>{
	let user=Usuario.findById(req.session.usuario,(err,user)=>{
		if(err){
			console.log("no se pudo conectar con la BD: "+ err)
			return res.render('error',{
			nombre:"Error, " + err.message,
			titulo:"Error"
			})
		}
		Asignatura.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log('Error con la BD: '+ err)
		}
		res.render('inscripcion',{
		titulo:'Listado de Cursos',
		listado:respuesta,
		nombre: user.nombre,
		identificacion:user.identificacion,
		correo:user.correo,
		telefono:user.telefono
		})
	})
	})
})

app.post('/inscribir', (req, res)=>{
	estudiante= req.body.nombre;
	identificacion=req.body.identificacion;
	email=req.body.email;
	telefono=req.body.telefono;
	curso=req.body.cursoSelect;

	Asignatura.findOne({ identificador:curso, estudiantes:identificacion}, (err,result)=>{
		if(err){
			console.log(err)
		}
		if(!result){
		Asignatura.findOneAndUpdate({identificador:curso},{$push:{estudiantes:{estudiante,identificacion,email,telefono,curso}}},{new:true, runValidators: true, context: 'query'}, (err,result)=>{
		if(err){
			return res.render('error',{
			nombre:"Error, " + err.message,
			titulo:"Error"
			})
		}
		if(!result){
			return res.render('exitosa',{
			mensaje:"No se ha encontrado ningun estudiante con ese nombre " + err
		})
		}
		res.render('exitosa',{
			mensaje:" Se ha inscrito al curso "+ result.nombre+ " con exito " +estudiante
		})
		})
		}else{
		res.render('error',{
			mensaje:" ya existe en el curso el estudiante " +estudiante
		})
		}
	})
	//if(!existe){
		
	//}else{
	//	res.render('error',{
	//		mensaje:" ya existe en el curso el estudiante " +estudiante
	//	})
	//}
})

app.get('/listar_cursos_admin', (req,res)=>{
	Asignatura.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log('Error con la BD: '+ err)
		}
		res.render('listar_cursos_admin',{
		titulo:'Listado de Cursos',
		listado:respuesta
		})
	})
	
})

app.get('/salir',(req,res)=>{
	//-------Cerrar la sesion con variables de session
	req.session.destroy((err)=>{
		if(err) console.log("Error al salir de la sesion "+ err)
	})

	//Cierre session con jwt
	//localStorage.setItem('token','');
	res.redirect('/')
})

app.get('*', (req,res)=>{
	res.render('error',{
		titulo:'Error'
	})
})



module.exports=app;