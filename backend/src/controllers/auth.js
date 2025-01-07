const passport = require('passport');
const bcrypt = require('bcrypt');

exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
         console.error(authError);
         return next(authError);
        }
        if (!user){
         return res.status(401).send(`${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.status(200).send('로그인 성공');
        })
    })(req, res, next);
}

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({message: '로그아웃 중 오류 발생'});
        }
        res.status(200).json({message: '로그아웃 완료'});
    });
}
