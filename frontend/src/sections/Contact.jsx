import React, { forwardRef, useState } from "react";
import emailjs from '@emailjs/browser';
import linkedIn from "../assets/linkedin.png";
import twitter from "../assets/icons8-x-50 (1).png";

const Contact = forwardRef(({isMernActive }, ref) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // for success/error messages

  // Replace these with your EmailJS IDs
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send email using emailjs
    emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        name: name,
        email: email,
        contact: contact,
        message: message,
        reply_to: email,
      },
      PUBLIC_KEY
    )
      .then(() => {
        setStatus("SUCCESS");
        setName("");
        setEmail("");
        setContact("");
        setMessage("");
      })
      .catch((error) => {
        console.error('FAILED...', error);
        setStatus("ERROR");
      });
  };

  return (
    <div
      ref={ref}
      className="flex flex-col lg:flex-row py-16 px-6 bg-base-200 gap-12 lg:gap-28 justify-center items-center"
    >
      {/* Social icons and text */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 text-center lg:text-left">
        {isMernActive ?
          (
            <>
              <h1 className="font-heading text-3xl font-bold mb-4">The Digital Presence!</h1>
              <p className="max-w-xl text-xl font-body mx-auto lg:mx-0">
                The web is a conversation, and I'm here to build the platform. Let's connect to create a seamless, intuitive experience that transforms your ideas into a dynamic and engaging reality. I'm excited to discuss how we can build a digital presence that truly connects with your audience.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-heading text-3xl font-bold mb-4">Data can talk!</h1>
              <p className="max-w-xl text-xl font-body mx-auto lg:mx-0">
                Every data has a story to tell, and I'm here to let it communicate with you. Let's connect to transform your raw information into clear, actionable insights that drive strategic success. I'm excited to discuss how we can unlock the full potential of your data.
              </p>
            </>
          )}

        <div className="flex mt-10 justify-center lg:justify-start gap-8">
          <a href="https://www.linkedin.com/in/zaman-wajahath" target="_blank" rel="noopener noreferrer">
            <img className="w-12" src={linkedIn} alt="LinkedIn" />
          </a>
          <a href="https://x.com/zaman_wajahath" target="_blank" rel="noopener noreferrer">
            <img className="w-12" src={twitter} alt="Twitter" />
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <div className="w-full max-w-lg lg:w-1/3">
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-base-100 shadow-lg rounded-xl flex flex-col gap-y-4 items-center"
        >
          <h2 className="text-3xl font-heading text-white font-bold mb-2">Contact Me</h2>

          {status === "SUCCESS" && (
            <div className="text-green-500 mb-2">
              ✅ Your message was sent successfully!
            </div>
          )}
          {status === "ERROR" && (
            <div className="text-red-500 mb-2">
              ❌ Failed to send message. Please try again.
            </div>
          )}

          <input
            type="text"
            className="border-2 text-xl px-4 py-2 rounded-lg text-white w-full bg-base-200"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            className="border-2 text-xl px-4 py-2 rounded-lg text-white w-full bg-base-200"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="contact"
            className="border-2 text-xl px-4 py-2 rounded-lg text-white w-full bg-base-200"
            placeholder="Contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />

          <textarea
            className="border-2 text-xl px-4 py-2 rounded-lg text-white w-full bg-base-200"
            placeholder="Message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button
            className="btn w-fit px-4 py-3 text-xl hover:bg-slate-700 hover:text-black transition-all mt-2"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </div>

  );
});

export default Contact;

// <h1 className="font-heading text-3xl text-center font-bold mb-4">The Digital Presence!</h1>
//         <p className="max-w-xl text-xl font-body mx-auto lg:mx-0">
// The web is a conversation, and I'm here to build the platform. Let's connect to create a
// seamless, intuitive experience that transforms your ideas into a dynamic and engaging
// reality. I'm excited to discuss how we can build a digital presence that truly connects
// with your audience.
//         </p>