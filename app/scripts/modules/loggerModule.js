/**
 * Module pour la gestion des logs.
 *
 * @author Thomas Girault
 */
var loggerModule = angular.module('app.logger', []);

/**
 * Factory permettant de créer une instance de logger.
 */
loggerModule.factory('logger', function() {
    var logger = {};

    /** Attribut privé. */
    var active = true; // Par défaut, le logger est activé

    /**
     * Méthode (privée) permettant de récupérer la date et l'heure courante.
     */
    var currentDateTime = function() {
        var currentdate = new Date();
        var datetime = currentdate.getDate() + '/' +
            (currentdate.getMonth() + 1) + '/' +
            currentdate.getFullYear() + ' ' +
            currentdate.getHours() + ':' +
            currentdate.getMinutes() + ':' +
            currentdate.getSeconds();
        return datetime;
    };

    /**
     * Méthode pour activer les logs.
     */
    logger.turnOn = function() {
        active = true;
    };

    /**
     * Méthode pour désactiver les logs.
     */
    logger.turnOff = function() {
        active = false;
    };

    /**
     * Méthode pour logger un message précédé de la date et de l'heure, avec le niveau d'alerte souhaité.
     */
    logger.log = function(msg, type) {
        var type = type || '';

        if (console && active) { // si la console de JavaScript existe et que le service est actif
            var message = currentDateTime() + ' - ' + msg;

            switch (type) {
                case 'e':
                    console.error(message);
                    break;
                case 'w':
                    console.warn(message);
                    break;
                case 'i':
                    console.info(message);
                case 'd':
                    console.debug(message);
                    break;
                default:
                    console.log(message);
                    break;
            }
        }
    };

    return logger;
});