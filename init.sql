INSERT INTO tutor (tutor_idx, id, nickname, password, email, description, auth, authority, profile_img, des_video, price)
VALUES (null, "chuchu", "추추", "1234", "sesac@naver.com", "안녕하세요. 수화 통역사 자격증 보유자 추추입니다.", "자격증 정보 파일 경로 들어갈 예정(멀터)", TRUE , "프로필 이미지 사진 들어갈 예정(멀터)", "강사 자기소개 비디오 들어갈 예정", 10000);
INSERT INTO student VALUES (null, "sue", "수(학생)", "0000", "sue@naver.com", null, "profile img");
INSERT INTO review (review_idx, content, rating, created_at,tutor_idx, stu_idx) VALUES (null, "최고예요!!!!", 5, NOW(),1,1);
INSERT INTO level VALUES (null, "상", 1);
INSERT INTO message VALUES (null, "화이팅!!!", 1, 1);
INSERT INTO favorites VALUES (null, 1, 1);

SELECT * FROM tutor;

SELECT * FROM student;

SELECT * FROM review;

SELECT * FROM level;

SELECT * FROM message;

SELECT * FROM favorites;
