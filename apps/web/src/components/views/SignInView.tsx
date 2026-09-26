"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Phone,
  User,
  Globe,
  Sun,
  Moon,
  MapPin,
  Trees,
  Sprout,
  AlertCircle,
  Loader2,
  Shield,
  KeyRound,
} from "lucide-react";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";
import { loginFarmer, registerFarmer, loginAdmin } from "@/lib/db-client";
import { useEffect } from "react";

export const SignInView: React.FC = () => {
  const {
    setViewMode,
    language,
    setLanguage,
    theme,
    toggleTheme,
    setCurrentUser,
    setFarmerProfile,
    initialAuthTab,
    setInitialAuthTab,
  } = useFarmStore();
  const t = useTranslation(language);

  // Tab: 'signin' (Farmer Login) | 'signup' (Create Account) | 'admin' (Admin Login)
  const [authTab, setAuthTab] = useState<"signin" | "signup" | "admin">(initialAuthTab || "signin");

  useEffect(() => {
    if (initialAuthTab) {
      setAuthTab(initialAuthTab);
    }
  }, [initialAuthTab]);

  // Loading & error state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Farmer login form state
  const [mobileNumber, setMobileNumber] = useState("98765 43210");
  const [password, setPassword] = useState("demo");

  // Create account form state
  const [name, setName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [taluk, setTaluk] = useState("Puttur");
  const [village, setVillage] = useState("");
  const [acreage, setAcreage] = useState("4.2");
  const [cropType, setCropType] = useState("Arecanut, Pepper");

  // Admin login form state
  const [adminUsername, setAdminUsername] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("admin123");

  // ── 1. Farmer Login ────────────────────────────────────────────────────────
  const handleFarmerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await loginFarmer(mobileNumber, password);
      setCurrentUser({
        userId: res.user_id,
        name: res.name,
        role: "farmer",
        token: res.token,
        phone: mobileNumber.replace(/\D/g, ""),
        taluk: res.taluk,
      });

      // Update farm store with farmer profile from database
      setFarmerProfile({
        farmerName: res.name,
        location: `${res.taluk || "Puttur"} · Dakshina Kannada`,
        fruitsId: res.fruits_id || "KA-FRUITS-2024-9981",
        acreage: res.total_acreage || 4.2,
        cropVariety: res.crop_type || "Arecanut · Mangala",
      });

      setSuccessMsg(
        language === "kn"
          ? `ಸ್ವಾಗತ, ${res.name}! ನಿಮ್ಮ ಫಾರ್ಮ್ ಡೆಸ್ಕ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ...`
          : `Welcome back, ${res.name}! Opening your Farm Desk...`
      );

      setTimeout(() => {
        setViewMode("app");
      }, 700);
    } catch (err: any) {
      setErrorMsg(
        language === "kn"
          ? "ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ: ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ."
          : err.message || "Incorrect mobile number or password."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── 2. Create Farmer Account ───────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg(language === "kn" ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ." : "Please enter your name.");
      return;
    }
    if (!regPhone.trim() || regPhone.replace(/\D/g, "").length < 10) {
      setErrorMsg(language === "kn" ? "10 ಅಂಕಿಯ ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ." : "Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!regPassword.trim() || regPassword.length < 4) {
      setErrorMsg(language === "kn" ? "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 4 ಅಕ್ಷರಗಳಿರಬೇಕು." : "Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerFarmer({
        name: name.trim(),
        phone: regPhone,
        password: regPassword,
        taluk,
        village: village.trim() || "Bettampady",
        total_acreage: parseFloat(acreage) || 4.2,
        crop_type: cropType,
        language,
      });

      setCurrentUser({
        userId: res.user_id,
        name: res.name,
        role: "farmer",
        token: res.token,
        phone: regPhone.replace(/\D/g, ""),
        taluk: res.taluk,
      });

      setFarmerProfile({
        farmerName: res.name,
        location: `${res.taluk || taluk} · Dakshina Kannada`,
        fruitsId: res.fruits_id || "KA-FRUITS-NEW",
        acreage: res.total_acreage || parseFloat(acreage) || 4.2,
        cropVariety: res.crop_type || cropType,
      });

      setSuccessMsg(
        language === "kn"
          ? `ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ! ಸ್ವಾಗತ, ${res.name}.`
          : `Account created successfully! Welcome, ${res.name}.`
      );

      setTimeout(() => {
        setViewMode("app");
      }, 900);
    } catch (err: any) {
      setErrorMsg(
        language === "kn"
          ? `ಖಾತೆ ರಚನೆ ವಿಫಲ: ${err.message}`
          : err.message || "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── 3. Admin Login ─────────────────────────────────────────────────────────
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await loginAdmin(adminUsername, adminPassword);
      setCurrentUser({
        userId: res.user_id,
        name: res.name,
        role: res.role,
        token: res.token,
        taluk: res.taluk || "All",
      });

      setSuccessMsg(
        language === "kn"
          ? `ಸಂಚಾಲಕ ದೃಢೀಕರಣ ಯಶಸ್ವಿ: ${res.name}. ಕನ್ಸೋಲ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ...`
          : `Admin authenticated: ${res.name}. Opening console...`
      );

      setTimeout(() => {
        setViewMode("admin");
      }, 700);
    } catch (err: any) {
      setErrorMsg(
        language === "kn"
          ? "ಸಂಚಾಲಕ ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ: ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ."
          : err.message || "Invalid admin username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── 4. Quick Demo Instant Sign-In ──────────────────────────────────────────
  const handleQuickFarmerDemo = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await loginFarmer("9876543210", "demo");
      setCurrentUser({
        userId: res.user_id,
        name: res.name,
        role: "farmer",
        token: res.token,
        phone: "9876543210",
        taluk: "Puttur",
      });
      setFarmerProfile({
        farmerName: res.name,
        location: "Puttur · Dakshina Kannada",
        fruitsId: res.fruits_id || "KA-FRUITS-2024-9981",
        acreage: res.total_acreage || 4.2,
        cropVariety: res.crop_type || "Arecanut · Mangala",
      });
      setViewMode("app");
    } catch {
      // Offline fallback
      setViewMode("app");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminDemo = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await loginAdmin("admin", "admin123");
      setCurrentUser({
        userId: res.user_id,
        name: res.name,
        role: res.role,
        token: res.token,
        taluk: "All",
      });
      setViewMode("admin");
    } catch {
      // Offline fallback
      setViewMode("admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-krishi-darkbg animate-fadeIn">
      {/* ── Left Column (5 cols): Deep Green Forest Branding matching PDF ── */}
      <div className="lg:col-span-5 bg-[#0d2818] text-white p-8 sm:p-12 flex flex-col justify-between border-r border-[#1a4228]">
        <div>
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-krishi-gold text-slate-950 font-black flex items-center justify-center text-xl shadow-md">
              🌿
            </div>
            <div>
              <span className="font-extrabold text-lg text-white block leading-tight">
                KrishiSetu
              </span>
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block leading-tight">
                {language === "kn" ? "ಕೃಷಿ ಬುದ್ಧಿಮತ್ತೆ" : "FARM INTELLIGENCE"}
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mt-14 sm:mt-20 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-krishi-gold/20 border border-krishi-gold/30 flex items-center justify-center text-krishi-gold text-2xl">
              🌾
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              {language === "kn" ? (
                <>
                  ನಿಮ್ಮ ತೋಟಕ್ಕೊಂದು ಕಥೆಯಿದೆ. <br />
                  <span className="text-krishi-gold">ಒಟ್ಟಿಗೆ ಅರಿಯೋಣ ಬನ್ನಿ.</span>
                </>
              ) : (
                <>
                  Your field has a story. <br />
                  <span className="text-krishi-gold">Let's read it together.</span>
                </>
              )}
            </h2>

            <p className="text-sm text-emerald-200/90 leading-relaxed max-w-md">
              {language === "kn"
                ? "ಮೊದಲ ಎಲೆಯಿಂದ ಅಂತಿಮ ಮಾರುಕಟ್ಟೆಯವರೆಗೆ ನಿಮ್ಮ ಕೃಷಿಗೆ ಏನು ಬೇಕು ಎಂಬುದರ ಸಮಗ್ರ ಚಿತ್ರಣ."
                : "Get a simple, real-time view of what your farm needs next — from first leaf to final sale."}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-semibold text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === "kn"
                    ? "ಸ್ಥಳೀಯ ಬೆಳೆ & ಮುಂಗಾರು ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ"
                    : "Local crop & monsoon weather intelligence"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === "kn"
                    ? "ನೇರ ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕ: ನೈಜ ಕಾಲಮಾನದ ರೈತ ದತ್ತಾಂಶ"
                    : "Live database connected: real-time farmer data"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === "kn"
                    ? "ಜಿಲ್ಲಾ ತೋಟಗಾರಿಕಾ ಅಧಿಕಾರಿ ಮತ್ತು ಸಂಚಾಲಕ ಕನ್ಸೋಲ್"
                    : "District Agriculture Officer & Admin Console access"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-[#1b4a2e] flex items-center justify-between text-xs text-emerald-300/80">
          <span>Dakshina Kannada · Ujire · Puttur</span>
          <button
            onClick={() => setViewMode("landing")}
            className="hover:text-white underline font-bold"
          >
            {language === "kn" ? "← ಮುಖಪುಟಕ್ಕೆ" : "← Public portal"}
          </button>
        </div>
      </div>

      {/* ── Right Column (7 cols): Clean Workspace Form ── */}
      <div className="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-between overflow-y-auto">
        {/* Top Controls: Theme & Language */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-krishi-darkborder bg-slate-50 dark:bg-krishi-darkcard text-slate-700 dark:text-slate-200"
            title="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          <button
            onClick={() => setLanguage(language === "kn" ? "en" : "kn")}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-krishi-darkborder bg-slate-50 dark:bg-krishi-darkcard text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-krishi-600" />
            <span>{language === "kn" ? "English" : "ಕನ್ನಡ"}</span>
          </button>
        </div>

        {/* Center Auth Card */}
        <div className="max-w-md w-full mx-auto space-y-6 my-auto py-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              {authTab === "admin"
                ? (language === "kn" ? "ಜಿಲ್ಲಾ ಕೃಷಿ ಸಂಚಾಲಕ" : "OFFICER & ADMIN ACCESS")
                : (language === "kn" ? "ರೈತರ ಕಾರ್ಯಕ್ಷೇತ್ರ" : "FARMER WORKSPACE")}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {authTab === "signin" && (language === "kn" ? "ಮತ್ತೆ ಸ್ವಾಗತ!" : "Good to see you again.")}
              {authTab === "signup" && (language === "kn" ? "ಹೊಸ ಖಾತೆ ತೆರೆಯಿರಿ" : "Create your farm account.")}
              {authTab === "admin" && (language === "kn" ? "ಸಂಚಾಲಕರ ಲಾಗಿನ್" : "Admin & Officer Portal.")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {authTab === "signin" &&
                (language === "kn"
                  ? "ಇಂದಿನ ತೋಟದ ಸ್ಥಿತಿಗತಿ ತಿಳಿಯಲು ಮೊಬೈಲ್ ಮೂಲಕ ಲಾಗಿನ್ ಮಾಡಿ."
                  : "Sign in with your mobile number to view today's farm status.")}
              {authTab === "signup" &&
                (language === "kn"
                  ? "ನಿಮ್ಮ ತೋಟ ಮತ್ತು ಜಮೀನಿನ ವಿವರಗಳೊಂದಿಗೆ ತಕ್ಷಣ ನೋಂದಾಯಿಸಿ."
                  : "Register with your holding size and taluk to access live farm intelligence.")}
              {authTab === "admin" &&
                (language === "kn"
                  ? "ಜಿಲ್ಲಾ ಕೃಷಿ ಅಧಿಕಾರಿ ಅಥವಾ ಕಾಲೇಜು ಆಡಳಿತ ಮಂಡಳಿ ರುಜುವಾತುಗಳನ್ನು ಬಳಸಿ."
                  : "Sign in with SDM Institute or Agriculture Department credentials.")}
            </p>
          </div>

          {/* 3 Auth Mode Tabs */}
          <div className="flex bg-slate-100 dark:bg-krishi-darkcard p-1 rounded-2xl border border-slate-200 dark:border-krishi-darkborder text-xs font-bold gap-1">
            <button
              onClick={() => {
                setAuthTab("signin");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authTab === "signin"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {language === "kn" ? "ರೈತರ ಲಾಗಿನ್" : "Farmer Sign In"}
            </button>
            <button
              onClick={() => {
                setAuthTab("signup");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authTab === "signup"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {language === "kn" ? "ಹೊಸ ಖಾತೆ" : "Create Account"}
            </button>
            <button
              onClick={() => {
                setAuthTab("admin");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                authTab === "admin"
                  ? "bg-krishi-800 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-krishi-gold" />
              <span>{language === "kn" ? "ಸಂಚಾಲಕ" : "Admin"}</span>
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ── TAB 1: Farmer Sign In Form ── */}
          {authTab === "signin" && (
            <form onSubmit={handleFarmerLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === "kn" ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ" : "Mobile number"}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="98765 43210"
                    required
                    className="w-full pl-9 pr-3 py-3 bg-slate-50 dark:bg-krishi-darkcard rounded-2xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-krishi-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {language === "kn" ? "ಪಾಸ್‌ವರ್ಡ್" : "Password"}
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    (Demo: demo)
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-3 bg-slate-50 dark:bg-krishi-darkcard rounded-2xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-krishi-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-krishi-700 hover:bg-krishi-800 disabled:opacity-50 text-white rounded-2xl text-xs font-extrabold transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === "kn" ? "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ..." : "Verifying credentials..."}</span>
                  </>
                ) : (
                  <>
                    <span>{language === "kn" ? "ನನ್ನ ತೋಟ ಪ್ರವೇಶಿಸಿ" : "Enter my farm"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── TAB 2: Create Account Form ── */}
          {authTab === "signup" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === "kn" ? "ರೈತರ ಹೆಸರು *" : "Farmer Name *"}
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Gowda"
                      required
                      className="w-full pl-8 pr-2.5 py-2.5 bg-slate-50 dark:bg-krishi-darkcard rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-krishi-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === "kn" ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *" : "Mobile Number *"}
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="98450 12345"
                      required
                      className="w-full pl-8 pr-2.5 py-2.5 bg-slate-50 dark:bg-krishi-darkcard rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-krishi-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === "kn" ? "ಪಾಸ್‌ವರ್ಡ್ *" : "Password *"}
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 4 characters"
                      required
                      className="w-full pl-8 pr-2.5 py-2.5 bg-slate-50 dark:bg-krishi-darkcard rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-krishi-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === "kn" ? "ತಾಲೂಕು *" : "Taluk *"}
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={taluk}
                      onChange={(e) => setTaluk(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-2.5 bg-slate-50 dark:bg-krishi-darkcard rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-krishi-500"
                    >
                      <option value="Puttur">Puttur (ಪುತ್ತೂರು)</option>
                      <option value="Belthangady">Belthangady (ಬೆಳ್ತಂಗಡಿ)</option>
                      <option value="Sullia">Sullia (ಸುಳ್ಯ)</option>
                      <option value="Bantwal">Bantwal (ಬಂಟ್ವಾಳ)</option>
                      <option value="Mangaluru">Mangaluru (ಮಂಗಳೂರು)</option>
                      <option value="Moodabidri">Moodabidri (ಮೂಡುಬಿದಿರೆ)</option>
                      <option value="Kadaba">Kadaba (ಕಡಬ)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === "kn" ? "ಗ್ರಾಮ / ಊರು" : "Village / Town"}
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Bettampady / Ujire"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-krishi-darkcard rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-krishi-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === "kn" ? "ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)" : "Total Acreage"}
                  </label>
                  <div className="relative">
                    <Trees className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      value={acreage}
                      onChange={(e) => setAcreage(e.target.value)}
                      placeholder="4.2"
                      className="w-full pl-8 pr-2.5 py-2.5 bg-slate-50 dark:bg-krishi-darkcard rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-krishi-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === "kn" ? "ಪ್ರಮುಖ ಬೆಳೆಗಳು" : "Primary Crops"}
                </label>
                <div className="relative">
                  <Sprout className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    placeholder="Arecanut, Pepper, Paddy, Rubber"
                    className="w-full pl-8 pr-2.5 py-2.5 bg-slate-50 dark:bg-krishi-darkcard rounded-xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-krishi-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-2xl text-xs font-extrabold transition shadow-md flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === "kn" ? "ಖಾತೆ ಸೃಷ್ಟಿಸಲಾಗುತ್ತಿದೆ..." : "Creating account in database..."}</span>
                  </>
                ) : (
                  <>
                    <span>{language === "kn" ? "ಖಾತೆ ತೆರೆಯಿರಿ & ತೋಟ ಪ್ರವೇಶಿಸಿ" : "Register & Open Farm Desk"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── TAB 3: Admin & Officer Login Form ── */}
          {authTab === "admin" && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    {language === "kn" ? "ಸಂಚಾಲಕ ರುಜುವಾತುಗಳು (Seeded in DB):" : "Seeded Admin Credentials:"}
                  </span>
                  <div className="font-mono text-[11px] mt-1 space-y-0.5 text-amber-800 dark:text-amber-300">
                    <div>• SDM Admin: <strong>admin</strong> / <strong>admin123</strong></div>
                    <div>• Puttur Officer: <strong>dho_puttur</strong> / <strong>puttur@2026</strong></div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === "kn" ? "ಬಳಕೆದಾರ ಹೆಸರು (Username)" : "Admin Username"}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin / dho_puttur"
                    required
                    className="w-full pl-9 pr-3 py-3 bg-slate-50 dark:bg-krishi-darkcard rounded-2xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-krishi-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === "kn" ? "ಪಾಸ್‌ವರ್ಡ್" : "Password"}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-3 bg-slate-50 dark:bg-krishi-darkcard rounded-2xl border border-slate-200 dark:border-krishi-darkborder text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-krishi-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white dark:bg-krishi-gold dark:text-slate-950 dark:hover:bg-amber-400 disabled:opacity-50 rounded-2xl text-xs font-extrabold transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === "kn" ? "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ..." : "Authenticating admin..."}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-krishi-gold dark:text-slate-950" />
                    <span>{language === "kn" ? "ಸಂಚಾಲಕ ಕನ್ಸೋಲ್ ಪ್ರವೇಶಿಸಿ" : "Access Admin Console"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── Quick Demo Login Cards matching screenshot on page 19 ── */}
          <div className="pt-4 border-t border-slate-200 dark:border-krishi-darkborder space-y-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              {language === "kn" ? "ತತ್ಕ್ಷಣ ಡೆಮೊ ಲಾಗಿನ್ (1-ಕ್ಲಿಕ್)" : "Instant Demo Profiles (1-Click)"}
            </span>

            {/* Farmer Demo Card */}
            <button
              onClick={handleQuickFarmerDemo}
              disabled={loading}
              className="w-full p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100/70 transition flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-krishi-gold text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
                  SG
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                    Shivappa Gowda (Farmer Demo)
                  </span>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300 block leading-tight">
                    Shrinivasa Farm · Puttur · 4.2 acres
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                {language === "kn" ? "ಪ್ರವೇಶಿಸಿ →" : "Sign in →"}
              </span>
            </button>

            {/* Admin Demo Card */}
            <button
              onClick={handleQuickAdminDemo}
              disabled={loading}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-krishi-darkcard border border-slate-200 dark:border-krishi-darkborder hover:bg-slate-100 dark:hover:bg-slate-800/60 transition flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-krishi-gold font-black text-xs flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                    SDM Admin (Console Demo)
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
                    Super Admin · Dakshina Kannada District
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:translate-x-0.5 transition-transform">
                {language === "kn" ? "ಕನ್ಸೋಲ್ →" : "Console →"}
              </span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 py-4">
          KRISISETU · Built for SDM Institute of Technology, Ujire · Innovate-a-Thon 2026
        </div>
      </div>
    </div>
  );
};
