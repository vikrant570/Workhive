interface FormChildProps {
  email: string | null;
}

const SignUpForm: React.FC<FormChildProps> = ({ email }) => {
  return (
    <>
     <h1 className="text-2xl font-semibold text-texts-primary">SignIn</h1>
      <span className="w-10/12">
        <label htmlFor="email">Your email address</label>
        <input
          type="email"
          name="email"
          className="form-ip w-full"
          value={email || ""}
          readOnly
          required
        />
      </span>

      <span className="w-10/12">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          className="form-ip w-full"
          placeholder="Password"
          required
        />
      </span>

      <span className="w-10/12">
        <label htmlFor="workplace">Your workplace name</label>
        <input
          type="text"
          name="workplace"
          className="form-ip w-full"
          placeholder="Workplace Name"
          required
        />
      </span>

      <span className="w-10/12">
        <label htmlFor="username">Your unique username</label>
        <input
          type="text"
          name="username"
          className="form-ip w-full"
          placeholder="Username (Alphanumeric)"
          required
        />
      </span>

      <span className="w-10/12">
        <label htmlFor="fullname">Fullname</label>
        <input
          type="text"
          name="fullname"
          className="form-ip w-full"
          placeholder="Your Full Name"
          required
        />
      </span>
    </>
  );
};

export default SignUpForm;
