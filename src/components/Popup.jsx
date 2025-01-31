import { useState } from "react";
import { motion } from "framer-motion";
// import { X } from "lucide-react";
// import { Button } from "@/components/ui/button";

export default function Popup(isOpenPopup, setIsOpenPopup) {

    return (
        <div className="flex items-center justify-center h-screen">
            <Button onClick={() => setIsOpenPopup(true)}>Ouvrir la popup</Button>

            {isOpenPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-white rounded-2xl shadow-lg p-6 w-96 relative"
                    >
                        <button onClick={() => setIsOpenPopup(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                            {/* <X size={20} /> */}
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Titre de la Popup</h2>
                        <p className="text-gray-600">Ceci est une belle popup animée avec Framer Motion et Tailwind CSS.</p>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
