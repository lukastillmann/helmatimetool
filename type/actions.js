function constructor(name) {
	this.name = name;
  return this;
}

function test_action() {
	res.write('test');
}

function removeme_action() {
  if (this.time.size() > 0) {
		res.write(this.name + ' kann nicht entfernt werden. Das Projekt enthält gültige Zeiten.')
	} else {
  	res.write(this.name + ' wurde entfernt');
  	this.remove();
	}
	res.write('<br><a href="../../tasktypesettings">zurück zur Übersicht</a>');
  //res.redirect(root.href('adminsettings'));
}

function editme_action() {
	var out = {};
	out.title = this.name;

	out.body = this.renderSkinAsString("typesettings");
	this.tmpl(out);
}
