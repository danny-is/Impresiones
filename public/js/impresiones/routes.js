$(document).ready(function(){
	app = $.sammy('body', function() {
		
		///////////////////////////////
		///////// ROUTES
		//////////////////////////////////
	
			this.get('#login/',function(){	
				var context = this;
				
				//init
				$('#login').show();
			});
		
		
		
			this.get('#oportunidad/',function(){		 
				hideAllDivs();

				//init
				//('#clientesList').html('');
				$('#txt_oppCliente').val('');
				$('#txt_oppProducto').val('');
				$('#txt_oppObservacion').val('');
				$('#txt_oppContacto').val('');
								
				$('#doOpp').show();
			});
		
	 
		this.get('#pedido/',function(){		 
			hideAllDivs();
			//init
			//('#clientesList').html('');
			$('#txt_searchCliente').val('');
			$('#selectCliente').show();
		});

			this.get('#pedidos/',function(){	
				$('#ajaxLoader').hide();
				var context = this;
				hideAllDivs();
				$('#listPedido').show();
				$('#pedidosList').html('');	
				$.each(oportunidades, function(i, item) {
						context.partial('/templates/oportunidadItem.html.erb', {item: item,index: i}, function(html) {
							$('#pedidosList').append(html);
						});
		    });
			});
	
 
		
		
	});
});