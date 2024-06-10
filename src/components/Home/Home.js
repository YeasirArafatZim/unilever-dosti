"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import Player from "@/components/Player/Player";

export default function Home() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [showModal, setShowModal] = useState(true);
  const [innerWidth, setInnerWidth] = useState(0);

  const [vid, setVid] = useState("");

  useEffect(() => {
    if (id) {
      // Fetch user data based on the id
      const fetchData = async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/${id}`
        );
        const result = await response.json();
        setVid(result.vimeo_id);
      };

      fetchData();
      console.log(id);
    }
  }, [id]);
  useEffect(() => {
    setInnerWidth(window.innerWidth);
  }, []);

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
      transition: "opacity 0.3s ease-in-out",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1a202c",
      border: "none",
      borderRadius: "8px",
      padding: "16px",
      width: "80%",
      height: "auto",
      overflowY: "auto",
    },
  };
  // Media query for small screens
  const smallScreenStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
      transition: "opacity 0.3s ease-in-out",
    },
    content: {
      top: "auto",
      left: "0%",
      bottom: "30%",
      backgroundColor: "#1a202c",
      border: "none",
      borderRadius: "8px",
      width: "100%",
      maxWidth: "800px",
      maxHeight: "80vh",
      overflowY: "auto",
    },
  };
  const appliedStyles = innerWidth < 640 ? smallScreenStyles : customStyles;

  return (
    <main className="bg-gray-300 h-screen flex justify-center items-center px-4">
      <div
        className={`flex justify-center items-center w-full max-w-96 h-48  rounded overflow-hidden shadow-2xl bg-gradient-to-r from-sky-300 to-cyan-500 transform transition-transform duration-500 ${
          !showModal ? "translate-x-0" : "-translate-x-[100vw]"
        }`}
      >
        <p className="text-xl text-white">Thanks for watching</p>
      </div>

      <ReactModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setVid("");
        }}
        style={appliedStyles}
        // contentLabel="Player Modal"
        ariaHideApp={false} // Add this line if you encounter an issue with the modal not displaying properly
      >
        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="text-white text-xl font-bold"
          >
            &times;
          </button>
        </div>
        <Player
          url={vid}
          onClose={() => {
            setShowModal(false);
          }}
        />
      </ReactModal>
    </main>
  );
}
