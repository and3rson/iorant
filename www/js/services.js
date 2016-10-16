angular.module('devrant.services', [])
.factory('DevRantApi', ($http, ionicToast) => {
    // var baseUrl = '/api';
    if (window.location.hostname == 'localhost') {
        var baseUrl = '/api';
    } else {
        var baseUrl = 'https://www.devrant.io/api';
    }
    var authToken = null;
    return {
        setAuthToken: (newAuthToken) => {
            authToken = newAuthToken;
        },
        request: (method, url, data, callback, errorCallback) => {
            data = data || {};
            data.app = 3;
            if (authToken) {
                data.token_key = authToken.key;
                data.token_id = authToken.id;
                data.user_id = authToken.user_id;
            }
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
                callback(data);
            });
        },
        voteRant: (id, vote, callback) => {
            DevRantApi.request('POST', '/devrant/rants/' + id + '/vote', {
                vote: vote
            }, (data) => {
                callback(data);
            });
        },
        voteComment: (id, vote, callback) => {
            DevRantApi.request('POST', '/comments/' + id + '/vote', {
                vote: vote
            }, (data) => {
                callback(data);
            });
        }
    };
})
.factory('Users', ($http, DevRantApi) => {
    return {
        getUser: (id, callback) => {
            DevRantApi.request('GET', '/users/' + id, {}, (data) => {
                callback(data);
            })
        }
    }
})
.factory('Auth', ($http, $state, $localStorage, $rootScope, $ionicPopup, DevRantApi) => {
    DevRantApi.setAuthToken($localStorage.authToken);
    return {
        login: (username, password, callback, errorCallback) => {
            DevRantApi.request('POST', '/users/auth-token', {
                username: username,
                password: password
            }, (data) => {
                $localStorage.authToken = data.auth_token;
                $rootScope.$broadcast('auth.stateChanged');
                DevRantApi.setAuthToken(data.auth_token);
                callback();
            }, (errorData) => {
                errorCallback(errorData.data.error || errorData.data.message);
            })
        },
        logout: () => {
            $localStorage.authToken = null;
            $rootScope.$emit('auth.stateChanged');
            DevRantApi.setAuthToken(null);
        },
        isAuthorized: () => {
            return !!$localStorage.authToken;
        },
        getAuthToken: () => {
            return $localStorage.authToken;
        },
        getUserId: () => {
            return $localStorage.authToken ? $localStorage.authToken.user_id : null;
        },
        assert: (callback) => {
            if ($localStorage.authToken) {
                callback();
            } else {
                $ionicPopup.confirm({
                    title: 'Authorization required',
                    template: 'You need to be authorized to perform this action.'
                }).then((res) => {
                    if (res) {
                        $state.go('login');
                    }
                });
            }
        }
    }
})
