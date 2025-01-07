const passport = require('passport');
const local = require('./localStrategy');

module.exports = () => {
    passport.serializeUser( (user, done) => {
        done(null, user.username);
    });
    passport.deserializeUser( (username, done) => {
        if (username === 'admin'){
            done(null, {username: 'admin'});
        } else {
            done(new Error('unauthorized'));
        }
    });

    local();
};
