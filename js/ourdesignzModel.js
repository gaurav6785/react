/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;
	// Generic "model" object. You can use whatever
	// framework you want. For this application it
	// may not even be worth separating this logic
	// out, but we do this to demonstrate one way to
	// separate out parts of your application.
	app.OurdesignzModel = function (key) {
		this.key = key;
		this.ourdesignzs = Utils.store(key);
		this.onChanges = [];
	};

	app.OurdesignzModel.prototype.subscribe = function (onChange) {
		this.onChanges.push(onChange);
	};

	app.OurdesignzModel.prototype.inform = function () {
		Utils.store(this.key, this.ourdesignzs);
		this.onChanges.forEach(function (cb) { cb(); });
	};

	app.OurdesignzModel.prototype.addOurdesignz = function (title) {
		this.ourdesignzs = this.ourdesignzs.concat({
			id: Utils.uuid(),
			title: title,
			completed: false
		});

		this.inform();
	};

	app.OurdesignzModel.prototype.toggleAll = function (checked) {
		// Note: it's usually better to use immutable data structures since they're
		// easier to reason about and React works very well with them. That's why
		// we use map() and filter() everywhere instead of mutating the array or
		// ourdesignz items themselves.
		this.ourdesignzs = this.ourdesignzs.map(function (ourdesignz) {
			return Utils.extend({}, ourdesignz, {completed: checked});
		});

		this.inform();
	};

	app.OurdesignzModel.prototype.toggle = function (ourdesignzToToggle) {
		this.ourdesignzs = this.ourdesignzs.map(function (ourdesignz) {
			return ourdesignz !== ourdesignzToToggle ?
				ourdesignz :
				Utils.extend({}, ourdesignz, {completed: !ourdesignz.completed});
		});

		this.inform();
	};

	app.OurdesignzModel.prototype.destroy = function (ourdesignz) {
		this.ourdesignzs = this.ourdesignzs.filter(function (candidate) {
			return candidate !== ourdesignz;
		});

		this.inform();
	};

	app.OurdesignzModel.prototype.save = function (ourdesignzToSave, text) {
		this.ourdesignzs = this.ourdesignzs.map(function (ourdesignz) {
			return ourdesignz !== ourdesignzToSave ? ourdesignz : Utils.extend({}, ourdesignz, {title: text});
		});

		this.inform();
	};

	app.OurdesignzModel.prototype.clearCompleted = function () {
		this.ourdesignzs = this.ourdesignzs.filter(function (ourdesignz) {
			return !ourdesignz.completed;
		});

		this.inform();
	};

})();
