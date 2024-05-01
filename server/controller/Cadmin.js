const { Tutor } = require("../models");

//POST /admin/login
exports.login = (req, res) => {
    try {
        const { id, password } = req.body;
        if (!id || !password) return res.status(400).send("빈칸을 입력해주세요.");

        const admin = {
            id: "admin123",
            password: "admin123",
        };
        if (id === admin.id) {
            if (password === admin.password) {
                res.status(200).send({
                    isAdminLogin: true,
                    msg: "관리자로 로그인되었습니다.",
                });
            } else return res.status(400).send("비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
        } else return res.status(400).send("관리자 아이디가 아닙니다. 다시 시도해주세요.");
    } catch (error) {
        console.log(error);
        res.status(500).send("SERVER ERROR!!!");
    }
};

//PATCH /admin/access
exports.approveTutor = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            res.status(400).send("튜터로 변경할 회원을 선택해주세요.");
        } else {
            await Tutor.update(
                {
                    authority: 1,
                },
                {
                    where: {
                        id,
                    },
                }
            );
            return res.status(200).send({ result: true, msg: `${id}님을 튜터로 변경되었습니다.` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("SERVER ERROR!!!");
    }
};
