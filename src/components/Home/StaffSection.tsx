import { useState, useEffect } from "react";
import customFetch from "../utils/customFetch";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface Staff {
  _id: string;
  name: string;
  role: string;
  description: string;
  image: string;
}

const StaffSection = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // fetch staff data
    const fetchStaff = async () => {
      try {
        const { data } = await customFetch.get("/staff");
        setStaff(data.staff || []);
      } catch (error) {
        console.error("Failed to fetch staff:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <section className="py-16 px-4 bg-gray-50 font-Mainfront">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-event-navy mb-12">
          Meet Our Talented Staff
        </h2>
        <div className="relative">
          {/* display staff using swiper */}
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{
              clickable: true,
              el: ".staff-pagination",
            }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={1000}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            loopAdditionalSlides={2}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
            {staff.map((member) => (
              <SwiperSlide key={member._id}>
                <div className="bg-white min-h-[400px] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                  <img
                    src={`http://localhost:5000/${member.image}`}
                    alt={member.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-event-navy mb-2">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {member.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-event-navy font-bold">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex justify-center gap-2 staff-pagination" />
        </div>
      </div>
    </section>
  );
};

export default StaffSection;