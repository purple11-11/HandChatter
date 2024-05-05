const { Tutor, Student } = require("../models");

//GET /admin
exports.getUsers = async (req, res) => {
    try {
        const id = req.session.adminId;
        if (id) {
            const users = await Tutor.findAll({
                attributes: ["tutor_idx", "id", "nickname", "auth", "email", "authority"],
            });

            res.status(200).send({ users });
        } else return res.status(400).send("관리자로 로그인을 해주세요.");
    } catch (error) {
        console.log(error);
        res.status(500).send("SERVER ERROR!!!");
    }
};

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
                req.session.adminId = id;
                req.session.role = "admin";
                console.log("session 저장 ::", req.session.adminId, req.session.role);
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
        const adminId = req.session.adminId;
        console.log("req.body", req.body);
        const { id, authority } = req.body;
        if (adminId) {
            console.log(id);
            if (!id) {
                res.status(400).send("튜터로 변경할 회원을 선택해주세요.");
            } else {
                await Tutor.update(
                    {
                        authority: authority,
                    },
                    {
                        where: {
                            id,
                        },
                    }
                );
            }
            return res.status(200).send({
                result: true,
                msg: `${id}님을 ${authority === 0 ? "예비튜터" : "튜터"}로 변경하였습니다.`,
            });
        }
        res.status(400).send({ result: false, msg: "관리자 로그인을 해주세요." });
    } catch (error) {
        console.log(error);
        res.status(500).send("SERVER ERROR!!!");
    }
};

exports.logout = (req, res) => {
    try {
        if (req.session) {
            req.session.destroy(() => {
                res.status(200).send({ msg: "로그아웃 되었습니다." });
            });
        } else res.status(401).send({ msg: "이미 세션이 만료되었습니다." });
    } catch (err) {
        res.status(500).send("SERVER ERROR");
    }
};

// exports.patchAllName = async (req, res) => {
//     try {
//         const { patchData } = req.body;
//         console.log("req.body", req.body);
//         for (let visitor of patchData) {
//             const [updated] = await models.Visitor.update(
//                 {
//                     authority: visitor.authority,
//                 },
//                 {
//                     where: {
//                         id: visitor.id,
//                     },
//                 }
//             );
//         }

//         res.status(200).send("수정 성공");
//     } catch (err) {
//         // errorlog(err, '이름전체 수정중 에러 발생');
//     }
// };
