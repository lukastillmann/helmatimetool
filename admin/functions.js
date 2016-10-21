function constructor(name,title) {
  this.name = name;
  this.title = title;
  this.createtime = new Date();
  return this;
}

function editme_action() {
  res.debug(this.name);
  res.debug(this.href());
  res.write(this.name);
  if (req.data.submit) {
    this.name = req.data.name;
    res.write('Admin changed: ' + req.data.name);
    res.redirect('../../listAdmin');
  }
  this.renderSkin('editme');
}

function removeme_action() {
  res.write(this.name + ' wurde entfernt');
  this.remove();
  res.redirect('../../listAdmin');

}
