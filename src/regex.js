// Regex for Names Player
const inputs = document.querySelectorAll('input.playerName__input');
const patterns = {
	player1: /^[a-zA-zΑ-Ωα-ωάέήίϊΐόύϋΰώ ]{2,}$/,
    player2: /^[a-zA-zΑ-Ωα-ωάέήίϊΐόύϋΰώ ]{2,}$/,
    player3: /^[a-zA-zΑ-Ωα-ωάέήίϊΐόύϋΰώ ]{2,}$/,
    player4: /^[a-zA-zΑ-Ωα-ωάέήίϊΐόύϋΰώ ]{2,}$/,
    player5: /^[a-zA-zΑ-Ωα-ωάέήίϊΐόύϋΰώ ]{2,}$/,
    player6: /^[a-zA-zΑ-Ωα-ωάέήίϊΐόύϋΰώ ]{2,}$/,
};
// + at least 1 character
// ? optional previous set ()
function validate(field, regex) {
	if (regex.test(field.value)) {
		field.classList.remove('invalid');
		field.classList.add('valid');
	} else {
		field.classList.remove('valid');
		field.classList.add('invalid');
	}
}

inputs.forEach(function(input) {
	input.addEventListener('keyup', function(e) {
		validate(e.target, patterns[e.target.attributes.name.value]); //px: player1
	});
});
