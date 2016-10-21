function constructor(name,begintime,projectid,typeid) {
  this.name = name;
  this.begintime = begintime || new Date();
  this.time = begintime || new Date();
  this.day =  new Date(begintime.setHours(0,0,0,0)) || new Date().setHours(0,0,0,0);
  this.user = root.user.get(session.user.name)._id;
	this.projectid = projectid;
	this.typeid = typeid;
  return this;
}

function removeme_action() {
  res.write(this.name + ' wurde entfernt');
  this.remove();
	res.write('<br><a href="../../timetool">zurück zur Übersicht</a>');
  res.redirect(root.href());
}

function editme_action() {
	var param = {};
	param.id = this._id;


  this.renderSkin('edittimes', param);
}

function edittime_action() {
	if (req.data.submit) {
		app.log(req.data);
		var begintime = root.parseTimeFormData(req.data.day, req.data.time);
		this.begintime = begintime;
		this.name = req.data.name;
		this.time = begintime;
		this.day = new Date(begintime.setHours(0,0,0,0))
		this.typeid = req.data.typeid;
		this.projectid = req.data.projectid;
		res.redirect(root.href());
	}

}

function editTimes_macro() {
  var now = this.begintime;
  // zur vollen Viertelstunde runden;
	/*
  var minutes = now.getMinutes();
  var minMod = now.getMinutes() % 15;
  if (minMod > 7) {
    now.setMinutes(now.getMinutes() + (15 - minMod));
  } else {
    now.setMinutes(now.getMinutes() - minMod);
  }
	*/
  minutes = now.getMinutes();
  
  res.write('<form method="POST" action="editme">' 
    + '<div class="row"><div class="tt-addtimes__time form-group">'
      + '<div class="col-xs-12">'
        + '<input autofocus type="text" class="tt-addtimes__input tt-addtimes__input--year form-control" name="year" value="' + now.getFullYear() + '">'
        + '<input type="text" class="tt-addtimes__input tt-addtimes__input--month form-control"  name="month" value="' + (now.getMonth()+1) + '">'
        + '<input type="text" class="tt-addtimes__input tt-addtimes__input--day form-control"   name="day" value="' + now.getDate() + '">'
      + '</div>'
      + '<div class="col-xs-12">'
        + '<input type="text" class="tt-addtimes__input tt-addtimes__input--hours form-control"   name="hours" value="' + now.getHours() + '">'
        + '<select class="tt-addtimes__input tt-addtimes__input--minutes form-control" name="minutes">'
          + '<option value=0 ' + ( (minutes==0) ? 'selected' : '')  + '>0</option>'
          + '<option value=15 ' + ( (minutes==15) ? 'selected' : '')  + '>15</option>'
          + '<option value=30 ' + ( (minutes==30) ? 'selected' : '')  + '>30</option>'
          + '<option value=45 ' + ( (minutes==45) ? 'selected' : '')  + '>45</option>'
        + '</select>'
      + '</div>'
    + '</div></div>'
    + '<div class="row"><div class="tt-addtimes__name form-group">'
      + '<textarea class="tt-addtimes__input tt-addtimes__input--name form-control" name="name" required="true" placeholder="Aktivität">' + this.name + '</textarea>'
    + '</div>'
    + '<div class="submitTime">'
      + '<input type="submit" class="btn" name="submit" value="Ok">'
    + '</div></div>'
    + '</form>');
}
