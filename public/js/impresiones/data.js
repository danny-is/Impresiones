this.bind('loadRemoteData',function(){  	
	var query = 'username=' + username + '&password=' + password + '&token='+token;
	var context = this;
		$.ajax({
			url: "/getdata",
			type:"GET",
			data: query ,
			context: document.body,
			success: function(data){
				var temp = JSON.parse(data);
				var count = temp.length -1;
				while (count>-1){
					var t = temp[count];

					if(t.type == 'Cliente__c'){
						clientes.push(t);
					}
					else{
						productos.push(t);
					}
					count--;		
				}
				
				context.trigger('saveLocalData');
				context.trigger('loadLocalData');
				
			},
			error: function(re,text,error) {
				context.trigger('handleLoginError',{request: re , text: text , error: error}); 
			}
		});
})

this.bind('saveRemoteData', function(e, data) {
	var context =this;

	

});

this.bind('saveLocalData', function() {
	store.set('productos', productos);
	store.set('clientes', clientes);
	store.set('oportunidades', oportunidades);
}

this.bind('savePartialData', function() {
	store.set('oportunidades', oportunidades);
}

this.bind('loadLocalData', function() {
	var context = this;
	clientes = store.get('clientes'); 
	productos = store.get('productos');
	opp = store.get('oportunidades'); 		 
	oportunidades = new Array();
	if(opp!=null){
		$.each(opp, function(i, item) {
			if(item!=null && item != undefined){
				oportunidades.push(item);
			}
		});
	}
	
	$.each(clientes, function(i, item) {
		map_clientes[item.Id]=item;	
	});
	
	$.each(productos, function(i, item) {
		map_productos[item.Id]=item;	
	});
	
	context.redirect('#pedido_show/');
});


	//TODO IMPROVE THIS WAY TO HANDLE N AND N+1 RESULTS
		this.bind('hangleSaveOportunidades', function(e, data) {
			var context =this;
			var temp = data['all'];
		 	o = this.json(temp);
			results = o.createResponse.result;
			if(results.success=="true"){
				delete oportunidades[0];
			}
			else if(results.success=="false"){
				alert('Resporte este error al Administrador: ' + context.json(results));
			}
			else{	
				$.each(results, function(i, item) {
					if(item.success=="true"){
						delete oportunidades[i];
					}
					else{
							alert('Resporte este error al Administrador: ' + context.json(item));
					}
				});
			}
		
			context.trigger('savePartialData');
			context.redirect('#pedidos/');
		});


		this.bind('handleSaveOportunidadesError',function(e,data){
			var context = this;
			var re = data['request'];
			if(re.status='404'){
				alert('No se puedo conectar a internet para enviar los pedidos. Favor revise su conexion.');
			}
			else{
		 		alert('Error del Tipo ' + re.status + ' :: ' + re.statusText + '. Favor reportelo a su administrador.');
			}
			context.redirect('#pedidos/');
		});