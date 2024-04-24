const kakao = require("./kakaoStrategy");
const { Student } = require("../models");

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        //req.session 객체에 어떤 데이터를 저장할지 선택. 매개변수로 user를 받아서 done 함수에 두번째 인자로 user.id 를 넘기고 있다.(=세션에 사용자 id저장) done함수의 첫번째 인자는 에러 발생시 사용
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        // 매요청시 실행된다. passport.session() 미들웨어가 이 메서드를 호출한다. serializeUser에서 세션에 저장했던 id를 받아 데이터베이스에서 사용자 정보를 조회한다. 조회한 정보를 req.user에 저장하므로 앞으로 req.user를 통해 로그인한 사용자의 정보를 가져올 수 있다.
        Student.findOne({
            where: { id },
        })
            .then((user) => done(null, user))
            .catch((err) => done(err));
    });

    kakao(passport);
};
