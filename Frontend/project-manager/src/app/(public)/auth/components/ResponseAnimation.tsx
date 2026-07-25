// Icons
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";
import { LuArrowRight } from "react-icons/lu";

interface Props {
  authSuccess: boolean,
  afterAuthMsg: string | null
}

const ResponseAnimation: React.FC<Props> = ({ authSuccess, afterAuthMsg }) => {
  return (
    <div className="w-1/2 text-center flex flex-col justify-center items-center gap-2  m-auto bg-ui-secondary/70 p-8 rounded-4xl border border-ui-tertiary/10">
      <h1 className="text-2xl font-semibold text-texts-primary">
        {authSuccess == true ? "Success" : "Ooops !"}
        {
          <span className="flex justify-center items-center w-full mt-2">
            {authSuccess ? (
              <SiTicktick size={60} className="text-green-600" />
            ) : (
              <RxCrossCircled size={60} className="text-red-500" />
            )}
          </span>
        }
      </h1>
      <p
        className={`text-sm ${authSuccess == true ? "text-green-500" : "text-alerts"
          } font-semibold`}
      >
        {afterAuthMsg}
      </p>
      <a className="flex items-center text-buttons underline underline-offset-2 hover:text-texts-primary ease-in-out hover:scale-101 duration-150 text-md mt-2" href="/">
        Click To Continue <LuArrowRight size={15} />
      </a>
    </div>
  );
};

export default ResponseAnimation;
