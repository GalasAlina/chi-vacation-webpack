export default class SailsAuthService {
	constructor ($localStorage, $q, $rootScope, $state, roles, actions, states, $http) {
		'ngInject';
		this.$localStorage = $localStorage;
		this.$state = $state;
		this.states = states;
		this.roles = roles;
		this.actions = actions;
		this.$q = $q;
		this.$rootScope = $rootScope;
		this.$http = $http;
		this.userStorageKey = 'vacationsUser';
		this.authUser = $localStorage[ this.userStorageKey ] || { status:false, data: false };

		this.baseUrl = 'http://localhost:3000';
	}

	checkPersmissions(arr) {
		return !!~arr.indexOf(this.authUser.role || this.roles.GUEST);
	}
	getAuthUser() {
		return this.authUser.data;
	}
	getUserState() {
		/*if (this.authUser.data) {
			let data = this.firebaseObj.getAuth();
			this.authUser = {
				status: data ? true : false,
				data: (data == null) ? {} : data,
				role: this.authUser.role
			};
			this.$localStorage[ this.userStorageKey ] = this.toJSON(this.authUser);
		}*/
		return this.authUser.status;
	}

	signInUserByEmail(user) {
		let deferred = this.$q.defer();
		let userForm = JSON.stringify({
                email: user.email,
				password: user.password
        	});
			
		this.$http.post(this.baseUrl+'/auth/signin', userForm).then( 
			({data}) => {
				let {user} = data.data;
				this.authUser = {
					status: true,
					data: data.data,
					role: user.role,
					id: user.id
				};
				this.userData = data.data;
				deferred.resolve(this.authUser);
				this.$localStorage[this.userStorageKey ] = this.authUser;
			}, 
			error => {
				deferred.reject({
					status: false,
					error: error
				});
				this.logOut();	
			});

		return deferred.promise;
	}

	logOut() {
		this.$http.post(this.baseUrl+'/auth/logout').then( 
			r => {
				console.log(r);
			}, 
			e => {
				console.log(e.data.message, e)
			});
			this.$localStorage.$reset();
			this.authUser = {status: false, data: false}
		
	}

	changeUserPass(email, oldPassword, newPassword) {
	}
	
	resetAndSendPassword(email) {
	}

}