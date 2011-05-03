this.bind('search_clientes', function(e, data) {
		var currentVal = $('#txt_searchCliente').val();
		var results=[];
		var count = clientes.length -1;
		while(count > -1 && results.lenght < 50){
			var cliente = clientes[count];
			var res = cliente.Name.toLowerCase().search(currentVal.toLowerCase());
			if(res>-1){
				results.push(cliente);
			}
			count--;
		}
			app.trigger('search_clientes_show_results',{results: results});
});

this.bind('search_clientes_show_results', function(e, data) {
	var context = this;
	tempclientes = data['results']
	$('#clientesList').html(' ');
	$.each(tempclientes, function(i, item) {
			context.partial('/templates/clienteItem.html.erb', {item: item}, function(html) {
				$('#clientesList').append(html);
			});
  });
});

this.bind('search_clientes_select', function(e, data) {
	$('#txt_searchCliente').val('');
	currentClienteId = this.params['id'];
	
});

this.bind('search_productos', function(e, data) {
	var currentVal = $('#txt_searchProducto').val();
	var results=[];
	var count = productos.length -1;
	while(count > -1 && results.lenght < 50){
		var producto = productos[count];
		var res = producto.Name.toLowerCase().search(currentVal.toLowerCase());
		if(res>-1){
			results.push(producto);
		}
		count--;
	}
	 
		$('#productosList').html(' ');
	$.each(results, function(i, item) {
			context.partial('/templates/productoSearch.html.erb', {item: item}, function(html) {
				
				$('#productosList').append(html);
			});
  });
});


 

//adds a product to list, or if "0" removes the producto
//Fires from SearchTemplate and from ItemListTemplate
this.bind('search_productos_select', function(e, data) {
	var context = this;
	id = data['id'];
	cantidad = data['cantidad'];
	pObj = map_selected_productos[id];
	if(pObj==null){
		otherP = map_productos[id];
		map_selected_productos[id]= {Id:id,Cantidad: cantidad, Name: otherP.Name, Precio: otherP.PrecioMinimo__c,Descuento: otherP.DescuentoMinimo__c,Impuesto: otherP.Impuesto__c }; 
	}
	if(pObj!=null && cantidad==0){
		delete map_selected_productos[id]
	}
	else{
		map_selected_productos[id].Cantidad = cantidad; 
	}
	context.trigger('refresh');
});

//Calculates Total for Selected Items
	this.bind('refresh', function(e, data) {
		var context = this;
		 var total =0;
			$('.contentFooter').show();
			
			tempArray=[];
			for(var index in map_selected_productos) {
				tempArray.push(map_selected_productos[index]);
				item = map_selected_productos[index];							
				producto = map_productos[index];
				subtotal = item.Cantidad * item.Precio;
				descuento = subtotal *  item.Descuento / 100;
				impuesto = (subtotal - descuento) * item.Impuesto / 100;
				total += subtotal -descuento + impuesto;
			}

			$('#totalPlaceHolder').html('Total: c/ ' + total);
			$('#selectedProductosList').html(' ');
	
		$.each(tempArray, function(i, item) {
				context.partial('/templates/productoItemList.html.erb', {item: item}, function(html) {
					$('#selectedProductosList').append(html);
				});
		});					
});


 
 
		function createOportunidad_fromItem(itemIndex){
			item = map_selected_productos[indexIndex];
			producto = map_productos[indexIndex];
			var cliente = map_clientes[currentClienteId];

			pid = index.split(',')[0];
			cid=currentClienteId.split(',')[0];

			oportunidad=new Object();
			oportunidad.cliente__c = cid;
			oportunidad.producto__c= pid;
			oportunidad.cantidad__c=item.Cantidad ;
			oportunidad.precio__c = item.Precio;
			oportunidad.descuento__c = item.Descuento;
			oportunidad.cliente = cliente.Name; 
			oportunidad.producto = producto.Name; 
			oportunidad.observacion = item.observacion
			oportunidad.fecha =  new Date();
			oportunidad.type ='Oportunidad__c';
			return oportunidad;

		}


		function createOportunidad_fromItem(itemIndex){
			item = map_selected_productos[indexIndex];
			producto = map_productos[indexIndex];
			var cliente = map_clientes[currentClienteId];

			pid = index.split(',')[0];
			cid=currentClienteId.split(',')[0];

			oportunidad=new Object();
			oportunidad.cliente__c = cid;
			oportunidad.producto__c= pid;
			oportunidad.cantidad__c=item.Cantidad ;
			oportunidad.precio__c = item.Precio;
			oportunidad.descuento__c = item.Descuento;
			oportunidad.cliente = cliente.Name; 
			oportunidad.producto = producto.Name; 
			oportunidad.observacion = item.observacion
			oportunidad.fecha =  new Date();
			oportunidad.type ='Oportunidad__c';
			return oportunidad;

		}
 

