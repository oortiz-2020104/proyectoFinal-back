'use strict'

const User = require('../models/user.model');
const Category = require('../models/category.model');

const bcrypt = require('bcrypt-nodejs');
const fs = require('fs')

exports.validateData = (data) => {
    let keys = Object.keys(data),
        msg = '';

    for (let key of keys) {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
        msg += `El parámetro ${key} es obligatorio\n`
    }
    return msg.trim();
}

exports.validateExtension = async (ext, filePath) => {
    try {
        if (ext == 'png' ||
            ext == 'jpg' ||
            ext == 'jpeg' ||
            ext == 'gif') {
            return true;
        } else {
            fs.unlinkSync(filePath);
            return false;
        }
    } catch (err) {
        console.log(err)
        return err
    }
}

//* Usuarios ---------------------------------------------------------------------------------------
exports.findUser = async (username) => {
    try {
        let exist = await User.findOne({ username: username }).lean();
        return exist;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkPassword = async (password, hash) => {
    try {
        return bcrypt.compareSync(password, hash);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.encrypt = async (password) => {
    try {
        return bcrypt.hashSync(password);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkUpdate = async (params) => {
    try {
        if (params.password || Object.entries(params).length === 0 || params.role) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkUpdate_OnlyAdmin = async (params) => {
    try {
        if (Object.entries(params).length === 0 || params.password) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

//* Categorías ---------------------------------------------------------------------------------------
exports.findCategory = async (name) => {
    try {
        let exist = await Category.findOne({ name: { $regex: name, $options: 'i' } });
        return exist;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkUpdateCategory = async (params) => {
    try {
        if (Object.entries(params).length === 0) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}