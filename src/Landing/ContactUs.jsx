import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import image from "../assets/ContactUs.jpg";

const ContactUs = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });
  
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        delay: 0.2,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        delay: 0.2,
      },
    },
  };

  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <section id="contact-form" className="py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      {/* Subtle honeycomb pattern */}
      <div className="absolute inset-0 bg-honeycomb-pattern opacity-5"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
            Get in touch
          </span>
          <h2 className="ui text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-500 dark:from-yellow-400 dark:to-amber-300">
            Contact Us
          </h2>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello, our team is here to help. Reach out to us
            using the contact information below and we'll get back to you as
            soon as possible.
          </p>
        </motion.div>

        {/* Contact Form and Image Section */}
        <div className="flex flex-col lg:flex-row gap-8 items-center w-10/12 mx-auto" >
          {/* Image */}
          <motion.div 
            className="w-full lg:w-1/2 rounded-xl overflow-hidden "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={imageVariants}
          >
            <img
              src={image}
              alt="Contact Us"
              className="w-full h-auto object-cover"
            />
          </motion.div>

          {/* Form */}
          <motion.div 
            className="w-full lg:w-1/2 bg-white dark:bg-gray-800/50 p-8 rounded-xl shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={formVariants}
          >
            <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-6 ui">Send us a message</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your Name" 
                            className="border-yellow-200 focus-visible:ring-yellow-500 dark:border-yellow-900/30" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your Phone Number" 
                            className="border-yellow-200 focus-visible:ring-yellow-500 dark:border-yellow-900/30" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Email Address" 
                          className="border-yellow-200 focus-visible:ring-yellow-500 dark:border-yellow-900/30" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your Message"
                          className="min-h-32 border-yellow-200 focus-visible:ring-yellow-500 dark:border-yellow-900/30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-500 dark:from-yellow-500 dark:to-amber-400 hover:opacity-90 transition-opacity"
                >
                  Send Message
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>We'll get back to you as soon as possible</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;