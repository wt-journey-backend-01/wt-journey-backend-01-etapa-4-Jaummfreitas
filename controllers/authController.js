import usuariosRepository from "../repositories/usuariosRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import errorHandler from "../utils/errorHandler";
import { type } from "os";

const login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;

        const user = await usuariosRepository.findUserByEmail(email);
        if (!user) {
            return next(errorHandler({ type: 'not_found', message: 'Usuário não encontrado', status: 404 }));
        }

        const isPasswordValid = await bcrypt.compareSync(senha, user.senha);
        if (!isPasswordValid) {
            return next(errorHandler({ type: 'validation', message: 'Senha incorreta', status: 401 }));
        }

    const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ acess_token: token });
    } catch (error) {
        next(errorHandler({ type: "user not found", message: "Erro ao realizar login", status: 500 }));
    }
}

const register = async (req, res, next) => {
    try {
        const { nome, email, senha } = req.body;
        const user = await usuariosRepository.findUserByEmail(email);
        if (user) {
            return next(errorHandler({ type: 'User already exists', message: 'Email já está em uso', status: 400 }));
        }

        const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!senhaForteRegex.test(senha)) {
            return next(errorHandler({ type: 'validation', message: 'Senha fraca. Deve ter no mínimo 8 caracteres, uma maiúscula, uma minúscula, um número e um caractere especial.', status: 400 }));
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(senha, salt);
        const [newUser] = await usuariosRepository.insertUser({ nome, email, senha: hashPassword });
        res.status(201).json({ message: "Usuário criado com sucesso", user: { id: newUser.id, nome: newUser.nome, email: newUser.email } });
    } catch (error) {
        next(errorHandler({ type: "user creation error", message: "Erro ao criar usuário", status: 500 }));
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await usuariosRepository.findUserById(id);
        if (!user) {
            return next(errorHandler({ type: 'not_found', message: 'Usuário não encontrado', status: 404 }));
        }
        await usuariosRepository.deleteUser(id);
        res.status(200).json({ message: "Usuário excluído com sucesso" });
    } catch (error) {
        next(errorHandler({ type: "delete error", message: "Erro ao excluir usuário", status: 500 }));
    }
}

const logout = async (req, res, next) => {
    try {
        res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (error) {
        next(errorHandler({ type: "logout error", message: "Erro ao realizar logout", status: 500 }));
    }
}

export default {
    register,
    login,
    logout,
    deleteUser
};