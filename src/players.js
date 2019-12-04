import $ from 'jquery';
window.jQuery = $;
window.$ = $;

/* Players Object Cosntractor */
var players_obj = {
	player1: '',
	player2: '',
	player3: '',
	player4: '',
	player5: '',
	player6: '',
}

//function selectNumberOfPlayers(){}
$('.wrapper__players').find('button').click(function(){
    $('.wrapper__players').find('button.active').removeClass('active');
	$(this).addClass('active');

    $('ul#listOfPlayers li').show(); // Show all <li>
    var number = $(this).data('hide_pl'); // Find which player must be hidden
    $.each(number,function(index , value){
		// console.log(index + ": " + value);
		$('ul#listOfPlayers').find('li#player'+value).hide();

		$('ul#listOfPlayers').find('li#player'+value+' input').val(""); // Manage Inputs
		$('ul#listOfPlayers').find('li#player'+value+' input').removeClass('valid'); // Manage Input Icons
		$('ul#listOfPlayers').find('li#player'+value+' input').removeClass('invalid'); // Manage Input Icons
		players_obj["player"+value] = ""; // Manage Object
	});
});

$('#listOfPlayers input').focusout(function(){
	var dft_name = $(this).val();

	if(dft_name.length > 1){
	    var player_id = $(this).parent().parent().attr('id');
	    players_obj[player_id] = $(this).val();

    	console.log(players_obj);
	}
});
