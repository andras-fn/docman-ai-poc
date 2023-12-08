"use client";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const schema = z.object({
  email: z.string({
    invalid_type_error: "Invalid Email",
  }),
  token: z.string({
    invalid_type_error: "Invalid Email",
  }),
  password: z.string({
    invalid_type_error: "Invalid Email",
  }),
  confirmPassword: z.string({
    invalid_type_error: "Invalid Email",
  }),
});

const page = ({ searchParams }) => {
  const supabase = createClient();
  async function onSubmit(formData) {
    const rawFormData = {
      email: formData.get("email"),
      token: formData.get("token"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirm-password"),
    };

    console.log(rawFormData);

    const validatedFields = schema.safeParse({
      email: formData.get("email"),
      token: formData.get("token"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirm-password"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    if (rawFormData.password === rawFormData.confirmPassword) {
      console.log("Passwords match");

      try {
        //use token

        const {
          data: { session },
          error,
        } = await supabase.auth.verifyOtp({
          email: rawFormData.email,
          token: rawFormData.token,
          type: "email",
        });

        console.log({ session, error });

        if (!error) {
          //update password
          await supabase.auth.update({ password: rawFormData.password });
          console.log("Changed password");
          redirect(`/`);
        } else {
          console.log("Failed to change password");
        }
      } catch (error) {
        console.log(error);
        return { success: false, message: "Error saving details" };
      }
    } else {
      console.log("Passwords do not match");
      return { success: false, message: "Passwords do not match" };
    }

    // mutate data
    // revalidate cache
  }
  return (
    <div className="w-full flex flex-col items-center">
      <p className="mt-5">
        Please enter the following details and click confirm to create your
        account:
      </p>
      <form
        action={onSubmit}
        className="flex flex-col items-center w-[30rem] gap-y-2 m-5"
      >
        <label className="w-full flex items-center gap-x-2 justify-between">
          Email:
          <input
            type="email"
            defaultValue={
              searchParams && searchParams.email && searchParams.email
            }
            className="w-[20rem]"
            id="email"
            name="email"
          />
        </label>
        <label className="w-full flex items-center gap-x-2 justify-between">
          Code:
          <input
            type="text"
            defaultValue={
              searchParams && searchParams.token && searchParams.token
            }
            className="w-[20rem]"
            id="token"
            name="token"
          />
        </label>
        <label className="w-full flex items-center gap-x-2 justify-between">
          New Password:
          <input
            type="password"
            id="password"
            name="password"
            className="w-[20rem]"
          />
        </label>
        <label className="w-full flex items-center gap-x-2 justify-between">
          Confirm Password:
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            className="w-[20rem]"
          />
        </label>

        <button type="submit" className="bg-sky-500 text-white p-2 rounded ">
          Confirm
        </button>
      </form>
    </div>
  );
};
export default page;
