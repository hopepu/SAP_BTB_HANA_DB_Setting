# SAP HANA Cloud 연결 설정

2024년 12월, CAP 프로젝트를 **SAP HANA Cloud(HDI 컨테이너)**에 연결하는 과정을 연습한 저장소입니다.

- CAP 프로젝트에 HANA 드라이버(`@cap-js/hana`) 추가, 로컬 개발은 SQLite
- `db/src/.hdiconfig`로 HDI 컨테이너 산출물 설정
- `mta.yaml`에 HDI 컨테이너 리소스와 db-deployer 모듈 구성
- CI/CD 파이프라인 설정(`Jenkinsfile`, `.pipeline`)

## 실행
```bash
npm install
cds watch
```

---

현재는 실무 SAP BTP 포털을 개발하고 있습니다. → [sap-btp-portfolio](https://github.com/hopepu/sap-btp-portfolio)
