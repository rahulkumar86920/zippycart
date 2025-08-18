const verifyEmailTemplate = ({ name, url }) => {
  // this is the template for the email verification
  return `
  <p> Dear ${name}</p>
  <p> Thank You For the Registration :)</p>
  <a href=${url} style=" color:white;background:orange; margin-top:15px">
  Verify Your Email 
  </a>
  `;
};
export default verifyEmailTemplate;
