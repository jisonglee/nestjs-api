import axios from 'axios';
import faker from 'faker';

const prefixUrl = 'http://localhost:3000/api/v1';
const username = faker.internet.userName();
const password = faker.internet.password();

// 1. 서버 Health Check
const hello = async () => {
  return await axios
    .get(`${prefixUrl}/hello`)
    .then((rsp) => rsp.data)
    .catch((rsp) => rsp.response.data);
};

// 2. 유저 생성 (가입)
const createUser = async () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const data = {
    username,
    password,
  };
  return await axios
    .post(`${prefixUrl}/user`, data, { headers })
    .then((rsp) => rsp.data)
    .catch((rsp) => rsp.response.data);
};

// 3. 유저 로그인
const login = async () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const data = {
    username,
    password,
  };
  return await axios
    .post(`${prefixUrl}/auth/login`, data, { headers })
    .then((rsp) => rsp.data)
    .catch((rsp) => rsp.response.data);
};

// 4.1. 휴가 생성 (반차)
const createVacation = async (uuid, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const data = {
    year: String(new Date().getFullYear()),
    numOfDays: 0.5,
    comment: 'Created by script',
  };
  return await axios
    .post(`${prefixUrl}/user/${uuid}/vacation`, data, { headers })
    .then((rsp) => rsp.data)
    .catch((rsp) => rsp.response.data);
};

// 4.2. 휴가 생성 (연차)
const createVacation2 = async (uuid, token) => {
  const now = new Date();
  now.setDate(now.getDate() + 2);
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const data = {
    year: String(now.getFullYear()),
    startDt: now,
    endDt: now,
    numOfDays: 1,
    comment: 'Created by script',
  };
  return await axios
    .post(`${prefixUrl}/user/${uuid}/vacation`, data, { headers })
    .then((rsp) => rsp.data)
    .catch((rsp) => rsp.response.data);
};

// 5. 휴가 조회
const getVacations = async (uuid, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  return await axios
    .get(`${prefixUrl}/user/${uuid}/vacation`, { headers })
    .then((rsp) => rsp.data)
    .catch((rsp) => rsp.response.data);
};

// 6. 휴가 삭제 (취소)
const deleteVacation = async (uuid, token, vacationUUID) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  return await axios
    .delete(`${prefixUrl}/user/${uuid}/vacation/${vacationUUID}`, { headers })
    .then((rsp) => rsp.data)
    .catch((rsp) => rsp.response.data);
};

// 7. 유저 삭제
const deleteUser = async (uuid, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  return await axios
    .delete(`${prefixUrl}/user/${uuid}`, { headers })
    .then((rsp) => rsp.data)
    .catch((rsp) => rsp.response.data);
};

(async () => {
  try {
    console.log('REQ 1. Health Check (GET /api/v1/hello)');
    console.log('RSP 1.', await hello());

    console.log('\nREQ 2. Create User (POST /api/v1/user)');
    const resultCreateUser = await createUser();
    console.log('RSP 2.', resultCreateUser);

    console.log('\nREQ 3. Login (POST /api/v1/auth/login)');
    const resultLogin = await login();
    console.log('RSP 3.', resultLogin);

    const uuid = resultLogin.objects[0].uuid;
    const token = resultLogin.auth.accessToken;

    console.log(
      '\nREQ 4.1. Create Vacation 반차 (POST /api/v1/user/:uid/vacation)',
    );
    const resultCreateVacation = await createVacation(uuid, token);
    console.log('RSP 4.1.', resultCreateVacation);

    const vacationUUID = resultCreateVacation.objects[0].uuid;

    console.log(
      '\nREQ 4.2. Create Vacation 연차 (POST /api/v1/user/:uid/vacation)',
    );
    const resultCreateVacation2 = await createVacation2(uuid, token);
    console.log('RSP 4.2.', resultCreateVacation2);

    const vacationUUID2 = resultCreateVacation2.objects[0].uuid;

    console.log('\nREQ 5. Get Vacations (GET /api/v1/user/:uid/vacation)');
    console.log('RSP 5.', await getVacations(uuid, token));

    console.log(
      '\nREQ 6.1. Delete Vacation 에러 (DELETE /api/v1/user/:uid/vacation/:vid)',
    );
    console.log('RSP 6.1.', await deleteVacation(uuid, token, vacationUUID));

    console.log(
      '\nREQ 6.2. Delete Vacation 성공 (DELETE /api/v1/user/:uid/vacation/:vid)',
    );
    console.log('RSP 6.2.', await deleteVacation(uuid, token, vacationUUID2));

    console.log('\nREQ 7. Delete User (DELETE /api/v1/user/:uid)');
    console.log('RSP 7.', await deleteUser(uuid, token));
  } catch (e) {}
})();
