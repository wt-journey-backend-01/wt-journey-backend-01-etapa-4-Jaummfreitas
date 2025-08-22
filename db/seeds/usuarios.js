/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('usuarios').del()
  await knex('usuarios').insert([
    {id: 1, nome: 'João', email: 'joao@yopmail.com', senha: 'SenhaSegura123!'},
    {id: 2, nome: 'Tales', email: 'twallesSilva@gmail.com', senha: 'AgoraVaiSenha2!'},
    {id: 3, nome: 'Bia', email: 'bibiagames@gmail.com', senha: 'SeguraSenha#3'}
  ]);
};
