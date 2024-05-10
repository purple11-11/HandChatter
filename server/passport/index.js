const kakao = require("./kakaoStrategy");
const { Student } = require("../models");

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        // 사용자 정보에서 필요한 정보를 세션에 저장합니다.
        const sessionUser = {
            userId: user.id,
            stu_idx: user.stu_idx,
            role: "student", // 일반적으로 학생으로 가정합니다. 필요에 따라 조정 가능합니다.
        };
        done(null, sessionUser);
    });

    passport.deserializeUser((sessionUser, done) => {
        // 세션에서 사용자 정보를 불러올 때 필요한 정보를 함께 불러옵니다.
        Student.findByPk(sessionUser.userId)
            .then((user) => {
                if (!user) {
                    return done(null, false); // 사용자를 찾을 수 없는 경우
                }
                // 세션에 저장된 추가 정보도 함께 사용자 객체에 추가합니다.
                user.stu_idx = sessionUser.stu_idx;
                user.role = sessionUser.role;
                user.id = sessionUser.userId;
                done(null, user);
            })
            .catch((err) => done(err));
    });
    kakao(passport);
};
