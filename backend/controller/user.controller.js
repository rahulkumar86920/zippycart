import sendEmail from "../config/sendEmail.js";
import UserModel from "./../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "./../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "./../utils/generateRefreshToken.js";
import upload from "./../middleware/multer.js";
import uploadImageCloudinary from "./../utils/uploadimageCloudinary.js";
import generatedOtp from "../utils/generateOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken";

// there code is for the user registration
export async function registerUserController(request, response) {
  try {
    //these are the mandotory information ab the time of user registration
    const { name, email, password } = request.body;
    // console.log(request.body);
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
      sendTo: email,
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
    const { email, password } = request.body || {};

    const user = await UserModel.findOne({ email });

    if (!email || !password) {
      return response.status(400).json({
        message: "please enter the email and password",
        error: true,
        success: false,
      });
    }

    // here cheking if the user exiest or not in the database
    if (!user) {
      return response.status.json({
        message: "User does not exiest in the database plaese register first",
        error: true,
        success: false,
      });
    }

    // here checking id the user is active or not
    if (user.user_status !== "Active") {
      return response.status(400).json({
        message:
          "You are Inactive please contact customer support for further help",
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
    response.cookie("accessToken", accesstoken, cookieOption);
    response.cookie("refreshToken", refreshtoken, cookieOption);

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

// these are the code for the logout
export async function logOutController(request, response) {
  try {
    const userId = request.userId;
    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.clearCookie("accessToken", cookieOption);
    response.clearCookie("refreshToken", cookieOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: " ",
    });

    return response.json({
      message: "Logout successfull",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// these are the code for the avatar image upload
export async function uploadAvatar(request, response) {
  try {
    const userId = request.userId; // auth middlware
    const image = request.file; // multer middleware

    const upload = await uploadImageClodinary(image);

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// update user details
export async function updateUserDetails(request, response) {
  try {
    const userId = request.userId; // auth midleware
    const { name, email, mobile, password } = request.body;

    let hashPassword = " ";

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    }

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      ...(name && { name: name }),
      ...(email && { email: email }),
      ...(mobile && { mobile: mobile }),
      ...(password && { password: hashPassword }),
    });

    return response.json({
      message: "updated user data successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//forgot password not login
export async function forgotPasswordController(request, response) {
  try {
    const { email } = request.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    }

    const otp = generatedOtp();
    const expireTime = new Date() + 60 * 60 * 1000; // 1hr

    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString(),
    });

    await sendEmail({
      sendTo: email,
      subject: "Forgot password from ZippyCart",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp,
      }),
    });

    return response.json({
      message: "check your email",
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

//verify forgot password otp
export async function verifyForgotPasswordOtp(request, response) {
  try {
    const { email, otp } = request.body;

    if (!email || !otp) {
      return response.status(400).json({
        message: "Provide required field email, otp.",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date().toISOString();

    if (user.forgot_password_expiry < currentTime) {
      return response.status(400).json({
        message: "Otp is expired",
        error: true,
        success: false,
      });
    }

    if (otp !== user.forgot_password_otp) {
      return response.status(400).json({
        message: "Invalid otp",
        error: true,
        success: false,
      });
    }

    //if otp is not expired
    //otp === user.forgot_password_otp

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      forgot_password_otp: "",
      forgot_password_expiry: "",
    });

    return response.json({
      message: "Verify otp successfully",
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

//reset the password
export async function resetpassword(request, response) {
  try {
    const { email, newPassword, confirmPassword } = request.body;

    if (!email || !newPassword || !confirmPassword) {
      return response.status(400).json({
        message: "provide required fields email, newPassword, confirmPassword",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Email is not available",
        error: true,
        success: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return response.status(400).json({
        message: "newPassword and confirmPassword must be same.",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);

    const update = await UserModel.findOneAndUpdate(user._id, {
      password: hashPassword,
    });

    return response.json({
      message: "Password updated successfully.",
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

// refresh token controller
export async function refreshToken(request, response) {
  try {
    const refreshToken =
      request.cookies.refreshToken ||
      request?.headers?.authorization?.split(" ")[1]; /// [ Bearer token]

    if (!refreshToken) {
      return response.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );

    if (!verifyToken) {
      return response.status(401).json({
        message: "token is expired",
        error: true,
        success: false,
      });
    }

    const userId = verifyToken?._id >= verifyToken._id;

    const newAccessToken = await generateAccessToken(userId);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.cookie("accessToken", newAccessToken, cookiesOption);

    return response.json({
      message: "New Access token generated",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
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
