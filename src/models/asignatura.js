const mongoose =require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
//Para ingresos a la BD unicos npm i mongoose-unique-validator
//var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const asignaturaSchema =new Schema({
	nombre:{ 
		type:String,
		require:true,
		unique: true,
		trim:true  //Evitar errores por espacios al ingresarun string
		//enum:{values:['maria','daniel,'felipe,'juan,'ana']}  es para restringir lps valores que entran
		},
	identificador:{
		type:Number,
		require:true,
		unique: true,
		min:[0,'Ingrese un numero mayor a 0']
	},
	descripcion:{
		type:String,
		require:true,
		trim:true
		},
	valor :{
		type:Number,
		require:true,
		min:[0,'Ingrese un numero mayor a 0']
		},
	modalidad:{
		type:String,
		default:'--',
		trim:true
	},
	intensidad:{
		type:String,
		default:'--',
		trim:true
	},
	estado:{
		type:String,
		enum:{values:['abierto','cerrado']},
		trim:true
	},
	estudiantes:{
		type:Array
	}
});

//Para ingresos a la BD unicos
asignaturaSchema.plugin(uniqueValidator);
const Asignatura=mongoose.model('Asignatura', asignaturaSchema);
module.exports=Asignatura;