function constructor(user,password) {
	this.name = user;
	this.password = password;
  return this;
}

function test_action() {
	this.times.invalidate();
	res.write(this.times.list().length + '<br>');
}

function xxx_action() {
	res.write('xxx');
}
