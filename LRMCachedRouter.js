L.Routing.RouteCached = function(parentClass, options) {
	return new (parentClass.extend({
		initialize: function(options) {
			parentClass.prototype.initialize.call(this, options);
			this.cachedCalls = [];
		},

		cachedCallback: function(err, routes) {
			this.routeCache.cachedCalls[this.wpts] = routes;
			this.callbackRouteCached.call(this, err, routes);
		},
		
		route: function(waypoints, callback, context, options) {
			var str = "";
			waypoints.forEach(w => { str += w.latLng.lat + "," +  w.latLng.lng + ";"; });
			if (this.cachedCalls[str]) {
				let routes = this.cachedCalls[str];
				// timeout 50ms to wait for div elemnts to be created and properly initialized
				setTimeout(function() { callback.call(context, null, routes); }, 50);
			}
			else {
				context.callbackRouteCached = callback;
				context.wpts = str;
				context.routeCache = this;
				return parentClass.prototype.route.call(this, waypoints, this.cachedCallback, context, options);
			}
		}
	}))(options);
}
