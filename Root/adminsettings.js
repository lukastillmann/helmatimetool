/* Admin Settings */

function adminsettings_action() {
	this.project.invalidate();

	if (req.data.submit) {
		var a = new project(req.data.name);
		this.project.add(a);
	}

	var out = {
		title: "Project Settings",
	};

	out.body = this.renderSkinAsString('adminsettings');

	//dbg(projectlist.toSource());
	this.tmpl(out);
}

function tasktypesettings_action() {
	this.type.invalidate();
	if (req.data.submit) {
		var a = new type(req.data.name)
		this.type.add(a);
	}

	var out = {
		title: "Project Settings",
	};

	out.body = this.renderSkinAsString('tasktypesettings');

	//dbg(projectlist.toSource());
	this.tmpl(out);
}

function addTime_action() {
	if (req.data.name) {
		this.time.add(a);
	}
}

function addType_macro() {
	var typelist = this.type.list();

	res.write('<h2>Neue Tätigkeit hinzufügen</h2>')
	res.write('<form method="POST" action="tasktypesettings" name="addType">'
			+ '<div class="row"><div class="col-xs-12">'
				+ '<div class="form-group">'
					+ '<label for="name">Tätigkeit</label>'
					+ '<input type="text" class="tt-addproject__input tt-addproject__input--name form-control" name="name">'
				+ '</div>'
				+ '<input type="submit" class="btn" name="submit" value="Abschicken">'
			+ '</div></div>'
			+ '</form>');
	res.write('<h2>Tätigkeiten</h2>');
	res.write('<ul>')
	for (var i = 0; i < typelist.length; i++) {
		res.write('<li><a href="type/' + typelist[i].name + '/editme">' + typelist[i].name + '</a>'); 
	}
	res.write('</ul>');
}

function settings_action() {
	var out = {
		title: "Settings",
		body: "TODO"
	};
	this.tmpl(out);
}

/* Projects */

function addProject_action() {
	if (req.data.name) {
		var a = new project(req.data.name);
		this.project.add(a);
	}
}

function addProject_macro() {
	var projectlist = this.project.list();
	// var groupedlist = buildTree(projectlist);

	res.write('<h2>Neues Projekt hinzufügen</h2>')
	res.write('<form method="POST" action="adminsettings" name="addProject">'
			+ '<div class="row"><div class="col-xs-12">'
				+ '<div class="form-group">'
					+ '<label for="name">Projektname</label>'
					+ '<input type="text" class="tt-addproject__input tt-addproject__input--name form-control" name="name">'
				+ '</div>'
				+ '<input type="submit" class="btn" name="submit" value="Abschicken"'
			+ '</div></div>'
			+ '</form>');
	res.write('<h2>Projekte</h2>');
	res.write('<ul>')
	for (var i = 0; i < projectlist.length; i++) {
		res.write('<li><a href="project/' + projectlist[i].id + '/editme">' + projectlist[i].name + '</a>'); 
	}
	res.write('</ul>');
}
