import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EnsureAuthenticated, SalvarFoto } from '../shared/middlewares';
import { UsuariosController } from '../controllers/usuarios';
import { PlanosController } from '../controllers/planos';

const router = Router();

router.get('/', (_, res) => {
    return res.status(StatusCodes.OK).send('Tudo certo');
});

//Usuarios
router.post('/entrar', UsuariosController.loginValidation, UsuariosController.login);
router.post('/usuarios', EnsureAuthenticated, SalvarFoto(), UsuariosController.createValidation, UsuariosController.create);
router.post('/recuperar', UsuariosController.recoverPasswordValidation, UsuariosController.recoverPassword);
router.get('/usuarios', EnsureAuthenticated, UsuariosController.getAllValidation, UsuariosController.getAll);
router.get('/usuarios/:id', EnsureAuthenticated, UsuariosController.getByIdValidation, UsuariosController.getById);
router.put('/usuarios/:id', EnsureAuthenticated, SalvarFoto(), UsuariosController.updataByIdValidation, UsuariosController.updateById);
router.delete('/usuarios/foto/:id', EnsureAuthenticated, UsuariosController.deleteFotoByIdValidation, UsuariosController.deleteFotoById);
router.delete('/usuarios/:id', EnsureAuthenticated, UsuariosController.deleteByIdValidation, UsuariosController.deleteById);
router.patch('/usuarios/password/:id', EnsureAuthenticated, UsuariosController.resetPasswordByIdValidation, UsuariosController.resetPasswordById);
//Planos
router.post('/planos', EnsureAuthenticated, PlanosController.createValidation, PlanosController.create);
router.get('/planos', EnsureAuthenticated, PlanosController.getAllValidation, PlanosController.getAll);
router.get('/planos/:id', EnsureAuthenticated, PlanosController.getByIdValidation, PlanosController.getById);
router.delete('/planos/:id', EnsureAuthenticated, PlanosController.deleteByIdValidation, PlanosController.deleteById);

export { router };