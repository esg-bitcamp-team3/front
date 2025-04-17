# ESG 대시보드 프로젝트


### 개요
이 프로젝트는 기업들이 배출 데이터를 효율적으로 관리하고 분석할 수 있도록 돕는 ESG(환경, 사회, 지배구조) 대시보드를 제공합니다. 배출 데이터의 시각화, 입력 및 수정 기능뿐만 아니라 기업 및 사업장 관리와 관련된 다양한 기능을 제공합니다.


### 기술 스택
- **백엔드:** Node.js, Express, Mongoose
- **프론트엔드:** Next.js
- **데이터 분석 및 관리:** Chart.js, Handsontable


### 주요 기능
- **기업 배출 데이터 대시보드:** 기업별 배출 데이터를 시각화하여 쉽게 분석하고 인사이트를 도출할 수 있습니다.
- **배출 데이터 관리:** 배출 유형에 따라 데이터를 입력하고 수정할 수 있습니다.
- **수정 이력 관리:** 배출 데이터의 수정 이력을 조회하여 변경사항을 추적할 수 있습니다.
- **사업장 관리:** 각 기업 내 사업장들을 관리할 수 있는 기능을 제공합니다.
- **기업 관리:** 기업 정보를 관리할 수 있습니다.
- **배출 계수 및 계산식:** 배출 계산에 필요한 계수와 계산식을 조회할 수 있습니다.


### 페이지 상세 설명
1. **랜딩 페이지**

   ![image](https://github.com/user-attachments/assets/b25f8b05-a95b-4902-8555-e080f2c3f3f8)

   

3. **로그인 및 회원가입 페이지**  
   로그인 및 회원가입 페이지입니다.

   ![image](https://github.com/user-attachments/assets/91ad962f-3716-4e60-a7a4-014a49c41668)

   회원가입 시에는 제공된 기업 코드를 통해 특정 기업의 관리자로 회원가입 할 수 있습니다.

   ![image](https://github.com/user-attachments/assets/c779f620-db7b-4a6f-ac2a-c7aa87df8281)

   

5. **기업 대시보드 페이지**  
   기업별 배출 데이터를 시각화하여 대시보드 형태로 보여주며, 데이터를 빠르게 분석하고 관리할 수 있는 기능을 제공합니다.
   
   ![image](https://github.com/user-attachments/assets/e695fa53-a09b-40ff-9a22-129b5213a408)

   기업 정보와 사업장별 배출량을 조회할 수 있습니다.

   온실가스 배출량의 추이와 매출 추이를 시각적으로 확인할 수 있습니다.

   연간 매출당 배출량, 총 배출량, 해당 월의 배출량을 확인하고, 각 항목의 증감률을 함께 보여줍니다.

   Scope별 배출량을 원그래프 형식으로 시각화하여 확인할 수 있습니다.

   목표 감축량을 설정할 수 있습니다. 목표 감축량은 전년도 배출량 대비 감축 비율로 설정되며, 전년도 배출량을 초과한 경우 "목표 감축률을 달성하지 못했습니다"라는 메시지와 함께 초과된 배출량을 표시합니다. 반대로 목표를 달성한 경우, 달성도를 시각화하여 보여줍니다.

   ![image](https://github.com/user-attachments/assets/ed1f3f18-c98e-4ec5-b1b8-aebe368e1681)

  목표 감축량을 달성한 경우는 다음과 같이 표시됩니다.


   ![image](https://github.com/user-attachments/assets/a3e2ceb0-0780-476a-b732-d62019798403)

  

6. **사업장 페이지**  
   기업의 각 사업장에 대한 정보를 관리하고, 각 사업장에서 발생하는 배출 데이터를 추적할 수 있습니다.

  ![image](https://github.com/user-attachments/assets/857a73ec-4ad8-474f-9909-d644b4b49524)


   사업장명과 업종으로 검색하여 사업장을 조회할 수 있습니다.

   사업장명, 대표자, 사업자 등록 번호 등을 입력하여 사업장을 추가할 수 있습니다.

   ![image](https://github.com/user-attachments/assets/c506f45a-738f-4c7f-a80b-a5b7cd240907)


7. **사업장 세부 페이지**

   사업장 세부 정보를 확인할 수 있으며 사업장을 수정 및 삭제할 수 있습니다.
  
   ![image](https://github.com/user-attachments/assets/ae39d30e-45df-468c-af12-6a64224fc842)


   ![image](https://github.com/user-attachments/assets/779dc41a-b800-46b8-8a0e-9f96bb48389a)

   배출 데이터를 년도별로 분석하는 도구를 제공합니다.
   배출 데이터의 유형 별로 배출량과 증감률을 확인할 수 있으며 월별 배출량 추이를 확인할 수 있습니다. 

   ![image](https://github.com/user-attachments/assets/4b0b276a-9f8a-4d9f-b70e-99285fe0459e)


9. **배출 데이터 페이지**  

   사업장별로 데이터를 조회할 수 있습니다.

   ![image](https://github.com/user-attachments/assets/11c500ac-be57-468d-906e-d4d9292446e8)


11. **배출 데이터 입력 페이지**  

    새로운 배출 데이터를 입력할 수 있습니다. 대량의 데이터를 편집하고 입력할 수 있습니다. 

    ![image](https://github.com/user-attachments/assets/f6f483ca-f50a-42c0-8add-356715148342)

    활동자료 및 배출활동은 배출 유형별로 선택할 수 있습니다. 

    입력 칸에 유효하지 않은 데이터를 입력할 경우 경고 메세지가 표시됩니다.


13. **배출 데이터 수정 페이지**  

  기존에 입력된 배출 데이터를 수정할 수 있습니다.

  ![image](https://github.com/user-attachments/assets/111a3349-1b0c-4917-9788-15c62858dd14)

  수정된 데이터의 개수가 아래 표시됩니다. 수정된 데이터는 수정 이력에 기록됩니다.

  데이터를 선택해서 삭제할 수 있습니다.

  ![image](https://github.com/user-attachments/assets/0b722d9d-8db2-40db-accc-f44e8ea7d2df)
  

14. **기업 정보 페이지**  
   기업의 기본 정보와 관련된 데이터를 관리하는 페이지입니다.

  ![image](https://github.com/user-attachments/assets/c6ab85c4-49dc-409d-a5d6-37e430dddd13)

  사업장 정보가 표시되며 사업장별로 배출량과 전년도 대비 증감률을 확인할 수 있습니다.

  ![image](https://github.com/user-attachments/assets/5c181925-a10e-4bb6-86eb-23fe165b2838)

  사업장 세부 정보를 조회할 수 있으며 세부 페이지로 이동할 수 있습니다.

  

16. **배출 계수 및 계산식 관련 페이지**  
   배출 계산에 필요한 계수와 계산식을 조회할 수 있는 페이지입니다.

  배출 유형 별로 배출량 도출에 사용된 계산식과 연료별 발열량 및 배출 계수를 확인할 수 있습니다.

  ![image](https://github.com/user-attachments/assets/a9311680-a53d-47df-accf-e2973ea84d9b)



17. **유저 페이지**  
   사용자의 프로필 정보 및 관련 설정을 관리할 수 있는 페이지입니다. 하단의 사이드 바를 통해 이동할 수 있습니다.

    ![image](https://github.com/user-attachments/assets/370ddfc2-0d5e-488f-8c28-f8824db8e8dd)


    수정 이력을 확인할 수 있습니다.

    ![image](https://github.com/user-attachments/assets/a43bc7c3-f2d9-4f24-869a-f1b8ab9b2ce3)


### 프로젝트 특징

- **사용자 친화적인 UI:** Handsontable을 활용하여 데이터를 표 형식으로 직관적으로 관리하고 수정할 수 있습니다.
  
- **유연한 데이터 관리:** 배출 데이터를 관리하고 수정 내역을 확인할 수 있습니다.
  
- **확장성:** 프로젝트는 향후 다른 ESG 관련 데이터를 추가하거나, 더 많은 분석 도구를 추가할 수 있도록 설계되었습니다.


