const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");

const jwtsecret = process.env.JWT_SECRET;

//gerar token do usuario
const generateToken = (id) => {
    return jwt.sign({id}, jwtsecret,{
        expiresIn: "7d",
    });
};

//registro e login
const register = async (req, res) => {
    const {name, email, password} = req.body;

    const user = await User.findOne({email});

    if(user) {
        res.status(422).json({errors: ["Por favor ultilize outro e-mail."]})
        return
    }

    //gerar senha
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //criação de usuario
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    });

    //se o usuario for criado com sucesso
    if(!newUser) {
        res.status(422).json({errors: ["Houve um erro por favor tente mais tarde."]});
        return;
    }

    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id),
    });
};

const login = async (req, res) => {
    
    const {email, password} = req.body

    const user = await User.findOne({email})

    //checar se existe usuarios
    if(!user) {
        res.status(404).json({errors:["Usuario não encontrado."]})
        return
    }

    //checar se as senhas dão match
    if(!(await bcrypt.compare(password, user.password))) {
        res.status(422).json({errors: ["senha invalida."]})
        return
    }

    //retorno do usuario com token
    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id),
    });
};

module.exports = {
    register,
    login,
}