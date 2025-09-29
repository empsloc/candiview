"use client"
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"; // ShadCN dialog

function Hero() {
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      {/* Hero */}
      <main className="flex-grow">
        <section className="py-16 sm:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col gap-6 text-center lg:text-left">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
                  Streamline Your Hiring Process
                </h1>
                <p className="max-w-xl text-lg text-slate-600 dark:text-slate-300 mx-auto lg:mx-0">
                  Our AI-powered platform is designed for companies to conduct real interviews efficiently. 
                  Evaluate candidates, track progress, and make data-driven hiring decisions.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-4 lg:justify-start">
                  {isSignedIn ? (
                    <Link
                      href={"/dashboard"}
                      className="flex h-12 min-w-[120px] items-center justify-center overflow-hidden rounded-full bg-primary px-6 text-base font-bold text-white shadow-lg transition-opacity hover:opacity-90"
                    >
                      Get Started
                    </Link>
                  ) : (
                    <SignInButton>
                      <button className="flex h-12 min-w-[120px] items-center justify-center overflow-hidden rounded-full bg-primary px-6 text-base font-bold text-white shadow-lg transition-opacity hover:opacity-90">
                        Get Started
                      </button>
                    </SignInButton>
                  )}

                  {/* Learn More with Dialog */}
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <button className="flex h-12 min-w-[120px] items-center justify-center overflow-hidden rounded-full bg-primary/10 px-6 text-base font-bold text-primary transition-colors hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30">
                        Learn More
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>About Candiview</DialogTitle>
                        <DialogDescription>
                          Our platform helps companies conduct real interviews efficiently. Evaluate candidates using AI-powered analytics, track progress, and make data-driven hiring decisions. Manage interview schedules and streamline candidate pipelines.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogClose className="mt-4 inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-white hover:opacity-90">
                        Close
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="aspect-video w-full overflow-hidden rounded-xl shadow-2xl">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCc7nafKQfbIrMOPSgJPiu-LSaIwO6ObogHE2qpkBRZ-c5wTebDuJMx-IjZLxyiMGTX6PQ9tjxVmhhekMAeWIMHagNlFtJ7I_ZmXPuDQJ-j3EbEU-lj8BMD7ohGBUdIbO3YgjMLWSGrsIaY1Je2Bn3jaN4J4f_DdYifUpcp2xct_g74AfDbsnpABomAJ12w559vYZhMO0J0FpSKIOpMq9TS562Rz_LjgvIs0ZPoWvE8Hy_iQhDPsNpgTczRdpLj_WtH-wx9ZSxosp5T")`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 sm:py-24 lg:py-32 bg-background-light dark:bg-black/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Key Features
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                A comprehensive platform that allows your company to conduct real interviews efficiently and securely.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 */}
              <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-background-dark">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg fill="currentColor" height="28px" viewBox="0 0 256 256" width="28px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    AI-Powered Evaluation
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Conduct real interviews with AI-assisted question suggestions and evaluation analytics.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-background-dark">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg fill="currentColor" height="28px" viewBox="0 0 256 256" width="28px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Candidate Insights
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Analyze candidate responses, track performance trends, and make informed hiring decisions.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-background-dark">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg fill="currentColor" height="28px" viewBox="0 0 256 256" width="28px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Scheduling & Management
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Organize interviews, assign evaluators, and manage candidate pipelines seamlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    
    </div>
  );
}

export default Hero;
