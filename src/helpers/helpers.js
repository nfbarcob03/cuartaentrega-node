const hbs=require('hbs');

hbs.registerHelper('mostrar_usuarios', (listado)=>{
	let texto= `
	<form action="/eliminarUsuario" method="post">
		<table class='table table-striped table-hover'>
						<thead class='thead-dark'>
							<th>Nombre</th>
							<th>Identificacion</th>
							<th>Correo</th>
							<th>Telefono</th>
							<th>Tipo</th>
							<th></th>
						</thead>
						<tbody>`;
	listado.forEach(usuario=>{
		texto=texto+
				`<tr>
				<td>${usuario.nombre}</td>
				<td>${usuario.identificacion}</td>
				<td>${usuario.correo}</td>
				<td>${usuario.telefono}</td>
				<td>${usuario.tipo}</td>
				<td><button class="btn btn-danger" name="nombre" value="${usuario.nombre}">Eliminar</button></td>
				</tr>`;
	})
	texto=texto+'</tbody> </table></form>';
	return texto;
})




hbs.registerHelper('obtenerPromedio', (nota1, nota2, nota3)=>{
	return ((nota1+nota2+nota3)/3)
});



hbs.registerHelper('listar', ()=>{
	listaEstudiantes=require('./listado.json');
	let texto= "<div class='accordion' id='accordionExample'>";
	i=1
	listaEstudiantes.forEach(estudiante=>{
		texto=texto +
			   `<div class="card">\
			   			<div class="card-header" id="heading${i}">\
			   				<h2 class="mb-0">\
			   					<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">\
			   						${estudiante.nombre}\
			   					</button>\
			   				</h2>\
			   			</div>\
			   			<div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">\
			   			 <div class="card-body">\
			   			 	Tine una nota de matematicas de ${estudiante.matematicas} <br>\
			   			 	Tine una nota de ingles de ${estudiante.ingles} <br>\
			   			 	Tine una nota de programacion de ${estudiante.programacion} <br>\
			   			 </div>\
			   			</div>`
			  i=i+1;
	});
	texto=texto+'</div>';
	return texto;
});

hbs.registerHelper('listarCursosInteresado', (listaCursos)=>{
	let texto= "<div class='accordion' id='accordionExample'>";
	i=1
	listaCursos.forEach(curso=> {if (curso.estado=="abierto"){
		texto=texto +
			   `<div class="card">\
			   			<div class="card-header" id="heading${i}">\
			   				<h2 class="mb-0">\
			   					<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">\
			   						${curso.nombre}\
			   					</button>\
			   				</h2>\
			   			</div>\
			   			<div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">\
			   			 <div class="card-body">\
			   			 	ID del curso:  ${curso.identificador} <br>\
			   			    Descripción del curso: ${curso.descripcion} <br>\
			   			 	Valor del curso: ${curso.valor} <br>\
			   			 	Modalidad: ${curso.modalidad} <br>\
			   			 	Intensidad horaria Curso: ${curso.intensidad} <br>\
			   			 	Estado del Curso: ${curso.estado} <br>\
			   			 </div>\
			   			</div>`
			  i=i+1;
			  texto=texto+'</div>';
	}});
	texto=texto+'</div>';
	return texto;
});


hbs.registerHelper('listarCursosInteresadoSelect', (listaCursos)=>{
	let texto= '<select style="width: 100%;" name="cursoSelect">';
	i=1
	listaCursos.forEach(curso=> {if (curso.estado=="abierto"){
		texto=texto +
			   `<option value=${curso.identificador}>${curso.nombre}</option>`
			  i=i+1;
	}});
	texto=texto+'</select>';
	return texto;
});

hbs.registerHelper('lista_curso_estado', (listaCursos)=>{
	let texto= '<select style="width: 100%;" name="cursoSelect">';
	i=1
	listaCursos.forEach(curso=> {
		texto=texto +
			   `<option value=${curso.identificador}>${curso.nombre}-(${curso.estado})</option>`
			  i=i+1;
	});
	texto=texto+'</select>';
	return texto;
});

hbs.registerHelper('lista_curso_actualizar', (listaCursos)=>{
	let texto= '<select style="width: 100%;" name="cursoSelect">';
	i=1
	listaCursos.forEach(curso=> {
		texto=texto +
			   `<label>Escoja el curso a actualizar</label>
			   <option value=${curso.identificador}>${curso.nombre})</option>`
			  i=i+1;
	});
	texto=texto+'</select>';
	return texto;
});

hbs.registerHelper('listarCursosAdmin', (listaCursos)=>{
	let texto= '<table class="table">\
  <thead>\
    <tr>\
      <th scope="col">ID del curso</th>\
      <th scope="col">Nombre</th>\
      <th scope="col">Descripción del curso</th>\
      <th scope="col">Valor del curso</th>\
      <th scope="col">Modalidad</th>\
      <th scope="col">Intensidad horaria Curso</th>\
      <th scope="col">Estado del Curso</th>\
    </tr>\
  </thead>\
  <tbody>';
	i=1
	listaCursos.forEach(curso=> {
		texto=texto +`
			    <tr>
			      <th scope="row">${curso.identificador}</th>
			      <td>${curso.nombre}</td>
			      <td>${curso.descripcion}</td>
			      <td>${curso.valor}</td>
			      <td>${curso.modalidad}</td>
			      <td>${curso.intensidad}</td>
			      <td>${curso.estado} </td>
			    </tr>`
			  i=i+1;
	});
	texto=texto+'  </tbody></table>';
	return texto;
});

hbs.registerHelper('lista_inscritos', (listaCursos)=>{
	console.log(listaCursos)
	texto= "<div class='accordion' id='accordionExample'>";
	i=1;
	listaCursos.forEach(curso=> {
		texto=texto +
			   `<div class="card">\
			   			<div class="card-header" id="heading${i}">\
			   				<h2 class="mb-0">\
			   					<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">\
			   						${curso.nombre}\
			   					</button>\
			   				</h2>\
			   			</div>`
		texto=texto+ `<div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">\
			   		<div class="card-body">`
		texto= texto+ '<table class="table">\
				  <thead>\
				    <tr>\
				      <th scope="col">Identificacion</th>\
				      <th scope="col">Nombre</th>\
				      <th scope="col">Email</th>\
				      <th scope="col">Telefono</th>\
				      <th scope="col"></th>\
				    </tr>\
				  </thead>\
				  <tbody>';
					try{
					listaUnCursos=curso.estudiantes
					if(listaUnCursos.length==0){
						throw new Exception();
					}
					console.log(listaUnCursos)
					listaUnCursos.forEach(est=> {
						texto=texto +`
							    <tr>

								    <th scope="row" >${est.identificacion}</th>
							      	<td>${est.estudiante}</td>
							      	<td >${est.email}</td>
							      	<td>${est.telefono}</td>
							    <form action="/eliminarEstudiante" method="post">
							      	<input type="hidden" name="curso" value="${curso.nombre}">
							      	<input type="hidden" name="curso_id" value="${curso.identificador}">
								    <input type="hidden" name="identificacion" value="${est.identificacion}">
							      	<input type="hidden" name="email" value="${est.email}">
								    <input type="hidden" name="nombre" value="${est.estudiante}">
							      	<input type="hidden" name="tel" value="${est.telefono}">
							      	<td><button class="btn btn-primary mb-2">Eliminar</button></td>
							    </form>
							    </tr>`;
					});
				}catch(error){
					texto=texto +
							    `<tr>
							      <th scope="row" >No hay aun estudiantes</th>
							      <td>No hay aun estudiantes</td>
							      <td>No hay aun estudiantes</td>
							      <td>No hay aun estudiantes</td>
							      <td>No hay aun estudiantes</td>
							    </tr>`
				} 
					texto=texto+'  </tbody></table>';
					i=i+1;
					texto=texto+'</div></div></div>';
					});
					texto=texto+'</div>';
		
				return texto;
			});
