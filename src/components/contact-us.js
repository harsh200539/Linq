"use client";

import {
  MapPin,
  Mail,
  Phone,
  Clock,
  LocateFixed,
} from "lucide-react";
import office from "../images/Get_In_Touch/GET_IN_TOUCH.webp";

export function ContactUs() {
  const bgSrc = office.src || office;

  return (
    <section
      id="contact"
      className="pt-5 get_in_touch text-linq-white"
      style={{ backgroundImage: `url(${bgSrc})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center", opacity: 1 }}
    >
      <div className="text-center" data-aos="fade-up">
        <h2 className="display-6 fw-bold text-linq-dark">Contact Us</h2>
        <p className="lead text-linq-white-50 mx-auto text-linq-dark" style={{ maxWidth: "700px" }}>
          We're always open to partnerships, talent, and conversations. Reach out to us!
        </p>
      </div>
      <div className="contact-container">
        <div className="contact-card" data-aos="flip-left">
          <div className="card-icon">
            <MapPin size={35} color="#05243c" strokeWidth={1.25} />
          </div>
          <div className="card-label">Address</div>
          <div className="card-text">
            <b>
              Nilamber Corporate Park, <br />
              Building C, 2nd Floor, Nilamber Circle, <br />
              Vadodara, Gujarat 390007
            </b>
            <div className="col-10">
              <button className="mt-3 btn p-2 text-linq-white">
                <LocateFixed size={25} color="#f10303ff" strokeWidth={1} className="" />
                <a
                  href="https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUqDQgBEC4YrwEYxwEYgAQyCggAEAAY4wIYgAQyDQgBEC4YrwEYxwEYgAQyBggCEEUYOzIHCAMQABiABDIHCAQQABiABDIGCAUQRRg8MgYIBhBFGD0yBggHEEUYPdIBCDM4NDhqMGo3qAIAsAIA&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=Ka2KDywAyV85MU7cDL7pSrNO&daddr=Nilamber+Circle,+Saiyed+Vasna,+Vadodara,+Gujarat+390007"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#f10303ff", marginLeft: "8px" }}
                >
                  Get Directions
                </a>
              </button>
            </div>
          </div>
        </div>

        <div className="middle-column" data-aos="flip-up">
          <div className="contact-card">
            <div className="card-icon">
              <Phone size={35} color="#05243c" strokeWidth={1.25} />
            </div>
            <div className="card-label">Mobile</div>
            <div className="card-text"><b>+91 9377333411</b></div>

            <div className="card-icon mt-4">
              <Mail size={35} color="#05243c" strokeWidth={1.25} />
            </div>
            <div className="card-label">Email</div>
            <div className="card-text">
              <b> hr.ds@linq-corporate.com <br /> hr.ns@linq-corporate.com </b>
            </div>
          </div>
        </div>

        <div className="contact-card" data-aos="flip-right">
          <div className="card-icon">
            <Clock size={36} color="#05243c" strokeWidth={1.25} />
          </div>
          <div className="card-label">Availability</div>
          <div className="card-text">
            Our office operates 24×7. However, the designated shift timings are as follows: <br />
            <div className="mt-4">
              <b>Day Shift: 9:30 AM to 6:00 PM <br /></b>
              <b>Night Shift: 6:30 PM to 3:30 AM</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
