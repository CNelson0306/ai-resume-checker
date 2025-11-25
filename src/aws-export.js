const awsConfig = {
  Auth: {
    region: process.env.NEXT_REGION,
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    mandatorySignIn: false,
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
};

export default awsConfig;
