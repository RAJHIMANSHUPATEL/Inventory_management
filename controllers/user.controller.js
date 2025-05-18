const User = require("../models/user.model");
const bcrypt = required("bcrypt")
const jwt =  require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

const registerUser = async(req, res)=> {
    try {
        const {name, email, phone, password, address, role} = req.body;
        if(!name || email || phone || password || role ) {
            return res.status(400).json({
                message: "Failure",
                baseResponse: {
                    status: "400",
                    data: {},
                    error: "Please fill all the fields"
                }
            })
        }
        
        const exists = User.findOne({email});
        if(exists){
            return res.status(400).json({
                message: "Failure",
                baseResponse: {
                    status: "400",
                    data: {},
                    error: "This email is already registered"
                }
            })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name, email, phone, password: hashPassword, address, role
        })

        const token = jwt.sign({id: newUser._id, role: newUser.role}, JWT_SECRET, {
            expiresIn: "7d",
        });
        
        res.status(201).json({
            message: "Success",
            baseResponse: {
                status: 201,
                data: {
                    user: {
                        _id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        phone: newUser.phone,
                        role: newUser.role,
                    },
                    token,
                },
                error: null
            }
        })
        
    } catch (error) {
        res.status(400).json({
            message: "Failure",
            baseResponse: {
                status: 400,
                data: {},
                error: error.message
            }
        })
    }
}