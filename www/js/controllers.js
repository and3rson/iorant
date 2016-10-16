angular.module('devrant.controllers', [])

.controller('NavController', function($scope, $ionicSideMenuDelegate) {
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
})

.controller('FeedController', function($scope, Rants) {
    $scope.data = {
        isLoading: true
    };
    $scope.update = () => {
        Rants.getAll((rants) => {
            $scope.data.isLoading = false;
            $scope.data.rants = rants;
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.update();
    $scope.refresh = () => {
        $scope.update();
    };
    // $scope.chats = [
    //     {
    //         id: 0,
    //         name: 'Ben Sparrow',
    //         lastText: 'You on your way?',
    //         face: 'img/ben.png'
    //     },
    //     {
    //         id: 0,
    //         name: 'Ben Sparrow',
    //         lastText: 'You on your way?',
    //         face: 'img/ben.png'
    //     },
    //     {
    //         id: 0,
    //         name: 'Ben Sparrow',
    //         lastText: 'You on your way?',
    //         face: 'img/ben.png'
    //     }
    // ];
})

.controller('LoginController', function($scope, $state, Auth, ionicToast) {
    // $scope.username = 'asd';
    $scope.form = {};
    $scope.login = () => {
        Auth.login($scope.form.username, $scope.form.password, () => {
            ionicToast.show('Welcome!', 'bottom', true, 2500);
            $state.go('feed');
        }, (error) => {
            ionicToast.show(error, 'bottom', true, 2500);
        });
    };
})

.controller('RantController', function($scope, $stateParams, Rants) {
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

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
