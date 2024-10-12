import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, User, Settings, Mail, HelpCircle, Menu, X } from 'lucide-react'

const menuItems = [
  { icon: Home, text: 'Home' },
  { icon: User, text: 'Profile' },
  { icon: Settings, text: 'Settings' },
  { icon: Mail, text: 'Messages' },
  { icon: HelpCircle, text: 'Help' },
]

export default function Component() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      <motion.div
        className="fixed top-0 left-0 h-screen bg-white shadow-lg z-50"
        animate={{ width: isOpen ? 240 : 60 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className="mt-16">
          {menuItems.map((item, index) => (
            <motion.a
              key={index}
              href="#"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <item.icon size={20} className="mr-4" />
              <motion.span
                initial={false}
                animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                {item.text}
              </motion.span>
            </motion.a>
          ))}
        </nav>
      </motion.div>
      <main className="flex-1 p-8 ml-[60px]">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Modern Sidebar</h1>
        <p className="text-gray-600">This is the main content area. The sidebar can be expanded or collapsed using the menu icon.</p>
      </main>
    </div>
  )
}