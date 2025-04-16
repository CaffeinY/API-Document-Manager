// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('../config/db'); 
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            // Query the user record based on the username
            const user = await prisma.user.findUnique({
                where: { username }
            });
            
            if (!user) {
                return done(null, false, { message: 'Username does not exist' });
            }
            
            // Check if the password matches
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }
            
            // Authentication successful
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Serialize the user - save the user id into the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize the user - read the id from the session and query the user information
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
