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

// /api/userInfo
router.get("/userInfo", controller.getInfo);
// GET /api
// 메인페이지 - 강사 정보 조회
/**
 * @swagger
 * /api/:
 *   get:
 *     summary: 모든 강사 정보 조회
 *     description: DB에 있는 모든 강사 정보를 조회하고 send
 *     tags: [Tutors]
 *     responses:
 *       '200':
 *         description: 모든 강사 정보 조회에 따른 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               properties:
 *                 available:
 *                   type: tutor
 *                   description: 모든 강사 정보
 */
/**
 * @swagger
 * /api?q={keyword}:
 *   get:
 *     summary: 검색어(소개)로 강사들 검색
 *     description: 클라이언트가 제공한 검색어로 강사 검색합니다.
 *     tags: [Tutors]
 *     parameters:
 *       - in: query
 *         name: 검색어
 *         schema:
 *           type: string
 *         required: true
 *         description: 검색어가 소개에 포함된 강사들의 정보 조회
 *     responses:
 *       '200':
 *         description: 검색어로 검색한 결과 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               properties:
 *                 available:
 *                   type: tutor
 *                   description: 검색 결과에 해당하는 강사들 정보 응답
 */
router.get("/", controller.getTutors);
// GET /api/tutors/:tutorIdx
// 강사 상세페이지 - 강사 상세 조회
// 강사번호 파라미터

/**
 * @swagger
 * /api/tutors/{tutorIdx}:
 *   get:
 *     summary: Get tutor detail by Index
 *     description: Retrieve detailed information about a tutor by their index
 *     tags: [Tutors]
 *     parameters:
 *       - in: path
 *         name: tutorIdx
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the tutor to get details for
 *     responses:
 *       '200':
 *         description: A tutor object with detailed information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tutorInfo:
 *                   type: object
 *                   properties:
 *                     nickname:
 *                       type: string
 *                       description: The nickname of the tutor
 *                     email:
 *                       type: string
 *                       description: The email address of the tutor
 *                     description:
 *                       type: string
 *                       description: The description of the tutor
 *                     authority:
 *                       type: integer
 *                       description: The authority level of the tutor
 *                     profile_img:
 *                       type: string
 *                       description: The URL of the tutor's profile image
 *                     des_video:
 *                       type: string
 *                       description: The URL of the tutor's description video
 *                 review:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       content:
 *                         type: string
 *                         description: The content of the review
 *                       rating:
 *                         type: integer
 *                         description: The rating given in the review
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the review was created
 *       '404':
 *         description: Tutor detail not found
 *       '500':
 *         description: Failed to get tutor detail
 */
router.get("/tutors/:tutorIdx", controller.getTutorDetail);

/**
 * @swagger
 * /api/checkTutorId:
 *   get:
 *     summary: 튜터 아이디 중복 확인
 *     description: 클라이언트가 제공한 아이디가 튜터와 학생 중에 중복되는지 확인합니다.
 *     tags: [Id]
 *     parameters:
 *       - name: q
 *         in: query
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
router.post("/searchPassword", controller.searchPassword);
/**
 * @swagger
 * /api/favoritesTutor:
 *   get:
 *     summary: 찜 목록 조회
 *     description: 학생 마이페이지에서 찜 목록 누르면 추가한 튜터들 전부 조회
 *     tags: [Favorites]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: 사용자 ID(백에서 세션으로 조회 -> 로그인 상태에서만 조회 가능)
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: 찜한 튜터 목록들 결과(닉네임, 소개글, 프로필사진, 가격 보내질 예정)
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '400':
 *         description: 세션 만료했을 때 발생하는 오류
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       '500':
 *         description: 서버 오류
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 */
router.get("/favoritesTutor", controller.searchFavorites);

router.post("/logout", controller.logout);
// TODO: swagger
// POST /api/sendEmail
router.post("/email", controller.sendEmail);
/**
 * @swagger
 *
 * /api/tutor:
 *  post:
 *    summary: "튜터 회원가입"
 *    description: "[회원가입]POST 방식으로 튜터를 등록한다."
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
 *                description: "튜터 자격 정보"
 *    responses:
 *      "200":
 *        description: "회원가입 성공"
 */
router.post("/tutor", multer.single("auth"), controller.createTutor);
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
 * /api/favorites:
 *  post:
 *    summary: "강사 찜(하트) 기능"
 *    description: "강사 찜(하트) 추가. 하트를 눌렀을 때 찜 추가"
 *    tags: [Favorites]
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        description: "강사 인덱스와 학생 인덱스로 좋아요 연결"
 *        schema:
 *            type: object
 *            properties:
 *              stu_idx:
 *                type: integer
 *                description: "학생 인덱스"
 *              tutor_idx:
 *                type: integer
 *                description: "강사 인덱스"
 *    responses:
 *      "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              example: >
 *                찜 목록에 추가되었습니다.
 *      "500":
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              example: "SERVER ERROR!!!"
 */
router.post("/favorites", controller.addFavorites);
/**
 * @swagger
 *
 * /api/reviews:
 *  post:
 *    summary: "튜터 리뷰 달기"
 *    description: "[리뷰 생성]POST 방식으로 리뷰 등록.
 *                  학생 인덱스는 세션 정보에서 받아오기 때문에 로그인이 되어야만
 *                  리뷰를 달 수 있습니다."
 *    tags: [Review]
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        description: "리뷰 생성"
 *        schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *                description: "리뷰 내용"
 *              rating:
 *                type: integer
 *                description: "별점"
 *              tutor_idx:
 *                type: integer
 *                description: "튜터 인덱스"
 *    responses:
 *      "200":
 *        description: "리뷰를 성공적으로 달았습니다!!"
 *      "400":
 *        description: "빈 칸을 입력해주세요. //리뷰 내용이나 별점이 없는 경우"
 *      "500":
 *        description: "Server error(리뷰 생성 실패)"
 */
router.post("/reviews", controller.addReviews);

// patch
/**
 * @swagger
 *
 * /api/tutorProfile:
 *   patch:
 *     summary: "튜터 프로필 수정"
 *     description: "튜터의 프로필을 수정합니다."
 *     tags: [Tutors]
 *     parameters:
 *       -  in: body
 *          name: body
 *          required: true
 *          content:
 *            application/json:
 *          schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  description: "튜터 ID"
 *                changeDefaultImg:
 *                  type: string
 *                  description: "변경할 기본 이미지 URL"
 *                nickname:
 *                  type: string
 *                  description: "튜터 닉네임"
 *                password:
 *                  type: string
 *                  description: "튜터 비밀번호"
 *                level:
 *                  type: string
 *                  description: "튜터 레벨"
 *                price:
 *                  type: number
 *                  description: "튜터 가격"
 *                desVideo:
 *                  type: string
 *                  description: "튜터 소개 비디오 URL"
 *                description:
 *                  type: string
 *                  description: "튜터 자기 소개"
 *     responses:
 *       "200":
 *         description: "프로필 수정 성공"
 *       "default":
 *         description: "서버 오류"
 */
router.patch("/tutorProfile", controller.editTutorProfile);
/**
 * @swagger
 *
 * /api/editTutorPassword:
 *   patch:
 *     summary: "튜터 비밀번호 수정"
 *     description: "튜터의 비밀번호를 수정합니다."
 *     tags: [Tutors]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         content:
 *           application/json:
 *         schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: "튜터 ID"
 *               password:
 *                 type: string
 *                 description: "현재 비밀번호"
 *               newPassword1:
 *                 type: string
 *                 description: "새로운 비밀번호"
 *               newPassword2:
 *                 type: string
 *                 description: "새로운 비밀번호 확인"
 *     responses:
 *       "200":
 *         description: "비밀번호 수정 성공"
 *       "default":
 *         description: "서버 오류"
 */
router.patch("/editTutorPassword", controller.editTutorPassword);
/**
 * @swagger
 *
 * /api/studentProfile:
 *   patch:
 *     summary: "학생 프로필 수정"
 *     description: "학생의 프로필을 수정합니다."
 *     tags: [Students]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         content:
 *           application/json:
 *         schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: "학생 ID"
 *               changeDefaultImg:
 *                 type: string
 *                 description: "프로필 이미지 변경 여부"
 *               nickname:
 *                 type: string
 *                 description: "닉네임"
 *               password:
 *                 type: string
 *                 description: "비밀번호"
 *     responses:
 *       "200":
 *         description: "프로필 수정 성공"
 *       "default":
 *         description: "서버 오류"
 */
router.patch("/studentProfile", controller.editStudentProfile);
/**
 * @swagger
 *
 * /api/editStudentPassword:
 *   patch:
 *     summary: "학생 비밀번호 수정"
 *     description: "학생의 비밀번호를 수정합니다."
 *     tags: [Students]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         content:
 *           application/json:
 *         schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: "학생 ID"
 *               password:
 *                 type: string
 *                 description: "현재 비밀번호"
 *               newPassword1:
 *                 type: string
 *                 description: "새로운 비밀번호"
 *               newPassword2:
 *                 type: string
 *                 description: "새로운 비밀번호 확인"
 *     responses:
 *       "200":
 *         description: "비밀번호 수정 성공"
 *       "default":
 *         description: "서버 오류"
 */
router.patch("/editStudentPassword", controller.editStudentPassword);
router.patch("/editPhoto", multer.single("image"), controller.editPhoto);
router.patch("/backDefault", controller.editDefaultPhoto);
router.patch("/uploadVideo", multer.single("video"), controller.uploadVideo);

// TODO: swagger 수정
/**
 * @swagger
 *
 * /api/withdrawal:
 *  delete:
 *    summary: "회원 탈퇴"
 *    description: "[회원 탈퇴] DELETE 방식으로 계정을 삭제한다."
 *    tags: [Users]
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        description: "회원 탈퇴"
 *        application/json:
 *        schema:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              description: "ID"
 *            password:
 *              type: string
 *              description: "비밀번호"
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
router.delete("/withdrawal", controller.deleteUser);

/**
 * @swagger
 *
 * /api/favorites:
 *  delete:
 *    summary: "강사 찜(하트) 삭제 기능"
 *    description: "강사 찜(하트) 제거. 하트를 눌렀을 때 찜 제거"
 *    tags: [Favorites]
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        description: "강사 인덱스와 학생 인덱스로 좋아요 연결"
 *        schema:
 *            type: object
 *            properties:
 *              stu_idx:
 *                type: integer
 *                description: "학생 인덱스"
 *              tutor_idx:
 *                type: integer
 *                description: "강사 인덱스"
 *    responses:
 *      "200":
 *        description: "찜 목록에서 제거되었습니다."
 *      "500":
 *        description: "SERVER ERROR!!!"
 */
router.delete("/favorites", controller.deleteFavorites);

/**
 * @swagger
 *
 * /api/reviews:
 *  delete:
 *    summary: "리뷰 삭제 기능"
 *    description: "리뷰 삭제. 세션 정보로 받아오기에 로그인 되어야만 함."
 *    tags: [Review]
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        description: "세션으로 학생 인덱스 받고, 삭제할 리뷰 인덱스 받아야 함."
 *        schema:
 *            type: object
 *            properties:
 *              stu_idx:
 *                type: integer
 *                description: "학생 인덱스"
 *              review_idx:
 *                type: integer
 *                description: "리뷰 인덱스"
 *    responses:
 *      "200":
 *        description: "리뷰가 삭제되었습니다."
 *      "400":
 *        description: "로그인을 해주세요."
 *      "404":
 *        description: "해당하는 리뷰가 없습니다."
 *      "500":
 *        description: "SERVER ERROR!!!"
 */
router.delete("/reviews", controller.deleteReviews);

// 채팅방 메시지 조회
router.get("/messages", controller.getMessage);

// 채팅방 상대 정보 조회
router.get("/chatInfo", controller.getChatInfo);

// 채팅방 및 메세지 삭제
router.delete("/messages", controller.deleteMessage);

router.get("*", (req, res) => {
    // res.render("404");
    res.send("404page");
});

module.exports = router;
