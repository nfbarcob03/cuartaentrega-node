require('./config/config');
const alert = require('alert-node');
const express= require('express');
const app = express();
const path= require('path');
//const hbs=require('hbs');
const mongoose=require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bodyParser=require('body-parser');
const session = require('express-session');
const port = process.env.PORT || 3000;

const funciones=require('./funciones');


const directoriopublico = path.join(__dirname, '../public');
const directoriopartial = path.join(__dirname, '../partials');
const dirNode_modules = path.join(__dirname , '../node_modules')
const dirViews = path.join(__dirname, '../templates/views')
const dirPartials = path.join(__dirname, '../templates/partials')


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use((req,res,next)=>{
	if(req.session.usuario){
		res.locals.session=true
		res.locals.nombre=req.session.nombre
		res.locals.tipo=req.session.tipo
		res.locals.avatar=req.session.avatar
	}
	if(req.session.tipo=="coordinador"){
		res.locals.coordinador=true
	}else if(req.session.tipo=="aspirante"){
		res.locals.aspirante=true
	}
	next()
})

app.use(express.static(directoriopublico));
app.use(bodyParser.urlencoded({extended:false}))
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err,result)=>{
	if(err){
		return console.log("Error al conectarse a Mongoose" + err);
	}
		console.log("Conectado")
});

app.listen(process.env.PORT,()=>{
	console.log('servior en el pierto ' + process.env.PORT);
});