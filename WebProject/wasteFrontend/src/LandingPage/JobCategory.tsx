import { Carousel } from "@mantine/carousel";
import { appBenefits } from "../Data/Data";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

const JobCategory = () => {
  return (
    <div className="mt-20 pb-5">
      <div className="text-4xl text-center font-semibold mb-3 text-mine-shaft-100">
        Browse <span className="text-green-500">App</span> Benefits
      </div>

      <div className="text-lg mb-10 mx-auto text-mine-shaft-300 text-center w-1/2">
        Explore diverse job opportunities tailored to your skills. Start your career journey today!
      </div>

      
        <div className="flex justify-around items-center w-full">
        {appBenefits.map((category, index) => (
          <div key={index} >
            <div className="flex flex-col items-center  w-72 gap-2 border-2 backdrop-blur-lg bg-transparent border-green-400 p-5 rounded-xl shadow-[0_0_5px_2px_black] my-5   !shadow-bright-sun-300">
              <div className="p-2 bg-green-50 rounded-full">
                <category.img width={50} height={50} className="text-green-500" />
              </div>
              <div className="text-mine-shaft-100 text-xl font-semibold">{category.title}</div>
              <div className="text-sm text-center text-mine-shaft-300">{category.desc}</div>
            </div>
          </div>
        ))}
        </div>
      
    </div>
  );
};

export default JobCategory;
