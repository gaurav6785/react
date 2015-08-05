/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

	app.ALL_OURDESIGNZS = 'all';
	app.ACTIVE_OURDESIGNZS = 'active';
	app.COMPLETED_OURDESIGNZS = 'completed';
	var OurdesignzFooter = app.OurdesignzFooter;
	var OurdesignzItem = app.OurdesignzItem;

	var ENTER_KEY = 13;

	var OurdesignzApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.ALL_OURDESIGNZS,
				editing: null
			};
		},

		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/': setState.bind(this, {nowShowing: app.ALL_OURDESIGNZS}),
				'/active': setState.bind(this, {nowShowing: app.ACTIVE_OURDESIGNZS}),
				'/completed': setState.bind(this, {nowShowing: app.COMPLETED_OURDESIGNZS})
			});
			router.init('/');
		},

		handleNewOurdesignzKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = React.findDOMNode(this.refs.newField).value.trim();

			if (val) {
				this.props.model.addOurdesignz(val);
				React.findDOMNode(this.refs.newField).value = '';
			}
		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			this.props.model.toggleAll(checked);
		},

		toggle: function (ourdesignzToToggle) {
			this.props.model.toggle(ourdesignzToToggle);
		},

		destroy: function (ourdesignz) {
			this.props.model.destroy(ourdesignz);
		},

		edit: function (ourdesignz) {
			this.setState({editing: ourdesignz.id});
		},

		save: function (ourdesignzToSave, text) {
			this.props.model.save(ourdesignzToSave, text);
			this.setState({editing: null});
		},

		cancel: function () {
			this.setState({editing: null});
		},

		clearCompleted: function () {
			this.props.model.clearCompleted();
		},

		render: function () {
			var footer;
			var main;
			var ourdesignzs = this.props.model.ourdesignzs;

			var shownOurdesignzs = ourdesignzs.filter(function (ourdesignz) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_OURDESIGNZS:
					return !ourdesignz.completed;
				case app.COMPLETED_OURDESIGNZS:
					return ourdesignz.completed;
				default:
					return true;
				}
			}, this);

			var ourdesignzItems = shownOurdesignzs.map(function (ourdesignz) {
				return (
					<OurdesignzItem
						key={ourdesignz.id}
						ourdesignz={ourdesignz}
						onToggle={this.toggle.bind(this, ourdesignz)}
						onDestroy={this.destroy.bind(this, ourdesignz)}
						onEdit={this.edit.bind(this, ourdesignz)}
						editing={this.state.editing === ourdesignz.id}
						onSave={this.save.bind(this, ourdesignz)}
						onCancel={this.cancel}
					/>
				);
			}, this);

			var activeOurdesignzCount = ourdesignzs.reduce(function (accum, ourdesignz) {
				return ourdesignz.completed ? accum : accum + 1;
			}, 0);

			var completedCount = ourdesignzs.length - activeOurdesignzCount;

			if (activeOurdesignzCount || completedCount) {
				footer =
					<OurdesignzFooter
						count={activeOurdesignzCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						onClearCompleted={this.clearCompleted}
					/>;
			}

			if (ourdesignzs.length) {
				main = (
					<section className="main">
						<input
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeOurdesignzCount === 0}
						/>
						<ul className="ourdesignz-list">
							{ourdesignzItems}
						</ul>
					</section>
				);
			}

			return (
				<div>
					<header className="header">
						<h1>React</h1>
						<input
							ref="newField"
							className="new-ourdesignz"
							placeholder="What needs to be done?"
							onKeyDown={this.handleNewOurdesignzKeyDown}
							autoFocus={true}
						/>
					</header>
					{main}
					{footer}
				</div>
			);
		}
	});

	var model = new app.OurdesignzModel('react-ourdesignzs');

	function render() {
		React.render(
			<OurdesignzApp model={model}/>,
			document.getElementsByClassName('ourdesignzapp')[0]
		);
	}

	model.subscribe(render);
	render();
})();
