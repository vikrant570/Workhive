interface FormChildProps {
  emailInUse: boolean | null;
  invalidCreds: boolean
}

const SignInForm: React.FC<FormChildProps> = ({ emailInUse, invalidCreds }) => {
  return (
    <>
      <h1 className="text-2xl font-semibold text-texts-primary">SignIn</h1>
      <span className="w-10/12">
        <p className={`${emailInUse == false || invalidCreds == true ? "text-red-400" : ""} text-sm font-medium`}>
          {emailInUse == false ? "User doesn't exist!" : (invalidCreds == true ? "Invalid Credentials!" : "Enter your email")}
        </p>
        <input
          type="email"
          className="form-ip w-full"
          placeholder="youremail@example.com"
          name="email"
          required
        />
      </span>

      <span className="w-10/12">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-ip w-full"
          placeholder="Password"
          name="password"
          required
        />
      </span>
    </>
  );
};

export default SignInForm;
