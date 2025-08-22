import db, { insert, update } from "../db/db.js";

const usuariosRepository = {
  findUserByEmail: async (email) => {
    return await db('usuarios').where({ email }).first();
    },

    findUserById: async (id) => {
      return await db('usuarios').where({ id }).first();
    },

    insertUser: async (user) => {
        return await db('usuarios').insert(user).returning('*');
    },  

    updateUser: async (id, user) => {
        return await db('usuarios').where({ id }).update(user).returning('*');
    },

    deleteUser: async (id) => {
        return await db('usuarios').where({ id }).del();
    }
};

export default usuariosRepository;