/* Times Moduls */
/* Skins: 
 * main.skin
 */

function main_action() {
	checkLogin();
	var content = {};

  if (req.data.submit) {
		this.addTimes(req.data);
		res.redirect(root.href());
  }

	content.body = this.renderSkinAsString('main'); 
	content.title = "Helma Timetool";

	this.tmpl(content);
}

/* 
 * List Times 
 */
function listTimes_macro() {
	var out = '';
	var params = {};
	var time;
	var day;
	var timeslist = root.user.get(session.user.name).days;
	var durations = {}
	var durationsDay = {};

	/* get duration from sql statement */
	var db = getDBConnection('lukas');
	var dbRowset = db.executeRetrieval('select id,extract(epoch from ((lead(my_begintime) over (partition by my_day order by my_begintime asc)) - my_begintime))/60 as "duration", extract ( epoch from (( my_day + interval \'1\' day) - my_begintime))/60  as "end of day" from my_times;');
	while (dbRowset.next()) {
		durations[dbRowset.getColumnItem("id")] = dbRowset.getColumnItem("duration");	
	}
	/* get duration by day */
	dbRowset = db.executeRetrieval('select my_day, sum(duration) from (select id, name, my_day, my_begintime, extract(epoch from ((lead(my_begintime) over (partition by my_day order by my_begintime asc)) - my_begintime))/60 as "duration" from my_times) as durations group by my_day;');
	while (dbRowset.next()) {
		durationsDay[dbRowset.getColumnItem("my_day")] =  dbRowset.getColumnItem("sum");
	}


	/* params needed */
	params = {
					header: 'Mo, 10. Oktober 2016',
					dayid: '0',
					timeid: '0',
					time: '8:45',
					description: '',
					project: '',
					type: '',
					duration: '---',
					durationday: '---',
					removelink: '',
					editlink: ''
	};

	for (var i = 0; i < timeslist.count(); i++) {
		day = timeslist.list();
		params.dayid = i;
		params.header = this.parseFullDate(day[i].groupname);
		var tmpday = day[i].groupname.split('-');
		params.durationday = this.getDurationsIntervalFromMinutes(durationsDay[new Date(tmpday[0], tmpday[1]-1, tmpday[2])]);
		out += this.renderSkinAsString('listtimes__header', params);
		out += '<div class="listtimes__body">';
		for (var j = 0; j < timeslist[i].count(); j++) {
			time = timeslist[i][j];
			params.timeid = time._id;
			params.time = this.getTime(time.begintime);
			params.description = time.name;
			params.project = this.getProject(time.projectid);
			params.type =  this.getType(time.typeid) || 'Kern';
			params.removelink = time.href("removeme");
			params.editlink = time.href("editme");

			params.duration = this.getDurationsIntervalFromMinutes(durations[time._id]);
			
			out += this.renderSkinAsString('listtimes__row', params);
		}
		out += '</div>';
		out += '</div>';
	}
	res.write(out);
}

function addTimesForm_macro(param) {
	var list;
	var out = '';
	var value = param.value;

	switch (param.part) {
		case 'projects' :
			list = root.project.list();
			for (var i = 0; i < list.length; i++) {
				if (list[i].id == value) {
					out += '<option selected value=' + list[i].id + '>' + list[i].name + '</option>';
				} else {
					out += '<option value=' + list[i].id + '>' + list[i].name + '</option>';
				}
			}
			break;
		case 'type' :
			list = root.type.list();
			for (var i = 0; i < list.length; i++) {
				if (list[i].id === value) {
					out += '<option selected value=' + list[i].id + '>' + list[i].name + '</option>';
				} else {
					out += '<option value=' + list[i].id + '>' + list[i].name + '</option>';
				}
			}
			break;
	}
	return out;
}

/* 
 * Actions
 * */

function actions_action(param) {
	app.log(req.data);
	switch (req.data.action) {
		case 'leavenow' :
			var data = {
				typeid : '1'
			}
			this.addTimes(data);
			break;
		case 'bulkdelete': 
			break;
	}
	res.redirect(root.href());
}

/* 
 * Bulk Delete 
 * */

function bulkdelete_action() {
	if (req.data) {
		var ids = req.data.ids_array;
		for (var i = 0; i < ids.length; i++) {
			root.time.get(ids[i]).remove();
		}
	}
	res.redirect(root.href());
}

/* Utility Functions 
 */

/* 
 * Format duration in seconds to '2h 30min' format 
 * */

function getDurationsIntervalFromMinutes(m) {
	var out = '';

	if (!m) {
		out = '-'
	} else {
	var hours = parseInt((m / 60), 10);
	var minutes = parseInt((m - (hours * 3600) / 60));

	if (hours) {
		out += hours + 'h ';
	}
	if (minutes) {
		out += minutes + 'm'; 
	}
	}
	return out;
}

function getTodaysDuration_macro() {
	var duration;
	var db = getDBConnection('lukas');
	var rows = db.executeRetrieval('select my_day, sum(duration) from (select id, name, my_day, my_begintime, extract(epoch from ((lead(my_begintime) over (order by my_begintime asc)) - my_begintime))/60 as "duration" from my_times where my_day = current_date) as durations group by my_day;');
	while (rows.next()) {
		duration = this.getDurationsIntervalFromMinutes(rows.getColumnItem('sum'));
	}
	res.write(duration);
}

/* 
 * Add new entry to time collection
 */
function addTimes(data) {
	var name = data.name;
	var typeid = data.typeid;
	var projectid = data.projectid;
	if (data.day && data.time) {
		var begintime = this.parseTimeFormData(data.day, data.time);
	} else {
		var begintime = new Date();
	}
	var a = new time(name, begintime, projectid, typeid);
	this.time.add(a);
}

/*
 * parse form entry to date create object
 * parameter format: 
 * d = dd.mm.
 * t = hh:mm
 */

function parseTimeFormData(d, t) {
	d = d.split('.');
	t = t.split(':');
	var time = new Date(2016,(d[1]-1),d[0],t[0],t[1]);
	return time;
}

/*
 * Return  Date Value (or current date) in dd.mm.yy format
 */
function getDay_macro(param) {
	var out = '';
	if (param.value) {
		var t = new Date(param.value);
	} else {
		var t = new Date();
	}
	var d = t.getDate();
	var m = t.getMonth() + 1;
	var y = t.getFullYear().toString().substring(2);
	
	out += d + '.';

	if (m < 10) {
		out += '0' + m;
	} else {
		out += m;
	}
	out += '.' + y;
	return out;
}

/*
 * Return Time in hh:mm format from date parameter or currenct date
 */

function getTime_macro(param) {
	var out = '';
	var t;
	if (param.value) {
		t = new Date(param.value);
	} else {
		t = new Date()
	}
	var h = t.getHours();
	var m = t.getMinutes();

	if (h < 10) {
		out += '0' + h;
	} else {
		out += h;	
	}
	out += ':' + m;
	return out;
}

/* 
 *  output full date format (dd. Month YY)
 *  takes date in this format: yy-mm-dd
 */

function parseFullDate(d) {
	var out ='';
	var months = [
		"Januar", "Februar", "März",
		"April", "Mai", "Juni",
		"Juli", "August", "September",
		"Oktober", "November", "Dezember"
		];
	var days = [
		"So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"
		];

	d = d.split('-');
	d = (new Date(d[0],(d[1]-1),d[2]));

	var day = days[d.getDay()];
	var month = months[d.getMonth()];

	out += day + ', ' + d.getDate() + '. ' + month + ' ' + d.getFullYear(); 

	return out;
}

function getTime(timestring) {
	var time = new Date(timestring);
	var out = '';
	if (time.getMinutes() < 10) {
		out = time.getHours() + ':0' + time.getMinutes();
	} else {
		out = time.getHours() + ':' + time.getMinutes();
	}
	return out;
}

function getType(id) {
	if (root.type.get(id)) {
		return root.type.get(id).name;
	} else {
		return '<small>-</small>';	
	};

}
function getProject(id) {
	if (root.project.get(id)) {
		return root.project.get(id).name;
	} else {
		return '<small>-</small>';	
	};

}

/* addtime action for ajax request */
function addTime_action() {
	if (req.data.name) {
		var begintime = new Date(req.data.year,(req.data.month-1),req.data.day,req.data.hours,req.data.minutes);
		var projectid = req.data.projectid;
		var a = new time(req.data.name, begintime, projectid);
		this.time.add(a);
	}
	res.redirect(root.href());
}


