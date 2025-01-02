// db 폴데어 생성된 cds 파일을 참조
using demo.request from '../db/request';

// 서비스 이름 선언
service RequestService {
// 엔티티 이름 선언 및 구조 정의
    entity Request       as projection on request.Request;
    entity Request_State as projection on request.Request_State;    

}
