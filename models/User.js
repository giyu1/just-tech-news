const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');
const { update } = require('lodash');

// create our User model 
class User extends Model { }

// define table columns and configuration 
User.init(
    {
        // TABLE COLUMN DEFINTION GO HERE 

        // define an id column
        id: {
            // user the special Seqelize DataType object to provide what type of data it is 
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's `NOT NULl` option
            allowNull: false,
            // instruct that this is the Primary Key 
            primaryKey: true,
            // turn on auto increment 
            autoIncrement: true
        },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table 
            unique: true,
            // if allowNull is set to false, we can run our datat through validators before creating the table data 
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four characters long 
                len: [4]
            }
        }
    },
    {// TABLE CONFIGURATION OPTIONS GO HERE 
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality 
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // set up beforeUpdate lifecycle "hook" functionality 
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },

        // pass in our imported sequelize connection
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table 
        freezeTableName: true,
        // user underscores instead of camel-casing 
        underscored: true,
        // make it so our model name stays lowercase in the database 
        modelName: 'user'
    }
);

module.exports = User; 