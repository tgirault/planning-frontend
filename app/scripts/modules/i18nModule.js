/**
 * Module pour l'i18n.
 *
 * @author Thomas Girault
 * @dependsOn app.logger pour la gestion des logs.
 */
var i18nModule = angular.module("app.i18n", ["app.logger"]);

/**
 * Factory permettant de créer une instance de localisation.
 *
 * @param $http le service http
 * @param $rootScope le scope de l'application
 * @param $window le service window
 * @param logger le logger
 * @return une instance de localisation.
 */
i18nModule.factory("localization", ["$http", "$rootScope", "$window", "logger",
    function($http, $rootScope, $window, logger) {
        logger.log("Chargement du module d'i18n");
        
        var languages = ["en", "fr"]; // Liste des langues traduites
        var countries = ["US", "EN", "FR"]; // Liste des pays disponibles
        
        var localization = {};

        /**
         * Méthode pour changer la locale.
         *
         * @param locale une locale
         */
        localization.setLocale = function(locale) {
            logger.log("Locale [" + locale + "]", 'd');
            // On récupère la locale
            localization.locale = locale;
            // On récupère le code langue de la locale
            localization.language = (matches = locale.match(/[a-z]{2}/g)) ? matches[0] : "";
            // On récupère le code pays de la locale
            localization.country = (matches = locale.match(/[A-Z]{2}/g)) ? matches[0] : "";
            // On charge le dictionnaire des traductions pour la langue
            localization.loadResourceBundle(localization.language);
        };

        /** 
         * Méthode pour charger un fichier de ressources.
         *
         * @param language une langue
         */
        localization.loadResourceBundle = function(language) {
            var url = "i18n/resources-locale_" + language + ".json";
            $http({
                method: "GET",
                url: url,
                cache: false
            }).success(function(data) {
                logger.log("Chargement du fichier ressources " + url, 'd');
                localization.dictionary = data;
                return $rootScope.$broadcast("localizeResourcesUpdated");
            }).error(function(data, status, headers, config) {
                logger.log("Aucun fichier ressources pour la langue " + language, 'e');
                localization.dictionary = void 0;
                return $rootScope.$broadcast("localizeResourcesUpdated")
            })
        };

        /**
         * Méthode pour traduire une valeur.
         *
         * @param value une valeur
         */
        localization.translate = function(value) {
            var translation = "";
            if (localization.dictionary && value) {
                if (translation === localization.dictionary[value]) {
                    logger.log("Aucune traduction n'a été trouvée pour le message " + value, 'e');
                    translation = value;
                } else {
                    translation = localization.dictionary[value];
                }
            } else {
                translation = value;
            }
            return translation;
        }
        
        // Par défaut, on récupère la locale du navigateur
        localization.locale = ($window.navigator.language || $window.navigator.userLanguage || $window.navigator.locale);
        // Par défaut, on récupère le code langue de la locale
        localization.language = (matches = localization.locale.match(/[a-z]{2}/g)) ? matches[0] : "";
        // Par défaut, on récupère le code pays de la locale
        localization.country = (matches = localization.locale.match(/[A-Z]{2}/g)) ? matches[0] : "";
        localization.dictionary = void 0;

        // Si la langue n'est pas traduite
        if ($.inArray(localization.language, languages) < 0) {
            localization.language = "en";
        }

        // Si le pays n'est pas disponible
        if ($.inArray(localization.country, countries) < 0) {
            localization.country = (localization.language === "en") ? "EN" : "FR";
        }
        localization.loadResourceBundle(localization.language);
        
        return localization;
    }
]);

/**
 * Directive i18n pour l'internationalisation des libellés.
 *
 * @param localization une instance de localisation
 */
i18nModule.directive("i18n", ["localization",
    function(localization) {
        var i18nDirective;
        return i18nDirective = {
            restrict: "EA", // A pour les attributs, E pour les éléments
            updateText: function(element, input) {
                var translation = localization.translate(input);
                element.text(translation);
            },
            link: function(scope, element, attributes) {
                scope.$on("localizeResourcesUpdated", function() {
                    return i18nDirective.updateText(element, attributes.i18n)
                });
                attributes.$observe("i18n", function(value) {
                    return i18nDirective.updateText(element, value)
                });
            }
        }
    }
]);

/**
 * Directive i18n pour l'internationalisation des placeholder.
 *
 * @param localization une instance de localisation
 */
i18nModule.directive("i18nPlaceholder", ["localization",
    function(localization) {
        var i18nDirective;
        return i18nDirective = {
            restrict: "EA", // A pour les attributs, E pour les éléments
            updateText: function(element, placeholder) {
                var translation = localization.translate(placeholder);
                element.attr("placeholder", translation);
            },
            link: function(scope, element, attributes) {
                scope.$on("localizeResourcesUpdated", function() {
                    return i18nDirective.updateText(element, attributes.i18nPlaceholder)
                });
                attributes.$observe("i18nPlaceholder", function(value) {
                    return i18nDirective.updateText(element, value)
                });
            }
        }
    }
]);

/**
 * Contrôleur pour la gestion du changement de langue.
 *
 * @param $scope la portée du contrôleur
 * @param logger le logger
 * @param localization la localisation
 */
i18nModule.controller("LanguageController", ["$scope", "logger", "localization",
    function($scope, logger, localization) {

        $scope.country = localization.country; // Pays par défaut

        /**
         * Méthode pour changer le pays.
         *
         * @param country un pays
         */
        $scope.setCountry = function(country) {
            switch (country) {
                case "EN":
                    localization.setLocale("en-EN");
                    break;
                case "US":
                    localization.setLocale("en-US");
                    break;
                case "FR":
                    localization.setLocale("fr-FR");
                    break;
                default:
                    localization.setLocale("en-EN");
                    break;
            }
            return $scope.country = localization.country;
        }

        /**
         * Méthode pour récupérer le nom de la classe css du drapeau correspondant à la langue.
         *
         * @return retourne le nom de la classe css du drapeau correspondant à la langue.
         */
        $scope.getFlag = function() {
            return "flag-" + localization.country;
        }
    }
]);