var mongoose = require('mongoose'),
		bcrypt = require('bcrypt'),
		base64 = require('../helpers/base64'),
		mailchimp = require('../helpers/mailchimp'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    SALT_WORK_FACTOR = 10;

var User;

var UserSchema = new Schema({
  firstName: {type: String},
  lastName: {type: String},
  email: {
  	type: String,
  	required: true,
  	index: {unique: true}
  },
  password: {type: String},
  rememberToken: {type: String},
  lessons: [ObjectId]
});

//Validation
//TODO: Expand on email validation
UserSchema.path('email').validate(function validateEmail(email) {
	return /.?@.?\.?/.test(email);
}, "Invalid Email Address");


//Virtual Fields
UserSchema.virtual("fullName").get(function() {
	return this.firstName + ' ' + this.lastName;
});

UserSchema.virtual("encryptedId").get(function() {
	return base64.encode(this._id);
});

//Statics
UserSchema.static("findByEmail", function(email, cb) {
	User.findOne({email: email}, cb);
});

UserSchema.static('findByEncryptedId', function(encrypted, cb){
	var id = base64.decode(encrypted);
	User.findById(id, cb);
});

//Password Encryption/Verification
/* Note: Because passwords are not hashed until the document is saved, be careful if
you're interacting with documents that were not retrieved from the database, as any passwords will still be in cleartext.
Mongoose middleware is not invoked on update() operations, so you must use a save() if you want to update user passwords. */
UserSchema.pre('save', function(next){
	var user = this;
	this.wasNew = this.isNew;

	//Only hash if the password is new/has been modified
	if (!user.isModified('password')) { return next(); }

	//generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) { return next(err); }

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) { return next(err); }

			//override the cleartext password with the hashed on
			user.password = hash;
			next();
		});
	});
});

//Subscribe to mailing lists
UserSchema.post('save', function(user) {
	//Only subscribe if the user has just been created
	if(!user.wasNew) { 
		console.log('here')
		return }
	
	if(this.firstName) {
		mailchimp.subscribe(this.email, this.firstName, this.lastName);
	} else {
		mailchimp.subscribe(this.email, '', '');
	}
});

//Compare password: pass in callback that has params err, and isMatch, a boolean that determines whether the passwords match
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) { return cb(err); }
		cb(null, isMatch);
	});
}

UserSchema.methods.saveRememberToken = function(rememberToken, cb) {
	var user = this;
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) { return cb(err); }

		bcrypt.hash(rememberToken, salt, function(err, hashed) {
			if (err) { return cb(err); }
			user.rememberToken = hashed;
			user.save(function(err, user) {
				if(err) {
					return cb(err);
				} else {
					return cb(null, user);
				}
			});
		});
	});
}

UserSchema.methods.checkRememberToken = function(rememberToken, cb) {
	bcrypt.compare(rememberToken, this.rememberToken, function(err, isMatch) {
		if (err) { return cb(err); }
		cb(null, isMatch);
	});
}

UserSchema.methods.unsubscribeFromMailingList = function() {
	mailchimp.unsubscribe(this.email);
}

//Attempt Login: pass in callback that takes err, user, and an optional emssage on error
UserSchema.static('attemptLogin', function(email, password, cb) {
	User.findByEmail(email, function(err, user) {
		if (err) { return cb(err); }

		if(!user) {
			return cb(true, null, 'User not found with email:' + email);
		}

		user.comparePassword(password, function(err, isMatch) {
			if (err) { return cb(err); }

			if(isMatch) {
				return cb(null, user, 'User found');
			} else {
				return cb(true, null, 'Incorrect Password');
			}
		});
	});
});

function hashToken(token, cb) {
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) { return cb(err); }

		bcrypt.hash(token, salt, function(err, hash) {
			if (err) { return cb(err); }
			console.log(hash);

			//override the cleartext password with the hashed on
			cb(hash);
		});
	});
}

User = mongoose.model('User', UserSchema);

module.exports = User;