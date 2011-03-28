var selectedProducts=""; 


$(document).ready(function(){
	activateDragDrop();
	activateErase();
	$('#txtSearch').bind('change',function(){
      doSearch(); 
	});
});


function doSearch(){
	var currentVal = $('#txtSearch').val();
	
	$('.productList .name').each(function(){
		var currentItem = $(this).html();
		var res = currentItem.toLowerCase().search(currentVal.toLowerCase());
		if(res==-1){
			$(this).parent().hide();
		}
		else{
			$(this).parent().show();
		}
		
	});	
}
 

function activateErase(){
 
}

function activateDragDrop(){
	$(".producto").draggable({ revert: true,revertDuration:0,zIndex: 2700 ,helper: 'clone'  });
	$( "#selectedBox" ).droppable({
		drop: dropProduct
	});	
}


function dropProduct(event,ui){
	var name = ui.helper.find('.name').html();
	var test = selectedProducts.toLowerCase().search(name.toLowerCase());
	if(test==-1){
		selectedProducts +=name + " ";
		ui.helper.removeClass('ui-draggable');
		ui.helper.removeClass('ui-draggable-dragging');
		ui.helper.attr('style','')
		$('#selectedBox').append('<div class="producto">'+ui.helper.html() + '</div>');
		
		$('#selectedBox .producto').dblclick(function(){

			$(this).remove();
			var clickedName = $(this).find('.name').html();
			selectedProducts = selectedProducts.replace(clickedName,'');
		});
		
	}
		//window.alert(ui.helper.find('.name').html());
}