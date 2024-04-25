const KakaoStrategy = require("passport-kakao").Strategy;

const { Student } = require("../models");

module.exports = (passport) => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID, //kakao에서 발급해주는 id, .env 파일 생성후 KAKAO_ID:카카오에서 발급해준 api 를 추가해주면 된다.
                callbackURL: "/auth/kakao/callback", //인증결과를 받는 라우터이다.
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const exUser = await Student.findOne({
                        //가입이력 확인
                        where: {
                            id: profile.id,
                            provider: "kakao",
                        },
                    });
                    if (exUser) {
                        done(null, exUser);
                    } else {
                        const newUser = await Student.create({
                            //새 유저 생성
                            // email: profile._json?.kakao_account_email, //nullish라 판단하면 에러가 아닌 undefined 출력
                            nickname: profile.displayName,
                            id: profile.id,
                            provider: "kakao",
                        });
                        done(null, newUser);
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            }
        )
    );
};
