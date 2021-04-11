import { useRouter } from "next/router";
import React from "react";
import { GetServerSideProps } from "next";

const Redirect = () => {
  return null;
};

export const getServerSideProps = async (context) => {
  const { slug } = context.params;

  const home = process.env.NEXT_PUBLIC_API_DOMAIN;

  const info = await fetch(
    `${process.env.NEXT_PUBLIC_HTTP_OR_HTTPS}://${process.env.NEXT_PUBLIC_API_DOMAIN}:${process.env.NEXT_PUBLIC_API_PORT}/${slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const jsonObject = await info.json();
  return {
    redirect: {
      destination: jsonObject.url,
      permanent: true,
    },
  };
};

export default Redirect;
