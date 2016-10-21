function constructor(args) {
	this.id = args.id;
  this.projectid = args.projectid;
  this.begintime = args.begintime || new Date();
	this.category = args.category;
  this.time = args.begintime || new Date();
  this.day =  new Date(args.begintime.setHours(0,0,0,0)) || new Date();
  return this;
}

function test_action() {
	res.write(this.href());
}

