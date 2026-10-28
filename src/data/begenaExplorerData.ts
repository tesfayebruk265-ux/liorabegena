export interface BegenaPartInfo {
  id: string;
  nameEn: string;
  nameAm: string;
  phoneticAm?: string;
  category: 'structure' | 'acoustic' | 'tuning' | 'strings' | 'ornament';
  functionEn: string;
  functionAm: string;
  locationEn: string;
  locationAm: string;
  learningTipEn: string;
  learningTipAm: string;
  descriptionEn?: string;
  descriptionAm?: string;
  isVerified: boolean;
  verificationBadge: string;
  teacherNotes?: string;
  spiritualMeaningEn?: string;
  spiritualMeaningAm?: string;
  cameraFocus: {
    target: [number, number, number];
    position: [number, number, number];
  };
  audioPitchHz?: number;
  noteName?: string;
  stringNumber?: number;
  scaleMode?: string;
}

export const BEGENA_PARTS: BegenaPartInfo[] = [
  // 1. SOUNDBOX (RESONATOR CHAMBER)
  {
    id: 'soundbox',
    nameEn: 'Resonator Soundbox',
    nameAm: 'ዋንጫ (የድምፅ ሣጥን)',
    phoneticAm: 'Wancha / Satin',
    category: 'acoustic',
    functionEn: 'Acoustic amplifier chamber that vibrates the trapped air volume, turning string plucks into deep, resonant meditative bass tones.',
    functionAm: 'የአውታሮቹን ንዝረት በማጉላት የበገናውን ጥልቅ፣ ረጋ ያለና የኀሊና ጸሎት ድምፅ የሚያመነጭ ዋናው የድምፅ ሣጥን ነው።',
    locationEn: 'The large hollow trapezoidal body at the bottom of the Begena, underneath the soundboard and bridge.',
    locationAm: 'በበገናው የታችኛው ክፍል የሚገኘው ትልቁ ባለ ቅርጽ የእንጨትና የቆዳ ሣጥን ነው።',
    learningTipEn: 'The soundbox tapers backwards and downwards. This unique acoustic cavity shape creates the low natural resonance fundamental to Begena meditation.',
    learningTipAm: 'የሣጥኑ ቅርጽ ወደ ኋላና ወደ ታች ተዳፋት ሆኖ የተሰራው የበገናውን ጥልቅ ባስ ድምፅ በውስጡ አጉልቶ ለማስተጋባት ነው።',
    descriptionEn: 'Trapezoidal resonator body framed in native Ethiopian hardwoods and wrapped tightly in tanned leather/parchment.',
    descriptionAm: 'በባህላዊ የብራና ቆዳ የተወጠረና በወርቃማ የቢጫ-ቡኒ ቀለም ያጌጠ የበገናው ዋና የድምፅ ማጉያ አካል ነው።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    cameraFocus: {
      target: [0, -1.0, 0.0],
      position: [0, -0.9, 4.3]
    }
  },

  // 2. FRONT SOUNDBOARD (PARCHMENT SKIN)
  {
    id: 'soundboard',
    nameEn: 'Front Parchment Soundboard',
    nameAm: 'የፊት ብራና',
    phoneticAm: 'Yefit Brana',
    category: 'acoustic',
    functionEn: 'Receives the downward acoustic energy from the bridge and vibrates freely to resonate the entire instrument.',
    functionAm: 'ከፈረሱ የሚወርደውን የአውታር ንዝረት በቀጥታ በመቀበል በሣጥኑ ውስጥ ያለውን አየር እንዲርገበገብና ድምፅ እንዲያወጣ ያደርጋል።',
    locationEn: 'The radiant golden-ochre front surface of the soundbox, directly beneath the bridge and strings.',
    locationAm: 'በድምፅ ሣጥኑ የፊት ገጽ ላይ፣ ከፈረሱና ከአውታሮቹ ሥር ተወጥሮ ይገኛል።',
    learningTipEn: 'Tightly stretched ox or goat hide stitched under wet tension. As it dries, it tightens like a drumhead for instant acoustic projection.',
    learningTipAm: 'በባህላዊ የብራና ቆዳ ተወጥሮ የሚዘጋጅ ሲሆን፤ እርጥበት ሲኖር ድምፁ እንዳይደነዝዝ በፀሐይ ወይም በትንሽ ሙቀት ይሞቃል።',
    descriptionEn: 'The front acoustic skin of the Begena resonator, naturally dyed and stitched across the hardwood box frame.',
    descriptionAm: 'በድምፅ ሣጥኑ የፊት ገጽ ላይ የተወጠረ ጥንታዊ የብራና ቆዳ ሲሆን ድምፅ እንዲያስተጋባ ያደርጋል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    cameraFocus: {
      target: [0, -0.82, 0.35],
      position: [0, -0.80, 2.8]
    }
  },

  // 3. REAR STITCHED CROSS MEDALLION
  {
    id: 'rear_medallion',
    nameEn: 'Rear Stitched Cross Medallion',
    nameAm: 'የጀርባ መስቀል ማኅተም',
    phoneticAm: 'Ye\'Jerba Mesqel Mahtem',
    category: 'ornament',
    functionEn: 'Anchors the four diagonal parchment tension seams on the back of the soundbox and seals the instrument with a sacred cross.',
    functionAm: 'የተወጠረውን የብራና ቆዳ ውጥረት በጀርባው በኩል አጥብቆ የሚይዝ እና የበገናውን ቅዱስ መንፈሳዊ ተልዕኮ በመስቀሉ ማኅተም የሚያጸና ጥበብ ነው።',
    locationEn: 'Centered on the back angled surface of the resonator soundbox.',
    locationAm: 'በድምፅ ሣጥኑ የጀርባ ክፍል መሃል ላይ ይገኛል።',
    learningTipEn: 'Rotate the 3D model to see the back. The four corner leather seams meet at this medallion, distributing mechanical tension evenly.',
    learningTipAm: 'የ3D ሞዴሉን ወደ ኋላ በማዞር ይመልከቱ፤ የአራቱም ማዕዘናት የቆዳ ስፌቶች በመሃል ተገናኝተው በመስቀሉ ማኅተም ታስረዋል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    cameraFocus: {
      target: [0, -1.3, -0.8],
      position: [0, -1.2, -3.2]
    }
  },

  // 4. VERTICAL WOODEN PILLARS
  {
    id: 'pillars',
    nameEn: 'Braided Cable-Twist Wooden Pillars',
    nameAm: 'የተጠመዘዙ ምሰሶዎች (አዕማድ)',
    phoneticAm: 'Misesowoch / A\'emad',
    category: 'structure',
    functionEn: 'Two carved hardwood columns that anchor the frame and transfer the collective tension between the soundbox and the upper crossbar.',
    functionAm: 'አሥሩ አውታሮች የሚፈጥሩትን ከፍተኛ ውጥረት በመሸከም የላይኛውን መስቀያና የታችኛውን ሣጥን አጽንተው ይይዛሉ።',
    locationEn: 'Left and right vertical uprights rising from the soundbox up to the horizontal crossbar.',
    locationAm: 'ከድምፅ ሣጥኑ ተነስተው ወደ ላይኛው መስቀያ የሚዘረጉት ሁለት የግራና የቀኝ አዕማድ ናቸው።',
    learningTipEn: 'Notice how the pillars flare outward as they ascend. The rope-twist fluting provides both mechanical rigidity and signature Ethiopian aesthetic beauty.',
    learningTipAm: 'ምሰሶዎቹ ወደ ላይ ሲወጡ ወደ ውጭ በሰፊው ይከፈታሉ፤ የተጠመዘዘው ቅርጻቸው ጥንካሬንና ውበትን አጣምሮ ይሰጣቸዋል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    cameraFocus: {
      target: [-1.4, 1.5, 0.16],
      position: [-2.2, 1.8, 3.8]
    }
  },

  // 5. UPPER CROSSBAR / YOKE
  {
    id: 'crossbar',
    nameEn: 'Upper Crossbar / Yoke',
    nameAm: 'ብርኩማ (መስቀያ)',
    phoneticAm: 'Berkooma / Meskeya',
    category: 'structure',
    functionEn: 'Horizontal hardwood beam that joins the two pillars and securely holds all 10 tuning pegs under the pull of string tension.',
    functionAm: 'ሁለቱን አዕማድ አስተሳስሮ በመያዝ አሥሩን መቃኛዎች በጽናት እንዲቆሙና የአውታሮቹን ከፍተኛ ውጥረት እንዲሸከም ያደርጋል።',
    locationEn: 'Top horizontal beam connecting the tops of the two vertical pillars.',
    locationAm: 'የበገናው የላይኛው አግድም የእንጨት ዘንግ ሲሆን ሁለቱን ምሰሶዎች ያገናኛል።',
    learningTipEn: 'Traditionally carved from seasoned dense hardwoods (like Wanza or Weira) so it will not bend or twist under string pull.',
    learningTipAm: 'ከጠንካራና ከደረቀ የዋንዛ ወይም የወይራ እንጨት የሚጠረብ ሲሆን፤ የአውታሮቹ ከፍተኛ ስበት እንዳያጣመው ይከላከላል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    cameraFocus: {
      target: [0, 3.4, 0.2],
      position: [0, 3.4, 2.9]
    }
  },

  // 6. UPPER CARVED CROSS FINIALS
  {
    id: 'crosses',
    nameEn: 'Carved Lalibela Cross Finials',
    nameAm: 'የበገናው መስቀሎች (የላሊበላ መስቀል ጌጦች)',
    phoneticAm: 'Ye\'Begena Mesqeloch',
    category: 'ornament',
    functionEn: 'Crowning decorative finials that symbolize the sacred heritage of King David\'s harp and Ethiopian liturgical church art.',
    functionAm: 'የበገናውን ቅዱስ መንፈሳዊ ታሪክ የሚያጎሉና መሣሪያው የዳዊት በገና ለመንፈሳዊ ምስጋና የተለየ መሆኑን የሚመሰክሩ ቅርሶች ናቸው።',
    locationEn: 'Mounted atop both outer ends of the upper horizontal crossbar.',
    locationAm: 'በመስቀያው (ብርኩማው) የግራና የቀኝ ጫፎች አናት ላይ ተቀምጠው ይገኛሉ።',
    learningTipEn: 'These stepped crosses echo the rock-hewn architecture of Lalibela. They identify the Begena as an instrument dedicated exclusively to spiritual contemplation.',
    learningTipAm: 'የላሊበላ ውቅር አብያተ ክርስቲያናት ቅርጽ ያላቸው ሲሆን፤ በገና ለመንፈሳዊ ጸሎትና ምስጋና ብቻ የተለየ መሣሪያ መሆኑን ያመለክታሉ።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    cameraFocus: {
      target: [0, 4.2, 0.2],
      position: [0, 4.1, 3.4]
    }
  },

  // 7. TUNING PEGS
  {
    id: 'pegs',
    nameEn: 'Friction Tuning Pegs',
    nameAm: 'መቃኛዎች (ቺሮች)',
    phoneticAm: 'Meqagnawiyoch / Chiroch',
    category: 'tuning',
    functionEn: 'Ten tapered wooden pegs used to tune each string by adjusting its tension to the desired pitch and Ethiopian mode.',
    functionAm: 'እያንዳንዱን አውታር በማጥበቅና በማላላት የበገናውን ቅኝት (ትዝታ፣ ባቲ፣ አምባሰል፣ አንቺሆዬ) በትክክል ለማስተካከል ያገለግላሉ።',
    locationEn: 'Wedged in an alternating herringbone pattern across the center of the crossbar.',
    locationAm: 'በመስቀያው መሃል ላይ በተለዋዋጭ አቅጣጫ (ወደፊትና ወደኋላ) ተሰክተው ይገኛሉ።',
    learningTipEn: 'Begena pegs do not have mechanical gears. To tune, gently push the peg inwards into the hole as you turn it so friction holds the pitch.',
    learningTipAm: 'የበገና መቃኛዎች እንደ ጊታር ማሽነሪ የላቸውም፤ በሚያስተካክሉበት ጊዜ ወደ ውስጥ ጠበቅ እያደረጉ በማዞር እንዳይላላ ማድረግ ያስፈልጋል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    cameraFocus: {
      target: [0, 3.5, 0.2],
      position: [0, 3.5, 2.0]
    }
  },

  // 8. OPEN-BOX BRIDGE
  {
    id: 'bridge',
    nameEn: 'Open-Box Bridge (Feres)',
    nameAm: 'ፈረስ (ድልድይ)',
    phoneticAm: 'Feres',
    category: 'acoustic',
    functionEn: 'Elevates all ten strings above the parchment soundboard and conducts their vibrational energy down into the resonator.',
    functionAm: 'አውታሮቹን ደግፎ በመያዝ ንዝረታቸውን በቀጥታ ወደ ድምፅ ሣጥኑ ሰሌዳ ያስተላልፋል።',
    locationEn: 'Centered on the lower middle section of the front soundboard.',
    locationAm: 'በፊት ለፊቱ የብራና ሰሌዳ መሃል ላይ ተቀምጦ ይገኛል።',
    learningTipEn: 'Called "Feres" (horse) because it carries the strings on its back. It is never glued to the skin—it is held in place solely by downward string pressure.',
    learningTipAm: 'አውታሮቹን በጀርባው ተሸክሞ ስለሚይዝ «ፈረስ» ይባላል፤ ከብራናው ጋር በሙጫ አይጣበቅም፤ በአውታሮቹ ስበት ብቻ ቆሞ ይኖራል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    cameraFocus: {
      target: [0, -0.82, 0.45],
      position: [0, -0.75, 2.2]
    }
  },

  // 9. BUZZING BUFFERS (INZIRA)
  {
    id: 'inzira',
    nameEn: 'Buzzing Buffers (Inzira)',
    nameAm: 'እንዚራ',
    phoneticAm: 'Inzira',
    category: 'acoustic',
    functionEn: 'Cushions placed under each string on the bridge to produce the iconic buzzing "Birz" (ብርዝ) overtone unique to the Begena.',
    functionAm: 'አውታሩ ሲደረደር ከቆዳው ጋር እየተጋጨ የበገናውን ታዋቂ «ብርዝ» (የሚንዘረዘር ድምፅ) በመፍጠር ልዩ መንፈሳዊ ድምፅ እንዲኖረው ያደርጋል።',
    locationEn: 'Inserted between each string and the wooden bridge.',
    locationAm: 'በፈረሱና በእያንዳንዱ አውታር መካከል ተሰክተው ይገኛሉ።',
    learningTipEn: 'The placement of each Inzira requires master touch. Slipping it forward or back by a fraction of a millimeter changes the buzz quality.',
    learningTipAm: 'የእንዚራ አቀማመጥ ከፍተኛ የልምድ ጥበብ ይጠይቃል፤ በትንሹ ወደፊት ወይም ወደኋላ ሲንሸራተት የብርዝ ድምፁ ሙሉ በሙሉ ይቀየራል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    cameraFocus: {
      target: [0, -0.80, 0.50],
      position: [0, -0.75, 1.8]
    }
  },

  // 10. TAILPIECE DOWEL (WAG)
  {
    id: 'tailpiece',
    nameEn: 'Tailpiece Dowel (Wag)',
    nameAm: 'ዋግ (ጅራት / የታችኛው ዘንግ)',
    phoneticAm: 'Wag / Tachignaw Zang',
    category: 'structure',
    functionEn: 'The bottom horizontal wooden dowel around which all ten strings are wound and anchored under tension.',
    functionAm: 'የአሥሩንም አውታሮች የታችኛውን ጫፍ በአስተማማኝ ሁኔታ በመያዝ ውጥረቱ በእኩል እንዲከፋፈል ያደርጋል።',
    locationEn: 'Anchored horizontally across the lower edge of the soundboard.',
    locationAm: 'በድምፅ ሣጥኑ ታችኛው ጫፍ ላይ አግድም ተቀምጦ ይገኛል።',
    learningTipEn: 'All ten strings are wrapped neatly around this rod. Wide leather straps at either end keep it from lifting off the soundbox.',
    learningTipAm: 'አሥሩም አውታሮች በዚህ ዘንግ ላይ ይጠመጠማሉ፤ በሁለቱም ጫፎች ያሉት የቆዳ ማሰሪያዎች ዘንጉ ወደ ላይ እንዳይሳብ አጥብቀው ይይዙታል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    cameraFocus: {
      target: [0, -2.36, 0.45],
      position: [0, -2.25, 2.2]
    }
  },

  // 11. TAILPIECE ANCHORING STRAPS
  {
    id: 'straps',
    nameEn: 'Tailpiece Anchoring Straps',
    nameAm: 'የቆዳ ማሰሪያዎች',
    phoneticAm: 'Ye\'Qoda Maseryawiyoch',
    category: 'structure',
    functionEn: 'Wide leather loops that firmly bind the tailpiece dowel to the bottom rim of the wooden soundbox.',
    functionAm: 'የታችኛውን የዋግ ዘንግ ከድምፅ ሣጥኑ መሠረት ጋር አጥብቀው በማሰር የአውታሮቹን ስበት ይደግፋሉ።',
    locationEn: 'Wrapped around both outer sides of the tailpiece dowel.',
    locationAm: 'በዋጉ (በታችኛው ዘንግ) ግራና ቀኝ ጫፎች ላይ ተጠምጥመው ይገኛሉ።',
    learningTipEn: 'These heavy-duty rawhide loops take the full forward and upward pull of all 10 strings, keeping the instrument in tune.',
    learningTipAm: 'ጠንካራ የቆዳ ማሰሪያዎች ሲሆኑ የአሥሩንም አውታሮች ከፍተኛ የመሳብ ኃይል በመቋቋም መሣሪያው እንዳይላላ ይከላከላሉ።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    cameraFocus: {
      target: [0.75, -2.36, 0.45],
      position: [0.75, -2.25, 2.0]
    }
  },

  // 12. THE 10 STRINGS (COLLECTIVE)
  {
    id: 'strings',
    nameEn: 'The 10 Traditional Strings',
    nameAm: 'አሥሩ አውታሮች',
    phoneticAm: 'Asru Awtaroch',
    category: 'strings',
    functionEn: 'The ten strings that produce the notes and harmonies of the Begena through traditional finger-plucking techniques.',
    functionAm: 'በቀኝ እና በግራ እጅ ጣቶች ድርድር አማካኝነት የበገናውን ዜማዎችና ቅኝቶች ያመነጫሉ።',
    locationEn: 'Spanning from the top crossbar tuning pegs across the bridge to the tailpiece dowel.',
    locationAm: 'ከላይኛው መቃኛ ተነስተው በፈረሱ ላይ በማለፍ ወደ ታችኛው ዋግ ይዘረጋሉ።',
    learningTipEn: 'Strings 1 to 5 are the primary melody strings. Strings 6 to 10 are the Tazabi, octaves, and drone strings.',
    learningTipAm: 'ከ፩ኛ እስከ ፭ኛ ያሉት ዋና የዜማ ድርድር አውታሮች ሲሆኑ፤ ከ፮ኛ እስከ ፲ኛ ያሉት ደግሞ ተዛቢና ረዳት አውታሮች ናቸው።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    cameraFocus: {
      target: [0, 1.10, 0],
      position: [0, 1.45, 14.2]
    }
  },

  // INDIVIDUAL STRINGS 1 TO 10 (TIZTA SCALE ASSIGNMENT)
  {
    id: 'string_1',
    stringNumber: 1,
    nameEn: 'String 1 — E2',
    nameAm: '፩ኛ አውታር (E2)',
    phoneticAm: 'Andegna Awtar',
    category: 'strings',
    scaleMode: 'Tizta',
    audioPitchHz: 82.41,
    noteName: 'E2',
    functionEn: 'Plays the foundation E2 pitch (82.41 Hz) in the Tizta scale.',
    functionAm: 'በትዝታ ቅኝት መሠረታዊውን የ E2 ድምፅ (82.41 Hz) ያመነጫል።',
    locationEn: '1st string on the far left of the Begena string array.',
    locationAm: 'በበገናው አውታሮች የግራ ጫፍ ላይ የሚገኘው የመጀመሪያው አውታር ነው።',
    learningTipEn: 'In Tizta tuning, String 1 is tuned to E2 (82.41 Hz). It provides the starting melodic anchor.',
    learningTipAm: 'በትዝታ ቅኝት የመጀመሪያው አውታር ወደ E2 (82.41 Hz) የሚቃኝ ሲሆን፤ የዜማው መነሻ መሠረት ነው።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    spiritualMeaningEn: 'Represents the First Commandment: "You shall have no other gods before Me."',
    spiritualMeaningAm: '«ከእኔ በቀር ሌሎች አማልክት አይሁኑልህ» የሚለውን የመጀመሪያውን ትእዛዝ ያመለክታል።',
    cameraFocus: {
      target: [0, 1.10, 0],
      position: [0, 1.45, 14.2]
    }
  },
  {
    id: 'string_2',
    stringNumber: 2,
    nameEn: 'String 2 — C2',
    nameAm: '፪ኛ አውታር (C2)',
    phoneticAm: 'Huletegna Awtar',
    category: 'strings',
    scaleMode: 'Tizta',
    audioPitchHz: 65.41,
    noteName: 'C2',
    functionEn: 'Plays C2 (65.41 Hz) in unison with strings 3 and 4.',
    functionAm: 'ከ፫ኛ እና ፬ኛ አውታሮች ጋር በተመሳሳይ ዜማ የ C2 ድምፅን (65.41 Hz) ያመነጫል።',
    locationEn: '2nd string from the left, positioned between strings 1 and 3.',
    locationAm: 'ከግራ በኩል ሁለተኛው አውታር ሲሆን በ፩ኛና በ፫ኛ አውታሮች መካከል ይገኛል።',
    learningTipEn: 'Strings 2, 3, and 4 intentionally share the exact same C2 pitch (65.41 Hz) in traditional Tizta tuning.',
    learningTipAm: 'በትዝታ ቅኝት አውታር 2፣ 3 እና 4 ሆን ተብሎ ተመሳሳይ የሆነ የ C2 ድምፅ (65.41 Hz) ይጋራሉ።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    spiritualMeaningEn: 'Represents the Second Commandment: "You shall not make for yourself an idol."',
    spiritualMeaningAm: '«የተቀረጸውን ምስል ለአንተ አታድርግ» የሚለውን ሁለተኛውን ትእዛዝ ያመለክታል።',
    cameraFocus: {
      target: [0, 1.10, 0],
      position: [0, 1.45, 14.2]
    }
  },
  {
    id: 'string_3',
    stringNumber: 3,
    nameEn: 'String 3 — C2',
    nameAm: '፫ኛ አውታር (C2)',
    phoneticAm: 'Sostegna Awtar',
    category: 'strings',
    scaleMode: 'Tizta',
    audioPitchHz: 65.41,
    noteName: 'C2',
    functionEn: 'Plays C2 (65.41 Hz), providing core acoustic body in the Tizta scale.',
    functionAm: 'በትዝታ ቅኝት ማዕከላዊ የC2 ድምፅን (65.41 Hz) በማመንጨት የድምፅ ውህደትን ያጠነክራል።',
    locationEn: '3rd string from the left, positioned between strings 2 and 4.',
    locationAm: 'ከግራ በኩል ሦስተኛው አውታር ሲሆን በ፪ኛና በ፬ኛ አውታሮች መካከል ይገኛል።',
    learningTipEn: 'The middle string of the C2 unison trio (strings 2, 3, and 4), reinforcing harmonic warmth.',
    learningTipAm: 'ተመሳሳይ የC2 ድምፅ ካላቸው ሦስቱ አውታሮች መሃከል የሚገኝ ሲሆን፤ የዜማውን ሙቀት ያጎላል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    spiritualMeaningEn: 'Represents the Third Commandment: "You shall not take the name of the Lord your God in vain."',
    spiritualMeaningAm: '«የእግዚአብሔርን የአምላክህን ስም በከንቱ አትጥራ» የሚለውን ሦስተኛውን ትእዛዝ ያመለክታል።',
    cameraFocus: {
      target: [0, 1.10, 0],
      position: [0, 1.45, 14.2]
    }
  },
  {
    id: 'string_4',
    stringNumber: 4,
    nameEn: 'String 4 — C2',
    nameAm: '፬ኛ አውታር (C2)',
    phoneticAm: 'Arategna Awtar',
    category: 'strings',
    scaleMode: 'Tizta',
    audioPitchHz: 65.41,
    noteName: 'C2',
    functionEn: 'Plays C2 (65.41 Hz), anchoring the central register in the Tizta scale.',
    functionAm: 'በትዝታ ቅኝት የ C2 ድምፅን (65.41 Hz) በማመንጨት ማዕከላዊውን የዜማ እርከን ያጸናል።',
    locationEn: '4th string from the left, positioned between strings 3 and 5.',
    locationAm: 'ከግራ በኩል አራተኛው አውታር ሲሆን በ፫ኛና በ፭ኛ አውታሮች መካከል ይገኛል።',
    learningTipEn: 'Completes the trio of C2 unison strings (strings 2, 3, and 4). Helps maintain continuous resonance during prayer songs.',
    learningTipAm: 'የ C2 አንድነትን የሚያጠናቅቅ ሲሆን፤ በመንፈሳዊ ጸሎትና ዝማሬ ወቅት ዘላቂ ድምፅ እንዲኖር ይረዳል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    spiritualMeaningEn: 'Represents the Fourth Commandment: "Remember the Sabbath day, to keep it holy."',
    spiritualMeaningAm: '«የሰንበትን ቀን ትቀድሰው ዘንድ አስብ» የሚለውን አራተኛውን ትእዛዝ ያመለክታል።',
    cameraFocus: {
      target: [0, 1.10, 0],
      position: [0, 1.45, 14.2]
    }
  },
  {
    id: 'string_5',
    stringNumber: 5,
    nameEn: 'String 5 — D2',
    nameAm: '፭ኛ አውታር (D2)',
    phoneticAm: 'Amistegna Awtar',
    category: 'strings',
    scaleMode: 'Tizta',
    audioPitchHz: 73.42,
    noteName: 'D2',
    functionEn: 'Plays the D2 note (73.42 Hz) in the Tizta scale.',
    functionAm: 'በትዝታ ቅኝት የ D2 ድምፅን (73.42 Hz) ያመነጫል።',
    locationEn: '5th string from the left, completing the five primary playing strings.',
    locationAm: 'ከግራ በኩል አምስተኛው አውታር ሲሆን አምስቱን ዋና የድርድር አውታሮች ያጠናቅቃል።',
    learningTipEn: 'Strings 5 and 6 intentionally share the exact same D2 pitch (73.42 Hz). String 5 leads the melodic motif.',
    learningTipAm: 'አውታር 5 እና 6 ሆን ተብሎ ተመሳሳይ የ D2 ድምፅ (73.42 Hz) ይጋራሉ። ፭ኛው አውታር ለዋና ዜማ ይመረጣል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    spiritualMeaningEn: 'Represents the Fifth Commandment: "Honor your father and your mother."',
    spiritualMeaningAm: '«አባትህንና እናትህን አክብር» የሚለውን አምስተኛውን ትእዛዝ ያመለክታል።',
    cameraFocus: {
      target: [0, 1.10, 0],
      position: [0, 1.45, 14.2]
    }
  },
  {
    id: 'string_6',
    stringNumber: 6,
    nameEn: 'String 6 — D2',
    nameAm: '፮ኛ አውታር / ተዛቢ (D2)',
    phoneticAm: 'Sidistegna Awtar / Tazabi',
    category: 'strings',
    scaleMode: 'Tizta',
    audioPitchHz: 73.42,
    noteName: 'D2',
    functionEn: 'Plays D2 (73.42 Hz) as a sympathetic responder to string 5.',
    functionAm: 'በትዝታ ቅኝት የ D2 ድምፅን (73.42 Hz) በማመንጨት ከአምስተኛው አውታር ጋር ተስማምቶ ያስተጋባል።',
    locationEn: '6th string from the left, traditionally known as "Tazabi" (the observer).',
    locationAm: 'ከግራ በኩል ስድስተኛው አውታር ሲሆን በባህሉ «ተዛቢ» በመባል ይታወቃል።',
    learningTipEn: 'Known as the "Tazabi" (observer string). It echoes string 5 at D2, creating rich sympathetic reverberation.',
    learningTipAm: '«ተዛቢ» ይባላል፤ ከአምስተኛው አውታር ጋር እኩል D2 ላይ በመቃኘት ለዜማው አስተጋቢና ደጋፊ ድምፅ ይሰጣል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    spiritualMeaningEn: 'Represents the Sixth Commandment: "You shall not murder."',
    spiritualMeaningAm: '«አትግደል» የሚለውን ስድስተኛውን ትእዛዝ ያመለክታል።',
    cameraFocus: {
      target: [0, 1.10, 0],
      position: [0, 1.45, 14.2]
    }
  },
  {
    id: 'string_7',
    stringNumber: 7,
    nameEn: 'String 7 — A1',
    nameAm: '፯ኛ አውታር (A1)',
    phoneticAm: 'Sebategna Awtar',
    category: 'strings',
    scaleMode: 'Tizta',
    audioPitchHz: 55.00,
    noteName: 'A1',
    functionEn: 'Plays the deep A1 bass note (55.00 Hz) in the Tizta scale.',
    functionAm: 'በትዝታ ቅኝት ጥልቅ የሆነውን የ A1 ባስ ድምፅ (55.00 Hz) ያመነጫል።',
    locationEn: '7th string from the left, leading into the lower sub-bass register.',
    locationAm: 'ከግራ በኩል ሰባተኛው አውታር ሲሆን ጥልቅ ባስ ድምፅ የሚገኝበት ነው።',
    learningTipEn: 'Tuned to low A1 (55.00 Hz). It forms an octave relationship with String 8 (A2, 110.00 Hz).',
    learningTipAm: 'ወደ ጥልቅ ባስ A1 (55.00 Hz) የሚቃኝ ሲሆን ከ፰ኛ አውታር (A2, 110.00 Hz) ጋር የአንድ ኦክታቭ ልዩነት ይፈጥራል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    spiritualMeaningEn: 'Represents the Seventh Commandment: "You shall not commit adultery."',
    spiritualMeaningAm: '«አታመንዝር» የሚለውን ሰባተኛውን ትእዛዝ ያመለክታል።',
    cameraFocus: {
      target: [0, 1.10, 0],
      position: [0, 1.45, 14.2]
    }
  },
  {
    id: 'string_8',
    stringNumber: 8,
    nameEn: 'String 8 — A2',
    nameAm: '፰ኛ አውታር (A2)',
    phoneticAm: 'Simintegna Awtar',
    category: 'strings',
    scaleMode: 'Tizta',
    audioPitchHz: 110.00,
    noteName: 'A2',
    functionEn: 'Plays the A2 note (110.00 Hz) in the Tizta scale, octave partner to string 7.',
    functionAm: 'በትዝታ ቅኝት የ A2 ድምፅን (110.00 Hz) በማመንጨት ከ፯ኛ አውታር ጋር ኦክታቭ ይፈጥራል።',
    locationEn: '8th string from the left, positioned between strings 7 and 9.',
    locationAm: 'ከግራ በኩል ስምንተኛው አውታር ሲሆን በ፯ኛና በ፱ኛ አውታሮች መካከል ይገኛል።',
    learningTipEn: 'Tuned to A2 (110.00 Hz). Notice how it resonates in harmony with the lower String 7 (A1).',
    learningTipAm: 'ወደ A2 (110.00 Hz) የሚቃኝ ሲሆን ከዝቅተኛው የ፯ኛ አውታር (A1) ጋር ተስማምቶ በማስተጋባት ድምቀትን ይሰጣል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    spiritualMeaningEn: 'Represents the Eighth Commandment: "You shall not steal."',
    spiritualMeaningAm: '«አትስረቅ» የሚለውን ስምንተኛውን ትእዛዝ ያመለክታል።',
    cameraFocus: {
      target: [0, 1.10, 0],
      position: [0, 1.45, 14.2]
    }
  },
  {
    id: 'string_9',
    stringNumber: 9,
    nameEn: 'String 9 — G1',
    nameAm: '፱ኛ አውታር (G1)',
    phoneticAm: 'Zetegnegna Awtar',
    category: 'strings',
    scaleMode: 'Tizta',
    audioPitchHz: 49.00,
    noteName: 'G1',
    functionEn: 'Plays the lowest Begena fundamental pitch G1 (49.00 Hz) in the Tizta scale.',
    functionAm: 'በትዝታ ቅኝት ዝቅተኛውን የበገና ድምፅ G1 (49.00 Hz) ያመነጫል።',
    locationEn: '9th string from the left, penultimate string on the right.',
    locationAm: 'ከግራ በኩል ዘጠነኛው አውታር ሲሆን በቀኝ በኩል ከመጨረሻው በፊት ይገኛል።',
    learningTipEn: 'At 49.00 Hz, String 9 is the lowest pitch on the Begena. Its deep vibration resonates through the entire wooden chest.',
    learningTipAm: 'በ 49.00 Hz ድግግሞሽ የሚንቀጠቀጥ ሲሆን የበገናው ዝቅተኛው ጥልቅ ባስ ድምፅ ነው። ንዝረቱ በሰውነት ላይ ጥልቅ ተመስጦ ይፈጥራል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    spiritualMeaningEn: 'Represents the Ninth Commandment: "You shall not bear false witness."',
    spiritualMeaningAm: '«በባልንጀራህ ላይ በሐሰት አትመስክር» የሚለውን ዘጠነኛውን ትእዛዝ ያመለክታል።',
    cameraFocus: {
      target: [0, 1.10, 0],
      position: [0, 1.45, 14.2]
    }
  },
  {
    id: 'string_10',
    stringNumber: 10,
    nameEn: 'String 10 — G2',
    nameAm: '፲ኛ አውታር (G2)',
    phoneticAm: 'Asregna Awtar',
    category: 'strings',
    scaleMode: 'Tizta',
    audioPitchHz: 98.00,
    noteName: 'G2',
    functionEn: 'Plays G2 (98.00 Hz) in the Tizta scale, completing the 10-string array.',
    functionAm: 'በትዝታ ቅኝት የ G2 ድምፅን (98.00 Hz) በማመንጨት አሥሩን አውታሮች ያጠናቅቃል።',
    locationEn: '10th string on the far right edge of the Begena string array.',
    locationAm: 'በበገናው አውታሮች የቀኝ ጫፍ ላይ የሚገኘው አሥረኛውና የመጨረሻው አውታር ነው።',
    learningTipEn: 'Tuned to G2 (98.00 Hz), exactly one octave above String 9 (G1, 49.00 Hz). It caps the ten sacred strings.',
    learningTipAm: 'ወደ G2 (98.00 Hz) የሚቃኝ ሲሆን ከዘጠነኛው አውታር (G1, 49.00 Hz) ጋር የአንድ ኦክታቭ ልዩነት በመፍጠር አሥሩን አውታሮች ያጠናቅቃል።',
    isVerified: true,
    verificationBadge: 'Verified Master Teacher Data',
    spiritualMeaningEn: 'Represents the Tenth Commandment: "You shall not covet anything that belongs to your neighbor."',
    spiritualMeaningAm: '«የባልንጀራህን ማንኛውንም ነገር አትመኝ» የሚለውን አሥረኛውን ትእዛዝ ያመለክታል።',
    cameraFocus: {
      target: [0, 1.10, 0],
      position: [0, 1.45, 14.2]
    }
  }
];

export const CAMERA_PRESETS = [
  {
    id: 'full',
    labelEn: 'Full Front View',
    labelAm: 'ሙሉ የፊት እይታ',
    target: [0, 1.10, 0] as [number, number, number],
    position: [0, 1.45, 14.2] as [number, number, number]
  },
  {
    id: 'photo_angle',
    labelEn: 'Perspective View (As Photographed)',
    labelAm: 'ልክ እንደ ፎቶው (3/4 አንግል)',
    target: [0, 1.10, 0] as [number, number, number],
    position: [4.2, 2.0, 13.5] as [number, number, number]
  },
  {
    id: 'bridge_focus',
    labelEn: 'Bridge & Inzira Buffers',
    labelAm: 'ፈረስና እንዚራ (ድምፅ ማስተጋቢያ)',
    target: [0, -0.82, 0.45] as [number, number, number],
    position: [0, -0.65, 3.2] as [number, number, number]
  },
  {
    id: 'pegs_cross',
    labelEn: 'Crossbar & Lalibela Crosses',
    labelAm: 'መስቀያና የመስቀል ቅርጾች',
    target: [0, 3.8, 0.2] as [number, number, number],
    position: [0, 3.6, 3.6] as [number, number, number]
  },
  {
    id: 'rear_view',
    labelEn: 'Rear Medallion & Leather Seams',
    labelAm: 'የጀርባው የመስቀል ማኅተም',
    target: [0, -1.2, -0.8] as [number, number, number],
    position: [0, -1.0, -4.5] as [number, number, number]
  }
];
