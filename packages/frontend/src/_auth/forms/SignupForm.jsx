import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loader from '@/components/Shared/Loader';
import { toast } from 'react-hot-toast';
import api from "@/api/axios";

// Enhanced password requirements message
const PASSWORD_REQUIREMENTS = [
  "At least 8 characters long",
  "Contains at least one lowercase letter",
  "Contains at least one uppercase letter",
  "Contains at least one number",
  "Contains at least one special character"
];

// Yup Validation Schema with friendly messages
const SignupValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Please make sure your password meets all requirements below"
    )
    .required("Password is required"),
});

const SignupForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const form = useForm({
    resolver: yupResolver(SignupValidationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  // Handler
  const handleSignup = async (user) => {
    setIsLoading(true);
    try {
      const response = await api.post(`/api/v1/auth/user/signup`, user);
      const { data } = response;
  
      if (data?.message === "Congrats! You're registered") {
        setIsLoading(false);
        // Note: User data is stored only for potential email verification purposes
        // Actual authentication happens during sign-in
        toast.success("Registration successful! Please check your email to verify your account.");
        navigate("/sign-in");
      } else {
        setIsLoading(false);
        toast.error(data?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setIsLoading(false);
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="sm:w-420 flex-center flex-col">
      <img src="/assets/images/logo.svg" alt="logo" />
      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12 text-light-2">Create a new account</h2>
      <p className="text-light-3 small-medium md:base-regular mt-2">
        To use Snapgram, please enter your details.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">First Name</FormLabel>
                <FormControl>
                  <Input type="text" className="text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Last Name</FormLabel>
                <FormControl>
                  <Input type="text" className="text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="email" className="text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    className="text-black" 
                    {...field} 
                    onFocus={() => setShowPasswordRequirements(true)}
                  />
                </FormControl>
                <FormMessage />
                {showPasswordRequirements && (
                  <FormDescription className="mt-2 text-sm">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="font-medium mb-2">Password must include:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {PASSWORD_REQUIREMENTS.map((req, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FormDescription>
                )}
              </FormItem>
            )}
          />

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="shad-button_primary" disabled={isLoading}>
            {isLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2 pb-5">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;