import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/xopyLogo.png";
import "../assets/Styles/Header.css";

// Import shadcn components
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";

// Import icons
import { Menu, X, ChevronDown, User, Settings } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle smooth scrolling
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 70,
        behavior: "smooth",
      });
    }
  };

  // Handle navigation
  const handleNavigation = (path, e) => {
    e.preventDefault();
    const element = document.getElementById(path.split("#")[1]);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 70,
        behavior: "smooth",
      });
    }
  };

  // Detect scroll to change header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Animation variants
  const navbarVariants = {
    initial: {
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
      y: 0,
    },
    scrolled: {
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      y: 0,
    },
  };

  const logoVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  // Theme toggle
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // You would implement actual theme switching functionality here
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${
        isScrolled ? "bg-white/80 dark:bg-slate-900/80" : "bg-transparent"
      } ${isDarkMode ? "dark" : ""}`}
      variants={navbarVariants}
      initial="initial"
      animate={isScrolled ? "scrolled" : "initial"}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-1 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center"
          variants={logoVariants}
          whileHover="hover"
        >
          <a href="/" onClick={(e) => handleNavigation("/", e)}>
            <div className="flex items-center gap-4 ml-10">
              <img src={Logo} alt="Company Logo" className="h-20" />
            </div>
          </a>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                 
                >
                  <button onClick={(e) => handleNavigation("/features", e)}>
                    Features
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <button onClick={(e) => handleNavigation("/team", e)}>
                    About Us
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <button onClick={(e) => handleNavigation("/contact-form", e)}>
                    Contact Us
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          ></motion.div>

          {/* Sign Up Button */}
          <div className="hidden sm:block">
            <Button
              variant="default"
              className="rounded-full px-6 py-2 font-medium"
            >
              <Link to="/auth/signin">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-6 mt-20 items-center">
                  <AnimatePresence>
                    {["Features", "Resources", "Pricing", "Contact"].map(
                      (item, i) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <a
                            href={`/${item.toLowerCase()}`}
                            onClick={(e) =>
                              handleNavigation(`/${item.toLowerCase()}`, e)
                            }
                            className="block py-2 text-lg font-medium hover:text-primary transition-colors"
                          >
                            {item}
                          </a>
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>

                  <div className="pt-6 mt-6 border-t">
                    <a
                      href="/auth/signin"
                      onClick={(e) => handleNavigation("/auth/signin", e)}
                    >
                      <Button className="w-full rounded-full">
                        <Link to="/auth/signin">Get Started</Link>
                      </Button>
                    </a>
                  </div>

                  <div className="flex items-center justify-between pt-6 mt-auto">
                    <Badge variant="outline" className="rounded-full">
                      xopy@v2.
                    </Badge>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
