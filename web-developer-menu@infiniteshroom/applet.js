const Applet = imports.ui.applet;
const PopupMenu = imports.ui.popupMenu;
const Gettext = imports.gettext.domain('cinnamon-extensions');
const _ = Gettext.gettext;
const Util = imports.misc.util;
const Lang = imports.lang; 

//applet command constants
var CommandConstants = new function() {
	this.COMMAND_START_APACHE = "gksu service apache2 restart";
	this.COMMAND_STOP_APACHE = "gksu service apache2 stop";
	this.COMMAND_START_MYSQL = "gksu service mysql restart";
	this.COMMAND_STOP_MYSQL = "gksu service mysql stop";
	this.COMMAND_APACHE_CONFIG_EDIT = "gksu gedit /etc/apache2/sites-enabled/000-default";
	this.COMMAND_PHP_CONFIG_EDIT = "gksu gedit /etc/php5/apache2/php.ini";
	this.COMMAND_OPEN_PHPMYADMIN = "xdg-open http://localhost/phpmyadmin/";
	this.COMMAND_OPEN_WEBROOT = "gksu nautilus /var/www/";
}


function MyApplet(orientation){
    this._init(orientation);
}



MyApplet.prototype = {
    __proto__: Applet.IconApplet.prototype,

    _init: function(orientation){
        Applet.IconApplet.prototype._init.call(this, orientation);
        this.set_applet_icon_name("apacheconf");
        this.set_applet_tooltip("WebMenu");
        
        //setup a new menuManager and add the main context main to the manager
		this.menuManager = new PopupMenu.PopupMenuManager(this);
		this.menu = new Applet.AppletPopupMenu(this, orientation);
		this.menuManager.addMenu(this.menu);
		
		//add two Toggle buttons one for Apache and one for mysql
		this.apacheEnabledSwitch = new PopupMenu.PopupSwitchMenuItem(_("Apache Web Server"), true);
		this.mysqlEnabledSwitch = new PopupMenu.PopupSwitchMenuItem(_("MySQL Database"), true)
		this.menu.addMenuItem(this.apacheEnabledSwitch);
		this.menu.addMenuItem(this.mysqlEnabledSwitch);
		
		//add a separator to separate the toggle buttons and actions
		this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());


		this.menu.addAction(_("Open Web Root"), function(event) {
						Util.spawnCommandLine(CommandConstants.COMMAND_OPEN_WEBROOT);


		});

		this.menu.addAction(_("Launch phpMyAdmin"), function(event) {
						Util.spawnCommandLine(CommandConstants.COMMAND_OPEN_PHPMYADMIN);


		});

		this.menu.addAction(_("Edit default php.ini"), function(event) {
						Util.spawnCommandLine(CommandConstants.COMMAND_PHP_CONFIG_EDIT);
		});

		this.menu.addAction(_("Edit Apache Conf"), function(event) {
						Util.spawnCommandLine(CommandConstants.COMMAND_APACHE_CONFIG_EDIT);
		});




		this.apacheEnabledSwitch.connect('toggled', Lang.bind(this, this.onapacheSwitchPressed));
		this.mysqlEnabledSwitch.connect('toggled', Lang.bind(this, this.onmysqlSwitchPressed));
    },

	on_applet_clicked: function(){
		this.menu.toggle();
    },

    onapacheSwitchPressed: function(item){
		if(item.state){
			Util.spawnCommandLine(CommandConstants.COMMAND_START_APACHE);
		}
		
		else {
			Util.spawnCommandLine(CommandConstants.COMMAND_STOP_APACHE);
		}
    },
    
     onmysqlSwitchPressed: function(item){
		if(item.state){
			Util.spawnCommandLine(CommandConstants.COMMAND_START_MYSQL);
		}
		
		else {
			Util.spawnCommandLine(CommandConstants.COMMAND_STOP_MYSQL);
		}
    },
}


function main(metadata, orientation){
    let myApplet = new MyApplet(orientation);
    return myApplet;
}
