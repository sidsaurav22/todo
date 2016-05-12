$(document).ready(function(){


	var current_fs, next_fs, previous_fs;

	$(".next").click(function(){
		current_fs = $(this).parent().parent();
		next_fs = $(this).parent().parent().next();
		next_fs.show();
		current_fs.hide();
	});

	$(".previous").click(function(){
		current_fs = $(this).parent().parent();
		previous_fs = $(this).parent().parent().prev();
		previous_fs.show();
		current_fs.hide();
	});

	$("#loginButton").click(function(){
		$.ajax({
			url: '/login',
			data:{
				"email":$('#loginEmail').val(),
				"password":$('#loginPassword').val()
			},
			success: function(data) {
			  location.reload();
			},
			type: 'POST'
		});
		return false;
	});
	$('#loginForm').submit(function(e){e.preventDefault();});

	$("#signUp2").click(function(){
		//check all fields (verify user input)
		$.ajax({
			url: '/signup',
			data:{
				"email":$('#signupEmail').val(),
				"password":$('#signupPassword').val(),
				"firstName":$('#firstName').val(),
				"lastName":$('#lastName').val(),
			},
			success: function(data) {
				location.reload();
			},
			type: 'POST'
		});
		return false;
	});


});
