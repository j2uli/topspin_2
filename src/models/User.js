const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
  type: DataTypes.STRING,
  allowNull: true
},
direccion: {
  type: DataTypes.STRING,
  allowNull: true
},
fecha_nacimiento: {
  type: DataTypes.DATEONLY,
  allowNull: true
}

}, {
  tableName: 'users'
});

module.exports = Usuario;
