/**
 * Module principal de l'application.
 *
 * @author Thomas Girault
 */
var applicationModule = angular.module("application", ["ngRoute", "ngResource", "ngCookies", "ngAnimate", "ngMessages", "ui.bootstrap", "mgo-angular-wizard", "textAngular", "ui.tree", "ngMap", "ngTagsInput", "app.logger", "app.i18n"])
    .config(["$routeProvider", "$httpProvider",
        function($routeProvider, $httpProvider) {
            
            $routeProvider.when("/", {
                redirectTo: "/signin"
            }).when("/dashboard", {
                templateUrl: "views/dashboard.html"
            }).when("/referentiels/operations", {
                templateUrl: "views/referentiels/operations.html"
            }).when("/referentiels/accounts", {
                templateUrl: "views/referentiels/accounts.html"
            }).when("/signin", {
                templateUrl: "views/pages/signin.html"
            }).when("/signup", {
                templateUrl: "views/pages/signup.html"
            }).when("/forgot", {
                templateUrl: "views/pages/forgot-password.html"
            }).when("/lock-screen", {
                templateUrl: "views/pages/lock-screen.html"
            }).when("/profile", {
                templateUrl: "views/pages/profile.html"
            }).when("/404", {
                templateUrl: "views/pages/404.html"
            }).when("/500", {
                templateUrl: "views/pages/500.html"
            }).when("/pages/about", {
                templateUrl: "views/pages/about.html"
            }).when("/pages/contact", {
                templateUrl: "views/pages/contact.html"
            }).otherwise({
                redirectTo: "/404"
            });

            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        }
    ]);

/**
 * Directive pour personnaliser le fond d'écran de certaines pages.
 */
applicationModule.directive("customBackground", function() {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$location",
            function($scope, $element, $location) {
                var addBackground, path;
                return path = function() {
                    return $location.path()
                }, addBackground = function(path) {
                    switch ($element.removeClass("body-home body-special body-lock"), path) {
                        case "/":
                            return $element.addClass("body-home");
                        case "/404":
                        case "/500":
                        case "/signin":
                        case "/signup":
                        case "/forgot":
                            return $element.addClass("body-special");
                        case "/lock-screen":
                            return $element.addClass("body-special body-lock");
                    }
                }, addBackground($location.path()), $scope.$watch(path, function(newVal, oldVal) {
                    return newVal !== oldVal ? addBackground($location.path()) : void 0
                })
            }
        ]
    }
});

/**
 * Directive pour réduire ou d'agrandir le menu de navigation.
 */
applicationModule.directive("toggleMinNav", ["$rootScope",
    function($rootScope) {
        return {
            restrict: "A",
            link: function(scope, element) {
                var $content, $nav, $window, Timer, app, updateClass;
                return app = $("#application"), $window = $(window), $nav = $("#nav-container"), $content = $("#content"), element.on("click", function(e) {
                    return app.hasClass("nav-min") ? app.removeClass("nav-min") : (app.addClass("nav-min"), $rootScope.$broadcast("minNav:enabled")), e.preventDefault()
                }), Timer = void 0, updateClass = function() {
                    var width;
                    return width = $window.width(), 768 > width ? app.removeClass("nav-min") : void 0
                }, $window.resize(function() {
                    var t;
                    return clearTimeout(t), t = setTimeout(updateClass, 300)
                })
            }
        }
    }
]);

/**
 * Directive pour déplier un lien du menu de navigation.
 */
applicationModule.directive("collapseNav", [
    function() {
        return {
            restrict: "A",
            link: function(scope, element) {
                var $a, $aRest, $lists, $listsRest, app;
                return $lists = element.find("ul").parent("li"), $lists.append('<i class="fa fa-caret-right icon-has-ul"></i>'), $a = $lists.children("a"), $listsRest = element.children("li").not($lists), $aRest = $listsRest.children("a"), app = $("#app"), $a.on("click", function(event) {
                    var $parent, $this;
                    return app.hasClass("nav-min") ? !1 : ($this = $(this), $parent = $this.parent("li"), $lists.not($parent).removeClass("open").find("ul").slideUp(), $parent.toggleClass("open").find("ul").slideToggle(), event.preventDefault())
                }), $aRest.on("click", function() {
                    return $lists.removeClass("open").find("ul").slideUp()
                }), scope.$on("minNav:enabled", function() {
                    return $lists.removeClass("open").find("ul").slideUp()
                })
            }
        }
    }
]);

/**
 * Directive pour mettre le lien actif du menu de navigation en surbrillance.
 */
applicationModule.directive("highlightActive", [
    function() {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs", "$location",
                function($scope, $element, $attrs, $location) {
                    var highlightActive, links, path;
                    return links = $element.find("a"), path = function() {
                        return $location.path()
                    }, highlightActive = function(links, path) {
                        return path = "#" + path, angular.forEach(links, function(link) {
                            var $li, $link, href;
                            return $link = angular.element(link), $li = $link.parent("li"), href = $link.attr("href"), $li.hasClass("active") && $li.removeClass("active"), 0 === path.indexOf(href) ? $li.addClass("active") : void 0
                        })
                    }, highlightActive(links, $location.path()), $scope.$watch(path, function(newVal, oldVal) {
                        return newVal !== oldVal ? highlightActive(links, $location.path()) : void 0
                    })
                }
            ]
        }
    }
]);

/**
 * Directive pour personnaliser la barre de défilement.
 */
// applicationModule.directive("slimScroll", [

//     function() {
//         return {
//             restrict: "A",
//             link: function(scope, element, attrs) {
//                 return element.slimScroll({
//                     height: attrs.scrollHeight || "100%"
//                 })
//             }
//         }
//     }
// ]);

/**
 * Contrôleur des composants datepicker.
 */
applicationModule.controller("DatePickerController", ["$scope", "localization",
    function($scope, localization) {

        /**
         * Méthode pour récupérer la date du jour.
         */
        $scope.today = function() {
            $scope.dt = new Date();
        };

        /**
         * Méthode pour effacer la date.
         */
        $scope.clear = function() {
            $scope.dt = null;
        };

        /**
         * Méthode pour désactiver la sélection des jours du weekend.
         */
        $scope.disabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        /**
         * Méthode pour ouvrir le calendrier.
         */
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        // Ajout des options
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1, // les semaines commencent le lundi
        };

        $scope.today();
        $scope.showWeeks = false;
        $scope.formats = ['yyyy-MM-dd', 'dd/MM/yyyy'];
        
        $scope.format = $scope.formats[0];
        if (localization.language === "fr") {
            $scope.format = $scope.formats[1];
        }
    }
]);