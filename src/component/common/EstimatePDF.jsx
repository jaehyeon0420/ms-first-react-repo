import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import '../../common/fonts.js';
import { useState, useEffect } from 'react';
import useUserStore from "../../store/useUserStore"; //Store import

// 한글 폰트 등록 (옵션: 한글이 제대로 표시되려면 필요)
// Font.register({
//   family: 'NanumGothic',
//   src: '/fonts/NanumGothic.ttf'
// });

// PDF 스타일 정의
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'NotoSansKR',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
    padding: 10,
    border: '1px solid #e0e0e0',
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
  },
  regionItem: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  regionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1976d2',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  summary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    fontSize: 12,
  },
  summaryLabel: {
    fontWeight: 'bold',
  },
  summaryValue: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
  table: { display: 'table', width: 'auto', marginBottom: 15, borderStyle: 'solid', borderWidth: 1, borderColor: '#e0e0e0' },
  tableRow: { flexDirection: 'row' },
  tableColHeader: {borderStyle: 'solid', borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#f0f0f0', padding: 5, fontWeight: 'bold' },
  totalColHeader: {borderStyle: 'solid', borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#c9c9c9', padding: 5, fontWeight: 'bold' },
  tableCol: {borderStyle: 'solid', borderWidth: 1, borderColor: '#e0e0e0', padding: 5 },
});

// 숫자를 통화 형식으로 변환
const formatCurrency = (value) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(value);
};

/*
async function fetchImageAsBase64(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const base64String = btoa(
    new Uint8Array(arrayBuffer).reduce((acc, byte) => acc + String.fromCharCode(byte), "")
  );

  return `data:image/jpeg;base64,${base64String}`;
}
*/

// PDF 문서 컴포넌트
export default function EstimatePDF(props){
    const selectedCar = props.selectedCar;
    const estimateResList = props.estimateResList;
    const brokenFileNameList = props.brokenFileNameList;
    const {loginMember} = useUserStore();
    const serverUrl = import.meta.env.VITE_SPRING_CONTAINER_SERVER;

    //발행일자 제작
    const date = new Date();
    const formatted = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);

    // 마지막 점 제거 후 변환
    const toDate = formatted.replace(/\.$/, '').replace(/\./g, '-').replace(/\s/g, '');


    // 총 견적 비용 산출
    const totals = estimateResList.reduce(
        (acc, estimate) => {
            if (estimate.summary) {
            acc.totalMin += estimate.summary.total_min_cost || 0;
            acc.totalRecommended += estimate.summary.total_recommended_cost || 0;
            acc.totalMax += estimate.summary.total_max_cost || 0;
            }
            return acc;
        },
        { totalMin: 0, totalRecommended: 0, totalMax: 0 }
    );
/*
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);
    const [imageDataList, setImageDataList] = useState([]);
    useEffect(() => {
        async function fetchImages() {
            if (!estimateResList || estimateResList.length === 0) return;

            const dataList = await Promise.all(
            estimateResList.map(async (res) => {
                const url = `${serverUrl}/car/broken/${res.image_file.substring(0,8)}/${res.image_file}`;
                const base64 = await fetchImageAsBase64(url);
                return base64;
            })
            );

            setImageDataList(dataList);
            setAllImagesLoaded(true); // 모든 이미지 로딩 완료
        }
        
        fetchImages();
    }, [estimateResList]);
*/
    return (
        <Document>
            <Page size="A4" style={styles.page}>
            {/* 헤더 */}
            <Text style={styles.header}>차량 수리비 예상 견적서</Text>
            <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 10, color : 'red'}}>
                ※ 본 견적서는 AI 기반 자동 분석 결과이며, 실제 수리비와 차이가 있을 수 있습니다. 
            </Text>

            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={{...styles.totalColHeader, width : '17%'}}>차량 소유주</Text>
                    <Text style={{...styles.tableCol, width : '33%'}}>{loginMember.memberName}</Text>
                    <Text style={{...styles.totalColHeader, width : '17%'}}>차량 등록번호</Text>
                    <Text style={{...styles.tableCol, width : '33%'}}>{selectedCar.carNo}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={{...styles.totalColHeader, width : '17%'}}>정비 사업자</Text>
                    <Text style={{...styles.tableCol, width : '33%'}}>(주)Snap Q</Text>
                    <Text style={{...styles.totalColHeader, width : '17%'}}>사업자 등록번호</Text>
                    <Text style={{...styles.tableCol, width : '33%'}}>548-89-37952</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={{...styles.totalColHeader, width : '17%'}}>발행일자</Text>
                    <Text style={{...styles.tableCol, width : '83%'}}>{toDate}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={{...styles.totalColHeader, width : '17%'}}>총 적정 예상 견적</Text>
                    <Text style={{...styles.tableCol, width : '16.333%'}}>{formatCurrency(totals.totalRecommended)}</Text>
                    <Text style={{...styles.totalColHeader, width : '17%'}}>총 최소 예상 견적</Text>
                    <Text style={{...styles.tableCol, width : '16.333%'}}>{formatCurrency(totals.totalMin)}</Text>
                    <Text style={{...styles.totalColHeader, width : '17%'}}>총 최대 예상 견적</Text>
                    <Text style={{...styles.tableCol, width : '16.333%'}}>{formatCurrency(totals.totalMax)}</Text>
                </View>
            </View>

            {/* 각 견적 결과 반복 */}
            {estimateResList.map((estimate, idx) => {
                // regions 합계 계산
                const regionTotals = estimate.regions?.reduce(
                    (acc, region) => {
                    acc.recommended += region.recommended_cost || 0;
                    acc.min += region.min_cost || 0;
                    acc.max += region.max_cost || 0;
                    return acc;
                    },
                    { recommended: 0, min: 0, max: 0 }
                ) || { recommended: 0, min: 0, max: 0 };

                return (
                    <View key={idx} style={{ marginBottom: 30 }}>
                        <Text style={styles.sectionTitle}>
                            견적 #{idx + 1} - {brokenFileNameList[idx]}
                        </Text>

                        {/* 기본 정보 */} 
                        <View style={{...styles.section, flexDirection: 'row', marginBottom: 5 }}>
                            {/* 왼쪽: 두 줄 텍스트 */}
                            <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                {/*
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <Text style={{ ...styles.label, textAlign: 'left', width: '50%' }}>이미지 크기:</Text>
                                    <Text style={{ ...styles.value, textAlign: 'left', width: '50%' }}>{estimate.image_size?.join(' x ')} px</Text>
                                </View>
                                */}
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <Text style={{ ...styles.label, textAlign: 'left', width: '50%' }}>총 감지 영역:</Text>
                                    <Text style={{ ...styles.value, textAlign: 'left', width: '50%' }}>{estimate.total_detections}개</Text>
                                </View>
                            </View>

                            {/* 오른쪽: 이미지, 왼쪽 두 줄과 높이 맞춤 
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                {imageDataList[idx] != null && imageDataList[idx] != '' ?
                                <Image
                                    src={imageDataList[idx]}
                                    style={{ width: 50, height: 50 }}
                                /> : "asdasdasdas"}
                            </View>*/}
                        </View>

                        {/* regions 테이블 */}
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={{...styles.tableColHeader, width: '10%'}}>영역 ID</Text>
                                <Text style={{...styles.tableColHeader, width: '15%'}}>분류</Text>
                                <Text style={{...styles.tableColHeader, width: '15%'}}>신뢰도</Text>
                                <Text style={{...styles.tableColHeader, width: '20%'}}>적정 예상 견적</Text>
                                <Text style={{...styles.tableColHeader, width: '20%'}}>최소 예상 견적</Text>
                                <Text style={{...styles.tableColHeader, width: '20%'}}>최대 예상 견적</Text>
                            </View>

                            {estimate.regions?.map((region, rIdx) => (
                            <View key={rIdx} style={styles.tableRow}>
                                <Text style={{...styles.tableCol, width: '10%'}}>{region.id}</Text>
                                <Text style={{...styles.tableCol, width: '15%'}}>{region.type_kr}</Text>
                                <Text style={{...styles.tableCol, width: '15%'}}>{(region.confidence.model2_conf * 100).toFixed(1)}%</Text>
                                <Text style={{...styles.tableCol, width: '20%'}}>{formatCurrency(region.recommended_cost)}</Text>
                                <Text style={{...styles.tableCol, width: '20%'}}>{formatCurrency(region.min_cost)}</Text>
                                <Text style={{...styles.tableCol, width: '20%'}}>{formatCurrency(region.max_cost)}</Text>
                            </View>
                            ))}

                            {/* regions 합계 row */}
                            <View style={styles.tableRow}>
                                <Text style={{...styles.totalColHeader, width: '40%', textAlign: 'center'}}>총 합계</Text>
                                <Text style={{...styles.tableCol, width: '20%'}}>{formatCurrency(regionTotals.recommended)}</Text>
                                <Text style={{...styles.tableCol, width: '20%'}}>{formatCurrency(regionTotals.min)}</Text>
                                <Text style={{...styles.tableCol, width: '20%'}}>{formatCurrency(regionTotals.max)}</Text>
                            </View>
                        </View>
                    </View>
                );
                })}
            </Page>
        </Document>
    );
}
