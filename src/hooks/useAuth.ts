import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"

export const useAuth = () => {
  const [ isLogin, setIsLogin ] = useState(false);
  const [ infoUser, setInfoUser ] = useState<any>(null);
  const [ infoCompany, setInfoCompany ] = useState<any>(null);
  const pathName = usePathname();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
      credentials: "include"  // gửi kèm cookie
    })
      .then(res => res.json())
      .then(data => {
        if(data.code == "error"){
          setIsLogin(false);
        }

        if(data.code == "success"){
          setIsLogin(true);
          if(data.infoUser){
            setInfoUser(data.infoUser);
            setInfoCompany(null);
          }
          if(data.infoCompany){
            setInfoCompany(data.infoCompany);
            setInfoUser(null);
          }
        }
      })
  }, [pathName]); // call api gửi cookie để check cookie có hợp lệ ko
  // mỗi lần chuyển trang thì useEffect gọi lại api

  return { isLogin, infoUser, infoCompany };
}