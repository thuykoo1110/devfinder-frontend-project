/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useAuth } from "@/hooks/useAuth"
import JustValidate from "just-validate";
import { useEffect, useState } from "react";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { Toaster, toast } from 'sonner';
import { useRef } from 'react';
import { EditorMCE } from "@/app/components/editor/editorMce";

// Register the plugin
registerPlugin(
  FilePondPluginFileValidateType, 
  FilePondPluginImagePreview
);

export const FormProfile = () => {
  const { infoCompany } = useAuth();
  const [logos, setLogos] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);

  const editorRef = useRef(null);
  
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/city/list`)
      .then(res => res.json())
      .then(data => {
        if(data.code == "success") {
          setCityList(data.cityList);
        }
      })
  }, []);

  useEffect(() => {
    if(infoCompany) {
      // Hiển logo mặc định
      if(infoCompany.logo) {
        setLogos([
          {
            source: infoCompany.logo
          }
        ]);
      }

      // Validate dữ liệu
      const validator = new JustValidate("#profileForm");

      validator
        .addField('#companyName', [
          {
            rule: 'required',
            errorMessage: 'Vui lòng nhập tên công ty!'
          },
          {
            rule: 'maxLength',
            value: 200,
            errorMessage: 'Tên công ty không được vượt quá 200 ký tự!',
          },
        ])
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
    }
  }, [infoCompany]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const companyName = event.target.companyName.value;
    const address = event.target.address.value;
    const companyModel = event.target.companyModel.value;
    const companyEmployees = event.target.companyEmployees.value;
    const workingTime = event.target.workingTime.value;
    const workOvertime = event.target.workOvertime.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    let description = "";
    if(editorRef.current){
      description = (editorRef.current as any).getContent();
    }
    const city = event.target.city.value;
    let logo = null;
    if(logos.length > 0) {
      logo = logos[0].file;
    }

    // Tạo FormData
    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("address", address);
    formData.append("companyModel", companyModel);
    formData.append("companyEmployees", companyEmployees);
    formData.append("workingTime", workingTime);
    formData.append("workOvertime", workOvertime);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("description", description);
    formData.append("logo", logo);
    formData.append("city", city);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/profile`, {
      method: "PATCH",
      body: formData,
      credentials: "include", // Gửi kèm cookie
    })
      .then(res => res.json())
      .then(data => {
        if(data.code == "error") {
          toast.error(data.message);
        }

        if(data.code == "success") {
          toast.success(data.message);
        }
      })
  }
  
  return (
    <>
      <Toaster richColors position="top-right" />
      {infoCompany && (
        <form 
          action="" 
          className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]"
          id="profileForm"
          onSubmit={handleSubmit}
        >
          <div className="sm:col-span-2">
            <label htmlFor="companyName" className="block font-[500] text-[14px] text-black mb-[5px]">
              Tên công ty *
            </label>
            <input 
              type="text" 
              name="companyName" 
              id="companyName" 
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black" 
              defaultValue={infoCompany.companyName}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="logo" className="block font-[500] text-[14px] text-black mb-[5px]">
              Logo
            </label>
            <FilePond
              name="logo"
              allowMultiple={false} // Chỉ chọn 1 ảnh 
              allowRemove={true} // Cho phép xóa ảnh
              labelIdle='+'
              acceptedFileTypes={['image/*']}
              onupdatefiles={setLogos}
              files={logos}
            />
          </div>
          <div className="">
            <label htmlFor="city" className="block font-[500] text-[14px] text-black mb-[5px]">
              Thành phố
            </label>
            <select 
              name="city" 
              id="city" 
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.city}
            >
              {cityList.map(item => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="">
            <label htmlFor="address" className="block font-[500] text-[14px] text-black mb-[5px]">
              Địa chỉ
            </label>
            <input 
              type="text" 
              name="address" 
              id="address" 
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.address}
            />
          </div>
          <div className="">
            <label htmlFor="companyModel" className="block font-[500] text-[14px] text-black mb-[5px]">
              Mô hình công ty
            </label>
            <input 
              type="text" 
              name="companyModel" 
              id="companyModel" 
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.companyModel}
            />
          </div>
          <div className="">
            <label htmlFor="companyEmployees" className="block font-[500] text-[14px] text-black mb-[5px]">
              Quy mô công ty
            </label>
            <input 
              type="text" 
              name="companyEmployees" 
              id="companyEmployees" 
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.companyEmployees}
            />
          </div>
          <div className="">
            <label htmlFor="workingTime" className="block font-[500] text-[14px] text-black mb-[5px]">
              Thời gian làm việc
            </label>
            <input 
              type="text" 
              name="workingTime" 
              id="workingTime" 
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.workingTime}
            />
          </div>
          <div className="">
            <label htmlFor="workOvertime" className="block font-[500] text-[14px] text-black mb-[5px]">
              Làm việc ngoài giờ
            </label>
            <input 
              type="text" 
              name="workOvertime" 
              id="workOvertime" 
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.workOvertime}
            />
          </div>
          <div className="">
            <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
              Email *
            </label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.email}
            />
          </div>
          <div className="">
            <label htmlFor="phone" className="block font-[500] text-[14px] text-black mb-[5px]">
              Số điện thoại
            </label>
            <input 
              type="text" 
              name="phone" 
              id="phone" 
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.phone}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block font-[500] text-[14px] text-black mb-[5px]">
              Mô tả chi tiết
            </label>
            {/* <textarea 
              name="description" 
              id="description" 
              className="w-[100%] h-[350px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.description}
            >
            </textarea> */}
            <EditorMCE
              editorRef={editorRef} 
              value={infoCompany.description} 
            />
          </div>
          <div className="sm:col-span-2">
            <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">
              Cập nhật
            </button>
          </div>
        </form>
      )}
    </>
  )
}