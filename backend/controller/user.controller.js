import sendEmail from "../config/sendEmail.js";
import UserModel from "./../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "./../utils/verifyEmailTemplate.js";

export async function registerUserController(request, response) {
  try {
    //these are the mandotory information ab the time of user registration
    const { name, email, password } = request.body;
    if (!name || email || password) {
      return response.status(400).json({
        message: "provide email , name ,password",
        error: true,
        success: false,
      });
    }

    // cheking the email with the database if the user exiest or not if exiest then return the error msg
    const user = await UserModel.findOne({ email });
    if (user) {
      return response.json({
        message: "Email All ready exiest in the database",
        error: true,
        success: false,
      });
    }

    // converting the password into the hash form
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    // here saving the new user into the sadabase
    const newUser = UserModel(payload);
    const save = await newUser.save();

    // here creating the link where user can click on that verify the email address
    const verifyEMailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    // here we are sending the email to the user to verify the email
    const verifyEmail = await sendEmail({
      sendTO: email,
      subject: "Verification email ZippyCart",
      html: verifyEmailTemplate({
        name,
        url: verifyEMailUrl,
      }),
    });
    // here sending the user created message succefully to the user
    return response.json({
      message: "User Registed Successfylly",
      error: false,
      success: true,
      data: save,
    });
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
