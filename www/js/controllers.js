angular.module('devrant.controllers', [])

.controller('NavController', function($scope, $state, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $ionicHistory, Auth) {
    $scope.data = {
        isAuthorized: false,
        user_id: Auth.getUserId()
    };
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $rootScope.$on('auth.stateChanged', (authorized) => {
        $scope.data.isAuthorized = Auth.isAuthorized();
        $scope.data.user_id = Auth.getUserId();
    });
    $scope.logout = function() {
        $ionicPopup.confirm({
            title: 'Log out',
            template: 'Are you sure you want to log out?\nThere are still more demons to toast!'
        }).then((res) => {
            if (res) {
                Auth.logout();
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('feed');
            }
        });
    };
    $scope.data.isAuthorized = Auth.isAuthorized();
})

.controller('FeedController', function($scope, Auth, Rants) {
    var skip = 0;
    $scope.data = {
        isLoading: true,
        rants: []
    };
    $scope.update = () => {
        skip = 0;
        Rants.getAll((rants) => {
            $scope.data.isLoading = false;
            $scope.data.rants = rants;
            $scope.$broadcast('scroll.refreshComplete');
            skip = 20;
        });
    };
    $scope.loadMore = (data) => {
        Rants.getAll((rants) => {
            Array.prototype.push.apply($scope.data.rants, rants);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.data.isLoading = false;
        }, skip);
        skip += 20;
    };
    // $scope.update();
    $scope.refresh = () => {
        $scope.update();
    };
})

.controller('LoginController', function($scope, $state, $ionicHistory, Auth, ionicToast) {
    $scope.form = {};
    $scope.login = () => {
        Auth.login($scope.form.username, $scope.form.password, () => {
            ionicToast.show('Welcome!', 'bottom', true, 2500);
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('feed');
        }, (error) => {
            ionicToast.show(error, 'bottom', true, 2500);
        });
    };
})

.controller('RantController', function($scope, $stateParams, Auth, Rants) {
    $scope.data = {
        isLoading: true
    };
    $scope.update = () => {
        Rants.getOne($stateParams.id, (data) => {
            $scope.data.isLoading = false;
            $scope.data.rant = data.rant;
            $scope.data.comments = data.comments;
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.update();
    $scope.refresh = () => {
        $scope.update();
    };
})

.controller('VoteController', function($scope, Auth, Rants) {
    $scope.voteObjectData = {};
    $scope.init = function(type, object) {
        $scope.voteObjectData.type = type;
        $scope.voteObjectData.object = object;
    }
    $scope.vote = (score) => {
        Auth.assert(() => {
            if ($scope.voteObjectData.type == 'rant') {
                method = Rants.voteRant;
            } else if ($scope.voteObjectData.type == 'comment') {
                method = Rants.voteComment;
            }
            method($scope.voteObjectData.object.id, score, (data) => {
                $scope.voteObjectData.object = data[$scope.voteObjectData.type];
            })
        });
    };
})

.controller('ProfileController', function($scope, $stateParams, Users) {
    $scope.data = {
        isLoading: true
    };
    $scope.update = () => {
        Users.getUser($stateParams.id, (data) => {
            $scope.data.isLoading = false;
            $scope.data.profile = data.profile;
            $scope.$broadcast('scroll.refreshComplete');
        })
    };
    $scope.update();
    $scope.refresh = () => {
        $scope.update();
    };
})

;
