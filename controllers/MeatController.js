import Meat from "../models/MeatModel.js";
import path from "path"
import fs from "fs"

export const getMeats = async(req, res) => {
    try {
        const response = await Meat.findAll()
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
};

export const getMeatById = async(req, res) => {
    try {
        const response = await Meat.findOne({
            where:{
                id : req.params.id
            }
        })
        res.json(response)
    } catch (error) {
        console.log(error.message);
    }
};

export const saveMeat = (req, res) => {
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"})
    const {name, description} = req.body
    const file = req.files.file
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`
    const allowedType = ['.png', '.jpg', '.jpeg']
    
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: 'Invalid Images'})
    if(fileSize > 5000000) return res.status(422).json({msg: 'Image must be less than 5MB'})
    
    file.mv(`./public/images/${fileName}`, async(err)=> {
        if(err) return res.status(500).json({msg: err.message})
        try {
            await Meat.create({
                name: name, 
                description: description,  
                image: fileName, 
                url: url
            })
            res.status(201).json({msg: "Meat Image Created Succesfully"})
        } catch (error) {
            console.log(error.message);
        }
    })
};

export const updateMeat = async(req, res) => {
    const meat = await Meat.findOne({
        where:{
            id : req.params.id
        }
    })
    if(!meat) return res.status(404).json({msg: "Data not Found"})
    let fileName = ""
    if(req.files == null) {
        fileName = meat.image
    } else {
        const file = req.files.file
        const fileSize = file.data.length
        const ext = path.extname(file.name)
        fileName = file.md5 + ext
        const allowedType = ['.png', '.jpg', '.jpeg']

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: 'Invalid Images'})
        if(fileSize > 5000000) return res.status(422).json({msg: 'Image must be less than 5MB'})

        const filepath = `./public/images/${meat.image}`
        fs.unlinkSync(filepath)

        file.mv(`./public/images/${fileName}`, (err)=> {
            if(err) return res.status(500).json({msg: err.message})
        })        
    }

    const {name, brand, price, capacity, type, year} = req.body  
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`

    try {
        await Meat.update({
            name: name, 
            brand: brand,  
            price: price,  
            capacity: capacity,  
            type: type,  
            year: year,  
            image: fileName, 
            url: url
        }, {
            where:{
                id : req.params.id
            }
        })
        res.status(200).json({msg: "Data Updated Succesfully"})
    } catch (error) {
        console.log(error.message);
    }
};

export const deleteMeat = async(req, res) => {
    const meat = await Meat.findOne({
        where:{
            id : req.params.id
        }
    })
    if(!meat) return res.status(404).json({msg: "Data not Found"})
    try {
        const filepath = `./public/images/${meat.image}`
        fs.unlinkSync(filepath)
        await Meat.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({msg: "Meat Image Deleted Succesfully"})
    } catch (error) {
        console.log(error.message);
    }
};