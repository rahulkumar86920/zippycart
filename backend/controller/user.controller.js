import sendEmail from "../config/sendEmail.js";
import UserModel from "./../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "./../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "./../utils/generateRefreshToken.js";

// there code is for the user registration
export async function registerUserController(request, response) {
  try {
    //these are the mandotory information ab the time of user registration
    const { name, email, password } = request.body;
    console.log(request.body);
    if (!name || !email || !password) {
      return response.status(400).json({
        message: "provide email , name ,password for registration",
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
      subject: "Verification Email From ZippyCart",
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

//this code is for when the user click on the lick sent to the email to verify the code email
export async function verifyEmailController(request, response) {
  try {
    const { code } = request.body;
    const user = UserModel.findOne({ _id: code });

    if (!user) {
      return response.status(400).json({
        message: "Invalid code ",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );
    return response.json({
      message: " Email Verification Successfull",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// these are the code for the user login
export async function loginController(request, response) {
  try {
    // here desturturing the information from the request bodt
    const { email, password } = request.body;
    const user = UserModel.findOne({ email });

    // here cheking if the user exiest or not in the database
    if (!user) {
      return response.status.json({
        message: "User does not exiest in the database plaese register first",
        error: true,
        success: false,
      });
    }
    // here checking if the user is active or not
    if (user.user_status !== "Active") {
      return response.status(400).json({
        message:
          "User is not active please contact customer support team to activate it ",
        error: true,
        success: false,
      });
    }

    //here cheking if the password maatches or not
    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return response.status(400).json({
        message: "Invalid password Please Try Again",
        error: true,
        success: false,
      });
    }

    const accesstoken = await generateAccessToken(user._id);
    const refreshtoken = await generateRefreshToken(user._id);

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    // here sending the response cookes back to the user
    response.cookie("accesstoken", accesstoken, cookieOption);
    response.cookie("refreshtoken", refreshtoken, cookieOption);

    return response.json({
      message: "Login Successfully",
      error: false,
      success: true,
      data: {
        accesstoken,
        refreshtoken,
      },
    });
    
  } catch (error) {
    return response.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
