import 'reflect-metadata';
import { server } from './server/Server';
import { AppDataSource } from './server/database';
import { UserDefault } from './server/shared/services';

AppDataSource.initialize().then(async () => {

    // eslint-disable-next-line quotes
    console.log(`\nBanco de dados conectado\n`);

    server.listen(process.env.PORT, async () => {
        await UserDefault();
        console.log(`Servidor rodando no endereço: http://${process.env.HOST}:${process.env.PORT}\n`);
    });

}).catch((error) => {

    if (error.code == String('3D000')) {
        console.log(error);
    }
});
