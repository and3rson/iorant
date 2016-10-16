angular.module('devrant.services', [])
.factory('DevRantApi', ($http, ionicToast) => {
    var baseUrl = '/api';
    return {
        request: (method, url, data, callback, errorCallback) => {
            data = data || {};
            data.app = 3;
            $http({
                method: method,
                url: baseUrl + url + '?app=3',
                data: data,
                // headers : {
                //    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                // }
            }).then(
                (response) => {
                    callback(response.data);
                },
                (response) => {
                    if (errorCallback) {
                        errorCallback(response);
                    } else {
                        ionicToast.show('HTTP error: ' + JSON.stringify(response), 'bottom', true, 2500);
                        console.log('HTTP error:', response);
                    }
                }
            )
        }
    }
})
.factory('Rants', ($http, DevRantApi) => {
    return {
        getAll: (callback) => {
            DevRantApi.request('GET', '/devrant/rants', {}, (data) => {
                callback(data.rants);
            });
        },
        getOne: (id, callback) => {
            DevRantApi.request('GET', '/devrant/rants/' + id, {}, (data) => {
                callback(data.rant);
            });
        }
    };
})
.factory('Auth', ($http, $localStorage, $rootScope, DevRantApi) => {
    return {
        login: (username, password, callback, errorCallback) => {
            DevRantApi.request('POST', '/users/auth-token', {
                username: username,
                password: password
            }, (data) => {
                $localStorage.authToken = data.auth_token;
                callback();
            }, (errorData) => {
                errorCallback(errorData.data.error || errorData.data.message);
            })
        }
    }
})
;

// .factory('Chats', function() {
//   // Might use a resource here that returns a JSON array

//   // Some fake testing data
//   var chats = [{
//     id: 0,
//     name: 'Ben Sparrow',
//     lastText: 'You on your way?',
//     face: 'img/ben.png'
//   }, {
//     id: 1,
//     name: 'Max Lynx',
//     lastText: 'Hey, it\'s me',
//     face: 'img/max.png'
//   }, {
//     id: 2,
//     name: 'Adam Bradleyson',
//     lastText: 'I should buy a boat',
//     face: 'img/adam.jpg'
//   }, {
//     id: 3,
//     name: 'Perry Governor',
//     lastText: 'Look at my mukluks!',
//     face: 'img/perry.png'
//   }, {
//     id: 4,
//     name: 'Mike Harrington',
//     lastText: 'This is wicked good ice cream.',
//     face: 'img/mike.png'
//   }];

//   return {
//     all: function() {
//       return chats;
//     },
//     remove: function(chat) {
//       chats.splice(chats.indexOf(chat), 1);
//     },
//     get: function(chatId) {
//       for (var i = 0; i < chats.length; i++) {
//         if (chats[i].id === parseInt(chatId)) {
//           return chats[i];
//         }
//       }
//       return null;
//     }
//   };
// });
