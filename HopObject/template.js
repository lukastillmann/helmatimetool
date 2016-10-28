// renders a template

function tmpl(content) {
	var out = '', param = {};
	param.title = content.title || "";
	param.content = content.body || "";
	param.fullscreen = content.fullscreen || "";
	this.renderSkin("template", param);
}

function sideBar_macro(param) {
	if (param.fullscreen == "fullscreen" ) {
		return;
	} else {
		this.renderSkin("sidebar");
	}
}

function navbar_macro(param) {
	var out = '';
	out += this.renderSkinAsString('navbar');
	res.write(out);
}
