const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");
const multer = require("../modules/multer/multer");

/**
 * @swagger
 * tags:
 *   name: Tutors
 *   description: 튜터 추가 수정 삭제 조회
 */
/**
 * @swagger
 * tags:
 *   name: Students
 *   description: 학생 추가 수정 삭제 조회
 */

// GET /api

router.get("/", controller.getIndex);
/**
 * 회원가입: 튜터
 * 사용자가 튜터로 회원가입할 때 호출됩니다.
 *
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @returns {Object} isLogin: false - 로그인 상태를 나타내는 객체
 */
router.get("/signUpTutor", controller.signUpTutor);
/**
 * 회원가입: 학생
 * 사용자가 학생으로 회원가입할 때 호출됩니다.
 *
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @returns {Object} isLogin: false - 로그인 상태를 나타내는 객체
 */
router.get("/signUpStudent", controller.signUpStudent);
/**
 * 로그인 처리
 * 사용자의 로그인을 처리합니다.
 *
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @returns {Object} isLogin: false - 로그인 상태를 나타내는 객체
 */
router.get("/login", controller.login);
/**
 * @swagger
 * /api/checkTutorId:
 *   get:
 *     summary: 튜터 아이디 중복 확인
 *     description: 클라이언트가 제공한 아이디가 튜터와 학생 중에 중복되는지 확인합니다.
 *     tags: [Id]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 확인할 아이디
 *     responses:
 *       '200':
 *         description: 중복 여부에 따른 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   description: 아이디의 중복 여부
 */
router.get("/checkTutorId", controller.checkId);
/**
 * @swagger
 * /api/checkStudentId:
 *   get:
 *     summary: 학생 아이디 중복 확인
 *     description: 클라이언트가 제공한 아이디가 튜터와 학생 중에 중복되는지 확인합니다.
 *     tags: [Id]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 확인할 아이디
 *     responses:
 *       '200':
 *         description: 중복 여부에 따른 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   description: 아이디의 중복 여부
 */
router.get("/checkStudentId", controller.checkId);
/**
 * @swagger
 * /api/checkTutorNickname:
 *   get:
 *     summary: 닉네임 중복 확인
 *     description: 클라이언트가 제공한 닉네임이 튜터와 학생 중에서 중복되는지 확인합니다.
 *     tags: [Nickname]
 *     parameters:
 *       - in: query
 *         name: nickname
 *         schema:
 *           type: string
 *         required: true
 *         description: 확인할 닉네임
 *     responses:
 *       '200':
 *         description: 중복 여부에 따른 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   description: 닉네임의 중복 여부
 */
router.get("/checkTutorNickname", controller.checkNickname);
/**
 * @swagger
 * /api/checkStudentNickname:
 *   get:
 *     summary: 닉네임 중복 확인
 *     description: 클라이언트가 제공한 닉네임이 튜터와 학생 중에서 중복되는지 확인합니다.
 *     tags: [Nickname]
 *     parameters:
 *       - in: query
 *         name: nickname
 *         schema:
 *           type: string
 *         required: true
 *         description: 확인할 닉네임
 *     responses:
 *       '200':
 *         description: 중복 여부에 따른 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   description: 닉네임의 중복 여부
 */
router.get("/checkStudentNickname", controller.checkNickname);
/**
 * @swagger
 * /api/searchId:
 *   get:
 *     summary: 사용자 이메일로 ID 검색
 *     description: 사용자의 이메일로 등록된 ID를 검색합니다.
 *     tags:
 *       - Tutors
 *       - Students
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: 검색할 사용자 이메일
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: ID 검색 결과
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "회원님의 아이디는 ABC123입니다."
 *       '400':
 *         description: 빈칸을 입력했을 때 발생하는 오류
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "빈칸을 입력해주세요."
 *       '404':
 *         description: 존재하지 않는 이메일일 때 발생하는 오류
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "존재하지 않는 이메일입니다. 다시 입력해주세요."
 *       '500':
 *         description: 서버 오류
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 */
router.get("/searchId", controller.searchId);
/**
 * @swagger
 * /api/searchPassword:
 *   get:
 *     summary: 사용자 ID와 이메일로 비밀번호 재설정 링크 전송
 *     description: 사용자의 ID와 이메일을 받아 새로운 비밀번호를 설정할 수 있는 링크를 전송합니다.
 *     tags:
 *       - Tutors
 *       - Students
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: 사용자 ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         required: true
 *         description: 사용자 이메일
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: 비밀번호 재설정 링크 전송 결과
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<script>alert('새로운 비밀번호를 입력해주세요').res.redirect('/inputPassword')</script>"
 *       '400':
 *         description: 빈칸을 입력했을 때 발생하는 오류
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "빈칸을 입력해주세요."
 *       '404':
 *         description: 유효하지 않은 값일 때 발생하는 오류
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "유효하지 않은 값입니다. 다시 입력해주세요."
 *       '500':
 *         description: 서버 오류
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 */
router.get("/searchPassword", controller.searchPassword);

router.get("/logout", controller.logout);
// POST /api
/**
 * @swagger
 *
 * /api/tutor:
 *  post:
 *    summary: "튜터 회원가입"
 *    description: "[회원가입]POST 방식으로 튜터을 등록한다."
 *    tags: [Tutors]
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        description: "튜터 회원가입"
 *        schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                description: "튜터 id"
 *              nickname:
 *                type: string
 *                description: "튜터 닉네임"
 *              password:
 *                type: string
 *                description: "튜터 비밀번호"
 *              email:
 *                type: string
 *                description: "튜터 이메일"
 *              auth:
 *                type: string
 *                description: "튜터 자격 정보 파일"
 *    responses:
 *      "200":
 *        description: "회원가입 성공"
 */
router.post("/tutor", multer.single(""), controller.createTutor);
/**
 * @swagger
 *
 * /api/student:
 *  post:
 *    summary: "학생 회원가입"
 *    description: "[회원가입]POST 방식으로 학생을 등록한다."
 *    tags: [Students]
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        description: "학생 회원가입"
 *        schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                description: "학생 id"
 *              nickname:
 *                type: string
 *                description: "학생 닉네임"
 *              password:
 *                type: string
 *                description: "학생 비밀번호"
 *              email:
 *                type: string
 *                description: "학생 이메일"
 *    responses:
 *      "200":
 *        description: "회원가입 성공"
 */
router.post("/student", controller.createStudent);
/**
 * @swagger
 *
 * /api/loginTutor:
 *  post:
 *    summary: "튜터 로그인"
 *    description: "[로그인]POST 방식으로 튜터 로그인."
 *    tags: [Tutors]
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        description: "튜터 로그인"
 *        schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                description: "튜터 id"
 *              password:
 *                type: string
 *                description: "튜터 비밀번호"
 *    responses:
 *      "200":
 *        description: "{isLogin: true}   //로그인 성공"
 *      "400":
 *        description: "비밀번호가 일치하지 않습니다. 다시 시도해주세요.  //아이디는 있지만 비밀번호 불일치"
 *      "403":
 *        description: "존재하지 않는 아이디입니다. 다시 시도해주세요.   // user 못찾았을 때,"
 */
router.post("/loginTutor", controller.loginTutor);
/**
 * @swagger
 *
 * /api/loginStudent:
 *  post:
 *    summary: "학생 로그인"
 *    description: "[로그인]POST 방식으로 학생 로그인."
 *    tags: [Students]
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        description: "학생 로그인"
 *        schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                description: "학생 id"
 *              password:
 *                type: string
 *                description: "학생 비밀번호"
 *    responses:
 *      "200":
 *        description: "{isLogin: true}  //로그인 성공"
 *      "400":
 *        description: "비밀번호가 일치하지 않습니다. 다시 시도해주세요.  //아이디는 있지만 비밀번호 불일치"
 */
router.post("/loginStudent", controller.loginStudent);

/**
 * @swagger
 *
 * /api/tutor:
 *  delete:
 *    summary: "튜터 회원 탈퇴"
 *    description: "[회원 탈퇴] DELETE 방식으로 튜터 계정을 삭제한다."
 *    tags: [Tutors]
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        description: "튜터 회원 탈퇴"
 *        application/json:
 *        schema:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              description: "튜터 ID"
 *            password:
 *              type: string
 *              description: "튜터 비밀번호"
 *    responses:
 *      '200':
 *        description: "회원 탈퇴 성공"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  description: "회원 탈퇴 성공 여부"
 *                msg:
 *                  type: string
 *                  description: "메시지"
 *      '400':
 *        description: "Bad Request"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: "오류 메시지"
 *      '401':
 *        description: "Unauthorized"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: "권한 없음"
 *      '500':
 *        description: "Internal Server Error"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: "서버 오류"
 */
router.delete("/tutor", controller.deleteTutor);
/**
 * @swagger
 *
 * /api/student:
 *  delete:
 *    summary: "학생 회원 탈퇴"
 *    description: "[회원 탈퇴] DELETE 방식으로 학생 계정을 삭제한다."
 *    tags: [Students]
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        description: "학생 회원 탈퇴"
 *        application/json:
 *        schema:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              description: "학생 ID"
 *            password:
 *              type: string
 *              description: "학생 비밀번호"
 *    responses:
 *      '200':
 *        description: "회원 탈퇴 성공"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  description: "회원 탈퇴 성공 여부"
 *                msg:
 *                  type: string
 *                  description: "메시지"
 *      '400':
 *        description: "Bad Request"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: "오류 메시지"
 *      '401':
 *        description: "Unauthorized"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: "권한 없음"
 *      '500':
 *        description: "Internal Server Error"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: "서버 오류"
 */
router.delete("/student", controller.deleteStudent);

router.get("*", (req, res) => {
    // res.render("404");
    res.send("404page");
});

module.exports = router;
