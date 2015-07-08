angular.module('til.services', [])
.factory('myCache', function($cacheFactory) {
return $cacheFactory('trainingSets');
});