# REFLO 로컬 실행 패키지

현재 `reflo-research-workspace` 사이트를 기준으로 만든 로컬 실행용 패키지입니다.

## 폴더 구성

- `static-html/`: HTML, CSS, JavaScript, 폰트, SVG가 포함된 완성된 정적 실행본
- `source-react/`: 화면과 인터랙션을 수정할 수 있는 React 원본 프로젝트

## 가장 간단하게 실행하기

### macOS

`static-html/start-local.command`를 더블클릭합니다. 브라우저에서 `http://localhost:8080`이 열립니다.

처음 실행할 때 macOS가 차단하면 파일을 우클릭한 뒤 **열기**를 선택하세요.

### Windows

`static-html/start-local.bat`을 더블클릭합니다.

### 터미널에서 실행

```bash
cd static-html
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080`을 엽니다. `index.html`을 바로 더블클릭하면 브라우저 보안 정책 때문에 JavaScript 모듈이 정상 실행되지 않을 수 있습니다.

## React 원본 수정하기

Node.js 22 이상이 필요합니다.

```bash
cd source-react
npm install
npm run dev
```

화면 코드는 `source-react/app/page.tsx`, `source-react/app/process.tsx`에 있고, 전체 스타일은 `source-react/app/globals.css`에서 수정할 수 있습니다.
