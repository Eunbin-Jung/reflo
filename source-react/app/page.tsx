"use client";

import { useMemo, useRef, useState } from "react";
import { PlannedProcessPage } from "./process";

type View = "home" | "projects" | "process" | "report";

type ReportSection = {
  id: string;
  eyebrow?: string;
  title: string;
  text: string;
  source: string;
  citation: number;
  rewrite: string;
};

const processSteps = [
  { no: "01", title: "프로젝트 설정", short: "기업·분기·기준일", group: "작업 설정" },
  { no: "02", title: "필수 파일 검사", short: "PDF·Excel 적합성", group: "작업 설정" },
  { no: "03", title: "입력 파일 분석", short: "PDF 양식·Excel 구조", group: "작업 설정" },
  { no: "04", title: "투자의견·가설", short: "잠정 판단과 검증 항목", group: "리서치 설계" },
  { no: "05", title: "리서치 계획", short: "조사 항목·자료 업로드", group: "리서치 설계" },
  { no: "06", title: "자료 수집 현황", short: "원천별 수집 상태", group: "자료 수집·검증" },
  { no: "07", title: "데이터 검증", short: "정규화·충돌 해결", group: "자료 수집·검증" },
  { no: "08", title: "미래 실적 가정", short: "가정 승인·수정", group: "추정·밸류에이션" },
  { no: "09", title: "Excel 업데이트", short: "재계산·입력 검증", group: "추정·밸류에이션" },
  { no: "10", title: "PER 밸류에이션", short: "Target PER 승인", group: "추정·밸류에이션" },
  { no: "11", title: "근거 종합 검토", short: "데이터·원문 확인", group: "판단" },
  { no: "12", title: "최종 판단", short: "가설·투자의견 확정", group: "판단" },
  { no: "13", title: "보고서 구성안", short: "논리·블록·생성 방식", group: "판단" },
];

const progressGroups = [
  { no: "01", title: "작업 설정", copy: "기업·기준일·기존 파일 연결" },
  { no: "02", title: "리서치 설계", copy: "가설과 필요한 자료 범위 설정" },
  { no: "03", title: "자료 수집·검증", copy: "공식 자료 우선 수집과 교차 검증" },
  { no: "04", title: "추정·밸류에이션", copy: "미래 가정·Excel 업데이트·PER" },
  { no: "05", title: "판단", copy: "근거 검토와 최종 투자의견 확정" },
  { no: "06", title: "작성·완료", copy: "보고서 생성·편집·최종 점검" },
];

const initialSections: ReportSection[] = [
  {
    id: "summary",
    eyebrow: "INVESTMENT SUMMARY",
    title: "AI 서버 수요가 이끄는 수익성 개선",
    text: "2026년 2분기 매출액은 2조 8,420억원, 영업이익은 2,380억원으로 시장 기대치를 상회했다. 고부가 MLCC와 패키지 기판의 제품 믹스 개선이 실적 개선을 이끌었으며, 하반기에도 AI 서버 수요 확대가 이어질 전망이다.",
    source: "DART 잠정실적 · IR 자료 p.6",
    citation: 1,
    rewrite: "MLCC 고부가 제품 믹스 개선으로 2분기 영업이익은 컨센서스를 상회했다. 하반기 AI 서버 수요 확대가 추가적인 이익 개선을 이끌 전망이다.",
  },
  {
    id: "earnings",
    eyebrow: "01 EARNINGS REVIEW",
    title: "컨센서스를 웃돈 2분기 실적",
    text: "영업이익은 전년 동기 대비 14.8% 증가하며 컨센서스 2,210억원을 7.7% 상회했다. 컴포넌트 부문은 산업·전장용 MLCC 출하 증가와 우호적인 환율 효과가 동시에 반영됐다.",
    source: "DART 2026.07.16 · FnGuide 컨센서스",
    citation: 2,
    rewrite: "2분기 영업이익은 2,380억원으로 컨센서스를 7.7% 상회했다. 산업·전장용 MLCC 출하 증가와 환율 효과가 컴포넌트 부문의 수익성을 높였다.",
  },
  {
    id: "outlook",
    eyebrow: "02 OUTLOOK",
    title: "하반기 AI 서버향 수요 확대",
    text: "북미 고객사의 AI 서버 투자 확대에 따라 고용량 MLCC와 FCBGA 수요가 견조할 것으로 예상한다. 다만 스마트폰 회복 속도와 원재료 가격 변동은 추가 확인이 필요한 변수다.",
    source: "기업 IR p.12 · 산업협회 6월 데이터",
    citation: 3,
    rewrite: "AI 서버 투자 확대가 고용량 MLCC와 FCBGA 수요를 지지할 전망이다. 스마트폰 회복 지연과 원재료 가격 변동은 하반기 수익성의 핵심 리스크다.",
  },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`} aria-label="REFLO">
      <img src="/reflo-logo.svg" alt="" />
      <div>
        <strong>REFLO</strong>
        {!compact && <span>Research, in one flow.</span>}
      </div>
    </div>
  );
}

function Status({ children, tone = "lime" }: { children: React.ReactNode; tone?: "lime" | "blue" | "violet" | "amber" | "gray" | "red" }) {
  return <span className={`status status-${tone}`}>{children}</span>;
}

function AppHeader({ view, setView, saved }: { view: View; setView: (view: View) => void; saved?: boolean }) {
  const isProjectWorkspace = view === "process" || view === "report";
  return (
    <header className="app-header">
      <button className="logo-button" onClick={() => setView("home")} aria-label="홈으로 이동">
        <Logo compact />
      </button>
      <nav className="top-nav" aria-label="주요 화면">
        {isProjectWorkspace ? <>
          <button className={view === "process" ? "active" : ""} onClick={() => setView("process")}>Process</button>
          <button className={view === "report" ? "active" : ""} onClick={() => setView("report")}>Report</button>
        </> : <>
          <button className={view === "home" ? "active" : ""} onClick={() => setView("home")}>Home</button>
          <button className={view === "projects" ? "active" : ""} onClick={() => setView("projects")}>Project</button>
        </>}
      </nav>
      <div className="header-actions">
        {isProjectWorkspace && <span className="project-name">{view === "process" ? "새 리서치" : "삼성전기 · 2026 2Q"}</span>}
        {saved && <span className="saved-dot"><i /> 자동 저장됨</span>}
        <button className="icon-button" aria-label="도움말">?</button>
        <button className="avatar" aria-label="사용자 메뉴">JE</button>
      </div>
    </header>
  );
}

function HomePage({ setView, setStep }: { setView: (view: View) => void; setStep: (step: number) => void }) {
  const startNew = () => {
    setStep(0);
    setView("process");
  };

  return (
    <div className="home-page">
      <AppHeader view="home" setView={setView} />
      <main>
        <section className="home-hero">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <p className="hero-kicker">RESEARCH WORKSPACE</p>
          <h1>리서치의 모든 과정을<br />하나의 흐름으로.</h1>
          <p className="hero-copy">근거 수집부터 수치 검증, 보고서 작성까지.<br />판단에 더 집중할 수 있는 리서치 워크스페이스</p>
          <button className="hero-cta" onClick={startNew}>
            <span className="plus">+</span>
            새 리서치 추가하기
          </button>
          <div className="hero-meta"><span>공식 자료 우선</span><i /><span>수치 교차 검증</span><i /><span>근거 연결</span></div>
        </section>

        <section className="workflow-section">
          <div className="section-heading workflow-heading">
            <div><p className="eyebrow">RESEARCH FLOW</p><h2>리서치 진행 단계</h2></div>
            <p>복잡한 업무를 익숙한 문서형 흐름으로 진행하고,<br />필요할 때 전체 연결 구조를 확인하세요.</p>
          </div>
          <div className="workflow-grid">
            {progressGroups.map((group) => (
              <div key={group.no} className="workflow-card static-card">
                <span>{group.no}</span><h3>{group.title}</h3><p>{group.copy}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer><Logo compact /><p>데이터는 정확하게, 리서치는 가볍게.</p><span>REFLO Prototype · 2026</span></footer>
    </div>
  );
}

function ProjectsPage({ setView, setStep }: { setView: (view: View) => void; setStep: (step: number) => void }) {
  const [projectFilter, setProjectFilter] = useState("전체");
  const [projectSearch, setProjectSearch] = useState("");
  const projects = [
    { company:"삼성전기", code:"009150 · KOSPI", title:"2026 2Q Review", meta:"IT 제조업 · 실적 Review", initial:"삼", stage:"데이터 검증", progress:48, status:"자료 검증 중", tone:"blue", time:"10분 전", action:"계속하기", view:"process" },
    { company:"SK하이닉스", code:"000660 · KOSPI", title:"2026 1Q Review", meta:"반도체 · 실적 Review", initial:"S", stage:"보고서 편집", progress:82, status:"초안 편집 중", tone:"violet", time:"어제", action:"계속하기", view:"report" },
    { company:"LG이노텍", code:"011070 · KOSPI", title:"2025 4Q Review", meta:"전자부품 · 실적 Review", initial:"L", stage:"완료", progress:100, status:"내보내기 완료", tone:"lime", time:"3일 전", action:"열기", view:"report" },
  ];
  const startNew = () => { setStep(0); setView("process"); };
  return <div className="projects-page">
    <AppHeader view="projects" setView={setView} />
    <main className="projects-main">
      <section className="projects-hero"><div><p>AI RESEARCH WORKSPACE</p><h1>Project</h1><span>검증된 데이터와 근거를 연결해 실적 Review를 완성하세요.</span></div><button onClick={startNew}><i>＋</i> 새 리서치 추가하기</button></section>
      <section className="projects-metrics">
        <div><span>진행 중</span><strong>2</strong><small>검토가 필요한 프로젝트</small></div>
        <div><span>이번 달 완료</span><strong>7</strong><small>평균 작성 시간 3.2일</small></div>
        <div><span>검토 대기</span><strong className="orange">12</strong><small>사용자 확인 항목</small></div>
        <div className="connection"><i>♢</i><span><strong>98.7%</strong><small>전체 출처 연결률</small></span></div>
      </section>
      <section className="projects-records light-records">
        <div className="records-heading"><div><h2>최근 프로젝트 <small>3개의 프로젝트</small></h2></div><div className="record-tools"><label><span>⌕</span><input value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} placeholder="기업명 또는 종목코드 검색" /></label><select aria-label="분기 필터"><option>전체 분기</option><option>2026 2Q</option><option>2026 1Q</option><option>2025 4Q</option></select><select aria-label="상태 필터" value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}><option>전체</option><option>진행 중</option><option>완료</option></select></div></div>
        <div className="record-table"><div className="record-table-head"><span>기업</span><span>리포트</span><span>현재 상태</span><span>진행률</span><span>마지막 수정</span><span /></div>
          {projects.filter((item) => (projectFilter === "전체" || (projectFilter === "완료" ? item.progress === 100 : item.progress < 100)) && (`${item.company} ${item.code}`.includes(projectSearch))).map((item) => <div className="record-row" key={item.company}><span className="record-company"><i>{item.initial}</i><span><strong>{item.company}</strong><small>{item.code}</small></span></span><span className="record-report"><strong>{item.title}</strong><small>{item.meta}</small></span><span className="record-status"><Status tone={item.tone as "lime" | "blue" | "violet"}>{item.status}</Status><small>{item.stage}</small></span><span className="record-progress"><span><i><b style={{ width: `${item.progress}%` }} /></i><b>{item.progress}%</b></span></span><span className="record-time">{item.time}</span><span className="record-actions"><button onClick={() => { if (item.view === "process") setStep(6); setView(item.view as View); }}>{item.action}</button><button aria-label="프로젝트 메뉴">•••</button></span></div>)}
        </div>
      </section>
    </main>
  </div>;
}

function UploadCard({ title, accept, fileName, setFileName, hint }: { title: string; accept: string; fileName: string; setFileName: (name: string) => void; hint: string }) {
  return (
    <label className={`upload-card ${fileName ? "uploaded" : ""}`}>
      <input type="file" accept={accept} onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
      <div className="upload-icon">{fileName ? "✓" : "+"}</div>
      <strong>{fileName || title}</strong>
      <span>{fileName ? "파일 적합성 확인 완료" : hint}</span>
      {fileName && <Status>기업·형식 일치</Status>}
    </label>
  );
}

function ProcessContent({ step, company, setCompany, reportMode, setReportMode, setView }: {
  step: number;
  company: string;
  setCompany: (value: string) => void;
  reportMode: string;
  setReportMode: (value: string) => void;
  setView: (view: View) => void;
}) {
  const [pdf, setPdf] = useState("");
  const [excel, setExcel] = useState("");
  const [reference, setReference] = useState("");
  const [opinion, setOpinion] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const companies = [
    { name: "삼성전기", code: "009150", market: "KOSPI", sector: "전기전자" },
    { name: "삼성전자", code: "005930", market: "KOSPI", sector: "반도체·전자" },
    { name: "SK하이닉스", code: "000660", market: "KOSPI", sector: "반도체" },
    { name: "SK텔레콤", code: "017670", market: "KOSPI", sector: "통신" },
    { name: "LG이노텍", code: "011070", market: "KOSPI", sector: "전자부품" },
  ];
  const matches = company.trim().length >= 1 ? companies.filter((item) => `${item.name}${item.code}`.toLowerCase().includes(company.trim().toLowerCase())) : [];

  const toggleSource = (source: string) => {
    setSources((current) => current.includes(source) ? current.filter((item) => item !== source) : [...current, source]);
  };

  if (step === 0) {
    return (
      <div className="step-layout narrow-step">
        <div className="step-intro"><p>STEP 01 · 새 리서치 시작</p><h1>분석할 기업과 분기를 알려주세요.</h1><span>아직 입력된 정보가 없습니다. 먼저 기업을 선택한 뒤 분석 대상 분기와 보고서 기준일을 입력하면 리서치 범위가 만들어집니다.</span></div>
        <div className="search-box-large">
          <span className="search-symbol">⌕</span>
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="예: 삼, SK, 009150" autoFocus />
          <button type="button">검색</button>
        </div>
        {company.trim().length >= 1 && (
          <div className="search-results">
            <p className="result-caption">{matches.length ? `${matches.length}개 기업을 찾았습니다` : "일치하는 기업이 없습니다"}</p>
            {matches.map((item) => (
              <button key={item.code} className={company === item.name ? "selected" : ""} onClick={() => setCompany(item.name)}>
                <div className="company-logo small">{item.name.slice(0, 1)}</div>
                <div><strong>{item.name}</strong><span>{item.code} · {item.market} · {item.sector}</span></div>
                <i>{company === item.name ? "✓" : "→"}</i>
              </button>
            ))}
          </div>
        )}
        {companies.some((item) => item.name === company) && <div className="form-card scope-card"><div className="form-grid two"><label><span>분석 대상 연도</span><select defaultValue=""><option value="" disabled>연도 선택</option><option>2026</option><option>2025</option></select></label><label><span>분기</span><select defaultValue=""><option value="" disabled>분기 선택</option><option>1분기</option><option>2분기</option><option>3분기</option><option>4분기</option></select></label><label className="full"><span>보고서 기준일</span><input type="date" /></label></div><div className="info-row"><span>i</span><p>이 기준에 맞춰 공시·IR·시장 데이터를 수집하며, 연결·별도 기준이 다르면 검토 단계에서 표시합니다.</p></div></div>}
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="step-layout narrow-step">
        <div className="step-intro"><p>STEP 02</p><h1>과거 보고서와 Excel을 연결해주세요.</h1><span>이전에 작성한 실적 Review PDF와 서비스용 표준 모델 Excel을 올리면 파일 적합성과 구조를 확인합니다.</span></div>
        <div className="upload-grid"><UploadCard title="과거 실적 Review PDF" accept=".pdf" fileName={pdf} setFileName={setPdf} hint="PDF를 끌어놓거나 선택" /><UploadCard title="표준 모델 Excel" accept=".xlsx,.xls,.csv" fileName={excel} setFileName={setExcel} hint="Excel 또는 CSV를 선택" /></div>
        {pdf && excel ? <div className="analysis-card"><div><Status>적합성 검사 완료</Status><h3>두 파일을 이번 리서치에 연결할 수 있습니다.</h3></div><div className="analysis-metrics"><span><b>12개</b>보고서 블록</span><span><b>7개</b>Excel 시트</span><span><b>0건</b>차단 오류</span><span><b>2건</b>확인 권장</span></div></div> : <div className="empty-guidance"><span>i</span><p><strong>두 파일 모두 업로드해주세요.</strong> 업로드 전에는 분석 결과가 표시되지 않습니다.</p></div>}
      </div>
    );
  }

  if (step === 2) {
    return <div className="step-layout"><div className="step-intro"><p>STEP 03</p><h1>입력 파일 분석 결과를 확인하세요.</h1><span>업로드한 PDF의 페이지 양식과 과거 판단, Excel의 시트·수식·입력 영역을 서비스가 어떻게 이해했는지 보여줍니다.</span></div><div className="file-analysis-grid"><section className="form-card pdf-analysis"><div className="card-title-row"><h3>PDF 양식 분석</h3><Status>12개 블록 감지</Status></div><div className="pdf-wireframe"><aside>기업정보<br/>투자의견<br/>목표주가<br/>주가차트</aside><main><b>한 줄 결론</b><i>실적 요약 본문</i><i>실적표</i><i>차트·밸류에이션</i></main></div><dl><div><dt>이전 투자의견</dt><dd>BUY</dd></div><div><dt>이전 목표주가</dt><dd>198,000원</dd></div><div><dt>Target PER</dt><dd>14.2배</dd></div></dl></section><section className="form-card excel-analysis"><div className="card-title-row"><h3>Excel 구조 분석</h3><Status>지원 모델</Status></div>{[["03_Historical","과거 3년 실제치","312셀"],["04_Drivers","미래 실적 가정","18셀"],["05_Forecast","미래 2년 추정치","126셀"],["07_Valuation_PER","PER 밸류에이션","정상"],["_META","출처·셀 의미","정상"]].map((row)=><div className="sheet-row" key={row[0]}><b>{row[0]}</b><span>{row[1]}</span><small>{row[2]}</small></div>)}</section></div></div>;
  }

  if (step === 3) {
    return (
      <div className="step-layout">
        <div className="step-intro"><p>STEP 04</p><h1>잠정 투자의견과 투자 가설을 입력하세요.</h1><span>이 화면에서는 가설을 평가하지 않습니다. 이후 조사 방향을 정하기 위한 사용자의 현재 판단을 기록합니다.</span></div>
        <div className="hypothesis-reference-layout"><main><section className="opinion-card"><div className="section-mini-title"><i>01</i><span><b>잠정 투자의견</b><small>조사 방향을 정하는 의견이며 최종 판단이 아닙니다.</small></span></div><div className="opinion-options detailed">{[["BUY","매수 관점"],["HOLD","중립 관점"],["SELL","매도 관점"]].map(([item,copy]) => <button key={item} className={opinion === item ? "selected" : ""} onClick={() => setOpinion(item)}><i>{opinion===item?"✓":""}</i><strong>{item}</strong><small>{copy}</small></button>)}</div></section><section className="hypothesis-input-card"><div><span>이번 리포트에서 검증할 투자 가설</span><Status tone="blue">사용자 입력</Status></div><textarea value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} placeholder="예: AI 서버용 고부가 부품 수요가 하반기 수익성 개선을 이끌 것이다." /><small>{hypothesis.length} / 500 · AI가 지지·반박 자료를 모두 수집합니다.</small></section><section className="ai-question-breakdown"><div><b>✦ AI가 나눈 검증 항목</b><small>가설 저장 후 자동 생성</small></div>{["제품 가격이 상승했는가?","판매량이 회복됐는가?","영업이익이 기대를 상회했는가?","하반기 수익성이 개선되는가?"].map((q,i)=><div key={q}><i>{i+1}</i><span>{q}</span><button>수정</button><button aria-label={`${q} 삭제`}>×</button></div>)}</section></main><aside className="past-report-reference"><p>LAST REPORT</p><h3>과거 보고서 참고</h3><dl><div><dt>투자의견</dt><dd>BUY</dd></div><div><dt>목표주가</dt><dd>210,000원</dd></div><div><dt>Target PER</dt><dd>14.2배</dd></div></dl><span>이전 가설</span><blockquote>AI 서버용 고부가 부품 수요와 제품 믹스 개선으로 수익성이 회복될 것이다.</blockquote><small>과거 의견은 참고 정보이며 이번 조사 결과에 따라 변경할 수 있습니다.</small></aside></div>
      </div>
    );
  }

  if (step === 5) {
    return <div className="step-layout"><div className="step-intro"><p>STEP 06</p><h1>자료 수집 현황을 확인하세요.</h1><span>코드 수집과 AI 해석을 구분하고, 실패·미확보 항목과 사용자 조치 필요 사항을 숨기지 않습니다.</span></div><section className="collection-dashboard"><div className="collection-dashboard-head"><span><i/>Research Agent가 자료를 처리하고 있습니다</span><strong>68%</strong></div><div className="collection-main-track"><i style={{width:"68%"}}/></div><div className="collection-kpis"><div><span>수집 자료</span><b>32</b><small>공시·IR·뉴스·산업</small></div><div><span>추출 데이터</span><b>124</b><small>정규화 대기 포함</small></div><div><span>중복 제거</span><b>4</b><small>유사 기사·문서</small></div><div><span>가설 분류</span><b>9 / 4 / 6</b><small>지지 / 반박 / 중립</small></div></div></section><div className="collection-detail-grid"><section className="collection-task-panel"><h3>작업 현황 <small>코드 수집과 AI 해석</small></h3>{[["DART 공시 수집","8건","완료"],["기업 IR 수집","4건","완료"],["산업 데이터 확인","3/5","처리 중"],["뉴스 관련성 분류","17/31","처리 중"],["컨센서스 접근","접근 실패","조치 필요"],["중복 제거","대기","대기"]].map(row=><div key={row[0]}><i className={row[2]==="완료"?"done":row[2]==="조치 필요"?"warn":"running"}>{row[2]==="완료"?"✓":"·"}</i><span><b>{row[0]}</b><small>{row[2]}</small></span><strong>{row[1]}</strong></div>)}</section><aside className="latest-materials"><h3>최근 수집 자료</h3>{[["DART","2분기 잠정실적 공시","2분 전"],["IR","실적발표 자료 p.8","4분 전"],["NEWS","고객사 재고 정상화 점검","7분 전"]].map(row=><button key={row[1]}><i>{row[0]}</i><span><b>{row[1]}</b><small>{row[2]}</small></span><em>›</em></button>)}<div className="collection-warning"><b>!</b><span><strong>컨센서스 원천 접근 실패</strong><small>보유 파일을 첨부하거나 해당 항목 없이 계속할 수 있습니다.</small></span><button>해결</button></div></aside></div></div>;
  }

  if (step === 4) {
    return (
      <div className="step-layout">
        <div className="step-intro"><p>STEP 05</p><h1>리서치 계획과 보유 자료를 확인하세요.</h1><span>가설을 검증할 조사 항목을 확인하고, 가지고 있는 자료만 원천별 카드에 업로드하세요. 비워둔 원천은 첨부 없이 진행됩니다.</span></div>
        <div className="research-plan-grid"><section className="form-card research-questions"><h3>조사 항목</h3>{["이번 분기 매출·영업이익·순이익", "컨센서스 대비 실적 차이", "제품 가격과 판매량 변화", "미래 Driver와 반박 근거"].map((q,i)=><div key={q}><i>{i+1}</i><span><b>{q}</b><small>{i<2?"실적 Review 필수":"투자 가설 기반"}</small></span><Status tone={i<2?"lime":"blue"}>{i<2?"필수":"가설"}</Status></div>)}</section><section className="source-upload-panel"><h3>자료 원천별 업로드 <small>선택 사항</small></h3><div className="source-upload-grid">{["DART 공시","기업 IR·컨퍼런스콜","KRX","금융 DB·컨센서스","산업 데이터","뉴스","경쟁사 자료","기타 참고자료"].map((source,i)=><label className="source-upload-card" key={source}><input type="file" accept=".doc,.docx,.pdf,.xlsx,.xls,.csv" onChange={() => setSources((current)=>current.includes(source)?current:[...current,source])}/><span className="upload-source-icon">{sources.includes(source)?"✓":"+"}</span><b>{source}</b><small>{sources.includes(source)?"파일 첨부됨":"Word·PDF·Excel·CSV"}</small></label>)}</div></section></div>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div className="step-layout">
        <div className="step-intro with-status"><div><p>STEP 07</p><h1>정규화한 데이터를 검증하세요.</h1><span>기간·단위·연결 기준을 맞춘 뒤 공식 원문과 교차 확인합니다. 충돌 값은 사용자가 직접 선택합니다.</span></div><div className="big-score"><strong>96</strong><span>/ 100<br />검증 신뢰도</span></div></div>
        <div className="metric-strip"><span><b>38</b>수집 자료</span><span><b>126</b>추출 데이터</span><span><b>117</b>확인 완료</span><span className="warning"><b>1</b>값 선택 필요</span></div>
        <div className="validation-table">
          <div className="table-header"><span>지표</span><span>값</span><span>기준</span><span>우선 출처</span><span>검증 상태</span></div>
          {[
            ["매출액", "2조 8,420억원", "2Q26 · 연결 · 분기", "DART 잠정실적", "확인 완료"],
            ["영업이익", "2,380억원", "2Q26 · 연결 · 분기", "DART 잠정실적", "확인 완료"],
            ["MLCC 매출", "1조 3,120억원", "2Q26 · 부문", "기업 IR p.6", "교차 확인"],
            ["컨센서스", "2,210억원", "2Q26 · 영업이익", "FnGuide", "확인 완료"],
          ].map((row, index) => <div className="table-row" key={row[0]}>{row.map((cell, i) => <span key={i}>{i === 4 ? <Status tone={index === 2 ? "amber" : "lime"}>{cell}</Status> : cell}</span>)}</div>)}
        </div>
        <div className="conflict-card"><div className="conflict-icon">!</div><div><Status tone="amber">값 선택 필요</Status><h3>MLCC 출하량 증감률</h3><p>DART에는 수치가 없고 기업 IR과 산업 데이터의 기준 기간이 다릅니다.</p></div><div className="conflict-options"><button className="selected"><span>기업 IR · 전년 동기 대비</span><b>+12.4%</b><i>사용</i></button><button><span>산업협회 · 전분기 대비</span><b>+8.1%</b><i>비교</i></button></div></div>
      </div>
    );
  }

  if (step === 7) {
    return (
      <div className="step-layout">
        <div className="step-intro"><p>STEP 08</p><h1>미래 실적 가정을 승인해주세요.</h1><span>AI가 판매량·ASP·환율·원가율 가정을 근거와 함께 제안합니다. 각 값은 승인·수정·거절할 수 있습니다.</span></div>
        <div className="process-columns estimate-columns assumption-reference-layout">
          <section className="form-card assumptions"><div className="card-title-row"><h3>미래 실적 가정</h3><Status tone="blue">AI 제안</Status></div>
            {["MLCC 출하량", "평균판매단가", "원/달러 환율", "원가율"].map((label, i) => <div className="assumption-row" key={label}><span>{label}<small>{["산업 데이터 3건", "기업 IR p.12", "한국은행 전망", "Excel 과거 추이"][i]}</small></span><input defaultValue={["+11.0%", "+3.5%", "1,365원", "72.0%"][i]} /><div className="assumption-actions"><button>승인</button><button>수정</button><button>거절</button></div></div>)}
          </section><aside className="assumption-basis-panel"><p>SELECTED DRIVER</p><h3>MLCC 출하량 · 3Q26</h3><div className="assumption-proposal"><span>AI 제안</span><strong>+11.0%</strong><small>이전 가정 +6.0%</small></div><h4>제안 근거 <b>3건</b></h4>{[["기업 가이던스","3분기 고부가 제품 출하 확대"],["산업 출하 데이터","6월 출하량 전월 대비 +7.2%"],["고객사 수요","신제품 출시로 주문 회복"]].map(row=><button key={row[0]}><i/><span><b>{row[0]}</b><small>{row[1]}</small></span><em>›</em></button>)}<div className="counter-evidence"><b>반대 근거 1건</b><p>일부 고객사의 범용 부품 재고는 여전히 높은 수준입니다.</p><button>원문 확인</button></div></aside>
        </div>
        <div className="impact-strip"><b>예상 영향</b><span>2026E 영업이익 <strong>+4.2%</strong></span><span>2026E EPS <strong>+3.8%</strong></span><span>영향 셀 <strong>18개</strong></span><small>확정값 적용 전 시뮬레이션</small></div>
      </div>
    );
  }

  if (step === 8) {
    return <div className="step-layout"><div className="step-intro"><p>STEP 09</p><h1>Excel 업데이트와 재계산 결과를 확인하세요.</h1><span>승인된 실제치와 미래 가정을 복사본에 입력하고, 수식·파일 무결성을 다시 검사했습니다.</span></div><div className="excel-run-card"><div className="excel-run-head"><span className="excel-icon">X</span><div><Status>재계산 완료</Status><h3>IT_Model_009150_v6.xlsx</h3><p>원본 파일은 변경하지 않았습니다.</p></div></div><div className="analysis-metrics"><span><b>24개</b>실제치 입력</span><span><b>18개</b>가정 입력</span><span><b>1,284개</b>수식 재계산</span><span><b>0건</b>무결성 오류</span></div><div className="excel-audit"><span>03_Historical!F10:F14</span><b>입력 완료</b><span>04_Drivers!G8:G15</span><b>입력 완료</b><span>07_Valuation_PER</span><b>재계산 완료</b></div></div></div>;
  }

  if (step === 9) {
    return <div className="step-layout"><div className="step-intro"><p>STEP 10</p><h1>PER 밸류에이션을 승인하세요.</h1><span>계산값과 판단값을 구분해 표시합니다. AI는 근거와 범위를 제안하고 사용자가 Target PER을 확정합니다.</span></div><div className="valuation-reference-layout"><section className="valuation-input-reference"><h3>밸류에이션 입력값</h3><div className="valuation-data-cards"><div><span>현재주가</span><b>159,000원</b><small>2026-07-17 기준</small></div><button><span>Forward EPS</span><b>13,200원</b><small>12M Forward · Excel 계산 ↗</small></button><div><span>이전 Target PER</span><b>14.2배</b><small>과거 PDF 추출</small></div></div><div className="ai-per-proposal"><span>✦ AI 제안</span><b>15.0배로 변경</b><p>고부가 제품 비중 확대와 이익 가시성 개선을 반영하면 이전보다 높은 배수가 타당합니다.</p><button>제안값 적용</button></div><label className="per-input"><span>사용자 Target PER *</span><div><input defaultValue="15.0"/><b>배</b></div><input type="range" min="8" max="24" step="0.1" defaultValue="15"/><small><i>8.0</i><i>이전 14.2</i><i>24.0</i></small></label><button className="approve-per-button">15.0배 사용자 승인</button></section><section className="valuation-result-reference"><p>PER VALUATION</p><span>계산 목표주가</span><strong>198,000원</strong><div><span>현재주가 대비 상승여력</span><b>+24.5%</b></div><section><i>13,200<small>Forward EPS</small></i><em>×</em><i>15.0<small>Target PER</small></i><em>=</em><i>198,000<small>목표주가</small></i></section><aside><b>최종 판단은 사용자가 확정합니다.</b><small>AI는 근거와 범위를 제안하고 계산은 Excel 수식으로 수행합니다.</small></aside><div className="valuation-ref-actions"><button>민감도 표</button><button>제안 근거</button></div></section></div></div>;
  }

  if (step === 10) {
    return <div className="step-layout"><div className="step-intro"><p>STEP 11</p><h1>근거 종합 검토</h1><span>가설을 평가하기 전에 실제치·미래 가정·EPS·목표주가와 원문을 한 화면에서 확인합니다.</span></div><div className="review-progress-reference"><b>핵심 항목 확인</b><span>5 / 7</span><i><em style={{width:"71%"}}/></i><button>남은 항목 모두 확인</button></div><div className="evidence-reference-layout"><aside className="review-filter-reference"><h3>검토 범위</h3>{[["실제 실적","3"],["컨센서스","1"],["산업 데이터","1"],["미래 가정","4"],["Excel 계산","2"],["PER 가치","2"],["가설 지지","5"],["가설 반박","2"],["충돌 기록","1"]].map((row,i)=><button className={i===0?"active":""} key={row[0]}><span>{row[1]}</span>{row[0]}</button>)}</aside><section className="review-list-reference"><div><b>데이터·자료</b><input placeholder="항목 검색"/></div>{[["실제 실적","매출액","DART · F12","2조 8,420억원"],["실제 실적","영업이익","DART · F13","2,380억원"],["컨센서스","컨센서스 대비","금융 DB · F18","+7.7%"],["미래 가정","MLCC 출하량","사용자 승인 · K31","+11.0%"],["Excel 계산","Forward EPS","Excel · K42","13,200원"],["PER 가치","Target PER","사용자 승인 · V08","15.0배"],["PER 가치","목표주가","계산 결과 · V12","198,000원"]].map((row,i)=><button className={i===1?"selected":""} key={row[1]}><small>{row[0]}</small><span><b>{row[1]}</b><em>{row[2]}</em></span><strong>{row[3]}</strong><i>{i<5?"✓ 확인":"미확인"}</i></button>)}</section><aside className="inline-evidence-reference"><div><Status tone="blue">DART</Status><span><b>영업이익 근거</b><small>DART · F13</small></span></div><p>선택한 데이터가 사용된 원문과 계산 과정입니다.</p><mark>영업이익 2,380억원</mark><p>기업·기간·단위·연결 기준을 확인했습니다.</p><dl><div><dt>값 종류</dt><dd>실제 실적</dd></div><div><dt>검증 상태</dt><dd>정상</dd></div><div><dt>Excel 셀</dt><dd>F13</dd></div></dl><button>원문 크게 보기</button></aside></div></div>;
  }

  if (step === 11) {
    return (
      <div className="step-layout">
        <div className="step-intro"><p>STEP 12</p><h1>가설과 최종 투자의견을 확정하세요.</h1><span>가설을 유지·수정·폐기하고 최종 투자의견과 목표주가를 사용자가 직접 확정합니다.</span></div>
        <div className="decision-reference-layout"><section className="ai-evaluation-reference"><div className="evaluation-reference-head"><i>✦</i><span><p>AI EVALUATION</p><h3>가설은 부분적으로 지지됩니다.</h3><small>실적 개선은 확인됐지만 3분기 출하 회복 속도는 추가 관찰이 필요합니다.</small></span><b>74%</b></div><div className="original-hypothesis"><span>최초 가설</span><p>제품 가격 상승과 판매량 회복으로 이번 분기 영업이익이 기대를 상회했으며, 하반기 수익성도 개선될 것이다.</p></div><div className="support-counter-grid"><section><h4><i>+</i> 지지 근거 <b>5건</b></h4><button><b>ASP와 출하량 동반 회복</b><span>ASP +2.8%, 출하량 QoQ +5.1%</span><em>›</em></button><button><b>영업이익 컨센서스 상회</b><span>실제 2,380억원 · 예상 2,210억원</span><em>›</em></button></section><section><h4><i>−</i> 반박 근거 <b>2건</b></h4><button><b>고객사 재고 부담 지속</b><span>범용 부품 재고 정상화 지연</span><em>›</em></button><button><b>환율 효과 포함</b><span>본업 개선폭을 일부 확대</span><em>›</em></button></section></div><div className="failure-condition-reference"><b>!</b><span><strong>가설이 틀리는 조건</strong><small>3분기 출하량 증가율이 0% 이하이거나 원가율이 72%를 상회하는 경우</small></span></div></section><section className="user-decision-reference"><h3>사용자 최종 결정</h3><p>AI 평가를 참고해 가설과 투자의견을 직접 확정하세요.</p><label><span>가설 처리</span><div className="decision-segment"><button className="active">유지</button><button>수정</button><button>폐기</button></div></label><label><span>최종 가설 *</span><textarea defaultValue="제품 가격과 판매량의 동반 회복으로 하반기 수익성이 개선될 것이다."/></label><label><span>최종 투자의견 *</span><div className="opinion-options compact">{["BUY", "HOLD", "SELL"].map((item) => <button key={item} className={opinion === item ? "selected" : ""} onClick={() => setOpinion(item)}>{opinion===item&&"✓ "}{item}</button>)}</div></label><div className="final-valuation-reference"><span><small>최종 목표주가</small><b>198,000원</b></span><span><small>상승여력</small><b>+24.5%</b></span><span><small>Target PER</small><b>15.0배</b></span></div><button className="additional-research-reference"><b>⌕ 추가 조사가 필요한가요?</b><small>새 자료가 숫자에 영향을 주면 이후 결과를 재검증합니다.</small><span>추가 조사 ›</span></button></section></div>
      </div>
    );
  }

  if (step === 12) return (
    <div className="step-layout final-step">
      <div className="step-intro"><p>STEP 13</p><h1>보고서 논리 구조와 생성 방식을 확인하세요.</h1><span>업로드 PDF에서 감지한 고정 레이아웃에 소제목·핵심 주장·표·차트·근거를 연결한 구성안입니다.</span></div>
      <div className="report-outline-plan">{[["01","제목·한 줄 결론","AI 서버 수요가 이끄는 수익성 개선","근거 3개"],["02","투자의견·목표주가","BUY · 198,000원 · 상승여력 24.5%","계산 2개"],["03","이번 분기 실적","매출·영업이익·컨센서스 비교","표 1개"],["04","사업부문·미래 전망","MLCC 매출과 영업이익률 추이","차트 2개"],["05","밸류에이션·리스크","Target PER과 하방 위험","근거 4개"]].map(row=><button key={row[0]}><i>{row[0]}</i><span><b>{row[1]}</b><small>{row[2]}</small></span><Status tone="blue">{row[3]}</Status><em>편집</em></button>)}</div>
      <div className="final-settings-grid one-column">
        <section className="form-card generation-card">
          <div className="card-title-row"><h3>리포트 생성 방식</h3><span className="required">필수 선택</span></div>
          <button className={reportMode === "draft" ? "generation-option selected" : "generation-option"} onClick={() => setReportMode("draft")}><div className="generation-icon">AI</div><span><strong>AI 초안 작성글 포함 생성</strong><small>소제목, 핵심 주장과 본문 초안을 근거와 함께 작성합니다. 생성 후 직접 수정할 수 있습니다.</small><em>빠른 초안이 필요할 때 추천</em></span><i>{reportMode === "draft" ? "●" : "○"}</i></button>
          <button className={reportMode === "structure" ? "generation-option selected" : "generation-option"} onClick={() => setReportMode("structure")}><div className="generation-icon outline">T</div><span><strong>AI 작성글 없이 텍스트 영역만 생성</strong><small>확정한 보고서 구조와 차트 자리만 만들고 본문은 비워둡니다.</small><em>문장을 직접 작성하고 싶을 때</em></span><i>{reportMode === "structure" ? "●" : "○"}</i></button>
          <div className="generate-summary"><span>생성 범위</span><p>기존 보고서 레이아웃 · 소제목 4개 · 표 2개 · 차트 3개 · 출처 18개</p></div>
        </section>
      </div>
      <button className="generate-report-button" disabled={!reportMode} onClick={() => setView("report")}><span className="spark">✦</span>{reportMode ? "보고서 생성하기" : "리포트 생성 방식을 선택해주세요"}<i>→</i></button>
    </div>
  );

  return null;
}

function ProcessPage({ setView, step, setStep, company, setCompany, reportMode, setReportMode }: {
  setView: (view: View) => void;
  step: number;
  setStep: (step: number) => void;
  company: string;
  setCompany: (company: string) => void;
  reportMode: string;
  setReportMode: (mode: string) => void;
}) {
  const selectedCompany = ["삼성전기", "삼성전자", "SK하이닉스", "SK텔레콤", "LG이노텍"].includes(company);
  const canNext = step !== 0 || selectedCompany;

  return (
    <div className="workspace-page process-page">
      <AppHeader view="process" setView={setView} saved />
      <div className="workspace-shell">
        <aside className="process-sidebar">
          <div className="sidebar-project"><span>PROJECT</span><strong>{selectedCompany ? company : "새 리서치"}</strong><small>{selectedCompany ? "기업 선택 완료 · 분석 기준 입력 중" : "기업을 선택해주세요"}</small></div>
          <div className="sidebar-progress"><div><span>전체 진행률</span><strong>{Math.round(((step + 1) / 13) * 100)}%</strong></div><i><b style={{ height: `${((step + 1) / 13) * 100}%` }} /></i></div>
          <nav className="step-nav" aria-label="리서치 단계">
            {processSteps.map((item, index) => (
              <button key={item.no} className={`${step === index ? "active" : ""} ${step > index ? "done" : ""}`} onClick={() => setStep(index)}>
                <i>{step > index ? "✓" : item.no}</i><span><strong>{item.title}</strong><small>{item.short}</small></span>{step === index && <b />}
              </button>
            ))}
          </nav>
          <button className="flow-map-button"><span>⌘</span>전체 흐름 보기</button>
        </aside>
        <main className="process-main">
          <ProcessContent step={step} company={company} setCompany={setCompany} reportMode={reportMode} setReportMode={setReportMode} setView={setView} />
        </main>
      </div>
      <div className="bottom-action-bar">
        <button className="secondary-action" onClick={() => step === 0 ? setView("home") : setStep(step - 1)}>← {step === 0 ? "홈으로" : "이전"}</button>
        <div><span><i /> 모든 변경사항이 저장되었습니다</span><button>임시 저장</button><button className="primary-action" disabled={!canNext || step === 12} onClick={() => setStep(Math.min(step + 1, 12))}>{step === 0 ? "프로젝트 만들기" : "다음"} <b>→</b></button></div>
      </div>
    </div>
  );
}

function MiniChart({ type }: { type: string }) {
  if (type === "bar") return <div className="mini-chart bars"><i style={{ height: "36%" }} /><i style={{ height: "54%" }} /><i style={{ height: "48%" }} /><i style={{ height: "72%" }} /><i style={{ height: "84%" }} /></div>;
  if (type === "area") return <div className="mini-chart"><svg viewBox="0 0 180 70" preserveAspectRatio="none"><path className="area-fill" d="M0 60 L30 52 L60 57 L90 35 L120 42 L150 20 L180 10 L180 70 L0 70 Z" /><path d="M0 60 L30 52 L60 57 L90 35 L120 42 L150 20 L180 10" /></svg></div>;
  if (type === "combo") return <div className="mini-chart combo"><div className="combo-bars"><i style={{ height: "30%" }} /><i style={{ height: "47%" }} /><i style={{ height: "42%" }} /><i style={{ height: "64%" }} /><i style={{ height: "78%" }} /></div><svg viewBox="0 0 180 70" preserveAspectRatio="none"><path d="M0 55 L40 50 L80 42 L120 28 L180 16" /></svg></div>;
  return <div className="mini-chart"><svg viewBox="0 0 180 70" preserveAspectRatio="none"><path d="M0 58 L30 45 L60 49 L90 31 L120 39 L150 21 L180 12" /><circle cx="90" cy="31" r="3" /></svg></div>;
}

function ChartStudio({ selected, setSelected, onClose }: { selected: string; setSelected: (chart: string) => void; onClose: () => void }) {
  const [file, setFile] = useState("");
  const [prompt, setPrompt] = useState("최근 8개 분기의 사업부별 매출액을 막대로, 영업이익률을 선으로 표시하고 추정치는 점선으로 구분해줘.");
  const [applied, setApplied] = useState(false);
  const options = [["bar", "사업부별 매출 누적 막대", "최근 8개 분기 제품 믹스 비교"], ["combo", "매출액·영업이익률 혼합", "실적 규모와 수익성을 함께 확인"], ["line", "실적 vs 컨센서스", "발표치와 시장 기대치의 괴리 비교"], ["area", "12M Forward PER 밴드", "과거 밸류에이션 범위와 현재 위치"]];
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="chart-studio-modal">
        <div className="modal-header"><div><p>AI CHART STUDIO</p><h2>표·차트 만들기</h2><span>데이터와 원하는 표현을 알려주면 보고서에 적합한 형식을 제안합니다.</span></div><button onClick={onClose} aria-label="닫기">×</button></div>
        <div className="chart-studio-grid">
          <section>
            <label className="data-drop"><input type="file" accept=".csv,.xlsx,.xls,.png,.jpg" onChange={(e) => setFile(e.target.files?.[0]?.name || "")} /><div>＋</div><strong>{file || "이미지·표·CSV 첨부"}</strong><span>{file ? "데이터 열 6개 · 행 24개 인식" : "파일을 끌어놓거나 선택하세요"}</span>{file && <Status>분석 완료</Status>}</label>
            <label className="prompt-area"><span>어떻게 표현할까요?</span><textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} /><button onClick={() => setApplied(true)}>✦ 그래프 제안 받기</button></label>
            <div className="chart-tip"><span>i</span><p>수치는 원본 파일과 다시 대조하며, 차트 아래에 파일명과 셀 범위가 자동 표시됩니다.</p></div>
          </section>
          <section className="chart-suggestions"><div className="suggestion-title"><div><h3>추천 그래프 {applied ? "4개를 새로 만들었습니다" : "4개"}</h3><p>데이터 특성과 보고서 맥락을 기준으로 정렬</p></div><Status tone="blue">AI 제안</Status></div>
            <div className="chart-option-grid">{options.map(([value, title, copy], index) => <button className={selected === value ? "chart-option selected" : "chart-option"} key={value} onClick={() => setSelected(value)}><span className="recommend-label">{index === 3 ? "추천" : `0${index + 1}`}</span><MiniChart type={value} /><strong>{title}</strong><small>{copy}</small><i>{selected === value ? "✓ 선택됨" : "미리보기"}</i></button>)}</div>
          </section>
        </div>
        <div className="modal-footer"><button className="secondary-action" onClick={onClose}>취소</button><button className="primary-action" onClick={onClose}>선택한 그래프 적용 <b>→</b></button></div>
      </div>
    </div>
  );
}

function SourcePanel({ source, onClose }: { source: string; onClose: () => void }) {
  return (
    <aside className="source-panel">
      <div className="source-panel-header"><div><p>EVIDENCE</p><h3>연결된 근거</h3></div><button onClick={onClose}>×</button></div>
      <div className="source-priority"><Status>공식 원문</Status><span>우선순위 1</span></div>
      <h4>{source || "DART 잠정실적"}</h4>
      <dl><div><dt>발행기관</dt><dd>금융감독원 DART</dd></div><div><dt>공시일</dt><dd>2026.07.16</dd></div><div><dt>원문 위치</dt><dd>잠정실적 · 표 1 · 영업이익</dd></div></dl>
      <div className="source-quote"><span>원문 하이라이트</span><p>“2026년 2분기 연결 기준 매출액 2조 8,420억원, 영업이익 2,380억원…”</p></div>
      <div className="cross-check"><span>교차 검증</span><div><i>✓</i><p><b>DART 공시</b><small>2,380억원 · 일치</small></p></div><div><i>✓</i><p><b>표준 모델 Excel</b><small>03_Historical!F12 · 일치</small></p></div></div>
      <button className="source-open">원문에서 확인 ↗</button>
    </aside>
  );
}

function FinalCheck({ checks, setChecks, onClose, onConfirm }: { checks: boolean[]; setChecks: (checks: boolean[]) => void; onClose: () => void; onConfirm: () => void }) {
  const rows = [["숫자 검증", "42개", "보고서 숫자와 Excel·공식 원문 일치"], ["출처 연결", "18개", "모든 핵심 주장에 원문 위치 연결"], ["문서 검증", "통과", "전 분기 문장·깨진 표·빈 영역 없음"], ["최신성 확인", "오늘", "기준일 이후 신규 공시 없음"]];
  return (
    <div className="modal-backdrop">
      <div className="final-check-modal">
        <div className="modal-header"><div><p>FINAL REVIEW</p><h2>내보내기 전 최종 점검</h2><span>자동 검증 결과를 확인하고, 사용자가 직접 판단해야 하는 항목을 마지막으로 승인해주세요.</span></div><button onClick={onClose}>×</button></div>
        <div className="review-score"><div className="score-ring"><strong>98</strong><span>/ 100</span></div><div><Status>내보내기 가능</Status><h3>차단 오류 없이 검증을 통과했습니다.</h3><p>경고 1건은 사용자가 확인한 예외로 처리되었습니다.</p></div></div>
        <div className="review-grid">{rows.map((row) => <div key={row[0]}><i>✓</i><span><strong>{row[0]}</strong><small>{row[2]}</small></span><b>{row[1]}</b></div>)}</div>
        <div className="manual-checks"><h3>사용자 최종 승인</h3>{[
          "최종 투자의견과 목표주가를 확인했습니다.",
          "미래 실적 가정과 주요 리스크를 확인했습니다.",
          "보고서 문장과 표·차트의 내용을 최종 검토했습니다.",
        ].map((label, index) => <label key={label}><input type="checkbox" checked={checks[index]} onChange={() => setChecks(checks.map((value, i) => i === index ? !value : value))} /><i>{checks[index] ? "✓" : ""}</i><span>{label}</span></label>)}</div>
        <div className="final-warning"><span>!</span><p>최종본을 확정한 뒤에는 수정 시 검증을 다시 실행해야 합니다.</p></div>
        <div className="modal-footer"><button className="secondary-action" onClick={onClose}>보고서로 돌아가기</button><button className="primary-action" disabled={!checks.every(Boolean)} onClick={onConfirm}>최종본 확정 완료 <b>→</b></button></div>
      </div>
    </div>
  );
}

function ExportPanel({ onClose }: { onClose: () => void }) {
  const download = (type: string) => {
    const content = type === "Excel" ? "항목,2026 2Q,2026 3Q(E)\n매출액,28420,30120\n영업이익,2380,2650" : "REFLO · 삼성전기 2Q26 Earnings Review\n최종본이 확정된 프로토타입 내보내기 파일입니다.";
    const blob = new Blob([content], { type: type === "Excel" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `Samsung_Electro_Mechanics_2Q26_${type}.${type === "Excel" ? "csv" : "txt"}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="export-panel">
      <div className="export-panel-head"><div><Status>최종본 확정</Status><h2>보고서를 내보낼 준비가 됐습니다.</h2><p>보고서와 업데이트된 데이터를 각각 내려받을 수 있습니다.</p></div><button onClick={onClose}>×</button></div>
      <div className="export-cards">{[["Word", "DOCX", "편집 가능한 보고서"], ["PDF", "PDF", "발간용 최종 문서"], ["Excel", "XLSX", "업데이트 데이터·수식"]].map(([type, ext, copy]) => <button key={type} onClick={() => download(type)}><div className={`file-icon ${type.toLowerCase()}`}>{type.slice(0, 1)}</div><span><strong>{type} 보고서</strong><small>{copy}</small></span><b>.{ext} ↓</b></button>)}</div>
      <div className="export-meta"><span>파일 기준일 2026.07.17</span><span>검증 점수 98/100</span><span>최종 확정 21:42</span></div>
    </div>
  );
}

function ReportPage({ setView }: { setView: (view: View) => void }) {
  const [editMode, setEditMode] = useState(false);
  const [sections, setSections] = useState(initialSections);
  const [source, setSource] = useState("");
  const [chartStudio, setChartStudio] = useState(false);
  const [chartType, setChartType] = useState("combo");
  const [selectionText, setSelectionText] = useState("");
  const [selectionPrompt, setSelectionPrompt] = useState("");
  const [selectionPosition, setSelectionPosition] = useState({ left: 420, top: 180 });
  const [paragraphId, setParagraphId] = useState("");
  const [paragraphPrompt, setParagraphPrompt] = useState("");
  const [finalCheck, setFinalCheck] = useState(false);
  const [checks, setChecks] = useState([false, false, false]);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState("");
  const selectionRange = useRef<Range | null>(null);

  const activeParagraph = useMemo(() => sections.find((item) => item.id === paragraphId), [sections, paragraphId]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const handleSelection = () => {
    if (!editMode) return;
    const selected = window.getSelection();
    const text = selected?.toString().trim() || "";
    if (!selected || !text || selected.rangeCount === 0) {
      setSelectionText("");
      return;
    }
    const range = selected.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    selectionRange.current = range.cloneRange();
    setSelectionText(text);
    setSelectionPosition({ left: Math.max(280, Math.min(window.innerWidth - 360, rect.left + rect.width / 2 - 180)), top: Math.min(window.innerHeight - 110, rect.bottom + 10) });
  };

  const rewriteSelection = () => {
    const range = selectionRange.current;
    if (!range || !selectionText) return;
    let replacement = selectionText;
    if (selectionPrompt.includes("간결")) replacement = selectionText.replace(/것으로 예상한다/g, "전망이다").replace(/이어질 전망이다/g, "지속될 전망이다");
    else if (selectionPrompt.includes("수치")) replacement = `${selectionText} (2026년 2분기 공식 공시 기준)`;
    else replacement = `${selectionText.replace(/예상한다/g, "전망한다")}`;
    range.deleteContents();
    range.insertNode(document.createTextNode(replacement));
    window.getSelection()?.removeAllRanges();
    setSelectionText("");
    setSelectionPrompt("");
    showToast("선택한 문장을 AI가 수정했습니다.");
  };

  const applyParagraphRewrite = () => {
    if (!activeParagraph) return;
    setSections((current) => current.map((item) => item.id === activeParagraph.id ? { ...item, text: item.rewrite } : item));
    setParagraphId("");
    setParagraphPrompt("");
    showToast("문단 전체를 수정하고 출처 연결을 유지했습니다.");
  };

  return (
    <div className="workspace-page report-page">
      <AppHeader view="report" setView={setView} saved />
      <div className="report-toolbar">
        <div><button className="back-to-process" onClick={() => setView("process")}>← Process</button><span className="divider" /><div className="report-title-meta"><strong>삼성전기 2Q26 Earnings Review</strong><span>마지막 저장 1분 전</span></div></div>
        <div className="toolbar-center"><button aria-label="실행 취소">↶</button><button aria-label="다시 실행">↷</button><i /><button>A−</button><span>100%</span><button>A+</button></div>
        <div><button className="source-toggle-button" onClick={() => setSource("DART 잠정실적")}>⌘ 근거 보기</button><button className={`edit-toggle ${editMode ? "active" : ""}`} onClick={() => { setEditMode(!editMode); setSelectionText(""); }}><i>{editMode ? "✓" : "✎"}</i>{editMode ? "편집 중" : "편집 모드"}</button><button className="confirm-button" onClick={() => setFinalCheck(true)}>최종본 확정</button></div>
      </div>

      <div className={`report-shell ${source ? "source-open" : ""}`}>
        <aside className="report-outline">
          <div className="outline-head"><span>REPORT OUTLINE</span><button>＋</button></div>
          <nav>
            <a href="#summary" className="active"><i>01</i><span>Investment Summary<small>핵심 요약</small></span></a>
            <a href="#earnings"><i>02</i><span>Earnings Review<small>2분기 실적 분석</small></span></a>
            <a href="#outlook"><i>03</i><span>Outlook<small>하반기 전망</small></span></a>
            <a href="#valuation"><i>04</i><span>Valuation<small>목표주가 산정</small></span></a>
            <a href="#risk"><i>05</i><span>Risk<small>핵심 리스크</small></span></a>
          </nav>
          <div className="outline-status"><span>보고서 완성도</span><strong>92%</strong><i><b /></i><p><em>✓</em> 숫자 검증 완료</p><p><em>✓</em> 출처 18개 연결</p><p><em className="warning">!</em> 사용자 최종 승인 필요</p></div>
        </aside>

        <main className="report-workarea" onMouseUp={handleSelection}>
          {!editMode && <div className="view-mode-notice"><span>보기 모드</span> 출처를 눌러 원문을 확인하세요. 내용을 수정하려면 <button onClick={() => setEditMode(true)}>편집 모드</button>를 켜주세요.</div>}
          {editMode && <div className="edit-mode-notice"><span>✦</span><p><strong>편집 모드가 켜졌습니다.</strong> 텍스트를 드래그해 AI로 수정하거나 문단의 AI 버튼을 사용하세요.</p></div>}
          <article className={`report-document ${editMode ? "is-editing" : ""}`}>
            <div className="report-a4-page report-cover-page">
            <header className="document-cover pdf-report-cover" contentEditable={editMode} suppressContentEditableWarning>
              <aside className="pdf-cover-rail"><div className="rail-brand"><img src="/reflo-logo.svg" alt=""/><strong>REFLO</strong></div><p>Equity Research<br/>2026. 7. 17</p><dl><div><dt>투자의견</dt><dd>BUY</dd></div><div><dt>목표주가</dt><dd>198,000원</dd></div><div><dt>현재주가</dt><dd>159,000원</dd></div><div><dt>상승여력</dt><dd>24.5%</dd></div></dl><div className="rail-metrics"><span>영업이익(26F)<b>9,620억원</b></span><span>EPS(26F)<b>13,200원</b></span><span>P/E(26F)<b>15.0배</b></span><span>시가총액<b>11.9조원</b></span></div><div className="rail-price-chart"><i/><i/><i/><i/><i/><svg viewBox="0 0 120 50"><path d="M0 44 L20 39 L38 42 L56 30 L76 26 L98 14 L120 19"/></svg></div></aside>
              <main className="pdf-cover-main"><div className="cover-meta"><span>009150 · IT 하드웨어</span><time>2Q26 Review</time></div><h1>삼성전기</h1><h2>AI 서버 수요가 이끄는<br/><em>수익성 개선의 시작</em></h2><section className="cover-thesis"><div><b>컨센서스를 웃돈 2분기 실적</b><p>영업이익 2,380억원으로 시장 기대치를 7.7% 상회했다. 고부가 MLCC 제품 믹스와 환율이 수익성 개선을 이끌었다.</p></div><div><b>AI 서버향 수요 확대</b><p>북미 데이터센터 투자가 고용량 MLCC와 FCBGA 수요를 지지한다. 하반기 출하량과 ASP 개선을 전망한다.</p></div><div><b>목표주가 198,000원, BUY 유지</b><p>12M Forward EPS 13,200원에 Target PER 15.0배를 적용했다.</p></div></section><div className="cover-financials"><span>결산(12월)</span>{["2024","2025","2026F","2027F","2028F"].map(y=><b key={y}>{y}</b>)}<span>매출액(십억원)</span>{["10,248","10,842","11,568","12,421","13,106"].map(v=><i key={v}>{v}</i>)}<span>영업이익(십억원)</span>{["735","821","962","1,085","1,214"].map(v=><i key={v}>{v}</i>)}<span>EPS(원)</span>{["9,840","10,720","13,200","14,460","15,380"].map(v=><i key={v}>{v}</i>)}<span>P/E(배)</span>{["16.2","14.8","12.0","11.0","10.3"].map(v=><i key={v}>{v}</i>)}</div></main>
            </header>
            <footer className="document-footer"><span>REFLO Research Workspace</span><p>Equity Research · 2026. 7. 17</p><b>01</b></footer>
            </div>

            <div className="report-a4-page report-content-page">
            {sections.slice(0, 2).map((section) => (
              <section id={section.id} className="report-section editable-block" key={section.id}>
                <div className="block-heading"><div contentEditable={editMode} suppressContentEditableWarning><p>{section.eyebrow}</p><h2>{section.title}</h2></div>{editMode && <button contentEditable={false} className="paragraph-ai" onClick={() => setParagraphId(section.id)}><span>✦</span> AI 수정</button>}</div>
                <p className="editable-text" contentEditable={editMode} suppressContentEditableWarning onBlur={(e) => setSections((current) => current.map((item) => item.id === section.id ? { ...item, text: e.currentTarget.textContent || item.text } : item))}>{section.text}</p>
                <button className="source-chip citation-marker" contentEditable={false} onClick={() => setSource(section.source)}><span>[{section.citation}]</span> 출처 확인</button>
              </section>
            ))}
            <footer className="document-footer"><span>REFLO Research Workspace</span><p>삼성전기 · 2Q26 Earnings Review</p><b>02</b></footer>
            </div>

            <div className="report-a4-page report-content-page">
            {sections.slice(2).map((section) => (
              <section id={section.id} className="report-section editable-block" key={section.id}>
                <div className="block-heading"><div contentEditable={editMode} suppressContentEditableWarning><p>{section.eyebrow}</p><h2>{section.title}</h2></div>{editMode && <button contentEditable={false} className="paragraph-ai" onClick={() => setParagraphId(section.id)}><span>✦</span> AI 수정</button>}</div>
                <p className="editable-text" contentEditable={editMode} suppressContentEditableWarning onBlur={(e) => setSections((current) => current.map((item) => item.id === section.id ? { ...item, text: e.currentTarget.textContent || item.text } : item))}>{section.text}</p>
                <button className="source-chip citation-marker" contentEditable={false} onClick={() => setSource(section.source)}><span>[{section.citation}]</span> 출처 확인</button>
              </section>
            ))}
            <section className="report-section metric-section" contentEditable={editMode} suppressContentEditableWarning>
              <div className="block-heading"><div><p>KEY FINANCIALS</p><h2>분기 실적 및 전망</h2></div>{editMode && <button className="paragraph-ai" onClick={() => setParagraphId("earnings")}><span>✦</span> AI 수정</button>}</div>
              <div className="financial-table"><div><span>(십억원)</span><b>2Q25</b><b>1Q26</b><b>2Q26</b><b>YoY</b><b>컨센서스</b></div>{[["매출액", "2,580", "2,742", "2,842", "+10.2%", "2,795"], ["영업이익", "207", "221", "238", "+14.8%", "221"], ["영업이익률", "8.0%", "8.1%", "8.4%", "+0.4%p", "7.9%"]].map((row) => <div key={row[0]}>{row.map((cell, i) => i === 0 ? <span key={cell}>{cell}</span> : <b key={i} className={i === 3 ? "highlight" : ""}>{cell}</b>)}</div>)}</div>
              <button className="source-chip citation-marker" contentEditable={false} onClick={() => setSource("DART 잠정실적 · 표준 모델 Excel")}><span>[4]</span> 출처 확인</button>
            </section>
            <footer className="document-footer"><span>REFLO Research Workspace</span><p>삼성전기 · 2Q26 Earnings Review</p><b>03</b></footer>
            </div>

            <div className="report-a4-page report-content-page">
            <section className={`report-section chart-block ${editMode ? "clickable" : ""}`} onClick={() => editMode && setChartStudio(true)}>
              <div className="block-heading"><div><p>CHART 01</p><h2>MLCC 매출과 영업이익률 추이</h2></div>{editMode && <button className="chart-edit-button">＋ 데이터·차트 변경</button>}</div>
              <div className="large-chart">
                <div className="chart-y-axis"><span>1,400</span><span>1,050</span><span>700</span><span>350</span><span>0</span></div>
                <div className="chart-plot"><div className="grid-lines"><i /><i /><i /><i /><i /></div><div className="main-bars">{[48, 54, 57, 66, 74, 81].map((height, index) => <div key={index}><i style={{ height: `${height}%` }} /><span>{["1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26"][index]}</span></div>)}</div><svg viewBox="0 0 600 210" preserveAspectRatio="none"><path d="M40 160 C120 153,130 145,150 141 S230 130,260 120 S340 104,370 90 S470 65,560 38" /><circle cx="560" cy="38" r="6" /></svg><span className="chart-callout">8.4%</span></div>
              </div>
              <div className="chart-legend"><span><i className="bar-key" />MLCC 매출 (십억원)</span><span><i className="line-key" />영업이익률 (%)</span></div>
              <button className="source-chip citation-marker" onClick={(e) => { e.stopPropagation(); setSource("기업 IR p.6 · Excel 원본 데이터"); }}><span>[5]</span> 출처 확인</button>
              {editMode && <div className="chart-hover-hint"><span>✦</span>클릭해 이미지·표·CSV를 넣고 그래프 형식을 제안받으세요.</div>}
            </section>

            <section id="valuation" className="report-section valuation-report-section" contentEditable={editMode} suppressContentEditableWarning><div className="block-heading"><div><p>03 VALUATION</p><h2>Target PER 15.0배 적용</h2></div>{editMode && <button contentEditable={false} className="paragraph-ai" onClick={() => setParagraphId("outlook")}><span>✦</span> AI 수정</button>}</div><div className="valuation-summary"><div><span>12M Fwd. EPS</span><strong>13,200원</strong></div><i>×</i><div><span>Target PER</span><strong>15.0배</strong></div><i>=</i><div className="target"><span>목표주가</span><strong>198,000원</strong></div></div><button contentEditable={false} className="source-chip citation-marker" onClick={() => setSource("Excel Calculation Tree")}><span>[6]</span> 출처 확인</button></section>
            <section id="risk" className="report-section risk-section" contentEditable={editMode} suppressContentEditableWarning><p>KEY RISKS</p><div><span>01</span><p><strong>스마트폰 수요 회복 지연</strong>중화권 스마트폰 출하량의 회복 속도가 예상보다 완만할 수 있다.</p></div><div><span>02</span><p><strong>원재료 가격·환율 변동</strong>원가 상승과 원화 강세는 하반기 수익성 개선 폭을 제한할 수 있다.</p></div></section>
            <footer className="document-footer"><span>REFLO Research Workspace</span><p>본 문서는 프로토타입용 예시 데이터로 작성되었습니다.</p><b>04</b></footer>
            </div>
          </article>
        </main>
        {source && <SourcePanel source={source} onClose={() => setSource("")} />}
      </div>

      {selectionText && editMode && <div className="selection-toolbar" style={{ left: selectionPosition.left, top: selectionPosition.top }}><div><span>✦</span><input autoFocus value={selectionPrompt} onChange={(e) => setSelectionPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && rewriteSelection()} placeholder="선택한 문장을 어떻게 수정할까요?" /><button onMouseDown={(e) => e.preventDefault()} onClick={rewriteSelection}>AI 수정</button></div><p>“{selectionText.slice(0, 46)}{selectionText.length > 46 ? "…" : ""}”</p></div>}
      {paragraphId && activeParagraph && <div className="ai-drawer"><div className="ai-drawer-head"><div><span>✦</span><p><b>문단 전체 AI 수정</b><small>출처 연결은 그대로 유지됩니다.</small></p></div><button onClick={() => setParagraphId("")}>×</button></div><div className="ai-target"><span>수정할 문단</span><p>{activeParagraph.title}</p></div><label><span>수정 요청</span><textarea autoFocus value={paragraphPrompt} onChange={(e) => setParagraphPrompt(e.target.value)} placeholder="예: 더 간결하게, 수치 중심으로 바꿔줘" /></label><div className="quick-prompts">{["더 간결하게", "수치 중심으로", "리스크를 강조", "내 문체로 변경"].map((text) => <button key={text} onClick={() => setParagraphPrompt(text)}>{text}</button>)}</div><button className="ai-apply" onClick={applyParagraphRewrite}>✦ 문단 수정하기</button></div>}
      {chartStudio && <ChartStudio selected={chartType} setSelected={setChartType} onClose={() => { setChartStudio(false); showToast("선택한 그래프를 보고서에 적용했습니다."); }} />}
      {finalCheck && <FinalCheck checks={checks} setChecks={setChecks} onClose={() => setFinalCheck(false)} onConfirm={() => { setFinalCheck(false); setExportOpen(true); }} />}
      {exportOpen && <ExportPanel onClose={() => setExportOpen(false)} />}
      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState("");
  const [reportMode, setReportMode] = useState("");

  if (view === "process") return <PlannedProcessPage setView={setView} step={step} setStep={setStep} company={company} setCompany={setCompany} reportMode={reportMode} setReportMode={setReportMode} />;
  if (view === "report") return <ReportPage setView={setView} />;
  if (view === "projects") return <ProjectsPage setView={setView} setStep={setStep} />;
  return <HomePage setView={setView} setStep={setStep} />;
}
