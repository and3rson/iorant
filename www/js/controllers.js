angular.module('devrant.controllers', [])

.controller('NavController', function($scope, $state, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $ionicHistory, Auth) {
    $scope.data = {
        isAuthorized: false
    };
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $rootScope.$on('auth.stateChanged', (authorized) => {
        $scope.data.isAuthorized = Auth.isAuthorized();
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
    $scope.data = {
        isLoading: true,
        rants: []
    };
    $scope.update = () => {
        Rants.getAll((rants) => {
            $scope.data.isLoading = false;
            $scope.data.rants = rants;
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.vote = (rant, score) => {
        Auth.assert(() => {
            Rants.voteRant(rant.id, score, (data) => {
                $scope.data.rants.forEach((other, i) => {
                    if (other.id == data.rant.id) {
                        $scope.data.rants[i] = data.rant;
                    }
                })
                // $scope.data.rants[0] = data.rant;
                // console.log(data);
            })
        });
    };
    $scope.update();
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
    $scope.vote = (score) => {
        Auth.assert(() => {
            Rants.voteRant($stateParams.id, score, (data) => {
                $scope.data.rant = data.rant;
            })
        });
    };
    $scope.voteComment = (comment, score) => {
        Auth.assert(() => {
            Rants.voteComment(comment.id, score, (data) => {
                $scope.data.comments.forEach((other, i) => {
                    if (other.id == data.comment.id) {
                        $scope.data.comments[i] = data.comment;
                    }
                })
            })
        });
    };
    $scope.update();
    $scope.refresh = () => {
        $scope.update();
    };
})
