/* Local Hindi translations: no external translation service or visitor data transfer. */
(function () {
  'use strict';
  const key = 'sjf_language';
  const valid = value => value === 'hi' || value === 'en';
  let choice = null;
  try { const saved = localStorage.getItem(key); if (valid(saved)) choice = saved; } catch (_) {}
  if (!choice) try { const saved = sessionStorage.getItem(key); if (valid(saved)) choice = saved; } catch (_) {}
  let language = choice || 'en';
  const originalTitle = document.title;
  const dictionary = {
    'Children and volunteers with saplings':'पौधों के साथ बच्चे और स्वयंसेवक',
    'Community members saluting at the flag ceremony':'ध्वजारोहण समारोह में सलामी देते समुदाय के सदस्य',
    'A student speaking into a microphone':'माइक्रोफ़ोन पर बोलता एक छात्र',
    'A student sharing her voice at a foundation event':'फाउंडेशन के कार्यक्रम में अपनी बात रखती एक छात्रा',
    'A student addressing her classmates':'अपने सहपाठियों को संबोधित करती एक छात्रा',
    'A community gathering with children and saplings':'बच्चों और पौधों के साथ सामुदायिक कार्यक्रम',
    'Children and volunteers gathered for the flag ceremony':'ध्वजारोहण के लिए एकत्र बच्चे और स्वयंसेवक',
    'A student speaking during the Independence Day programme':'स्वतंत्रता दिवस कार्यक्रम में बोलती एक छात्रा',
    'Students taking part in a classroom discussion':'कक्षा की चर्चा में भाग लेते विद्यार्थी',
    'Children attending a learning session':'शिक्षण सत्र में भाग लेते बच्चे',
    'Children participating in a group learning activity':'समूह में सीखने की गतिविधि में भाग लेते बच्चे',
    'A classroom full of young learners':'सीखने वाले बच्चों से भरी कक्षा',
    'A student showing her flute drawing':'बाँसुरी का अपना चित्र दिखाती एक छात्रा',
    'A student presenting his pencil artwork':'पेंसिल से बनी अपनी कलाकृति दिखाता एक छात्र',
    'A student displaying an illustrated notebook page':'अपनी कॉपी में बनाया चित्र दिखाता एक छात्र',
    'Pencil drawings made by the students':'विद्यार्थियों द्वारा पेंसिल से बनाए गए चित्र',
    'A student presenting an environment-themed drawing':'पर्यावरण पर बनाया अपना चित्र दिखाता एक छात्र',
    'A student showing her handmade card':'अपने हाथ से बनाया कार्ड दिखाती एक छात्रा',
    'Children and a volunteer celebrating together':'मिलकर खुशियाँ मनाते बच्चे और एक स्वयंसेवक',
    'A group portrait of children at the foundation':'फाउंडेशन के बच्चों की सामूहिक तस्वीर',
    'Guests on stage at the foundation recognition ceremony':'फाउंडेशन के सम्मान समारोह में मंच पर अतिथि',
    'Children enjoying a water park outing':'वॉटर पार्क में सैर का आनंद लेते बच्चे',
    'Volunteers with supplies at a classroom gathering':'कक्षा के कार्यक्रम में सामग्री के साथ स्वयंसेवक',
    'Volunteers distributing supplies to children':'बच्चों को सामग्री बाँटते स्वयंसेवक',
    'Children gathered for a foundation learning programme':'फाउंडेशन के शिक्षण कार्यक्रम में एकत्र बच्चे',
    'Children learning together at the foundation':'फाउंडेशन में साथ पढ़ते हुए बच्चे',
    'Children holding saplings at a foundation gathering':'फाउंडेशन के कार्यक्रम में पौधे लिए हुए बच्चे',
    'Community members carrying the Indian flag in a procession':'जुलूस में तिरंगा लेकर चलते समुदाय के सदस्य',
    'A performer receiving flowers at a foundation recognition ceremony':'फाउंडेशन के सम्मान समारोह में फूल स्वीकार करती कलाकार',
    'Guests and a performer seated at a foundation recognition ceremony':'फाउंडेशन के सम्मान समारोह में बैठे अतिथि और कलाकार',
    'Home':'मुखपृष्ठ','About Us':'हमारे बारे में','Initiatives':'हमारी पहल','Gallery':'चित्र दीर्घा','Videos':'वीडियो','Updates':'नवीन जानकारी','News':'समाचार','Contact':'संपर्क','Donate':'दान करें','Volunteer':'स्वयंसेवक बनें','Admin':'एडमिन',
    'SASHI':'शशि','Jamuna':'जमुना','Foundation':'फाउंडेशन','Sashi Jamuna Foundation':'शशि जमुना फाउंडेशन',
    'Sashi Jamuna Foundation home':'शशि जमुना फाउंडेशन का मुखपृष्ठ','Sashi Jamuna Foundation logo':'शशि जमुना फाउंडेशन का लोगो','Sashi Jamuna Foundation loading video':'शशि जमुना फाउंडेशन की लोडिंग वीडियो',
    '1003.mp4 from Sashi Jamuna Foundation':'शशि जमुना फाउंडेशन की वीडियो 1003.mp4','Skip to content':'मुख्य सामग्री पर जाएँ','Menu':'मेनू','Primary':'मुख्य मेनू','Mobile':'मोबाइल मेनू','Breadcrumb':'पृष्ठ का स्थान',
    'Rooted in':'हमारी जड़ें','Culture':'संस्कृति में','Empowering':'सशक्त होते','Communities':'समुदाय','Growing':'बढ़ती','Hope':'आशा',
    'A community-led foundation creating spaces where children learn, grow and belong.':'समुदाय द्वारा संचालित एक फाउंडेशन, जहाँ बच्चों को सीखने, आगे बढ़ने और अपनापन महसूस करने का अवसर मिलता है।',
    'EDUCATION':'शिक्षा','EMPOWERMENT':'सशक्तीकरण','PROGRESS':'प्रगति','Knowledge creates opportunity.':'ज्ञान अवसर पैदा करता है।','Every individual deserves a chance.':'हर व्यक्ति एक अवसर का हकदार है।','Together, we build a better tomorrow.':'मिलकर हम एक बेहतर कल बनाते हैं।','Foundation values':'फाउंडेशन के मूल्य',
    'Donate Now':'अभी दान करें','Become a Volunteer':'स्वयंसेवक बनें','Inspired by Bihar\'s living Madhubani heritage':'बिहार की जीवंत मधुबनी विरासत से प्रेरित','Culture-Rooted':'संस्कृति से जुड़े','Community-First':'समुदाय सर्वप्रथम','Transparent':'पारदर्शी',
    'Stories that moved us':'हमारे दिल को छू गई कहानियाँ','Stories that move us.':'दिल को छूने वाली कहानियाँ।','We Give Child A Gift Of Education':'बच्चों को शिक्षा का उपहार दें','Become A Volunteer?':'स्वयंसेवक बनना चाहेंगे?','Make Donation To Us?':'हमारा सहयोग करना चाहेंगे?','Contact Now':'अभी संपर्क करें','Watch All Videos':'सभी वीडियो देखें',
    'SERVICE':'सेवा','COMPASSION':'करुणा','DIGNITY':'गरिमा','COMMUNITY':'समुदाय','CULTURE':'संस्कृति','HOPE':'आशा',
    'Who We Are':'हम कौन हैं','A promise painted in':'देखभाल के हर रंग में','every shade of care.':'एक वादा।',
    'The Shashi Jamuna Foundation is a regional non-profit organization based in Rosera, Bihar, India. It actively engages in community development and promotes local art, culture, and youth achievement, including honoring international performers and preserving traditional folk arts such as the Jhijhiya dance.':'शशि जमुना फाउंडेशन रोसड़ा, बिहार, भारत में स्थित एक क्षेत्रीय गैर-लाभकारी संस्था है। यह सामुदायिक विकास, स्थानीय कला-संस्कृति और युवाओं की उपलब्धियों को बढ़ावा देती है। इसके कार्यों में अंतरराष्ट्रीय कलाकारों का सम्मान और झिझिया नृत्य जैसी पारंपरिक लोक कलाओं का संरक्षण शामिल है।',
    'Rosera, Bihar, India — a grassroots foundation rooted in local action, heritage preservation, youth growth and community care.':'रोसड़ा, बिहार, भारत — स्थानीय प्रयासों, विरासत के संरक्षण, युवाओं के विकास और समुदाय की देखभाल से जुड़ा फाउंडेशन।',
    'Community-first':'समुदाय सर्वप्रथम','Culture-inspired':'संस्कृति से प्रेरित','Transparent by design':'हर कार्य में पारदर्शिता',
    '— programs shaped with the people we serve':'— लोगों की भागीदारी से बने कार्यक्रम','— Mithila\'s art in everything we do':'— हर कार्य में मिथिला की कला की झलक','— verified numbers, open books':'— सत्यापित आँकड़े और पारदर्शी हिसाब','Read Our Story':'हमारी कहानी पढ़ें',
    'What We Do':'हम क्या करते हैं','Our Initiatives':'हमारी पहल','Five streams of steady, grassroots work.':'ज़मीनी स्तर पर निरंतर कार्य की पाँच धाराएँ।','Explore':'और जानें',
    'Education Support':'शिक्षा सहयोग','Healthcare & Camps':'स्वास्थ्य सेवा और शिविर','Women Empowerment':'महिला सशक्तीकरण','Skill Development':'कौशल विकास','Environment & Relief':'पर्यावरण और राहत','Madhubani Art & Culture':'मधुबनी कला और संस्कृति',
    'Learning centres, library kits, tuition support and digital literacy for children in rural and semi-urban schools.':'ग्रामीण और अर्ध-शहरी विद्यालयों के बच्चों के लिए शिक्षण केंद्र, पुस्तकालय सामग्री, पढ़ाई में सहायता और डिजिटल साक्षरता।',
    'Free health check-up camps, maternal care awareness, blood donation drives and referrals to district hospitals.':'निःशुल्क स्वास्थ्य जाँच शिविर, मातृ-स्वास्थ्य जागरूकता, रक्तदान अभियान और ज़िला अस्पतालों तक पहुँच में सहायता।',
    'Self-help group formation, financial literacy, legal awareness and leadership training for women.':'महिलाओं के लिए स्वयं सहायता समूह, वित्तीय साक्षरता, कानूनी जागरूकता और नेतृत्व प्रशिक्षण।',
    'Vocational courses in tailoring, computers, handicrafts and retail readiness linked to local employment.':'स्थानीय रोज़गार से जुड़े सिलाई, कंप्यूटर, हस्तशिल्प और खुदरा व्यापार के व्यावसायिक पाठ्यक्रम।',
    'Tree plantation, cleanliness drives, water conservation and rapid relief support during floods and disasters.':'पौधरोपण, स्वच्छता अभियान, जल संरक्षण और बाढ़ तथा आपदाओं के समय त्वरित राहत सहायता।',
    'Measurable Good':'प्रभाव का आकलन','Impact You Can Verify':'ऐसा प्रभाव जिसे आप परख सकें','We publish nothing until it is verified — real numbers, real lives, real change.':'सत्यापन के बाद ही जानकारी साझा करते हैं — वास्तविक आँकड़े, वास्तविक जीवन और वास्तविक बदलाव।','Lives Impacted':'लाभान्वित जीवन','Programmes Running':'चल रहे कार्यक्रम','Active Volunteers':'सक्रिय स्वयंसेवक','Villages Reached':'जुड़े हुए गाँव','Verified figure':'सत्यापित आँकड़ा',
    'Placeholder dashes are intentional — replace with audited impact data from the Admin Dashboard.':'अभी आँकड़ों का स्थान खाली है — एडमिन डैशबोर्ड से जाँचे हुए प्रभाव के आँकड़े जोड़ें।',
    'Moments & Memories':'पल और यादें','From Our Gallery':'हमारी तस्वीरों से','Glimpses of the work, the people and the joy in between.':'हमारे कार्य, लोगों और खुशियों की झलकियाँ।','View':'देखें','View Full Gallery':'पूरी चित्र दीर्घा देखें','Open photo':'तस्वीर खोलें',
    'Preview images shown are placeholders — upload real photos via Admin → Photos.':'दिखाई गई तस्वीरें उदाहरण हैं — एडमिन → तस्वीरें से वास्तविक तस्वीरें जोड़ें।','Foundation photo placeholder':'फाउंडेशन की उदाहरण तस्वीर','Sample photo — replace via Admin':'उदाहरण तस्वीर — एडमिन से बदलें',
    'Stay Connected':'जुड़े रहें','Follow the Journey':'हमारे सफ़र से जुड़ें','Daily moments from the field — pick your favourite window into our world.':'ज़मीनी कार्य के रोज़ाना पल — अपने पसंदीदा माध्यम से हमसे जुड़ें।','Connect':'जुड़ें','Follow':'फ़ॉलो करें','FEED':'फ़ीड','POST':'पोस्ट','VIDEO':'वीडियो','YouTube Channel':'यूट्यूब चैनल','Facebook Page':'फ़ेसबुक पेज',
    'Paste your official links in Admin → Settings to activate feeds & embeds.':'फ़ीड और एम्बेड सक्रिय करने के लिए एडमिन → सेटिंग्स में आधिकारिक लिंक जोड़ें।',
    'Fresh From the Field':'कार्यस्थल से ताज़ा खबरें','Daily Updates':'दैनिक जानकारी','News, notes and little victories — published straight from the dashboard.':'समाचार, अनुभव और छोटी-छोटी सफलताएँ — सीधे डैशबोर्ड से प्रकाशित।','Read All Updates':'सभी खबरें पढ़ें','DATE':'तारीख','SAMPLE':'उदाहरण','Date to be added':'तारीख जोड़ी जानी है','Update':'नई जानकारी','No updates yet.':'अभी कोई नई जानकारी नहीं है।',
    'Learning centre session held':'शिक्षण केंद्र में सत्र आयोजित','Free health camp conducted':'निःशुल्क स्वास्थ्य शिविर आयोजित','Madhubani workshop with artisans':'कारीगरों के साथ मधुबनी कार्यशाला','Volunteer orientation programme':'स्वयंसेवक परिचय कार्यक्रम','Plantation drive in nearby villages':'आसपास के गाँवों में पौधरोपण अभियान','Vocational batch graduation':'व्यावसायिक प्रशिक्षण बैच का समापन',
    'Education':'शिक्षा','Health':'स्वास्थ्य','Community':'समुदाय','Environment':'पर्यावरण','Skills':'कौशल','education':'शिक्षा','health':'स्वास्थ्य','culture':'संस्कृति','community':'समुदाय','All':'सभी',
    '[Editable placeholder — add the daily update text here from the admin dashboard.]':'[उदाहरण सामग्री — एडमिन डैशबोर्ड से दैनिक जानकारी यहाँ जोड़ें।]',
    'A community-driven foundation carrying the colours of Mithila into modern service — rooted in culture, growing hope.':'मिथिला के रंगों को आधुनिक सेवा से जोड़ता, समुदाय द्वारा संचालित फाउंडेशन — संस्कृति से जुड़कर आशा बढ़ाता हुआ।',
    'Quick Links':'महत्वपूर्ण लिंक','Our Work':'हमारा कार्य','Reach Us':'हमसे संपर्क करें','Rosera, Bihar, India':'रोसड़ा, बिहार, भारत','Rosera, Bihar':'रोसड़ा, बिहार','Email for updates':'नई जानकारी के लिए ईमेल','Subscribe':'सदस्यता लें','Designed & Developed by':'डिज़ाइन और विकास',
    'Our Story':'हमारी कहानी','The people, the purpose and the paintbrush behind Sashi Jamuna Foundation.':'शशि जमुना फाउंडेशन से जुड़े लोग, उद्देश्य और रचनात्मकता।','Born from a simple belief:':'एक सरल विश्वास से शुरुआत:','together, we rise.':'मिलकर हम आगे बढ़ते हैं।',
    'Based in Rosera, Bihar, the foundation brings people together around education, cultural pride, community care and opportunity. It stands as a local platform for youth, families and artists to grow with dignity and purpose.':'रोसड़ा, बिहार में स्थित यह फाउंडेशन शिक्षा, सांस्कृतिक गौरव, सामुदायिक देखभाल और अवसरों के माध्यम से लोगों को जोड़ता है। यह युवाओं, परिवारों और कलाकारों को गरिमा और उद्देश्य के साथ आगे बढ़ने का स्थानीय मंच देता है।',
    'Volunteer-powered':'स्वयंसेवकों द्वारा संचालित','Culture-led':'संस्कृति से प्रेरित','Why & How':'क्यों और कैसे','Mission, Vision & Values':'मिशन, दृष्टि और मूल्य','Our Mission':'हमारा मिशन','Our Vision':'हमारी दृष्टि','Our Values':'हमारे मूल्य',
    'To work hand-in-hand with communities so every life we touch can bloom — with learning, health and dignity.':'समुदायों के साथ मिलकर काम करना ताकि हर जीवन शिक्षा, स्वास्थ्य और गरिमा के साथ आगे बढ़ सके।','A world where compassion is culture, and no one is left behind.':'ऐसी दुनिया जहाँ करुणा ही संस्कृति हो और कोई पीछे न छूटे।','Kindness in intent, honesty in action, joy in service — every single day.':'इरादों में दया, कार्यों में ईमानदारी और सेवा में खुशी — हर दिन।',
    'Compassion':'करुणा','Every decision begins with kindness.':'हर निर्णय की शुरुआत दया से होती है।','Inclusion':'समावेश','No one left on the margins.':'कोई हाशिए पर न छूटे।','Integrity':'ईमानदारी','Honest work, honest books.':'ईमानदार कार्य, पारदर्शी हिसाब।','Heritage as our compass.':'विरासत हमारा मार्गदर्शन करती है।',
    'The Madhubani Connection':'मधुबनी से हमारा जुड़ाव','Art from the heart':'मिथिला के हृदय','of Mithila.':'से निकली कला।',
    'Madhubani — or Mithila painting — is a folk art tradition from the Mithala region of Bihar, historically painted by women on walls and floors for weddings and festivals. Artists draw bold outlines and fill figures with intricate patterns of lines, dots and hatching, using natural pigments. Its motifs — fish, lotus, peacocks, the sun, the tree of life — speak of prosperity, purity and harmony.':'मधुबनी या मिथिला चित्रकला बिहार के मिथिला क्षेत्र की लोक कला परंपरा है। महिलाएँ विवाह और त्योहारों पर दीवारों तथा फ़र्श पर यह चित्रकला करती रही हैं। कलाकार प्राकृतिक रंगों, गहरी रूपरेखाओं, महीन रेखाओं और बिंदुओं से आकृतियाँ सजाते हैं। मछली, कमल, मोर, सूर्य और जीवन-वृक्ष जैसे प्रतीक समृद्धि, पवित्रता और सद्भाव दर्शाते हैं।',
    'Our design carries this heritage in every border, corner and illustration on the site — hand-styled after the tradition, made with respect.':'हमारी वेबसाइट की किनारियों, कोनों और चित्रों में यह विरासत झलकती है — परंपरा से प्रेरित और सम्मान के साथ तैयार।','Fish':'मछली','Lotus':'कमल','Sun':'सूर्य','· Prosperity':'· समृद्धि','· Purity':'· पवित्रता','· Energy & Life':'· ऊर्जा और जीवन','Madhubani sun medallion':'मधुबनी शैली का सूर्य चिह्न',
    'The People':'हमारे लोग','Our Team':'हमारी टीम','The hands and hearts behind the foundation.':'फाउंडेशन को आगे बढ़ाने वाले समर्पित लोग।','[Trustee / Member Name]':'[न्यासी / सदस्य का नाम]','[Designation & one-line bio]':'[पद और संक्षिप्त परिचय]','Team placeholders — replace with real names & photos':'टीम की उदाहरण सामग्री — वास्तविक नाम और तस्वीरें जोड़ें','Join the Team as a Volunteer':'स्वयंसेवक के रूप में टीम से जुड़ें',
    'Foundation community placeholder photo':'समुदाय की उदाहरण तस्वीर','Foundation activity placeholder photo':'गतिविधि की उदाहरण तस्वीर',
    'Streams of steady, grassroots work — each one shaped with the communities it serves.':'ज़मीनी स्तर पर निरंतर कार्य — हर पहल संबंधित समुदाय की भागीदारी से बनी है।','Focus areas & regions:':'कार्य क्षेत्र और स्थान:','[add regions, frequency & partner communities]':'[स्थान, आवृत्ति और सहयोगी समुदाय जोड़ें]','Support This':'सहयोग करें','Volunteer Here':'यहाँ स्वयंसेवा करें','Add, edit or remove initiatives — Admin → Initiatives':'पहल जोड़ें, बदलें या हटाएँ — एडमिन → पहल',
    'How We Work':'हम कैसे काम करते हैं','From Idea to Impact':'विचार से बदलाव तक','Listen First':'पहले सुनें','Understand what a community truly needs — not what we assume.':'हमारी धारणाओं से परे समुदाय की वास्तविक ज़रूरतें समझें।','Co-create':'मिलकर योजना बनाएँ','Design every programme with local voices at the table.':'स्थानीय लोगों की भागीदारी से हर कार्यक्रम तैयार करें।','Act Together':'मिलकर काम करें','Run drives with volunteers, partners and families.':'स्वयंसेवकों, सहयोगियों और परिवारों के साथ अभियान चलाएँ।','Share Openly':'खुलकर साझा करें','Report outcomes and numbers — verified, always.':'परिणाम और आँकड़े साझा करें — हमेशा सत्यापन के बाद।','Pick a cause. Plant a seed.':'एक उद्देश्य चुनें। बदलाव का बीज बोएँ।',
    'Choose the initiative closest to your heart — and watch your contribution grow into someone\'s better day.':'अपने दिल के करीब की पहल चुनें — आपका योगदान किसी का जीवन बेहतर बना सकता है।','Moments, memories and milestones — straight from the field.':'कार्यस्थल से पल, यादें और उपलब्धियाँ।','Images marked "Sample" are placeholders — upload the foundation\'s real photos from Admin → Photos.':'“उदाहरण” चिह्नित तस्वीरें नमूने हैं — एडमिन → तस्वीरें से फाउंडेशन की वास्तविक तस्वीरें जोड़ें।',
    'Video stories from the foundation — watch, share, believe.':'फाउंडेशन की वीडियो कहानियाँ — देखें, साझा करें और जुड़ें।','A video from Sashi Jamuna Foundation.':'शशि जमुना फाउंडेशन की एक वीडियो।','No video stories yet':'अभी कोई वीडियो कहानी नहीं है','New video stories from the foundation will appear here.':'फाउंडेशन की नई वीडियो कहानियाँ यहाँ दिखाई देंगी।','Open video':'वीडियो खोलें','Close video':'वीडियो बंद करें','Previous video':'पिछली वीडियो','Next video':'अगली वीडियो','This video could not load.':'यह वीडियो लोड नहीं हो सकी।','Close':'बंद करें','Next':'अगला','Previous':'पिछला',
    'News & Daily Updates':'समाचार और दैनिक जानकारी','Field notes, announcements and everyday victories — fresh from the foundation.':'फाउंडेशन से ताज़ा अनुभव, घोषणाएँ और रोज़ की सफलताएँ।','Get daily updates':'दैनिक जानकारी पाएँ','Save your newsletter interest in this browser demo.':'इस ब्राउज़र डेमो में समाचार-पत्र के लिए अपनी रुचि दर्ज करें।','Follow along':'हमसे जुड़े रहें','Daily moments on social media.':'सोशल मीडिया पर रोज़ के पल।','Moved by a story?':'किसी कहानी ने मन छुआ?','Turn it into support for the next one.':'आगे की कहानियों के लिए अपना सहयोग दें।','No updates yet — publish the first one from Admin → Updates.':'अभी कोई नई जानकारी नहीं है — एडमिन → नवीन जानकारी से पहली खबर जोड़ें।',
    'Turn your generosity into someone’s better tomorrow.':'आपकी उदारता किसी का आने वाला कल बेहतर बना सकती है।','Make a Contribution':'अपना योगदान दें','Frequency':'आवृत्ति','Give Once':'एक बार दें','Monthly':'हर महीने','Or enter a custom amount (₹)':'या अपनी राशि दर्ज करें (₹)','Full Name *':'पूरा नाम *','Phone *':'फ़ोन *','Email *':'ईमेल *','Purpose':'उद्देश्य','General Fund':'सामान्य निधि','Message (optional)':'संदेश (वैकल्पिक)','Make my donation anonymous':'मेरा दान गुमनाम रखें','Save Donation Interest':'दान में रुचि दर्ज करें','Browser demo only':'केवल ब्राउज़र डेमो','No payment is processed':'कोई भुगतान नहीं किया जाता',
    'This demo records your interest in this browser only. No payment is taken and no email is sent.':'यह डेमो आपकी रुचि केवल इसी ब्राउज़र में दर्ज करता है। कोई भुगतान नहीं लिया जाता और कोई ईमेल नहीं भेजा जाता।','Your gift at work':'आपके सहयोग का प्रभाव','Other ways to give':'सहयोग के अन्य तरीके','Bank Transfer':'बैंक ट्रांसफ़र','[A/c name · A/c no. · IFSC]':'[खाताधारक का नाम · खाता संख्या · IFSC]','[Tax-exemption note, e.g., 80G eligibility — to be added]':'[कर छूट की जानकारी, जैसे 80G पात्रता — जोड़ी जानी है]','[₹ — could fund a child\'s learning kit for a year]':'[₹ — एक वर्ष के लिए बच्चे की शिक्षण सामग्री में मदद कर सकते हैं]','[₹ — could plant and care for — saplings]':'[₹ — से पौधे लगाकर उनकी देखभाल की जा सकती है]','[₹ — could support a health camp for — families]':'[₹ — से परिवारों के लिए स्वास्थ्य शिविर में सहायता मिल सकती है]',
    'Add real impact equivalents after internal costing — editable placeholder.':'आंतरिक लागत जाँच के बाद वास्तविक प्रभाव के उदाहरण जोड़ें — संपादन योग्य नमूना।','"Daan" — the joy of giving.':'“दान” — देने का आनंद।','In our tradition, giving is not charity — it is gratitude in motion.':'हमारी परंपरा में देना कृतज्ञता की अभिव्यक्ति है।',
    'Volunteer With Us':'हमारे साथ स्वयंसेवा करें','Give a few hours. Gain a family. Change many lives — including your own.':'कुछ घंटे दें। एक परिवार पाएँ। कई जीवन बदलें — अपना भी।','Volunteer Registration':'स्वयंसेवक पंजीकरण','Name *':'नाम *','City / District':'शहर / ज़िला','Areas of interest':'रुचि के क्षेत्र','Availability':'उपलब्धता','Weekdays':'सप्ताह के कार्यदिवस','Weekends':'सप्ताहांत','Evenings':'शाम का समय','Remote / Online':'दूरस्थ / ऑनलाइन','Whenever needed':'जब भी ज़रूरत हो','Why do you want to volunteer? (optional)':'आप स्वयंसेवा क्यों करना चाहते हैं? (वैकल्पिक)','How did you hear about us?':'आपको हमारे बारे में कैसे पता चला?','Social media':'सोशल मीडिया','A friend':'किसी मित्र से','Event / drive':'कार्यक्रम / अभियान','Other':'अन्य','Submit Registration':'पंजीकरण जमा करें','Demo: your registration will be saved in this browser.':'डेमो: आपका पंजीकरण इसी ब्राउज़र में सहेजा जाएगा।','Applications appear instantly in the Admin → Volunteers dashboard.':'आवेदन एडमिन → स्वयंसेवक डैशबोर्ड में तुरंत दिखाई देते हैं।',
    'A community':'एक समुदाय','Of doers who quickly feel like family.':'काम करने वाले लोग, जो जल्द ही परिवार जैसे बन जाते हैं।','Learn & grow':'सीखें और आगे बढ़ें','Grassroots skills no classroom teaches.':'ज़मीनी कौशल, जो कक्षा से परे सीखे जाते हैं।','Flexible commitments':'सुविधानुसार समय दें','Weekdays, weekends or remote — every hour counts.':'कार्यदिवस, सप्ताहांत या दूरस्थ रूप से — हर घंटे का महत्व है।','Choose your cause':'अपना उद्देश्य चुनें','Pick the initiative that speaks to you.':'वह पहल चुनें जिससे आप जुड़ाव महसूस करते हैं।','[Editable placeholder] Add volunteer policy details — recognition, certificates, safety guidelines and expectations here.':'[संपादन योग्य नमूना] स्वयंसेवक नीति, सम्मान, प्रमाणपत्र, सुरक्षा निर्देश और अपेक्षाएँ यहाँ जोड़ें।','Volunteers placeholder photo':'स्वयंसेवकों की उदाहरण तस्वीर',
    'Contact Us':'हमसे संपर्क करें','Questions, ideas, collaborations — we would love to hear from you.':'सवाल, सुझाव या सहयोग — हम आपकी बात सुनना चाहेंगे।','Visit Us':'हमसे मिलने आएँ','Call Us':'हमें फ़ोन करें','Write To Us':'हमें लिखें','Office Hours':'कार्यालय का समय','[Mon–Sat, 10:00 AM – 6:00 PM]':'[सोम–शनि, सुबह 10:00 – शाम 6:00]','Send a Message':'संदेश भेजें','Subject':'विषय','Message *':'संदेश *','Send Message':'संदेश भेजें','Open in Google Maps':'गूगल मैप्स में खोलें','Follow the foundation':'फाउंडेशन से जुड़ें',
    'Your name':'आपका नाम','Email address':'ईमेल पता','A few words of encouragement...':'प्रोत्साहन के कुछ शब्द...','Tell us a little about yourself...':'अपने बारे में कुछ बताएँ...','What is this about?':'संदेश का विषय क्या है?','Write your message...':'अपना संदेश लिखें...','e.g. 750':'जैसे 750','e.g., Madhubani':'जैसे, मधुबनी','Demo: saved in this browser only.':'डेमो: केवल इसी ब्राउज़र में सहेजा जाता है।',
    'Loading, please wait…':'लोड हो रहा है, कृपया प्रतीक्षा करें…','Pause announcements':'घोषणाएँ रोकें','Play announcements':'घोषणाएँ चलाएँ',
    '◆ Empowering Bihar — Preserving Innocence.':'◆ बिहार को सशक्त बनाएँ — बचपन की मासूमियत बचाएँ।','◆ Together we nurture roots and reach skies.':'◆ मिलकर जड़ों को सींचें और नई ऊँचाइयाँ छुएँ।','◆ Join us with a donation of Rs. 11/- only.':'◆ केवल ₹11/- का दान देकर हमसे जुड़ें।',
    'Newsletter interest saved in this browser demo.':'समाचार-पत्र में आपकी रुचि इस ब्राउज़र डेमो में सहेज दी गई।','This email is already saved in this browser.':'यह ईमेल इस ब्राउज़र में पहले से सहेजा हुआ है।','Message saved in the demo inbox on this browser.':'आपका संदेश इस ब्राउज़र के डेमो इनबॉक्स में सहेज दिया गया।','Volunteer registration saved in this browser demo.':'आपका स्वयंसेवक पंजीकरण इस ब्राउज़र डेमो में सहेज दिया गया।','Donation interest saved locally. No payment was processed.':'दान में आपकी रुचि सहेज दी गई। कोई भुगतान नहीं किया गया।','Choose an amount of ₹10 or more.':'₹10 या अधिक की राशि चुनें।','Add the official social link in Admin → Settings.':'एडमिन → सेटिंग्स में आधिकारिक सोशल मीडिया लिंक जोड़ें।','Browser storage is full. Export a backup in Admin before removing data.':'ब्राउज़र का संग्रहण भर गया है। डेटा हटाने से पहले एडमिन से बैकअप डाउनलोड करें।','Payment details have not been added.':'भुगतान की जानकारी अभी नहीं जोड़ी गई है।','Copied.':'कॉपी कर लिया गया।','Could not copy.':'कॉपी नहीं हो सका।','Clipboard is unavailable.':'क्लिपबोर्ड उपलब्ध नहीं है।',
    'Rooted in Bihar · Serving Communities':'बिहार से जुड़े · समुदाय की सेवा में','Communities.':'समुदायों को।','Preserving':'संरक्षण करते','Culture.':'संस्कृति का।','Explore Initiatives':'हमारी पहल देखें','80G Tax Benefit [Verify]':'80G कर लाभ [सत्यापन आवश्यक]','Transparent Reporting':'पारदर्शी रिपोर्टिंग','Volunteer-Led':'स्वयंसेवकों द्वारा संचालित','Healthcare':'स्वास्थ्य सेवा','Women Empowerment':'महिला सशक्तीकरण','Madhubani Heritage':'मधुबनी विरासत','Disaster Relief':'आपदा राहत',
    'The Sashi Jamuna Foundation works alongside rural and semi-urban communities across Bihar — advancing education, healthcare, women\'s livelihoods, skills, environment and the living heritage of Madhubani art.':'शशि जमुना फाउंडेशन बिहार के ग्रामीण और अर्ध-शहरी समुदायों के साथ शिक्षा, स्वास्थ्य, महिलाओं की आजीविका, कौशल, पर्यावरण और मधुबनी कला की जीवंत विरासत के लिए कार्य करता है।',
    'Heritage in':'विरासत','Every Heart':'हर दिल में','Hope in':'आशा','Every Home.':'हर घर में।','Building stronger communities across Bihar through education, culture and shared opportunity.':'शिक्षा, संस्कृति और साझा अवसरों से बिहार में समुदायों को सशक्त बनाना।','Support Our Work':'हमारे कार्य में सहयोग दें','Rosera · Bihar':'रोसड़ा · बिहार','Together for Bihar':'बिहार के लिए एक साथ','Every Child.':'हर बच्चा।','Every Chance.':'हर अवसर।','Every':'हर','Future.':'भविष्य।','Join Us':'हमसे जुड़ें',
    'Children enjoying a foundation outing':'फाउंडेशन के भ्रमण का आनंद लेते बच्चे','Sashi Jamuna Foundation recognition event':'शशि जमुना फाउंडेशन का सम्मान समारोह','Children at a community plantation drive':'सामुदायिक पौधरोपण अभियान में बच्चे','Children learning together in a community session':'सामुदायिक सत्र में साथ सीखते बच्चे','Close full-screen image':'पूरी स्क्रीन की तस्वीर बंद करें','Children taking part in a Sashi Jamuna Foundation activity':'शशि जमुना फाउंडेशन की गतिविधि में भाग लेते बच्चे'
  };
  const normalize = value => value.trim().replace(/\s+/g,' ');
  function translate(value) {
    if (language !== 'hi') return value;
    const text = normalize(value);
    let translated = dictionary[text];
    if (!translated) {
      let match;
      if ((match = /^SJF — Day (\d+)$/.exec(text))) translated = 'एसजेएफ — दिन ' + match[1];
      else if ((match = /^Play (.+)$/.exec(text))) translated = translate(match[1]) + ' चलाएँ';
      else if ((match = /^Open photo: (.+)$/.exec(text))) translated = 'तस्वीर खोलें: ' + translate(match[1]);
      else if ((match = /^Use (.+) as the homepage hero background$/.exec(text))) translated = translate(match[1]) + ' को मुखपृष्ठ की पृष्ठभूमि बनाएँ';
      else if ((match = /^(All|education|health|culture|community) (\(\d+\))$/.exec(text))) translated = translate(match[1]) + ' ' + match[2];
      else if ((match = /^(\d+) video stories from Sashi Jamuna Foundation. Choose a video to watch.$/.exec(text))) translated = 'शशि जमुना फाउंडेशन की ' + match[1] + ' वीडियो कहानियाँ। देखने के लिए वीडियो चुनें।';
      else if ((match = /^© (\d+) Sashi Jamuna Foundation\. All rights reserved\.$/.exec(text))) translated = '© ' + match[1] + ' शशि जमुना फाउंडेशन। सर्वाधिकार सुरक्षित।';
    }
    return translated ? value.replace(value.trim(), translated) : value;
  }
  const originals = new WeakMap();
  const excluded = 'script,style,svg,[data-no-i18n],textarea';
  function update(node, attribute) {
    const current = attribute ? node.getAttribute(attribute) : node.nodeValue;
    if (!current) return;
    let values = originals.get(node);
    if (!values) { values = {}; originals.set(node,values); }
    const slot = attribute || 'text';
    let entry = values[slot];
    if (!entry || current !== entry.last) entry = values[slot] = {source:current,last:current};
    const next = translate(entry.source);
    entry.last = next;
    if (current !== next) { if (attribute) node.setAttribute(attribute,next); else node.nodeValue = next; }
  }
  function apply(root = document.body) {
    if (!root || root.nodeType !== 1 || root.closest(excluded)) return;
    const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode, parent = node.parentElement;
      if (!parent || parent.closest(excluded)) continue;
      // Translated option labels must never change the submitted values.
      if (parent.tagName === 'OPTION' && !parent.hasAttribute('value')) parent.value = parent.textContent;
      update(node);
    }
    [root,...root.querySelectorAll('[aria-label],[placeholder],[alt],[title]')].forEach(el => {
      if (el.closest(excluded)) return;
      ['aria-label','placeholder','alt','title'].forEach(attr => update(el,attr));
    });
  }
  function syncDocument() {
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;
    document.title = language === 'hi' ? 'शशि जमुना फाउंडेशन' : originalTitle;
  }
  function openPicker() {
    let dialog = document.getElementById('sjf-language-picker');
    if (dialog) { if (!dialog.open) dialog.showModal(); return; }
    dialog = document.createElement('dialog');
    dialog.id = 'sjf-language-picker';
    dialog.className = 'sjf-language-picker';
    dialog.setAttribute('data-no-i18n','');
    dialog.setAttribute('aria-labelledby','sjf-language-title');
    dialog.innerHTML = `<img src="assets/images/sjf-logo.png" alt="Sashi Jamuna Foundation / शशि जमुना फाउंडेशन" width="84" height="84">
      <h2 id="sjf-language-title"><span lang="hi">अपनी भाषा चुनें</span><span lang="en">Choose your language</span></h2>
      <p><span lang="hi">आप वेबसाइट किस भाषा में देखना चाहेंगे?</span><br><span lang="en">How would you like to explore our website?</span></p>
      <div class="sjf-language-options"><button type="button" data-language="hi" lang="hi"><strong>हिंदी</strong><span>हिंदी में आगे बढ़ें</span></button><button type="button" data-language="en" lang="en"><strong>English</strong><span>Continue in English</span></button></div>`;
    dialog.addEventListener('cancel',event => { if (!choice) event.preventDefault(); });
    dialog.addEventListener('click',event => {
      const button = event.target.closest('[data-language]');
      if (!button) return;
      language = choice = button.dataset.language;
      try { localStorage.setItem(key,choice); } catch (_) {}
      try { sessionStorage.setItem(key,choice); } catch (_) {}
      syncDocument(); dialog.close(); dialog.remove();
      window.dispatchEvent(new CustomEvent('sjf:languagechange'));
      apply();
      document.querySelector('[data-act="language"]')?.focus({preventScroll:true});
    });
    document.body.appendChild(dialog);
    dialog.showModal();
  }
  function init() {
    syncDocument(); apply();
    const observer = new MutationObserver(records => {
      const roots = new Set();
      records.forEach(record => {
        if (record.type === 'characterData') roots.add(record.target.parentElement);
        else if (record.type === 'attributes') roots.add(record.target);
        else record.addedNodes.forEach(node => roots.add(node.nodeType === 1 ? node : node.parentElement));
      });
      roots.forEach(root => { if (root?.isConnected) apply(root); });
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','alt','title']});
    if (!choice) openPicker();
  }
  window.SJFLocale = {get language(){return language;},get locale(){return language === 'hi' ? 'hi-IN' : 'en-IN';},translate,apply,init,openPicker};
  syncDocument();
})();
