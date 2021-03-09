module.exports = [
  {
    name: 'default',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'oper',
    password: 'oper!098',
    database: 'test',
    entities: ['dist/**/*.entity{.ts,.js}', 'src/**/*.entity{.ts,.js}'],
    synchronize: true,
  },
];
