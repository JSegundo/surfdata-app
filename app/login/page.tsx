"use client"
import Link from "next/link"
import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must have more than 8 characters"),
})

const Login = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState("") // for storing error messages

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof FormSchema>, e: any) => {
    console.log(values)
    try {
      const signInData = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      })
      console.log("signInData", signInData)
      if (signInData?.error) {
        console.log("Sign-in error:", signInData.error)
        setErrorMessage(signInData?.error || "An error occurred")
      } else {
        // router.push("/")
        console.log("success")
      }
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || "An error occurred")
    }
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <Controller
                name="email"
                control={form.control}
                render={({ field }) => (
                  <input
                    type="email"
                    {...field}
                    placeholder="email"
                    className="input input-bordered"
                    required
                  />
                )}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <Controller
                name="password"
                control={form.control}
                render={({ field }) => (
                  <input
                    type="password"
                    {...field}
                    placeholder="password"
                    className="input input-bordered"
                    required
                  />
                )}
              />

              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
              <label className="label">
                <Link
                  href="/register"
                  className="label-text-alt link link-hover"
                >
                  You dont have an account?
                </Link>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" type="submit">
                Login
              </button>
            </div>
            {form.formState.errors.password &&
              form.formState.errors.password.message}
            {errorMessage && <p>{errorMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
export default Login
