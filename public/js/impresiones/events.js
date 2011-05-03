$(document).ready(function(){
	app = $.sammy('body', function() {
		
		this.bind('handleLogin',function(){
			var context = this;
			username = $('#txt_username').val();
			password = $('#txt_password').val();
			token = $('#txt_token').val();
			
			store.set('username',username);
			store.set('password',password);
			store.set('token',token);
			
			context.trigger('loadRemoteData');
		});

		this.bind('handleLoginError',function(e,data){
			var context = this;
			var re = data['request'];
			if(re.status==500){
				$('#txt_username').val(username);
				$('#txt_password').val(password);
				$('#txt_token').val(token);
				alert('Error haciendo login');
			}
			else if(re.status==404){
				alert('Trabajando Off-Line');
				if(store.get('authKey')==null){
					alert('No encontramos una session anterior, para hacer Login debe estar conectado a Internet.');
				}
			}
		});
		
		
	});
});