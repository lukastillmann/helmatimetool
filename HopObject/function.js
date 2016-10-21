function analyze_action() {
  res.write(this.href());
}

function notfound_action() {
	res.write('nix gefunden');
}

function info_action() {
  res.write("HELLO " + this._prototype.toUpperCase() + " " + this._id);
}

function href_macro(param) {
	var action = param.action ? param.action : "";
	res.write(this.href(action));
	return;
}

function skin_macro(param) {
	this.renderSkin(param.name);
	return;
}
