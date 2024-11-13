import LoginForm from "@/components/auth/login-form";

const LoginPage = ({ searchParams }: { searchParams: { verified: string; error: string } }) => {
  const isVerified = searchParams.verified === "true";
  const OAuthAccountNotLinked = searchParams.error === "OAuthAccountNotLinked";

  return <LoginForm isVerified={isVerified} OAuthAccountNotLinked={OAuthAccountNotLinked} />;
};
export default LoginPage;
