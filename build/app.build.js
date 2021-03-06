/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);


/*
	Base model Operations
*/
class BaseModel {
	/*
		The constructor recives
		@model => mongoose Schema
		@key   => string of index key on mongooseSchema
		@data  => transitional data object {
			the purpose of this attribute its to be a two way data bind between the requisition object
			that we could store in mongodb and result of query in data stored on mongoDB
		}
	*/
	constructor (Model, key, data) {
		__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Promise = Promise
		this.Model = Model
		this.key = key
		this.data = data
	}

	/*
		Basics crud -> ID bases
	*/

	/*
		All the methods working in the same way ->
			return a promise from the action that we try
			to make
	*/
	/*
		eg: persist()
			this.data  === req.body -> object that we want to store
			this.Model === StudentSchema, BookSchema, anyStuffSchema ...

			so we return a promise to who calls the persist method and who
			calls(that is who that actually intend to save data)
			must have to resolve this `create` promise

	*/
	persist () {
		let modelObj = new this.Model(this.data)
		return this.Model.create(modelObj)
	}

	getById () {
		return this.Model.find({_id: this.data._id}).exec()
	}

	updateById () {
		return this.Model.findByIdAndUpdate(this.data._id, this.data)
	}

	/*
		this its return the number of rows afecteds by the data update,
		not the updated objects
	*/
	deleteById () {
		return this.Model.findByIdAndRemove(this.data._id)
	}

	/*
		advanced API -> Simple query on modelObjects coverage
	*/
	getByField () {
		return this.Model.find(this.data).exec()
	}

	deleteByField (query) {
		return this.Model.findOneAndRemove(query).exec()
	}

	updateByField (query) {
		return this.Model.update(query, this.data)
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BaseModel;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/*
	Base Controller Operations
*/
class BaseController {
	/*
		The Constructor recives
		@model => mongoose Schema {
			sharing model context with the parent class
		}
	*/
	constructor (Model) {
		this.Model = Model
	}

	/*
		recives
		@req => express.Router() req context
		@req => express.Router() res context
	*/
	/*
		Basics crud -> ID bases
	*/

	/*
		All the methods working in the same way ->
			resolve a promise given by mongoDB call
	*/
	/*
		eg: save()
			req -> express.Router() context
			res -> express.Router() context

			so we resolve a promise call to any model (the model this is given by our child class)
			and before resolve we send the response to the client
	*/
	save (req, res) {
		let modelPromise = new this.Model(req.body).persist()

		Promise.all([
			modelPromise
		]).then((data) => {
			if (data) {
				res.send(data[0])
				res.status(201)
				res.end()
			}
		}).catch(err => {
			res.json(err)
			res.status(400)
			res.end()
		})
	}

	getById (req, res) {
		let modelPromise = new
			this.Model({
				_id: req.params.id
			}).getById()

		Promise.all([
			modelPromise
		]).then((data) => {
			if (data) {
				res.send(data[0][0])
				res.status(200)
				res.end()
			}
		}).catch(err => {
			console.log(err)
		})
	}

	updateById (req, res) {
		let modelPromise = new this.Model(req.body).updateById()

		Promise.all([
			modelPromise
		]).then((data) => {
			if (data) {
				res.send(data[0])
				res.status(200)
				res.end()
			}
		}).catch(err => {
			res.json(err)
			res.status(400)
			res.end()
		})
	}

	removeById (req, res) {
		let data = {
			_id: req.params.id
		}

		let modelPromise = new this.Model(data).deleteById()

		Promise.all([
			modelPromise
		]).then((data) => {
			if (data) {
				res.send(data[0])
				res.status(200)
				res.end()
			}
		}).catch(err => {
			res.json(err)
			res.status(400)
			res.end()
		})
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BaseController;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);


// This model refers to the creation of any person(Student, Teacher...), which will be inherited by other models.

/**
 * Restrictions
 */

const nameRestriction = {
  type: String,
  required: [true, 'No name given'],
  minlength: [3, 'Name too short'],
  maxlength: [100, 'Name too big'],
};

const birthDayRestriction = {
  type: String,
  required: [true, 'No birth day given'],
};

const loginRestriction = {
  type: String,
  required: [true, 'No login given'],
  index: {
      unique: true,
  },
};

const passwordRestriction = {
  type: String,
  required: [true, 'No password given'],
};


// Create Schema
const userSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  first_name: nameRestriction,
  last_name: nameRestriction,
  birth_day: birthDayRestriction,
  login: loginRestriction,
  password: passwordRestriction,
});

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('User', userSchema));

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  secret: '704.94.9824.984hbi'
});

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__schemes_Student__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Base_Model__ = __webpack_require__(3);



/*
	Model operations to Student
*/
/*
	Because this class extends to BaseModel we inherit from then all the basics data Operations.
	More specifcs data operetions should be implemented here
*/
class StudentModel extends __WEBPACK_IMPORTED_MODULE_1__Base_Model__["a" /* default */] {
	/*
		pass data(req.params or req.body stuff) to our parent class (BaseModel)
	*/
	constructor (data) {
		/*
			Calling the constructor from the parent class
			and pass to him all the config that him needs to work

			so ... magic, your crud its done :3
			try with another mongooseSchema, will work
		*/
		super(__WEBPACK_IMPORTED_MODULE_0__schemes_Student__["a" /* default */], '_id', data)
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StudentModel;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__schemes_User__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Base_Model__ = __webpack_require__(3);



/*
	Model operations to Student
*/
/*
	Because this class extends to BaseModel we inherit from then all the basics data Operations.
	More specifcs data operetions should be implemented here
*/
class UserModel extends __WEBPACK_IMPORTED_MODULE_1__Base_Model__["a" /* default */] {
	/*
		pass data(req.params or req.body stuff) to our parent class (BaseModel)
	*/
	constructor (data) {
		/*
			Calling the constructor from the parent class
			and pass to him all the config that him needs to work

			so ... magic, your crud its done :3
			try with another mongooseSchema, will work
		*/
		super(__WEBPACK_IMPORTED_MODULE_0__schemes_User__["a" /* default */], '_id', data)
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UserModel;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_database__ = __webpack_require__(21);




class Database {
	init () {
		__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Promise = global.Promise
		return process.env.DEV === 'True' ? this._local() : this._production()
	}

	_production () {
		return __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.connect('mongodb://heroku_dq9b7270:qt9jrol5hbeqj6gc3chksbau6q@ds227555.mlab.com:27555/heroku_dq9b7270').then(() => {
			console.log('[Prod] -> Database conected')
			return true
		}).catch((err) => {
			console.error(err)
		})
	}

	_local () {
		const localURI = 'mongodb://' + __WEBPACK_IMPORTED_MODULE_1__config_database__["a" /* default */].dev.local.host + ':' +
											__WEBPACK_IMPORTED_MODULE_1__config_database__["a" /* default */].dev.local.port + '/' + __WEBPACK_IMPORTED_MODULE_1__config_database__["a" /* default */].dev.local.database

		return __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.connect(localURI).then(() => {
			console.log('[Dev] -> Database conected')
			return true
		}).catch((err) => {
			console.error(err)
		})
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Database;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_passport__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_passport___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_passport__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_User_Model__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config_jwt__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_passport_jwt__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_passport_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_passport_jwt__);





/* harmony default export */ __webpack_exports__["a"] = (function (passport) {
	let JwtStrategy = __WEBPACK_IMPORTED_MODULE_3_passport_jwt___default.a.Strategy
	let ExtractJwt = __WEBPACK_IMPORTED_MODULE_3_passport_jwt___default.a.ExtractJwt

	let opts = {
		'jwtFromRequest': ExtractJwt.fromAuthHeaderAsBearerToken(),
		'secretOrKey': __WEBPACK_IMPORTED_MODULE_2__config_jwt__["a" /* default */].secret
	}

	__WEBPACK_IMPORTED_MODULE_0_passport___default.a.use(new JwtStrategy(opts, (payload, done) => {
		let query = {
			_id: payload._id
		}

		let user = new __WEBPACK_IMPORTED_MODULE_1__models_User_Model__["a" /* default */](query).getById()

		Promise.all([
			user
		]).then(data => {
			if (data) {
				done(null, payload)
			} else {
				done(null, false)
			}
		}).catch(err => {
			if (err) {
				return done(err, false)
			}
		})
	}))
});


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__controllers_Auth_Controller__ = __webpack_require__(23);

/*
	Import the resource controller, the code below its pretty intuitive :3
*/


let router = __WEBPACK_IMPORTED_MODULE_0_express___default.a.Router()
/*
	import student RESOURCE CONTROLLER 
*/
let auth = new __WEBPACK_IMPORTED_MODULE_1__controllers_Auth_Controller__["a" /* default */]()
/*
	routing the controller object through student resource endpoints
*/

router.post('/login', (req, res) => {
	auth.login(req, res)
})

router.post('/singup', (req, res) => {
	auth.singup(req, res)
})

/* harmony default export */ __webpack_exports__["a"] = (router);


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_passport__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controllers_Book_Controller__ = __webpack_require__(24);




const protect = __WEBPACK_IMPORTED_MODULE_1_passport___default.a.authenticate('jwt', {
	session: false
})

let router = __WEBPACK_IMPORTED_MODULE_0_express___default.a.Router()
/*
	import student RESOURCE CONTROLLER
*/
let bk = new __WEBPACK_IMPORTED_MODULE_2__controllers_Book_Controller__["a" /* default */]()

router.get('/', protect, (req, res) => {
	res.json({
		'msg': 'Welcome to Book endpoints'
	})
})

router.post('/', protect, (req, res) => {
	bk.save(req, res)
})

router.get('/:id', protect, (req, res) => {
	bk.getById(req, res)
})

router.put('/:id', protect, (req, res) => {
	bk.updateById(req, res)
})

router.delete('/:id', protect, (req, res) => {
	bk.removeById(req, res)
})

/* harmony default export */ __webpack_exports__["a"] = (router);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_passport__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controllers_Chapter_Controller__ = __webpack_require__(25);





const protect = __WEBPACK_IMPORTED_MODULE_1_passport___default.a.authenticate('jwt', {
	session: false
})

let router = __WEBPACK_IMPORTED_MODULE_0_express___default.a.Router()
/*
	import student RESOURCE CONTROLLER
*/
let cp = new __WEBPACK_IMPORTED_MODULE_2__controllers_Chapter_Controller__["a" /* default */]()

router.get('/', protect, (req, res) => {
	res.json({
		'msg': 'Welcome to chapter endpoints'
	})
})

router.post('/', protect, (req, res) => {
	cp.save(req, res)
})

router.get('/:id', protect, (req, res) => {
	cp.getById(req, res)
})

router.put('/:id', protect, (req, res) => {
	cp.updateById(req, res)
})

router.delete('/:id', protect, (req, res) => {
	cp.removeById(req, res)
})

/* harmony default export */ __webpack_exports__["a"] = (router);


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_passport__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controllers_Class_Controller__ = __webpack_require__(26);





const protect = __WEBPACK_IMPORTED_MODULE_1_passport___default.a.authenticate('jwt', {
	session: false
})

let router = __WEBPACK_IMPORTED_MODULE_0_express___default.a.Router()
/*
	import student RESOURCE CONTROLLER
*/
let cl = new __WEBPACK_IMPORTED_MODULE_2__controllers_Class_Controller__["a" /* default */]()

router.get('/', protect, (req, res) => {
	res.json({
		'msg': 'Welcome to class endpoints'
	})
})

router.post('/', protect, (req, res) => {
	cl.save(req, res)
})

router.get('/:id', protect, (req, res) => {
	cl.getById(req, res)
})

router.put('/:id', protect, (req, res) => {
	cl.updateById(req, res)
})

router.delete('/:id', protect, (req, res) => {
	cl.removeById(req, res)
})

router.get('/teacher/:teacher_id', protect, (req, res) => {
	cl.teacherClasses(req, res)
})

/* harmony default export */ __webpack_exports__["a"] = (router);


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_passport__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controllers_Student_Controller__ = __webpack_require__(27);




const protect = __WEBPACK_IMPORTED_MODULE_1_passport___default.a.authenticate('jwt', {
	session: false
})

let router = __WEBPACK_IMPORTED_MODULE_0_express___default.a.Router()
/*
	import student RESOURCE CONTROLLER
*/
let st = new __WEBPACK_IMPORTED_MODULE_2__controllers_Student_Controller__["a" /* default */]()

router.get('/', protect, (req, res) => {
	res.json({
		'msg': 'Welcome to Student endpoints'
	})
})

/*
	routing the controller object through student resource endpoints
*/
router.post('/', protect, (req, res) => {
	st.save(req, res)
})

router.get('/:id', protect, (req, res) => {
	st.getById(req, res)
})

router.put('/:id', protect, (req, res) => {
	st.updateById(req, res)
})

router.delete('/:id', protect, (req, res) => {
	st.removeById(req, res)
})

router.get('/login/:login', protect, (req, res) => {
	st.studentByLogin(req, res)
})

router.put('/login/:login', protect, (req, res) => {
	st.updateByLogin(req, res)
})

router.delete('/login/:login', protect, (req, res) => {
	st.removeByLogin(req, res)
})

/* harmony default export */ __webpack_exports__["a"] = (router);


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_morgan__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_morgan___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_morgan__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_cookie_parser__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_cookie_parser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_cookie_parser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_body_parser__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_body_parser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_body_parser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_passport__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_passport___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_passport__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__src_database_Database__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__src_routes_Student_Router__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__src_routes_Book_Router__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__src_routes_Chapter_Router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__src_routes_Class_Router__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__src_routes_Auth_Router__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__src_middleware_passport__ = __webpack_require__(10);
/*
	Common
*/






/*
	Database Import
*/

/*
	Endpoints
*/





/*
	middleware
*/

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__src_middleware_passport__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_5_passport___default.a)

let app = __WEBPACK_IMPORTED_MODULE_0_express___default()()

app.use(__WEBPACK_IMPORTED_MODULE_2_morgan___default()('dev'))
app.use(__WEBPACK_IMPORTED_MODULE_4_body_parser___default.a.json())
app.use(__WEBPACK_IMPORTED_MODULE_4_body_parser___default.a.urlencoded({ extended: false }))
app.use(__WEBPACK_IMPORTED_MODULE_3_cookie_parser___default()())
app.use(__WEBPACK_IMPORTED_MODULE_0_express___default.a.static(__WEBPACK_IMPORTED_MODULE_1_path___default.a.join(__dirname, 'public')))

/*
	[Database conection]
*/
const conn = new __WEBPACK_IMPORTED_MODULE_6__src_database_Database__["a" /* default */]()
conn.init()

/*
	routes to student resource
*/
app.use('/student', __WEBPACK_IMPORTED_MODULE_7__src_routes_Student_Router__["a" /* default */])
app.use('/book', __WEBPACK_IMPORTED_MODULE_8__src_routes_Book_Router__["a" /* default */])
app.use('/chapter', __WEBPACK_IMPORTED_MODULE_9__src_routes_Chapter_Router__["a" /* default */])
app.use('/class', __WEBPACK_IMPORTED_MODULE_10__src_routes_Class_Router__["a" /* default */])
app.use('/auth', __WEBPACK_IMPORTED_MODULE_11__src_routes_Auth_Router__["a" /* default */])

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found')
	err.status = 404
	next(err)
})

// error handler
app.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

var port = process.env.PORT || 5000

app.listen(port, function () {
	console.log("Running on port: ", port)
})

/* harmony default export */ __webpack_exports__["default"] = (app);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, "/"))

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  dev: {
    local:{
      host: 'localhost',
      port: '27017',
      database: 'conte-um-conto'
    }
  },
  production: {
    conections: [{
      provider: 'heroku'
    }]
  }
});

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  algorithm: 'aes-256-ctr', 
  password: 'd6F3Efeq'
});

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models_Student_Model__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Teacher_Model__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_User_Model__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config_jwt__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jsonwebtoken__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jsonwebtoken___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_jsonwebtoken__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_HashPassword__ = __webpack_require__(37);








class AuthController {
	singup (req, res) {
		let data = req.body
		data.password = __WEBPACK_IMPORTED_MODULE_5__services_HashPassword__["a" /* default */].encrypt(data.password)
		if (data.type === 'student') {
			let studentModel = new __WEBPACK_IMPORTED_MODULE_0__models_Student_Model__["a" /* default */](data).persist()
			Promise.all([
				studentModel
			]).then((value) => {
				if (value) {
					res.json(this._generateToken(value[0]))
					res.status(200)
				} else {
					res.send(500)
				}
			}).catch(err => {
				console.log(err)
				let errorMsg = []
				if (err.code === 11000) {
					if (err.errmsg.match(/email_1/)) {
						errorMsg.push({
							error: 'Duplicate email'
						})
					}
					if (err.errmsg.match(/login_1/)) {
						errorMsg.push({
							error: 'Duplicate login'
						})
					}
				}
				res.json(errorMsg)
				res.status(400)
			})
		} else if (data.type === 'teacher') {
			let teacherModel = new __WEBPACK_IMPORTED_MODULE_1__models_Teacher_Model__["a" /* default */](data).persist()

			Promise.all([
				teacherModel
			]).then((value) => {
				if (value) {
					res.json(this._generateToken(value[0]))
				}
			}).catch(err => {
				let errorMsg = []

				if (err.code === 11000) {
					if (err.errmsg.match(/email_1/)) {
						errorMsg.push({
							error: 'Duplicate email'
						})
					}
					if (err.errmsg.match(/login_1/)) {
						errorMsg.push({
							error: 'Duplicate login'
						})
					}
				}
				res.json(errorMsg)
				res.status(400)
			})
		}
	}

	login (req, res) {
		let data = {
			login: req.body.login
		}
		console.log(data)
		let user = new __WEBPACK_IMPORTED_MODULE_2__models_User_Model__["a" /* default */](data).getByField()
		Promise.all([
			user
		]).then((value) => {
			if (value[0][0]) {
				if (__WEBPACK_IMPORTED_MODULE_5__services_HashPassword__["a" /* default */].encrypt(req.body.password) === value[0][0].password) {
					res.json(this._generateToken(value[0][0]))
				} else {
					res.json({
						'Error': 'Invalid Password'
					})
				}
			} else {
				res.json({
					'Error': 'Invalid Login'
				})
			}
		}).catch(err => {
			console.log(err)
		})
	}

	_generateToken (data) {
		let tokenInfo = {
			'email': data.email,
			'login': data.login,
			'_id': data._id
		}
		return {
			'acess_token': __WEBPACK_IMPORTED_MODULE_4_jsonwebtoken___default.a.sign(tokenInfo, __WEBPACK_IMPORTED_MODULE_3__config_jwt__["a" /* default */].secret, {
				expiresIn: 10080 // in seconds
			}),
			'token_type': 'Bearer'
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AuthController;



/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Base_Controller__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Book_Model__ = __webpack_require__(28);




class BookController extends __WEBPACK_IMPORTED_MODULE_0__Base_Controller__["a" /* default */] {
	constructor () {
		super(__WEBPACK_IMPORTED_MODULE_1__models_Book_Model__["a" /* default */])
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BookController;



/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Base_Controller__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Chapter_Model__ = __webpack_require__(29);




class ChaperController extends __WEBPACK_IMPORTED_MODULE_0__Base_Controller__["a" /* default */] {
	constructor () {
		super(__WEBPACK_IMPORTED_MODULE_1__models_Chapter_Model__["a" /* default */])
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ChaperController;



/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Base_Controller__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Class_Model__ = __webpack_require__(30);




class ClassController extends __WEBPACK_IMPORTED_MODULE_0__Base_Controller__["a" /* default */] {
	constructor () {
		super(__WEBPACK_IMPORTED_MODULE_1__models_Class_Model__["a" /* default */])
	}

	teacherClasses (req, res) {
		let data = {
			teacher: req.params.teacher_id
		}

		let classModel = new __WEBPACK_IMPORTED_MODULE_1__models_Class_Model__["a" /* default */](data).getByField()

		Promise.all([
			classModel
		]).then((classes) => {
			if (classes) {
				res.json(classes[0])
				res.status(200)
			}
		}).catch(err => {
			console.log(err)
		})
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ClassController;



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Base_Controller__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Student_Model__ = __webpack_require__(7);



/*
	Model operations to Student
*/
/*
	Because this class extends to Controller we inherit from then all the basics data Operations.
	More specifcs RESOURCES CONTROL OPERATIONS should be implemented here
*/
class StudentController extends __WEBPACK_IMPORTED_MODULE_0__Base_Controller__["a" /* default */] {
	/*
		pass the model this class will map
		to our parent class (Basecontroller)
	*/
	constructor () {
		/*
			Calling the constructor from the parent class
			and pass to him all the config that him needs to work

			so ... magic, your crud its done :3
			try with another mongooseSchema, will work,

			if its dont make sense map a mongooseSchema to
			a resource controller just dont override the constructor method
			this open the possibility to bring another resources controllers(BookController, ChapterController)
			and compose one operation with them together
		*/
		super(__WEBPACK_IMPORTED_MODULE_1__models_Student_Model__["a" /* default */])
	}

	/*
		Below its a exemple of specifcs RESOURCES CONTROL OPERATIONS that
		only make sense a Student have
	*/

	studentByLogin (req, res) {
		let data = {
			login: req.params.login
		}

		let student = new __WEBPACK_IMPORTED_MODULE_1__models_Student_Model__["a" /* default */](data).getByField()

		Promise.all([
			student
		]).then((data) => {
			if (data) {
				res.send(data[0])
				res.status(200)
				res.end()
			}
		}).catch(err => {
			res.json(err)
			res.status(400)
			res.end()
		})
	}

	updateByLogin (req, res) {
		let query = {
			login: req.params.login
		}

		let student = new __WEBPACK_IMPORTED_MODULE_1__models_Student_Model__["a" /* default */](req.body).updateByField(query)

		Promise.all([
			student
		]).then((data) => {
			if (data) {
				res.send(data[0])
				res.status(200)
				res.end()
			}
		}).catch(err => {
			res.json(err)
			res.status(400)
			res.end()
		})
	}

	removeByLogin (req, res) {
		let query = {
			login: req.params.login
		}

		let student = new __WEBPACK_IMPORTED_MODULE_1__models_Student_Model__["a" /* default */]().deleteByField(query)

		Promise.all([
			student
		]).then((data) => {
			if (data) {
				res.send(data[0])
				res.status(200)
				res.end()
			}
		}).catch(err => {
			res.json(err)
			res.status(400)
			res.end()
		})
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StudentController;



/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__schemes_Book__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Base_Model__ = __webpack_require__(3);




class BookModel extends __WEBPACK_IMPORTED_MODULE_1__Base_Model__["a" /* default */] {
	constructor (data) {
		super(__WEBPACK_IMPORTED_MODULE_0__schemes_Book__["a" /* default */], '_id', data)
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BookModel;



/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__schemes_Chapter__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Base_Model__ = __webpack_require__(3);




class ChapterModel extends __WEBPACK_IMPORTED_MODULE_1__Base_Model__["a" /* default */] {
	constructor (data) {
		super(__WEBPACK_IMPORTED_MODULE_0__schemes_Chapter__["a" /* default */], '_id', data)
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ChapterModel;



/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__schemes_Class__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Base_Model__ = __webpack_require__(3);



/*
	Model operations to Student
*/
/*
	Because this class extends to BaseModel we inherit from then all the basics data Operations.
	More specifcs data operetions should be implemented here
*/
class TeacherModel extends __WEBPACK_IMPORTED_MODULE_1__Base_Model__["a" /* default */] {
	/*
		pass data(req.params or req.body stuff) to our parent class (BaseModel)
	*/
	constructor (data) {
		/*
			Calling the constructor from the parent class
			and pass to him all the config that him needs to work

			so ... magic, your crud its done :3
			try with another mongooseSchema, will work
		*/
		super(__WEBPACK_IMPORTED_MODULE_0__schemes_Class__["a" /* default */], '_id', data)
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TeacherModel;



/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__schemes_Teacher__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Base_Model__ = __webpack_require__(3);



/*
	Model operations to Student
*/
/*
	Because this class extends to BaseModel we inherit from then all the basics data Operations.
	More specifcs data operetions should be implemented here
*/
class TeacherModel extends __WEBPACK_IMPORTED_MODULE_1__Base_Model__["a" /* default */] {
	/*
		pass data(req.params or req.body stuff) to our parent class (BaseModel)
	*/
	constructor (data) {
		/*
			Calling the constructor from the parent class
			and pass to him all the config that him needs to work

			so ... magic, your crud its done :3
			try with another mongooseSchema, will work
		*/
		super(__WEBPACK_IMPORTED_MODULE_0__schemes_Teacher__["a" /* default */], '_id', data)
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TeacherModel;



/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);


/**
 * Restrictions
 */

const studentsRestriction = [{
  type: __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema.Types.ObjectId,
  ref: 'Student',
  required: true,
}];

const titleRestriction = {
  type: String,
  required: [true, 'no title given'],
  minlength: [1, 'title is too short'],
  max: [40, 'title is too long'],
};

const summaryRestriction = {
  type: String,
  minlength: [30, 'summary is too short'],
  max: [255, 'summary is too long'],
};

const tagsRestriction = [{
  type: String,
}];

const activeRestriction = {
  type: Boolean,
  default: true,
};

const chaptersRestriction = [{
  type: __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema.Types.ObjectId,
  ref: 'Chapters',
  required: true,
}];

/**
 * Book Schema
 */

const BookSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  _student: studentsRestriction,
  title: titleRestriction,
  summary: summaryRestriction,
  tags: tagsRestriction,
  active: activeRestriction,
  chapters: chaptersRestriction,
});

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('Book', BookSchema));

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);


/**
 * Restrictions
 */
const bookRestriction = [{
  type: __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema.Types.ObjectId,
  ref: 'Book',
  required: true,
}];

const titleRestriction = {
  type: String,
  required: [true, 'no title given'],
  minlength: [1, 'title is too short'],
  max: [40, 'title is too long'],
};

const chapterTextRestriction = {
    type: String
}

const chapterSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  _book: bookRestriction,
  title: titleRestriction,
  chapterText: chapterTextRestriction,
});

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('Chapters', chapterSchema));

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_shortid__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_shortid___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_shortid__);



// This model refers to the creation of any person(Student, Teacher...), which will be inherited by other models.

/**
 * Restrictions
 */


// Created by this teacher
const teacherRestriction = {
  type: __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema.Types.ObjectId,
  ref: 'Teacher',
  required: [true, 'Teacher id required'],
};

const classCodeRestriction = {
  type: String,
  'default': __WEBPACK_IMPORTED_MODULE_1_shortid___default.a.generate,
  index: {
      unique: true,
  },
};

const classNameRestriction = {
  type: String,
  required: [true, 'Class name required'],
};

const yearRestriction = {
  type: Number,
  required: [true, 'Year required'],
};

const capacityRestriction = {
  type: Number,
  required: [true, 'Capacity required'],
};
const courseRestriction = {
  type: String,
  required: [true, 'Course required'],
}

const themeRestriction = {
  type: String,
  required: [true, 'Theme required'],
}


const statusRestriction = {
  type: Boolean,
  required: [true, 'Status required']
}


// Will be modified by ObjectId
const schoolRestriction = {
  type: String,
  required: [true, 'School required']
}

/**
* Optional restrictions
*/

const startDateRestriction = {
  type: String,
}

const endDateRestriction = {
  type: String,
}

const commentsRestriction = {
  type: String,
}

const bookRestriction = [{
  type: __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema.Types.ObjectId,
  ref: 'Book',
}];

const studentRestriction = [{
  type: __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema.Types.ObjectId,
  ref: 'Student',
}];

const classSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  teacher: teacherRestriction,
  code: classCodeRestriction,
  name: classNameRestriction,
  year: yearRestriction,
  capacity: capacityRestriction,
  course: courseRestriction,
  theme: themeRestriction,
  school: schoolRestriction,
  status: statusRestriction,
  startDate: startDateRestriction,
  endDate: endDateRestriction,
  comments: commentsRestriction,
  students: studentRestriction,
  books: bookRestriction
});

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('Class', classSchema));

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__User__ = __webpack_require__(5);




/**
 * Restrictions
 */

const bookRestriction = [{
  type: __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema.Types.ObjectId,
  ref: 'Book',
}];

const emailRestriction = {
  type: String,
  index: [{
    // Unique + Sparse = If the email is not null, it has to be unique
    unique: true,
    sparse: true,
  }],
};

// Inheritance of the person model
const StudentSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  books: bookRestriction,
  email: emailRestriction
});


/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_1__User__["a" /* default */].discriminator('Student', StudentSchema));

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__User__ = __webpack_require__(5);



/**
 * Restrictions
 */
const yearRestriction = {
  type: Number,
  min: 1900,
  max: 2500,
};

const phoneRestriction = {
  type: String,
  required: [true, 'No phone given'],
};

const cpfRestriction = {
  type: String,
  required: [true, 'No cpf given'],
};

const graduationRestriction = {
  type: String,
};

const schoolRestriction = {
  type: String,
};

const emailRestriction = {
  type: String,
  required: [true, 'No email given'],
  index: [{
    unique: true,
  }],
};

/**
 * Teacher Schema
 */

// Inheritance of the person model

const TeacherSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  cpf: cpfRestriction,
  phone: phoneRestriction,
  current_school: schoolRestriction,
  graduation: graduationRestriction,
  year_graduation: yearRestriction,
  email: emailRestriction
});

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_1__User__["a" /* default */].discriminator('Teacher', TeacherSchema));

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_crypto__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_hash__ = __webpack_require__(22);



class HashPassword {
	static encrypt (password) {
		let cipher = __WEBPACK_IMPORTED_MODULE_0_crypto___default.a.createCipher(__WEBPACK_IMPORTED_MODULE_1__config_hash__["a" /* default */].algorithm, __WEBPACK_IMPORTED_MODULE_1__config_hash__["a" /* default */].password)
		let crypted = cipher.update(password, 'utf8', 'hex')
		crypted += cipher.final('hex')
		return crypted
	}

	static decrypt (password) {
		let decipher = __WEBPACK_IMPORTED_MODULE_0_crypto___default.a.createDecipher(__WEBPACK_IMPORTED_MODULE_1__config_hash__["a" /* default */].algorithm, __WEBPACK_IMPORTED_MODULE_1__config_hash__["a" /* default */].password)
		let dec = decipher.update(password, 'hex', 'utf8')
		dec += decipher.final('utf8')
		return dec
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HashPassword;



/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("passport-jwt");

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = require("shortid");

/***/ })
/******/ ]);