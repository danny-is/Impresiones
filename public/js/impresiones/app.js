var app;
var store;
var cart;
var p = window;

var Producto = Model("producto", function() {
  this.extend({
    find_by_titulo: function(titulo) {
      return this.detect(function() {
        return this.attr("titulo") == titulo
      })
    }
  })
})

var Item = Model("item", function() {
  this.extend({
    find_by_titulo: function(titulo) {
      return this.detect(function() {
        return this.attr("titulo") == titulo
      })
    }
  })
})

function hideAllDivs(){
	$('#select').hide();
	$('#printFull').hide();
	$('#printHalf').hide();
	$('#loading').hide();	
}

function addProducto(event){
	var txt_producto = $(event.currentTarget).html();
	var producto=Producto.find_by_titulo(txt_producto);
	if(Item.find_by_titulo(txt_producto) == null){
		var item = new Item(producto.attr());
		item.save();
	}
	app.trigger('showItems');
}

function removeProducto(event){
	var txt_producto = $(event.currentTarget).html();
	var item=Item.find_by_titulo(txt_producto);
	item.destroy();
	app.trigger('showItems');
}

//executes onChange of txtSearchProducto
function doSearchProductos(event){
	var txt_producto = $(event.currentTarget).val();
	var results = Producto.select(function() {
	  return this.attr("titulo").toLowerCase().indexOf(txt_producto.toLowerCase()) > -1
	}).all();
	app.trigger('showProductos',{results: results});
}

$(document).ready(function(){
	app = $.sammy('body', function() {
		this.use(Sammy.JSON);
		this.use(Sammy.Storage);
		this.use(Sammy.Template, 'erb');
		this.debug = true;

		this.get('#/',function(){
			hideAllDivs();
			$('.half').hide();
			$('#loading').show();
			$('.pdfBtn').hide();
			$('.pdfBtn').html('Print');
		});

		this.get('#select/',function(){
			hideAllDivs();
			var results = Producto.all();
			app.trigger('showProductos',{results: results});
			$('#select').show();
		});

	this.get('#print/',function(){
		hideAllDivs();
		$('.pdfBtn').show();
		$('.pdfBtn').html('Print');
		
		$('.titulo').html($('#txt_titulo').html());
		
		if(Item.count()==1){
			$('.half').show();
			$('.full').hide();
			
			$('#printHalf').show();
			app.trigger('showPrintItem');
			
		}
		else{
			$('.full').show();
			$('.half').hide();
			
 			$('#printFull').show();
			app.trigger('showPrintItems');
			
		}
		});
		
		this.get('#toPdf/',function(){
			$('.pdfBtn').html('');
			$('.pdfBtn').hide();
			var context = this;
			var html = $('body').html();
			var j = encodeURIComponent(html);
			store.set('html',html);
			window.location = '/print';
		//	$.ajax({
			//	url: "/toPdf",
			//	data: "html=" + j,
			//	type:"POST",
		//		context: document.body,
		//		success: function(data){
		//			context.trigger('handleToPdf',{all: data});
		//		},
		//		error: function(re,text,error) {
		//			context.trigger('handleToPdfError',{request: re , text: text , error: error});
		//		}
		//	});
		});

		this.bind('handleToPdf',function(e, data){
			alert(data);
		});

		this.bind('handleToPdfError',function(e, data){
			alert(data);
		});

		this.bind('loadRemoteData',function(){
			var context = this;
			$.ajax({
				url: "/getData",
				type:"GET",
				context: document.body,
				success: function(data){
					context.trigger('handleLoadRemoteData',{all: data});
				},
				error: function(re,text,error) {
					context.trigger('handleLoadRemoteDataError',{request: re , text: text , error: error});
				}
			});
		});

		this.bind('handleLoadRemoteData', function(e, data) {
			var context =this;
			var productos = JSON.parse(data['all']);
			$.each(productos, function(i, item) {
				var producto = new Producto(item);
				var features = producto.attr('especs');
				var lis = features.split(',');
				var newVal='';
				for(i in lis){
					newVal += '<li>' + lis[i] + '</li>';
				}
				 producto.attr('especs', newVal);
				producto.save();
			});
			context.redirect('#select/');
		});

		this.bind('handleLoadRemoteDataError', function(e, data) {
			alert(data);
		});

 
		this.bind('showProductos', function(e, data) {
			var context = this;
			tempproductos = data['results']
			$('.productosList').html(' ');
			$.each(tempproductos, function(i, item) {
				context.partial('/templates/producto_select_b.html.erb', {item: item,index: i}, function(html) {
					$('.productosList').append(html);
				});
			});
		});

 			this.bind('showItems', function(e, data) {
				var context = this;
			var	tempproductos = Item.all();
				$('.selectedList').html(' ');
				$.each(tempproductos, function(i, item) {
					context.partial('/templates/producto_item_b.html.erb', {item: item,index: i}, function(html) {
						$('.selectedList').append(html);
					});
				});
			});

 			this.bind('showPrintItems', function(e, data) {
				var context = this;
			var	tempproductos = Item.all();
				$('.itemsList').html(' ');
				$.each(tempproductos, function(i, item) {
					context.partial('/templates/producto_print_b.html.erb', {item: item,index: i}, function(html) {
						$('.itemsList').append(html);
					});
				});
			});
 
 			this.bind('showPrintItem', function(e, data) {
				var context = this;
			var	tempproductos = Item.all();
				$('.itemList').html(' ');
				$.each(tempproductos, function(i, item) {
					context.partial('/templates/producto_detail_a.html.erb', {item: item,index: i}, function(html) {
						$('.itemList').append(html);
					});
				});
			});
			

		this.bind('run', function() {
			var context = this;
			store = new Sammy.Store({name: 'btc-impresiones', element: 'body', type: 'local'});
			context.redirect('#/');
			context.trigger('loadRemoteData');
		});


	});
 
app.run('#/');

});