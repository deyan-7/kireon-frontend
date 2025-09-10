"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import styles from "./SignIn.module.scss";

const SignInPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [authError, setAuthError] = useState<string | null>(null);
  const [signInRunning, setSignInRunning] = useState(false);
  const [hasError, setHasError] = useState(false);

  const t = useTranslations();

  const { signInWithEmail } = useAuth();

  const handleSignIn = async () => {
    setAuthError(null);
    setHasError(false);
    setSignInRunning(true);
    try {
      await signInWithEmail(email, password);
      router.replace("/start");
    } catch (error) {
      setHasError(true);
      setAuthError(error instanceof Error ? error.message : "Sign in failed");

      setTimeout(() => {
        setHasError(false);
      }, 600);
    } finally {
      setSignInRunning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInRunning && email && password) {
      handleSignIn();
    }
  };

  return (
    <>
      <main className="w-screen h-screen flex flex-col justify-center items-center z-10 bg-white">
        <div className={styles.contentContainer}>
          <div
            className={`flex flex-col gap-4 items-center justify-center z-10 ${styles.logoSection}`}
          >
            <Image
              src="/assets/images/logo.png"
              alt="Logo"
              width={90}
              height={90}
              className={`w-[90px] ${styles.logo}`}
              priority
            />
            <span className="ava_title">Kireon GPT</span>
          </div>
          <div className={styles.formSection}>
            <article
              className={`box_blue_wrapper max-w-[565px] w-full z-10 ${styles.formWrapper}`}
            >
              <form
                onSubmit={handleSubmit}
                className="box_blue p-8 flex flex-col gap-6"
              >
                <input
                  type="email"
                  placeholder={t("email_placeholder") || "Email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    background: "var(--gradientDarkblue)",
                  }}
                  className={`w-full rounded-[9px] p-3 text-black placeholder-gray-500 focus:outline-none ${
                    styles.input
                  } ${hasError ? styles.inputError : ""} ${
                    hasError ? styles.shake : ""
                  }`}
                  disabled={signInRunning}
                />
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("password_placeholder") || "Password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      background: "var(--gradientDarkblue)",
                    }}
                    className={`w-full rounded-[9px] p-3 text-black placeholder-gray-500 focus:outline-none ${
                      styles.input
                    } ${hasError ? styles.inputError : ""} ${
                      hasError ? styles.shake : ""
                    }`}
                    disabled={signInRunning}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={
                      showPassword ? t("hide_password") : t("show_password")
                    }
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <button
                  type="submit"
                  className="action-btn mb-0 w-full"
                  disabled={signInRunning || !email || !password}
                >
                  {signInRunning
                    ? "Signing in..."
                    : t("sign_in_button") || "Sign In"}
                </button>
              </form>
            </article>
            <div className={styles.errorContainer}>
              {authError && (
                <p className={styles.errorMessage}>
                  {t("sign_in_error") || authError}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignInPage;
