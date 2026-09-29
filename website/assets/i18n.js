'use strict';
// Each row: English source, Traditional Chinese (Taiwan), Simplified Chinese.
const translations = [
['Wayne Club — Wayne Wei','Wayne Club — Wayne Wei','Wayne Club — Wayne Wei'],
['Ting-Long (Wayne) Wei. Backend software engineer building reliable systems, AI-powered services, and open-source tools.','Ting-Long（Wayne）Wei，專注可靠系統、AI 服務與開源工具的後端軟體工程師。','Ting-Long（Wayne）Wei，专注可靠系统、AI 服务与开源工具的后端软件工程师。'],
['Skip to content','跳到主要內容','跳到主要内容'],
['Wayne Club home','Wayne Club 首頁','Wayne Club 首页'],
['Main navigation','主要導覽','主要导航'],
['Work','作品','作品'],['Experience','經歷','经历'],['About','關於','关于'],['Contact','聯絡','联系'],
['Choose language','選擇語言','选择语言'],
['Appearance: Automatic','外觀：自動','外观：自动'],['Appearance: Light','外觀：淺色','外观：浅色'],['Appearance: Dark','外觀：深色','外观：深色'],
['Let’s talk','聊聊','聊聊'],
['NOW PLAYING · WAYNE CLUB','正在播放 · WAYNE CLUB','正在播放 · WAYNE CLUB'],
['Every system has a story.','每個系統都有故事，','每个系统都有故事，'],
['I write the subtitles.','我負責寫字幕。','我负责写字幕。'],
['I’m Wayne Wei, a backend engineer who makes complex things readable: banking platforms for 2M+ users, AI services in production, and open-source tools with 690+ GitHub stars.','我是 Wayne Wei，一位把複雜變得好懂的後端工程師：服務兩百萬以上用戶的銀行平台、上線運作的 AI 服務，以及累積 690+ GitHub 星標的開源工具。','我是 Wayne Wei，一位把复杂变得好懂的后端工程师：服务两百万以上用户的银行平台、上线运行的 AI 服务，以及累计 690+ GitHub 星标的开源工具。'],
['Browse the library','瀏覽作品庫','浏览作品库'],['View résumé','查看履歷','查看简历'],
['Interactive glass lens over multilingual subtitles','多語字幕上的互動玻璃透鏡','多语字幕上的互动玻璃透镜'],
['Glass lens. Drag it, or use the arrow keys to move it.','玻璃透鏡。可拖曳，或用方向鍵移動。','玻璃透镜。可拖动，或用方向键移动。'],
['Drag me','拖曳我','拖动我'],
['Liquid glass, rendered live. Drag the lens.','即時渲染的液態玻璃，試著拖曳透鏡。','实时渲染的液态玻璃，试着拖动透镜。'],
['Career highlights','職涯亮點','职业亮点'],
['years of engineering experience','年軟體工程經驗','年软件工程经验'],
['users on banking systems supported','銀行系統服務用戶','银行系统服务用户'],
['GitHub stars across open source','開源專案 GitHub 星標','开源项目 GitHub 星标'],
['lower integration maintenance costs','整合維護成本降低','集成维护成本降低'],
['CHAPTER 01 · THE LIBRARY','第一章 · 作品庫','第一章 · 作品库'],
['Small frictions,','日常的小不順，','日常的小不顺，'],['fixed in public.','公開地修好它。','公开地修好它。'],
['Every project here began as something that felt harder than it should. Play with them — each card is a working miniature.','這裡的每個作品，都從「這件事不該這麼難」開始。動手玩玩看，每張卡片都是能操作的迷你版本。','这里的每个作品，都从「这件事不该这么难」开始。动手玩玩看，每张卡片都是能操作的迷你版本。'],
['Filter projects','篩選作品','筛选作品'],
['All','全部','全部'],['Media & language','媒體與語言','媒体与语言'],['Learning & play','學習與遊戲','学习与游戏'],['Data & insight','資料與洞察','数据与洞察'],
['MEDIA · PYTHON','媒體 · PYTHON','媒体 · PYTHON'],['LANGUAGE · MACOS','語言 · MACOS','语言 · MACOS'],['LANGUAGE · PYTHON','語言 · PYTHON','语言 · PYTHON'],['LEARNING · TYPESCRIPT','學習 · TYPESCRIPT','学习 · TYPESCRIPT'],['PLAY · GAME','遊戲 · GAME','游戏 · GAME'],['INSIGHT · NLP','洞察 · NLP','洞察 · NLP'],['DATA VIZ','資料視覺化','数据可视化'],
['428 GitHub stars','428 個 GitHub 星標','428 个 GitHub 星标'],['209 GitHub stars','209 個 GitHub 星標','209 个 GitHub 星标'],['24 GitHub stars','24 個 GitHub 星標','24 个 GitHub 星标'],['6 GitHub stars','6 個 GitHub 星標','6 个 GitHub 星标'],['2 GitHub stars','2 個 GitHub 星標','2 个 GitHub 星标'],
['Subtitle Downloader','Subtitle Downloader','Subtitle Downloader'],
['Downloads subtitles from 20+ streaming services, then cleans, converts and merges them into dual-language tracks.','從 20 多個串流平台下載字幕，再清理、轉換並合併成雙語字幕。','从 20 多个流媒体平台下载字幕，再清理、转换并合并成双语字幕。'],
['Subtitle track','字幕軌','字幕轨'],['Dual subtitles','雙語字幕','双语字幕'],
['Supported services include Apple TV+, Disney+, Crunchyroll, KKTV, iQIYI, Viu and more','支援 Apple TV+、Disney+、Crunchyroll、KKTV、愛奇藝、Viu 等平台','支持 Apple TV+、Disney+、Crunchyroll、KKTV、爱奇艺、Viu 等平台'],
['Automation','自動化','自动化'],['79 forks','79 個 Fork','79 个 Fork'],['Details','詳細介紹','详细介绍'],
['My most-used open-source project. It authenticates with each service, locates every available subtitle track and saves them in clean, consistent files.','我最多人使用的開源專案。它會登入各平台、找出所有可用的字幕軌，並存成乾淨一致的檔案。','我使用人数最多的开源项目。它会登录各平台、找出所有可用的字幕轨，并保存为干净一致的文件。'],
['Built-in processing fixes timing and formatting, converts between Simplified and Traditional Chinese, and merges two languages into one track for language learners.','內建處理會修正時間軸與格式、轉換簡繁中文，並把兩種語言合併成一軌，方便語言學習。','内置处理会修正时间轴与格式、转换简繁中文，并把两种语言合并成一轨，方便语言学习。'],
['Custom builds of Oxford, Merriam-Webster and Cambridge for macOS, with dark mode and offline pronunciation.','為 macOS 客製的牛津、韋氏與劍橋字典，支援深色模式與離線發音。','为 macOS 定制的牛津、韦氏与剑桥词典，支持深色模式与离线发音。'],
['Look up a word','查詢單字','查询单词'],['Suggested words','推薦單字','推荐单词'],['Pronounce','發音','发音'],['Dark mode','深色模式','深色模式'],
['Rebuilt dictionaries that live inside the macOS Dictionary app and Look Up, styled carefully for light and dark appearance.','重新打造的字典，直接整合進 macOS「字典」App 與「查詢」功能，細心調整淺色與深色外觀。','重新打造的词典，直接集成进 macOS「词典」App 与「查询」功能，细心调整浅色与深色外观。'],
['Pronunciation audio is bundled, so it works offline. Includes collocation and thesaurus editions.','內建發音音檔，離線也能用；另有搭配詞與同義詞版本。','内置发音音频，离线也能用；另有搭配词与同义词版本。'],
['Not in this pocket edition. Try one of the suggestions.','這本袖珍版沒有收錄，試試推薦的單字吧。','这本袖珍版没有收录，试试推荐的单词吧。'],
['Subtitle Tool','Subtitle Tool','Subtitle Tool'],
['Converts subtitles between formats and turns Simplified Chinese into natural Traditional Chinese.','在各種字幕格式間轉換，並把簡體中文轉成道地的繁體中文。','在各种字幕格式间转换，并把简体中文转成地道的繁体中文。'],
['Simplified','簡體','简体'],['Traditional (Taiwan)','繁體（台灣）','繁体（台湾）'],
['A companion to Subtitle Downloader. It converts between subtitle formats and uses phrase-level rules so “软件” becomes “軟體”, not a character-by-character translation.','Subtitle Downloader 的好搭檔。支援字幕格式互轉，並以詞彙為單位轉換，讓「软件」變成「軟體」，而不是逐字硬轉。','Subtitle Downloader 的好搭档。支持字幕格式互转，并以词汇为单位转换，让「软件」变成「軟體」，而不是逐字硬转。'],
['Bar exam practice with custom MBE-style sets, tutor or timed sessions, and explanation reviews.','美國律師考試練習工具：自訂 MBE 題組、導學或計時模式，以及詳解複習。','美国律师考试练习工具：自定义 MBE 题组、导学或计时模式，以及详解复习。'],
['Tutor mode · Evidence','導學模式 · 證據法','导学模式 · 证据法'],['Learning','學習','学习'],
['Build question sets by subject, practise in tutor mode with instant explanations, or simulate exam pressure with timed sessions.','依科目建立題組，在導學模式中即時看詳解，或用計時模式模擬考場壓力。','按科目建立题组，在导学模式中即时看详解，或用计时模式模拟考场压力。'],
['Reviews focus on the reasoning behind each answer, not just the score.','複習重點放在每個答案背後的推理，而不只是分數。','复习重点放在每个答案背后的推理，而不只是分数。'],
['Correct. Under FRE 801–802, hearsay is inadmissible unless an exclusion or exception applies.','答對了。依《聯邦證據規則》801–802 條，傳聞證據除非符合除外或例外規定，否則不得採用。','答对了。依《联邦证据规则》801–802 条，传闻证据除非符合排除或例外规定，否则不得采用。'],
['Not quite. Ask what the statement is being offered to prove.','差一點。想想這段陳述是被拿來證明什麼。','差一点。想想这段陈述是被拿来证明什么。'],
['2D platformer','2D 平台遊戲','2D 平台游戏'],
['Jump, collect letter blocks, then spell the four-letter word to cross the river. Three misses and it restarts.','跳躍收集字母方塊，拼出四個字母的單字才能過河；猜錯三次就重新開始。','跳跃收集字母方块，拼出四个字母的单词才能过河；猜错三次就重新开始。'],
['Hint','提示','提示'],['Letter blocks','字母方塊','字母方块'],['Letter','字母','字母'],['Clear','清除','清除'],
['3 tries left','還剩 3 次機會','还剩 3 次机会'],['2 tries left','還剩 2 次機會','还剩 2 次机会'],['1 try left','還剩 1 次機會','还剩 1 次机会'],
['Glass that bends light','會折射光線的玻璃','会折射光线的玻璃'],['What engineers write','工程師每天在寫的東西','工程师每天在写的东西'],['Keep two things in step','讓兩邊保持一致','让两边保持一致'],['A friendly hello, by hand','揮手打招呼','挥手打招呼'],['Tables are full of it','表格裡裝滿了它','表格里装满了它'],['Soft light','柔和的光','柔和的光'],
['River crossed! Next word.','成功過河！下一個單字。','成功过河！下一个单词。'],['Out of tries. New word!','機會用完了，換個新單字！','机会用完了，换个新单词！'],
['Game design','遊戲設計','游戏设计'],
['A word game disguised as a platformer. Letters hide inside blocks you collect while running and jumping.','一款偽裝成平台遊戲的文字遊戲。字母藏在你邊跑邊跳收集的方塊裡。','一款伪装成平台游戏的文字游戏。字母藏在你边跑边跳收集的方块里。'],
['At the river, the collected letters become a four-letter puzzle. There is also a Unity version called WordHopper.','來到河邊，收集到的字母會變成四字母謎題。另有 Unity 版本 WordHopper。','来到河边，收集到的字母会变成四字母谜题。另有 Unity 版本 WordHopper。'],
['Looks past the star rating to show what people actually say about food, service and atmosphere.','不只看星等，看見大家對餐點、服務與氛圍真正的評價。','不只看星级，看见大家对餐点、服务与氛围真正的评价。'],
['Highlight an aspect','標示評論面向','标示评论维度'],['Food','餐點','餐点'],['Service','服務','服务'],['Atmosphere','氛圍','氛围'],['Aspect analysis','面向分析','维度分析'],
['Aspect-based sentiment analysis turns long reviews into a clear picture of what went right and wrong.','以面向為基礎的情感分析，把冗長評論整理成清楚的優缺點。','基于维度的情感分析，把冗长评论整理成清楚的优缺点。'],
['Its sibling project, SpotLite, uses the same idea to recommend restaurants near tourist destinations.','姊妹專案 SpotLite 運用同樣的概念，推薦觀光景點附近的餐廳。','姊妹项目 SpotLite 运用同样的思路，推荐旅游景点附近的餐厅。'],
['Finds synopses and posters from Netflix, Apple TV, HBO and more, and applies them to Plex.','從 Netflix、Apple TV、HBO 等平台找出劇情簡介與海報，自動套用到 Plex。','从 Netflix、Apple TV、HBO 等平台找出剧情简介与海报，自动应用到 Plex。'],
['Fetch metadata','抓取資料','抓取数据'],['Clear metadata','清除資料','清除数据'],['Metadata','後設資料','元数据'],
['Matches titles in a Plex library with official artwork and descriptions from streaming services, so a home library looks as good as the services it came from.','為 Plex 媒體庫的影片配對串流平台的官方海報與簡介，讓家庭影音庫也像串流平台一樣好看。','为 Plex 媒体库的影片匹配流媒体平台的官方海报与简介，让家庭影音库也像流媒体平台一样好看。'],
['Map','地圖','地图'],['Supply Chain Map','供應鏈地圖','供应链地图'],
['Traces Toyota parts from Japanese suppliers to plants and customers worldwide.','追蹤 Toyota 零件從日本供應商到各地工廠與全球顧客的路線。','追踪丰田零件从日本供应商到各地工厂与全球客户的路线。'],
['Logistics','物流','物流'],
['An animated map of the full logistics journey: suppliers in Japan, manufacturing plants in Japan and North America, and distribution centers in Europe and the US.','以動態地圖呈現完整物流旅程：日本供應商、日本與北美的製造廠，以及歐洲與美國的配銷中心。','以动态地图呈现完整物流旅程：日本供应商、日本与北美的制造厂，以及欧洲与美国的配送中心。'],
['ALSO ON THE SHELF','架上還有','架上还有'],
['Automated high-speed rail tickets · ★ 26','高鐵自動訂票 · ★ 26','高铁自动订票 · ★ 26'],
['Aspect-based restaurant recommendations','依評論面向推薦餐廳','按评论维度推荐餐厅'],
['SpellHop, rebuilt in Unity','用 Unity 重新打造的 SpellHop','用 Unity 重新打造的 SpellHop'],
['More on GitHub','GitHub 上的更多作品','GitHub 上的更多作品'],['All repositories ↗','所有儲存庫 ↗','所有仓库 ↗'],
['CHAPTER 02 · EPISODES','第二章 · 劇集','第二章 · 剧集'],
['Built for people,','為人而做，','为人而做，'],['proven at scale.','在真實規模中淬鍊。','在真实规模中淬炼。'],
['From banking at scale to production AI, one episode at a time.','從大規模銀行系統到上線的 AI 服務，一集一集走來。','从大规模银行系统到上线的 AI 服务，一集一集走来。'],
['users','用戶','用户'],['lower cost','成本降低','成本降低'],['faster','更快','更快'],
['E01 · JAN 2018 — MAR 2020 · TAIPEI','E01 · 2018 年 1 月 — 2020 年 3 月 · 台北','E01 · 2018 年 1 月 — 2020 年 3 月 · 台北'],
['E02 · APR 2020 — JUL 2024 · TAIPEI','E02 · 2020 年 4 月 — 2024 年 7 月 · 台北','E02 · 2020 年 4 月 — 2024 年 7 月 · 台北'],
['E03 · JUN — AUG 2021 · TAIPEI','E03 · 2021 年 6 月 — 8 月 · 台北','E03 · 2021 年 6 月 — 8 月 · 台北'],
['E04 · 2024 — 2026 · LOS ANGELES','E04 · 2024 — 2026 · 洛杉磯','E04 · 2024 — 2026 · 洛杉矶'],
['E.SUN Bank','玉山銀行','玉山银行'],['Software Engineer','軟體工程師','软件工程师'],
['Collaborated with IBM on online banking for over 2 million users. Built payment integrations and a modular Web ATM CMS, and led a six-person team on a shared foreign exchange platform.','與 IBM 合作開發服務逾兩百萬用戶的網路銀行；建置金流串接與模組化 Web ATM 內容管理系統，並帶領六人團隊打造共用外匯平台。','与 IBM 合作开发服务逾两百万用户的网上银行；建设支付对接与模块化 Web ATM 内容管理系统，并带领六人团队打造共享外汇平台。'],
['less development time for new systems','新系統開發時間縮短','新系统开发时间缩短'],['6 months','6 個月','6 个月'],['faster forex platform launch','外匯平台提前上線','外汇平台提前上线'],
['Independent / Freelance','獨立接案','独立接案'],
['Designed backend systems, integrated enterprise services, and delivered cloud infrastructure and LLM-powered chatbot services.','設計後端系統、整合企業服務，並交付雲端基礎架構與 LLM 聊天機器人服務。','设计后端系统、集成企业服务，并交付云端基础架构与 LLM 聊天机器人服务。'],
['lower maintenance costs','維護成本降低','维护成本降低'],['faster end-to-end responses','端到端回應加快','端到端响应加快'],['LLM integrations','LLM 整合','LLM 集成'],
['Taipei Beitou Health Management Hospital','台北北投健康管理醫院','台北北投健康管理医院'],['Business Lecturer & IT Consultant','企業講師暨 IT 顧問','企业讲师暨 IT 顾问'],
['Trained 20 medical staff to build an iOS bulletin board app. Designed medical-image processing APIs to reduce database load and improve loading performance.','指導 20 位醫護人員開發 iOS 公告 App；設計醫療影像處理 API，降低資料庫負載並提升載入效能。','指导 20 位医护人员开发 iOS 公告 App；设计医疗影像处理 API，降低数据库负载并提升加载性能。'],
['faster image loading','影像載入加快','图像加载加快'],['staff trained','位人員完成培訓','位人员完成培训'],['API design','API 設計','API 设计'],
['University of Southern California','南加州大學','南加州大学'],['MS, Computer Science','資訊科學碩士','计算机科学硕士'],
['Graduate study in machine learning, deep learning and natural language processing, applied to projects like Mieru and SpotLite.','研究所主修機器學習、深度學習與自然語言處理，並應用在 Mieru、SpotLite 等專案。','研究生阶段主修机器学习、深度学习与自然语言处理，并应用在 Mieru、SpotLite 等项目。'],
['Machine Learning · Deep Learning','機器學習 · 深度學習','机器学习 · 深度学习'],['Natural Language Processing','自然語言處理','自然语言处理'],['Research','研究','研究'],
['Show achievements','查看成果','查看成果'],['Hide achievements','收起成果','收起成果'],
['CHAPTER 03 · GLOSSARY','第三章 · 詞條','第三章 · 词条'],
['Always curious,','永遠好奇，','永远好奇，'],['always building.','一直在做。','一直在做。'],
['noun','名詞','名词'],['Pronounce Wayne Wei','朗讀 Wayne Wei','朗读 Wayne Wei'],
['A backend engineer who turns complex systems into dependable, readable software.','把複雜系統變成可靠、好懂的軟體的後端工程師。','把复杂系统变成可靠、好懂的软件的后端工程师。'],
['Someone who builds a tool the moment something feels harder than it should.','一覺得「這不該這麼難」，就會動手做工具的人。','一觉得「这不该这么难」，就会动手做工具的人。'],
['informal','口語','口语'],
['The person behind Wayne Club: open-source projects, a homelab and far too many subtitle files.','Wayne Club 的主人：開源專案、一座家用伺服器，還有多到不行的字幕檔。','Wayne Club 的主人：开源项目、一台家用服务器，还有多到不行的字幕文件。'],
['SEE ALSO','參見','参见'],['builder · translator · tinkerer','創造者 · 翻譯者 · 愛動手的人','创造者 · 翻译者 · 爱动手的人'],
['Backend & AI','後端與 AI','后端与 AI'],['LLM integration','LLM 整合','LLM 集成'],['Data & Cloud','資料與雲端','数据与云'],['Apps & Interfaces','App 與介面','App 与界面'],
['2024 — 2026 · Machine Learning · Deep Learning · Natural Language Processing','2024 — 2026 · 機器學習 · 深度學習 · 自然語言處理','2024 — 2026 · 机器学习 · 深度学习 · 自然语言处理'],
['BS, Computer Science & Information Engineering','資訊工程學士','计算机科学与信息工程学士'],['National Cheng Kung University','國立成功大學','台湾成功大学'],
['CHAPTER 04 · CREDITS','第四章 · 片尾名單','第四章 · 片尾字幕'],
['Have something','有想一起','有想一起'],['worth building?','打造的東西嗎？','打造的东西吗？'],
['Backend systems, AI services or a tool that should exist. I’d love to hear about it.','後端系統、AI 服務，或一個早該存在的工具，都很歡迎聊聊。','后端系统、AI 服务，或一个早该存在的工具，都很欢迎聊聊。'],
['Copy email address','複製電子郵件','复制电子邮件'],['Email address copied','已複製電子郵件','已复制电子邮件'],['Could not copy. Please use the email link.','無法複製，請使用電子郵件連結。','无法复制，请使用电子邮件链接。'],
['Credits','片尾名單','片尾字幕'],['Directed by','導演','导演'],['Backend','後端','后端'],['Infrastructure','基礎架構','基础架构'],['Subtitles','字幕','字幕'],['Filmed in','拍攝地點','拍摄地点'],['Taipei · Los Angeles','台北 · 洛杉磯','台北 · 洛杉矶'],['Glass','玻璃特效','玻璃特效'],['CSS backdrop-filter & SVG displacement','CSS backdrop-filter 與 SVG 位移濾鏡','CSS backdrop-filter 与 SVG 位移滤镜'],['Special thanks','特別感謝','特别感谢'],['Everyone who starred a repository','每一位按下星標的你','每一位点亮星标的你'],
['Languages','語言','语言'],['Privacy & analytics','隱私與分析','隐私与分析'],['Back to top ↑','回到頂端 ↑','回到顶部 ↑'],
['Chapters','章節','章节'],['Pause motion','暫停動態效果','暂停动态效果'],['Play motion','播放動態效果','播放动态效果'],['Intro','開場','开场'],['Episodes','劇集','剧集'],
['Close','關閉','关闭'],
['Language and appearance preferences are stored only on this device.','語言與外觀偏好只會儲存在這台裝置上。','语言与外观偏好只会保存在这台设备上。'],
['With your permission, Google Analytics measures page visits and portfolio interactions. Advertising features are disabled. Query strings, email addresses and form contents are not sent as event data.','經你同意後，Google Analytics 會統計頁面造訪與作品互動。廣告功能已停用，查詢字串、電子郵件與表單內容都不會作為事件資料傳送。','经你同意后，Google Analytics 会统计页面访问与作品互动。广告功能已停用，查询字符串、电子邮件与表单内容都不会作为事件数据发送。'],
['This website has no contact form. Email links open your email application. The hosting and security providers may process technical request logs for delivery and abuse prevention.','本網站沒有聯絡表單，電子郵件連結會開啟你的郵件 App。主機與資安服務商可能為了傳送與防止濫用而處理技術請求紀錄。','本网站没有联系表单，电子邮件链接会打开你的邮件 App。主机与安全服务商可能为了传输与防止滥用而处理技术请求日志。'],
['Analytics cookies','分析 Cookie','分析 Cookie'],['Do not allow','不允許','不允许'],['Allow analytics','允許分析','允许分析'],
['Analytics is not currently enabled.','目前未啟用分析功能。','目前未启用分析功能。'],['You can change this choice at any time.','你可以隨時變更這個選擇。','你可以随时更改这个选择。'],
['Analytics choice','分析選項','分析选项'],['Allow optional analytics to help improve Wayne Club?','允許選用的分析功能，幫助改善 Wayne Club 嗎？','允许可选的分析功能，帮助改进 Wayne Club 吗？'],['No thanks','不用了','不用了'],
['Subtitles & language','字幕與語言','字幕与语言'],['Traditional Chinese','繁體中文','繁体中文'],['Simplified Chinese','簡體中文','简体中文'],['Default','預設','默认'],['Automatic','自動','自动'],['Follow device language','跟隨裝置語言','跟随设备语言'],
['PROJECT DETAILS','作品介紹','作品介绍'],['View on GitHub','在 GitHub 查看','在 GitHub 查看'],
['Language','語言','语言'],['Appearance','外觀','外观'],['Light','淺色','浅色'],['Dark','深色','深色']
];
window.wayneI18n = (() => {
  const dictionary = new Map(translations.map(row => [row[0], row]));
  const englishSource = new Map(translations.flatMap(row => row.map(text => [text, row[0]])));
  const toEnglish = source => {const key=source.trim();return englishSource.has(key)?source.replace(key,englishSource.get(key)):source;};
  const textSources = new WeakMap(), attributeSources = new WeakMap();
  let language = document.documentElement.lang;
  const t = source => dictionary.get(source)?.[['en','zh-Hant','zh-Hans'].indexOf(language)] ?? source;
  function translate(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest('script, style, [translate=no]')) continue;
      if (!textSources.has(node)) textSources.set(node, toEnglish(node.textContent));
      const source = textSources.get(node), key = source.trim();
      if (dictionary.has(key)) node.textContent = source.replace(key, t(key));
    }
    const elements = [root, ...root.querySelectorAll('[aria-label], [alt]')];
    elements.forEach(el => {
      if (!attributeSources.has(el)) attributeSources.set(el, Object.fromEntries(['aria-label','alt'].filter(a=>el.hasAttribute(a)).map(a=>[a,toEnglish(el.getAttribute(a))])));
      Object.entries(attributeSources.get(el)).forEach(([a,s]) => el.setAttribute(a,t(s)));
    });
  }
  function apply(preference = window.waynePreferences.read('wayne-language')) {
    language = ['en','zh-Hant','zh-Hans'].includes(preference) ? preference : window.waynePreferences.resolveLanguage(navigator.languages || [navigator.language]);
    document.documentElement.lang = language;
    translate();
    document.title = t('Wayne Club — Wayne Wei');
    document.querySelector('meta[name="description"]').content = t('Ting-Long (Wayne) Wei. Backend software engineer building reliable systems, AI-powered services, and open-source tools.');
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = document.querySelector('meta[name="description"]').content;
    window.dispatchEvent(new CustomEvent('wayne:language', {detail:language}));
  }
  return {t,translate,apply, get language(){return language;}};
})();
