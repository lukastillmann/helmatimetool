function checkLogin() {
	if (session.user != null) {
		// do nothing
	} else if (req.data.autoLoginName && root.users.get(req.data.autoLoginName)) { 
		var usr = this.user.get(req.data.autoLoginName); 
		var hash = Packages.helma.util.MD5Encoder.encode(usr.name + usr.password); 
		if (hash == req.data.autoLoginHash) session.login(usr); 
	} else {
		res.redirect(root.href('login'));
	}
return;
}

function groupBy(collection, property) {
	var i, propval = [], index;
	properties = [], result = {};
  for ( i = 0; i < collection.length; i++) {
		if (collection[i][property]) {
			propval = collection[i][property].toSource();
		} else {
			propval = 'null';	
		}
    index = properties.indexOf(propval);
		// dbg(propval,index);
    if (index == -1) {
			properties.push(propval);
			result[propval] = []; 
			result[propval].push(collection[i]);
    } else {
			result[propval].push(collection[i]);
    }
  }
  return result;
};

function objectSize(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

function formatDate(time) {
	return time.getDate() + '.' + (time.getMonth() + 1) + '.' + time.getFullYear();
}

function dbg(args) {
	var msg = arguments[0];
	for (var i = 1; i<arguments.length; i++) {
		msg+= ' | ' + arguments[i];
	}
	return res.debug(msg);
}

function testfunction() {
	res.debug('successfull');
}

function alert(msg) {
	res.write("<script>alert('" + msg + "')</script>");
}

function buildTree(arry) {
    var roots = [], children = {};

    // find the top level nodes and hash the children based on parent
    for (var i = 0, len = arry.length; i < len; ++i) {
        var item = arry[i],
            p = item.parentid,
            target = !p ? roots : (children[p] || (children[p] = []));

        target.push({ value: item });
    }

    // function to recursively build the tree
    var findChildren = function(parentid) {
        if (children[parentid.value.id]) {
            parentid.children = children[parentid.value.id];
            for (var i = 0, len = parentid.children.length; i < len; ++i) {
                findChildren(parentid.children[i]);
            }
        }
    };

    // enumerate through to handle the case where there are multiple roots
    for (var i = 0, len = roots.length; i < len; ++i) {
        findChildren(roots[i]);
    }

    return roots;
}

function console(arg) {
	res.write('<script>console.log(decodeURI("' + encodeURI(arg) + '"))</script>');
}
