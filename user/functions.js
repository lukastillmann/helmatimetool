function constructor(user,password) {
	this.name = user;
	this.password = password;
  return this;
}

function test_action() {
	this.times.invalidate();
	res.write(this.times.list().length + '<br>');
	dbg(root.user.list());
}

function xxx_action() {
	res.write('xxx');
}
