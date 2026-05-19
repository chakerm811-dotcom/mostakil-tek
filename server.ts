import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
const app = express();
app.use(express.json());

// Initialize Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initialized successfully!");
  } catch (err) {
    console.error("Failed to initialize Gemini API:", err);
  }
} else {
  console.log("Warning: GEMINI_API_KEY is not defined. AI features will run in mockup mode.");
}

// Ensure local data directory exists for file database fallback
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.join(DATA_DIR, "db.json");

// DB initial preloaded structures for personalized services & booking meetings
const developerProfile = {
  name: "م. حسام محمد",
  title: "مطور برمجيات متكامل (Full-Stack Developer) ومستشار حلول سحابية",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  bio: "أساعد الشركات والمبتكرين في تحويل أفكارهم إلى مواقع وتطبيقات حقيقية قوية سريعة، وإصلاح أصعب المشاكل البرمجية وقواعد بيانات MongoDB.",
  telegram: "@dev_hossam",
  email: "hossam.dev@example.com",
  skills: ["React / Vite", "Node.js (Express)", "MongoDB", "تحسين الأداء وصيانة الأعطال", "أمن التطبيقات", "APIs Integration"]
};

const defaultServices = [
  {
    id: "s1",
    title: "بناء وتطوير مواقع وتطبيقات ويب متكاملة (Web Apps)",
    category: "بناء مواقع متكاملة",
    description: "تطوير تطبيق ويب كامل حديث من الصفر باستخدام React للواجهات والسرعة الفائقة، مع خلفية Node.js وقاعدة بيانات MongoDB لحفظ وإدارة البيانات بسلاسة وأعلى درجات الأمان.",
    priceStart: 450,
    deliveryDays: 10,
    features: ["تصميم متجاوب بالكامل", "لوحة تحكم للمحتوى والعملاء", "أكواد برمجية نظيفة وقابلة للتطوير", "ربط بوابات الدفع والخدمات الخارجية"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600"
  },
  {
    id: "s2",
    title: "تشخيص وإصلاح كافة الأعطال الفنية والبرمجية (Debugging & Hotfixes)",
    category: "تصليح أعطال وصيانة",
    description: "هل يعاني موقعك من أخطاء في الكود؟ أو تواجه توقفاً مفاجئاً وتحتاج إلى حل إسعافي سريع؟ سأقوم بفحص كامل للكود واستكشاف الأخطاء وربط الثغرات وحل مشاكل الـ APIs في ظرف ساعات.",
    priceStart: 80,
    deliveryDays: 1,
    features: ["تتبع سجلات الأخطاء Log Analysis", "حل فوري لمشاكل الـ NPM والتبعيات", "تأمين وحظر الثغرات الأمنية", "تسليم تقرير بالتعديلات المنفذة"],
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600"
  },
  {
    id: "s3",
    title: "برمجة وبناء المتاجر الإلكترونية الاحترافية والمدفوعات",
    category: "بناء مواقع متكاملة",
    description: "إنشاء وتصميم متجر إلكتروني جذاب يتيح تصفح المنتجات، إضافتها للسلة، تسجيل المشترين، والاتصال المباشر لإدارة الطلبات مع دمج وسائط الشحن والتحصيل والدفع.",
    priceStart: 600,
    deliveryDays: 14,
    features: ["نظام كوبونات وعروض خصم ذكي", "إدارة المخزون والتصنيفات بسهولة", "تقارير مبيعات تفاعلية وسريعة", "إنشاء فواتير إلكترونية تلقائية"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600"
  },
  {
    id: "s4",
    title: "تحسين سرعة قواعد بيانات MongoDB وضبط الاستعلامات المعقدة",
    category: "تصليح أعطال وصيانة",
    description: "تسريع استعلامات قاعدة بياناتك (Queries Optimizer)، تخطيط الفهارس (Indexes)، وضبط ملف الإعدادات للتعامل بمرونة مع مئات آلاف البيانات اليومية دون إجهاد السيرفر.",
    priceStart: 150,
    deliveryDays: 3,
    features: ["تخطيط الفهارس المناسبة Indexes Layout", "إعادة هيكلة البيانات البطيئة وثيقة بوثيقة", "حل مشاكل الإغلاق المؤقت المتبادل Locks", "نسخ احتياطي واستعادة فورية مستقرة"],
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600"
  }
];

const defaultMeetings = [
  {
    id: "m1",
    serviceId: "s2",
    serviceTitle: "تشخيص وإصلاح كافة الأعطال الفنية والبرمجية (Debugging & Hotfixes)",
    clientName: "عبد الله المالكي",
    clientEmail: "abdallah@example.com",
    clientPhone: "+966501234567",
    meetingDate: "2026-05-22",
    meetingTime: "04:30 مساءً",
    problemDescription: "لدينا تطبيق مبني بـ Express و React يعاني من خطأ CORS متكرر عند استدعاء بوابة الدفع، بالإضافة إلى تباطؤ غريب يستغرق 8 ثوانٍ عند تحميل صفحة منتجات سلة الشراء.",
    status: "scheduled",
    notes: "تم تجهيز بيئة التطوير لتتبع الاتصال مع بوابة الدفع، وسنناقش خطة ترقية إصدار السيرفر.",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    aiConsultation: {
      techAnalysis: "خطأ CORS ينبع غالباً من غياب تهيئة middleware CORS بشكل سليم على السيرفر أو اختلاف الدومين بين الواجهة والباكيند. بينما تباطؤ المنتجات لمدة 8 ثوانٍ يدل على نقص فهارس (Indexes) في استعلام MongoDB أو تكرار الاستعلام العشري (N+1 query problem).",
      proposedAgenda: "1. تفعيل حزمة CORS بشكل صحيح برمجياً (10 دقائق) / 2. عمل Profiling لاستعلامات MongoDB وتحديد الخلل (20 دقيقة) / 3. اقتراح حلول الكاشينغ الفنية (10 دقائق)",
      requiredPreparation: "يرجى تجهيز حساب Git ومستندات ربط بوابة الدفع وصلاحية للولوج لقاعدة بيانات MongoDB التجريبية.",
      estimatedComplexity: "متوسط",
      estimatedCost: "$120 - $180"
    }
  },
  {
    id: "m2",
    serviceId: "s1",
    serviceTitle: "بناء وتطوير مواقع وتطبيقات ويب متكاملة (Web Apps)",
    clientName: "منى خالد",
    clientEmail: "muna@example.com",
    clientPhone: "+966509988771",
    meetingDate: "2026-05-24",
    meetingTime: "11:00 صباحاً",
    problemDescription: "نريد بناء منصة تعليمية مصغرة لتقديم دورات تدريبية مع نظام اشتراكات شهري، بوابات دفع تفاعلية، ولوحة تحكم لإضافة الفيديوهات والملفات واختبارات قياس قصيرة.",
    status: "pending",
    notes: "",
    createdAt: new Date().toISOString(),
    aiConsultation: {
      techAnalysis: "المنصة تتطلب هيكلية مستقرة لحفظ مقاطع الفيديو والملفات الكبيرة (مثل AWS S3 أو Firebase Storage)، مع نظام تعقب تقدم المستخدمين في المستندات البرمجية وحالة الاشتراكات وقاعدة بيانات Mongo قوية.",
      proposedAgenda: "1. استعراض متطلبات وسعة الفيديوهات وطرق حمايتها من التحميل غير المصرح (15 دقيقة) / 2. اختيار نظام معالجة الاشتراكات وطرق تأمين البيانات (15 دقيقة) / 3. رسم الهيكل الأولي لربط React بالباكيند (15 دقيقة)",
      requiredPreparation: "تجهيز قائمة بالدورات والملفات المتاحة حالياً، مع تحديد بوابات الدفع المفضلة بالمنطقة.",
      estimatedComplexity: "متقدم",
      estimatedCost: "$500 - $850"
    }
  }
];

// In-Memory fallback database & local persistence structure
class LocalJSONDatabase {
  public data: {
    services: any[];
    meetings: any[];
  };

  constructor() {
    this.data = {
      services: [...defaultServices],
      meetings: [...defaultMeetings]
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(fileContent);
        this.data = {
          services: parsed.services || [...defaultServices],
          meetings: parsed.meetings || [...defaultMeetings]
        };
        console.log("Local JSON Database loaded successfully.");
      } else {
        this.save();
      }
    } catch (err) {
      console.error("Failed to load local db file, utilizing in-memory initial state:", err);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to save database state to file:", err);
    }
  }

  async find(collection: keyof typeof this.data, query: any = {}) {
    let list = this.data[collection] || [];
    return list.filter(item => {
      for (const [key, val] of Object.entries(query)) {
        if (item[key] !== val) return false;
      }
      return true;
    });
  }

  async findOne(collection: keyof typeof this.data, query: any) {
    const list = await this.find(collection, query);
    return list[0] || null;
  }

  async insertOne(collection: keyof typeof this.data, doc: any) {
    if (!doc.id && !doc._id) {
      doc.id = "m_" + Math.random().toString(36).substring(2, 11);
    }
    this.data[collection].push(doc);
    this.save();
    return doc;
  }

  async updateOne(collection: keyof typeof this.data, query: any, update: any) {
    const item = await this.findOne(collection, query);
    if (item) {
      const idx = this.data[collection].indexOf(item);
      const updatedFields = update.$set || update;
      this.data[collection][idx] = { ...item, ...updatedFields };
      this.save();
      return true;
    }
    return false;
  }

  async deleteOne(collection: keyof typeof this.data, query: any) {
    const item = await this.findOne(collection, query);
    if (item) {
      const idx = this.data[collection].indexOf(item);
      this.data[collection].splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }
}

const localDB = new LocalJSONDatabase();

// MongoDB real driver connection
const MONGODB_URI = process.env.MONGODB_URI;
let mongoClient: MongoClient | null = null;
let useRealMongo = false;

if (MONGODB_URI) {
  try {
    mongoClient = new MongoClient(MONGODB_URI);
    mongoClient.connect().then(async (client) => {
      console.log("Successfully connected to real MongoDB instance!");
      useRealMongo = true;
      const dbInstance = client.db();
      
      const seedCollection = async (collName: string, items: any[]) => {
        const count = await dbInstance.collection(collName).countDocuments();
        if (count === 0) {
          await dbInstance.collection(collName).insertMany(items);
          console.log(`Seeded MongoDB collection "${collName}" with default items.`);
        }
      };

      await seedCollection("services", defaultServices);
      await seedCollection("meetings", defaultMeetings);
    }).catch(err => {
      console.error("Could not connect to MongoDB URI. Falling back gracefully to persistent JSON file Database: ", err.message);
    });
  } catch (err) {
    console.error("Error creating Mongo client target. Fallback on file database:", err);
  }
} else {
  console.log("No MONGODB_URI found in env. Utilizing persistent local JSON file adapter.");
}

// Global abstraction for DB Collection operations
const dbAdapter = {
  async collection(name: "services" | "meetings") {
    if (useRealMongo && mongoClient) {
      const coll = mongoClient.db().collection(name);
      return {
        find: async (query = {}) => {
          return await coll.find(query).toArray();
        },
        findOne: async (query: any) => {
          return await coll.findOne(query);
        },
        insertOne: async (doc: any) => {
          const res = await coll.insertOne({ ...doc });
          return { id: res.insertedId.toString(), ...doc };
        },
        updateOne: async (query: any, update: any) => {
          const res = await coll.updateOne(query, update);
          return res.modifiedCount > 0;
        },
        deleteOne: async (query: any) => {
          const res = await coll.deleteOne(query);
          return res.deletedCount > 0;
        }
      };
    } else {
      return {
        find: async (query = {}) => await localDB.find(name, query),
        findOne: async (query: any) => await localDB.findOne(name, query),
        insertOne: async (doc: any) => await localDB.insertOne(name, doc),
        updateOne: async (query: any, update: any) => await localDB.updateOne(name, query, update),
        deleteOne: async (query: any) => await localDB.deleteOne(name, query),
      };
    }
  }
};

// 3. Fetch Developer Profile
app.get("/api/developer-profile", (req, res) => {
  res.json(developerProfile);
});

// 4. Create service dynamically
app.post("/api/services", async (req, res) => {
  try {
    const { title, category, description, priceStart, deliveryDays, features, image } = req.body;
    if (!title || !description || !priceStart) {
      return res.status(400).json({ error: "الرجاء توفير كافة البيانات الأساسية للخدمة!" });
    }
    const coll = await dbAdapter.collection("services");
    const newService = {
      title,
      category: category || "بناء مواقع متكاملة",
      description,
      priceStart: parseInt(priceStart) || 100,
      deliveryDays: parseInt(deliveryDays) || 5,
      features: Array.isArray(features) ? features : [features],
      image: image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600"
    };
    const saved = await coll.insertOne(newService);
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Fetch all meetings
app.get("/api/meetings", async (req, res) => {
  try {
    const coll = await dbAdapter.collection("meetings");
    const m = await coll.find();
    // Sort by scheduled date or newest
    m.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    res.json(m);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Book a new meeting with immediate AI issue diagnosis
app.post("/api/meetings", async (req, res) => {
  try {
    const { serviceId, serviceTitle, clientName, clientEmail, clientPhone, meetingDate, meetingTime, problemDescription } = req.body;
    
    if (!clientName || !clientEmail || !problemDescription || !meetingDate || !meetingTime) {
      return res.status(400).json({ error: "الرجاء ملء جميع الحقول الإجبارية لحجز موعد الاجتماع!" });
    }

    let aiConsultation = {
      techAnalysis: "سيتم مراجعة المشكلة والبرمجيات المذكورة بالتفصيل خلال اللقاء المرئي وصياغة خارطة طريق واضحة.",
      proposedAgenda: "1. ترحيب وتعارف (5 د) / 2. استعراض الكود وقراءة سجل الأخطاء (20 د) / 3. رسم خطة الإصلاح وتحديد الميزانية المناسبة (15 د)",
      requiredPreparation: "يرجى تجهيز ومشاركة الكود المصدري مسبقاً، أو تهيئة صلاحيات الوصول لمنصة الاستضافة وقاعدة البيانات الخاصة بك.",
      estimatedComplexity: "متوسط",
      estimatedCost: "$100$"
    };

    // Server-side AI generator: Gemini examines the problem statement to offer a bespoke consulting checklist!
    if (ai) {
      try {
        const prompt = `أنت المهندس التقني المحترف "حسام محمد" مستشار تطوير البرمجيات وحل المشاكل الفنية.
لقد قام عميل واسمه "${clientName}" بحجز اجتماع معك بخصوص الخدمة: "${serviceTitle || "مراجعة فنية وعلاج أعطال"}".
العميل طرح تفاصيل مشكلته كالتالي:
"${problemDescription}"

الاجتماع مجدول في تاريخ ${meetingDate} في تمام الساعة ${meetingTime}.

بصفتك مستشاراً خبيراً، قم بتحليل المشكلة بالكامل وصياغة تقرير أولي دقيق جداً لمساعدته قبل المكالمة. 
يجب أن ترجع الإجابة حَصرياً بصيغة JSON نظيفة، باللغة العربية، وتحتوي حصراً وتحديداً على الحقول التالية:
- techAnalysis: تحليل تقني للمشكلة والأسباب المحتملة (نص غني ودافئ سطرين)
- proposedAgenda: جدول أعمال مقترح للاجتماع مقسم بالدقائق لترتيب وقت اللقاء (سطر واحد)
- requiredPreparation: متطلبات يجب على العميل تحضيرها أو إحضارها معه للاجتماع (مثل: تجهيز حساب غيت هاب، ملفات معينة، إلخ)
- estimatedComplexity: مستوى الصعوبة التقديري للمشكلة (بسيط، متوسط، متقدم)
- estimatedCost: تقدير التكلفة التقريبية لإيجاد وتثبيت حل جذري في السوق (مثلا: "80 - 150 دولار")

تذكر: اكتب JSON صالح للتحليل ومكتوب باللغة العربية الفصحى الدافئة والاحترافية.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.8,
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          aiConsultation = {
            techAnalysis: parsed.techAnalysis || aiConsultation.techAnalysis,
            proposedAgenda: parsed.proposedAgenda || aiConsultation.proposedAgenda,
            requiredPreparation: parsed.requiredPreparation || aiConsultation.requiredPreparation,
            estimatedComplexity: parsed.estimatedComplexity || aiConsultation.estimatedComplexity,
            estimatedCost: parsed.estimatedCost || aiConsultation.estimatedCost
          };
        }
      } catch (aiErr) {
        console.error("Gemini failed to generate bespoke consultation analysis flow:", aiErr);
      }
    }

    const coll = await dbAdapter.collection("meetings");
    const newMeeting = {
      serviceId: serviceId || "custom",
      serviceTitle: serviceTitle || "استشارة برمجية عامة",
      clientName,
      clientEmail,
      clientPhone: clientPhone || "غير متوفر",
      meetingDate,
      meetingTime,
      problemDescription,
      status: "pending",
      notes: "",
      createdAt: new Date().toISOString(),
      aiConsultation
    };

    const saved = await coll.insertOne(newMeeting);
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Update meeting (add notes, reschedule, change status)
app.patch("/api/meetings/:id", async (req, res) => {
  try {
    const { status, notes, meetingDate, meetingTime } = req.body;
    const coll = await dbAdapter.collection("meetings");
    
    const existing = await coll.findOne({ id: req.params.id });
    if (!existing) {
      return res.status(404).json({ error: "الموعد غير موجود!" });
    }

    const updateFields: any = {};
    if (status !== undefined) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;
    if (meetingDate !== undefined) updateFields.meetingDate = meetingDate;
    if (meetingTime !== undefined) updateFields.meetingTime = meetingTime;

    await coll.updateOne({ id: req.params.id }, { $set: updateFields });
    const updated = await coll.findOne({ id: req.params.id });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Delete / Cancel a meeting
app.delete("/api/meetings/:id", async (req, res) => {
  try {
    const coll = await dbAdapter.collection("meetings");
    const success = await coll.deleteOne({ id: req.params.id });
    if (success) {
      res.json({ message: "تم إلغاء الموعد المقترح بنجاح!" });
    } else {
      res.status(404).json({ error: "الموعد غير موجود!" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Custom Direct AI Troubleshooter / Diagnosis Endpoint
app.post("/api/ai/diagnose", async (req, res) => {
  try {
    const { errorText } = req.body;
    if (!errorText) {
      return res.status(400).json({ error: "الرجاء إدخال تفاصيل العطل أو المشكلة البرمجية!" });
    }

    let report = {
      rootCause: "عطل عام في الاتصال أو عدم ملاءمة التهيئة المطلوبة.",
      remedyOne: "تأكد من سلامة حزم npm وتناسق الإصدارات في package.json.",
      remedyTwo: "تأكد من تشغيل منفذ السيرفر المحلي بشكل صحيح والتثبت من سجل الأخطاء (Logs).",
      remedyThree: "افحص بيانات الاتصال وكلمة المرور الخاصة بقاعدة البيانات.",
      remedyPrice: "$50$ - $100",
      remedyDifficulty: "سهل"
    };

    if (ai) {
      try {
        const prompt = `أنت مهندس صيانة برمجيات خبير وأخصائي الحماية واستكشاف الأعطال (Debugger) في منصة "مستقل تك".
جاءك عميل يعاني من مشكلة فنية أو كود برمجي معطل كالتالي:
"${errorText}"

قم بتحليل المشكلة ببراعة وعمق، وقدم تشخيصاً تقنياً وحلولاً واضحة باللغة العربية بصيغة JSON تماماً ومباشرة دون أي نصوص إضافية خارج الـ JSON. الرد يجب أن يتألف حصراً من الحقول التالية:
- rootCause: شرح المشكلة الحقيقية بلغة عربية سلسلة مبسطة (السبب الجذري لبروز العطل)
- remedyOne: الخطوة العلاجية الفورية الأولى بوضوح
- remedyTwo: الخطوة العلاجية الثانية بوضوح
- remedyThree: الخطوة العلاجية الثالثة بوضوح
- remedyPrice: السعر المنطقي بالدولار لعرض مستقل لحل هذه المشكلة (مثل 40$ - 80$)
- remedyDifficulty: مستوى صعوبة إصلاحها (بسيط، متوسط، متقدم)`;

        const resAi = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.75
          }
        });

        if (resAi.text) {
          const parsed = JSON.parse(resAi.text.trim());
          report = {
            rootCause: parsed.rootCause || report.rootCause,
            remedyOne: parsed.remedyOne || report.remedyOne,
            remedyTwo: parsed.remedyTwo || report.remedyTwo,
            remedyThree: parsed.remedyThree || report.remedyThree,
            remedyPrice: parsed.remedyPrice || report.remedyPrice,
            remedyDifficulty: parsed.remedyDifficulty || report.remedyDifficulty
          };
        }
      } catch (e) {
        console.error("Gemini failed to diagnose standard flow error:", e);
      }
    }

    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// === VITE MIDDLEWARE CONFIGURATION FOR PRODUCTION & DEVELOPMENT ===

if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server starting on port ${PORT}...`);
  console.log("Ready to receive connections behind reverse proxy.");
});
}

startServer();
