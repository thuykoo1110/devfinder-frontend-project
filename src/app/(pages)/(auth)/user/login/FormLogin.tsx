"use client"
import JustValidate from "just-validate"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FormLogin() {
  const router = useRouter();
  useEffect(()=> {
    const validator = new JustValidate("#loginForm");

    validator
      .addField('#email', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập email của bạn!',
        },
        {
          rule: 'email',
          errorMessage: 'Email không đúng định dạng!',
        },
      ])
      .addField('#password', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập mật khẩu!',
        }
      ])
      .onSuccess((event: any) => {
        const email = event.target.email.value;
        const password = event.target.password.value;

        const dataFinal = {
          email: email,
          password: password
        }
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
          method: 'POST',
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataFinal),
          credentials: "include" // Quan trọng: giữ được cookie do backend trả về
        })
          .then(res => res.json())
          .then(data => {
            console.log(data)
          })
      });
    }, []);
  return (
    <>
      <form 
        id="loginForm"
        action="" 
        className="grid grid-cols-1 gap-y-[15px]"
      >
        <div className="">
          <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
            Email *
          </label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label htmlFor="password" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mật khẩu *
          </label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <button className="bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Đăng nhập
          </button>
        </div>
      </form>
    </>
  )
}