const Photo = require("../models/Photo");
const User = require("../models/User");

const mongoose = require("mongoose");

//insert a photo, with as user realated to it
const insertPhoto = async (req, res) => {
    const {title} = req.body;
    const image = req.file.filename;

    const reqUser = req.user

    const user = await User.findById(reqUser._id);

    // create a photo
    const newPhoto = await Photo.create({
        image,
        title,
        userId: userId._id,
        userName: user.name,
    });

    //if photo was created sucessfully, retunr data
    if (!newPhoto) {
        res.status(422).json({
            errors: ["Houve um problema, por favor tente mais tarde."]
        });
        return;
    }

    res.status(201).json(newPhoto);
};

const deletePhoto = async (req, res) => {
    
    const {id} = req.params;

    const reqUser = req.user;
    
    try {
        const photo = await Photo.findById(mongoose.Types.ObjectId(id));

        // check is photo exists
        if(!photo) {
            res.status(404).json({errors: ["Foto não encontrada."]});
            return;
        }
    
        //check photo belongs to use
        if(!photo.userId.equals(reqUser._id)) {
            res.status(422).json({errors: ["Ocorreu um erro por favor tente novamente."]});
        }
    
        await Photo.findByIdAndDelete(photo._id);
    
        res.status(200).json({id: photo._id, message: "Foto excluida com sucesso."});

    } catch (error) {
        res.status(404).json({errors: ["Foto não encontrada."]});
        return;
    }
};

// get all photos
const getAllPhotos = async(req, res) => {

    const photos = await Photo.find({})
        .sort([["createdAt", -1]])
        .exec();
    return res.status(200).json(photos);

};

//get user photos
const getUserPhotos = async(req, res) => {

    const {id} = req.params;

    const photos = await Photo.find({})
        .sort([["createdAt", -1]])
        .exec();
    return res.status(200).json(photos);

};

const getPhotoById = async(req, res) => {

    const {id} = req.params;

    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    //check is photos exists
    if(!photo) {
        res.status(404).json({errors: ["Foto não encontrada."]});
        return;
    }

    res.status(200).json(photo);

};

//upadate a photo
const updatePhoto = async(req, res) => {

    const {id} = req.params;
    const {title} = req.user;

    const photo = await Photo.findById(id);

    //check is photos exists
    if(!photo) {
        res.status(404).json({errors: ["Foto não encontrada."]});
        return;
    }
    
    //check photo belongs to use
    if(!photo.userId.equals(reqUser._id)) {
        res.status(422).json({errors: ["Ocorreu um erro por favor tente novamente."]});
        return;
    }

    if(title) {
        photo.title = title;
    }

    await photo.save();

    res.status(200).json({photo, message: "Foto atualizada com sucesso!"});
 
};

// like functionality
const likePhoto = async(req, res) => {

    const {id} = req.params;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    //check is photos exists
    if(!photo) {
        res.status(404).json({errors: ["Foto não encontrada."]});
        return;
    }

    //check if user alredy liked the photo
    if (photo.likes.includes(reqUser._id)) {
        res.status(422).json({errors: ["Você ja curtiu a foto."]});
        return;
    }

    //put user id in likes array
    photo.likes.push(reqUser._id);

    photo.save();

    res.status(200).json({photoId: id, userId: reqUser._id, message: "A foto foi curtida."})
};

// comment functiolnality

const commentPhoto = async(req, res) => {

    const {id} = req.params;
    const {comment} = req.body;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(id);

    //check is photos exists
    if(!photo) {
        res.status(404).json({errors: ["Foto não encontrada."]});
        return;
    }

    // put comment en the arrays comments
    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id
    };
    
    photo.comments.push(userComment);

    await photo.save();

    res.status(200).json({
        comment: userComment,
        message: "O comentario foi adicionado com sucesso."
    });
};

//search phto by title
const searchPhotos = async(res, req) => {

    const {q} = req.query;

    const photos = await Photo.find({title: new RegExp(q, "i")}).exec();

    res.status(200).json(photos);
};


module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos,
};