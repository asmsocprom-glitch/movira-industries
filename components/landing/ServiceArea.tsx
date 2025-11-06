"use client";

import { FaHandHoldingHeart } from "react-icons/fa6";
import { MdOutlineBungalow, MdOutlineRoomService } from "react-icons/md";
import { GiOfficeChair, GiShop } from "react-icons/gi";
import { BsBuildingsFill, BsHouses } from "react-icons/bs";
import { BiLandscape } from "react-icons/bi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { PiBuildingApartmentFill } from "react-icons/pi";
import { TbHomeSpark } from "react-icons/tb";
import { TbFlame } from "react-icons/tb";

const ServiceArea = () => {
  const services = [
    { icon: <BsHouses size={40} />, label: "Residential" },
    { icon: <BsBuildingsFill size={40} />, label: "Commercial" },
    { icon: <MdOutlineBungalow size={40} />, label: "Bungalows" },
    { icon: <GiOfficeChair size={40} />, label: "Office Spaces" },
    { icon: <GiShop size={40} />, label: "Retail Shops" },
    { icon: <BiLandscape size={40} />, label: "Landscape" },
    { icon: <FaHandHoldingHeart size={40} />, label: "Healthcare" },
    { icon: <HiOutlineBuildingOffice2 size={40} />, label: "Office Buildings" },
    { icon: <PiBuildingApartmentFill size={40} />, label: "Apartments" },
    { icon: <TbHomeSpark size={40} />, label: "Redevelopment" },
    { icon: <MdOutlineRoomService size={40} />, label: "Hospitality" },
    { icon: <TbFlame size={40} />, label: "Fire & Life Safety Design" },
  ];
  return (
    <>
      <section className="w-full py-16 ">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-Play font-semibold text-[#1C1C1C] pb-2 tracking-wide mb-10">
            Our Services
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-14 mx-4 md:mx-0">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center text-center space-y-2 mx-5"
              >
                <div className="text-[#C2A356] mb-2">{service.icon}</div>
                <p className="text-sm sm:text-base pt-1  md:font-semibold leading-snug">
                  {service.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceArea;
