// Required dependencies
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Member = require('../model/member');

//Export
module.exports = function (passport) {
    passport.use(
        new localStrategy({ usernameField: 'email'}, (email, password, done) => {
            //Match Email in DB with user
            Member.findOne({ email: email}, (err, member) => {
                if (err) {
                    console.log(err);
                }
                if (!member) {
                    return done(null, false, {message: 'There is no user with that email'});
                }
                // Match Password
                bcrypt.compare(password, member.password, (err, isMatch) => {
                    if(err) {
                        console.log(err);
                    }
                    if(isMatch) {
                        return done (null, member)
                    } else {
                        return done (null, false, {message: 'Incorrect Password'});
                    }
                })
            })
        })
    )

    //Serialize and deserialize user
    passport.serializeUser((member, done) => {
        done(null, member.id);
      });
      
      passport.deserializeUser((id, done) => {
        Member.findById(id, (err, member)=> {
          done(err, member);
        });
      });

}