# NestJS API Server

* 사용 언어: Typescript
* 사용 프레임워크 : NestJS

## Prerequisite

1. `share/ddl/user.ddl` 에 따라 데이터베이스, 테이블 및 인덱스 생성
2. `config/.env.{MODE}` 실행하려는 환경 파일에 DB 설정 입력
3. `npm install` 실행

## Usage

Run in production environment
```
npm run build
npm run start:prod
```

Run in development environment
```
npm run start:dev
```

## Run Script

With Script
```shell
# 스크립트 디렉토리로 이동
cd share/script
npm install
node request.js
```

With Jest
```shell
# 서비스 단위 테스트 
npm run test:dev

# e2e 테스트
npm run test:e2e
```

## API List
### Health Check
* GET /api/v1/hello

### Authentication
* POST /api/v1/auth/login

### User
* GET /api/v1/user
* POST /api/v1/user
* GET /api/v1/user/:id
* PUT /api/v1/user/:id
* DELETE /api/v1/user/:id

### Vacation
* GET /api/v1/user/:uid/vacation
* POST /api/v1/user/:uid/vacation
* GET /api/v1/user/:uid/vacation/:id
* PUT /api/v1/user/:uid/vacation/:id
* DELETE /api/v1/user/:uid/vacation/:id
