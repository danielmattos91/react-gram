const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const { default: mongoose } = require("mongoose");


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

// get current log in user
const getCurrentUser = async(req, res) => {
    const user = req.user;

    req.status(200).json(user);
};

// upate an user
const update = async (req, res) => {
    const {name, password, bio} = req.body

    let profileImage = null

    if(req.file) {
        profileImage = req.file.filename
    }

    const user = await User.findByIdd(mongoose.Types.ObjectId(reqUser._id)).select("-password")

    if(name) {
        user.name = name;
    }

    if (password) {
        //gerar senha
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash
    }

    if(profileImage) {
        user.profileImage = profileImage
    }

    if(bio) {
        user.bio = bio
    }

    await user.save();

    res.status(200).json(user);
};

//get users by id
const getUserById = async(req, res) => {

    const {id} = req.params;

    try {

        const user = await User.findById(mongoose.Types.ObjectId(id).select("-password"));

        //check user exists
        if(!user) {
            res.status(404).json({errors: ["Usuario não encontrado."]});
            return;
        }

        res.status(200).json(user);

    } catch (error) {

        res.status(422).json({errors: ["Usuario não encontrado."]});
        return;
        
    }  
}


module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
}