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

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        next(errorHandler({ type: "user not found", message: "Erro ao realizar login", status: 500 }));
    }
}

const signup = async (req, res, next) => {
    try {
        const { nome, email, senha } = req.body;
        const user = await usuariosRepository.findUserByEmail(email);
        if (user) {
            return next(errorHandler({ type: 'User already exists', message: 'Usuário já existe', status: 400 }));
        }
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        const hashPassword = await bcrypt.hash(senha, salt);

        const newUser = await usuariosRepository.insertUser({name, email, senha: hashPassword});

        res.status(201).json({ message: "Usuário criado com sucesso", user: newUser});
        
    } catch (error) {
        next(errorHandler({ type: "user creation error", message: "Erro ao criar usuário", status: 500 }));
    }
}

export default {
    login,
    signup
};