(() => {
  "use strict";
  const allQuestions = window.NURSING_QUESTION_BANK || window.NURSING_QUESTIONS;
  const form = document.getElementById("quiz-form");
  const questionList = document.getElementById("question-list");
  const subjectOptions = document.getElementById("subject-options");
  const questionCount = document.getElementById("question-count");
  const availableCount = document.getElementById("available-count");
  const setupMessage = document.getElementById("setup-message");
  const startButton = document.getElementById("start-quiz");
  const session = document.getElementById("quiz-session");
  const progressLabel = document.getElementById("progress-label");
  const progressPercent = document.getElementById("progress-percent");
  const progressBar = document.getElementById("progress-bar");
  const progressFill = document.getElementById("progress-fill");
  const results = document.getElementById("results");
  const resultStats = document.getElementById("result-stats");
  const scoreSummary = document.getElementById("score-summary");
  const attemptTime = document.getElementById("attempt-time");
  const retryButton = document.getElementById("retry-button");
  const historyRows = document.getElementById("history-rows");
  const historyTable = document.getElementById("history-table");
  const historyEmpty = document.getElementById("history-empty");
  const historyMessage = document.getElementById("history-message");
  const exportButton = document.getElementById("export-csv");
  const storageKey = "nursingExamPracticeHistoryV1";
  const explanations = {
    1: { key: "流感病毒是 RNA 病毒；抗原移型是甲型流感病毒出現重大改變、產生新亞型的途徑之一，可能形成大流行。亞型依表面血球凝集素（HA）與 neuraminidase（NA）命名。", options: { A: "錯在 DNA：流感病毒的基因組為 RNA。", B: "錯在把乙型說成最易造成大流行；歷史上的流感大流行由新型甲型流感病毒造成。", C: "正確。抗原移型造成重大抗原變化，若具人傳人能力，可能引發大流行。", D: "錯在核蛋白；甲型流感亞型由 HA 與 NA 表面蛋白組合區分。" }, sources: [["CDC：流感病毒的抗原漂移與移型", "https://www.cdc.gov/flu/php/viruses/change.html"]] },
    2: { key: "醛固酮拮抗劑（如 spironolactone）在遠端腎元的集合管細胞阻斷礦物皮質素受體，減少鈉與水再吸收並減少鉀排出。", options: { A: "錯在遠曲小管；滲透性利尿劑主要在近端腎小管及亨利氏袢下降支發揮作用。", B: "錯在鈉—氫交換；環利尿劑主要抑制亨利氏袢粗上行支的 Na-K-2Cl 同向運輸。", C: "正確。醛固酮拮抗劑作用於遠端腎元與集合管。", D: "錯在近曲小管；鈉通道阻斷劑作用於遠端腎元的上皮鈉通道。" }, sources: [["NCBI：利尿劑作用機轉", "https://www.ncbi.nlm.nih.gov/books/NBK557838/"], ["NCBI：醛固酮生理作用", "https://www.ncbi.nlm.nih.gov/books/NBK470339/"]] },
    3: { key: "革蘭氏陽性菌的細胞壁具有較厚的 peptidoglycan，染色後保留結晶紫而呈紫色；革蘭氏陰性菌則有較薄的 peptidoglycan 與外膜，脂多醣是其外膜成分。", options: { A: "錯；革蘭氏陽性菌染色呈紫色，紅色通常是革蘭氏陰性菌的反染結果。", B: "錯；內膜加外膜是革蘭氏陰性菌的特徵。", C: "錯；脂多醣（LPS）位於革蘭氏陰性菌外膜。", D: "正確。革蘭氏陽性菌的 peptidoglycan 層較厚。" }, sources: [["NCBI：革蘭氏陽性菌", "https://www.ncbi.nlm.nih.gov/books/NBK470553/"]] },
    4: { key: "排卵後進入黃體期，黃體素促使子宮內膜腺體轉為分泌型，腺體內可見肝醣累積與分泌，為可能的著床環境作準備。", options: { A: "錯；月經時主要是功能層剝落，基底層仍保留並參與再生。", B: "錯；增生期內膜會在雌激素作用下增厚，並非沒有血管。", C: "錯；排卵後黃體期內膜繼續增厚並轉為分泌狀態。", D: "正確。分泌期腺體可累積並分泌肝醣。" }, sources: [["Endotext：月經週期與子宮內膜變化", "https://www.ncbi.nlm.nih.gov/books/NBK279054/"]] },
    5: { key: "病人尚在世時，家屬可能已開始預期性哀傷。評估家庭成員、互動與支持資源，可協助護理人員辨識誰需要陪伴、資訊或轉介。", options: { A: "錯；不應以減少探視、預先切斷依附作為哀傷支持策略。", B: "錯；哀傷歷程可在死亡前因預期失落而開始。", C: "正確。家庭關係與支持網絡評估有助於辨識支持需求。", D: "錯；適當且尊重意願地表達感受，能促進溝通與告別。" }, sources: [["ESMO：生命末期病人照護與家屬支持指引", "https://pmc.ncbi.nlm.nih.gov/articles/PMC8411064/"]] },
    6: { key: "依本題所採用的護理理念分類，將無私服務、克己奉獻與精神／靈性提升相連結，對應苦行僧主義。此題測的是理念分類用語。", options: { A: "正確。題幹突出不計報酬、犧牲個人利益以獲得精神與靈性昇華。", B: "浪漫主義著重理想、情感與人道關懷，並非本題所描述的克己奉獻分類。", C: "實用主義主要以實際效果與可行性衡量行動。", D: "存在主義強調個人存在、選擇與責任；題幹的關鍵線索是苦行與靈性奉獻。" } },
    7: { key: "本題依官方答案選 A。判讀時要留意它詢問的是「溝通管道的要件」，不是單獨判斷某一次訊息是否足夠即時；不同溝通架構對管道品質的分類用語可能略有差異。", options: { A: "官方答案。依本題分類，「即時」不是此處列出的必要管道要件。", B: "訊息應有傳達的必要性，避免不必要資訊干擾。", C: "組織成員容易取得訊息，有助訊息傳遞。", D: "直接且正式的管道可減少傳遞失真；本題以官方答案為準。" } },
    8: { key: "上肢無法使用時，可改測下肢血壓。測量膝膕動脈血壓需依適當姿勢與壓脈帶位置操作，俯臥可利於定位膝膕動脈；橈動脈通常用來評估脈搏，不是標準血壓測量部位。", options: { A: "錯；橈動脈常用於觸診脈搏，血壓需使用合適動脈與壓脈帶測量。", B: "錯；壓脈帶位置須配合膝膕動脈測量方法，不能把氣囊放在題述的大腿前側位置。", C: "錯；下肢收縮壓一般不會低於肱動脈，解讀需考量測量位置與病人狀況。", D: "正確。俯臥有助於進行膝膕動脈血壓測量。" } },
    9: { key: "急性中耳炎是否使用抗生素及療程長短，會依年齡、病情嚴重度與臨床評估決定；兒童常見指引並非一律 3～5 天。止痛退燒是症狀處理，鼓膜切開術只用於特定情況。", options: { A: "正確的錯誤選項。3～5 天不是所有急性中耳炎病人的通用抗生素療程，需依年齡與嚴重度決定。", B: "適當止痛與退燒可緩解不適。", C: "鼓膜切開術可在醫師評估後用於特定病況，不是常規人人施行。", D: "減充血劑並非急性中耳炎的普遍必要治療，且不應取代醫療評估。" }, sources: [["美國兒科醫學會：急性中耳炎診斷與處置指引", "https://publications.aap.org/pediatrics/article/131/3/e964/30912/The-Diagnosis-and-Management-of-Acute-Otitis-Media"]] },
    10: { key: "急性心包膜炎的典型胸痛常在平躺、深呼吸或咳嗽時加劇，坐起並前傾可能較舒服。因此不宜鼓勵平躺及深呼吸來減痛。", options: { A: "正確的不適宜措施；平躺與深呼吸可能加劇胸痛。", B: "發燒或症狀明顯時休息可降低活動負荷，依醫囑監測病情。", C: "阿斯匹靈屬抗發炎止痛藥，可依病因與醫囑使用。", D: "維持足夠營養有助恢復，但不是本題最不適宜的措施。" }, sources: [["美國心臟協會：心包膜炎症狀", "https://www.heart.org/en/health-topics/pericarditis/symptoms-and-diagnosis-of-pericarditis"]] },
    11: { key: "嗜鉻細胞瘤切除後，兒茶酚胺突然下降可能造成低血壓與低血糖，需密切監測血壓、血糖、出血、尿量及循環狀態，並依醫囑補充體液。固定把成人尿量維持在 20～25 mL／小時不適當，應依體重與臨床狀況評估。", options: { A: "雙側腎上腺切除或腎上腺功能不足時，需評估並依醫囑補充類固醇。", B: "正確的錯誤選項；20～25 mL／小時不是適用所有成人的固定目標，需依個別狀態判讀。", C: "術後須觀察出血與腸蠕動等恢復情形。", D: "切除後可能低血壓或血容量不足，依醫囑維持體液容積並監測反應。" }, sources: [["NCBI：嗜鉻細胞瘤手術與術後照護", "https://www.ncbi.nlm.nih.gov/books/NBK543229/"]] },
    12: { key: "T6 以上脊髓損傷者若因膀胱脹尿等刺激引發自主神經過度反射，可能出現突發嚴重高血壓、相對性心搏過緩、頭痛、視覺不適及出汗。題幹的高位損傷與尿滯留是關鍵線索。", options: { A: "神經性休克通常表現為低血壓，與題幹嚴重高血壓不符。", B: "正確。高位脊髓損傷、尿滯留、劇烈頭痛、出汗與高血壓符合自主神經過度反射。", C: "脊髓自動症不是題幹這組急性自主神經症狀的最佳診斷。", D: "脊髓休克主要是損傷後短期的反射與運動感覺功能抑制，非此處高血壓發作。" }, sources: [["EAU：神經泌尿學指引中的自主神經過度反射", "https://uroweb.org/guidelines/neuro-urology/chapter/the-guideline"], ["NSW Health：自主神經過度反射臨床指引", "https://aci.health.nsw.gov.au/__data/assets/pdf_file/0007/155149/ACI-Treatment-of-autonomic-dysreflexia-for-adults-and-adolescents-with-spinal-cord-injuries.pdf"]] },
    13: { key: "懷孕 10 週時，頸部透明帶與第一孕期血清標記屬早孕期篩檢選項；四合一血清篩檢通常在第二孕期進行，因此把甲型胎兒蛋白、β-hCG、抑制素 A、雌三醇組合放在 10 週不合時點。絨毛膜取樣屬診斷性檢查，不是篩檢。", options: { A: "正確的最不適當選項；四合一血清篩檢通常在第二孕期，不符合 10 週時點。", B: "頸部透明帶可在第一孕期安排，用於風險篩檢。", C: "β-hCG 與 PAPP-A 可作為第一孕期血清篩檢指標。", D: "絨毛膜取樣可取得胎盤組織做染色體診斷；它是診斷檢查，不是篩檢。" }, sources: [["ACOG：產前基因篩檢", "https://www.acog.org/womens-health/faqs/prenatal-genetic-screening-tests"]] },
    14: { key: "新生兒呼吸速率常見範圍約每分鐘 30～60 次，可有不規律呼吸及短暫週期性停頓；新生兒以腹式呼吸較常見，因此「胸式呼吸」是錯誤描述。", options: { A: "正確；30～60 次／分鐘是常見新生兒呼吸速率範圍。", B: "正確的錯誤選項；新生兒呼吸以腹部起伏較明顯，非典型胸式呼吸。", C: "新生兒呼吸節律可較不規則，仍需評估是否有窘迫徵象。", D: "短暫數秒的週期性呼吸停頓可出現；若停頓延長或伴發紺、呼吸費力則需評估。" }, sources: [["NCBI：新生兒生理", "https://www.ncbi.nlm.nih.gov/books/NBK499951/"]] },
    15: { key: "幼兒正在發展自主感，照護時可提供有限且真實的選擇，例如先量哪一側；但必要的檢查不應交由幼兒決定是否接受。先解釋並提供可控制的小選項較合適。", options: { A: "可先觀察嬰兒呼吸，再進行較可能造成哭鬧的測量，以免干擾呼吸評估。", B: "正確的錯誤選項；可給幼兒有限選擇，但不宜讓他決定是否接受必要檢查。", C: "學齡前兒童可能害怕身體受傷，照護時要維護身體完整感並事先說明。", D: "學齡兒童能理解較具體的說明，預先解釋可增進安全感與參與。" } },
    16: { key: "嬰兒胸外按壓位置在胸骨下半部、乳頭連線下方。單人嬰兒 CPR 的按壓與通氣比為 30：2；雙人兒科 CPR 才採 15：2。", options: { A: "先評估反應、呼吸與脈搏並啟動急救流程；不能只把兩口氣當成完整急救措施。", B: "嬰兒評估脈搏通常摸肱動脈，不以橈動脈為優先。", C: "正確。按壓在胸骨下半部，位置約在乳頭連線下方。", D: "錯；單人嬰兒 CPR 通常為 30：2，15：2 用於兩人施救的兒童／嬰兒 CPR。" }, sources: [["MedlinePlus：嬰兒 CPR", "https://medlineplus.gov/ency/article/000011.htm"], ["美國心臟協會：兒童基本救命術指引", "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-basic-life-support"]] },
    17: { key: "本題依卡普蘭危機理論常見的四階段名稱判讀。當原有因應方式失效、情緒與行為出現明顯紊亂時，屬紊亂期；激動與攻擊行為是題幹的關鍵線索。", options: { A: "衝擊期是危機事件初發、尚在初始反應的階段。", B: "崩潰期代表危機未解而功能嚴重耗竭，本題尚未提供此階段的典型描述。", C: "求助時期是動員外在資源的階段；本題重點是情緒與行為失序。", D: "正確。激動不安、攻擊家人並需急診處置，符合紊亂期的表現。" }, sources: [["International Journal of Mental Health Nursing：危機概念與 Caplan 階段整理", "https://onlinelibrary.wiley.com/doi/10.1111/inm.13412"]] },
    18: { key: "會心團體重視成員在團體互動中直接表達感受、增加自我覺察並調整人際行為。題幹強調言語表達、情緒探索與人格／行為改變，對應官方答案 B。", options: { A: "健康指導團體以健康知識與行為指導為主要目的。", B: "正確。會心團體藉由成員互動與表達促進自我覺察及行為調整。", C: "娛樂治療團體以活動參與和休閒經驗為主。", D: "生物回饋利用生理訊號提供回饋，與題幹的團體情緒探索不同。" } },
    19: { key: "總目標描述方案要達成的較廣泛方向；具體目標須能評量，常明確寫出對象、期限、行為或結果及達成程度。因此②、④正確。", options: { A: "錯；總目標通常較概括，並非一定量化；具體目標才應可測量。", B: "錯；①與③把總目標要求說得過於具體。", C: "正確。具體目標須可測量，並寫清楚對象、期限、內容與程度。", D: "錯；③描述的是具體目標的要素，不是總目標。" } },
    20: { key: "老年憂鬱症並不少見，也不是正常老化的一部分。年長者可能較常以疼痛、消化不適等身體主訴呈現，並可能有注意力、記憶或自殺風險等問題。", options: { A: "正確的錯誤選項；老年憂鬱症是常見健康問題，不應視為罕見或正常老化。", B: "憂鬱症患者的自殺風險需認真評估。", C: "部分患者會主訴記憶或注意力困難，須與其他疾病鑑別。", D: "年長者可能以身體不適表達憂鬱，臨床評估仍需了解情緒與功能。" }, sources: [["美國國家老化研究所：老年憂鬱症", "https://www.nia.nih.gov/health/depression-and-older-adults"]] }
  };

  let activeQuestions = [];
  let activeSubjects = [];
  let startedAt = "";
  let submitted = false;
  let activeAttempt = false;
  let cards = new Map();

  function addText(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function shuffle(items) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function buildSubjectOptions() {
    const counts = new Map();
    allQuestions.forEach((question) => counts.set(question.subject, (counts.get(question.subject) || 0) + 1));
    counts.forEach((count, subject) => {
      const label = document.createElement("label");
      label.className = "subject-choice";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = subject;
      checkbox.checked = true;
      checkbox.addEventListener("change", updateQuestionCountOptions);
      const text = addText("span", "", subject + "（" + count + " 題）");
      label.append(checkbox, text);
      subjectOptions.append(label);
    });
    updateQuestionCountOptions();
  }

  function getSelectedSubjects() {
    return Array.from(subjectOptions.querySelectorAll("input:checked"), (input) => input.value);
  }

  function getAvailableQuestions(subjects) {
    const selected = new Set(subjects);
    return allQuestions.filter((question) => selected.has(question.subject));
  }

  function updateQuestionCountOptions() {
    const previous = Number(questionCount.value) || Math.min(allQuestions.length, 20);
    const subjects = getSelectedSubjects();
    const available = getAvailableQuestions(subjects).length;
    availableCount.textContent = "目前可抽 " + available + " 題（可選 5～80 題；題庫共 " + allQuestions.length + " 題）";
    questionCount.replaceChildren();
    if (subjects.length === 0) {
      questionCount.add(new Option("請先勾選科目", ""));
      questionCount.disabled = true;
      startButton.disabled = true;
      setupMessage.textContent = "請至少勾選一個科目。";
      return;
    }
    questionCount.disabled = false;
    startButton.disabled = false;
    for (let count = 5; count <= 80; count++) questionCount.add(new Option(count + " 題", String(count)));
    questionCount.value = String(Math.max(5, Math.min(previous, 80)));
    updateSetupMessage();
  }

  function updateSetupMessage() {
    const subjects = getSelectedSubjects();
    setupMessage.textContent = subjects.length > 1
      ? "多科測驗會平均分配題數；無法整除的餘數會依勾選順序分配。"
      : "將從所選科目隨機抽題，題目不重複。";
  }
  function drawBalancedQuestions(subjects, count) {
    const baseCount = Math.floor(count / subjects.length);
    const extraCount = count % subjects.length;
    const drawn = [];
    subjects.forEach((subject, index) => {
      const pool = allQuestions.filter((question) => question.subject === subject);
      const subjectCount = baseCount + (index < extraCount ? 1 : 0);
      drawn.push(...shuffle(pool).slice(0, subjectCount));
    });
    return shuffle(drawn);
  }
  function renderQuestions() {
    questionList.replaceChildren();
    cards = new Map();
    activeQuestions.forEach((question, index) => {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "question-card";
      fieldset.dataset.number = String(question.number);
      const legend = document.createElement("legend");
      const top = document.createElement("div");
      top.className = "question-top";
      top.append(addText("span", "question-number", "第 " + (index + 1) + " 題"));
      legend.append(top);
      fieldset.append(legend, addText("p", "question-stem", question.stem));

      const optionList = document.createElement("div");
      optionList.className = "options";
      Object.entries(question.options).forEach(([letter, text]) => {
        const label = document.createElement("label");
        label.className = "option";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "question-" + question.number;
        input.value = letter;
        input.setAttribute("aria-label", "第 " + (index + 1) + " 題，" + letter + "，" + text);
        input.addEventListener("change", updateProgress);
        label.append(input, addText("span", "option-letter", "(" + letter + ")"), addText("span", "option-text", text));
        optionList.append(label);
      });
      fieldset.append(optionList);

      const source = document.createElement("div");
      source.className = "question-meta";
      source.append(
        addText("span", "", question.year + " 年・" + question.session + "・" + question.examName + "（" + question.examCode + "）"),
        addText("span", "", question.subject),
        addText("span", "", "原卷第 " + question.originalNumber + " 題・PDF 第 " + (question.pdfPage || "待查") + " 頁"),
        addText("span", "", question.practiceReady ? "題幹與選項已核對" : "擷取文字尚待核對原卷")
      );
      const sourceLink = document.createElement("a");
      sourceLink.href = question.sourceUrl;
      sourceLink.target = "_blank";
      sourceLink.rel = "noopener noreferrer";
      sourceLink.textContent = "考選部試題查詢入口 ↗";
      sourceLink.textContent = question.practiceReady ? "考選部原始試題 PDF ↗" : "原始試題 PDF（文字待核對） ↗";
      source.append(sourceLink);
      if (question.queryUrl) {
        const queryLink = document.createElement("a");
        queryLink.href = question.queryUrl;
        queryLink.target = "_blank";
        queryLink.rel = "noopener noreferrer";
        queryLink.textContent = "考選部試題與答案查詢入口 ↗";
        source.append(queryLink);
      }
      fieldset.append(source);
      questionList.append(fieldset);
      cards.set(question.number, fieldset);
    });
    progressBar.setAttribute("aria-valuemax", String(activeQuestions.length));
    updateProgress();
  }

  function updateProgress() {
    const answered = activeQuestions.reduce((count, question) => count + (form.querySelector('input[name="question-' + question.number + '"]:checked') ? 1 : 0), 0);
    const total = activeQuestions.length;
    const percent = total ? Math.round(answered / total * 100) : 0;
    progressLabel.textContent = "已作答 " + answered + " / " + total + " 題";
    progressPercent.textContent = percent + "%";
    progressBar.setAttribute("aria-valuenow", String(answered));
    progressFill.style.width = percent + "%";
  }

  function stat(label, value) {
    const box = document.createElement("div");
    box.className = "stat";
    box.append(addText("strong", "", String(value)), addText("span", "", label));
    return box;
  }

  function renderExplanation(question, card) {
    const data = explanations[question.explanationKey || question.number];
    const section = document.createElement("section");
    section.className = "explanation";
    if (!data) {
      section.setAttribute("aria-label", "解析狀態");
      section.append(addText("h3", "", "本題解析狀態"));
      section.append(addText("p", "", "本題題文尚未逐題對照原始 PDF；為避免提供錯誤解析，目前僅顯示題庫所載官方答案與來源。"));
      card.append(section);
      return;
    }
    section.setAttribute("aria-label", "AI 輔助學習解析，非官方");
    section.append(addText("h3", "", "AI 輔助學習解析（非官方）"));
    section.append(addText("p", "", data.key));
    const list = document.createElement("ul");
    Object.entries(question.options).forEach(([letter]) => {
      const item = document.createElement("li");
      const prefix = document.createElement("strong");
      prefix.textContent = "(" + letter + ") " + (letter === question.answer ? "官方正解：" : "");
      item.append(prefix, document.createTextNode(data.options[letter] || "請以官方答案為準。"));
      list.append(item);
    });
    section.append(list);
    if (data.sources?.length) {
      const links = document.createElement("div");
      links.className = "explanation-sources";
      data.sources.forEach(([label, url]) => {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.textContent = "補充參考：" + label + " ↗";
        links.append(anchor);
      });
      section.append(links);
    }
    card.append(section);
  }
  function localDateTime(iso) {
    return new Date(iso).toLocaleString("zh-TW", { hour12: false });
  }

  function readHistory() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      historyMessage.textContent = "無法讀取本機紀錄；請確認瀏覽器允許此網站使用本機儲存空間。";
      return [];
    }
  }

  function writeHistory(record) {
    try {
      const entries = readHistory();
      entries.unshift(record);
      localStorage.setItem(storageKey, JSON.stringify(entries));
      historyMessage.textContent = "本次成績已保存於此瀏覽器。";
      return true;
    } catch (error) {
      historyMessage.textContent = "本次成績已計算，但瀏覽器無法保存紀錄；可立即匯出 CSV 留存。";
      return false;
    }
  }

  function renderHistory() {
    const entries = readHistory();
    historyRows.replaceChildren();
    entries.forEach((record) => {
      const row = document.createElement("tr");
      const values = [
        localDateTime(record.completedAt),
        record.questionCount + " 題",
        record.subjects.join("、"),
        record.correct + "／" + record.wrong,
        record.score + "／" + record.maxScore + " 分"
      ];
      values.forEach((value) => row.append(addText("td", "", value)));
      historyRows.append(row);
    });
    historyTable.hidden = entries.length === 0;
    historyEmpty.hidden = entries.length > 0;
    exportButton.disabled = entries.length === 0;
    return entries;
  }

  function csvCell(value) {
    return '"' + String(value).replace(/"/g, '""') + '"';
  }

  function exportHistory() {
    const entries = renderHistory();
    if (!entries.length) return;
    const header = ["測驗開始時間", "交卷時間", "題數", "科目", "答對題數", "答錯題數", "得分", "滿分"];
    const rows = entries.map((record) => [
      localDateTime(record.startedAt), localDateTime(record.completedAt), record.questionCount,
      record.subjects.join("、"), record.correct, record.wrong, record.score, record.maxScore
    ]);
    const csv = "\uFEFF" + [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "護理師國考測驗成績單-" + new Date().toISOString().slice(0, 10) + ".csv";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    historyMessage.textContent = "已匯出目前瀏覽器保存的全部測驗紀錄。";
  }

  function startQuiz(force = false) {
    if (activeAttempt && !submitted && !force) {
      if (!window.confirm("重新開始會捨棄目前尚未交卷的作答，確定要重新抽題嗎？")) return;
    }
    const subjects = getSelectedSubjects();
    const pool = getAvailableQuestions(subjects);
    const count = Number(questionCount.value);
    if (!pool.length || count < 5 || count > 80) {
      setupMessage.textContent = "請至少勾選一個科目，並選擇有效題數。";
      return;
    }
    setupMessage.textContent = "";
    activeSubjects = subjects;
    activeQuestions = drawBalancedQuestions(subjects, count);
    startedAt = new Date().toISOString();
    submitted = false;
    activeAttempt = true;
    form.reset();
    results.hidden = true;
    resultStats.replaceChildren();
    scoreSummary.textContent = "";
    attemptTime.textContent = "";
    document.getElementById("submit-hint").textContent = "作答完成後即可交卷查看分數與解析。";
    form.querySelector('[type="submit"]').disabled = false;
    renderQuestions();
    session.hidden = false;
    session.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function submitQuiz() {
    if (submitted || !activeQuestions.length) return;
    const answers = activeQuestions.map((question) => {
      const selected = form.querySelector('input[name="question-' + question.number + '"]:checked');
      return selected ? selected.value : "";
    });
    const unanswered = answers.filter((answer) => !answer).length;
    if (unanswered > 0 && !window.confirm("還有 " + unanswered + " 題未作答。未作答題目會計為錯誤，仍要交卷嗎？")) return;

    submitted = true;
    const completedAt = new Date().toISOString();
    const correct = activeQuestions.reduce((sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0), 0);
    const wrong = activeQuestions.length - correct;
    const maxScore = activeQuestions.length * 5;
    const score = correct * 5;

    activeQuestions.forEach((question, index) => {
      const card = cards.get(question.number);
      const chosen = answers[index];
      card.classList.add(chosen ? (chosen === question.answer ? "result-correct" : "result-incorrect") : "result-blank");
      card.querySelectorAll("input").forEach((input) => {
        input.disabled = true;
        const label = input.closest(".option");
        if (input.value === question.answer) label.classList.add("is-answer");
        if (chosen && input.checked && chosen !== question.answer) label.classList.add("is-picked-wrong");
      });
      card.append(addText("p", "feedback", (chosen ? "你的答案：" + chosen + "　｜　" : "未作答　｜　") + "官方答案：" + question.answer + (question.answerBasis ? "（" + question.answerBasis + "）" : "")));
      renderExplanation(question, card);
    });

    attemptTime.textContent = "開始時間：" + localDateTime(startedAt) + "　｜　交卷時間：" + localDateTime(completedAt);
    scoreSummary.textContent = "答對 " + correct + " 題、答錯 " + wrong + " 題。每題 5 分，滿分 " + maxScore + " 分。";
    resultStats.replaceChildren(stat("本次得分", score + "／" + maxScore + " 分"), stat("答對題數", correct + "／" + activeQuestions.length), stat("答錯題數", wrong + "／" + activeQuestions.length));
    results.hidden = false;
    document.getElementById("submit-hint").textContent = "已完成本次作答。";
    form.querySelector('[type="submit"]').disabled = true;

    const record = { startedAt, completedAt, questionCount: activeQuestions.length, subjects: activeSubjects.slice(), correct, wrong, score, maxScore };
    writeHistory(record);
    renderHistory();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitQuiz();
  });
  startButton.addEventListener("click", () => startQuiz());
  retryButton.addEventListener("click", () => startQuiz(true));
  exportButton.addEventListener("click", exportHistory);
  questionCount.addEventListener("change", updateSetupMessage);

  buildSubjectOptions();
  renderHistory();
})();