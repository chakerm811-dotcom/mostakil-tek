import React, { useState, useEffect } from "react";
import { 
  Code, 
  Wrench, 
  Search, 
  Database, 
  Cpu, 
  Wallet, 
  User, 
  Plus, 
  Check, 
  MessageSquare, 
  Send, 
  Terminal, 
  ArrowRight, 
  AlertTriangle, 
  Star, 
  Clock, 
  Sparkles, 
  Layers, 
  Globe, 
  Sliders, 
  Calendar, 
  CheckCircle2, 
  Phone, 
  Mail, 
  FileText, 
  Video, 
  ShieldAlert, 
  Info, 
  HelpCircle, 
  CheckSquare, 
  Activity, 
  ChevronRight, 
  Trash2, 
  TrendingUp, 
  BookOpen 
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  priceStart: number;
  deliveryDays: number;
  features: string[];
  image: string;
}

interface AIConsultation {
  techAnalysis: string;
  proposedAgenda: string;
  requiredPreparation: string;
  estimatedComplexity: string;
  estimatedCost: string;
}

interface Meeting {
  id: string;
  _id?: string;
  serviceId: string;
  serviceTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  meetingDate: string;
  meetingTime: string;
  problemDescription: string;
  status: "pending" | "scheduled" | "completed" | "canceled";
  notes: string;
  createdAt: string;
  aiConsultation?: AIConsultation;
}

interface DiagnoseReport {
  rootCause: string;
  remedyOne: string;
  remedyTwo: string;
  remedyThree: string;
  remedyPrice: string;
  remedyDifficulty: string;
}

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<"home" | "book" | "meetings" | "diagnose">("home");
  const [dbStatus, setDbStatus] = useState<any>(null);

  // Core Data
  const [services, setServices] = useState<Service[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [developer, setDeveloper] = useState<any>({
    name: "م. حسام محمد",
    title: "مطور برمجيات متكامل (Full-Stack Developer) ومستشار حلول سحابية",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    bio: "أساعد الشركات والمبتكرين في تحويل أفكارهم إلى مواقع وتطبيقات حقيقية قوية سريعة، وإصلاح أصعب المشاكل البرمجية وقواعد بيانات MongoDB.",
    telegram: "@dev_hossam",
    email: "hossam.dev@example.com",
    skills: ["React / Vite", "Node.js (Express)", "MongoDB", "تحسين الأداء وصيانة الأعطال", "أمن التطبيقات", "APIs Integration"]
  });

  // Client Filter & Email Search
  const [searchEmail, setSearchEmail] = useState("");
  const [searchedMeetings, setSearchedMeetings] = useState<Meeting[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Selected states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    meetingDate: "",
    meetingTime: "",
    problemDescription: ""
  });
  
  // States of Operations
  const [isServicesLoading, setIsServicesLoading] = useState(true);
  const [isMeetingsLoading, setIsMeetingsLoading] = useState(true);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [recentlyBookedMeeting, setRecentlyBookedMeeting] = useState<Meeting | null>(null);

  // Admin Mode Simulator
  const [adminMode, setAdminMode] = useState(false);
  const [selectedMeetingForNotes, setSelectedMeetingForNotes] = useState<Meeting | null>(null);
  const [tempNotes, setTempNotes] = useState("");
  const [tempStatus, setTempStatus] = useState<string>("");
  const [isUpdatingMeeting, setIsUpdatingMeeting] = useState(false);

  // AI Direct Diagnoser State
  const [troubleInput, setTroubleInput] = useState("");
  const [troubleReport, setTroubleReport] = useState<DiagnoseReport | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // Service Creation Modal (For Developer Flow)
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({
    title: "",
    category: "بناء مواقع متكاملة",
    description: "",
    priceStart: "100",
    deliveryDays: "3",
    features: ""
  });
  const [isCreatingService, setIsCreatingService] = useState(false);

  // Developer Secure Login Modal state
  const [showDeveloperLoginModal, setShowDeveloperLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleDeveloperLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.trim().toLowerCase() === "chakerm811@gmail.com" && loginPassword === "chakerm811") {
      setAdminMode(true);
      setShowDeveloperLoginModal(false);
      setLoginError("");
    } else {
      setLoginError("معذرةً، البريد الإلكتروني أو كلمة المرور غير مطابقة. تم حظر الدخول!");
    }
  };

  // Init Data fetch
  useEffect(() => {
    fetchBackendStatus();
    fetchDeveloperProfile();
    fetchServices();
    fetchMeetings();
  }, []);

  const fetchBackendStatus = async () => {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      setDbStatus(data);
    } catch (e) {
      console.error("Failed to load backend status:", e);
    }
  };

  const fetchDeveloperProfile = async () => {
    try {
      const res = await fetch("/api/developer-profile");
      if (res.ok) {
        const data = await res.json();
        setDeveloper(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    setIsServicesLoading(true);
    try {
      const res = await fetch("/api/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (e) {
      console.error("Failed to load services:", e);
    } finally {
      setIsServicesLoading(false);
    }
  };

  const fetchMeetings = async () => {
    setIsMeetingsLoading(true);
    try {
      const res = await fetch("/api/meetings");
      if (res.ok) {
        const data = await res.json();
        setMeetings(data);
      }
    } catch (e) {
      console.error("Failed to load meetings:", e);
    } finally {
      setIsMeetingsLoading(false);
    }
  };

  const handleSelectServiceAndRedirect = (service: Service) => {
    setSelectedService(service);
    setBookingForm({
      ...bookingForm,
      problemDescription: `أحتاج إلى حجز اجتماع لمناقشة "${service.title}". وتفاصيل المشكلة أو المشروع هي:`
    });
    setRecentlyBookedMeeting(null);
    setActiveTab("book");
  };

  const handleClearSelectedService = () => {
    setSelectedService(null);
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.clientName || !bookingForm.clientEmail || !bookingForm.meetingDate || !bookingForm.meetingTime || !bookingForm.problemDescription) {
      alert("الرجاء ملء كافة الحقول لإتمام حجز الموعد!");
      return;
    }

    setIsBookingInProgress(true);
    setRecentlyBookedMeeting(null);

    const payload = {
      serviceId: selectedService?.id || "custom",
      serviceTitle: selectedService ? selectedService.title : "استشارة تقنية عامة وحل مشاكل برمجية",
      clientName: bookingForm.clientName,
      clientEmail: bookingForm.clientEmail,
      clientPhone: bookingForm.clientPhone || "unspecified",
      meetingDate: bookingForm.meetingDate,
      meetingTime: bookingForm.meetingTime,
      problemDescription: bookingForm.problemDescription
    };

    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedMeeting = await res.json();
        setRecentlyBookedMeeting(savedMeeting);
        
        // Refresh master list
        fetchMeetings();
        
        // Reset form
        setBookingForm({
          clientName: "",
          clientEmail: "",
          clientPhone: "",
          meetingDate: "",
          meetingTime: "",
          problemDescription: ""
        });
        
        // Also keep search email automatically matching to see it in my bookings later
        setSearchEmail(payload.clientEmail);
      } else {
        const errorData = await res.json();
        alert(`حدث خطأ أثناء الحجز: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("فشل الاتصال بالخادم الرئيسي لحفظ موعدك.");
    } finally {
      setIsBookingInProgress(false);
    }
  };

  // Search visitor bookings
  const handleSearchBookingsByEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) {
      alert("الرجاء كتابة البريد الإلكتروني للبحث عن حوزاتك!");
      return;
    }
    const filtered = meetings.filter(m => m.clientEmail.toLowerCase().includes(searchEmail.trim().toLowerCase()));
    setSearchedMeetings(filtered);
    setHasSearched(true);
  };

  const handleCancelSearch = () => {
    setSearchEmail("");
    setSearchedMeetings([]);
    setHasSearched(false);
  };

  // Admin notes change
  const handleOpenMeetingEditor = (meeting: Meeting) => {
    setSelectedMeetingForNotes(meeting);
    setTempNotes(meeting.notes || "");
    setTempStatus(meeting.status);
  };

  const handleUpdateMeetingStatus = async () => {
    if (!selectedMeetingForNotes) return;
    setIsUpdatingMeeting(true);

    try {
      const res = await fetch(`/api/meetings/${selectedMeetingForNotes.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: tempStatus,
          notes: tempNotes
        })
      });

      if (res.ok) {
        const updated = await res.json();
        // Update local views
        setMeetings(meetings.map(m => m.id === updated.id ? updated : m));
        if (hasSearched) {
          setSearchedMeetings(searchedMeetings.map(m => m.id === updated.id ? updated : m));
        }
        setSelectedMeetingForNotes(updated);
        alert("تم تحديث حالة وحالة موعد الاجتماع بنجاح!");
      }
    } catch (err) {
      console.error(err);
      alert("أخفق تحديث بيانات الاجتماع سحابياً.");
    } finally {
      setIsUpdatingMeeting(false);
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في إلغاء وحذف موعد هذا الاجتماع بالكامل من السجلات؟")) return;
    try {
      const res = await fetch(`/api/meetings/${meetingId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setMeetings(meetings.filter(m => m.id !== meetingId));
        setSearchedMeetings(searchedMeetings.filter(m => m.id !== meetingId));
        if (selectedMeetingForNotes?.id === meetingId) {
          setSelectedMeetingForNotes(null);
        }
        alert("تم إلغاء وحذف الاجتماع المقترح بنجاح.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Service dynamically
  const handleCreateNewService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceForm.title || !newServiceForm.description || !newServiceForm.priceStart) {
      alert("الرجاء ملء البيانات الأساسية للخدمة الجديدة!");
      return;
    }
    setIsCreatingService(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newServiceForm.title,
          category: newServiceForm.category,
          description: newServiceForm.description,
          priceStart: parseInt(newServiceForm.priceStart),
          deliveryDays: parseInt(newServiceForm.deliveryDays),
          features: newServiceForm.features.split("\n").filter(f => f.trim().length > 0)
        })
      });
      if (res.ok) {
        setShowAddServiceModal(false);
        setNewServiceForm({
          title: "",
          category: "بناء مواقع متكاملة",
          description: "",
          priceStart: "100",
          deliveryDays: "3",
          features: ""
        });
        await fetchServices();
        alert("تمت إضافة الخدمة البرمجية الجديدة إلى الكتالوج بنجاح!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingService(false);
    }
  };

  // Direct AI analysis / diagnose logic
  const handleAIBugDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!troubleInput.trim()) return;
    setIsDiagnosing(true);
    setTroubleReport(null);
    try {
      const res = await fetch("/api/ai/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorText: troubleInput })
      });
      if (res.ok) {
        const report = await res.json();
        setTroubleReport(report);
      }
    } catch (err) {
      console.error(err);
      alert("فشل تشخيص الكود مؤقتاً بالذكاء الاصطناعي.");
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm" id="app_header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">مستقل</span>
                <span className="text-xl font-extrabold text-emerald-600 tracking-tight">تك</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100">لقاء المبرمج</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">اختر خدمتك واحجز موعد اجتماعك مباشرة مع المبرمج</p>
            </div>
          </div>

          {/* Database Indicator */}
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
            <Database className="h-3.5 w-3.5 text-emerald-600" />
            <span>{dbStatus?.databaseType || "خادم MongoDB متصل"}</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          {/* Admin Switch Simulation Link */}
          <div className="flex items-center gap-3">
            <button
              id="admin_mode_toggle"
              onClick={() => {
                if (adminMode) {
                  setAdminMode(false);
                  setSelectedMeetingForNotes(null);
                } else {
                  setLoginEmail("");
                  setLoginPassword("");
                  setLoginError("");
                  setShowDeveloperLoginModal(true);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                adminMode 
                ? "bg-amber-600 text-white shadow-sm shadow-amber-200" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>{adminMode ? "لوحة المطور: مفعّلة 🛠️" : "دخول المطور 👨‍💻"}</span>
            </button>
          </div>

        </div>
      </header>

      {/* SUB-HEADER APP PROFILE BANNER */}
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="dev_banner">
        {/* Absolute Glowing circles for design depth */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Avatar and Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-right">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                alt="حسام محمد" 
                className="w-24 h-24 rounded-2xl border-4 border-emerald-500 object-cover shadow-lg"
              />
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse"></span>
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black tracking-tight">{developer.name}</h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold px-2 py-0.5 rounded-md">متاح لتلقي المشاريع 🚀</span>
              </div>
              <p className="text-emerald-400 font-bold text-sm mt-1">{developer.title}</p>
              <p className="text-slate-300 text-xs mt-2 max-w-xl leading-relaxed">{developer.bio}</p>
              
              {/* Technical skills list badges */}
              <div className="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
                {developer.skills?.map((skill: string, idx: number) => (
                  <span key={idx} className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats or contact details */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 w-full sm:w-auto">
            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/50 p-4 rounded-xl flex items-center gap-3.5 sm:min-w-48 shadow-sm">
              <Mail className="h-8 w-8 text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold">راسلني عبر البريد</p>
                <p className="text-sm font-extrabold text-slate-100">{developer.email}</p>
              </div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/50 p-4 rounded-xl flex items-center gap-3.5 sm:min-w-48 shadow-sm">
              <Send className="h-8 w-8 text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold">تواصل تلغرام فوري</p>
                <p className="text-sm font-extrabold text-slate-100">{developer.telegram}</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CORE NAVIGATION BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-30 shadow-xs" id="navigation_tabs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto whitespace-nowrap gap-4 py-2">
            
            {/* Tab select elements */}
            <div className="flex gap-2">
              <button
                id="tab_home_btn"
                onClick={() => setActiveTab("home")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "home"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>الخدمات والحلول المتاحة</span>
              </button>

              <button
                id="tab_book_btn"
                onClick={() => setActiveTab("book")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "book"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>حجز اجتماع وموعد جديد</span>
                {selectedService && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                )}
              </button>

              <button
                id="tab_meetings_btn"
                onClick={() => setActiveTab("meetings")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "meetings"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>مواعيد واجتماعات العملاء</span>
                <span className="bg-slate-200 text-slate-700 text-xxs font-extrabold px-1.5 py-0.5 rounded-md">
                  {meetings.length}
                </span>
              </button>

              <button
                id="tab_diagnose_btn"
                onClick={() => setActiveTab("diagnose")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "diagnose"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Terminal className="h-4 w-4 text-emerald-500 font-bold" />
                <span>طبيب الأكواد والذكاء الاصطناعي 🧬</span>
              </button>
            </div>

            {/* Quick action button to add customized service (useful simulation) */}
            {adminMode && (
              <button
                id="add_new_service_btn"
                onClick={() => setShowAddServiceModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-emerald-500 hover:bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>إضافة خدمة جديدة للكتالوج</span>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* MAIN APPLICATION CONTAINER BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: SERVICES OFFERINGS IN CATALOG */}
        {activeTab === "home" && (
          <div id="catalog_services_view" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-slate-950">كتالوج الخدمات التقنية الاحترافية</h3>
                <p className="text-xs text-slate-500">تصفح الخدمات المتوفرة، اختر الخدمة الملائمة لطرح مشكلتك واحجز اجتماعاً فورياً لمناقشتها وعلاجها.</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs px-3.5 py-2 rounded-lg border border-emerald-100/80 font-medium">
                <Info className="h-4 w-4 text-emerald-600" />
                <span>اضغط على الخدمة لتعبئة نموذج حجز الاجتماع تلقائياً</span>
              </div>
            </div>

            {isServicesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 animate-pulse h-60"></div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 animate-pulse h-60"></div>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
                  <Database className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold">لا يوجد خدمات مضافة حالياً.</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">تأكد من تشغيل خادم الباكيند لتوليد الخدمات الافتراضية سحابياً.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div 
                    key={service.id} 
                    id={`service_card_${service.id}`}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col hover:border-emerald-300 group"
                  >
                    {/* Top banner / Image */}
                    <div className="h-36 bg-slate-100 relative overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                        <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded">
                          {service.category}
                        </span>
                      </div>
                    </div>

                    {/* Service Info Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors">
                          {service.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed text-justify line-clamp-3">
                          {service.description}
                        </p>
                        
                        {/* Features List */}
                        {service.features && service.features.length > 0 && (
                          <div className="grid grid-cols-2 gap-1.5 pt-3 border-t border-slate-100">
                            {service.features.map((feat, fidx) => (
                              <div key={fidx} className="flex items-center gap-1.5 text-[10px] text-slate-600 font-medium">
                                <CheckSquare className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                                <span className="truncate">{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Pricing and Action button */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-4">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold">التكلفة التقريبية للحل</p>
                          <p className="text-base font-black text-slate-950">
                            تبدأ من <span className="text-emerald-600 font-extrabold">${service.priceStart}</span>
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-bold">متوسط الفحص والحل</p>
                          <p className="text-xs font-bold text-slate-700 flex items-center justify-end gap-1">
                            <Clock className="h-3 w-3 text-emerald-600" />
                            <span>{service.deliveryDays} {service.deliveryDays === 1 ? "يوم واحد" : "أيام"}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        id={`btn_book_service_${service.id}`}
                        onClick={() => handleSelectServiceAndRedirect(service)}
                        className="w-full bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-900 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group-hover:bg-slate-900 group-hover:text-white"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>اختر هذه الخدمة واحجز موعد اجتماع 🗓️</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTERACTIVE APPOINTMENT SCHEDULER */}
        {activeTab === "book" && (
          <div id="booking_meeting_view" className="space-y-6 max-w-4xl mx-auto">
            
            {/* Header / Intro */}
            <div className="border-b border-slate-200 pb-5">
              <h3 className="text-xl font-extrabold tracking-tight text-slate-950">طلب حجز اجتماع واستشارة فنية</h3>
              <p className="text-xs text-slate-500">قم بتعبئة هذا النموذج، واشرح عطل كودك أو احتياجات موقعك البرمجية لتحديد موعد مكالمة مرئية مجانية مع المطور.</p>
            </div>

            {/* If selected Service displays Banner */}
            {selectedService ? (
              <div className="bg-emerald-50 text-emerald-950 p-4 rounded-xl border border-emerald-100 flex items-start justify-between gap-4" id="selected_service_banner">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-lg mt-0.5">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded">الخدمة البرمجية المعتمدة للحجز</span>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1">{selectedService.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{selectedService.description}</p>
                  </div>
                </div>
                <button 
                  onClick={handleClearSelectedService}
                  className="text-slate-400 hover:text-slate-900 text-xs font-bold px-2 py-1 rounded hover:bg-emerald-100"
                >
                  تغيير الخدمة
                </button>
              </div>
            ) : (
              <div className="bg-amber-50 text-amber-950 p-4 rounded-xl border border-amber-100 flex items-center gap-3" id="no_service_selected_callout">
                <Info className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-extrabold block">أنت تسجل موعد استشارة عامة</span>
                  <p className="text-amber-800 mt-0.5">تستطيع اختيار خدمة متخصصة من "كتالوج الخدمات المتاحة" لتأمين تحضير أفضل قبل إجراء المكالمة.</p>
                </div>
              </div>
            )}

            {/* BOOKING WIZARD FORM ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form entries */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-extrabold text-slate-900 ml-3 text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  <span>معلومات العميل وتفاصيل اللقاء</span>
                </h4>

                <form onSubmit={handleCreateMeeting} className="space-y-4">
                  
                  {/* Visitor Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">الاسم الكامل للزائر *</label>
                      <input 
                        type="text"
                        required
                        placeholder="مثال: خالد العتيبي"
                        value={bookingForm.clientName}
                        onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">البريد الإلكتروني للزائر *</label>
                      <input 
                        type="email"
                        required
                        placeholder="مثال: client@example.com"
                        value={bookingForm.clientEmail}
                        onChange={(e) => setBookingForm({ ...bookingForm, clientEmail: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs text-left"
                      />
                    </div>
                  </div>

                  {/* Visitor Phone, Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الجوال للتواصل</label>
                      <input 
                        type="tel"
                        placeholder="مثال: +966500000000"
                        value={bookingForm.clientPhone}
                        onChange={(e) => setBookingForm({ ...bookingForm, clientPhone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs text-left"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 font-sans">تاريخ الاجتماع المقترح *</label>
                      <input 
                        type="date"
                        required
                        value={bookingForm.meetingDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, meetingDate: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs text-left"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">الفترة الزمنية المفضلة *</label>
                      <select
                        required
                        value={bookingForm.meetingTime}
                        onChange={(e) => setBookingForm({ ...bookingForm, meetingTime: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
                      >
                        <option value="">-- اختر توقيتك --</option>
                        <option value="10:00 صباحاً">10:00 صباحاً</option>
                        <option value="11:30 صباحاً">11:30 صباحاً</option>
                        <option value="01:30 مساءً">01:30 مساءً</option>
                        <option value="03:00 مساءً">03:00 مساءً</option>
                        <option value="04:30 مساءً">04:30 مساءً</option>
                        <option value="08:00 مساءً">08:00 مساءً</option>
                      </select>
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      اشرح مشكلتك البرمجية أو أفكار مشروعك بالتفصيل *
                    </label>
                    <textarea 
                      required
                      rows={6}
                      placeholder="للحصول على تشخيص دقيق بالذكاء الاصطناعي، يرجى كتابة تفاصيل المشكلة، مثلاً: ما هي بيئة التطوير؟ ما هو الأثر السلبي؟ انسخ أي كود أو رسالة خطأ تواجهها هنا."
                      value={bookingForm.problemDescription}
                      onChange={(e) => setBookingForm({ ...bookingForm, problemDescription: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs font-sans leading-relaxed"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="submit_booking_form_btn"
                    disabled={isBookingInProgress}
                    className="w-full h-11 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-black tracking-wide transition-all flex items-center justify-center gap-2 "
                  >
                    {isBookingInProgress ? (
                      <>
                        <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                        <span>جاري تحليل المشكلة بالذكاء الاصطناعي وإدراج موعدك...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>تأكيد الحجز وتوليد تقرير الاستشارة الفوري ✦</span>
                      </>
                    )}
                  </button>

                </form>
              </div>

              {/* Side Card: Dynamic Guidance Checklist */}
              <div className="space-y-4">
                
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 relative overflow-hidden shadow-md">
                  <div className="absolute top-0 right-0 p-3 text-emerald-400/10">
                    <Sparkles className="h-20 w-20" />
                  </div>
                  
                  <h5 className="font-extrabold text-sm flex items-center gap-2 text-emerald-400">
                    <Sparkles className="h-4 w-4" />
                    <span>ميزة التشخيص الذكي الفوري</span>
                  </h5>
                  <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                    بمجرد تسجيل الموعد، سيقوم خادم مستقل تك باستدعاء محرك الذكاء الاصطناعي 
                    <span className="text-white font-bold mx-0.5">Google Gemini</span> 
                    لقراءة وصف مشكلتك وصياغة تحليل تقني، جدول أعمال، وقائمة بمتطلبات الاستعداد للمكالمة فورا!
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2.5">
                    <div className="flex items-start gap-2 text-[10px] text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5" />
                      <span>تحديد أسباب الأعطال المتوقعة</span>
                    </div>
                    <div className="flex items-start gap-2 text-[10px] text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5" />
                      <span>بروتوكول تحضير بيئة الكود</span>
                    </div>
                    <div className="flex items-start gap-2 text-[10px] text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5" />
                      <span>جدول زمني لمهام اللقاء دقيقة بدقيقة</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200">
                  <h5 className="font-extrabold text-xs text-slate-950 flex items-center gap-2">
                    <Info className="h-4 w-4 text-slate-500" />
                    <span>إرشادات قبل اللقاء</span>
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                    من فضلك، تأكد من تسجيل بريد إلكتروني صحيح للتمكن من مراجعة الموعد أو إلغائه لاحقاً، كما سينعقد الاجتماع عبر Google Meet ويتم ربط الرابط من خلال لوحة المواعيد.
                  </p>
                </div>

              </div>

            </div>

            {/* RESULTS ROW: DYNAMIC GEMINI GORGEOUS BOX */}
            {recentlyBookedMeeting && (
              <div className="bg-emerald-950/20 rounded-2xl p-6 border-2 border-emerald-500/80 mt-6 relative overflow-hidden" id="gorgeous_success_ai_box">
                <div className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[10px] font-black px-2.5 py-1 rounded">تم تأكيد الاجتماع بنجاح 📅</div>
                
                <div className="flex items-center gap-2 text-emerald-600">
                  <Sparkles className="h-5 w-5 hover:scale-110 transition-transform" />
                  <h4 className="font-black text-slate-900 text-base">استشارة وجدول أعمال الاجتماع المولّد بالـ AI ✦</h4>
                </div>
                
                <p className="text-xs text-slate-600 mt-1 pb-4 border-b border-emerald-200/30">
                  مرحباً بك أستاذ <span className="font-extrabold text-slate-900">{recentlyBookedMeeting.clientName}</span>، لحضور الاجتماع بخصوص <span className="font-extrabold text-emerald-700">"{recentlyBookedMeeting.serviceTitle}"</span> المجدول في تاريخ <span className="font-extrabold text-slate-900">{recentlyBookedMeeting.meetingDate}</span> في تمام <span className="font-extrabold text-slate-900">{recentlyBookedMeeting.meetingTime}</span>. إليك دليل الاستشارة المقترح:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  
                  {/* Tech analysis */}
                  <div className="bg-white/80 p-4 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-extrabold text-slate-400 block uppercase">التحليل الفني الأولي للمشكلة</span>
                    <p className="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">
                      {recentlyBookedMeeting.aiConsultation?.techAnalysis}
                    </p>
                  </div>

                  {/* Required Preparation */}
                  <div className="bg-white/80 p-4 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-extrabold text-slate-400 block uppercase">متطلبات التحضير قبل الاجتماع</span>
                    <p className="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">
                      {recentlyBookedMeeting.aiConsultation?.requiredPreparation}
                    </p>
                  </div>

                  {/* Proposed Agenda */}
                  <div className="bg-white/80 p-4 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-extrabold text-emerald-700 block uppercase">جدول أعمال المكالمة المقترح (دقيقة بدقيقة)</span>
                    <p className="text-xs font-mono font-medium text-slate-800 mt-1 leading-relaxed">
                      {recentlyBookedMeeting.aiConsultation?.proposedAgenda}
                    </p>
                  </div>

                  {/* Pricing Estimates */}
                  <div className="bg-white/80 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 block uppercase">مستوى الصعوبة المتوقع</span>
                      <span className="inline-block mt-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black rounded">
                        {recentlyBookedMeeting.aiConsultation?.estimatedComplexity || "متوسط"}
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="text-[10px] font-extrabold text-slate-400 block uppercase">تقدير الميزانية الدقيقة</span>
                      <span className="inline-block mt-1 px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded shadow-xs">
                        {recentlyBookedMeeting.aiConsultation?.estimatedCost || "$150"}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Confirm banner */}
                <div className="mt-5 bg-emerald-600 text-white p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
                  <div className="flex items-center gap-2">
                    <Video className="h-4.5 w-4.5" />
                    <span>رابط الحضور الافتراضي سيظهر في صفحة "مواعيد واجتماعات العملاء" باسمك بمجرد التأكيد النهائي للاتصال.</span>
                  </div>
                  <button 
                    onClick={() => setActiveTab("meetings")}
                    className="bg-white text-emerald-950 px-4 py-1.5 rounded-lg font-black hover:bg-slate-100 transition-all flex-shrink-0"
                  >
                    عرض جدول المواعيد الكامل 🗓️
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 3: SCHEDULED MEETINGS VIEW & TRACKER */}
        {activeTab === "meetings" && (
          <div id="scheduled_meetings_view" className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-slate-950">دفتر وجدول مواعيد اجتماعات مستقل تك</h3>
                <p className="text-xs text-slate-500">اختر البريد الإلكتروني الذي حجزت به لتتبع مستجدات اللقاء، وإجابات المطور وملاحظاته الفنية.</p>
              </div>

              {/* Email search Form */}
              <form onSubmit={handleSearchBookingsByEmail} className="flex gap-2">
                <div className="relative">
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="email"
                    placeholder="ابحث ببريدك الإلكتروني..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="pl-3 pr-10 py-2 w-64 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 text-xs text-left"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  بحث
                </button>
                {hasSearched && (
                  <button
                    type="button"
                    onClick={handleCancelSearch}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-3 py-2 rounded-xl"
                  >
                    إلغاء لجميع النتائج
                  </button>
                )}
              </form>
            </div>

            {/* If Admin view is toggled */}
            {adminMode && (
              <div className="bg-amber-500/10 border border-amber-300/40 p-4 rounded-xl" id="admin_mode_banner">
                <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm">
                  <Sliders className="h-4.5 w-4.5" />
                  <span>لوحة تحكم وتحرير المطور حسام (الوضع التجريبي النشط)</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1 lead-relaxed">
                  بصفتك المالك ومضيف الموقع، تستطيع استعراض كافة اجتماعات الزوار وحالاتها، تعديل التاريخ أو الوقت والرد فورياً بـ "ملاحظات وتوجيهات المبرمج" لمساعدة العميل قبل اللقاء.
                </p>
              </div>
            )}

            {/* Meetings Lists Display */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Meetings Catalog Picker list */}
              <div className="lg:col-span-1 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs px-1">
                  {hasSearched ? `نتائج البحث عن الحجوزات للمطابقة (${searchedMeetings.length})` : adminMode ? `جميع طلبات الاجتماع الواردة (${meetings.length})` : `أحدث حجوزات الزوار المتاحة (${meetings.length})`}
                </h4>

                {isMeetingsLoading ? (
                  <div className="space-y-3">
                    <div className="bg-white p-4 h-18 rounded-xl border animate-pulse"></div>
                    <div className="bg-white p-4 h-18 rounded-xl border animate-pulse"></div>
                  </div>
                ) : (hasSearched ? searchedMeetings : meetings).length === 0 ? (
                  <div className="text-center p-8 bg-white border border-slate-200 rounded-2xl">
                    <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-bold">لم نجد أي حجز متوافق مع البريد الإلكتروني.</p>
                    <p className="text-[10px] text-slate-400 mt-1">يرجى التأكد من كتابة البريد تماماً كما تم إدخاله في طلب الحجز.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {(hasSearched ? searchedMeetings : meetings).map((m) => {
                      const isActiveEditor = selectedMeetingForNotes?.id === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => handleOpenMeetingEditor(m)}
                          className={`p-4 rounded-xl border border-slate-200 cursor-pointer transition-all ${
                            isActiveEditor 
                              ? "bg-emerald-50/60 border-emerald-400 shadow-xs" 
                              : "bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-bold">{m.meetingDate}</span>
                            
                            {/* Status badge */}
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                              m.status === "scheduled" ? "bg-emerald-100 text-emerald-800" :
                              m.status === "completed" ? "bg-blue-100 text-blue-800" :
                              m.status === "canceled" ? "bg-red-100 text-red-800" :
                              "bg-amber-100 text-amber-800"
                            }`}>
                              {m.status === "scheduled" ? "مؤكد 📅" :
                               m.status === "completed" ? "تم الاجتماع ✅" :
                               m.status === "canceled" ? "ملغى ❌" :
                               "انتظار ⏳"}
                            </span>
                          </div>

                          <h5 className="font-extrabold text-slate-900 text-xs truncate mt-1.5">{m.serviceTitle}</h5>
                          
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 border-t border-slate-100 pt-2">
                            <span className="font-semibold text-slate-700">{m.clientName}</span>
                            <span>{m.meetingTime}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Active Booking details card */}
              <div className="lg:col-span-2">
                {selectedMeetingForNotes ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold">رقم مرجع الموعد: {selectedMeetingForNotes.id}</span>
                        <h4 className="font-black text-slate-950 text-base mt-0.5">{selectedMeetingForNotes.serviceTitle}</h4>
                        <div className="flex flex-wrap items-center mt-1.5 gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            <span>العميل: {selectedMeetingForNotes.clientName}</span>
                          </span>
                          <span className="flex items-center gap-1 text-left text-xxs">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{selectedMeetingForNotes.clientEmail}</span>
                          </span>
                        </div>
                      </div>

                      {adminMode && (
                        <button
                          onClick={() => handleDeleteMeeting(selectedMeetingForNotes.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                          title="حذف هذا الموعد نهائياً"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">حذف الموعد</span>
                        </button>
                      )}
                    </div>

                    {/* Schedule times block */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs font-bold text-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-normal">موعد الاجتماع</span>
                        <p className="mt-0.5 text-slate-900 flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-emerald-600" />
                          <span>{selectedMeetingForNotes.meetingDate}</span>
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-normal">فترة الحضور المفضلة</span>
                        <p className="mt-0.5 text-slate-900 flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-emerald-600" />
                          <span>{selectedMeetingForNotes.meetingTime}</span>
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-normal">رابط الاجتماع</span>
                        {selectedMeetingForNotes.status === "scheduled" ? (
                          <a 
                            href="https://meet.google.com/new" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="mt-0.5 text-emerald-600 font-bold hover:underline flex items-center gap-1"
                          >
                            <Video className="h-4 w-4 text-emerald-500 animate-pulse" />
                            <span>google.meet/live-call ↗</span>
                          </a>
                        ) : (
                          <span className="mt-0.5 text-slate-500 font-medium flex items-center gap-1">
                            <Database className="h-4 w-4" />
                            <span>يظهر عند تأكيد الموعد</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Problem detailed text */}
                    <div>
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <span>بيان المشكلة أو الطلب الفني المعروض</span>
                      </span>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                        {selectedMeetingForNotes.problemDescription}
                      </div>
                    </div>

                    {/* AI Consultation Report */}
                    {selectedMeetingForNotes.aiConsultation && (
                      <div className="bg-emerald-950/5 p-5 border border-emerald-500/20 rounded-xl space-y-4">
                        <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-xs">
                          <Sparkles className="h-4 w-4" />
                          <span>تقرير الاستشارة المسبق بالذكاء الاصطناعي Google Gemini</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                          <div className="bg-white p-3.5 rounded-lg border border-emerald-600/10">
                            <span className="text-[9px] font-black tracking-wider text-slate-400 block">التشخيص الفني المتوقع</span>
                            <p className="mt-1 text-slate-800 font-medium">{selectedMeetingForNotes.aiConsultation.techAnalysis}</p>
                          </div>
                          <div className="bg-white p-3.5 rounded-lg border border-emerald-600/10">
                            <span className="text-[9px] font-black tracking-wider text-slate-400 block">متطلبات التحضير المطلوبة منك</span>
                            <p className="mt-1 text-slate-800 font-medium">{selectedMeetingForNotes.aiConsultation.requiredPreparation}</p>
                          </div>
                          <div className="bg-white p-3.5 rounded-lg border border-emerald-600/10 md:col-span-2">
                            <span className="text-[9px] font-black tracking-wider text-slate-400 block text-emerald-700">جدول مقترح للـ 45 دقيقة باللقاء</span>
                            <p className="mt-1 text-slate-800 font-medium">{selectedMeetingForNotes.aiConsultation.proposedAgenda}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-100/40 text-xxs font-black">
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded">الصعوبة: {selectedMeetingForNotes.aiConsultation.estimatedComplexity}</span>
                          <span className="bg-emerald-600 text-white px-2 py-0.5 rounded">الميزانية السوقية: {selectedMeetingForNotes.aiConsultation.estimatedCost}</span>
                        </div>
                      </div>
                    )}

                    {/* Developer notes update */}
                    <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <MessageSquare className="h-4 w-4 text-emerald-600" />
                          <span>ملاحظات وتوجيهات وتأكيدات المطور</span>
                        </span>
                        {!adminMode && (
                          <span className="text-[10px] text-slate-400 font-semibold italic">يتحكم بها المطور</span>
                        )}
                      </div>

                      {adminMode ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-black mb-1">تعديل حالة الموعد</label>
                              <select
                                value={tempStatus}
                                onChange={(e) => setTempStatus(e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs focus:ring-1 focus:ring-amber-500"
                              >
                                <option value="pending">قيد الانتظار لمقابلة حسام ⏳</option>
                                <option value="scheduled">تأكيد الموعد وإضافة رابط اللقاء 📅</option>
                                <option value="completed">تم إنهاء اللقاء وتحديد الحل بنجاح ✅</option>
                                <option value="canceled">إلغاء الموعد بناء على الرغبة ❌</option>
                              </select>
                            </div>
                            <div className="text-right flex items-end justify-end">
                              <button
                                onClick={handleUpdateMeetingStatus}
                                disabled={isUpdatingMeeting}
                                className="bg-amber-600 text-white font-extrabold text-xs px-5 h-9 rounded-lg hover:bg-amber-700 transition"
                              >
                                {isUpdatingMeeting ? "جاري التحديث..." : "حفظ التغييرات في الموعد ✔"}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black mb-1">ملاحظات وتوصيات المطور للعميل</label>
                            <textarea
                              rows={3}
                              placeholder="اكتب هنا رداً أو توجيهات للعميل أو تفاصيل الرابط للتواصل معه..."
                              value={tempNotes}
                              onChange={(e) => setTempNotes(e.target.value)}
                              className="w-full p-2.5 border rounded-lg text-xs font-sans focus:ring-1 focus:ring-amber-500"
                            ></textarea>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs leading-relaxed text-slate-700 bg-white p-4 rounded-lg border border-slate-100">
                          {selectedMeetingForNotes.notes ? (
                            <p className="font-semibold text-slate-800">{selectedMeetingForNotes.notes}</p>
                          ) : (
                            <p className="text-slate-400 italic">في انتظار مراجعة المطور وتأكيد الموعد النهائي وإدراج ملاحظات اللقاء.</p>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="bg-white border rounded-2xl p-10 text-center text-slate-400 h-full flex flex-col justify-center items-center">
                    <Calendar className="h-16 w-16 text-slate-200 mb-4 animate-bounce duration-1000" />
                    <h5 className="font-extrabold text-slate-800 text-sm">لم يتم تحديد اجتماع للمطالعة</h5>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">اختر أحد مواعيد الاجتماعات المجدولة في القائمة الجانبية لقراءة تفاصيل الاستشارة والتحضيرات المطلوبة.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: DIRECT GEMINI SPECFIC ERROR LOG CLINIC */}
        {activeTab === "diagnose" && (
          <div id="bug_clinic_diagnose_view" className="space-y-6 max-w-4xl mx-auto">
            
            {/* Header / Description */}
            <div className="border-b border-slate-200 pb-5">
              <h3 className="text-xl font-extrabold tracking-tight text-slate-950">طبيب الأكواد واستكشاف الأعطال الفوري 🧬</h3>
              <p className="text-xs text-slate-500">انسخ والصق الكود المعطل، أو خطأ الـ CORS، أو مشاكل الـ API والحظر، وسيقوم الذكاء الاصطناعي بتشخيصها فوراً وتوفير 3 حلول مقترحة.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <form onSubmit={handleAIBugDiagnose} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1.5">
                    ألصق سجل الأخطاء (Log) أو الكود البرمجي المتعطل *
                  </label>
                  <textarea
                    required
                    rows={7}
                    placeholder="مثال: TypeError: Cannot read properties of undefined (reading 'map') أو خطأ CORS أو مشاكل الاتصال بقاعدة البيانات..."
                    value={troubleInput}
                    onChange={(e) => setTroubleInput(e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500/80 leading-relaxed bg-slate-950 text-emerald-400 text-left"
                    dir="ltr"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  id="diagnose_execute_btn"
                  disabled={isDiagnosing}
                  className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isDiagnosing ? (
                    <>
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                      <span>جاري تشغيل محاكاة تشخيص الأكواد وفك الغموض البرمجي...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="h-4.5 w-4.5" />
                      <span>ابحث عن العطل وقدم تشخيصاً ذكياً فورياً ✦</span>
                    </>
                  )}
                </button>
              </form>

              {/* REPORT CARD */}
              {troubleReport && (
                <div className="bg-emerald-950/5 border-2 border-emerald-500/35 p-6 rounded-2xl space-y-5 animate-fadeIn">
                  
                  {/* Root cause */}
                  <div>
                    <span className="text-[10px] text-emerald-700 font-black block uppercase tracking-wider mb-1">السبب المحتمل للجذر (Root Cause)</span>
                    <p className="text-xs font-bold text-slate-800 leading-relaxed">{troubleReport.rootCause}</p>
                  </div>

                  {/* Remedial Steps */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wider">خطوات العلاج وصيانة المشكلة برمجياً</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-emerald-500/10 hover:border-emerald-500/40 transition">
                        <span className="inline-block text-[11px] font-black uppercase text-emerald-600 mb-1">الخطوة الأولى ❶</span>
                        <p className="text-xs text-slate-700 leading-relaxed">{troubleReport.remedyOne}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl border border-emerald-500/10 hover:border-emerald-500/40 transition">
                        <span className="inline-block text-[11px] font-black uppercase text-emerald-600 mb-1">الخطوة الثانية ❷</span>
                        <p className="text-xs text-slate-700 leading-relaxed">{troubleReport.remedyTwo}</p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-emerald-500/10 hover:border-emerald-500/40 transition">
                        <span className="inline-block text-[11px] font-black uppercase text-emerald-600 mb-1">الخطوة الثالثة ❸</span>
                        <p className="text-xs text-slate-700 leading-relaxed">{troubleReport.remedyThree}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats and meeting offer */}
                  <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/50 pt-5 gap-4">
                    <div className="flex gap-4 text-xs font-bold text-slate-800">
                      <div>
                        <span className="text-[9px] text-slate-400 block">الصعوبة المقدرة</span>
                        <span className="bg-slate-100 px-2.5 py-0.5 rounded text-slate-700 block mt-1">{troubleReport.remedyDifficulty}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block">تكلفة الإصلاح بالمتوسط</span>
                        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded block mt-1">{troubleReport.remedyPrice}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-slate-500 max-w-xs text-right leading-snug">هل المشكلة صعبة للغاية وتفضل أن يحلها حسام بشكل مباشر؟ احجز موعد لقاء للاستشفاء الفوري.</p>
                      <button
                        onClick={() => {
                          const repairService = services.find(s => s.id === "s2") || services[0];
                          if (repairService) handleSelectServiceAndRedirect(repairService);
                        }}
                        className="bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition"
                      >
                        حجز اجتماع لحل المشكلة 🗓️
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* SERVICE MODAL BLOCK (ADMIN SIMULATION FEATURE) */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-xl space-y-4 text-right">
            
            <div className="flex items-center justify-between border-b border-rose-200 pb-3">
              <h4 className="font-extrabold text-slate-950 text-base">إدراج خدمة تقنية جديدة للكتالوج (المطور)</h4>
              <button 
                onClick={() => setShowAddServiceModal(false)}
                className="text-slate-400 hover:text-slate-900 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewService} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الخدمة الجديدة</label>
                <input 
                  type="text"
                  required
                  placeholder="مثال: دمج بوابات الدفع تابي وتمارا بالمتاجر"
                  value={newServiceForm.title}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, title: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الفئة</label>
                <select
                  value={newServiceForm.category}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, category: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="بناء مواقع متكاملة">بناء وتطوير مواقع متكاملة</option>
                  <option value="تصليح أعطال وصيانة">تصليح أعطال وصيانة برمجية</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">شرح مفصل ومحفز للخدمة</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="شرح واف للزوار لكيفية تقديم الخدمة..."
                  value={newServiceForm.description}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعر المبدئي بالدولار</label>
                  <input 
                    type="number"
                    required
                    value={newServiceForm.priceStart}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, priceStart: e.target.value })}
                    className="w-full p-2 border rounded-lg text-left"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">أيام الفحص والإنجاز</label>
                  <input 
                    type="number"
                    required
                    value={newServiceForm.deliveryDays}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, deliveryDays: e.target.value })}
                    className="w-full p-2 border rounded-lg text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المزايا البرمجية المرفقة (ميزة بكل سطر)</label>
                <textarea 
                  rows={3}
                  placeholder="تصميم متكامل بالماجيك واير&#10;تأطير حزمة الـ CORS سحابياً&#10;لوحة تتبع شاملة"
                  value={newServiceForm.features}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, features: e.target.value })}
                  className="w-full p-2 border rounded-lg leading-relaxed"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isCreatingService}
                className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-extrabold p-2.5 rounded-xl transition"
              >
                {isCreatingService ? "جاري الحفظ سحابياً..." : "نشر الخدمة في الكتالوج الآن ✔"}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* DEVELOPER SECURE LOGIN MODAL */}
      {showDeveloperLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 text-right">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-amber-500 text-white rounded-lg flex items-center justify-center">
                  <Sliders className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-extrabold text-slate-950 text-base">بوابة دخول المطور المعتمد</h4>
              </div>
              <button 
                onClick={() => setShowDeveloperLoginModal(false)}
                className="text-slate-400 hover:text-slate-900 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              هذا القسم مغلق ومحمي بكلمة مرور مخصصة لمطور المنصة وصاحبها فقط. يرجى إدخال بريدك وبيانات الحماية للمتابعة إلى الإدارة.
            </p>

            <form onSubmit={handleDeveloperLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">البريد الإلكتروني للمطور</label>
                <input 
                  type="email"
                  required
                  placeholder="chakerm811@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-left font-mono focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">كلمة السر الخاصة بك</label>
                <input 
                  type="password"
                  required
                  placeholder="•••••••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-left font-mono focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xxs font-bold rounded-xl flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Secure Developer Hint / Tooltip for testing reference */}
              <div className="p-3 bg-amber-50/60 border border-amber-100 text-amber-900 rounded-xl space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-xxs text-amber-800">
                  <Info className="h-3.5 w-3.5" />
                  بيانات تجربة الدخول السريع:
                </span>
                <p className="text-[10px] text-amber-900 font-medium">
                  البريد: <span className="font-mono bg-white px-1 py-0.5 rounded font-bold border border-amber-200 font-sans">chakerm811@gmail.com</span>
                </p>
                <p className="text-[10px] text-amber-900 font-medium">
                  كلمة المرور: <span className="font-mono bg-white px-1 py-0.5 rounded font-bold border border-amber-200 font-sans">chakerm811</span>
                </p>
              </div>

              <div className="flex gap-2 pt-1 font-sans">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Check className="h-4 w-4" />
                  <span>تأكيد الهوية والدخول 🔓</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeveloperLoginModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition"
                >
                  إلغاء
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* FOOTER BRANDS */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-extrabold text-slate-300">
            مستقل تك ✦ نظام حجز واستشارات المبرمج م. حسام محمد © 2026
          </p>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
            موقع تفاعلي ذكي كامل مبني بـ React و Node.js (Express) مدعوماً بقاعدة بيانات MongoDB لحفظ وجدولة حزم اللقاءات وتحليلات Google Gemini الذكية.
          </p>
        </div>
      </footer>

    </div>
  );
}
