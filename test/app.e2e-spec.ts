import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as faker from 'faker';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from '@/models/user/dto/user.dto';
import { TransformInterceptor } from '@/common/interceptors/tranform.interceptor';
import { CreateOrUpdateVacationDto } from '@/models/vacation/dto/vacation.dto';
import { LoginDto } from '@/authentication/dto/login.dto';

const username: string = faker.internet.userName();
const password: string = faker.internet.password();

let userUUID: string;
let vacationUUID: string;
let bearerToken: string;

describe('Hello (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/hello (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/hello')
      .expect(HttpStatus.OK);
  });
});

describe('Create User (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/user (POST)', () => {
    const user: CreateUserDto = {
      username,
      password,
      details: [
        {
          key: 'vacation',
          value: '15',
        },
      ],
    };

    return request(app.getHttpServer())
      .post('/api/v1/user')
      .expect(HttpStatus.CREATED)
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.objects).toBeDefined();
        userUUID = body.objects[0].uuid;
      });
  });
});

describe('Login (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/auth/login (POST)', () => {
    const login: LoginDto = {
      username,
      password,
    };

    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .expect(HttpStatus.CREATED)
      .set('Accept', 'application/json')
      .send(login)
      .expect(({ body }) => {
        expect(body.auth).toBeDefined();
        bearerToken = body.auth.accessToken;
      });
  });
});

describe('Get User (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/user (GET)', () => {
    return request(app.getHttpServer())
      .get(`/api/v1/user/${userUUID}`)
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(HttpStatus.OK);
  });
});

describe('Create Vacation (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/user/:id/vacation (POST)', () => {
    const now = new Date();
    now.setDate(now.getDate() + 1);

    const vacation: CreateOrUpdateVacationDto = {
      year: String(now.getFullYear()),
      startDt: now,
      endDt: now,
      numOfDays: 1,
    };

    return request(app.getHttpServer())
      .post(`/api/v1/user/${userUUID}/vacation`)
      .expect(HttpStatus.CREATED)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${bearerToken}`)
      .send(vacation)
      .expect(({ body }) => {
        expect(body.objects).toBeDefined();
        vacationUUID = body.objects[0].uuid;
      });
  });
});

describe('Get Vacations (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/user/:id/vacation (GET)', () => {
    return request(app.getHttpServer())
      .get(`/api/v1/user/${userUUID}/vacation`)
      .expect(HttpStatus.OK)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(({ body }) => {
        expect(body.objects).toBeDefined();
        expect(body.objects.find((e) => e.uuid === vacationUUID)).toBeDefined();
      });
  });
});

describe('Delete(Cancel) Vacation (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/user/:id/vacation/:vid (DELETE)', (done) => {
    return request(app.getHttpServer())
      .delete(`/api/v1/user/${userUUID}/vacation/${vacationUUID}`)
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(HttpStatus.OK)
      .end(done);
  });
});
