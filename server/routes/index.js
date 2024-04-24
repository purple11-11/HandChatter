const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

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
 * @swagger
 * paths:
 *  /api/signUp:
 *    get:
 *      summary: "회원가입 페이지"
 *      description: "회원가입 페이지 렌더링"
 *      responses:
 *        "200":
 *          description: "{isLogin: false}로 보낼 예정(아직 작업x)"
 */
router.get("/signUp", controller.signUp);
/**
 * @swagger
 * /api/checkTutorId?id={id}:
 *  get:
 *    summary: "특정 튜터id조회 Query 방식"
 *    description: "요청 경로에 값을 담아 서버에 보낸다."
 *    tags: [Tutors]
 *    parameters:
 *      - in: query
 *        name: query
 *        required: true
 *        description: "튜터 아이디 중복검사"
 *        schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                description: "튜터 id"
 *    responses:
 *      "200":
 *        description: "{available} // true or false"
 */
router.get("/checkTutorId", controller.checkId);
/**
 * @swagger
 * /api/checkStudentId?id={id}:
 *  get:
 *    summary: "특정 학생id조회 Query 방식"
 *    description: "요청 경로에 값을 담아 서버에 보낸다."
 *    tags: [Students]
 *    parameters:
 *      - in: query
 *        name: query
 *        required: true
 *        description: "학생 아이디 중복검사"
 *        schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                description: "학생 id"
 *    responses:
 *      "200":
 *        description: "{available} // true or false"
 */
router.get("/checkStudentId", controller.checkId);
/**
 * @swagger
 * /api/checkTutorNickname?nickname={nickname}:
 *  get:
 *    summary: "특정 튜터nickname조회 Query 방식"
 *    description: "요청 경로에 값을 담아 서버에 보낸다."
 *    tags: [Tutors]
 *    parameters:
 *      - in: query
 *        name: query
 *        required: true
 *        description: "튜터 닉네임 중복검사"
 *        schema:
 *            type: object
 *            properties:
 *              nickname:
 *                type: string
 *                description: "튜터 nickname"
 *    responses:
 *      "200":
 *        description: "{available} // true or false"
 */
router.get("/checkTutorNickname", controller.checkNickname);
/**
 * @swagger
 * /api/checkStudentNickname?nickname={nickname}:
 *  get:
 *    summary: "특정 학생nickname조회 Query 방식"
 *    description: "요청 경로에 값을 담아 서버에 보낸다."
 *    tags: [Students]
 *    parameters:
 *      - in: query
 *        name: query
 *        required: true
 *        description: "학생 닉네임 중복검사"
 *        schema:
 *            type: object
 *            properties:
 *              nickname:
 *                type: string
 *                description: "학생 닉네임"
 *    responses:
 *      "200":
 *        description: "{available} // true or false"
 */
router.get("/checkStudentNickname", controller.checkNickname);

// POST /api
/**
 * @swagger
 *
 * /api/tutor:
 *  post:
 *    summary: "튜터 회원가입"
 *    description: "POST 방식으로 튜터를 등록한다."
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
 *
 *    responses:
 *      "200":
 *        description: "회원가입 성공"
 */
router.post("/tutor", controller.createTutor);
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

module.exports = router;
