import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

const Authorize = () => {
  const [searchParams] = useSearchParams();
  const avatar = searchParams?.get("avatar");
  Cookies.set('avatar', avatar)

  const username = searchParams?.get("username");
  Cookies.set('username', username)

  window.location = '/';
};

export { Authorize };
