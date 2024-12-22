const generateResetEmail = (resetLink) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 20px;
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
      }
      .header h1 {
        font-size: 24px;
        color: #4caf50;
      }
      .content {
        font-size: 16px;
        line-height: 1.6;
        color: #555;
      }
      .content p {
        margin: 10px 0;
      }
      .content a {
        text-decoration: none;
        color: white;
      }
      .reset-button {
        display: block;
        width: 200px;
        margin: 20px auto;
        padding: 10px 20px;
        background-color: #4caf50;
        color: #fff;
        text-align: center;
        border-radius: 5px;
        font-size: 16px;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #888;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>
          You recently requested to reset your password for your account. Click
          the button below to reset it:
        </p>
        <a
          href=${resetLink}
          class="reset-button"
        >
          Reset Password
        </a>
        <p>
          If you did not request a password reset, please ignore this email or
          contact support if you have questions.
        </p>
        <p>Thanks,<br />The Taskify Team</p>
      </div>
      <div class="footer">
        <p>
          If you're having trouble with the button above, copy and paste the
          following link into your browser:
        </p>
        <p>${resetLink}</p>
      </div>
    </div>
  </body>
</html>
`;
};

module.exports = { generateResetEmail };
