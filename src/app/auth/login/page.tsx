import dynamic from "next/dynamic";

const Login = dynamic(() => import("./_components"));

const page = () => {
  return <Login />;
}

export default page