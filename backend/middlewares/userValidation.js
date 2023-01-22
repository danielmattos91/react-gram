const {body} = require("express-validator");

const userCreateValidation = () => {
    return [
        body("name")
            .isString()
            .withMessage("O nome é obrigatório.")
            .isLength({min: 3})
            .withMessage("O nome precisa ter no minimo 3 caracteres."),
        body("email")
            .isString()
            .withMessage("O e-mail é obrigatório.")
            .isEmail()
            .withMessage("Insira uma e-mail valido."),
        body("password")
            .isString()
            .withMessage("A senha é obrigatória.")
            .isLength({min: 5})
            .withMessage("Asenha precisa ter no minimo 5 caracteres."),
        body("confirmapassword")
            .isString()
            .withMessage("A confirmação de senha é obrigatória.")
            .custom((value, {req}) => {
                if (value != req.body.password) {
                    throw new Error("As senhas não são iguais.");
                }
                return true;
            })
    ];
};

const loginValidation = () => {
    return [
        body("email")
            .isString()
            .withMessage("O e-mail é obrigatório.")
            .isEmail()
            .withMessage("Insira um e-mail valido."),
        body("password").isString().withMessage("A senha é obrigatória."),
    ];
};

module.exports = {
    userCreateValidation,
    loginValidation,
};