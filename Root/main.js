/* Main Action and others */

function xmain_action() {
	var content = {}, out = '';	
	// first we try to auto-login the user 
	if (req.data.autoLoginName && root.users.get(req.data.autoLoginName)) { 
		var usr = this.user.get(req.data.autoLoginName); 
		var hash = Packages.helma.util.MD5Encoder.encode(usr.name + usr.password); 
		if (hash == req.data.autoLoginHash) session.login(usr); 
  } 
 
  // display link to login, resp logout 
  if (session.user != null) { 
		res.redirect(root.href());
  } else { 
		res.redirect(root.href("login"));
  } 
 
  // list all Users 
	/* 
	out += "<hr>";
	out += "<h2>Users</h2>";
  for (var i=0; i<this.user.count(); i++) { 
	 out += "<li>" + root.user.get(i).name;
  }
	*/
	content.body = out; 
	content.title = "Helma Timetool";
	// this.tmpl(content);
	res.write(out);
  return; 
}

function notfound_action() {
	res.write("Ups, irgendwas ist schief gelaufen. Sorry :-/");
}

/* User  Module */

function login_action() {
	if (req.data.login) {
		var name = req.data.username;
		var pass = req.data.password;
		var usr = this.user.get(name);
		if (usr && usr.password == pass) {
			session.login(usr);
			var hash = Packages.helma.util.MD5Encoder.encode(name + pass); 
			res.setCookie("autoLoginName", name, 30);
			res.setCookie("autoLoginHash", hash, 30);
			res.write("Login successfull");
			res.redirect(root.href());
		} else {
			res.write("Login failed");
		}

	}
	var content = {};
	content.body = this.renderSkinAsString("login");
	content.fullscreen = "fullscreen";
	this.tmpl(content);
}

function logout_action() {
	session.logout();
	res.setCookie("autoLoginName", "");
	res.setCookie("autoLoginHash", "");
	res.write('logged out');
	res.redirect(root.href());
}

function register_action() {
	if (req.data.login) {
		var name = req.data.username;
		var pass = req.data.password;
		if (root.users.get(name) == null && pass) {
			var usr = new User(name,pass);
			root.user.add(usr);
			session.login(usr);
			res.redirect(root.href());
		} else {
			res.write("User existiert bereits");
		}
	}
	this.renderSkin("register");
}
