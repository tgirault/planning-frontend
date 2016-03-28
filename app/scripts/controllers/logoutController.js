/**
 * Contrôleur de la page logout.
 */
var LogoutController = function($scope, $location, $cookies) {

    /**
     * Méthode de déconnexion.
     */
    $scope.logout = function() {
        // On supprime le cookie
        $cookies.remove("access_token");
        // On redirige vers la page de connexion
        $location.path('/signin').replace(); 
    };
};

// On injecte les dépendences dans le contrôleur
LogoutController.$inject = ["$scope", "$location", "$cookies"];

// On enregistre le contrôleur auprès du module de l'application
angular.module("application").controller("LogoutController", LogoutController);