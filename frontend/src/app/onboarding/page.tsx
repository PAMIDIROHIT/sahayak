"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Pill, ShieldCheck, Translate } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/hooks/useAppStore"

const TRANSLATIONS: Record<string, Record<string, string>> = {
  scan_title: {
    en: "Scan Your Medicines", hi: "दवाई की फ़ोटो लें", ta: "மருந்துகளை ஸ்கேன் செய்யுங்கள்", te: "మీ మందులను స్కాన్ చేయండి", kn: "ಔಷಧಿಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", ml: "മരുന്നുകൾ സ്കാൻ ചെയ്യുക", mr: "औषध स्कॅन करा", bn: "ওষুধ স্ক্যান করুন", gu: "દવાઓ સ્કેન કરો", pa: "ਦਵਾਈਆਂ ਸਕੈਨ ਕਰੋ"
  },
  scan_body: {
    en: "Just photograph your medicine strip or packet. SAHAYAK does the rest.", hi: "बस अपनी दवाई की strip या packet का फ़ोटो लें। SAHAYAK बाकी काम कर देगा।", ta: "உங்கள் மருந்து ஸ்ட்ரிப் அல்லது பாக்கெட்டை புகைப்படம் எடுங்கள். SAHAYAK மீதி செய்யும்.", te: "మీ మందుల స్ట్రిప్ లేదా ప్యాకెట్ ఫోటో తీయండి. SAHAYAK మిగతా చేస్తుంది.", kn: "ಔಷಧಿ ಸ್ಟ್ರಿಪ್ ಅಥವಾ ಪ್ಯಾಕೆಟ್ ಫೋಟೋ ತೆಗೆಯಿರಿ. SAHAYAK ಉಳಿದದ್ದನ್ನು ಮಾಡುತ್ತದೆ.", ml: "മരുന്ന് സ്ട്രിപ്പ് അല്ലെങ്കിൽ പാക്കറ്റ് ഫോട്ടോ എടുക്കുക. SAHAYAK ബാക്കി ചെയ്യും.", mr: "तुमच्या औषधाच्या स्ट्रिपचा किंवा पॅकेटचा फोटो काढा. SAHAYAK बाकी करेल.", bn: "আপনার ওষুধের স্ট্রিপ বা প্যাকেটের ছবি তুলুন। SAHAYAK বাকিটা করবে।", gu: "તમારી દવાની સ્ટ્રિપ કે પેકેટનો ફોટો લો. SAHAYAK બાકી કરશે.", pa: "ਆਪਣੀ ਦਵਾਈ ਦੀ ਸਟ੍ਰਿਪ ਜਾਂ ਪੈਕੇਟ ਦੀ ਫੋਟੋ ਲਓ। SAHAYAK ਬਾਕੀ ਕਰੇਗਾ।"
  },
  safety_title: {
    en: "Safety Check", hi: "सुरक्षा जाँच", ta: "பாதுகாப்பு சோதனை", te: "భద్రతా తనిఖీ", kn: "ಸುರಕ್ಷತಾ ಪರೀಕ್ಷೆ", ml: "സുരക്ഷാ പരിശോധന", mr: "सुरक्षा तपासणी", bn: "নিরাপত্তা পরীক্ষা", gu: "સલામતી તપાસ", pa: "ਸੁਰੱਖਿਆ ਜਾਂਚ"
  },
  safety_body: {
    en: "We check if your medicines are safe to take together, including Ayurvedic herbs.", hi: "हम जाँचते हैं कि दवाइयाँ एक साथ लेने पर कोई नुकसान तो नहीं। Ayurvedic herbs भी।", ta: "தீங்கான எதிர்வினைகளை சரிபார்க்கிறோம் — ஆயுர்வேத மூலிகைகளுடன் அலோபதி மருந்துகள் உட்பட.", te: "హానికరమైన పరస్పర చర్యలను తనిఖీ చేస్తాము — ఆయుర్వేద మూలికలతో అల్లోపతి మందులతో సహా.", kn: "ಹಾನಿಕಾರಕ ಪರಸ್ಪರ ಕ್ರಿಯೆಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತೇವೆ — ಆಯುರ್ವೇದ ಗಿಡಮೂಲಿಕೆಗಳೊಂದಿಗೆ ಅಲೋಪಥಿ ಔಷಧಿಗಳು ಸೇರಿದಂತೆ.", ml: "ദോഷകരമായ ഇടപെടലുകൾ പരിശോധിക്കുന്നു — ആയുർവേദ ഔഷധങ്ങളുമായി അലോപ്പതി മരുന്നുകൾ ഉൾപ്പെടെ.", mr: "हानिकारक परस्परसंवाद तपासतो — आयुर्वेदिक वनस्पतींसह ॲलोपॅथिक औषधे.", bn: "ক্ষতিকারক মিথস্ক্রিয়া পরীক্ষা করি — আয়ুর্বেদিক ভেষজ সহ অ্যালোপ্যাথিক ওষুধ।", gu: "હાનિકારક ક્રિયાપ્રતિક્રિયા તપાસીએ છીએ — આયુર્વેદિક ઔષધિઓ સાથે એલોપેથિક દવાઓ સહિત.", pa: "ਹਾਨੀਕਾਰਕ ਪ੍ਰਤੀਕ੍ਰਿਆਵਾਂ ਦੀ ਜਾਂਚ ਕਰਦੇ ਹਾਂ — ਆਯੁਰਵੈਦਿਕ ਜੜੀ-ਬੂਟੀਆਂ ਸਮੇਤ ਐਲੋਪੈਥਿਕ ਦਵਾਈਆਂ।"
  },
  language_title: {
    en: "In Your Language", hi: "आपकी भाषा में", ta: "உங்கள் மொழியில்", te: "మీ భాషలో", kn: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ", ml: "നിങ്ങളുടെ ഭാഷയിൽ", mr: "तुमच्या भाषेत", bn: "আপনার ভাষায়", gu: "તમારી ભાષામાં", pa: "ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ"
  },
  language_body: {
    en: "Get results in 10 Indian languages — clear and easy to understand.", hi: "Results 10 Indian languages में मिलते हैं — सरल और समझने योग्य।", ta: "10 இந்திய மொழிகளில் முடிவுகள் — தெளிவான மற்றும் எளிதில் புரிந்துகொள்ளக்கூடிய.", te: "10 భారతీయ భాషలలో ఫలితాలు — స్పష్టమైన మరియు అర్థమయ్యే.", kn: "10 ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಫಲಿತಾಂಶಗಳು — ಸ್ಪಷ್ಟ ಮತ್ತು ಅರ್ಥವಾಗುವ.", ml: "10 ഇന്ത്യൻ ഭാഷകളിൽ ഫലങ്ങൾ — വ്യക്തവും മനസ്സിലാക്കാൻ എളുപ്പവുമായ.", mr: "10 भारतीय भाषांमध्ये निकाल — स्पष्ट आणि समजण्यास सोपे.", bn: "10টি ভারতীয় ভাষায় ফলাফল — পরিষ্কার এবং সহজে বোঝার মতো।", gu: "10 ભારતીય ભાષાઓમાં પરિણામો — સ્પષ્ટ અને સમજવામાં સરળ.", pa: "10 ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਨਤੀਜੇ — ਸਪੱਸ਼ਟ ਤੇ ਸਮਝਣ ਵਿੱਚ ਆਸਾਨ।"
  },
  get_started: {
    en: "Get Started", hi: "शुरू करें", ta: "தொடங்குங்கள்", te: "ప్రారంభించండి", kn: "ಪ್ರಾರಂಭಿಸಿ", ml: "ആരംഭിക്കുക", mr: "सुरू करा", bn: "শুরু করুন", gu: "શરૂ કરો", pa: "ਸ਼ੁਰੂ ਕਰੋ"
  },
  next: {
    en: "Next", hi: "आगे", ta: "அடுத்து", te: "తదుపరి", kn: "ಮುಂದೆ", ml: "അടുത്തത്", mr: "पुढे", bn: "পরবর্তী", gu: "આગળ", pa: "ਅੱਗੇ"
  }
};

const SLIDES = [
  { icon: Pill, color: "text-primary", bg: "bg-primary/10", key: "scan" },
  { icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50", key: "safety" },
  { icon: Translate, color: "text-saffron", bg: "bg-amber-50", key: "language" },
] as const

export default function OnboardingPage() {
  const router = useRouter()
  const { language } = useAppStore()
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const lang = mounted ? language : "en"

  function t(key: string) {
    return TRANSLATIONS[key]?.[lang] || TRANSLATIONS[key]?.en || ""
  }

  function goNext() {
    if (current < SLIDES.length - 1) {
      setDirection(1)
      setCurrent((c) => c + 1)
    } else {
      router.push("/patient")
    }
  }

  const slide = SLIDES[current]
  const isLast = current === SLIDES.length - 1
  const Icon = slide.icon

  return (
    <div className="flex flex-col min-h-[100dvh] px-6 pb-8 pt-12">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-full h-[340px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] } }}
              exit={{ opacity: 0, x: -direction * 40, transition: { duration: 0.2 } }}
              className="flex flex-col items-center text-center w-full"
            >
              <div className={cn("w-28 h-28 rounded-3xl flex items-center justify-center mb-8", slide.bg)}>
                <Icon size={60} weight="duotone" className={slide.color} />
              </div>
              <h1 className="text-3xl font-bold font-indic text-foreground mb-3 leading-snug">
                {t(slide.key + "_title")}
              </h1>
              {lang !== "en" && (
                <p className="text-muted-foreground text-base mb-2">{TRANSLATIONS[slide.key + "_title"].en}</p>
              )}
              <p className="text-foreground text-lg leading-relaxed max-w-xs font-indic">
                {t(slide.key + "_body")}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
              className={cn("rounded-full transition-all duration-300", i === current ? "w-6 h-3 bg-primary" : "w-3 h-3 bg-border")}
              aria-label={Slide \`}
            />
          ))}
        </div>

        <Button onClick={goNext} className="w-full min-h-[64px] text-lg rounded-2xl font-semibold" size="lg">
          {isLast ? t("get_started") + " · Get Started" : t("next") + " → Next"}
        </Button>
      </div>
    </div>
  )
}
