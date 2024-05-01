const { Tutor } = require("../models");

//PATCH /admin
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
