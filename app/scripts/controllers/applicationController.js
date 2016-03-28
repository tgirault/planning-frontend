/**
 * Contrôleur de l'application.
 */
var ApplicationController = function($scope, $location, $cookies) {
    /**
     * Données de l'application
     */
    $scope.main = {
        brand: "[[Planning]]",
        name: "Thomas GIRAULT"
    };

    /**
     * Méthode page spécifique
     */
    $scope.isSpecificPage = function() {
        var path;
        return path = $location.path(), _.contains(["/404", "/500", "/login", "/signin", "/signup", "/forgot", "/lock-screen"], path)
    };
    
    /**
     * Méthode authentification
     */
    $scope.isAuthenticated = function() {
        var accessToken = $cookies.get("access_token");
        if (!accessToken) {
            // On redirige vers la page de connexion
            $location.path('/signin').replace();
        }
        return accessToken;
    };
};

// On injecte les dépendences dans le contrôleur
ApplicationController.$inject = ["$scope", "$location", "$cookies"];

// On enregistre le contrôleur auprès du module de l'application
angular.module("application").controller("ApplicationController", ApplicationController);